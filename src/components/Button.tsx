import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'outlined';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-green text-white hover:bg-brand-greenHover border border-transparent',
  secondary: 'bg-black text-white hover:bg-gray-800 border border-transparent',
  danger: 'bg-red-500 text-white hover:bg-red-600 border border-transparent',
  outlined: 'bg-white text-brand-green border border-brand-green hover:bg-brand-greenSoft',
};

const sizeClasses = 'inline-flex items-center justify-center gap-1.5 rounded px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export default function Button({ variant = 'primary', children, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`${sizeClasses} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
