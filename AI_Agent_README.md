# 🤖 AI Agent System

A comprehensive, extensible AI assistant with tool calling capabilities, web interface, and multiple interaction modes.

## ✨ Features

### Core Capabilities
- **🛠️ Tool Calling**: Extensible system for adding custom tools and functions
- **📁 File Operations**: Read, write, and manage files safely
- **💻 Code Execution**: Run Python code and shell commands in a secure environment
- **🧮 Mathematical Calculations**: Perform complex calculations
- **🌐 Web Search**: Search the web (with API integration)
- **💬 Conversational Interface**: Natural language interaction
- **📊 Usage Tracking**: Monitor API usage and rate limiting

### Multiple Interfaces
- **🖥️ Command Line Interface**: Rich CLI with Typer and Rich
- **🌐 Web Interface**: FastAPI-based REST API with HTML interface
- **🔌 WebSocket Support**: Real-time communication
- **📱 Programmatic API**: Direct Python integration

### LLM Integration
- **🔥 OpenAI GPT Models**: GPT-4, GPT-3.5-turbo support
- **🧠 Anthropic Claude**: Claude-3 and other models
- **🔄 Model Switching**: Switch between models dynamically
- **⚡ Rate Limiting**: Built-in rate limiting and usage tracking

### Security & Configuration
- **🔒 Safe Mode**: Configurable security restrictions
- **⚙️ Environment Configuration**: Flexible configuration system
- **📝 Conversation Logging**: Save and restore conversation history
- **🛡️ Sandboxed Execution**: Safe code execution environment

## 🚀 Quick Start

### Installation

1. **Clone and Setup**:
```bash
git clone <repository-url>
cd ai_agent_system
pip install -r ai_agent/requirements.txt
```

2. **Configure Environment** (Optional):
```bash
python -m ai_agent.config --template  # Creates .env template
# Edit .env with your API keys
```

3. **Basic Usage**:
```bash
# Interactive chat with basic agent
python -m ai_agent.agent

# Interactive chat with LLM agent (requires API keys)
python -m ai_agent.llm_agent

# Start web interface
python -m ai_agent.web_api
# Open http://localhost:8000 in browser
```

### CLI Usage

```bash
# Start interactive chat
python -m ai_agent.cli chat

# Start with specific model
python -m ai_agent.cli chat --model gpt-4 --type llm

# List available tools
python -m ai_agent.cli tools

# Execute a specific tool
python -m ai_agent.cli execute get_current_time

# Start web server
python -m ai_agent.cli serve --host 0.0.0.0 --port 8000

# Run demonstrations
python -m ai_agent.cli demo

# Show configuration
python -m ai_agent.cli config --all
```

## 📚 Usage Examples

### Basic Agent Usage

```python
from ai_agent import AIAgent

# Create agent
agent = AIAgent(name="My Assistant")

# Execute tools directly
result = agent.execute_tool("calculate", expression="2 + 2")
print(result)  # "Calculation result: 2 + 2 = 4"

# Read a file
result = agent.execute_tool("file_read", filepath="example.txt")

# Interactive conversation
response = await agent.process_message("What time is it?")
print(response)
```

### LLM Agent Usage

```python
from ai_agent import LLMAgent
import asyncio

async def chat_example():
    # Create LLM-powered agent
    agent = LLMAgent(name="Smart Assistant", model="gpt-4")
    
    # Have intelligent conversation
    response = await agent.process_message(
        "Can you help me write a Python function to calculate fibonacci numbers?"
    )
    print(response)
    
    # Agent can use tools automatically
    response = await agent.process_message(
        "What files are in the current directory?"
    )
    print(response)

asyncio.run(chat_example())
```

### Custom Tools

```python
from ai_agent import AIAgent

def weather_tool(city: str) -> str:
    """Get weather for a city (mock implementation)."""
    return f"Weather in {city}: 22°C, Sunny"

def news_tool(topic: str = "technology") -> str:
    """Get latest news on a topic."""
    return f"Latest {topic} news: AI advances continue..."

# Create agent and add custom tools
agent = AIAgent(name="Enhanced Assistant")
agent.add_tool("weather", weather_tool)
agent.add_tool("news", news_tool)

# Use custom tools
result = agent.execute_tool("weather", city="London")
print(result)
```

### Web API Usage

```python
import requests

# Start web server first: python -m ai_agent.web_api

# Send chat message
response = requests.post("http://localhost:8000/chat", json={
    "message": "Hello! What can you help me with?",
    "session_id": "my-session"
})
print(response.json())

# Execute tool via API
response = requests.post("http://localhost:8000/tool", json={
    "tool_name": "calculate",
    "parameters": {"expression": "10 * 5"}
})
print(response.json())

# Get agent information
response = requests.get("http://localhost:8000/agent/info")
print(response.json())
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with your configuration:

```bash
# API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

# Model Settings
DEFAULT_MODEL=gpt-4
TEMPERATURE=0.7
MAX_TOKENS=2048

# Agent Settings
AGENT_NAME=AI Assistant
MAX_CONVERSATION_LENGTH=50

# Security Settings
SAFE_MODE=true
ENABLE_CODE_EXECUTION=true
ENABLE_WEB_SEARCH=true

# Web Interface
WEB_INTERFACE_HOST=localhost
WEB_INTERFACE_PORT=8000

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_TOKENS_PER_MINUTE=40000
```

### Configuration Management

```python
from ai_agent.config import config

# Get configuration value
api_key = config.get("openai_api_key")

