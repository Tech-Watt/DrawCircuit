import os
import json
import uuid
from datetime import datetime
from typing import Optional
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import sqlalchemy
from database import database, circuits, components, metadata



# Load environment variables
load_dotenv()

# --- CONFIGURATION ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("No OPENAI_API_KEY found.")

client = OpenAI(api_key=OPENAI_API_KEY)
model_name = os.getenv("OPENAI_MODEL", "gpt-4o")

# Initialize FastAPI
app = FastAPI(title="TechWatt Circuit AI")

# Database startup/shutdown
@app.on_event("startup")
async def startup():
    await database.connect()
    engine = sqlalchemy.create_engine(str(database.url))
    metadata.create_all(engine)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://techwatt-drawcircuit-production-fb0d.up.railway.app",
    "https://www.circuit.techwatt.ai",
    "https://circuit.techwatt.ai",
    FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CLOUDINARY CONFIG ---
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, File

cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET") 
)

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Upload the file to Cloudinary
        result = cloudinary.uploader.upload(file.file, folder="robotics_components")
        return {"url": result.get("secure_url")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

# --- MODELS ---
from typing import Optional, List, Union

# ...

class ComponentRequest(BaseModel):
    name: str
    description: str
    category: str
    wiring_guide: Optional[str] = None
    image_url: Optional[Union[str, List[str]]] = None

class ComponentResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str
    wiring_guide: Optional[str] = None
    image_url: Optional[Union[str, List[str]]] = None
    created_at: datetime

class CircuitRequest(BaseModel):
    query: str

class SaveRequest(BaseModel):
    query: str
    diagram_data: dict
    code: str = ""
    bom: list = []

class CircuitResponse(BaseModel):
    nodes: list
    connections: list
    explanation: str

class CodeResponse(BaseModel):
    code: str
    explanation: str

class BOMResponse(BaseModel):
    items: list
    total_estimated_cost: str
    notes: Optional[str] = None

class ComponentGenRequest(BaseModel):
    name: str
    category: str

class ComponentGenResponse(BaseModel):
    description: str
    wiring_guide: str

class PasswordVerifyRequest(BaseModel):
    password: str

@app.post("/api/generate-component-details", response_model=ComponentGenResponse)
async def generate_component_details(request: ComponentGenRequest):
    try:
        prompt = f"""
        You are an expert robotics teacher for kids. 
        Write a fun, kid-friendly explanation for a robotics component.
        
        Component Name: {request.name}
        Category: {request.category}
        
        Output JSON format only:
        {{
            "description": "A fun explanation using analogies (e.g. 'The Brain', 'The Muscle'). Use emojis.",
            "wiring_guide": "Simple step-by-step wiring instructions for Arduino."
        }}
        """
        
        completion = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        content = json.loads(completion.choices[0].message.content)
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/verify-password")
async def verify_password(request: PasswordVerifyRequest):
    expected_password = os.getenv("ADMIN_PASSWORD", "techwatt123")
    if request.password == expected_password:
        return {"valid": True}
    else:
        raise HTTPException(status_code=401, detail="Invalid password")

# --- PROMPTS ---
SYSTEM_PROMPT_DIAGRAM = """
You are an expert Electronics Engineer creating WIRING DIAGRAMS for TechWatt.ai.
STRUCTURE: One MAIN controller in center, Peripherals around it.
OUTPUT JSON ONLY:
{
    "nodes": [
        {"id": "mcu", "label": "Arduino UNO", "type": "Microcontroller", "pins": ["5V", "GND", "D2", "A0", ...]},
        {"id": "s1", "label": "HC-SR04", "type": "Sensor", "pins": ["VCC", "TRIG", "ECHO", "GND"]}
    ],
    "connections": [
        {"id": "c1", "from": "mcu", "fromPin": "5V", "to": "s1", "toPin": "VCC", "color": "red"}
    ],
    "explanation": "Brief description."
}
RULES: 
- Wire colors: red (power), black (ground), blue/green/yellow (data).
- Pins: Use standard pin names.
"""

SYSTEM_PROMPT_CODE = """
You are an expert Firmware Engineer. Write PRODUCTION-READY code for the described circuit.
If an Arduino/ESP is used, write C++ (Arduino). If Raspberry Pi, write Python.
Include specific pin definitions based on the user's wiring request.
OUTPUT JSON ONLY:
{
    "code": "#include ... void setup() { ... }",
    "explanation": "Key logic summary."
}
"""

SYSTEM_PROMPT_BOM = """
You are a Sourcing Engineer. Create a detailed Bill of Materials (BOM).
Your goal is to estimate the CURRENT ONLINE MARKET PRICE for each component.
- Check major distributors like DigiKey, Mouser, Adafruit, and Amazon in your internal knowledge base.
- Provide a realistic estimated price range or average.
- If a specific part number is common (e.g., "Arduino Uno R3", "HC-SR04"), use that pricing.

OUTPUT JSON ONLY:
{
    "items": [
        {"component": "Arduino UNO R3", "quantity": 1, "estimated_price": "$24.95", "source": "Average Online"},
        {"component": "HC-SR04 Ultrasonic Sensor", "quantity": 1, "estimated_price": "$3.50", "source": "Common Retailer"}
    ],
    "total_estimated_cost": "$28.45",
    "notes": "Prices are estimated based on average online listings."
}
"""

# --- ENDPOINTS ---

@app.get("/api/components", response_model=list[ComponentResponse])
async def get_components():
    query = components.select().order_by(components.c.name)
    results = await database.fetch_all(query)
    return [dict(r) for r in results]

@app.post("/api/components", response_model=ComponentResponse)
async def create_component(request: ComponentRequest):
    try:
        query = components.insert().values(
            name=request.name,
            description=request.description,
            category=request.category,
            wiring_guide=request.wiring_guide,
            image_url=request.image_url,
            created_at=datetime.utcnow()
        )
        last_record_id = await database.execute(query)
        return {
            **request.dict(),
            "id": last_record_id,
            "created_at": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/components/{component_id}", response_model=ComponentResponse)
async def get_component(component_id: int):
    query = components.select().where(components.c.id == component_id)
    result = await database.fetch_one(query)
    if not result:
        raise HTTPException(status_code=404, detail="Component not found")
    return dict(result)

@app.put("/api/components/{component_id}", response_model=ComponentResponse)
async def update_component(component_id: int, request: ComponentRequest):
    query = components.update().where(components.c.id == component_id).values(
        name=request.name,
        description=request.description,
        category=request.category,
        wiring_guide=request.wiring_guide,
        image_url=request.image_url
    )
    await database.execute(query)
    
    # Fetch updated record
    fetch_query = components.select().where(components.c.id == component_id)
    result = await database.fetch_one(fetch_query)
    if not result:
         raise HTTPException(status_code=404, detail="Component not found")
    return dict(result)

@app.delete("/api/components/{component_id}")
async def delete_component(component_id: int):
    query = components.delete().where(components.c.id == component_id)
    await database.execute(query)
    return {"message": "Component deleted successfully"}


@app.post("/api/generate", response_model=CircuitResponse)
async def generate_circuit(request: CircuitRequest):
    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_DIAGRAM},
                {"role": "user", "content": f"Create wiring diagram for: {request.query}"}
            ],
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
        data.setdefault("nodes", [])
        data.setdefault("connections", [])
        data.setdefault("explanation", "")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-code", response_model=CodeResponse)
