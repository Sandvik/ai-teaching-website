#!/usr/bin/env python3
"""
Command Line Interface for AI Agent.

This provides a rich CLI for interacting with the AI Agent system.
"""

import asyncio
import typer
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt
from rich.table import Table
from rich.text import Text
from rich.live import Live
from rich.spinner import Spinner
from pathlib import Path
import json
from typing import Optional

from .agent import AIAgent
from .llm_agent import LLMAgent
from .config import config, create_env_template
from .web_api import app as web_app

app = typer.Typer(
    name="ai-agent",
    help="AI Agent CLI - A comprehensive AI assistant with tool calling capabilities",
    rich_markup_mode="rich"
)

console = Console()

def print_banner():
    """Print the AI Agent banner."""
    banner = """
    🤖 AI AGENT SYSTEM
    ==================
    
    A comprehensive AI assistant with:
    • Tool calling capabilities
    • File operations
    • Code execution
    • Web search
    • Extensible architecture
    """
    console.print(Panel(banner, title="Welcome", border_style="blue"))

@app.command()
def chat(
    model: Optional[str] = typer.Option(None, "--model", "-m", help="Model to use (gpt-4, claude-3, etc.)"),
    agent_type: str = typer.Option("llm", "--type", "-t", help="Agent type: 'basic' or 'llm'"),
    session_file: Optional[str] = typer.Option(None, "--session", "-s", help="Session file to load/save")
):
    """Start an interactive chat session with the AI agent."""
    print_banner()
    
    # Create agent based on type
    if agent_type == "llm":
        if not config.get("openai_api_key") and not config.get("anthropic_api_key"):
            console.print("[red]No API keys configured for LLM agent. Use 'basic' type or configure API keys.[/red]")
            raise typer.Exit(1)
        
        agent = LLMAgent(model=model) if model else LLMAgent()
        console.print(f"[green]LLM Agent initialized with model: {agent.model}[/green]")
    else:
        agent = AIAgent(model=model) if model else AIAgent()
        console.print(f"[green]Basic Agent initialized[/green]")
    
    # Load session if specified
    if session_file and Path(session_file).exists():
        agent.load_conversation(session_file)
        console.print(f"[blue]Loaded conversation from {session_file}[/blue]")
    
    # Show agent info
    info_table = Table(title="Agent Information")
    info_table.add_column("Property", style="cyan")
    info_table.add_column("Value", style="green")
    
    info_table.add_row("Name", agent.name)
    info_table.add_row("Model", agent.model)
    info_table.add_row("Tools", ", ".join(agent.get_available_tools()[:5]) + "...")
    info_table.add_row("Working Dir", str(agent.working_directory))
    
    console.print(info_table)
    console.print()
    
    # Chat loop
    console.print("[yellow]Type 'help' for commands, 'exit' to quit[/yellow]")
    console.print()
    
    async def chat_loop():
        while True:
            try:
                user_input = Prompt.ask("[bold blue]You[/bold blue]").strip()
                
                if user_input.lower() in ["exit", "quit", "bye"]:
                    if session_file:
                        agent.save_conversation(session_file)
                        console.print(f"[green]Session saved to {session_file}[/green]")
                    console.print("[yellow]Goodbye![/yellow]")
                    break
                
                if not user_input:
                    continue
                
                # Show thinking indicator for LLM agents
                if isinstance(agent, LLMAgent):
                    with console.status("[bold green]Agent is thinking..."):
                        response = await agent.process_message(user_input)
                else:
                    response = await agent.process_message(user_input)
                
                console.print(f"[bold green]Agent[/bold green]: {response}")
                console.print()
                
            except KeyboardInterrupt:
                console.print("\n[yellow]Goodbye![/yellow]")
                break
            except Exception as e:
                console.print(f"[red]Error: {str(e)}[/red]")
    
    asyncio.run(chat_loop())

@app.command()
def tools(
    agent_type: str = typer.Option("basic", "--type", "-t", help="Agent type: 'basic' or 'llm'")
):
    """List available tools."""
    print_banner()
    
    if agent_type == "llm":
        agent = LLMAgent()
    else:
        agent = AIAgent()
    
    tools_table = Table(title="Available Tools")
    tools_table.add_column("Tool Name", style="cyan")
    tools_table.add_column("Description", style="green")
    
    # Add tool descriptions (you'd need to modify the agent to provide these)
    tool_descriptions = {
        "file_read": "Read contents of a file",
        "file_write": "Write content to a file",
        "file_list": "List files in a directory",
        "execute_command": "Execute shell commands",
        "execute_python": "Execute Python code safely",
        "web_search": "Search the web (if configured)",
        "get_current_time": "Get current date and time",
        "calculate": "Perform mathematical calculations",
        "create_directory": "Create directories"
    }
    
    for tool in agent.get_available_tools():
        description = tool_descriptions.get(tool, "Custom tool")
        tools_table.add_row(tool, description)
    
    console.print(tools_table)

