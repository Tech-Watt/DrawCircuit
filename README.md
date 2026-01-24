# TechWatt Circuit AI

AI-powered wiring diagram generator. Describe your circuit and get an interactive diagram with pin-to-pin connections.

## Features

- 🤖 AI-powered circuit diagram generation
- 🔌 Pin-to-pin wiring visualization
- 🎨 Color-coded wires (power, ground, signals)
- 📤 Export diagrams as PNG
- 🖱️ Interactive drag-and-drop

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS, ReactFlow
- **Backend:** Python, FastAPI, OpenAI API

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your-api-key-here" > .env

# Run server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Deployment on Railway

### Option 1: Separate Services (Recommended)

Deploy backend and frontend as separate Railway services:

#### Backend Service
1. Create new service from `backend` folder
2. Set environment variables:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `FRONTEND_URL` - Your frontend URL (for CORS)
3. Deploy

#### Frontend Service
1. Create new service from `frontend` folder
2. Set environment variable:
   - `VITE_API_URL` - Your backend URL
3. Deploy

### Option 2: Monorepo (Single Service)

1. Build frontend: `cd frontend && npm run build`
2. Copy `frontend/dist` to `backend/static`
3. Deploy `backend` folder

### Environment Variables

**Backend:**
| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `OPENAI_MODEL` | Model name (default: gpt-4o) | No |
| `FRONTEND_URL` | Frontend URL for CORS | Yes (production) |
| `PORT` | Server port (auto-set by Railway) | No |

**Frontend:**
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes (production) |

## License

MIT - TechWatt.ai
