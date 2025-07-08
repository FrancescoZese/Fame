from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Permetti richieste dal frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In produzione, metti il dominio reale!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HF_TOKEN = ""  # Inserisci qui il tuo token Hugging Face

@app.post("/mealplan/generate")
async def generate_mealplan(request: Request):
    body = await request.json()
    prompt = body.get("prompt")
    response = requests.post(
        "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
        headers={"Authorization": f"Bearer {HF_TOKEN}"},
        json={"inputs": prompt}
    )
    print("Status code:", response.status_code)
    print("Risposta AI:", response.text)
    try:
        return response.json()
    except Exception as e:
        print("Errore nel parsing JSON:", e)
        return {"error": response.text}


