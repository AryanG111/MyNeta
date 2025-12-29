// MyNeta Admin Application - Unified API Module
// This module handles all API interactions for the admin dashboard

class MyNetaAdmin {
    constructor() {
        this.apiBase = '/api';
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.charts = {};
    }

    // ==================== AUTH ====================

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    async login(identifier, password) {
        const response = await this.request('POST', '/auth/login', { identifier, password }, false);
        if (response.token) {
            this.token = response.token;
            this.user = response.user;
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        return response;
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/login.html';
    }

    checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    // ==================== API HELPER ====================

    async request(method, endpoint, data = null, auth = true) {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (auth && this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(this.apiBase + endpoint, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }

        return result;
    }

    // ==================== VOTERS ====================

    async getVoters(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request('GET', '/voters' + (query ? '?' + query : ''));
    }

    async getVoterCounts() {
        return this.request('GET', '/voters/counts');
    }

    async createVoter(data) {
        return this.request('POST', '/voters', data);
    }

    async updateVoter(id, data) {
        return this.request('PUT', `/voters/${id}`, data);
    }

    async deleteVoter(id) {
        return this.request('DELETE', `/voters/${id}`);
    }

    // ==================== COMPLAINTS ====================

    async getComplaints(status = '') {
        return this.request('GET', '/complaints' + (status ? `?status=${status}` : ''));
    }

    async createComplaint(data) {
        return this.request('POST', '/complaints', data);
    }

    async updateComplaintStatus(id, status) {
        return this.request('PATCH', `/complaints/${id}/status`, { status });
    }

    async deleteComplaint(id) {
        return this.request('DELETE', `/complaints/${id}`);
    }

    // ==================== EVENTS ====================

    async getEvents() {
        return this.request('GET', '/events');
    }

    async createEvent(data) {
        return this.request('POST', '/events', data);
    }

    async updateEvent(id, data) {
        return this.request('PUT', `/events/${id}`, data);
    }

    async deleteEvent(id) {
        return this.request('DELETE', `/events/${id}`);
    }

    // ==================== VOLUNTEERS ====================

    async getVolunteers() {
        return this.request('GET', '/volunteers');
    }

    async getPendingVolunteerRequests() {
        return this.request('GET', '/admin/volunteer-requests');
    }

    async approveVolunteer(id) {
        return this.request('POST', `/volunteers/${id}/approve`);
    }

    async rejectVolunteer(id) {
        return this.request('POST', `/volunteers/${id}/reject`);
    }

    async approveVolunteerRequest(id) {
        return this.request('POST', `/admin/approve-volunteer/${id}`);
    }

    async rejectVolunteerRequest(id) {
        return this.request('POST', `/admin/reject-volunteer/${id}`);
    }

    // ==================== DASHBOARD ====================

    async loadDashboardStats() {
        try {
            const [voterCounts, complaints, events, volunteers] = await Promise.all([
                this.getVoterCounts(),
                this.getComplaints(),
                this.getEvents(),
                this.getVolunteers().catch(() => ({ volunteers: [], pending: [] }))
            ]);

            const totalVoters = voterCounts.reduce((sum, v) => sum + parseInt(v.count || 0), 0);
            const supporters = voterCounts.find(v => v.category === 'supporter')?.count || 0;
            const neutrals = voterCounts.find(v => v.category === 'neutral')?.count || 0;
            const opponents = voterCounts.find(v => v.category === 'opponent')?.count || 0;
            const totalComplaints = Array.isArray(complaints) ? complaints.length : 0;
            const totalEvents = Array.isArray(events) ? events.length : 0;
            const totalVolunteers = volunteers.volunteers?.length || 0;

            return {
                totalVoters,
                supporters,
                neutrals,
                opponents,
                totalComplaints,
                totalEvents,
                totalVolunteers,
                voterCounts,
                complaints,
                events,
                volunteers
            };
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            return null;
        }
    }

    updateStatsUI(stats) {
        if (!stats) return;

        // Update all stat elements
        const elements = {
            'totalVoters': stats.totalVoters,
            'statVoters': stats.totalVoters,
            'totalSupporters': stats.supporters,
            'statSupporters': stats.supporters,
            'totalComplaints': stats.totalComplaints,
            'statComplaints': stats.totalComplaints,
            'statEvents': stats.totalEvents,
            'statVolunteers': stats.totalVolunteers
        };

        for (const [id, value] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) el.textContent = value.toLocaleString();
        }
    }

    // ==================== CHARTS ====================

    createVoterChart(canvasId, voterCounts) {
        const ctx = document.getElementById(canvasId);
        if (!ctx || typeof Chart === 'undefined') return;

        const supporters = voterCounts.find(v => v.category === 'supporter')?.count || 0;
        const neutrals = voterCounts.find(v => v.category === 'neutral')?.count || 0;
        const opponents = voterCounts.find(v => v.category === 'opponent')?.count || 0;

        if (this.charts[canvasId]) this.charts[canvasId].destroy();

        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Supporters', 'Neutral', 'Opponents'],
                datasets: [{
                    data: [supporters, neutrals, opponents],
                    backgroundColor: ['#10b981', '#6b7280', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    createComplaintChart(canvasId, complaints) {
        const ctx = document.getElementById(canvasId);
        if (!ctx || typeof Chart === 'undefined') return;

        const statusCounts = complaints.reduce((acc, c) => {
            acc[c.status] = (acc[c.status] || 0) + 1;
            return acc;
        }, {});

        if (this.charts[canvasId]) this.charts[canvasId].destroy();

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pending', 'In Progress', 'Resolved'],
                datasets: [{
                    label: 'Complaints',
                    data: [statusCounts.pending || 0, statusCounts.in_progress || 0, statusCounts.resolved || 0],
                    backgroundColor: ['#f59e0b', '#06b6d4', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // ==================== UI HELPERS ====================

    showNotification(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    }

    getCategoryBadgeClass(category) {
        const classes = { supporter: 'bg-success', neutral: 'bg-warning', opponent: 'bg-danger' };
        return classes[category] || 'bg-secondary';
    }

    getStatusBadgeClass(status) {
        const classes = {
            pending: 'bg-warning',
            in_progress: 'bg-info',
            resolved: 'bg-success',
            flagged: 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }
}

// Global instance
const adminApp = new MyNetaAdmin();
