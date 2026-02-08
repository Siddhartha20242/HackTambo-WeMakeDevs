from sqlmodel import SQLModel, Field
from typing import Optional
import datetime


class QTable(SQLModel, table=True):
    state_hash: str = Field(primary_key=True)
    action: str = Field(primary_key=True)
    q_value: float = 0.0
    last_updated: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

class Interaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_name: str
    action: str
    reward: float
    approved: bool
    confidence: float
    was_exploration: bool
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)


class Grade(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subject: str
    credit_hours: int
    grade_point: float 

class Resource(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    type: str  
    url: str
    tags: str 