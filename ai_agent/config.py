import os
from typing import Dict, Any, List
from pathlib import Path
import yaml
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class AgentConfig:
    """Configuration class for AI Agent"""
    
    def __init__(self, config_file: str = None):
        self.config_file = config_file
        self._config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from environment variables and config file."""
        
        # Default configuration
        config = {
            # API Keys
            "openai_api_key": os.getenv("OPENAI_API_KEY"),
            "anthropic_api_key": os.getenv("ANTHROPIC_API_KEY"),
            "google_api_key": os.getenv("GOOGLE_API_KEY"),
            "search_engine_id": os.getenv("GOOGLE_SEARCH_ENGINE_ID"),
            
            # Model Settings
            "default_model": os.getenv("DEFAULT_MODEL", "gpt-4"),
            "temperature": float(os.getenv("TEMPERATURE", "0.7")),
            "max_tokens": int(os.getenv("MAX_TOKENS", "2048")),
            "model_timeout": int(os.getenv("MODEL_TIMEOUT", "30")),
            
            # Agent Settings
            "agent_name": os.getenv("AGENT_NAME", "AI Assistant"),
            "max_conversation_length": int(os.getenv("MAX_CONVERSATION_LENGTH", "50")),
            "working_directory": os.getenv("WORKING_DIRECTORY", str(Path.cwd())),
            
            # Security Settings
            "safe_mode": os.getenv("SAFE_MODE", "true").lower() == "true",
            "enable_code_execution": os.getenv("ENABLE_CODE_EXECUTION", "true").lower() == "true",
            "enable_web_search": os.getenv("ENABLE_WEB_SEARCH", "true").lower() == "true",
            "enable_file_operations": os.getenv("ENABLE_FILE_OPERATIONS", "true").lower() == "true",
            "allowed_file_extensions": os.getenv("ALLOWED_FILE_EXTENSIONS", ".txt,.py,.js,.html,.css,.json,.yaml,.yml,.md").split(","),
            "blocked_paths": os.getenv("BLOCKED_PATHS", "/etc,/root,/home").split(","),
            
            # Web Interface Settings
            "web_interface_host": os.getenv("WEB_INTERFACE_HOST", "localhost"),
            "web_interface_port": int(os.getenv("WEB_INTERFACE_PORT", "8000")),
            "enable_web_interface": os.getenv("ENABLE_WEB_INTERFACE", "true").lower() == "true",
            
            # Logging Settings
            "log_level": os.getenv("LOG_LEVEL", "INFO"),
            "log_file": os.getenv("LOG_FILE", "ai_agent.log"),
            "enable_conversation_logging": os.getenv("ENABLE_CONVERSATION_LOGGING", "true").lower() == "true",
            
            # Tool Settings
            "custom_tools_directory": os.getenv("CUSTOM_TOOLS_DIRECTORY", "custom_tools"),
            "enable_auto_tool_loading": os.getenv("ENABLE_AUTO_TOOL_LOADING", "true").lower() == "true",
            
            # Memory/Storage Settings
            "conversation_storage_path": os.getenv("CONVERSATION_STORAGE_PATH", "conversations"),
            "enable_persistent_memory": os.getenv("ENABLE_PERSISTENT_MEMORY", "false").lower() == "true",
            "memory_backend": os.getenv("MEMORY_BACKEND", "file"), # file, redis, sqlite
            
            # Rate Limiting
            "rate_limit_requests_per_minute": int(os.getenv("RATE_LIMIT_REQUESTS_PER_MINUTE", "60")),
            "rate_limit_tokens_per_minute": int(os.getenv("RATE_LIMIT_TOKENS_PER_MINUTE", "40000")),
        }
        
        # Load additional config from YAML file if specified
        if self.config_file and Path(self.config_file).exists():
            try:
                with open(self.config_file, 'r') as f:
                    file_config = yaml.safe_load(f)
                    config.update(file_config)
            except Exception as e:
                print(f"Warning: Could not load config file {self.config_file}: {e}")
        
        return config
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get a configuration value."""
        return self._config.get(key, default)
    
    def set(self, key: str, value: Any):
        """Set a configuration value."""
        self._config[key] = value
    
    def update(self, new_config: Dict[str, Any]):
        """Update configuration with new values."""
        self._config.update(new_config)
    
    def to_dict(self) -> Dict[str, Any]:
        """Return configuration as dictionary."""
        return self._config.copy()
    
    def save_to_file(self, filepath: str):
        """Save current configuration to a YAML file."""
        try:
            with open(filepath, 'w') as f:
                yaml.dump(self._config, f, default_flow_style=False, indent=2)
            print(f"Configuration saved to {filepath}")
        except Exception as e:
            print(f"Error saving configuration: {e}")
    
    def validate(self) -> List[str]:
        """Validate configuration and return list of issues."""
        issues = []
        
        # Check required API keys if certain features are enabled
        if not self.get("openai_api_key") and self.get("default_model", "").startswith("gpt"):
            issues.append("OpenAI API key is required for GPT models")
        
        if not self.get("anthropic_api_key") and self.get("default_model", "").startswith("claude"):
            issues.append("Anthropic API key is required for Claude models")
        
        if self.get("enable_web_search") and not self.get("google_api_key"):
            issues.append("Google API key is required for web search")
        
        # Check directory permissions
        working_dir = Path(self.get("working_directory"))
        if not working_dir.exists():
            issues.append(f"Working directory does not exist: {working_dir}")
        elif not os.access(working_dir, os.R_OK | os.W_OK):
            issues.append(f"No read/write access to working directory: {working_dir}")
        
        # Check numeric values
        if self.get("temperature") < 0 or self.get("temperature") > 2:
            issues.append("Temperature must be between 0 and 2")
        
        if self.get("max_tokens") <= 0:
            issues.append("Max tokens must be positive")
        
        return issues

