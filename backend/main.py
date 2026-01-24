import os
import json
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI
api_key = os.getenv("OPENAI_API_KEY")
model_name = os.getenv("OPENAI_MODEL", "gpt-4o")

if not api_key:
    raise ValueError("No OPENAI_API_KEY found. Please set it in environment variables.")

client = OpenAI(api_key=api_key)

# Initialize FastAPI
app = FastAPI(title="TechWatt Circuit AI")

# Get allowed origins from environment or use defaults
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://techwatt-drawcircuit-production-fb0d.up.railway.app",  # Railway Frontend
    "https://www.circuit.techwatt.ai",  # Custom Domain
    "https://circuit.techwatt.ai", # Allow non-www too just in case
    FRONTEND_URL,
]

# CORS
# Check if we are in production to potentially allow all for troubleshooting
ALLOW_ALL_ORIGINS = os.getenv("ALLOW_ALL_ORIGINS", "false").lower() == "true"

if ALLOW_ALL_ORIGINS:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class CircuitRequest(BaseModel):
    query: str

class CircuitResponse(BaseModel):
    nodes: list
    connections: list
    explanation: str

# System Prompt for Wiring Diagram Generation
SYSTEM_PROMPT = """
You are an expert Electronics Engineer creating WIRING DIAGRAMS for TechWatt.ai.

Your task: Generate a JSON wiring diagram showing how components connect to a microcontroller.

STRUCTURE:
- One MAIN controller (Arduino, ESP32, Raspberry Pi, etc.) in the center
- Peripheral components (sensors, LEDs, motors, displays) around it
- Clear pin-to-pin connections with wire colors

OUTPUT FORMAT (JSON only):
{
    "nodes": [
        {
            "id": "mcu",
            "label": "Arduino UNO",
            "type": "Microcontroller",
            "pins": ["5V", "3.3V", "GND", "D2", "D3", "D4", "D5", "D6", "D7", "A0", "A1"]
        },
        {
            "id": "sensor1",
            "label": "HC-SR04",
            "type": "Sensor",
            "pins": ["VCC", "TRIG", "ECHO", "GND"]
        }
    ],
    "connections": [
        {
            "id": "c1",
            "from": "mcu",
            "fromPin": "5V",
            "to": "sensor1",
            "toPin": "VCC",
            "color": "red"
        },
        {
            "id": "c2",
            "from": "mcu",
            "fromPin": "GND",
            "to": "sensor1",
            "toPin": "GND",
            "color": "black"
        },
        {
            "id": "c3",
            "from": "mcu",
            "fromPin": "D2",
            "to": "sensor1",
            "toPin": "TRIG",
            "color": "blue"
        }
    ],
    "explanation": "This circuit connects an HC-SR04 ultrasonic sensor to Arduino UNO for distance measurement."
}

RULES:
1. nodes: Each has id, label, type, and pins array
2. type: Use "Microcontroller" for the main board, "Sensor", "Actuator", "Display", "LED", "Motor" for others
3. pins: List the relevant pins for that component
4. connections: Each wire has from (node id), fromPin, to (node id), toPin, color
5. color: "red" for power (5V/3.3V), "black" for GND, "blue"/"green"/"yellow"/"orange"/"purple" for signals
6. Return ONLY valid JSON, no markdown
"""

@app.post("/api/generate", response_model=CircuitResponse)
async def generate_circuit(request: CircuitRequest):
    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Create a wiring diagram for: {request.query}"}
            ],
            response_format={"type": "json_object"}
        )
        
        response_content = completion.choices[0].message.content
        data = json.loads(response_content)
        
        # Ensure required fields exist
        if "nodes" not in data:
            data["nodes"] = []
        if "connections" not in data:
            data["connections"] = []
        if "explanation" not in data:
            data["explanation"] = ""
            
        return data

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Please try again.")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "TechWatt Circuit AI"}

# Serve static files in production
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
