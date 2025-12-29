import { Link, useLocation } from 'react-router-dom';
import {
    BarChart3,
    Users,
    UserPlus,
    AlertCircle,
    Calendar,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function Sidebar() {
    const { pathname } = useLocation();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: '/', label: 'Dashboard', icon: BarChart3 },
        { href: '/voters', label: 'Voters', icon: Users },
        { href: '/volunteers', label: 'Volunteers', icon: UserPlus },
        { href: '/complaints', label: 'Complaints', icon: AlertCircle },
        { href: '/events', label: 'Events', icon: Calendar },
    ];

    const SidebarContent = () => (
        <div className="flex bg-white h-full flex-col border-r">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
                    MyNeta
                </h1>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => setIsOpen(false)} // Close on mobile click
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-0 left-0 p-4 z-40">
                <Button
                    variant="outline"
                    size="sm"
                    className="p-2 h-10 w-10 bg-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 md:relative md:translate-x-0 bg-white",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </div>
        </>
    );
}
