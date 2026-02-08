import datetime
import random
import math
from typing import Dict, Tuple, List
from sqlmodel import Session, select, func
from models import QTable, Interaction



class NexusAgent:
    def __init__(self, alpha: float = 0.1, gamma: float = 0.9, epsilon: float = 0.4):
        self.alpha = alpha      
        self.gamma = gamma      
        self.epsilon = epsilon  
        self.tools = ["pomodoro", "grade-calc", "resources", "leetcode"] 
        
        self.last_suggestion = None 
        self.last_suggestion_time = None 

    def encode_state(self, hour: int, day: int, context: str, session_mins: float) -> str:
        if session_mins < 30: bucket = "short"
        elif session_mins < 90: bucket = "medium"
        else: bucket = "long"
        clean_context = context.lower().strip().replace(" ", "_")
        return f"h{hour}_d{day}_ctx_{clean_context}_dur_{bucket}"

    def predict(self, state_hash: str, db: Session, force_explore: bool = False) -> Tuple[str, float, bool]:
        statement = select(QTable).where(QTable.state_hash == state_hash)
        results = db.exec(statement).all()
        q_map = {row.action: row.q_value for row in results}

        for tool in self.tools:
            if tool not in q_map: q_map[tool] = 0.0

        try:
            current_hour = int(state_hash.split('_')[0][1:]) 
        except:
            current_hour = 12

        if 6 <= current_hour <= 11:
            q_map["pomodoro"] += 0.3
            
        # Bias 2: Sequence Boost
        if self.last_suggestion == "grade-calc":
            q_map["pomodoro"] += 0.4
            q_map["leetcode"] += 0.2

        forbidden_tools = []
        if self.last_suggestion and self.last_suggestion_time:
            elapsed_mins = (datetime.datetime.utcnow() - self.last_suggestion_time).total_seconds() / 60.0
 
            if elapsed_mins < 5.0:
                forbidden_tools.append(self.last_suggestion)

        all_zeros = all(v == 0.0 for v in q_map.values())
        is_exploring = force_explore or (random.random() < self.epsilon) or (all_zeros and not self.last_suggestion)

        if is_exploring:

            available = [t for t in self.tools if t not in forbidden_tools]

            if not available: available = self.tools 
            
            chosen_action = random.choice(available)
            confidence = 0.0
            was_exploration = True
        else:

            for bad_tool in forbidden_tools:
                if bad_tool in q_map:
                    q_map[bad_tool] = -999.0

            max_val = max(q_map.values())
            best_actions = [action for action, score in q_map.items() if score == max_val]
            
            chosen_action = random.choice(best_actions)
            confidence = self._calculate_confidence(q_map[chosen_action])
            was_exploration = False

        self.last_suggestion = chosen_action
        self.last_suggestion_time = datetime.datetime.utcnow()
        
        return chosen_action, confidence, was_exploration

    def update(self, state_hash: str, action: str, reward: float, db: Session):
        statement = select(QTable).where(QTable.state_hash == state_hash, QTable.action == action)
        entry = db.exec(statement).first()

        old_q = 0.0
        if not entry:
            entry = QTable(state_hash=state_hash, action=action, q_value=0.0)
            db.add(entry)
        else:
            old_q = entry.q_value

        new_q = old_q + self.alpha * (reward - old_q)
        
        entry.q_value = round(new_q, 4)
        entry.last_updated = datetime.datetime.utcnow()
        
        db.add(entry)
        db.commit()
        db.refresh(entry)

        arrow = "⬆️" if new_q > old_q else "⬇️"
        print(f"\n🧠 [LEARNING] {action.upper()}")
        print(f"   Context: {state_hash}")
        print(f"   Reward:  {reward}")
        print(f"   Q-Value: {old_q:.4f} {arrow} {new_q:.4f}\n")

        return new_q

    def get_session_duration(self, user_name: str, db: Session) -> float:
        today = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0)
        first_log = db.exec(
            select(Interaction).where(Interaction.user_name == user_name, Interaction.timestamp >= today).order_by(Interaction.timestamp.asc())
        ).first()
        if first_log:
            return (datetime.datetime.utcnow() - first_log.timestamp).total_seconds() / 60.0
        return 0.0

    def get_stats(self, db: Session) -> Dict:
        try:
            total = db.exec(select(func.count(Interaction.id))).one()
            approved = db.exec(select(func.count(Interaction.id)).where(Interaction.approved == True)).one()
            q_size = db.exec(select(func.count(QTable.state_hash))).one()
        except: return {"status": "Initializing..."}
        return {"total_interactions": total, "approval_rate": round(approved/total,2) if total>0 else 0, "q_table_size": q_size, "epsilon": self.epsilon}

    def _calculate_confidence(self, q_value: float) -> float:
        try: return round(1 / (1 + math.exp(-q_value)), 2)
        except OverflowError: return 1.0 if q_value > 0 else 0.0

    def save_brain(self): pass
    def load_brain(self): pass