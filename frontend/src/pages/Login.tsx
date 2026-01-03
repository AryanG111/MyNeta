import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Crown, Handshake, User, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import client from '@/api/client';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
    identifier: z.string().min(1, "Email or Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;
type Role = 'admin' | 'volunteer' | 'voter';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role>('voter');
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            setError(null);
            const response = await client.post('/auth/login', data);
            const { token, user } = response.data;
            login(token, user);
            // Redirect based on role
            if (user.role === 'volunteer') {
                navigate('/my-dashboard');
            } else if (user.role === 'voter') {
                navigate('/voter-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        }
    };

    const roles: { value: Role; label: string; icon: typeof Crown }[] = [
        { value: 'admin', label: 'Admin', icon: Crown },
        { value: 'volunteer', label: 'Volunteer', icon: Handshake },
        { value: 'voter', label: 'Voter', icon: User },
    ];

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden">
            {/* Full screen background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/img/IMG-20170112-WA0086.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/90 to-secondary/90" />

            {/* Back to Home */}
            <Link
                to="/"
                className="absolute top-6 left-6 text-white font-medium flex items-center gap-2 hover:text-accent transition-colors z-20"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
            </Link>

            {/* Centered Login Card */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-primary-dark p-8 text-center text-white">
                            <img
                                src="/img/20250906_145712.jpg"
                                alt="My Neta"
                                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/30 object-cover shadow-lg"
                            />
                            <h1 className="text-2xl font-bold">My Neta</h1>
                            <p className="text-white/80 text-sm">PMC Elections Management System</p>
                        </div>

                        {/* Form */}
                        <div className="p-6">
                            {error && (
                                <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Role Selection */}
                                <div className="mb-5">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Select Your Role</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {roles.map((role) => {
                                            const Icon = role.icon;
                                            return (
                                                <button
                                                    key={role.value}
                                                    type="button"
                                                    onClick={() => setSelectedRole(role.value)}
                                                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 font-medium text-xs transition-all ${selectedRole === role.value
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-gray-200 text-gray-500 hover:border-primary/50'
                                                        }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    {role.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email / Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            {...register('identifier')}
                                            type="text"
                                            placeholder="Enter your email"
                                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    {errors.identifier && (
                                        <p className="mt-1 text-xs text-red-500">{errors.identifier.message}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            {...register('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>

                            {/* Register Link */}
                            <p className="text-center mt-4 text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link to="/register-volunteer" className="text-primary font-semibold hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 text-center py-3 text-gray-400 text-xs border-t">
                            © 2025 My Neta - PMC Elections
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
