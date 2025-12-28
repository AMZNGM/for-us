"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Alert from "@/components/ui/Alert";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const show = useCallback((message, type = "info", ttl = 4000) => {
    setState({ open: true, message, type });
    if (ttl > 0) {
      setTimeout(() => setState((s) => ({ ...s, open: false })), ttl);
    }
  }, []);

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return (
    <AlertContext.Provider value={{ show, close }}>
      {children}
      <Alert
        open={state.open}
        message={state.message}
        type={state.type}
        onClose={close}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
}

export default AlertContext;
