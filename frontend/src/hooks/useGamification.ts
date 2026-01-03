import { useQuery } from '@tanstack/react-query';
import client from '@/api/client';

export interface UserStats {
    points: number;
    level: number;
    levelTitle: string;
    pointsToNextLevel: number;
    nextLevelTitle: string;
    tasksCompleted: number;
    complaintsResolved: number;
    collaborations: number;
    badges: Badge[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt?: string;
}

export interface LeaderboardEntry {
    rank: number;
    id: number;
    name: string;
    points: number;
    level: number;
    levelTitle: string;
    tasksCompleted: number;
    complaintsResolved: number;
    avatar: string | null;
}

export const useMyStats = () => {
    return useQuery({
        queryKey: ['gamification', 'my-stats'],
        queryFn: async () => {
            const { data } = await client.get<UserStats>('/gamification/my-stats');
            return data;
        }
    });
};

export const useLeaderboard = (limit = 10) => {
    return useQuery({
        queryKey: ['gamification', 'leaderboard', limit],
        queryFn: async () => {
            const { data } = await client.get<LeaderboardEntry[]>('/gamification/leaderboard', {
                params: { limit }
            });
            return data;
        }
    });
};

export const useAllBadges = () => {
    return useQuery({
        queryKey: ['gamification', 'badges'],
        queryFn: async () => {
            const { data } = await client.get<Badge[]>('/gamification/badges');
            return data;
        }
    });
};
