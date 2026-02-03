import datetime
import random
import math
from typing import Dict, Tuple, List
from sqlmodel import Session, select, func
from models import QTable, Interaction

class NexusAgent:
    def __init__(self, alpha: float = 0.1, gamma: float = 0.9, epsilon: float = 0.2):
        self.alpha = alpha      # Learning Rate
        self.gamma = gamma      # Future Discount
        self.epsilon = epsilon  # Exploration Rate
        self.tools = ["pomodoro", "leetcode", "grade-calc", "resources"]

    # --- 1. STATE ENCODER ---
    def encode_state(self, hour: int, day: int, context: str, session_mins: float) -> str:
        """
        Hashes environment into a unique ID.
        Example: "h14_d1_ctx_dashboard_dur_medium"
        """
        # Bucket the duration (Short < 30m, Medium < 90m, Long > 90m)
        if session_mins < 30:
            bucket = "short"
        elif session_mins < 90:
            bucket = "medium"
        else:
            bucket = "long"
        
        clean_context = context.lower().strip().replace(" ", "_")
        return f"h{hour}_d{day}_ctx_{clean_context}_dur_{bucket}"

    # --- 2. PREDICTION ---
    def predict(self, state_hash: str, db: Session, force_explore: bool = False) -> Tuple[str, float, bool]:
        """
        Returns: (selected_action, confidence_score, was_exploration)
        """
        # A. Fetch known Q-values for this state
        statement = select(QTable).where(QTable.state_hash == state_hash)
        results = db.exec(statement).all()
        q_map = {row.action: row.q_value for row in results}

        # B. Decide: Explore vs Exploit
        # Explore if forced, or random roll < epsilon, or no memory exists
        is_exploring = force_explore or (random.random() < self.epsilon) or (not q_map)

        if is_exploring:
            chosen_action = random.choice(self.tools)
            confidence = 0.0
            was_exploration = True
        else:
            # Exploit: Pick max Q-value
            chosen_action = max(q_map, key=q_map.get)
            confidence = self._calculate_confidence(q_map[chosen_action])
            was_exploration = False

        return chosen_action, confidence, was_exploration

    # --- 3. LEARNING (UPDATE) ---
    def update(self, state_hash: str, action: str, reward: float, db: Session):
        """
        Applies Bellman Equation: Q_new = Q_old + alpha * (Reward - Q_old)
        """
        statement = select(QTable).where(QTable.state_hash == state_hash, QTable.action == action)
        entry = db.exec(statement).first()

        if not entry:
            entry = QTable(state_hash=state_hash, action=action, q_value=0.0)
            db.add(entry)
        
        current_q = entry.q_value
        # Simplified Bellman for immediate feedback
        new_q = current_q + self.alpha * (reward - current_q)
        
        entry.q_value = round(new_q, 4)
        entry.last_updated = datetime.datetime.utcnow()
        
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return new_q

    # --- 4. UTILITIES ---
    def get_session_duration(self, user_name: str, db: Session) -> float:
        """Returns minutes active today."""
        today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0)
        first_log = db.exec(
            select(Interaction)
            .where(Interaction.user_name == user_name, Interaction.timestamp >= today)
            .order_by(Interaction.timestamp.asc())
        ).first()

        if first_log:
            elapsed = datetime.datetime.utcnow() - first_log.timestamp
            return elapsed.total_seconds() / 60.0
        return 0.0

    def get_stats(self, db: Session) -> Dict:
        """Returns learning statistics."""
        total = db.exec(select(func.count(Interaction.id))).one()
        approved = db.exec(select(func.count(Interaction.id)).where(Interaction.approved == True)).one()
        q_size = db.exec(select(func.count(QTable.state_hash))).one()
        
        return {
            "total_interactions": total,
            "approval_rate": round(approved / total, 2) if total > 0 else 0,
            "q_table_size": q_size,
            "epsilon": self.epsilon
        }

    def _calculate_confidence(self, q_value: float) -> float:
        """Sigmoid function: Turns Score into 0.0-1.0 confidence."""
        try:
            return round(1 / (1 + math.exp(-q_value)), 2)
        except OverflowError:
            return 1.0 if q_value > 0 else 0.