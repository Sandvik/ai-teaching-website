import asyncio
import json
import time
from typing import Any, Dict, List, Optional, Callable, Union
import logging
from datetime import datetime
import openai
import anthropic
from anthropic import Anthropic
import tiktoken

from .agent import AIAgent, Message
from .config import config

logger = logging.getLogger(__name__)

class LLMAgent(AIAgent):
    """
    Advanced AI Agent with LLM integration supporting OpenAI GPT and Anthropic Claude models.
    """
    
    def __init__(self, name: str = None, model: str = None):
        name = name or config.get("agent_name", "AI Assistant")
        model = model or config.get("default_model", "gpt-4")
        
        super().__init__(name=name, model=model)
        
        # Initialize LLM clients
        self.openai_client = None
        self.anthropic_client = None
        self._setup_llm_clients()
        
        # Token counting and rate limiting
        self.token_counter = self._get_token_counter()
        self.request_times = []
        self.token_usage = []
        
        # System prompt
        self.system_prompt = self._create_system_prompt()
        
        logger.info(f"LLM Agent initialized with model: {self.model}")
    
    def _setup_llm_clients(self):
        """Setup LLM API clients."""
        try:
            if config.get("openai_api_key"):
                openai.api_key = config.get("openai_api_key")
                self.openai_client = openai.OpenAI(api_key=config.get("openai_api_key"))
                logger.info("OpenAI client initialized")
            
            if config.get("anthropic_api_key"):
                self.anthropic_client = Anthropic(api_key=config.get("anthropic_api_key"))
                logger.info("Anthropic client initialized")
                
        except Exception as e:
            logger.error(f"Error setting up LLM clients: {e}")
    
    def _get_token_counter(self):
        """Get token counting function for the current model."""
        try:
            if self.model.startswith("gpt"):
                return tiktoken.encoding_for_model(self.model)
            else:
                # Approximate token counting for non-OpenAI models
                return None
        except Exception as e:
            logger.warning(f"Could not load token counter for {self.model}: {e}")
            return None
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text."""
        if self.token_counter:
            return len(self.token_counter.encode(text))
        else:
            # Rough approximation: 1 token ≈ 4 characters
            return len(text) // 4
    
    def _create_system_prompt(self) -> str:
        """Create system prompt for the LLM."""
        available_tools = ", ".join(self.get_available_tools())
        
        return f"""You are {self.name}, an intelligent AI assistant with access to various tools and capabilities.

Current configuration:
- Working directory: {self.working_directory}
- Safe mode: {config.get('safe_mode')}
- Available tools: {available_tools}

You can help users with:
1. File operations (reading, writing, listing files)
2. Code execution (Python and shell commands)
3. Mathematical calculations
4. Web search and information retrieval
5. General conversation and problem-solving

When using tools, think step by step:
1. Understand what the user is asking
2. Determine which tools you need to use
3. Execute the tools in the correct order
4. Provide a helpful response based on the results

Always be helpful, accurate, and safe. If asked to do something potentially harmful, explain why you can't do it and suggest alternatives.

Tool Usage Format:
When you need to use a tool, respond with a JSON object like this:
{{"action": "use_tool", "tool": "tool_name", "parameters": {{"param1": "value1", "param2": "value2"}}}}

