from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class QTable(SQLModel, table=True):
    """
    KNOWLEDGE BASE: Stores the Q-values.
    Primary Key is a composite of 'State' and 'Action'.
    """
    state_hash: str = Field(primary_key=True, index=True) 
    action: str = Field(primary_key=True)                 
    q_value: float = Field(default=0.0)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class Interaction(SQLModel, table=True):
    """
    HISTORY LOG: Records every 'Approve' or 'Reject' click.
    Used for Session Detection and Analytics.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_name: str
    action: str
    reward: float  # +1.0 for Approve, -1.0 for Reject
    approved: bool
    confidence: float
    was_exploration: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)