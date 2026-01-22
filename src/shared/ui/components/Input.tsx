import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
          {label}
        </label>
        <input
          ref={ref}
          className={twMerge(
            clsx(
              'w-full rounded-lg border bg-surface-dark px-4 py-3 text-sm text-white transition-all',
              'placeholder:text-slate-500 focus:outline-none focus:ring-1',
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-white/10 focus:border-primary focus:ring-primary/20'
            ),
            className
          )}
          {...props}
        />
        {error && <span className="mt-1 text-xs text-rose-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
