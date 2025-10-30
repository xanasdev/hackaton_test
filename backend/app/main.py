from fastapi import FastAPI
from typing import Union

app = FastAPI(title="Hackathon Test API", description="Simple API")

@app.get("/")
def read_root():
    """Return a simple welcome message"""
    return {"message": "Welcome!"}

@app.get("/text")
def read_text():
    """Return a simple text response"""
    return {"text": "This is a simple text output from the backend"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    """Return an item with optional query parameter"""
    return {"item_id": item_id, "q": q}

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}





