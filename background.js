// background.js

// Utility: extract domain
function extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return null;
  }
}

// Utility: naive platform from URL
function inferPlatform(url) {
  if (!url) return "Generic";
  const host = new URL(url).hostname;
  if (host.includes("x.com") || host.includes("twitter.com")) return "X";
  if (host.includes("facebook.com")) return "Facebook";
  if (host.includes("instagram.com")) return "Instagram";
  if (host.includes("tiktok.com")) return "TikTok";
  if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
  if (host.includes("telegram.org") || host.includes("t.me")) return "Telegram";
  return "Generic";
}

// Create context menu items on install/update
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    // 1. Save this term (selection)
    chrome.contextMenus.create({
      id: "save-term",
      title: "Save this term",
      contexts: ["selection"]
    });

    // 2. Save this profile (page)
    chrome.contextMenus.create({
      id: "save-profile",
      title: "Save this profile",
      contexts: ["page"]
    });

    // 3. Save this URL / domain (page and link)
    chrome.contextMenus.create({
      id: "save-url",
      title: "Save this URL/domain",
      contexts: ["page", "link"]
    });
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const tabId = tab?.id;
  const pageUrl = info.pageUrl || tab?.url || "";
  const linkUrl = info.linkUrl || "";
  const selectionText = info.selectionText || "";

  let pendingItem = null;

  if (info.menuItemId === "save-term") {
    pendingItem = {
      kind: "term",
      value: selectionText.trim(),
      sourceUrl: pageUrl,
      url: pageUrl,
      domain: extractDomain(pageUrl),
      platform: inferPlatform(pageUrl)
    };
  }

  if (info.menuItemId === "save-profile") {
    const url = pageUrl;
    pendingItem = {
      kind: "profile",
      value: url,
      profileUrl: url,
      profileHandle: null, // can be parsed later or filled manually
      sourceUrl: url,
      url,
      domain: extractDomain(url),
      platform: inferPlatform(url)
    };
  }

  if (info.menuItemId === "save-url") {
    const url = linkUrl || pageUrl;
    pendingItem = {
      kind: "url",
      value: url,
      sourceUrl: pageUrl,
      url,
      domain: extractDomain(url),
      platform: inferPlatform(url)
    };
  }

  if (!pendingItem) return;

  // Save pending item in session storage; popup will read it
  await chrome.storage.session.set({ pendingItem });

  // Open popup explicitly (in addition to action icon)
  if (tabId !== undefined) {
    chrome.action.openPopup().catch(() => {
      // Fallback if browser does not allow programmatic popup
    });
  }
});

// Listen for messages from popup to clear pending item if needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "clearPendingItem") {
    chrome.storage.session.remove("pendingItem").then(() => sendResponse({ ok: true }));
    return true;
  }
});
