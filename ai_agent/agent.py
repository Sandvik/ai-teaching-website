import asyncio
import json
import os
import subprocess
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional, Callable
import logging
from dataclasses import dataclass
import requests
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Message:
    role: str
    content: str
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()

class AIAgent:
    """
    A comprehensive AI agent with tool calling capabilities, file operations,
    web search, code execution, and conversational interface.
    """
    
    def __init__(self, name: str = "AI Assistant", model: str = "gpt-4"):
        self.name = name
        self.model = model
        self.conversation_history: List[Message] = []
        self.tools: Dict[str, Callable] = {}
        self.working_directory = Path.cwd()
        
        # Load configuration
        self.config = self._load_config()
        
        # Register built-in tools
        self._register_built_in_tools()
        
        logger.info(f"AI Agent '{self.name}' initialized with model '{self.model}'")
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from environment variables or config file."""
        config = {
            "openai_api_key": os.getenv("OPENAI_API_KEY"),
            "max_conversation_length": int(os.getenv("MAX_CONVERSATION_LENGTH", "50")),
            "enable_web_search": os.getenv("ENABLE_WEB_SEARCH", "true").lower() == "true",
            "enable_code_execution": os.getenv("ENABLE_CODE_EXECUTION", "true").lower() == "true",
            "safe_mode": os.getenv("SAFE_MODE", "true").lower() == "true"
        }
        return config
    
    def _register_built_in_tools(self):
        """Register built-in tools that the agent can use."""
        self.tools.update({
            "file_read": self._tool_file_read,
            "file_write": self._tool_file_write,
            "file_list": self._tool_file_list,
            "execute_command": self._tool_execute_command,
            "execute_python": self._tool_execute_python,
            "web_search": self._tool_web_search,
            "get_current_time": self._tool_get_current_time,
            "calculate": self._tool_calculate,
            "create_directory": self._tool_create_directory
        })
    
    def add_tool(self, name: str, function: Callable):
        """Add a custom tool to the agent."""
        self.tools[name] = function
        logger.info(f"Added custom tool: {name}")
    
    def _tool_file_read(self, filepath: str) -> str:
        """Read contents of a file."""
        try:
            path = Path(filepath)
            if path.is_absolute():
                full_path = path
            else:
                full_path = self.working_directory / path
            
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return f"File content from {filepath}:\n{content}"
        except Exception as e:
            return f"Error reading file {filepath}: {str(e)}"
    
    def _tool_file_write(self, filepath: str, content: str) -> str:
        """Write content to a file."""
        try:
            path = Path(filepath)
            if path.is_absolute():
                full_path = path
            else:
                full_path = self.working_directory / path
            
            # Create directory if it doesn't exist
            full_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return f"Successfully wrote content to {filepath}"
        except Exception as e:
            return f"Error writing to file {filepath}: {str(e)}"
    
    def _tool_file_list(self, directory: str = ".") -> str:
        """List files and directories in a given path."""
        try:
            path = Path(directory)
            if path.is_absolute():
                full_path = path
            else:
                full_path = self.working_directory / path
            
            items = []
            for item in full_path.iterdir():
                if item.is_dir():
                    items.append(f"[DIR]  {item.name}/")
                else:
                    size = item.stat().st_size
                    items.append(f"[FILE] {item.name} ({size} bytes)")
            
            return f"Contents of {directory}:\n" + "\n".join(items)
        except Exception as e:
            return f"Error listing directory {directory}: {str(e)}"
    
    def _tool_execute_command(self, command: str) -> str:
        """Execute a shell command (use with caution)."""
        if not self.config["enable_code_execution"]:
            return "Code execution is disabled in configuration"
        
        if self.config["safe_mode"]:
            # List of potentially dangerous commands
            dangerous_commands = ["rm", "del", "format", "mkfs", "dd", "shutdown", "reboot"]
            if any(cmd in command.lower() for cmd in dangerous_commands):
                return f"Command '{command}' blocked by safe mode"
        
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30,
                cwd=self.working_directory
            )
            output = f"Exit code: {result.returncode}\n"
            if result.stdout:
                output += f"STDOUT:\n{result.stdout}\n"
            if result.stderr:
                output += f"STDERR:\n{result.stderr}\n"
            return output
        except subprocess.TimeoutExpired:
            return "Command timed out after 30 seconds"
        except Exception as e:
            return f"Error executing command: {str(e)}"
    
    def _tool_execute_python(self, code: str) -> str:
        """Execute Python code safely."""
        if not self.config["enable_code_execution"]:
            return "Code execution is disabled in configuration"
        
        try:
            # Create a restricted globals environment
            safe_globals = {
                "__builtins__": {
                    "print": print,
                    "len": len,
                    "str": str,
                    "int": int,
                    "float": float,
                    "list": list,
                    "dict": dict,
                    "range": range,
                    "enumerate": enumerate,
                    "zip": zip,
                    "sum": sum,
                    "max": max,
                    "min": min,
                    "abs": abs,
                    "round": round
                },
                "datetime": datetime,
                "json": json,
                "math": __import__("math")
            }
            
            # Capture output
            from io import StringIO
            import contextlib
            
            output_buffer = StringIO()
            with contextlib.redirect_stdout(output_buffer):
                exec(code, safe_globals)
            
            output = output_buffer.getvalue()
            return f"Python code executed successfully:\n{output}" if output else "Python code executed successfully (no output)"
        
        except Exception as e:
            return f"Error executing Python code: {str(e)}"
    
    def _tool_web_search(self, query: str) -> str:
        """Perform a web search (placeholder - would need actual search API)."""
        if not self.config["enable_web_search"]:
            return "Web search is disabled in configuration"
        
        # This is a placeholder. In a real implementation, you'd integrate with
        # a search API like Google Custom Search, Bing, or DuckDuckGo
        return f"Web search for '{query}' would be performed here. Please implement with actual search API."
    
    def _tool_get_current_time(self) -> str:
        """Get current date and time."""
        return f"Current time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    
    def _tool_calculate(self, expression: str) -> str:
        """Safely evaluate mathematical expressions."""
        try:
            # Only allow basic math operations
            allowed_chars = set("0123456789+-*/.() ")
            if not all(c in allowed_chars for c in expression):
                return "Error: Expression contains invalid characters"
            
            result = eval(expression, {"__builtins__": {}}, {})
            return f"Calculation result: {expression} = {result}"
        except Exception as e:
            return f"Calculation error: {str(e)}"
    
    def _tool_create_directory(self, path: str) -> str:
        """Create a directory."""
        try:
            dir_path = Path(path)
            if not dir_path.is_absolute():
                dir_path = self.working_directory / dir_path
            
            dir_path.mkdir(parents=True, exist_ok=True)
            return f"Directory created: {path}"
        except Exception as e:
            return f"Error creating directory {path}: {str(e)}"
    
    def get_available_tools(self) -> List[str]:
        """Get list of available tools."""
        return list(self.tools.keys())
    
    def execute_tool(self, tool_name: str, **kwargs) -> str:
        """Execute a tool with given parameters."""
        if tool_name not in self.tools:
            return f"Tool '{tool_name}' not found. Available tools: {', '.join(self.tools.keys())}"
        
        try:
            return self.tools[tool_name](**kwargs)
        except Exception as e:
            return f"Error executing tool '{tool_name}': {str(e)}"
    
    def add_message(self, role: str, content: str):
        """Add a message to the conversation history."""
        message = Message(role=role, content=content)
        self.conversation_history.append(message)
        
        # Trim conversation if it gets too long
        max_length = self.config["max_conversation_length"]
        if len(self.conversation_history) > max_length:
            self.conversation_history = self.conversation_history[-max_length:]
    
    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """Get conversation history as a list of dictionaries."""
        return [
            {
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in self.conversation_history
        ]
    
    def save_conversation(self, filepath: str):
        """Save conversation history to a file."""
        try:
            conversation_data = {
                "agent_name": self.name,
                "model": self.model,
                "conversation": self.get_conversation_history()
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(conversation_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Conversation saved to {filepath}")
        except Exception as e:
            logger.error(f"Error saving conversation: {str(e)}")
    
    def load_conversation(self, filepath: str):
        """Load conversation history from a file."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.conversation_history = [
                Message(
                    role=msg["role"],
                    content=msg["content"],
                    timestamp=datetime.fromisoformat(msg["timestamp"])
                )
                for msg in data["conversation"]
            ]
            
            logger.info(f"Conversation loaded from {filepath}")
        except Exception as e:
            logger.error(f"Error loading conversation: {str(e)}")
    
    def clear_conversation(self):
        """Clear the conversation history."""
        self.conversation_history = []
        logger.info("Conversation history cleared")
    
    def get_system_info(self) -> str:
        """Get system information."""
        info = f"""
AI Agent System Information:
- Name: {self.name}
- Model: {self.model}
- Working Directory: {self.working_directory}
- Available Tools: {', '.join(self.tools.keys())}
- Conversation Length: {len(self.conversation_history)} messages
- Safe Mode: {self.config['safe_mode']}
- Code Execution: {self.config['enable_code_execution']}
- Web Search: {self.config['enable_web_search']}
"""
        return info.strip()

    async def process_message(self, user_input: str) -> str:
        """Process a user message and return a response."""
        self.add_message("user", user_input)
        
        # Simple rule-based responses for demonstration
        # In a real implementation, this would use an LLM API
        
        lower_input = user_input.lower()
        
        if "help" in lower_input or "commands" in lower_input:
            response = f"""
Available commands:
- help: Show this help message
- tools: List available tools
- info: Show system information
- clear: Clear conversation history
- save <filename>: Save conversation to file
- load <filename>: Load conversation from file
- execute <tool_name> <args>: Execute a tool
- exit: Exit the agent

Available tools: {', '.join(self.tools.keys())}

You can also have natural conversations, and I'll try to help with various tasks!
"""
        
        elif "tools" in lower_input:
            response = f"Available tools: {', '.join(self.tools.keys())}"
        
        elif "info" in lower_input:
            response = self.get_system_info()
        
        elif lower_input.startswith("execute "):
            parts = user_input[8:].split(" ", 1)
            tool_name = parts[0]
            args_str = parts[1] if len(parts) > 1 else ""
            
            # Simple argument parsing (in real implementation, use proper parsing)
            try:
                if args_str:
                    # Try to parse as JSON, fallback to simple string
                    try:
                        kwargs = json.loads(args_str)
                    except:
                        kwargs = {"input": args_str}
                else:
                    kwargs = {}
                
                response = self.execute_tool(tool_name, **kwargs)
            except Exception as e:
                response = f"Error parsing arguments: {str(e)}"
        
        elif lower_input.startswith("save "):
            filename = user_input[5:].strip()
            self.save_conversation(filename)
            response = f"Conversation saved to {filename}"
        
        elif lower_input.startswith("load "):
            filename = user_input[5:].strip()
            self.load_conversation(filename)
            response = f"Conversation loaded from {filename}"
        
        elif "clear" in lower_input:
            self.clear_conversation()
            response = "Conversation history cleared"
        
        else:
            # Default response for natural language
            response = f"I received your message: '{user_input}'. I'm a demo AI agent with tool-calling capabilities. Use 'help' to see available commands, or 'tools' to see available tools. In a full implementation, I would use an LLM API to provide more intelligent responses."
        
        self.add_message("assistant", response)
        return response

if __name__ == "__main__":
    # Example usage
    agent = AIAgent(name="Demo Agent", model="gpt-4")
    
    print("AI Agent initialized! Type 'help' for commands or 'exit' to quit.")
    print(agent.get_system_info())
    print("\n" + "="*50 + "\n")
    
    while True:
        try:
            user_input = input(f"{agent.name}> ").strip()
            
            if user_input.lower() in ["exit", "quit", "bye"]:
                print("Goodbye!")
                break
            
            if not user_input:
                continue
            
            response = asyncio.run(agent.process_message(user_input))
            print(f"\n{response}\n")
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {str(e)}")