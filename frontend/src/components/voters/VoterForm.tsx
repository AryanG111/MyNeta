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
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
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
            category: 'neutral',
            email: '',
            password: '',
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData,
                email: (initialData as any).email || (initialData as any).user?.email || '',
                password: '',
            });
        } else {
            reset({
                name: '',
                address: '',
                booth: '',
                phone: '',
                category: 'neutral',
                email: '',
                password: '',
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

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label="Phone Number"
                    {...register('phone')}
                    error={errors.phone?.message}
                    placeholder="e.g. 9876543210"
                />
                <FormField
                    label="Email (Optional for Login)"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="voter@email.com"
                />
            </div>

            {!initialData && (
                <FormField
                    label="Password (for New Account)"
                    type="password"
                    {...register('password')}
                    error={errors.password?.message}
                    placeholder="Minimum 6 characters"
                />
            )}

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
                        <option value="supporter">Supporter</option>
                        <option value="neutral">Neutral</option>
                        <option value="opponent">Opponent</option>
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
                    {initialData ? 'Update Voter' : 'Add Voter & Create Account'}
                </Button>
            </div>
        </form>
    );
}
