# backend/poem_api.py

import os
import requests
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()
API_URL = "https://api-inference.huggingface.co/models/gpt2"
HEADERS = {"Authorization": f"Bearer hf_VERBATIM_API_KEY"}

class Req(BaseModel):
    prompt: str
    temperature: float = Field(1.2, ge=0.0, le=5.0)
    repetition_penalty: float = Field(1.0, ge=0.5, le=5.0)

@app.post("/complete")
def complete(req: Req):
    payload = {
        "inputs": req.prompt,
        "parameters": {
            "max_new_tokens": 50,
            "temperature": req.temperature,
            "top_p": 0.8,
            "top_k": 50,
            "repetition_penalty": req.repetition_penalty,
        },
    }
    r = requests.post(API_URL, headers=HEADERS, json=payload)
    r.raise_for_status()
    data = r.json()
    poem = "\n".join(item["generated_text"] for item in data)
    return {"poem": poem}
