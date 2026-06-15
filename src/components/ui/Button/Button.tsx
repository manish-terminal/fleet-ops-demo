import { cn } from '@/utils/cn';
import { Spinner } from '../Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:    Variant;
  size?:       Size;
  isLoading?:  boolean;
  leftIcon?:   React.ReactNode;
  rightIcon?:  React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:   'bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700 focus-visible:ring-brand-500 shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 border border-brand-500/20',
  secondary: 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 active:bg-slate-800 hover:text-white focus-visible:ring-slate-500',
  ghost:     'text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:ring-slate-700',
  danger:    'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-500 shadow-md shadow-red-600/10 hover:shadow-red-600/20 border border-red-500/20',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8  px-3 text-xs rounded-md gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold select-none',
        'transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" className="text-current" /> : leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
export default Button;
