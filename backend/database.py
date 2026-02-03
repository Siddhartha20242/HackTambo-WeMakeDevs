import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel

load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")


engine = create_engine(DATABASE_URL, echo=True) 

def init_db():
   print("Initializing database....")
   SQLModel.metadata.create_all(engine)
   print("Tables Created successfully!")


def get_session():
    """Provides a temporary database session for a single request."""
    with Session(engine) as session:
        yield session