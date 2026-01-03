export function About() {
    return (
        <section id="about" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-extrabold text-center text-secondary mb-12">
                    About Our Candidate
                </h2>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center">
                        <img
                            src="/img/20250906_145712.jpg"
                            alt="Swati Subhash Dhore"
                            className="w-48 h-48 rounded-full mx-auto mb-8 object-cover border-4 border-primary shadow-lg"
                        />
                        <h3 className="text-3xl font-extrabold text-primary mb-4">
                            Swati Subhash Dhore
                        </h3>
                        <p className="text-lg text-gray-500 mb-6">
                            PMC Election Candidate
                        </p>
                        <p className="text-lg text-secondary leading-relaxed">
                            A dedicated public servant with years of experience in community development and social work.
                            Swati Subhash Dhore brings fresh perspectives and unwavering commitment to address the needs
                            of Pune's diverse communities. With a vision for sustainable development, better infrastructure,
                            and inclusive growth, she aims to make Pune a model city for the nation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
