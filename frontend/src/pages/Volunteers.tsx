import { Check, X, UserX, Loader2 } from 'lucide-react';
import { useVolunteers, useVolunteerRequests, useApproveRequest, useRejectRequest, useDeactivateVolunteer } from '@/hooks/useVolunteers';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';

export function VolunteersPage() {
    const { addToast } = useToast();
    const { data: volunteersData, isLoading: isLoadingVolunteers } = useVolunteers();
    const { data: requestsData, isLoading: isLoadingRequests } = useVolunteerRequests();

    const approveMutation = useApproveRequest();
    const rejectMutation = useRejectRequest();
    const deactivateMutation = useDeactivateVolunteer();

    const handleApprove = async (id: number) => {
        try {
            await approveMutation.mutateAsync(id);
            addToast("Volunteer approved", "success");
        } catch (error) {
            console.error("Failed to approve", error);
            addToast("Failed to approve", "error");
        }
    };

    const handleReject = async (id: number) => {
        if (confirm('Are you sure you want to reject this request?')) {
            try {
                await rejectMutation.mutateAsync(id);
                addToast("Request rejected", "success");
            } catch (error) {
                addToast("Failed to reject request", "error");
            }
        }
    };

    const handleDeactivate = async (id: number) => {
        if (confirm('Are you sure you want to deactivate this volunteer?')) {
            try {
                await deactivateMutation.mutateAsync(id);
                addToast("Volunteer deactivated", "success");
            } catch (error) {
                addToast("Failed to deactivate", "error");
            }
        }
    };

    if (isLoadingVolunteers || isLoadingRequests) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Volunteer Management</h2>
                <p className="text-slate-500 mt-2">Manage active team members and review new applications.</p>
            </div>

            {/* Pending Requests Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-orange-600">Pending Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Applicant</th>
                                    <th className="px-4 py-3 font-medium">Contact</th>
                                    <th className="px-4 py-3 font-medium">Message</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {!requestsData?.length ? (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center text-slate-500">
                                            No pending applications at the moment.
                                        </td>
                                    </tr>
                                ) : (
                                    requestsData.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {req.avatar_url ? (
                                                        <img src={req.avatar_url} alt="" className="h-8 w-8 rounded-full bg-slate-200" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                            {req.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <span className="font-medium">{req.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span>{req.email}</span>
                                                    <span className="text-xs text-slate-500">{req.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate" title={req.message}>
                                                {req.message || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">Today</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApprove(req.id)}
                                                        isLoading={approveMutation.isPending}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => handleReject(req.id)}
                                                        isLoading={rejectMutation.isPending}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Active Volunteers Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Active Volunteers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">Mobile</th>
                                    <th className="px-4 py-3 font-medium">Area</th>
                                    <th className="px-4 py-3 font-medium">Last Login</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {!volunteersData?.volunteers.length ? (
                                    <tr>
                                        <td colSpan={6} className="h-24 text-center text-slate-500">
                                            No active volunteers found.
                                        </td>
                                    </tr>
                                ) : (
                                    volunteersData.volunteers.map((vol) => (
                                        <tr key={vol.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium">{vol.name}</td>
                                            <td className="px-4 py-3">{vol.email}</td>
                                            <td className="px-4 py-3">{vol.mobile || "N/A"}</td>
                                            <td className="px-4 py-3">{vol.area || "N/A"}</td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {vol.last_login ? new Date(vol.last_login).toLocaleDateString() : "Never"}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeactivate(vol.id)}
                                                >
                                                    <UserX className="h-4 w-4 mr-2" /> Deactivate
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
