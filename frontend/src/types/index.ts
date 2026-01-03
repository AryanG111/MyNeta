// Shared TypeScript types for MyNeta frontend

// User types
export type UserRole = 'admin' | 'volunteer' | 'voter';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    mobile?: string;
    area?: string;
    is_approved: boolean;
    avatar_url?: string;
    last_login?: string;
    createdAt?: string;
}

// Voter types
export type VoterCategory = 'supporter' | 'neutral' | 'opponent';

export interface Voter {
    id: number;
    name: string;
    phone: string;
    address: string;
    booth: string;
    city?: string;
    section?: string;
    part_no?: string;
    notes?: string;
    category: VoterCategory;
    createdAt?: string;
}

export interface VotersResponse {
    data: Voter[];
    total: number;
    page: number;
    limit: number;
}

export interface VoterFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: VoterCategory;
    booth?: string;
}

// Complaint types
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'flagged';
export type ComplaintPriority = 'low' | 'medium' | 'high';

export interface Complaint {
    id: number;
    voter_id: number;
    voter_name?: string;
    voter_phone?: string;
    issue: string;
    status: ComplaintStatus;
    priority: ComplaintPriority;
    resolution?: string;
    createdAt: string;
}

// Event types
export type EventType = 'meeting' | 'campaign' | 'rally' | 'other';
export type EventStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
    id: number;
    title: string;
    description: string;
    event_date: string;
    location: string;
    event_type: EventType;
    status: EventStatus;
    attendees_count?: number;
    budget?: number;
    createdAt?: string;
}

// Volunteer types
export interface Volunteer {
    id: number;
    name: string;
    email: string;
    mobile: string;
    area?: string;
    is_approved: boolean;
    last_login?: string;
    createdAt: string;
}

export interface VolunteersResponse {
    volunteers: Volunteer[];
    pending: Volunteer[];
}

// Dashboard stats
export interface CategoryCount {
    category: VoterCategory;
    count: number;
}

export interface StatusCount {
    status: ComplaintStatus;
    count: number;
}

export interface DashboardStats {
    totalVoters: number;
    totalComplaints: number;
    totalEvents: number;
    totalVolunteers: number;
    pendingVolunteers: number;
    voterCounts: CategoryCount[];
    complaintStats: StatusCount[];
}

// API Response wrapper (if needed)
export interface ApiResponse<T> {
    data: T;
    message?: string;
}
