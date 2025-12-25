"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) router.push(redirectTo);
  }, [router, redirectTo]);

  return <>{children}</>;
}
