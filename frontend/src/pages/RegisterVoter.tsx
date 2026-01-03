import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, Loader2, MapPin, CreditCard } from 'lucide-react';
import client from '@/api/client';

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    area: z.string().optional(),
    voter_id: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterVoterPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError(null);
            await client.post('/voter-requests/request', {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                area: data.area || '',
                voter_id: data.voter_id || '',
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-800/90 to-indigo-900/90" />

                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Submitted!</h2>
                        <p className="text-gray-600 mb-6">
                            Your voter registration has been submitted successfully.
                            An admin will review your application and you'll be notified once approved.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full font-semibold"
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-800/90 to-indigo-900/90" />

            <Link
                to="/"
                className="absolute top-6 left-6 text-white font-medium flex items-center gap-2 hover:text-blue-200 transition-colors z-20"
            >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
            </Link>

            <div className="relative z-10 w-full h-full flex items-center justify-center p-4 overflow-auto">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-6 text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <User className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Voter Registration</h1>
                        <p className="text-blue-100 mt-1">Join your community</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('name')}
                                    type="text"
                                    placeholder="Enter your name"
                                    className={`w-full pl-12 pr-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="your@email.com"
                                    className={`w-full pl-12 pr-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    placeholder="9876543210"
                                    className={`w-full pl-12 pr-4 py-3 border ${errors.phone ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Area / Constituency</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('area')}
                                    type="text"
                                    placeholder="Your area or constituency"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Voter ID (optional)</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('voter_id')}
                                    type="text"
                                    placeholder="Your voter ID"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    className={`w-full pl-12 pr-12 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Registration'
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Want to volunteer instead?{' '}
                            <Link to="/register-volunteer" className="text-blue-600 font-medium hover:underline">
                                Register as Volunteer
                            </Link>
                        </p>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
