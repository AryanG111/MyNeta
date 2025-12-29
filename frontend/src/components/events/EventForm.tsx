import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import type { Event } from '@/hooks/useEvents';

const eventSchema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().min(5, "Description is required"),
    event_date: z.string().min(1, "Date and Time is required"),
    location: z.string().min(2, "Location is required"),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
    initialData?: Event | null;
    onSubmit: (data: EventFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function EventForm({ initialData, onSubmit, onCancel, isLoading }: EventFormProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
    });

    useEffect(() => {
        if (initialData) {
            // Format date to local ISO string for datetime-local input
            const date = new Date(initialData.event_date);
            // Adjust shift to local timezone if needed, or simplistic slice for now
            // A robust app would use date-fns or similar.
            // Assuming event_date is ISO. 
            // HTML datetime-local expects "YYYY-MM-DDThh:mm"
            const formattedDate = date.toISOString().slice(0, 16);

            reset({
                ...initialData,
                event_date: formattedDate,
            });
        } else {
            reset({
                title: '',
                description: '',
                event_date: '',
                location: '',
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                label="Event Title"
                {...register('title')}
                error={errors.title?.message}
                placeholder="e.g. Community Meetup"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    label="Date & Time"
                    type="datetime-local"
                    {...register('event_date')}
                    error={errors.event_date?.message}
                />
                <FormField
                    label="Location"
                    {...register('location')}
                    error={errors.location?.message}
                    placeholder="e.g. Town Hall"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    {...register('description')}
                    className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Details about the event..."
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? 'Update Event' : 'Create Event'}
                </Button>
            </div>
        </form>
    );
}
