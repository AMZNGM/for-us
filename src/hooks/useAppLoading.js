"use client";

import { useEffect } from "react";
import { useLoading } from "@/components/loading-components/LoadingContext";
import { useAuth } from "@/lib/AuthContext";

export function useAppLoading() {
  const { hideLoading } = useLoading();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    // Hide loading when auth is complete
    if (!authLoading) {
      const timer = setTimeout(() => {
        hideLoading();
      }, 1000); // Small delay to ensure smooth transition

      return () => clearTimeout(timer);
    }
  }, [authLoading, hideLoading]);
}
