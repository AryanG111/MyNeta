import { cn } from "@/utils/cn";

interface ComplaintStatusBadgeProps {
    status: string;
}

export function ComplaintStatusBadge({ status }: ComplaintStatusBadgeProps) {
    const variants: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        in_progress: "bg-blue-100 text-blue-800",
        resolved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
    };

    const labels: Record<string, string> = {
        pending: "Pending",
        in_progress: "In Progress",
        resolved: "Resolved",
        rejected: "Rejected",
    };

    const className = variants[status] || "bg-gray-100 text-gray-800";
    const label = labels[status] || status;

    return (
        <span className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            className
        )}>
            {label}
        </span>
    );
}
