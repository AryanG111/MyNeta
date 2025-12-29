import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVoters, useCreateVoter, useUpdateVoter, useDeleteVoter, type Voter } from '@/hooks/useVoters';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { VoterForm } from '@/components/voters/VoterForm';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '@/context/ToastContext'; // We need this hook

export function VotersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500); // Debounce search input
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoter, setEditingVoter] = useState<Voter | null>(null);

    const { data, isLoading } = useVoters({
        page,
        limit: 10,
        search: debouncedSearch
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
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Phone</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Booth</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Category</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Address</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {data?.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="h-24 text-center">
                                                    No voters found.
                                                </td>
                                            </tr>
                                        ) : (data?.data.map((voter) => (
                                            <tr key={voter.id} className="border-b transition-colors hover:bg-slate-50">
                                                <td className="p-4 align-middle font-medium">{voter.name}</td>
                                                <td className="p-4 align-middle">{voter.phone}</td>
                                                <td className="p-4 align-middle">{voter.booth}</td>
                                                <td className="p-4 align-middle">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${voter.category === 'A' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                        voter.category === 'B' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                                            'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                                        }`}>
                                                        Group {voter.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle max-w-[200px] truncate" title={voter.address}>{voter.address}</td>
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
