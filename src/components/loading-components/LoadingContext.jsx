"use client";

import { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(new Set());

  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingTasks(new Set());
  }, []);

  const addLoadingTask = useCallback((taskId) => {
    setLoadingTasks((prev) => new Set(prev).add(taskId));
    setIsLoading(true);
  }, []);

  const removeLoadingTask = useCallback((taskId) => {
    setLoadingTasks((prev) => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      if (newSet.size === 0) {
        setIsLoading(false);
      }
      return newSet;
    });
  }, []);

  const value = {
    isLoading,
    loadingTasks,
    showLoading,
    hideLoading,
    addLoadingTask,
    removeLoadingTask,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
