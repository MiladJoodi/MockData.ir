/** Imperative trigger for App Router navigations that don't go through <a> clicks (e.g. router.push). */
type StartListener = () => void;

const startListeners = new Set<StartListener>();

export function startNavigationProgress() {
  for (const listener of startListeners) listener();
}

export function subscribeNavigationProgressStart(listener: StartListener) {
  startListeners.add(listener);
  return () => {
    startListeners.delete(listener);
  };
}
