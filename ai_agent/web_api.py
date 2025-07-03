from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
import json
import logging
import uuid
from datetime import datetime

from .llm_agent import LLMAgent
from .config import config

logger = logging.getLogger(__name__)

# Pydantic models for API
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: datetime
    usage_stats: Optional[Dict[str, Any]] = None

class ToolRequest(BaseModel):
    tool_name: str
    parameters: Dict[str, Any] = {}

class AgentInfo(BaseModel):
    name: str
    model: str
    available_tools: List[str]
    conversation_count: int
    usage_stats: Dict[str, Any]

class WebSocketConnection:
    def __init__(self, websocket: WebSocket, session_id: str):
        self.websocket = websocket
        self.session_id = session_id
        self.agent = LLMAgent(name=f"WebSocket Agent {session_id[:8]}")

# Global state
app = FastAPI(title="AI Agent API", description="REST and WebSocket API for AI Agent", version="1.0.0")
agents: Dict[str, LLMAgent] = {}
websocket_connections: Dict[str, WebSocketConnection] = {}

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_or_create_agent(session_id: str = None) -> LLMAgent:
    """Get existing agent or create new one for session."""
    if session_id is None:
        session_id = str(uuid.uuid4())
    
    if session_id not in agents:
        agents[session_id] = LLMAgent(name=f"API Agent {session_id[:8]}")
    
    return agents[session_id]

