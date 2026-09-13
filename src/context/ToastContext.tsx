import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiAlertTriangle } from "react-icons/fi";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 md:px-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-[#F0FDF4]",
          border: "border-[#22C55E]",
          text: "text-[#15803D]",
          icon: <FiCheckCircle className="w-5 h-5 text-[#22C55E] shrink-0" />,
        };
      case "error":
        return {
          bg: "bg-[#FEF2F2]",
          border: "border-[#EF4444]",
          text: "text-[#991B1B]",
          icon: <FiAlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />,
        };
      case "warning":
        return {
          bg: "bg-[#FFFBEB]",
          border: "border-[#F59E0B]",
          text: "text-[#B45309]",
          icon: <FiAlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />,
        };
      default:
        return {
          bg: "bg-[#F0F4F8]",
          border: "border-[#173764]",
          text: "text-[#0C2445]",
          icon: <FiInfo className="w-5 h-5 text-[#173764] shrink-0" />,
        };
    }
  };

  const style = getStyles();

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-xl transition-all duration-300 transform translate-y-0 ${style.bg} ${style.border}`}
    >
      <div className="mt-0.5">{style.icon}</div>
      <div className={`flex-1 text-sm font-medium leading-snug ${style.text}`}>{toast.message}</div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-md cursor-pointer shrink-0"
        title="Fechar"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};
