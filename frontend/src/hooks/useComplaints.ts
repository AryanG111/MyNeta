import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/api/client';

export interface Complaint {
    id: number;
    issue: string;
    status: 'pending' | 'resolved' | 'in_progress';
    created_at: string;
    voter_name: string;
    voter_phone: string | null;
}

export const useComplaints = (status?: string) => {
    return useQuery({
        queryKey: ['complaints', status],
        queryFn: async () => {
            const params = status ? { status } : {};
            const { data } = await client.get<Complaint[]>('/complaints', { params });
            return data;
        },
    });
};

export const useUpdateComplaintStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            client.patch(`/complaints/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
        },
    });
};

export const useDeleteComplaint = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => client.delete(`/complaints/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
        },
    });
};
