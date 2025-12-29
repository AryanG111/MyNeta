import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/api/client';

export interface Voter {
    id: number;
    name: string;
    address: string;
    booth: string;
    phone: string;
    category: string;
    createdAt?: string;
}

export interface VotersResponse {
    data: Voter[];
    total: number;
    page: number;
    limit: number;
}

export interface VoterFilters {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    booth?: string;
}

export const useVoters = (filters: VoterFilters) => {
    return useQuery({
        queryKey: ['voters', filters],
        queryFn: async () => {
            const { data } = await client.get<VotersResponse>('/voters', { params: filters });
            return data;
        },
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new
    });
};

export const useCreateVoter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newVoter: Omit<Voter, 'id'>) => client.post('/voters', newVoter),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['voters'] });
        },
    });
};

export const useUpdateVoter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Voter> }) =>
            client.put(`/voters/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['voters'] });
        },
    });
};

export const useDeleteVoter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => client.delete(`/voters/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['voters'] });
        },
    });
};
