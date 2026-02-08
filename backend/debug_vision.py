import subprocess
import time

print("🕵️ Starting Vision Debugger...")
print("Please switch to your LeetCode tab now!")

for i in range(5):
    time.sleep(2)
    print(f"\n--- Check {i+1}/5 ---")

    script = 'tell application "System Events" to get name of first window of (processes whose frontmost is true)'
    try:
        result = subprocess.run(['osascript', '-e', script], capture_output=True, text=True)
        title = result.stdout.strip()
        print(f"👀 ACTIVE WINDOW: '{title}'")
        
        if "LeetCode" in title:
            print(" SUCCESS! LeetCode detected.")
        else:
            print(" No 'LeetCode' found in title.")
            
    except Exception as e:
        print(f" ERROR: {e}")

print("\nDone.")