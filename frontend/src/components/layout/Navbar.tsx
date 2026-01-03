import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { LogOut, User, ChevronDown } from 'lucide-react';

export function Navbar() {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin': return 'danger';
            case 'volunteer': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
                Welcome back, <span className="text-primary">{user?.name}</span>
            </h2>

            <div className="flex items-center gap-4">
                {/* Role Badge */}
                <Badge variant={getRoleBadgeVariant(user?.role || '')}>
                    {user?.role?.toUpperCase()}
                </Badge>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
