import { Building2, Users, Leaf } from 'lucide-react';

const visionItems = [
    {
        icon: Building2,
        title: 'Smart City Development',
        description: 'Transforming Pune into a smart city with modern infrastructure, digital governance, and sustainable urban planning.',
    },
    {
        icon: Users,
        title: 'Community Welfare',
        description: 'Ensuring the welfare of all citizens through accessible healthcare, education, and social security programs.',
    },
    {
        icon: Leaf,
        title: 'Environmental Protection',
        description: 'Promoting green initiatives, clean energy, and sustainable practices for a healthier environment.',
    },
];

export function Vision() {
    return (
        <section id="vision" className="py-24 bg-primary-lighter">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-extrabold text-center text-secondary mb-12">
                    Our Vision for Pune
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {visionItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Icon className="w-10 h-10 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-center text-secondary mb-4">
                                    {item.title}
                                </h4>
                                <p className="text-gray-500 text-center">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
