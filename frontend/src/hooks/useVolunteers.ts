import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/api/client';

export interface Volunteer {
    id: number;
    name: string;
    email: string;
    mobile: string;
    area: string;
    last_login?: string;
    createdAt: string;
}

export interface VolunteerRequest {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    avatar_url: string | null;
}

interface VolunteersResponse {
    volunteers: Volunteer[];
    pending: Volunteer[]; // Internal pending users (if any)
}

export const useVolunteers = () => {
    return useQuery({
        queryKey: ['volunteers'],
        queryFn: async () => {
            const { data } = await client.get<VolunteersResponse>('/volunteers');
            return data;
        },
    });
};

export const useVolunteerRequests = () => {
    return useQuery({
        queryKey: ['volunteer-requests'],
        queryFn: async () => {
            const { data } = await client.get<VolunteersResponse>('/volunteers');
            // Pending requests are returned as part of /volunteers endpoint
            return data.pending as unknown as VolunteerRequest[];
        },
    });
};

export const useApproveRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => client.post(`/volunteers/${id}/approve`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['volunteer-requests'] });
            queryClient.invalidateQueries({ queryKey: ['volunteers'] });
        },
    });
};

export const useRejectRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => client.post(`/volunteers/${id}/reject`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['volunteer-requests'] });
            queryClient.invalidateQueries({ queryKey: ['volunteers'] });
        },
    });
};

export const useDeactivateVolunteer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => client.post(`/volunteers/${id}/deactivate`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['volunteers'] });
        },
    });
};
