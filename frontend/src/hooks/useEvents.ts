import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/api/client';

export interface Event {
    id: number;
    title: string;
    description: string;
    event_date: string;
    location: string;
    createdAt: string;
}

export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const { data } = await client.get<Event[]>('/events');
            return data;
        },
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEvent: Omit<Event, 'id' | 'createdAt'>) => client.post('/events', newEvent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Event> }) =>
            client.put(`/events/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => client.delete(`/events/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};
