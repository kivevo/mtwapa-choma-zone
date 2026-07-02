"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  expectedText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, message, confirmLabel = "Delete", danger = true, expectedText, onConfirm, onCancel,
}: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState("");

  if (!open) return null;

  const isMatched = !expectedText || inputValue === expectedText;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          {danger && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
            {expectedText && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Please type <span className="font-bold text-gray-900">{expectedText}</span> to confirm.
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder={expectedText}
                />
              </div>
            )}
          </div>
          <button onClick={onCancel} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); setInputValue(""); }}
            disabled={!isMatched}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Convenience hook-style wrapper
export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
    expectedText?: string;
    onConfirm: () => void;
  }>({ open: false, title: "", message: "", onConfirm: () => {} });

  const confirm = (opts: Omit<typeof state, "open">) => {
    setState({ ...opts, open: true });
  };

  const close = () => setState((s) => ({ ...s, open: false }));

  const dialog = (
    <ConfirmDialog
      open={state.open}
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      danger={state.danger}
      expectedText={state.expectedText}
      onConfirm={() => { state.onConfirm(); close(); }}
      onCancel={close}
    />
  );

  return { confirm, dialog };
}
