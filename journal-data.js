// Basic structure; you can later connect to your user object
function loadJournalEntries() {
  const raw = localStorage.getItem("fitflow_journal_entries");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveJournalEntries(entries) {
  localStorage.setItem("fitflow_journal_entries", JSON.stringify(entries));
}
