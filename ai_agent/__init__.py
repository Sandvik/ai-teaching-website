"""
AI Agent Package - A comprehensive AI assistant with tool calling capabilities.

This package provides:
- Basic AI Agent with tool calling (agent.py)
- Advanced LLM-powered Agent (llm_agent.py)
- Configuration management (config.py)
- Web API interface (web_api.py)
"""

from .agent import AIAgent, Message
from .config import config, AgentConfig
from .llm_agent import LLMAgent

__version__ = "1.0.0"
__author__ = "AI Agent Development Team"
__email__ = "contact@aiagent.dev"

__all__ = [
    "AIAgent",
    "LLMAgent", 
    "Message",
    "config",
    "AgentConfig"
]