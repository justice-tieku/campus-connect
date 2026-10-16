import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", title?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastMessage = { id, message, type, title };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const success = useCallback(
    (msg: string, title?: string) => showToast(msg, "success", title || "Success"),
    [showToast]
  );

  const error = useCallback(
    (msg: string, title?: string) => showToast(msg, "error", title || "Error"),
    [showToast]
  );

  const info = useCallback(
    (msg: string, title?: string) => showToast(msg, "info", title || "Notice"),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
        {toasts.map((t) => {
          const isSuccess = t.type === "success";
          const isError = t.type === "error";

          return (
            <div
              key={t.id}
              className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start gap-3 p-3.5 rounded-xl border shadow-lg ${
                isSuccess
                  ? "bg-white border-emerald-300 text-slate-900"
                  : isError
                  ? "bg-white border-red-300 text-slate-900"
                  : "bg-white border-blue-300 text-slate-900"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isSuccess
                    ? "bg-emerald-50 text-emerald-700"
                    : isError
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSuccess ? "check_circle" : isError ? "error" : "info"}
                </span>
              </div>

              {/* Message text */}
              <div className="flex-1 min-w-0 pr-1">
                {t.title && (
                  <h4
                    className={`text-xs font-bold leading-tight mb-0.5 ${
                      isSuccess
                        ? "text-emerald-800"
                        : isError
                        ? "text-red-800"
                        : "text-blue-800"
                    }`}
                  >
                    {t.title}
                  </h4>
                )}
                <p className="text-xs text-slate-600 leading-snug">{t.message}</p>
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 p-0.5"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
