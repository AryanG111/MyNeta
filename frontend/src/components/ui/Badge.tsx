import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-slate-100 text-slate-800 border-slate-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    outline: 'bg-transparent text-slate-600 border-slate-300',
};

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

// Helper to get badge variant from status/category
export function getStatusVariant(status: string): BadgeVariant {
    switch (status) {
        case 'resolved':
        case 'completed':
        case 'supporter':
            return 'success';
        case 'pending':
        case 'scheduled':
        case 'neutral':
            return 'warning';
        case 'in_progress':
        case 'ongoing':
            return 'info';
        case 'flagged':
        case 'cancelled':
        case 'opponent':
            return 'danger';
        default:
            return 'secondary';
    }
}

export type { BadgeVariant };
