# AI Circuit Diagram Maker - Project Roadmap

This document outlines the step-by-step plan to build a production-ready AI Circuit Diagram Maker for TechWatt.ai.

## 1. Project Overview
*   **Goal**: Create a web app where students input a component name or circuit description, and the AI generates a downloadable circuit diagram.
*   **Tech Stack**:
    *   **Frontend**: React.js (Vite), TailwindCSS, React Flow (for diagram rendering).
    *   **Backend**: Python (FastAPI), Google Gemini API (for logic & generation).
    *   **Theme**: TechWatt.ai Corporate Theme.

## 2. Directory Structure
```
/Circuit Diagram Maker
  ├── /backend          # Python FastAPI Server
  ├── /frontend         # React Vite Application
  ├── ROADMAP.md        # This file
  └── README.md         # Project documentation
```

## 3. Implementation Phases

### Phase 1: Environment Setup
1.  **Initialize Project Root**: Set up folders.
2.  **Backend Setup**:
    *   Create python virtual environment (`venv`).
    *   Install: `fastapi`, `uvicorn`, `google-generativeai`, `python-dotenv`, `pydantic`.
    *   Create `.env` for the Gemini API Key.
3.  **Frontend Setup**:
    *   Initialize Vite React project.
    *   Install: `axios`, `react-flow-renderer` (or `@xyflow/react`), `tailwindcss`, `framer-motion` (for animations), `html-to-image` (for downloading).

### Phase 2: Backend Development (The Core Logic)
1.  **API Structure**: Setup `main.py` with FastAPI.
2.  **Gemini Integration**:
    *   Initialize the Gemini client with the provided API Key.
    *   **Prompt Engineering**: This is critical. We need a prompt that takes a user query (e.g., "555 Timer Astable Multivibrator") and outputs **Structured JSON** compatible with our frontend renderer.
    *   *Strategy*: We will ask Gemini to generate a list of `nodes` (components) and `edges` (connections) with positioning hints if possible, or use a layout algorithm on the frontend.
3.  **Endpoints**:
    *   `POST /generate-circuit`: Accepts `{ prompt: str }`, returns `{ nodes: [], edges: [] }`.
    *   Health check endpoint.

### Phase 3: Frontend Development (The UI)
1.  **Layout**: Create a modern, "TechWatt" branded layout with a sidebar/header and a large canvas area.
2.  **Input Component**: A sleek input bar for the student to type the component name.
3.  **Diagram Renderer**:
    *   Implement **React Flow** to render the nodes and edges returned by the backend.
    *   Create custom Nodes for components (Resistor, Capacitor, IC, Voltage Source, etc.) using SVG icons.
4.  **Download Feature**:
    *   Add a "Download/Export" button that converts the React Flow canvas to a PNG/JPG using `html-to-image`.

### Phase 4: Branding & Polish
1.  **TechWatt Theme**:
    *   Apply correct color palette (Primary, Secondary, Backgrounds).
    *   Use modern fonts (Google Fonts: Inter or Roboto).
2.  **UX Enhancement**:
    *   Loading states (Spinners/Skeletons) while Gemini thinks.
    *   Error handling (e.g., "I couldn't understand that component, try again").
    *   Tooltips explaining the circuit.

### Phase 5: Production Readiness
1.  **Optimizations**: Ensure fast bundle size.
2.  **Security**: CORS settings, Basic rate limiting.
3.  **Deployment Prep**: `requirements.txt` for backend, `build` scripts for frontend.

## 4. Immediate Next Steps
1.  Create the folder structure.
2.  Install dependencies.
3.  Build the "Hello World" of the AI generation to verify the key works.
