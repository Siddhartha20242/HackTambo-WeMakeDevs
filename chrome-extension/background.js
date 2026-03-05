
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status === 'complete' && tab.url) {
        

        if (tab.url.includes("leetcode.com/problems/")) {
            console.log(" Nexus detected a problem! Sending timer signal...");
            

            chrome.tabs.sendMessage(tabId, { action: "START_AUTO_TIMER" })
            .catch(() => {

                console.log("Content script not ready yet.");
            });
        }
    }
});
