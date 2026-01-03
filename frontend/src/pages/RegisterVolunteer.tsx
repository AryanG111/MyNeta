import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, Loader2, FileText } from 'lucide-react';
import client from '@/api/client';

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    message: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterVolunteerPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError(null);
            await client.post('/volunteer/request', {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                message: data.message || '',
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 w-full h-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/img/IMG-20170112-WA0086.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/90 to-secondary/90" />

                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-secondary mb-4">Request Submitted!</h2>
                        <p className="text-gray-600 mb-6">
                            Your volunteer request has been submitted successfully.
                            An admin will review your application and you'll be notified once approved.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-full font-semibold"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/img/IMG-20170112-WA0086.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/90 to-secondary/90" />

            <Link
                to="/"
                className="absolute top-6 left-6 text-white font-medium flex items-center gap-2 hover:text-accent transition-colors z-20"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
            </Link>

            <div className="relative z-10 w-full h-full flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-md my-8">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-center text-white">
                            <h1 className="text-2xl font-bold">Become a Volunteer</h1>
                            <p className="text-white/80 text-sm">Join our mission to serve Pune</p>
                        </div>

                        <div className="p-6">
                            {error && (
                                <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            {...register('name')}
                                            placeholder="Enter your full name"
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            {...register('phone')}
                                            placeholder="Enter your phone number"
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            {...register('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Create a password"
                                            className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message (Optional)</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            {...register('message')}
                                            placeholder="Tell us about yourself..."
                                            rows={3}
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Request'
                                    )}
                                </button>
                            </form>

                            <p className="text-center mt-4 text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary font-semibold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