async def generate_code(request: CircuitRequest):
    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_CODE},
                {"role": "user", "content": f"Write code for: {request.query}"}
            ],
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-bom", response_model=BOMResponse)
async def generate_bom(request: CircuitRequest):
    try:
        completion = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_BOM},
                {"role": "user", "content": f"Create BOM for: {request.query}"}
            ],
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save")
async def save_circuit(request: SaveRequest):
    # PUBLIC SAVE
    try:
        circuit_id = str(uuid.uuid4())[:8]
        query = circuits.insert().values(
            id=circuit_id,
            user_id=None, # Anonymous
            query=request.query,
            diagram_data=request.diagram_data,
            code=request.code,
            bom=request.bom,
            created_at=datetime.utcnow()
        )
        await database.execute(query)
        return {"id": circuit_id, "message": "Saved successfully"}
    except Exception as e:
        print(f"Save error: {e}")
        raise HTTPException(status_code=500, detail="Database error")

@app.get("/api/recent")
async def get_recent_circuits(limit: int = 10):
    # PUBLIC HISTORY - Global recent
    try:
        query = circuits.select().order_by(sqlalchemy.desc(circuits.c.created_at)).limit(limit)
        results = await database.fetch_all(query)
        return [
            {
                "id": r["id"],
                "query": r["query"],
                "created_at": r["created_at"]
            }
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/circuit/{circuit_id}")
async def load_circuit(circuit_id: str):
    query = circuits.select().where(circuits.c.id == circuit_id)
    result = await database.fetch_one(query)
    if not result:
        raise HTTPException(status_code=404, detail="Circuit not found")
    
    return {
        "id": result["id"],
        "query": result["query"],
        "diagram_data": result["diagram_data"],
        "code": result["code"],
        "bom": result["bom"],
        "created_at": result["created_at"]
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
