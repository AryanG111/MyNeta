import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Loader2, ChevronLeft, ChevronRight, Check, X, Mail } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useVoters, useCreateVoter, useUpdateVoter, useDeleteVoter, type Voter } from '@/hooks/useVoters';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { VoterForm } from '@/components/voters/VoterForm';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '@/context/ToastContext';
import client from '@/api/client';

interface VoterRequest {
    id: number;
    name: string;
    email: string;
    phone: string;
    area?: string;
    voter_id?: string;
    createdAt: string;
}

export function VotersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoter, setEditingVoter] = useState<Voter | null>(null);

    const { data, isLoading } = useVoters({
        page,
        limit: 10,
        search: debouncedSearch
    });

    // Fetch pending voter requests
    const { data: voterRequestsData } = useQuery({
        queryKey: ['voter-requests'],
        queryFn: async () => {
            const { data } = await client.get<{ pending: VoterRequest[] }>('/voter-requests');
            return data.pending || [];
        }
    });

    const approveVoterMutation = useMutation({
        mutationFn: (id: number) => client.post(`/voter-requests/${id}/approve`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['voter-requests'] });
            queryClient.invalidateQueries({ queryKey: ['voters'] });
            addToast('Voter approved successfully', 'success');
        },
        onError: () => addToast('Failed to approve voter', 'error')
    });

    const rejectVoterMutation = useMutation({
        mutationFn: (id: number) => client.post(`/voter-requests/${id}/reject`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['voter-requests'] });
            addToast('Voter request rejected', 'success');
        },
        onError: () => addToast('Failed to reject voter', 'error')
    });

    const createMutation = useCreateVoter();
    const updateMutation = useUpdateVoter();
    const deleteMutation = useDeleteVoter();

    const handleOpenCreate = () => {
        setEditingVoter(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (voter: Voter) => {
        setEditingVoter(voter);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this voter?')) {
            try {
                await deleteMutation.mutateAsync(id);
                addToast("Voter deleted successfully", "success");
            } catch (error) {
                addToast("Failed to delete voter", "error");
            }
        }
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (editingVoter) {
                await updateMutation.mutateAsync({ id: editingVoter.id, data: formData });
                addToast("Voter updated successfully", "success");
            } else {
                await createMutation.mutateAsync(formData);
                addToast("Voter added successfully", "success");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save voter", error);
            addToast("Failed to save voter", "error");
        }
    };

    const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Voter Management</h2>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Voter
                </Button>
            </div>

            {/* Pending Voter Requests Section */}
            {voterRequestsData && voterRequestsData.length > 0 && (
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                        <CardTitle className="text-xl text-blue-700">Pending Voter Registrations ({voterRequestsData.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border bg-white">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">Email</th>
                                        <th className="px-4 py-3 font-medium">Phone</th>
                                        <th className="px-4 py-3 font-medium">Area</th>
                                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {voterRequestsData.map((req: VoterRequest) => (
                                        <tr key={req.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium">{req.name}</td>
                                            <td className="px-4 py-3">{req.email}</td>
                                            <td className="px-4 py-3">{req.phone}</td>
                                            <td className="px-4 py-3">{req.area || 'N/A'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                                        onClick={() => approveVoterMutation.mutate(req.id)}
                                                        disabled={approveVoterMutation.isPending}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => rejectVoterMutation.mutate(req.id)}
                                                        disabled={rejectVoterMutation.isPending}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-medium">Voters List</CardTitle>
                    <div className="relative w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search by name, phone or address..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex h-48 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm text-left">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Phone</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Booth</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Ward</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Category</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {data?.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="h-24 text-center">
                                                    No voters found.
                                                </td>
                                            </tr>
                                        ) : (data?.data.map((voter) => (
                                            <tr key={voter.id} className="border-b transition-colors hover:bg-slate-50">
                                                <td className="p-4 align-middle font-medium">{voter.name}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 text-slate-400" />
                                                        {voter.email || voter.user?.email || (
                                                            <span className="text-slate-400 italic text-xs">No account</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">{voter.phone}</td>
                                                <td className="p-4 align-middle">{voter.booth || '-'}</td>
                                                <td className="p-4 align-middle">
                                                    {voter.ward_no ? (
                                                        <span className="font-semibold text-slate-700">Ward {voter.ward_no}</span>
                                                    ) : '-'}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${voter.category === 'supporter' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' :
                                                        voter.category === 'opponent' ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20' :
                                                            voter.category === 'neutral' ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20' :
                                                                'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                                                        }`}>
                                                        {voter.category || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(voter)}>
                                                            <Edit2 className="h-4 w-4 text-slate-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(voter.id)}>
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {data && totalPages > 1 && (
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>
                            <div className="text-sm font-medium">
                                Page {page} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingVoter ? "Edit Voter" : "Add New Voter"}
                description={editingVoter ? "Update voter details below." : "Enter the details for the new voter."}
            >
                <VoterForm
                    initialData={editingVoter}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </div>
    );
}
