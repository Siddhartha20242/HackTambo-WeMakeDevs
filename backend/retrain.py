from sqlmodel import Session, select, create_engine
from models import QTable
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

def retrain_habits():
    with Session(engine) as session:
        print(" Retraining Nexus...")

        
        scenarios = [
            "h19_d0_ctx_leetcode_dur_short", 
            "h19_d1_ctx_leetcode_dur_short", 
            "h19_d2_ctx_leetcode_dur_short",
            "h19_d3_ctx_leetcode_dur_short",
            "h19_d4_ctx_leetcode_dur_short",
        ]

        for state in scenarios:
            print(f"   -> Rewiring {state}...")

            statement_old = select(QTable).where(QTable.state_hash == state, QTable.action == "leetcode")
            entry_old = session.exec(statement_old).first()
            if entry_old:
                entry_old.q_value = -0.5 
                session.add(entry_old)

            statement_new = select(QTable).where(QTable.state_hash == state, QTable.action == "pomodoro")
            entry_new = session.exec(statement_new).first()
            if not entry_new:
                entry_new = QTable(state_hash=state, action="pomodoro", q_value=2.0)
                session.add(entry_new)
            else:
                entry_new.q_value = 2.0
                session.add(entry_new)

        session.commit()
        print(" Retraining Complete! LeetCode will now trigger Pomodoro.")

if __name__ == "__main__":
    retrain_habits()
