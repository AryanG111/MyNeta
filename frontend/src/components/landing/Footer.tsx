import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
    return (
        <footer id="contact" className="bg-secondary text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h4 className="text-xl font-bold text-primary mb-4">My Neta</h4>
                        <p className="text-gray-300 mb-4">
                            Dedicated to serving the people of Pune with transparency, integrity, and progressive leadership.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-accent hover:-translate-y-1 transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-accent hover:-translate-y-1 transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-accent hover:-translate-y-1 transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-accent hover:-translate-y-1 transition-all">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h5 className="font-semibold mb-4">Quick Links</h5>
                        <ul className="space-y-2">
                            <li>
                                <a href="#about" className="text-gray-300 hover:text-primary transition-colors">
                                    About Swati Subhash Dhore
                                </a>
                            </li>
                            <li>
                                <a href="#vision" className="text-gray-300 hover:text-primary transition-colors">
                                    Our Vision
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="text-gray-300 hover:text-primary transition-colors">
                                    Services
                                </a>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-300 hover:text-primary transition-colors">
                                    Login Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h5 className="font-semibold mb-4">Contact Info</h5>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-300">
                                <MapPin className="w-4 h-4 text-primary" />
                                Pune, Maharashtra, India
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <Phone className="w-4 h-4 text-primary" />
                                +91 78750 20101
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <Mail className="w-4 h-4 text-primary" />
                                subhashdhore0101.com
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="border-gray-700 mb-6" />

                <div className="text-center text-gray-400 text-sm">
                    <p>&copy; 2025 My Neta - PMC Elections. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
