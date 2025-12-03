import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, Mail } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "email";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "info", onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    email: <Mail className="w-5 h-5" />
  };

  const colors = {
    success: {
      bg: "rgba(34, 197, 94, 0.2)",
      border: "rgba(34, 197, 94, 0.4)",
      text: "#22c55e"
    },
    error: {
      bg: "rgba(255, 77, 77, 0.2)",
      border: "rgba(255, 77, 77, 0.4)",
      text: "#ff4d4d"
    },
    info: {
      bg: "rgba(138, 180, 248, 0.2)",
      border: "rgba(138, 180, 248, 0.4)",
      text: "#8ab4f8"
    },
    email: {
      bg: "rgba(168, 85, 247, 0.2)",
      border: "rgba(168, 85, 247, 0.4)",
      text: "#a855f7"
    }
  };

  return (
    <div
      className="fixed top-5 right-5 z-[5000] px-4 py-3 rounded-xl border flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in"
      style={{
        background: colors[type].bg,
        borderColor: colors[type].border,
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        animation: "slideIn 0.3s ease-out"
      }}
    >
      <div style={{ color: colors[type].text }}>
        {icons[type]}
      </div>
      <p className="flex-1" style={{ color: colors[type].text }}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="transition-opacity hover:opacity-70"
        style={{ color: colors[type].text }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
