import { Link } from 'react-router-dom';
import { GlareHover } from '@/components/ui/GlareHover';

export function Hero() {
    return (
        <section
            id="home"
            className="min-h-screen flex items-center bg-gradient-to-br from-primary via-primary to-primary-dark relative overflow-hidden pt-20"
        >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white order-2 lg:order-1">
                        <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                            🗳️ PMC Elections 2025
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                            Swati Subhash
                            <span className="block text-accent">Dhore</span>
                        </h1>
                        <h2 className="text-xl md:text-2xl mb-6 opacity-90 font-light">
                            Your Voice for PMC Elections
                        </h2>
                        <p className="text-lg opacity-80 mb-8 max-w-xl leading-relaxed">
                            Committed to serving the people of Pune with dedication, transparency, and progressive leadership.
                            Together, let's build a better future for our city.
                        </p>

                        {/* Dock Buttons with Glare Effect */}
                        <div className="flex flex-wrap gap-4">
                            <GlareHover
                                background="white"
                                borderRadius="9999px"
                                glareColor="#FF6B35"
                                glareOpacity={0.3}
                                transitionDuration={600}
                            >
                                <a
                                    href="#about"
                                    className="inline-block px-8 py-4 text-primary font-semibold"
                                >
                                    Learn More
                                </a>
                            </GlareHover>

                            <GlareHover
                                background="#2C3E50"
                                borderRadius="9999px"
                                borderColor="rgba(255,255,255,0.2)"
                                glareColor="#ffffff"
                                glareOpacity={0.2}
                                transitionDuration={600}
                            >
                                <Link
                                    to="/login"
                                    className="inline-block px-8 py-4 text-white font-semibold"
                                >
                                    Join Our Mission
                                </Link>
                            </GlareHover>

                            <GlareHover
                                background="#3B82F6"
                                borderRadius="9999px"
                                borderColor="rgba(255,255,255,0.3)"
                                glareColor="#ffffff"
                                glareOpacity={0.25}
                                transitionDuration={600}
                            >
                                <Link
                                    to="/register-voter"
                                    className="inline-block px-8 py-4 text-white font-semibold"
                                >
                                    🗳️ Register as Voter
                                </Link>
                            </GlareHover>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        <div className="relative">
                            {/* Decorative ring */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-accent/30 to-white/20 rounded-3xl blur-xl" />
                            <div className="relative bg-white/10 p-3 rounded-3xl backdrop-blur-sm">
                                <img
                                    src="/img/Subhash & Swati .webp"
                                    alt="Swati Subhash Dhore"
                                    className="rounded-2xl shadow-2xl max-w-full h-auto w-full max-h-[500px] object-cover"
                                    style={{ imageRendering: 'auto' }}
                                />
                            </div>
                            {/* Stats overlay */}
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 hidden md:block">
                                <div className="text-3xl font-bold text-primary">10+</div>
                                <div className="text-sm text-gray-600">Years of Service</div>
                            </div>
                            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 hidden md:block">
                                <div className="text-3xl font-bold text-primary">Ward 11</div>
                                <div className="text-sm text-gray-600">Pune, Maharashtra</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-white/70 rounded-full" />
                </div>
            </div>
        </section>
    );
}
