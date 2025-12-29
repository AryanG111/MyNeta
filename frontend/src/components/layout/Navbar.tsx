import { useAuth } from '@/context/AuthContext';

export function Navbar() {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
                Welcome back, {user?.name}
            </h2>
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
}
