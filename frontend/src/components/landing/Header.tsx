import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-secondary shadow-xl'
                    : 'bg-secondary/95 backdrop-blur-sm'
                }`}
        >
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <a href="#home" className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                            M
                        </span>
                        My Neta
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <button onClick={() => scrollToSection('home')} className="text-gray-300 font-medium hover:text-white transition-colors">
                            Home
                        </button>
                        <button onClick={() => scrollToSection('about')} className="text-gray-300 font-medium hover:text-white transition-colors">
                            About
                        </button>
                        <button onClick={() => scrollToSection('vision')} className="text-gray-300 font-medium hover:text-white transition-colors">
                            Vision
                        </button>
                        <button onClick={() => scrollToSection('services')} className="text-gray-300 font-medium hover:text-white transition-colors">
                            Services
                        </button>
                        <button onClick={() => scrollToSection('contact')} className="text-gray-300 font-medium hover:text-white transition-colors">
                            Contact
                        </button>
                        <Link
                            to="/login"
                            className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-dark transition-all hover:-translate-y-0.5 shadow-lg"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
                        <div className="flex flex-col gap-4">
                            <button onClick={() => scrollToSection('home')} className="text-white font-medium text-left">Home</button>
                            <button onClick={() => scrollToSection('about')} className="text-white font-medium text-left">About</button>
                            <button onClick={() => scrollToSection('vision')} className="text-white font-medium text-left">Vision</button>
                            <button onClick={() => scrollToSection('services')} className="text-white font-medium text-left">Services</button>
                            <button onClick={() => scrollToSection('contact')} className="text-white font-medium text-left">Contact</button>
                            <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-full font-semibold text-center">
                                Login
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
