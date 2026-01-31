let logoutHandler = null;

export function registerLogout(fn) {
  logoutHandler = fn;
}

export function triggerLogout() {
  if (logoutHandler) {
    logoutHandler();
  }
}
