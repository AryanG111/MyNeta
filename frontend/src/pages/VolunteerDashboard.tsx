import {
    LayoutDashboard,
    ClipboardList,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    Loader2,
    Play,
    HandHelping
} from 'lucide-react';
import { useMyTasks, useUpdateTaskStatus, useRequestCollaboration, type Task } from '@/hooks/useTasks';
import { useComplaints, type Complaint } from '@/hooks/useComplaints';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

export function VolunteerDashboardPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const { data: tasks, isLoading: tasksLoading } = useMyTasks();
    const { data: complaints, isLoading: complaintsLoading } = useComplaints(undefined, user?.id);
    const isLoading = tasksLoading || complaintsLoading;

    const updateStatusMutation = useUpdateTaskStatus();
    const requestCollabMutation = useRequestCollaboration();

    const pendingTasks = tasks?.filter((t: Task) => t.status === 'pending') || [];
    const inProgressTasks = tasks?.filter((t: Task) => t.status === 'in_progress') || [];
    const completedTasks = tasks?.filter((t: Task) => t.status === 'completed') || [];

    const pendingComplaints = complaints?.filter((c: Complaint) => c.status === 'pending') || [];
    const inProgressComplaints = complaints?.filter((c: Complaint) => c.status === 'in_progress') || [];
    const resolvedComplaints = complaints?.filter((c: Complaint) => c.status === 'resolved') || [];

    const activeComplaints = [...pendingComplaints, ...inProgressComplaints];

    const handleStartTask = (taskId: number) => {
        updateStatusMutation.mutate(
            { id: taskId, status: 'in_progress' },
            { onSuccess: () => addToast('Task started!', 'success') }
        );
    };

    const handleCompleteTask = (taskId: number) => {
        updateStatusMutation.mutate(
            { id: taskId, status: 'completed' },
            { onSuccess: () => addToast('Task completed! 🎉', 'success') }
        );
    };

    const handleRequestCollab = (taskId: number) => {
        requestCollabMutation.mutate(taskId, {
            onSuccess: () => addToast('Collaboration requested!', 'success'),
            onError: () => addToast('Failed to request collaboration', 'error')
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-green-600 bg-green-50';
        }
    };

    const TaskCard = ({ task }: { task: Task }) => (
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                {task.due_date && (
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                )}
                {task.assigner && (
                    <span>Assigned by: {task.assigner.name}</span>
                )}
            </div>

            <div className="flex gap-2">
                {task.status === 'pending' && (
                    <Button
                        size="sm"
                        onClick={() => handleStartTask(task.id)}
                        disabled={updateStatusMutation.isPending}
                    >
                        <Play className="w-3 h-3 mr-1" /> Start
                    </Button>
                )}
                {task.status === 'in_progress' && (
                    <>
                        <Button
                            size="sm"
                            onClick={() => handleCompleteTask(task.id)}
                            disabled={updateStatusMutation.isPending}
                        >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestCollab(task.id)}
                            disabled={requestCollabMutation.isPending || task.collaboration_requested}
                        >
                            <HandHelping className="w-3 h-3 mr-1" />
                            {task.collaboration_requested ? 'Requested' : 'Need Help'}
                        </Button>
                    </>
                )}
                {task.status === 'completed' && (
                    <Badge variant="success">Completed</Badge>
                )}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <LayoutDashboard className="h-8 w-8 text-primary" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h2>
                    <p className="text-gray-500">Here's your volunteer dashboard</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-orange-600 font-medium">Total Items</p>
                                <p className="text-3xl font-bold text-orange-700">{(tasks?.length || 0) + (complaints?.length || 0)}</p>
                            </div>
                            <ClipboardList className="h-10 w-10 text-orange-500 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                                <p className="text-3xl font-bold text-yellow-700">{pendingTasks.length + pendingComplaints.length}</p>
                            </div>
                            <Clock className="h-10 w-10 text-yellow-500 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">In Progress</p>
                                <p className="text-3xl font-bold text-blue-700">{inProgressTasks.length + inProgressComplaints.length}</p>
                            </div>
                            <AlertCircle className="h-10 w-10 text-blue-500 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 font-medium">Completed</p>
                                <p className="text-3xl font-bold text-green-700">{completedTasks.length + resolvedComplaints.length}</p>
                            </div>
                            <CheckCircle2 className="h-10 w-10 text-green-500 opacity-80" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Assigned Complaints (New Section) */}
            {activeComplaints.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-indigo-600">
                            <HandHelping className="h-5 w-5" />
                            Assigned Complaints
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeComplaints.map((complaint: Complaint) => (
                            <div key={complaint.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={complaint.status === 'in_progress' ? 'info' : 'warning'}>
                                        {complaint.status.replace('_', ' ')}
                                    </Badge>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getPriorityColor(complaint.priority || 'medium')}`}>
                                        {complaint.priority}
                                    </span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{complaint.issue}</h4>
                                <p className="text-xs text-gray-500">From: {complaint.voter_name}</p>
                                <div className="mt-3">
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/complaints'}>
                                        View in Complaints
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Task Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-600">
                            <Clock className="h-5 w-5" />
                            Pending Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingTasks.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No pending tasks</p>
                        ) : (
                            pendingTasks.map((task: Task) => <TaskCard key={task.id} task={task} />)
                        )}
                    </CardContent>
                </Card>

                {/* In Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-600">
                            <AlertCircle className="h-5 w-5" />
                            In Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {inProgressTasks.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No tasks in progress</p>
                        ) : (
                            inProgressTasks.map((task: Task) => <TaskCard key={task.id} task={task} />)
                        )}
                    </CardContent>
                </Card>

                {/* Completed */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-5 w-5" />
                            Completed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {completedTasks.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No completed tasks yet</p>
                        ) : (
                            completedTasks.slice(0, 5).map((task: Task) => <TaskCard key={task.id} task={task} />)
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Your Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-3xl font-bold text-primary">{completedTasks.length}</p>
                            <p className="text-sm text-gray-500">Tasks Done</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-3xl font-bold text-primary">
                                {tasks?.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                            </p>
                            <p className="text-sm text-gray-500">Completion Rate</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-3xl font-bold text-primary">{resolvedComplaints.length}</p>
                            <p className="text-sm text-gray-500">Complaints Resolved</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-3xl font-bold text-primary">0</p>
                            <p className="text-sm text-gray-500">Points Earned</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
