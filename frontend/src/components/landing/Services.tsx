import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, Handshake } from 'lucide-react';

const services = [
    {
        icon: MessageSquare,
        title: 'Complaint Management',
        description: 'Submit your complaints and grievances directly to us. We ensure quick resolution and regular updates on your issues.',
        buttonText: 'Submit Complaint',
    },
    {
        icon: Calendar,
        title: 'Community Events',
        description: "Stay updated with our community meetings, public hearings, and events. Your participation matters in shaping our city's future.",
        buttonText: 'View Events',
    },
    {
        icon: Handshake,
        title: 'Volunteer Program',
        description: "Join our volunteer program and contribute to community development. Together, we can make a real difference in people's lives.",
        buttonText: 'Join Us',
    },
];

export function Services() {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-extrabold text-center text-secondary mb-12">
                    How We Serve You
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 text-center"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Icon className="w-10 h-10 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-secondary mb-4">
                                    {service.title}
                                </h4>
                                <p className="text-gray-500 mb-6">
                                    {service.description}
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-block bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
                                >
                                    {service.buttonText}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
