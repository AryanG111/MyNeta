import { useEffect, useState } from 'react';
import { LandingHeader } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { About } from '@/components/landing/About';
import { Vision } from '@/components/landing/Vision';
import { Services } from '@/components/landing/Services';
import { ResolvedComplaintsSection } from '@/components/landing/ResolvedComplaints';
import { Footer } from '@/components/landing/Footer';

interface ResolvedComplaint {
    id: number;
    issue: string;
    resolution_notes: string;
    resolution_photo: string | null;
    resolved_at: string;
    voter_name: string;
}

export function LandingPage() {
    const [resolvedComplaints, setResolvedComplaints] = useState<ResolvedComplaint[]>([]);

    useEffect(() => {
        // Fetch resolved complaints for public display
        fetch('http://localhost:5000/api/complaints/resolved')
            .then(res => res.json())
            .then(data => setResolvedComplaints(data))
            .catch(() => setResolvedComplaints([]));
    }, []);

    return (
        <div className="min-h-screen">
            <LandingHeader />
            <Hero />
            <About />
            <Vision />
            <Services />
            <ResolvedComplaintsSection complaints={resolvedComplaints} />
            <Footer />
        </div>
    );
}
