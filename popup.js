async function saveItem() {
  const statusEl = document.getElementById("status");
  statusEl.textContent = "Saving…";

  const pending = await loadPendingItem();
  if (!pending) {
    statusEl.textContent = "No item to save.";
    return;
  }

  // You can keep this if you want to test the options page,
  // but it is not necessary for frontend testing.
  const settings = await getSettings();

  const payload = {
    kind: pending.kind,
    value: document.getElementById("value").value.trim(),
    platform: document.getElementById("platform").value.trim(),
    profileHandle: document.getElementById("profileHandle").value.trim() || null,
    url: document.getElementById("url").value.trim(),
    domain: document.getElementById("domain").value.trim(),
    sourceUrl: document.getElementById("sourceUrl").value.trim(),
    projects: splitList(document.getElementById("projects").value),
    tags: splitList(document.getElementById("tags").value),
    countries: splitList(document.getElementById("countries").value),
    languages: splitList(document.getElementById("languages").value),
    aliases: splitList(document.getElementById("aliases").value),
    notes: document.getElementById("notes").value.trim()
  };

  // 🔧 STUB: No network call, just log the payload
  console.log("Stub saveItem payload:", payload);
  console.log("Stub API endpoint (ignored):", settings.apiEndpoint);

  // Simulate success
  statusEl.textContent = "Saved (stub). No backend call made.";

  // Clear the pending item so flows feel real
  chrome.runtime.sendMessage({ type: "clearPendingItem" }, () => {});
}
