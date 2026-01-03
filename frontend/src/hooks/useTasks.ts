import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/api/client';

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    assigned_to: number;
    assigned_by: number;
    collaboration_requested?: boolean;
    collaborators?: number[];
    assignee?: { id: number; name: string; email: string };
    assigner?: { id: number; name: string };
    createdAt: string;
    updatedAt: string;
}

// Fetch all tasks (admin sees all, volunteer sees their own)
export function useTasks() {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const { data } = await client.get<Task[]>('/tasks');
            return data;
        },
    });
}

// Fetch my tasks (for volunteer dashboard)
export function useMyTasks() {
    return useQuery({
        queryKey: ['my-tasks'],
        queryFn: async () => {
            const { data } = await client.get<Task[]>('/tasks');
            return data;
        },
    });
}

// Create a new task
export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskData: Partial<Task>) => client.post('/tasks', taskData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        },
    });
}

// Update task status
export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            client.patch(`/tasks/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        },
    });
}

// Request collaboration
export function useRequestCollaboration() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: number) =>
            client.post(`/tasks/${taskId}/request-collab`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        },
    });
}

// Accept task
export function useAcceptTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: number) =>
            client.post(`/tasks/${taskId}/accept`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        },
    });
}

// Delete task
export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => client.delete(`/tasks/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        },
    });
}
