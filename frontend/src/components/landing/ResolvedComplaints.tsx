import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ResolvedComplaint {
    id: number;
    issue: string;
    resolution_notes: string;
    resolution_photo: string | null;
    resolved_at: string;
    voter_name: string;
}

interface ResolvedComplaintsSectionProps {
    complaints: ResolvedComplaint[];
}

export function ResolvedComplaintsSection({ complaints }: ResolvedComplaintsSectionProps) {
    if (!complaints || complaints.length === 0) {
        return null;
    }

    return (
        <section id="resolved" className="py-20 bg-gradient-to-b from-white to-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                        <CheckCircle2 className="w-4 h-4" />
                        Issues Resolved
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        We Listen & Act
                    </h2>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        See how we're addressing community concerns and making a real difference
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complaints.slice(0, 6).map((complaint) => (
                        <div
                            key={complaint.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 hover:shadow-xl transition-shadow"
                        >
                            {complaint.resolution_photo && (
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={`http://localhost:5000${complaint.resolution_photo}`}
                                        alt="Resolution proof"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Resolved
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-1">Complaint</p>
                                        <p className="font-medium text-gray-900 line-clamp-2">{complaint.issue}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-green-600 mb-3">
                                    <ArrowRight className="w-4 h-4" />
                                    <span className="text-sm font-medium">Resolution</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3">{complaint.resolution_notes}</p>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        {new Date(complaint.resolved_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        — {complaint.voter_name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {complaints.length > 6 && (
                    <div className="text-center mt-8">
                        <a
                            href="/login"
                            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                        >
                            View all resolved issues
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
