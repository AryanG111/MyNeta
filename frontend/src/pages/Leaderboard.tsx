import { Trophy, Medal, Star, TrendingUp, Award, Loader2, Crown } from 'lucide-react';
import { useLeaderboard, useMyStats, useAllBadges } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export function LeaderboardPage() {
    const { user } = useAuth();
    const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(10);
    const { data: myStats, isLoading: statsLoading } = useMyStats();
    const { data: allBadges } = useAllBadges();

    const isVolunteer = user?.role === 'volunteer';

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
            case 2: return <Medal className="h-6 w-6 text-gray-400" />;
            case 3: return <Medal className="h-6 w-6 text-amber-600" />;
            default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
        }
    };

    const getLevelColor = (level: number) => {
        const colors = ['bg-gray-100', 'bg-green-100', 'bg-blue-100', 'bg-purple-100', 'bg-orange-100', 'bg-red-100', 'bg-yellow-100'];
        return colors[Math.min(level - 1, colors.length - 1)];
    };

    if (leaderboardLoading || (isVolunteer && statsLoading)) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
                    <p className="text-gray-500">Top volunteers making a difference</p>
                </div>
            </div>

            <div className={`grid gap-6 ${isVolunteer ? 'lg:grid-cols-3' : ''}`}>
                {/* Leaderboard */}
                <div className={isVolunteer ? 'lg:col-span-2' : ''}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Top Volunteers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {leaderboard?.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className={`flex items-center gap-4 p-4 transition-colors ${entry.id === user?.id ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 flex justify-center">
                                            {getRankIcon(entry.rank)}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold">
                                            {entry.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">
                                                {entry.name}
                                                {entry.id === user?.id && <span className="text-orange-500 ml-2">(You)</span>}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(entry.level)}`}>
                                                    Lv.{entry.level} {entry.levelTitle}
                                                </span>
                                                <span>•</span>
                                                <span>{entry.tasksCompleted} tasks</span>
                                                <span>•</span>
                                                <span>{entry.complaintsResolved} resolved</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">{entry.points}</p>
                                            <p className="text-xs text-gray-500">points</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* My Stats & Badges - Only for volunteers */}
                {isVolunteer && (
                    <div className="space-y-6">
                        {/* My Stats */}
                        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-700">
                                    <Star className="h-5 w-5" />
                                    My Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-5xl font-bold text-orange-600">{myStats?.points || 0}</p>
                                    <p className="text-sm text-orange-500">Total Points</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">Level {myStats?.level || 1}</span>
                                        <span className="text-gray-500">{myStats?.levelTitle}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all"
                                            style={{ width: `${myStats?.pointsToNextLevel ? Math.max(10, 100 - (myStats.pointsToNextLevel / 50 * 100)) : 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {myStats?.pointsToNextLevel || 0} points to {myStats?.nextLevelTitle || 'Max Level'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white p-2 rounded-lg">
                                        <p className="text-xl font-bold text-gray-900">{myStats?.tasksCompleted || 0}</p>
                                        <p className="text-xs text-gray-500">Tasks</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg">
                                        <p className="text-xl font-bold text-gray-900">{myStats?.complaintsResolved || 0}</p>
                                        <p className="text-xs text-gray-500">Resolved</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg">
                                        <p className="text-xl font-bold text-gray-900">{myStats?.collaborations || 0}</p>
                                        <p className="text-xs text-gray-500">Collabs</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* My Badges */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-purple-500" />
                                    My Badges ({myStats?.badges?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {myStats?.badges && myStats.badges.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {myStats.badges.map((badge) => (
                                            <div
                                                key={badge.id}
                                                className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100"
                                                title={badge.description}
                                            >
                                                <span className="text-2xl">{badge.icon}</span>
                                                <p className="text-xs font-medium mt-1">{badge.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 py-4">Complete tasks to earn badges!</p>
                                )}

                                {/* Available Badges */}
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-xs text-gray-500 mb-2">Available Badges</p>
                                    <div className="flex flex-wrap gap-2">
                                        {allBadges?.map((badge) => {
                                            const earned = myStats?.badges?.some(b => b.id === badge.id);
                                            return (
                                                <div
                                                    key={badge.id}
                                                    className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${earned ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                                                    title={badge.description}
                                                >
                                                    <span>{badge.icon}</span>
                                                    <span>{badge.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
