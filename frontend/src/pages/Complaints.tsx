import { useState } from 'react';
import { Trash2, CheckCircle, Clock } from 'lucide-react';
import { useComplaints, useUpdateComplaintStatus, useDeleteComplaint, type Complaint } from '@/hooks/useComplaints';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ComplaintStatusBadge } from '@/components/complaints/ComplaintStatusBadge';
import { useToast } from '@/context/ToastContext';

export function ComplaintsPage() {
    const [filterStatus, setFilterStatus] = useState<string>('');
    const { addToast } = useToast();

    const { data: complaints, isLoading } = useComplaints(filterStatus);
    const updateStatusMutation = useUpdateComplaintStatus();
    const deleteMutation = useDeleteComplaint();

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status: newStatus });
            addToast(`Status updated to ${newStatus}`, "success");
        } catch (error) {
            console.error("Failed to update status", error);
            addToast("Failed to update status", "error");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this complaint?')) {
            try {
                await deleteMutation.mutateAsync(id);
                addToast("Complaint deleted", "success");
            } catch (error) {
                addToast("Failed to delete complaint", "error");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Complaints Tracking</h2>
                    <p className="text-slate-500 mt-2">Monitor and resolve voter issues.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['', 'pending', 'resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filterStatus === status
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div>Loading complaints...</div>
                ) : complaints?.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                        No complaints found matching your filter.
                    </div>
                ) : (
                    complaints?.map((complaint: Complaint) => (
                        <Card key={complaint.id} className="flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <ComplaintStatusBadge status={complaint.status} />
                                    <span className="text-xs text-slate-400">
                                        {new Date(complaint.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-base font-semibold mt-2 leading-tight">
                                    {complaint.issue}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-end pt-0">
                                <div className="text-sm text-slate-500 mt-4 mb-4">
                                    <p className="font-medium text-slate-700">{complaint.voter_name}</p>
                                    <p>{complaint.voter_phone || 'No phone number'}</p>
                                </div>

                                <div className="flex items-center justify-between border-t pt-4 mt-auto">
                                    <div className="flex gap-2">
                                        {complaint.status !== 'resolved' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-green-600 hover:bg-green-50 px-2"
                                                onClick={() => handleStatusChange(complaint.id, 'resolved')}
                                                title="Mark as Resolved"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {complaint.status !== 'pending' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-yellow-600 hover:bg-yellow-50 px-2"
                                                onClick={() => handleStatusChange(complaint.id, 'pending')}
                                                title="Mark as Pending"
                                            >
                                                <Clock className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(complaint.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
