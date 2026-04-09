// localStorage-based data store that mirrors Supabase table structure
// Easy to swap out for real Supabase client later

const STORAGE_KEYS = {
  USERS: "rra_users",
  CURRENT_USER: "rra_current_user",
  REVIEWS: "rra_reviews",
  RESPONSES: "rra_responses",
  EDIT_HISTORY: "rra_edit_history",
  INITIALIZED: "rra_initialized",
};

function getItem(key) {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setItem(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Users ----
export function getUsers() {
  return getItem(STORAGE_KEYS.USERS) || [];
}

export function createUser(user) {
  const users = getUsers();
  const existing = users.find((u) => u.email === user.email);
  if (existing) throw new Error("User already exists");
  const newUser = {
    id: `user_${Date.now()}`,
    ...user,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  setItem(STORAGE_KEYS.USERS, users);
  return newUser;
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  setItem(STORAGE_KEYS.CURRENT_USER, user);
  return user;
}

export function getCurrentUser() {
  return getItem(STORAGE_KEYS.CURRENT_USER);
}

export function setCurrentUser(user) {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
  // Also update in users array
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) {
    users[idx] = user;
    setItem(STORAGE_KEYS.USERS, users);
  }
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// ---- Reviews ----
export function getReviews() {
  return getItem(STORAGE_KEYS.REVIEWS) || [];
}

export function setReviews(reviews) {
  setItem(STORAGE_KEYS.REVIEWS, reviews);
}

// ---- Responses ----
export function getResponses() {
  return getItem(STORAGE_KEYS.RESPONSES) || [];
}

export function saveResponse(response) {
  const responses = getResponses();
  const idx = responses.findIndex((r) => r.reviewId === response.reviewId);
  if (idx !== -1) {
    responses[idx] = { ...responses[idx], ...response, updatedAt: new Date().toISOString() };
  } else {
    responses.push({
      id: `resp_${Date.now()}`,
      ...response,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  setItem(STORAGE_KEYS.RESPONSES, responses);
  return responses;
}

export function updateResponseStatus(reviewId, status) {
  const responses = getResponses();
  const idx = responses.findIndex((r) => r.reviewId === reviewId);
  if (idx !== -1) {
    responses[idx].status = status;
    responses[idx].updatedAt = new Date().toISOString();
    if (status === "published") {
      responses[idx].publishedAt = new Date().toISOString();
    }
    setItem(STORAGE_KEYS.RESPONSES, responses);
  }
  return responses;
}

// ---- Edit History ----
export function getEditHistory() {
  return getItem(STORAGE_KEYS.EDIT_HISTORY) || [];
}

export function addEditRecord(record) {
  const history = getEditHistory();
  history.push({
    id: `edit_${Date.now()}`,
    ...record,
    timestamp: new Date().toISOString(),
  });
  setItem(STORAGE_KEYS.EDIT_HISTORY, history);
  return history;
}

// ---- Smart Learning Engine ----
export function getLearningInsights() {
  const history = getEditHistory();
  if (history.length === 0) {
    return {
      totalEdits: 0,
      commonPatterns: [],
      preferredLength: null,
      toneShifts: [],
      summary: "No edit data yet. The system will learn from your edits over time.",
    };
  }

  // Analyze edit patterns
  const lengthDiffs = history.map((h) => {
    const origLen = (h.originalText || "").length;
    const editLen = (h.editedText || "").length;
    return editLen - origLen;
  });

  const avgLengthDiff = lengthDiffs.reduce((a, b) => a + b, 0) / lengthDiffs.length;

  const patterns = [];
  if (avgLengthDiff > 20) patterns.push("You tend to make responses longer and more detailed");
  if (avgLengthDiff < -20) patterns.push("You prefer shorter, more concise responses");

  // Check for common added phrases
  const addedPhrases = {};
  history.forEach((h) => {
    const orig = (h.originalText || "").toLowerCase();
    const edited = (h.editedText || "").toLowerCase();
    const sentences = edited.split(/[.!?]+/).filter((s) => s.trim());
    sentences.forEach((s) => {
      const trimmed = s.trim();
      if (trimmed && !orig.includes(trimmed) && trimmed.length > 10) {
        addedPhrases[trimmed] = (addedPhrases[trimmed] || 0) + 1;
      }
    });
  });

  const frequentAdditions = Object.entries(addedPhrases)
    .filter(([, count]) => count >= 2)
    .map(([phrase]) => phrase);

  if (frequentAdditions.length > 0) {
    patterns.push(`You often add phrases like: "${frequentAdditions[0]}"`);
  }

  return {
    totalEdits: history.length,
    commonPatterns: patterns,
    preferredLength: avgLengthDiff > 0 ? "longer" : "shorter",
    avgLengthChange: Math.round(avgLengthDiff),
    summary:
      patterns.length > 0
        ? `Based on ${history.length} edits: ${patterns.join(". ")}.`
        : `${history.length} edits tracked. Keep editing to help the AI learn your style!`,
  };
}

// ---- Initialization ----
export function isInitialized() {
  return getItem(STORAGE_KEYS.INITIALIZED) === true;
}

export function markInitialized() {
  setItem(STORAGE_KEYS.INITIALIZED, true);
}

export function resetAllData() {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
