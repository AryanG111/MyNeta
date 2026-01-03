import { Users, FileWarning, Calendar, UserCheck, TrendingUp, Clock } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboard';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge, getStatusVariant } from '@/components/ui/Badge';
import { Skeleton, SkeletonCard, SkeletonChart } from '@/components/ui/Skeleton';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const VOTER_COLORS = {
    supporter: '#10b981',
    neutral: '#f59e0b',
    opponent: '#ef4444',
};

const COMPLAINT_COLORS = {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    resolved: '#10b981',
    flagged: '#ef4444',
};

export function DashboardPage() {
    const { data: stats, isLoading, error } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <SkeletonChart />
                    <SkeletonChart />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <FileWarning className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Failed to load dashboard</h3>
                <p className="text-slate-500 mt-2">Please try refreshing the page</p>
            </div>
        );
    }

    // Transform data for charts
    const voterChartData = stats?.voterCounts.map(v => ({
        name: v.category.charAt(0).toUpperCase() + v.category.slice(1),
        value: v.count,
        fill: VOTER_COLORS[v.category as keyof typeof VOTER_COLORS] || '#6b7280',
    })) || [];

    const complaintChartData = stats?.complaintStats.map(c => ({
        name: c.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: c.count,
        fill: COMPLAINT_COLORS[c.status as keyof typeof COMPLAINT_COLORS] || '#6b7280',
    })) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Voters"
                    value={stats?.totalVoters || 0}
                    icon={Users}
                    color="text-blue-600"
                    trend={<span className="text-xs text-green-600 flex items-center"><TrendingUp className="h-3 w-3 mr-1" />Growing</span>}
                />
                <StatCard
                    title="Active Complaints"
                    value={stats?.totalComplaints || 0}
                    icon={FileWarning}
                    color="text-orange-600"
                />
                <StatCard
                    title="Scheduled Events"
                    value={stats?.totalEvents || 0}
                    icon={Calendar}
                    color="text-purple-600"
                />
                <StatCard
                    title="Active Volunteers"
                    value={stats?.totalVolunteers || 0}
                    icon={UserCheck}
                    color="text-green-600"
                    subtitle={stats?.pendingVolunteers ? `${stats.pendingVolunteers} pending` : undefined}
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Voter Distribution Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Voter Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {voterChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={voterChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {voterChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-slate-400">
                                No voter data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Complaint Status Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Complaint Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {complaintChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={complaintChartData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <Tooltip />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                        {complaintChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-slate-400">
                                No complaint data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats?.voterCounts.map(v => (
                            <div key={v.category} className="text-center p-4 rounded-lg bg-slate-50">
                                <Badge variant={getStatusVariant(v.category)}>
                                    {v.category.charAt(0).toUpperCase() + v.category.slice(1)}
                                </Badge>
                                <p className="text-2xl font-bold mt-2">{v.count}</p>
                                <p className="text-xs text-slate-500">voters</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
