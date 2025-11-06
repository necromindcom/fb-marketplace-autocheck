chrome.runtime.onInstalled.addListener(() => {
    console.log("Auto Groups Checker extension installed.");
});

// Open marketplace when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    const marketplaceUrl = "https://www.facebook.com/marketplace/you/selling";

    // Check if there's already a tab with marketplace open
    chrome.tabs.query({}, (tabs) => {
        const marketplaceTab = tabs.find(t => t.url && t.url.includes('facebook.com/marketplace'));

        if (marketplaceTab) {
            // Switch to existing marketplace tab and update URL
            chrome.tabs.update(marketplaceTab.id, { active: true, url: marketplaceUrl });
        } else {
            // Open new tab with marketplace
            chrome.tabs.create({ url: marketplaceUrl });
        }
    });
});