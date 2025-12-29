import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Calendar, Loader2 } from 'lucide-react';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, type Event } from '@/hooks/useEvents';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { EventForm } from '@/components/events/EventForm';
import { useToast } from '@/context/ToastContext';

export function EventsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const { addToast } = useToast();

    const { data: events, isLoading } = useEvents();
    const createMutation = useCreateEvent();
    const updateMutation = useUpdateEvent();
    const deleteMutation = useDeleteEvent();

    const handleOpenCreate = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (event: Event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteMutation.mutateAsync(id);
                addToast("Event deleted successfully", "success");
            } catch (error) {
                addToast("Failed to delete event", "error");
            }
        }
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (editingEvent) {
                await updateMutation.mutateAsync({ id: editingEvent.id, data: formData });
                addToast("Event updated successfully", "success");
            } else {
                await createMutation.mutateAsync(formData);
                addToast("Event scheduled successfully", "success");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save event", error);
            addToast("Failed to save event", "error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Events</h2>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Create Event
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : events?.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                        No upcoming events scheduled.
                    </div>
                ) : (
                    events?.map((event) => (
                        <Card key={event.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="h-2 bg-primary" />
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                        {new Date(event.event_date).toLocaleString('default', { month: 'short' })}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenEdit(event)}>
                                            <Edit2 className="h-4 w-4 text-slate-500" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(event.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                                <div className="space-y-2 text-sm text-slate-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(event.event_date).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm line-clamp-3">
                                    {event.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingEvent ? "Edit Event" : "Create New Event"}
                description={editingEvent ? "Update event details below." : "Schedule a new upcoming event."}
            >
                <EventForm
                    initialData={editingEvent}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </div>
    );
}