@app.get("/", response_class=HTMLResponse)
async def get_web_interface():
    """Serve the web interface."""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>AI Agent Web Interface</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .chat-container { height: 400px; border: 1px solid #ddd; padding: 10px; overflow-y: auto; margin: 10px 0; background: #fafafa; border-radius: 5px; }
            .message { margin: 10px 0; padding: 10px; border-radius: 5px; }
            .user-message { background: #e3f2fd; text-align: right; }
            .agent-message { background: #f1f8e9; }
            .input-area { display: flex; gap: 10px; }
            .input-area input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .input-area button { padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 5px; cursor: pointer; }
            .input-area button:hover { background: #1976d2; }
            .status { margin: 10px 0; padding: 10px; background: #fff3e0; border-radius: 5px; font-size: 0.9em; }
            .info-panel { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 AI Agent Web Interface</h1>
            
            <div class="info-panel">
                <h3>Agent Information</h3>
                <div id="agent-info">Loading...</div>
            </div>
            
            <div class="status" id="status">Ready to chat!</div>
            
            <div class="chat-container" id="chat-container"></div>
            
            <div class="input-area">
                <input type="text" id="message-input" placeholder="Type your message here..." 
                       onkeypress="if(event.key==='Enter') sendMessage()">
                <button onclick="sendMessage()">Send</button>
            </div>
            
            <div style="margin-top: 20px;">
                <h3>Quick Actions</h3>
                <button onclick="sendQuickMessage('What can you help me with?')">Help</button>
                <button onclick="sendQuickMessage('List available tools')">Tools</button>
                <button onclick="sendQuickMessage('What time is it?')">Time</button>
                <button onclick="clearChat()">Clear Chat</button>
            </div>
        </div>

        <script>
            let sessionId = null;
            
            function addMessage(content, isUser = false) {
                const chatContainer = document.getElementById('chat-container');
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${isUser ? 'user-message' : 'agent-message'}`;
                messageDiv.innerHTML = `<strong>${isUser ? 'You' : 'Agent'}:</strong> ${content}`;
                chatContainer.appendChild(messageDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
            
            function updateStatus(message) {
                document.getElementById('status').textContent = message;
            }
            
            async function sendMessage() {
                const input = document.getElementById('message-input');
                const message = input.value.trim();
                if (!message) return;
                
                input.value = '';
                addMessage(message, true);
                updateStatus('Agent is thinking...');
                
                try {
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            message: message, 
                            session_id: sessionId 
                        })
                    });
                    
                    const data = await response.json();
                    sessionId = data.session_id;
                    addMessage(data.response);
                    updateStatus('Ready to chat!');
                } catch (error) {
                    addMessage(`Error: ${error.message}`, false);
                    updateStatus('Error occurred');
                }
            }
            
            function sendQuickMessage(message) {
                document.getElementById('message-input').value = message;
                sendMessage();
            }
            
            function clearChat() {
                document.getElementById('chat-container').innerHTML = '';
                sessionId = null;
                updateStatus('Chat cleared');
            }
            
            async function loadAgentInfo() {
                try {
                    const response = await fetch('/agent/info');
                    const info = await response.json();
                    document.getElementById('agent-info').innerHTML = `
                        <strong>Name:</strong> ${info.name}<br>
                        <strong>Model:</strong> ${info.model}<br>
                        <strong>Available Tools:</strong> ${info.available_tools.join(', ')}<br>
                        <strong>Conversations:</strong> ${info.conversation_count}
                    `;
                } catch (error) {
                    document.getElementById('agent-info').textContent = 'Failed to load agent info';
                }
            }
            
            // Load agent info on page load
            loadAgentInfo();
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatMessage):
    """Main chat endpoint."""
    try:
        session_id = request.session_id or str(uuid.uuid4())
        agent = get_or_create_agent(session_id)
        
        response = await agent.process_message(request.message)
        
        return ChatResponse(
            response=response,
            session_id=session_id,
            timestamp=datetime.now(),
            usage_stats=agent.get_usage_stats()
        )
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tool", response_model=Dict[str, Any])
async def execute_tool_endpoint(request: ToolRequest, session_id: str = None):
    """Execute a specific tool."""
    try:
        agent = get_or_create_agent(session_id)
        result = agent.execute_tool(request.tool_name, **request.parameters)
        
        return {
            "tool_name": request.tool_name,
            "parameters": request.parameters,
            "result": result,
            "timestamp": datetime.now()
        }
    except Exception as e:
        logger.error(f"Tool execution error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent/info", response_model=AgentInfo)
async def get_agent_info(session_id: str = None):
    """Get agent information."""
    try:
        agent = get_or_create_agent(session_id)
        
        return AgentInfo(
            name=agent.name,
            model=agent.model,
            available_tools=agent.get_available_tools(),
            conversation_count=len(agent.conversation_history),
            usage_stats=agent.get_usage_stats()
        )
    except Exception as e:
        logger.error(f"Agent info error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent/tools")
async def get_available_tools(session_id: str = None):
    """Get list of available tools."""
    try:
        agent = get_or_create_agent(session_id)
        return {"tools": agent.get_available_tools()}
    except Exception as e:
        logger.error(f"Get tools error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent/conversation/{session_id}")
async def get_conversation_history(session_id: str):
    """Get conversation history for a session."""
    try:
        if session_id not in agents:
            raise HTTPException(status_code=404, detail="Session not found")
        
        agent = agents[session_id]
        return {"conversation": agent.get_conversation_history()}
    except Exception as e:
        logger.error(f"Get conversation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/agent/conversation/{session_id}")
async def clear_conversation(session_id: str):
    """Clear conversation history for a session."""
    try:
        if session_id not in agents:
            raise HTTPException(status_code=404, detail="Session not found")
        
        agent = agents[session_id]
        agent.clear_conversation()
        return {"message": "Conversation cleared"}
    except Exception as e:
        logger.error(f"Clear conversation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time chat."""
    await websocket.accept()
    
    connection = WebSocketConnection(websocket, session_id)
    websocket_connections[session_id] = connection
    
    try:
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "system",
            "message": f"Connected to AI Agent. Session ID: {session_id}",
            "timestamp": datetime.now().isoformat()
        }))
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "chat":
                user_message = message_data.get("message")
                
                # Process message with agent
                response = await connection.agent.process_message(user_message)
                
                # Send response back to client
                await websocket.send_text(json.dumps({
                    "type": "chat",
                    "message": response,
                    "timestamp": datetime.now().isoformat(),
                    "usage_stats": connection.agent.get_usage_stats()
                }))
            
            elif message_data.get("type") == "tool":
                tool_name = message_data.get("tool_name")
                parameters = message_data.get("parameters", {})
                
                # Execute tool
                result = connection.agent.execute_tool(tool_name, **parameters)
                
                # Send result back to client
                await websocket.send_text(json.dumps({
                    "type": "tool_result",
                    "tool_name": tool_name,
                    "result": result,
                    "timestamp": datetime.now().isoformat()
                }))
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        if session_id in websocket_connections:
            del websocket_connections[session_id]

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "active_sessions": len(agents),
        "websocket_connections": len(websocket_connections)
    }

@app.get("/stats")
async def get_server_stats():
    """Get server statistics."""
    total_conversations = sum(len(agent.conversation_history) for agent in agents.values())
    
    return {
        "active_sessions": len(agents),
        "websocket_connections": len(websocket_connections),
        "total_conversations": total_conversations,
        "config": {
            "model": config.get("default_model"),
            "safe_mode": config.get("safe_mode"),
            "web_search_enabled": config.get("enable_web_search"),
            "code_execution_enabled": config.get("enable_code_execution")
        }
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("AI Agent API server starting up...")
    logger.info(f"Configuration: {config.to_dict()}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("AI Agent API server shutting down...")
    # Save conversations if needed
    for session_id, agent in agents.items():
        try:
            agent.save_conversation(f"conversations/session_{session_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        except Exception as e:
            logger.error(f"Error saving conversation for session {session_id}: {e}")

if __name__ == "__main__":
    import uvicorn
    
    host = config.get("web_interface_host", "localhost")
    port = config.get("web_interface_port", 8000)
    
    logger.info(f"Starting AI Agent API server on {host}:{port}")
    
    uvicorn.run(
        "web_api:app",
        host=host,
        port=port,
        reload=True,
        log_level=config.get("log_level", "info").lower()
    )