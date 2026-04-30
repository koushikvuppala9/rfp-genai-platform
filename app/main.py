from fastapi import FastAPI

from app.api.router import api_router
from app.core.logging import setup_logging

logger = setup_logging()

app = FastAPI(title="RFP GenAI")

app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "RFP GenAI API running"}
