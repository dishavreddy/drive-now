interface LoadingSpinnerProps {
  size?: number;
  label?: string;
}

export default function LoadingSpinner({ size = 24, label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <svg
        className="animate-spin text-brand-green"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-90" d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {label && <p className="mt-2 text-sm text-gray-500">{label}</p>}
    </div>
  );
}
