import { Users, FileWarning, Calendar, UserCheck } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboard';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardPage() {
    const { data: stats, isLoading } = useDashboardStats();

    if (isLoading) {
        return <div className="p-8">Loading dashboard metrics...</div>;
    }

    // Mock data for charts if API doesn't fully support it yet
    const chartData = [
        { name: 'Jan', voters: 400 },
        { name: 'Feb', voters: 300 },
        { name: 'Mar', voters: 550 },
        { name: 'Apr', voters: 450 },
        { name: 'May', voters: 600 },
        { name: 'Jun', voters: 700 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Voters"
                    value={stats?.voters || 0}
                    icon={Users}
                    color="text-blue-600"
                />
                <StatCard
                    title="Active Complaints"
                    value={stats?.complaints || 0}
                    icon={FileWarning}
                    color="text-red-600"
                />
                <StatCard
                    title="Upcoming Events"
                    value={stats?.events || 0}
                    icon={Calendar}
                    color="text-orange-600"
                />
                <StatCard
                    title="Volunteers"
                    value={stats?.volunteers || 0}
                    icon={UserCheck}
                    color="text-green-600"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Voter Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip />
                                <Bar dataKey="voters" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Placeholder for second chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Complaint Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[350px]">
                        <p className="text-slate-500">Charts loading...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
