// options.js

document.addEventListener("DOMContentLoaded", async () => {
  const { apiEndpoint } = await chrome.storage.sync.get(["apiEndpoint"]);
  if (apiEndpoint) {
    document.getElementById("apiEndpoint").value = apiEndpoint;
  }

  document.getElementById("saveOptions").addEventListener("click", async () => {
    const value = document.getElementById("apiEndpoint").value.trim();
    await chrome.storage.sync.set({ apiEndpoint: value });
    const statusEl = document.getElementById("status");
    statusEl.textContent = "Saved.";
    setTimeout(() => (statusEl.textContent = ""), 2000);
  });
});
