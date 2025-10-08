import { useCallback, useRef } from 'react';

type RefreshCallback = () => void;

// Simple singleton pattern for dashboard refresh
class DashboardRefreshManager {
  private callbacks: Set<RefreshCallback> = new Set();

  subscribe(callback: RefreshCallback) {
    this.callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  refresh() {
    this.callbacks.forEach(callback => callback());
  }
}

const dashboardRefreshManager = new DashboardRefreshManager();

/**
 * Hook to subscribe to dashboard refresh events
 * Returns a callback to trigger refresh on this dashboard instance
 */
export const useDashboardRefresh = (onRefresh: RefreshCallback) => {
  const callbackRef = useRef(onRefresh);
  callbackRef.current = onRefresh;

  const subscribe = useCallback(() => {
    const callback = () => callbackRef.current();
    return dashboardRefreshManager.subscribe(callback);
  }, []);

  const triggerRefresh = useCallback(() => {
    dashboardRefreshManager.refresh();
  }, []);

  return { subscribe, triggerRefresh };
};

/**
 * Global function to trigger dashboard refresh from anywhere in the app
 */
export const triggerDashboardRefresh = () => {
  dashboardRefreshManager.refresh();
};
