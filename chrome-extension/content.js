console.log("👁️ NEXUS: Real Component Mode");

const WIDGET_URL = "http://localhost:3000/leetcode-widget"; 

function injectRealDashboard() {
    if (document.getElementById("nexus-frame")) return;

    const frame = document.createElement("iframe");
    frame.id = "nexus-frame";
    frame.src = WIDGET_URL;
    
   frame.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 500px;
    border: none;
    z-index: 2147483647;
    background: transparent;
    pointer-events: all;
`;
    document.body.appendChild(frame);
    console.log("✅ Iframe injected");
}

if (window.location.href.includes("/problems/")) {
    injectRealDashboard();
    

    setTimeout(() => {
        startAIPolling();
    }, 2000);
}

function startAIPolling() {
    console.log("🔄 Polling started");
    setInterval(async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/notifications");
            const data = await response.json();
            
            if (data.message) {
                console.log("📨 AI says:", data.message);
                
                // Send to iframe
                const frame = document.getElementById("nexus-frame");
                if (frame && frame.contentWindow) {
                    console.log(" Sending to iframe:", data); 
                    frame.contentWindow.postMessage({ 
                        type: "UPDATE_FEEDBACK", 
                        data: data 
                    }, "*");
                    console.log("✉️ Message sent to iframe"); 
                } else {
                    console.error(" Frame not found or no contentWindow");
                }
            }
        } catch (err) {
            console.error("Poll error:", err);
        }
    }, 2000);
}


let lastCode = "";
setInterval(() => {
    const editor = document.querySelector('[class*="view-line"]');
    if (editor) {
        const code = editor.innerText || "";
        if (code !== lastCode && code.length > 10) {
            lastCode = code;
            sendCodeToBackend(code);
        }
    }
}, 3000);

async function sendCodeToBackend(code) {
    try {
        const problemTitle = document.querySelector('[data-cy="question-title"]')?.innerText || "Unknown";
        
        await fetch("http://127.0.0.1:8000/analyze-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: code,
                problem: problemTitle,
                timestamp: new Date().toISOString()
            })
        });
        console.log(" Code sent to backend");
    } catch (err) {
        console.error("Failed to send code:", err);
    }
}