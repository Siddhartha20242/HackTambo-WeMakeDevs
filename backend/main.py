import os
import subprocess
import asyncio
import json
import time
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, Request
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

from agent import NexusAgent

load_dotenv()


groq_client = None
try:
    api_key = os.getenv("GROQ_API_KEY")
    if api_key:
        groq_client = Groq(api_key=api_key)
        print(" NEXUS AI: GROQ ONLINE")
    else:
        print("Missing GROQ_API_KEY")
except Exception as e:
    print(" Groq init error:", e)


agent = NexusAgent()
leetcode_active = True 
last_ai_call_time = 0
AI_COOLDOWN_SECONDS = 0 
latest_suggestion = None
last_ai_message = None
last_broadcast_tool = None


def check_browser_activity() -> tuple[Optional[str], Optional[str]]:
    script = 'tell application "System Events" to get name of first window of (processes whose frontmost is true)'
    try:
        result = subprocess.run(
            ["osascript", "-e", script],
            capture_output=True,
            text=True
        )
        title = result.stdout.strip().lower()
        if "leetcode" in title:
            return "leetcode", title
        return None, None
    except:
        return None, None

async def browser_watcher():
    global leetcode_active, last_broadcast_tool
    print(" Watcher started...")
    while True:
        try:
            activity, _ = check_browser_activity()

            if activity == "leetcode":
                leetcode_active = True
                if last_broadcast_tool != "leetcode":
                    print(" NEXUS AI: Watching LeetCode session")
                    last_broadcast_tool = "leetcode"
            else:
                leetcode_active = False
                if last_broadcast_tool:
                    print(" LeetCode closed")
                    last_broadcast_tool = None

        except Exception as e:
            print("Watcher error:", e)

        await asyncio.sleep(2)


@asynccontextmanager
async def lifespan(app: FastAPI):
    agent.load_brain()
    asyncio.create_task(browser_watcher())
    print("🧠 Nexus Brain ONLINE")
    yield
    print("🧠 Nexus Brain OFFLINE")

app = FastAPI(title="Nexus Brain", lifespan=lifespan)


@app.middleware("http")
async def cors(request: Request, call_next):
    if request.method == "OPTIONS":
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
        )
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response
class CodeSnippet(BaseModel):
    code: str
    problem: str
    timestamp: str

@app.post("/analyze-code")
def analyze_code(snippet: CodeSnippet):
    global last_ai_call_time, latest_suggestion
    print(f"📝 Analyzing: {snippet.problem}")
    

    if not snippet.code or len(snippet.code) < 15:
        return {"trigger": None}

    current_time = time.time()
    if current_time - last_ai_call_time < 15:
        return {"trigger": None}

    if groq_client and len(snippet.code) > 50:
        try:
            print("   ✨ Asking Groq AI...")
            last_ai_call_time = current_time
            
            prompt = f"""Analyze this code for "{snippet.problem}". Only report REAL bugs or errors.

Code:
{snippet.code[:400]}

Return ONLY raw JSON (no markdown, no backticks):
{{"status": "error", "message": "Brief 1-sentence bug explanation"}}
OR {{"status": "ok"}} if code looks reasonable.
"""
            
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a code analyzer. Return only JSON responses."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.3,
            )
            
            response_text = chat_completion.choices[0].message.content.strip()
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            
            if data.get("status") == "error":
                print(f"   🤖 BUG FOUND: {data['message']}")
                latest_suggestion = {
                    "trigger": "warning",
                    "message": data['message']
                }
                return latest_suggestion
                
        except Exception as e:
            print(f"    AI Error: {str(e)[:80]}")
    
    return {"trigger": None}
# =========================
@app.get("/notifications")
def notifications():
    global latest_suggestion
    if latest_suggestion:
        msg = latest_suggestion
        latest_suggestion = None
        return msg
    return {}


@app.get("/")
def health():
    return {"status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
