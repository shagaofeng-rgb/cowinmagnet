const visitorStorageKey = "cowin_visitor_id";
const sessionStorageKey = "cowin_session_id";

function getOrCreate(storage, key, prefix) {
  let value = storage.getItem(key);
  if (!value) {
    value = `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    storage.setItem(key, value);
  }
  return value;
}

export function getClientTrackingIdentity() {
  if (typeof window === "undefined") {
    return { visitorId: "", sessionId: "" };
  }

  return {
    visitorId: getOrCreate(window.localStorage, visitorStorageKey, "v"),
    sessionId: getOrCreate(window.sessionStorage, sessionStorageKey, "s")
  };
}
