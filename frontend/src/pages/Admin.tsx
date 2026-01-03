import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, UserCheck, UserX, Shield, Activity, RefreshCw, Plus, ClipboardList, Loader2 } from 'lucide-react';
import client from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { useToast } from '@/context/ToastContext';
import type { Volunteer } from '@/types';

interface PendingVolunteer {
    id: number;
    name: string;
    email: string;
    mobile: string;
    area?: string;
    createdAt: string;
}

interface VolunteersData {
    volunteers: Volunteer[];
    pending: PendingVolunteer[];
}

interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    assignee: { id: number; name: string; email: string };
    assigner: { id: number; name: string };
    createdAt: string;
}

export function AdminPage() {
    const { addToast } = useToast();
    const queryClient = useQueryClient();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        due_date: ''
    });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-volunteers'],
        queryFn: async () => {
            const { data } = await client.get<VolunteersData>('/volunteers');
            return data;
        },
    });

    const { data: tasks, isLoading: tasksLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const { data } = await client.get<Task[]>('/tasks');
            return data;
        },
    });

    const approveMutation = useMutation({
        mutationFn: (id: number) => client.post(`/volunteers/${id}/approve`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            addToast('Volunteer approved successfully', 'success');
        },
        onError: () => addToast('Failed to approve volunteer', 'error'),
    });

    const rejectMutation = useMutation({
        mutationFn: (id: number) => client.post(`/volunteers/${id}/reject`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] });
            addToast('Volunteer rejected', 'success');
        },
        onError: () => addToast('Failed to reject volunteer', 'error'),
    });

    const createTaskMutation = useMutation({
        mutationFn: (data: typeof taskForm) => client.post('/tasks', {
            ...data,
            assigned_to: parseInt(data.assigned_to)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            addToast('Task assigned successfully', 'success');
            setIsTaskModalOpen(false);
            setTaskForm({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
        },
        onError: () => addToast('Failed to create task', 'error'),
    });

    const updateTaskStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            client.patch(`/tasks/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            addToast('Task status updated', 'success');
        },
        onError: () => addToast('Failed to update task', 'error'),
    });

    const handleApprove = (id: number) => approveMutation.mutate(id);
    const handleReject = (id: number) => {
        if (confirm('Are you sure you want to reject this volunteer application?')) {
            rejectMutation.mutate(id);
        }
    };

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskForm.title || !taskForm.assigned_to) {
            addToast('Please fill in required fields', 'error');
            return;
        }
        createTaskMutation.mutate(taskForm);
    };

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            default: return 'default';
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in_progress': return 'info';
            default: return 'warning';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsTaskModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Task
                    </Button>
                    <Button variant="outline" onClick={() => refetch()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Task Assignment Modal */}
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title="Assign Task to Volunteer"
                description="Create a new task and assign it to an active volunteer."
            >
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Task Title *</label>
                        <input
                            type="text"
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            placeholder="e.g., Visit voters in Sector 5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={taskForm.description}
                            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                            rows={3}
                            placeholder="Additional details..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Assign To *</label>
                            <select
                                value={taskForm.assigned_to}
                                onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            >
                                <option value="">Select volunteer</option>
                                {data?.volunteers.map((v) => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Priority</label>
                            <select
                                value={taskForm.priority}
                                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Due Date</label>
                        <input
                            type="date"
                            value={taskForm.due_date}
                            onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsTaskModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createTaskMutation.isPending}>
                            {createTaskMutation.isPending ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</>
                            ) : (
                                'Assign Task'
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Tasks Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        Assigned Tasks ({tasks?.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {tasksLoading ? (
                        <SkeletonTable />
                    ) : tasks && tasks.length > 0 ? (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-slate-50">
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Task</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Assigned To</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Priority</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Status</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Due Date</th>
                                        <th className="h-12 px-4 text-right font-medium text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task.id} className="border-b hover:bg-slate-50">
                                            <td className="p-4">
                                                <div className="font-medium">{task.title}</div>
                                                {task.description && (
                                                    <div className="text-slate-500 text-xs truncate max-w-[200px]">{task.description}</div>
                                                )}
                                            </td>
                                            <td className="p-4 text-slate-600">{task.assignee?.name}</td>
                                            <td className="p-4">
                                                <Badge variant={getPriorityVariant(task.priority) as any}>
                                                    {task.priority}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={getStatusVariant(task.status) as any}>
                                                    {task.status.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => updateTaskStatusMutation.mutate({ id: task.id, status: e.target.value })}
                                                    className="text-xs px-2 py-1 border rounded"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <ClipboardList className="h-12 w-12 text-slate-400 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900">No tasks yet</h3>
                            <p className="text-slate-500 mt-2">Click "Assign Task" to create one.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-orange-600" />
                            Pending Volunteer Approvals
                        </CardTitle>
                        {data?.pending && data.pending.length > 0 && (
                            <Badge variant="warning">{data.pending.length} pending</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <SkeletonTable />
                    ) : data?.pending && data.pending.length > 0 ? (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-slate-50">
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Name</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Email</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Mobile</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Applied</th>
                                        <th className="h-12 px-4 text-right font-medium text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.pending.map((volunteer) => (
                                        <tr key={volunteer.id} className="border-b hover:bg-slate-50">
                                            <td className="p-4 font-medium">{volunteer.name}</td>
                                            <td className="p-4 text-slate-600">{volunteer.email}</td>
                                            <td className="p-4 text-slate-600">{volunteer.mobile}</td>
                                            <td className="p-4 text-slate-500">
                                                {new Date(volunteer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 border-green-200 hover:bg-green-50"
                                                        onClick={() => handleApprove(volunteer.id)}
                                                        disabled={approveMutation.isPending}
                                                    >
                                                        <UserCheck className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        onClick={() => handleReject(volunteer.id)}
                                                        disabled={rejectMutation.isPending}
                                                    >
                                                        <UserX className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <UserCheck className="h-12 w-12 text-green-500 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
                            <p className="text-slate-500 mt-2">No pending volunteer applications.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Active Volunteers */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        Active Volunteers ({data?.volunteers?.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <SkeletonTable />
                    ) : data?.volunteers && data.volunteers.length > 0 ? (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-slate-50">
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Name</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Email</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Mobile</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Last Login</th>
                                        <th className="h-12 px-4 text-left font-medium text-slate-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.volunteers.map((volunteer) => (
                                        <tr key={volunteer.id} className="border-b hover:bg-slate-50">
                                            <td className="p-4 font-medium">{volunteer.name}</td>
                                            <td className="p-4 text-slate-600">{volunteer.email}</td>
                                            <td className="p-4 text-slate-600">{volunteer.mobile}</td>
                                            <td className="p-4 text-slate-500">
                                                {volunteer.last_login
                                                    ? new Date(volunteer.last_login).toLocaleDateString()
                                                    : 'Never'}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="success">Active</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Activity className="h-12 w-12 text-slate-400 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900">No volunteers yet</h3>
                            <p className="text-slate-500 mt-2">Approved volunteers will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
