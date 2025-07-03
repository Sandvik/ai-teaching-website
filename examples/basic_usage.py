#!/usr/bin/env python3
"""
Basic usage example for the AI Agent.

This script demonstrates how to use the AI Agent for various tasks:
- File operations
- Mathematical calculations
- Code execution
- Tool usage
"""

import asyncio
import sys
import os

# Add the parent directory to Python path to import ai_agent
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai_agent import AIAgent, LLMAgent, config

async def demo_basic_agent():
    """Demonstrate basic AI agent capabilities."""
    print("=== Basic AI Agent Demo ===\n")
    
    # Create a basic agent
    agent = AIAgent(name="Demo Agent", model="gpt-4")
    
    print(f"Agent created: {agent.name}")
    print(f"Available tools: {', '.join(agent.get_available_tools())}")
    print(f"Working directory: {agent.working_directory}\n")
    
    # Test file operations
    print("1. Testing file operations...")
    
    # Create a test file
    test_content = "Hello from AI Agent!\nThis is a test file.\n"
    result = agent.execute_tool("file_write", filepath="test_file.txt", content=test_content)
    print(f"Write file result: {result}")
    
    # Read the file back
    result = agent.execute_tool("file_read", filepath="test_file.txt")
    print(f"Read file result: {result[:100]}...")
    
    # List files in current directory
    result = agent.execute_tool("file_list", directory=".")
    print(f"Directory listing: {result[:150]}...\n")
    
    # Test calculations
    print("2. Testing calculations...")
    calculations = ["2 + 2", "10 * 5", "(100 + 50) / 3", "2 ** 8"]
    
    for calc in calculations:
        result = agent.execute_tool("calculate", expression=calc)
        print(f"  {result}")
    print()
    
    # Test Python code execution
    print("3. Testing Python code execution...")
    python_code = """
import math
numbers = [1, 2, 3, 4, 5]
print(f"Numbers: {numbers}")
print(f"Sum: {sum(numbers)}")
print(f"Square root of 16: {math.sqrt(16)}")

# Create a simple function
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(f"Fibonacci of 8: {fibonacci(8)}")
"""
    
    result = agent.execute_tool("execute_python", code=python_code)
    print(f"Python execution result:\n{result}\n")
    
    # Test current time
    print("4. Testing time tool...")
    result = agent.execute_tool("get_current_time")
    print(f"Current time: {result}\n")
    
    # Test conversational interface
    print("5. Testing conversational interface...")
    messages = [
        "Hello! What can you help me with?",
        "tools",
        "info",
        "execute get_current_time"
    ]
    
    for message in messages:
        print(f"User: {message}")
        response = await agent.process_message(message)
        print(f"Agent: {response}\n")
    
    # Clean up
    try:
        os.remove("test_file.txt")
        print("Cleaned up test file.")
    except:
        pass

async def demo_llm_agent():
    """Demonstrate LLM-powered agent capabilities."""
    print("\n=== LLM Agent Demo ===\n")
    
    # Check if we have API keys configured
    if not config.get("openai_api_key") and not config.get("anthropic_api_key"):
        print("No API keys configured. Skipping LLM agent demo.")
        print("To test LLM agent, set OPENAI_API_KEY or ANTHROPIC_API_KEY environment variable.")
        return
    
    try:
        # Create an LLM agent
        llm_agent = LLMAgent(name="Smart Assistant")
        
        print(f"LLM Agent created: {llm_agent.name}")
        print(f"Model: {llm_agent.model}")
        print(f"Usage stats: {llm_agent.get_usage_stats()}\n")
        
        # Test intelligent conversation
        test_messages = [
            "Hello! Can you help me understand what you can do?",
            "What's the weather like today?",  # This will demonstrate limitations
            "Can you calculate the area of a circle with radius 5?",
            "Write a simple Python function to reverse a string"
        ]
        
        for message in test_messages:
            print(f"User: {message}")
            response = await llm_agent.process_message(message)
            print(f"Assistant: {response}\n")
            
        print(f"Final usage stats: {llm_agent.get_usage_stats()}")
        
    except Exception as e:
        print(f"Error with LLM agent: {e}")
        print("This might be due to missing API keys or network issues.")

def demo_custom_tools():
    """Demonstrate how to add custom tools to the agent."""
    print("\n=== Custom Tools Demo ===\n")
    
    agent = AIAgent(name="Custom Tool Agent")
    
    # Define custom tools
    def weather_tool(city: str = "New York") -> str:
        """Get weather information for a city (mock implementation)."""
        import random
        temperatures = [15, 20, 25, 30]
        conditions = ["Sunny", "Cloudy", "Rainy", "Snowy"]
        
        temp = random.choice(temperatures)
        condition = random.choice(conditions)
        
        return f"Weather in {city}: {temp}°C, {condition}"
    
    def translate_tool(text: str, target_lang: str = "Spanish") -> str:
        """Translate text to another language (mock implementation)."""
        translations = {
            "hello": {"Spanish": "Hola", "French": "Bonjour", "German": "Hallo"},
            "goodbye": {"Spanish": "Adiós", "French": "Au revoir", "German": "Auf Wiedersehen"},
            "thank you": {"Spanish": "Gracias", "French": "Merci", "German": "Danke"}
        }
        
        text_lower = text.lower()
        if text_lower in translations and target_lang in translations[text_lower]:
            return f"'{text}' in {target_lang} is '{translations[text_lower][target_lang]}'"
        else:
            return f"Translation not available for '{text}' to {target_lang}"
    
    def random_quote_tool() -> str:
        """Get a random inspirational quote."""
        quotes = [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Innovation distinguishes between a leader and a follower. - Steve Jobs",
            "Life is what happens to you while you're busy making other plans. - John Lennon",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "It is during our darkest moments that we must focus to see the light. - Aristotle"
        ]
        import random
        return random.choice(quotes)
    
    # Add custom tools to the agent
    agent.add_tool("weather", weather_tool)
    agent.add_tool("translate", translate_tool)
    agent.add_tool("random_quote", random_quote_tool)
    
    print(f"Agent with custom tools: {', '.join(agent.get_available_tools())}\n")
    
    # Test the custom tools
    print("Testing custom tools:")
    
    # Weather tool
    result = agent.execute_tool("weather", city="London")
    print(f"Weather: {result}")
    
    # Translation tool
    result = agent.execute_tool("translate", text="hello", target_lang="French")
    print(f"Translation: {result}")
    
    # Random quote tool
    result = agent.execute_tool("random_quote")
    print(f"Quote: {result}")

async def main():
    """Run all demos."""
    print("AI Agent Examples and Demonstrations")
    print("=" * 50)
    
    # Basic agent demo
    await demo_basic_agent()
    
    # LLM agent demo (if API keys available)
    await demo_llm_agent()
    
    # Custom tools demo
    demo_custom_tools()
    
    print("\n" + "=" * 50)
    print("Demos completed!")
    print("\nTo start an interactive session, run:")
    print("  python -m ai_agent.agent")
    print("  python -m ai_agent.llm_agent")
    print("\nTo start the web interface, run:")
    print("  python -m ai_agent.web_api")
    print("  Then open http://localhost:8000 in your browser")

if __name__ == "__main__":
    asyncio.run(main())