# Global configuration instance
config = AgentConfig()

# Environment variables template for .env file
ENV_TEMPLATE = """
# AI Agent Configuration
# Copy this to .env and fill in your values

# API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Model Settings
DEFAULT_MODEL=gpt-4
TEMPERATURE=0.7
MAX_TOKENS=2048
MODEL_TIMEOUT=30

# Agent Settings
AGENT_NAME=AI Assistant
MAX_CONVERSATION_LENGTH=50
WORKING_DIRECTORY=/workspace

# Security Settings
SAFE_MODE=true
ENABLE_CODE_EXECUTION=true
ENABLE_WEB_SEARCH=true
ENABLE_FILE_OPERATIONS=true
ALLOWED_FILE_EXTENSIONS=.txt,.py,.js,.html,.css,.json,.yaml,.yml,.md
BLOCKED_PATHS=/etc,/root,/home

# Web Interface Settings
WEB_INTERFACE_HOST=localhost
WEB_INTERFACE_PORT=8000
ENABLE_WEB_INTERFACE=true

# Logging Settings
LOG_LEVEL=INFO
LOG_FILE=ai_agent.log
ENABLE_CONVERSATION_LOGGING=true

# Tool Settings
CUSTOM_TOOLS_DIRECTORY=custom_tools
ENABLE_AUTO_TOOL_LOADING=true

# Memory/Storage Settings
CONVERSATION_STORAGE_PATH=conversations
ENABLE_PERSISTENT_MEMORY=false
MEMORY_BACKEND=file

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_TOKENS_PER_MINUTE=40000
"""

def create_env_template(filepath: str = ".env.template"):
    """Create a template .env file."""
    with open(filepath, 'w') as f:
        f.write(ENV_TEMPLATE.strip())
    print(f"Environment template created: {filepath}")

if __name__ == "__main__":
    # Validate configuration
    issues = config.validate()
    if issues:
        print("Configuration issues found:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("Configuration is valid!")
    
    # Create environment template
    create_env_template()