@app.command()
def execute(
    tool_name: str = typer.Argument(..., help="Name of the tool to execute"),
    params: Optional[str] = typer.Option(None, "--params", "-p", help="Tool parameters as JSON string")
):
    """Execute a specific tool."""
    print_banner()
    
    agent = AIAgent()
    
    try:
        # Parse parameters
        if params:
            try:
                parameters = json.loads(params)
            except json.JSONDecodeError:
                console.print(f"[red]Invalid JSON parameters: {params}[/red]")
                raise typer.Exit(1)
        else:
            parameters = {}
        
        # Execute tool
        with console.status(f"[bold green]Executing {tool_name}..."):
            result = agent.execute_tool(tool_name, **parameters)
        
        console.print(f"[bold green]Tool Result:[/bold green]")
        console.print(Panel(result, border_style="green"))
        
    except Exception as e:
        console.print(f"[red]Error executing tool: {str(e)}[/red]")
        raise typer.Exit(1)

@app.command()
def config_cmd(
    key: Optional[str] = typer.Argument(None, help="Configuration key to get/set"),
    value: Optional[str] = typer.Option(None, "--value", "-v", help="Value to set"),
    show_all: bool = typer.Option(False, "--all", "-a", help="Show all configuration"),
    create_template: bool = typer.Option(False, "--template", "-t", help="Create .env template")
):
    """Manage configuration."""
    print_banner()
    
    if create_template:
        create_env_template()
        console.print("[green].env template created![/green]")
        return
    
    if show_all:
        config_table = Table(title="Configuration")
        config_table.add_column("Key", style="cyan")
        config_table.add_column("Value", style="green")
        
        for k, v in config.to_dict().items():
            # Hide sensitive information
            if "key" in k.lower() and v:
                v = "*" * 10
            config_table.add_row(k, str(v))
        
        console.print(config_table)
        return
    
    if key:
        if value:
            # Set configuration value
            config.set(key, value)
            console.print(f"[green]Set {key} = {value}[/green]")
        else:
            # Get configuration value
            val = config.get(key)
            if "key" in key.lower() and val:
                val = "*" * 10
            console.print(f"[cyan]{key}[/cyan] = [green]{val}[/green]")
    else:
        console.print("[yellow]Use --all to show all config, or specify a key[/yellow]")

@app.command()
def serve(
    host: str = typer.Option("localhost", "--host", "-h", help="Host to bind to"),
    port: int = typer.Option(8000, "--port", "-p", help="Port to bind to"),
    reload: bool = typer.Option(False, "--reload", "-r", help="Enable auto-reload")
):
    """Start the web API server."""
    print_banner()
    
    console.print(f"[green]Starting web server on {host}:{port}[/green]")
    console.print(f"[blue]Web interface: http://{host}:{port}[/blue]")
    console.print(f"[blue]API docs: http://{host}:{port}/docs[/blue]")
    console.print()
    console.print("[yellow]Press Ctrl+C to stop[/yellow]")
    
    import uvicorn
    uvicorn.run(
        "ai_agent.web_api:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )

@app.command()
def demo():
    """Run demonstration examples."""
    print_banner()
    
    console.print("[yellow]Running demonstration examples...[/yellow]")
    console.print()
    
    import subprocess
    import sys
    
    try:
        result = subprocess.run([
            sys.executable, "-m", "examples.basic_usage"
        ], capture_output=False)
        
        if result.returncode == 0:
            console.print("[green]Demo completed successfully![/green]")
        else:
            console.print("[red]Demo failed[/red]")
            
    except FileNotFoundError:
        console.print("[red]Demo script not found. Make sure examples/basic_usage.py exists.[/red]")

@app.command()
def validate():
    """Validate the current configuration."""
    print_banner()
    
    issues = config.validate()
    
    if issues:
        console.print("[red]Configuration issues found:[/red]")
        for issue in issues:
            console.print(f"  • {issue}")
        console.print()
        console.print("[yellow]Run 'ai-agent config --template' to create a template .env file[/yellow]")
    else:
        console.print("[green]✓ Configuration is valid![/green]")

@app.command()
def version():
    """Show version information."""
    from . import __version__
    
    version_info = f"""
    AI Agent System
    Version: {__version__}
    
    Components:
    • Basic Agent with tool calling
    • LLM-powered Agent (OpenAI, Anthropic)
    • Web API interface
    • CLI interface
    • Configuration management
    """
    
    console.print(Panel(version_info, title="Version Information", border_style="blue"))

if __name__ == "__main__":
    app()