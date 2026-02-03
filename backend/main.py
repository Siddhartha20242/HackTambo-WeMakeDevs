import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, create_engine, SQLModel
from pydantic import BaseModel
from dotenv import load_dotenv

from models import QTable, Interaction
from agent import NexusAgent

load_dotenv()

# Database Setup
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, echo=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(title="Nexus Brain", lifespan=lifespan)
agent = NexusAgent()

# CORS: Allow Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_session():
    with Session(engine) as session:
        yield session

# --- SCHEMAS ---
class PredictRequest(BaseModel):
    user_name: str
    context: str = "dashboard"
    force_explore: bool = False

class FeedbackRequest(BaseModel):
    user_name: str
    action: str
    state_hash: str
    approved: bool
    confidence: float
    was_exploration: bool

# --- ENDPOINTS ---

@app.get("/")
def health():
    return {"status": "online", "brain": "active"}

@app.get("/stats")
def stats(db: Session = Depends(get_session)):
    return agent.get_stats(db)






class PredictRequest(BaseModel):
    user_name: str
    context: str = "dashboard"
    force_explore: bool = False

@app.post('/predict')
def predict_tool(req:PredictRequest, db: Session = Depends(get_session)):
    import datetime
    now = datetime.datetime.now()

    duration_mins = agent.get_session_duration(req.user_name, db)

    state_hash = agent.encode_state(
        hour = now.hour,
        day = now.weekday(),
        context = req.context,
        session_mins = duration_mins
    )

    tools_name, confidence, is_exploration = agent.predict(
        state_hash = state_hash,
        db = db,
        force_explore = req.force_explore
    )

    return{
        "tool": tools_name,
        "confidence": confidence,
        "state_hash": state_hash,
        "is_exploration": is_exploration,
        "session_minutes": round(duration_mins, 1)
    }

class FeedbackRequest(BaseModel):
    user_name: str 
    action: str 
    state_hash = str
    approved: bool
    confidence: float
    was_exploration: bool


@app.post('/record-feedback')
def record_feedback(req: FeedbackRequest, db:Session = Depends(get_session)):
    















@app.post("/feedback")
def submit_feedback(req: FeedbackRequest, db: Session = Depends(get_session)):
    # 1. Calculate Reward
    reward = 1.0 if req.approved else -1.0
    
    # 2. Update Brain
    new_q = agent.update(req.state_hash, req.action, reward, db)
    
    # 3. Log History
    log = Interaction(
        user_name=req.user_name,
        action=req.action,
        reward=reward,
        approved=req.approved,
        confidence=req.confidence,
        was_exploration=req.was_exploration
    )
    db.add(log)
    db.commit()
    
    return {"status": "learned", "new_q": new_q}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)