For regular conversation, just respond normally without the JSON format.
"""
    
    def _check_rate_limits(self) -> bool:
        """Check if we're within rate limits."""
        current_time = time.time()
        
        # Clean old entries (older than 1 minute)
        self.request_times = [t for t in self.request_times if current_time - t < 60]
        self.token_usage = [t for t in self.token_usage if current_time - t["time"] < 60]
        
        # Check request rate limit
        requests_per_minute = len(self.request_times)
        if requests_per_minute >= config.get("rate_limit_requests_per_minute", 60):
            return False
        
        # Check token rate limit
        tokens_this_minute = sum(t["tokens"] for t in self.token_usage)
        if tokens_this_minute >= config.get("rate_limit_tokens_per_minute", 40000):
            return False
        
        return True
    
    def _record_usage(self, tokens_used: int = 0):
        """Record API usage for rate limiting."""
        current_time = time.time()
        self.request_times.append(current_time)
        if tokens_used > 0:
            self.token_usage.append({"time": current_time, "tokens": tokens_used})
    
    async def _call_openai(self, messages: List[Dict[str, str]]) -> str:
        """Call OpenAI API."""
        try:
            response = self.openai_client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=config.get("temperature", 0.7),
                max_tokens=config.get("max_tokens", 2048),
                timeout=config.get("model_timeout", 30)
            )
            
            content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens if response.usage else 0
            self._record_usage(tokens_used)
            
            return content
            
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return f"Error calling OpenAI API: {str(e)}"
    
    async def _call_anthropic(self, messages: List[Dict[str, str]]) -> str:
        """Call Anthropic Claude API."""
        try:
            # Convert messages format for Anthropic
            system_msg = None
            user_messages = []
            
            for msg in messages:
                if msg["role"] == "system":
                    system_msg = msg["content"]
                else:
                    user_messages.append(msg)
            
            response = self.anthropic_client.messages.create(
                model=self.model,
                max_tokens=config.get("max_tokens", 2048),
                temperature=config.get("temperature", 0.7),
                system=system_msg or self.system_prompt,
                messages=user_messages
            )
            
            content = response.content[0].text
            tokens_used = response.usage.input_tokens + response.usage.output_tokens if hasattr(response, 'usage') else 0
            self._record_usage(tokens_used)
            
            return content
            
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            return f"Error calling Anthropic API: {str(e)}"
    
    async def _call_llm(self, user_input: str) -> str:
        """Call the appropriate LLM based on the model."""
        if not self._check_rate_limits():
            return "Rate limit exceeded. Please wait a moment before making another request."
        
        # Prepare messages
        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add conversation history (last few messages)
        for msg in self.conversation_history[-10:]:  # Last 10 messages for context
            messages.append({"role": msg.role, "content": msg.content})
        
        # Add current user input
        messages.append({"role": "user", "content": user_input})
        
        # Call appropriate API
        if self.model.startswith("gpt") and self.openai_client:
            return await self._call_openai(messages)
        elif self.model.startswith("claude") and self.anthropic_client:
            return await self._call_anthropic(messages)
        else:
            return f"Model {self.model} is not supported or API client not configured."
    
    async def _parse_tool_request(self, response: str) -> Optional[Dict[str, Any]]:
        """Parse tool request from LLM response."""
        try:
            # Look for JSON in the response
            start_idx = response.find('{"action"')
            if start_idx == -1:
                return None
            
            end_idx = response.find('}', start_idx)
            if end_idx == -1:
                return None
            
            json_str = response[start_idx:end_idx + 1]
            tool_request = json.loads(json_str)
            
            if tool_request.get("action") == "use_tool":
                return tool_request
            
        except json.JSONDecodeError:
            pass
        
        return None
    
    async def process_message(self, user_input: str) -> str:
        """Process user message with LLM and tool calling."""
        self.add_message("user", user_input)
        
        try:
            # Get response from LLM
            llm_response = await self._call_llm(user_input)
            
            # Check if LLM wants to use a tool
            tool_request = await self._parse_tool_request(llm_response)
            
            if tool_request:
                tool_name = tool_request.get("tool")
                parameters = tool_request.get("parameters", {})
                
                # Execute the tool
                tool_result = self.execute_tool(tool_name, **parameters)
                
                # Get final response from LLM with tool result
                tool_context = f"Tool '{tool_name}' executed with result: {tool_result}"
                final_response = await self._call_llm(f"{user_input}\n\n{tool_context}\n\nPlease provide a final response based on this tool result.")
                
                response = final_response
            else:
                response = llm_response
            
            self.add_message("assistant", response)
            return response
            
        except Exception as e:
            error_msg = f"Error processing message: {str(e)}"
            logger.error(error_msg)
            self.add_message("assistant", error_msg)
            return error_msg
    
    def get_usage_stats(self) -> Dict[str, Any]:
        """Get usage statistics."""
        current_time = time.time()
        
        # Recent usage (last hour)
        recent_requests = [t for t in self.request_times if current_time - t < 3600]
        recent_tokens = [t for t in self.token_usage if current_time - t["time"] < 3600]
        
        return {
            "total_conversations": len(self.conversation_history),
            "requests_last_hour": len(recent_requests),
            "tokens_last_hour": sum(t["tokens"] for t in recent_tokens),
            "available_tools": len(self.tools),
            "model": self.model,
            "rate_limits": {
                "requests_per_minute": config.get("rate_limit_requests_per_minute", 60),
                "tokens_per_minute": config.get("rate_limit_tokens_per_minute", 40000)
            }
        }
    
    def switch_model(self, new_model: str) -> str:
        """Switch to a different model."""
        old_model = self.model
        self.model = new_model
        self.token_counter = self._get_token_counter()
        
        # Update system prompt if needed
        self.system_prompt = self._create_system_prompt()
        
        return f"Switched from {old_model} to {new_model}"

# Example custom tools that can be added to the agent
class WebSearchTool:
    """Enhanced web search tool using Google Custom Search API."""
    
    def __init__(self, api_key: str, search_engine_id: str):
        self.api_key = api_key
        self.search_engine_id = search_engine_id
    
    def search(self, query: str, num_results: int = 5) -> str:
        """Perform web search using Google Custom Search API."""
        try:
            import requests
            
            url = "https://www.googleapis.com/customsearch/v1"
            params = {
                "key": self.api_key,
                "cx": self.search_engine_id,
                "q": query,
                "num": num_results
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if "items" not in data:
                return f"No search results found for: {query}"
            
            results = []
            for item in data["items"]:
                results.append(f"Title: {item['title']}\nURL: {item['link']}\nSnippet: {item['snippet']}\n")
            
            return f"Search results for '{query}':\n\n" + "\n".join(results)
            
        except Exception as e:
            return f"Error performing web search: {str(e)}"

if __name__ == "__main__":
    # Example usage
    async def main():
        agent = LLMAgent(name="Advanced AI Agent")
        
        # Add custom web search tool if configured
        if config.get("google_api_key") and config.get("search_engine_id"):
            web_search = WebSearchTool(
                config.get("google_api_key"),
                config.get("search_engine_id")
            )
            agent.add_tool("web_search_advanced", web_search.search)
        
        print("Advanced AI Agent initialized! Type your message or 'exit' to quit.")
        print(agent.get_system_info())
        print(f"Usage stats: {agent.get_usage_stats()}")
        print("\n" + "="*50 + "\n")
        
        while True:
            try:
                user_input = input(f"{agent.name}> ").strip()
                
                if user_input.lower() in ["exit", "quit", "bye"]:
                    print("Goodbye!")
                    break
                
                if not user_input:
                    continue
                
                response = await agent.process_message(user_input)
                print(f"\n{response}\n")
                
            except KeyboardInterrupt:
                print("\nGoodbye!")
                break
            except Exception as e:
                print(f"Error: {str(e)}")
    
    asyncio.run(main())