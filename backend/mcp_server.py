from fastmcp import FastMCP
import subprocess
import time


mcp = FastMCP("Nexus-Watcher")

def get_active_window_title_macos():
    """
    Asks macOS for the name of the currently active window using AppleScript.
    Returns: str (Window Title) or None
    """
    script = 'tell application "System Events" to get name of first window of (processes whose frontmost is true)'
    try:
        result = subprocess.run(
            ['osascript', '-e', script], 
            capture_output=True, 
            text=True
        )
        return result.stdout.strip()
    except Exception as e:
        return None

@mcp.tool()
def check_leetcode_status() -> dict:
    """
    Checks if the user is currently looking at a LeetCode tab.
    """
    title = get_active_window_title_macos()
    
    if title and "LeetCode" in title:
        return {
            "status": "ACTIVE",
            "app": "LeetCode",
            "window": title,
            "timestamp": time.time()
        }
    else:
        return {
            "status": "INACTIVE",
            "current_focus": title,
            "timestamp": time.time()
        }

@mcp.resource("browser://active_tab")
def get_active_tab() -> str:
    """
    Returns the raw title of the active window for debugging.
    """
    return get_active_window_title_macos() or "Unknown"

if __name__ == "__main__":
    mcp.run()