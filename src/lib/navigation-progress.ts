/** Imperative trigger for App Router navigations that don't go through <a> clicks (e.g. router.push). */
type StartListener = () => void;
type CancelListener = () => void;

const startListeners = new Set<StartListener>();
const cancelListeners = new Set<CancelListener>();

export function startNavigationProgress() {
  for (const listener of startListeners) listener();
}

/** Abort an in-flight bar (soft client filters / history.pushState). */
export function cancelNavigationProgress() {
  for (const listener of cancelListeners) listener();
}

export function subscribeNavigationProgressStart(listener: StartListener) {
  startListeners.add(listener);
  return () => {
    startListeners.delete(listener);
  };
}

export function subscribeNavigationProgressCancel(listener: CancelListener) {
  cancelListeners.add(listener);
  return () => {
    cancelListeners.delete(listener);
  };
}
