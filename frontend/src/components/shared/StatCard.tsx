import { Card, CardContent } from "@/components/ui/Card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: string;
    color?: string;
}

export function StatCard({ title, value, icon: Icon, trend, color = "text-primary" }: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex flex-col space-y-2">
                        <span className="text-sm font-medium text-slate-500">{title}</span>
                        <span className="text-3xl font-bold">{value}</span>
                        {trend && (
                            <span className="text-sm text-green-600 flex items-center">
                                {trend}
                            </span>
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
