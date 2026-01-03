import { Card, CardContent } from "@/components/ui/Card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: React.ReactNode;
    subtitle?: string;
    color?: string;
}

export function StatCard({ title, value, icon: Icon, trend, subtitle, color = "text-primary" }: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-slate-500">{title}</span>
                        <span className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                        {trend && (
                            <div className="text-sm">
                                {trend}
                            </div>
                        )}
                        {subtitle && (
                            <span className="text-xs text-slate-400">{subtitle}</span>
                        )}
                    </div>
                    <div className={`p-3 rounded-full bg-slate-100 ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
