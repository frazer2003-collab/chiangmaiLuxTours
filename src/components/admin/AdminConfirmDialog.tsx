"use client";

import { useEffect, useId, useRef } from "react";
import { useAdminLocale } from "./AdminLocaleProvider";
import { AdminSpinner } from "./AdminFeedback";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  title: string;
  message: string;
  hint?: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "destructive" | "primary";
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminConfirmDialog({
  open,
  title,
  message,
  hint,
  confirmLabel,
  cancelLabel,
  variant = "primary",
  pending = false,
  onConfirm,
  onCancel,
}: Props) {
  const { tr } = useAdminLocale();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const focusTimer = window.setTimeout(() => {
      cancelRef.current?.focus();
    }, 0);

    function getFocusableElements() {
      if (!dialogRef.current) return [] as HTMLElement[];
      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("disabled"));
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        event.preventDefault();
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onCancel, pending]);

  if (!open) return null;

  const confirmStyles =
    variant === "destructive"
      ? "bg-[var(--river-navy)] text-white hover:bg-[var(--river-navy)]/90"
      : "bg-[var(--river-blue)] text-white hover:bg-[var(--river-blue-deep)]";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label={cancelLabel ?? tr("cancel")}
        disabled={pending}
        className="absolute inset-0 bg-[var(--river-navy)]/55 disabled:cursor-not-allowed"
        onClick={() => {
          if (!pending) onCancel();
        }}
      />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={hint ? `${descriptionId} ${descriptionId}-hint` : descriptionId}
        aria-busy={pending}
        className="relative w-full max-w-sm rounded-2xl bg-[var(--chart-paper)] p-5 shadow-[0_24px_60px_-12px_rgba(15,39,64,0.35)]"
      >
        <h2 id={titleId} className="text-lg font-semibold text-[var(--ink)]">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
          {message}
        </p>
        {hint ? (
          <p
            id={`${descriptionId}-hint`}
            className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]"
          >
            {hint}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-[var(--river-blue)] ring-1 ring-[var(--river-blue)]/20 hover:bg-[var(--river-blue)]/8 disabled:opacity-50"
          >
            {cancelLabel ?? tr("cancel")}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold disabled:opacity-50 ${confirmStyles}`}
          >
            {pending ? <AdminSpinner className="h-4 w-4 text-white" /> : null}
            {pending ? tr("saving") : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