# Set configuration value
config.set("temperature", 0.8)

# Validate configuration
issues = config.validate()
if issues:
    print("Configuration issues:", issues)

# Save configuration to file
config.save_to_file("my_config.yaml")
```

## 🏗️ Architecture

### Core Components

```
ai_agent/
├── agent.py          # Basic AI Agent with tool calling
├── llm_agent.py      # LLM-powered agent (OpenAI, Anthropic)
├── config.py         # Configuration management
├── web_api.py        # FastAPI web interface
├── cli.py            # Command line interface
└── __init__.py       # Package initialization

examples/
├── basic_usage.py    # Usage examples and demos
└── ...

ai_agent/
├── requirements.txt  # Python dependencies
└── ...
```

### Tool System

The agent uses a flexible tool system where each tool is a Python function:

```python
def my_tool(param1: str, param2: int = 10) -> str:
    """Tool description."""
    # Tool implementation
    return f"Result: {param1} with {param2}"

agent.add_tool("my_tool", my_tool)
result = agent.execute_tool("my_tool", param1="test", param2=20)
```

### Built-in Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `file_read` | Read file contents | `filepath: str` |
| `file_write` | Write content to file | `filepath: str, content: str` |
| `file_list` | List directory contents | `directory: str = "."` |
| `execute_command` | Run shell commands | `command: str` |
| `execute_python` | Run Python code | `code: str` |
| `calculate` | Mathematical calculations | `expression: str` |
| `get_current_time` | Get current time | None |
| `create_directory` | Create directories | `path: str` |
| `web_search` | Search the web | `query: str` |

## 🌐 Web Interface

The web interface provides:

- **Interactive Chat**: Real-time conversation with the agent
- **Tool Execution**: Direct tool execution interface
- **Session Management**: Save and restore conversations
- **Usage Statistics**: Monitor API usage and performance
- **Configuration**: Manage agent settings

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Web interface |
| `/chat` | POST | Send chat message |
| `/tool` | POST | Execute tool |
| `/agent/info` | GET | Get agent information |
| `/agent/tools` | GET | List available tools |
| `/agent/conversation/{session_id}` | GET | Get conversation history |
| `/ws/{session_id}` | WebSocket | Real-time chat |
| `/health` | GET | Health check |
| `/stats` | GET | Server statistics |

## 🔧 Advanced Usage

### Custom LLM Integration

```python
from ai_agent.llm_agent import LLMAgent

class CustomLLMAgent(LLMAgent):
    async def _call_custom_llm(self, messages):
        # Implement your custom LLM integration
        pass
    
    async def _call_llm(self, user_input):
        # Override to use custom LLM
        return await self._call_custom_llm(messages)
```

### Persistent Memory

```python
from ai_agent import AIAgent

agent = AIAgent()

# Save conversation
agent.save_conversation("conversation.json")

# Load conversation
agent.load_conversation("conversation.json")

# Auto-save on shutdown
import atexit
atexit.register(lambda: agent.save_conversation("auto_save.json"))
```

### Rate Limiting and Usage Tracking

```python
from ai_agent import LLMAgent

agent = LLMAgent()

# Get usage statistics
stats = agent.get_usage_stats()
print(f"Requests last hour: {stats['requests_last_hour']}")
print(f"Tokens used: {stats['tokens_last_hour']}")

# Rate limiting is automatic based on configuration
```

## 🛡️ Security Considerations

### Safe Mode

When safe mode is enabled:
- Dangerous shell commands are blocked
- File access is restricted to working directory
- Code execution is sandboxed
- Web requests may be limited

### Code Execution Safety

Python code execution uses restricted globals:
```python
safe_globals = {
    "__builtins__": {
        "print": print, "len": len, "str": str,
        # Limited set of safe built-ins
    },
    "math": math,
    "datetime": datetime
}
```

### Configuration Security

- API keys are masked in logs and UI
- Sensitive paths can be blocked
- Rate limiting prevents abuse
- Session isolation in web interface

## 🐛 Troubleshooting

### Common Issues

1. **Missing API Keys**:
   ```bash
   # Check configuration
   python -m ai_agent.cli config --all
   
   # Create template
   python -m ai_agent.cli config --template
   ```

2. **Import Errors**:
   ```bash
   # Install dependencies
   pip install -r ai_agent/requirements.txt
   
   # Check Python path
   export PYTHONPATH="${PYTHONPATH}:$(pwd)"
   ```

3. **Permission Errors**:
   ```bash
   # Check working directory permissions
   python -m ai_agent.cli validate
   ```

4. **Rate Limiting**:
   ```bash
   # Check current limits
   python -m ai_agent.cli config rate_limit_requests_per_minute
   
   # Adjust limits
   python -m ai_agent.cli config rate_limit_requests_per_minute --value 30
   ```

### Debugging

Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)

from ai_agent import LLMAgent
agent = LLMAgent()
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Commit changes: `git commit -am 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

### Development Setup

```bash
# Clone repository
git clone <repository-url>
cd ai_agent_system

# Install development dependencies
pip install -r ai_agent/requirements.txt
pip install pytest black flake8 mypy

# Run tests
pytest tests/

# Format code
black ai_agent/ examples/

# Type checking
mypy ai_agent/
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT models and API
- Anthropic for Claude models
- FastAPI for the web framework
- Typer and Rich for the CLI interface
- All contributors and users

## 📞 Support

- **Documentation**: This README and inline code documentation
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for questions and community

---

Made with ❤️ by the AI Agent Development Team