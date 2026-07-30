type Variant = 'success' | 'default' | 'danger';

interface BadgeProps {
  variant: Variant;
  children: string;
}

const variantClasses: Record<Variant, string> = {
  success: 'bg-brand-greenSoft text-brand-green',
  default: 'bg-gray-100 text-gray-600',
  danger: 'bg-red-50 text-red-600',
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
