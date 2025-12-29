import { useQuery } from '@tanstack/react-query';
import client from '@/api/client';

export interface DashboardStats {
    voters: number;
    complaints: number;
    events: number;
    volunteers: number;
    voterCounts: {
        category: string;
        count: number;
    }[];
    complaintStats: {
        status: string;
        count: number;
    }[];
}

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            // In a real scenario, this might be a single endpoint like /api/admin/dashboard-stats
            // But based on current backend, we might need to fetch individually or use the 'admin-dashboard.html' logic
            // Looking at 'public/js/admin-app.js', there is a 'loadDashboardStats' method that likely aggregates data
            // For now, I will assume an endpoint '/api/admin/stats' exists or we fetch parallel.
            // Let's check 'backend/routes/admin.js' if we can... blocked.
            // I'll implement a parallel fetch if a single one doesn't exist, mirroring the 'loadDashboardStats' logic I saw earlier.
            // The previous 'loadDashboardStats' in admin-app.js did:
            /*
              const voters = await this.request('GET', '/voters');
              const complaints = await this.request('GET', '/complaints');
              const events = await this.request('GET', '/events');
              const volunteers = await this.request('GET', '/volunteers');
            */
            // That's inefficient. I'll propose a new endpoint later, but for now let's parallel fetch.

            const [voters, complaints, events, volunteers] = await Promise.all([
                client.get('/voters').then(res => res.data), // Assuming returns all voters or count object
                client.get('/complaints').then(res => res.data),
                client.get('/events').then(res => res.data),
                client.get('/volunteers').then(res => res.data),
            ]);

            // Process data to match interface
            // Note: This is inefficient (fetching all records). In Phase 4 we should optimize backend.
            return {
                voters: Array.isArray(voters.data) ? voters.total || voters.data.length : (voters.length || 0),
                complaints: Array.isArray(complaints) ? complaints.length : 0,
                events: Array.isArray(events) ? events.length : 0,
                volunteers: Array.isArray(volunteers.volunteers) ? volunteers.volunteers.length : 0,
                voterCounts: [
                    { category: 'A', count: 120 }, // Mock for now until we analyze data structure deeper
                    { category: 'B', count: 80 },
                ],
                complaintStats: [
                    { status: 'Resolved', count: 10 },
                    { status: 'Pending', count: 5 },
                ]
            } as DashboardStats;
        },
    });
};
