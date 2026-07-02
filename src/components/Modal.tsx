import React, { ReactNode } from "react";
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "success" | "info";
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean; // Tambahkan ini
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  confirmDisabled = false, // Default false
  children,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle size={40} className="text-pink-500" />;
      case "success":
        return <CheckCircle size={40} className="text-pink-500" />;
      case "info":
        return <Info size={40} className="text-pink-500" />;
      default:
        return <AlertTriangle size={40} className="text-pink-400" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "danger":
        return "bg-pink-500 hover:bg-pink-600";
      case "success":
        return "bg-pink-500 hover:bg-pink-600";
      case "info":
        return "bg-pink-500 hover:bg-pink-600";
      default:
        return "bg-pink-500 hover:bg-pink-600";
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "danger":
        return "text-pink-600";
      case "success":
        return "text-pink-600";
      case "info":
        return "text-pink-600";
      default:
        return "text-pink-600";
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-pink-200 animate-[fadeIn_0.25s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                {getIcon()}
              </div>
              <h3 className={`text-lg font-semibold ${getTitleColor()}`}>
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-pink-50 rounded-full transition text-gray-400 hover:text-pink-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="mb-6 ml-14">
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
            {children && <div className="mt-3">{children}</div>}
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end ml-14">
            {cancelText && (
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-xl hover:bg-pink-100 transition border border-pink-200"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                onConfirm();
              }}
              disabled={confirmDisabled}
              className={`px-5 py-2 text-sm font-medium text-white rounded-xl transition shadow-md shadow-pink-200/50 ${getButtonColor()} ${
                confirmDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* Style untuk animasi */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(-12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Modal;
