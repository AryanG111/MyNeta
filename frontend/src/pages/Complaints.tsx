import { useState, useRef } from 'react';
import { Trash2, CheckCircle, Clock, UserPlus, Camera, AlertTriangle, Image as ImageIcon, Hand } from 'lucide-react';
import { useComplaints, useUpdateComplaintStatus, useDeleteComplaint, type Complaint } from '@/hooks/useComplaints';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { ComplaintStatusBadge } from '@/components/complaints/ComplaintStatusBadge';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import client from '@/api/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Volunteer {
    id: number;
    name: string;
    email: string;
}

export function ComplaintsPage() {
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [resolutionPhoto, setResolutionPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { addToast } = useToast();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: complaints, isLoading } = useComplaints(filterStatus);
    const updateStatusMutation = useUpdateComplaintStatus();
    const deleteMutation = useDeleteComplaint();

    // Fetch volunteers for assignment
    const { data: volunteersData } = useQuery({
        queryKey: ['volunteers-list'],
        queryFn: async () => {
            const { data } = await client.get('/volunteers');
            return data;
        },
        enabled: user?.role === 'admin'
    });

    const volunteers = volunteersData?.volunteers || [];

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status: newStatus });
            addToast(`Status updated to ${newStatus}`, "success");
        } catch {
            addToast("Failed to update status", "error");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this complaint?')) {
            try {
                await deleteMutation.mutateAsync(id);
                addToast("Complaint deleted", "success");
            } catch {
                addToast("Failed to delete complaint", "error");
            }
        }
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResolutionPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleResolveSubmit = async () => {
        if (!selectedComplaint || !resolutionNotes) {
            addToast('Please provide resolution notes', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('notes', resolutionNotes);
            if (resolutionPhoto) {
                formData.append('photo', resolutionPhoto);
            }

            await client.post(`/complaints/${selectedComplaint.id}/resolve`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            queryClient.invalidateQueries({ queryKey: ['complaints'] });
            addToast('Complaint resolved successfully!', 'success');
            setIsResolveModalOpen(false);
            resetResolveForm();
        } catch {
            addToast('Failed to resolve complaint', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignVolunteer = async (volunteerId: number) => {
        if (!selectedComplaint) return;

        try {
            await client.patch(`/complaints/${selectedComplaint.id}/assign`, {
                volunteer_id: volunteerId
            });
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
            addToast('Volunteer assigned successfully!', 'success');
            setIsAssignModalOpen(false);
        } catch {
            addToast('Failed to assign volunteer', 'error');
        }
    };

    const handleApproveResolution = async (id: number) => {
        try {
            await client.patch(`/complaints/${id}/approve`);
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
            addToast('Resolution approved!', 'success');
        } catch {
            addToast('Failed to approve resolution', 'error');
        }
    };

    const handleAcceptComplaint = async (id: number) => {
        try {
            await client.patch(`/complaints/${id}/accept`);
            queryClient.invalidateQueries({ queryKey: ['complaints'] });
            addToast('Complaint accepted! You are now assigned.', 'success');
        } catch {
            addToast('Failed to accept complaint', 'error');
        }
    };

    const resetResolveForm = () => {
        setResolutionNotes('');
        setResolutionPhoto(null);
        setPhotoPreview(null);
        setSelectedComplaint(null);
    };

    const openResolveModal = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setIsResolveModalOpen(true);
    };

    const openAssignModal = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setIsAssignModalOpen(true);
    };

    const canResolve = (complaint: Complaint) => {
        if (user?.role === 'admin') return true;
        return complaint.assigned_volunteer_id === user?.id;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Complaints Tracking</h2>
                    <p className="text-slate-500 mt-2">Monitor and resolve voter issues.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['', 'pending', 'in_progress', 'resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filterStatus === status
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            {status === '' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </button>
                    ))}
                </div>
            </div>

            {/* Resolve Modal */}
            <Modal
                isOpen={isResolveModalOpen}
                onClose={() => { setIsResolveModalOpen(false); resetResolveForm(); }}
                title="Resolve Complaint"
                description="Provide resolution details and proof photo"
            >
                <div className="space-y-4">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm font-medium text-orange-800">{selectedComplaint?.issue}</p>
                        <p className="text-xs text-orange-600 mt-1">From: {selectedComplaint?.voter_name}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Resolution Notes *</label>
                        <textarea
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                            rows={3}
                            placeholder="Describe how the complaint was resolved..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Proof Photo *</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                        />
                        {photoPreview ? (
                            <div className="relative">
                                <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                <button
                                    onClick={() => { setResolutionPhoto(null); setPhotoPreview(null); }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors"
                            >
                                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Click to upload photo</span>
                            </button>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="ghost" onClick={() => { setIsResolveModalOpen(false); resetResolveForm(); }}>
                            Cancel
                        </Button>
                        <Button onClick={handleResolveSubmit} disabled={isSubmitting || !resolutionNotes}>
                            {isSubmitting ? 'Submitting...' : 'Submit Resolution'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Assign Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assign Volunteer"
                description="Select a volunteer to handle this complaint"
            >
                <div className="space-y-3">
                    {volunteers.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No active volunteers available</p>
                    ) : (
                        volunteers.map((v: Volunteer) => (
                            <button
                                key={v.id}
                                onClick={() => handleAssignVolunteer(v.id)}
                                className="w-full p-3 text-left border rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
                            >
                                <p className="font-medium">{v.name}</p>
                                <p className="text-sm text-gray-500">{v.email}</p>
                            </button>
                        ))
                    )}
                </div>
            </Modal>

            {/* Complaints Grid */}
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
                                <div className="text-sm text-slate-500 mb-4">
                                    <p className="font-medium text-slate-700">{complaint.voter_name}</p>
                                    <p>{complaint.voter_phone || 'No phone number'}</p>
                                    {complaint.assigned_volunteer && (
                                        <p className="mt-2 text-primary">
                                            <UserPlus className="inline h-3 w-3 mr-1" />
                                            Assigned: {complaint.assigned_volunteer}
                                        </p>
                                    )}
                                </div>

                                {/* Resolution Preview */}
                                {complaint.status === 'resolved' && complaint.resolution_photo && (
                                    <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-green-700">
                                            <ImageIcon className="h-4 w-4" />
                                            <span>Resolution photo attached</span>
                                        </div>
                                        {!complaint.approved_by_admin && user?.role === 'admin' && (
                                            <Badge variant="warning" className="mt-2">Pending Approval</Badge>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between border-t pt-4 mt-auto">
                                    <div className="flex gap-2">
                                        {/* Admin: Assign volunteer */}
                                        {user?.role === 'admin' && complaint.status === 'pending' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 hover:bg-blue-50 px-2"
                                                onClick={() => openAssignModal(complaint)}
                                                title="Assign Volunteer"
                                            >
                                                <UserPlus className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Volunteer: Accept pending complaint */}
                                        {user?.role === 'volunteer' && complaint.status === 'pending' && !complaint.assigned_volunteer_id && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-purple-600 hover:bg-purple-50 px-2"
                                                onClick={() => handleAcceptComplaint(complaint.id)}
                                                title="Accept this complaint"
                                            >
                                                <Hand className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Resolve button */}
                                        {complaint.status !== 'resolved' && canResolve(complaint) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-green-600 hover:bg-green-50 px-2"
                                                onClick={() => openResolveModal(complaint)}
                                                title="Resolve with proof"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Admin: Approve resolution */}
                                        {user?.role === 'admin' && complaint.status === 'resolved' && !complaint.approved_by_admin && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-orange-600 hover:bg-orange-50 px-2"
                                                onClick={() => handleApproveResolution(complaint.id)}
                                                title="Approve Resolution"
                                            >
                                                <AlertTriangle className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Mark as pending */}
                                        {complaint.status !== 'pending' && user?.role === 'admin' && (
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
                                    {user?.role === 'admin' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(complaint.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
