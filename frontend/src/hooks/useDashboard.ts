import { useQuery } from '@tanstack/react-query';
import client from '@/api/client';
import type { DashboardStats } from '@/types';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async (): Promise<DashboardStats> => {
            const { data } = await client.get<DashboardStats>('/admin/dashboard-stats');
            return data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        refetchInterval: 1000 * 60 * 5, // Auto-refresh every 5 minutes
    });
};

export type { DashboardStats };
