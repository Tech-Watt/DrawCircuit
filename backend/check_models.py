import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

print("Listing available models...")
# The new SDK might have a different way to list models, assume standard for now or just skip if complex
# client.models.list() is likely the way
try:
    for m in client.models.list():
        print(m.name)
except Exception as e:
    print(f"Error listing models: {e}")
