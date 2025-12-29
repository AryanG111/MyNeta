import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import type { Voter } from '@/hooks/useVoters';

const voterSchema = z.object({
    name: z.string().min(2, "Name is required"),
    address: z.string().min(5, "Address is required"),
    booth: z.string().min(1, "Booth number is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    category: z.string().min(1, "Category is required"),
});

type VoterFormData = z.infer<typeof voterSchema>;

interface VoterFormProps {
    initialData?: Voter | null; // null means create mode
    onSubmit: (data: VoterFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function VoterForm({ initialData, onSubmit, onCancel, isLoading }: VoterFormProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<VoterFormData>({
        resolver: zodResolver(voterSchema),
        defaultValues: {
            name: '',
            address: '',
            booth: '',
            phone: '',
            category: 'A', // Default category
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                name: '',
                address: '',
                booth: '',
                phone: '',
                category: 'A',
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                label="Full Name"
                {...register('name')}
                error={errors.name?.message}
                placeholder="Enter voter name"
            />

            <FormField
                label="Phone Number"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="e.g. 9876543210"
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label="Booth Number"
                    {...register('booth')}
                    error={errors.booth?.message}
                    placeholder="e.g. 42"
                />
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        {...register('category')}
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="A">Group A</option>
                        <option value="B">Group B</option>
                        <option value="C">Group C</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                </div>
            </div>

            <FormField
                label="Address"
                {...register('address')}
                error={errors.address?.message}
                placeholder="Full address"
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? 'Update Voter' : 'Add Voter'}
                </Button>
            </div>
        </form>
    );
}
