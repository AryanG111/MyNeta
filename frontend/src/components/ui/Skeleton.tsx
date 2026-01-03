import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-slate-200',
                className
            )}
            {...props}
        />
    );
}

// Pre-built skeleton components
export function SkeletonCard() {
    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
            </div>
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-[300px] w-full" />
        </div>
    );
}
