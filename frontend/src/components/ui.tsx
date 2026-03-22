import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 px-5 py-2.5 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:   'bg-[var(--amber)] text-white hover:bg-[var(--amber-dark)] active:scale-[0.98]',
    secondary: 'bg-[var(--cream)] text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--border)]',
    ghost:     'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--cream)]',
    danger:    'bg-[var(--danger)] text-white hover:opacity-90 active:scale-[0.98]',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[var(--ink)]">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-lg border bg-white text-[var(--ink)] text-sm
          placeholder:text-[var(--muted)] outline-none transition-all duration-200
          border-[var(--border)] focus:border-[var(--amber)] focus:ring-2 focus:ring-[var(--amber)]/20
          ${error ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[var(--ink)]">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-lg border bg-white text-[var(--ink)] text-sm
          placeholder:text-[var(--muted)] outline-none transition-all duration-200 resize-none
          border-[var(--border)] focus:border-[var(--amber)] focus:ring-2 focus:ring-[var(--amber)]/20
          ${error ? 'border-[var(--danger)]' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[var(--border)] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, children, title }: {
  open: boolean; onClose: () => void; children: ReactNode; title?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl border border-[var(--border)] shadow-2xl w-full max-w-lg fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
            <h3 className="text-xl font-semibold text-[var(--ink)]">{title}</h3>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Star Rating ───────────────────────────────────────────────────────────────
export function StarRating({ value, onChange, readonly }: {
  value: number; onChange?: (v: number) => void; readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          className={`text-xl transition-transform ${readonly ? '' : 'hover:scale-110 cursor-pointer'}
            ${star <= value ? 'text-[var(--amber)]' : 'text-[var(--border)]'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description }: {
  icon: ReactNode; title: string; description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4 text-[var(--border)]">{icon}</div>
      <h3 className="text-lg font-semibold text-[var(--muted)]">{title}</h3>
      {description && <p className="text-sm text-[var(--muted)] mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
