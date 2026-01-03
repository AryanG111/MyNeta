import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/api/client';

export interface Complaint {
    id: number;
    issue: string;
    status: 'pending' | 'resolved' | 'in_progress';
    priority?: 'low' | 'medium' | 'high';
    created_at: string;
    voter_name: string;
    voter_phone: string | null;
    assigned_volunteer?: string | null;
    assigned_volunteer_id?: number | null;
    resolution_photo?: string | null;
    resolution_notes?: string | null;
    resolved_at?: string | null;
    approved_by_admin?: boolean;
}

export interface ResolvedComplaint {
    id: number;
    issue: string;
    resolution_notes: string;
    resolution_photo: string | null;
    resolved_at: string;
    voter_name: string;
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

// Fetch resolved complaints for public display
export const useResolvedComplaints = () => {
    return useQuery({
        queryKey: ['resolved-complaints'],
        queryFn: async () => {
            const { data } = await client.get<ResolvedComplaint[]>('/complaints/resolved');
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
