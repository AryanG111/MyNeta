import {
    Calendar,
    AlertCircle,
    Trophy,
    LayoutDashboard,
    Clock,
    ArrowRight,
    Plus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';
import { useComplaints } from '@/hooks/useComplaints';

export function VoterDashboardPage() {
    const { user } = useAuth();
    const { data: events } = useEvents();
    const { data: complaints } = useComplaints('');

    const upcomingEvents = events?.slice(0, 3) || [];
    const myComplaints = complaints?.filter(c => c.voter_name === user?.name) || [];

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 text-white shadow-xl">
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-2">Namaste, {user?.name}!</h2>
                    <p className="text-white/80 text-lg max-w-2xl">
                        Welcome to your MyNeta dashboard. Here you can track community events, monitor grievances, and see how your area is progressing.
                    </p>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
                    <LayoutDashboard size={400} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Events */}
                <Card className="lg:col-span-2 border-none shadow-md overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Upcoming Events
                        </CardTitle>
                        <Link to="/events">
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                                View All <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {upcomingEvents.length === 0 ? (
                                <p className="text-slate-500 italic py-4">No upcoming events scheduled at the moment.</p>
                            ) : (
                                upcomingEvents.map((event) => (
                                    <div key={event.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="bg-primary/10 text-primary p-3 rounded-xl">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-slate-900">{event.title}</h4>
                                                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                                    {new Date(event.event_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">{event.location}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Stats */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-amber-50">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-600" />
                                Community Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 text-sm">Total Complaints</span>
                                    <span className="text-2xl font-black text-slate-900">{complaints?.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 text-sm">Resolved in Area</span>
                                    <span className="text-2xl font-black text-green-600">{complaints?.filter(c => c.status === 'resolved').length || 0}</span>
                                </div>
                                <div className="pt-4 border-t border-orange-200">
                                    <Link to="/leaderboard">
                                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200">
                                            <Trophy className="mr-2 h-4 w-4" /> View Leaderboard
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                                Your Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-4">
                                <p className="text-4xl font-black text-slate-900">{myComplaints.length}</p>
                                <p className="text-sm text-slate-500 mt-1">Grievances Filed</p>
                                <div className="mt-4 flex flex-col gap-2">
                                    <Link to="/complaints">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            Track Status
                                        </Button>
                                    </Link>
                                    <Link to="/complaints">
                                        <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                                            <Plus className="mr-2 h-4 w-4" /> New Complaint
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
