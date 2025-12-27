// My Neta Frontend Application
class MyNetaApp {
    constructor() {
        this.apiBase = 'http://localhost:5000/api';
        this.authToken = localStorage.getItem('authToken');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Sidebar navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(link.dataset.page);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Add voter button
        document.getElementById('addVoterBtn').addEventListener('click', () => {
            this.showAddVoterModal();
        });

        // Save voter button
        document.getElementById('saveVoterBtn').addEventListener('click', () => {
            this.saveVoter();
        });

        // Add complaint button
        document.getElementById('addComplaintBtn').addEventListener('click', () => {
            this.showAddComplaintModal();
        });

        // Add event button
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.showAddEventModal();
        });

        // Search and filters
        document.getElementById('voterSearch').addEventListener('input', 
            this.debounce(() => this.loadVoters(), 300)
        );

        document.getElementById('complaintFilter').addEventListener('change', () => {
            this.loadComplaints();
        });
    }

    checkAuth() {
        if (this.authToken && this.currentUser) {
            this.showApp();
            this.loadDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('app').classList.add('d-none');
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    }

    showApp() {
        document.getElementById('app').classList.remove('d-none');
        document.getElementById('userName').textContent = this.currentUser.name || 'Admin User';
        document.getElementById('userRole').textContent = this.currentUser.role || 'Administrator';
        
        // Close login modal if open
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) {
            loginModal.hide();
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                this.authToken = data.token;
                this.currentUser = data.user;
                
                localStorage.setItem('authToken', this.authToken);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                
                this.showApp();
                this.loadDashboard();
            } else {
                const error = await response.json();
                this.showAlert('Login failed: ' + (error.message || 'Invalid credentials'), 'danger');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Login failed: Network error', 'danger');
        }
    }

    logout() {
        this.authToken = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.showLogin();
    }

    navigateToPage(page) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('d-none'));
        
        // Show selected page
        document.getElementById(page).classList.remove('d-none');
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Load page data
        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'voters':
                this.loadVoters();
                break;
            case 'complaints':
                this.loadComplaints();
                break;
            case 'events':
                this.loadEvents();
                break;
            case 'reports':
                this.loadReports();
                break;
        }
    }

    async loadDashboard() {
        try {
            // Load voter counts
            const voterCounts = await this.fetchWithAuth('/voters/counts');
            this.updateDashboardStats(voterCounts);

            // Load complaints
            const complaints = await this.fetchWithAuth('/complaints');
            this.updateComplaintStats(complaints);

            // Create charts
            this.createVoterChart(voterCounts);
            this.createComplaintChart(complaints);

        } catch (error) {
            console.error('Dashboard load error:', error);
            this.showAlert('Failed to load dashboard data', 'warning');
        }
    }

    updateDashboardStats(voterCounts) {
        const totalVoters = voterCounts.reduce((sum, item) => sum + item.count, 0);
        const supporters = voterCounts.find(v => v.category === 'supporter')?.count || 0;
        
        document.getElementById('totalVoters').textContent = totalVoters;
        document.getElementById('totalSupporters').textContent = supporters;
        document.getElementById('statVoters').textContent = totalVoters;
        document.getElementById('statSupporters').textContent = supporters;
    }

    updateComplaintStats(complaints) {
        document.getElementById('totalComplaints').textContent = complaints.length;
        document.getElementById('statComplaints').textContent = complaints.length;
    }

    createVoterChart(voterCounts) {
        const ctx = document.getElementById('voterChart');
        if (!ctx) return;

        const data = {
            labels: ['Supporters', 'Neutral', 'Opponents'],
            datasets: [{
                data: [
                    voterCounts.find(v => v.category === 'supporter')?.count || 0,
                    voterCounts.find(v => v.category === 'neutral')?.count || 0,
                    voterCounts.find(v => v.category === 'opponent')?.count || 0
                ],
                backgroundColor: [
                    '#10b981',
                    '#6b7280',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        };

        if (this.charts.voterChart) {
            this.charts.voterChart.destroy();
        }

        this.charts.voterChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    createComplaintChart(complaints) {
        const ctx = document.getElementById('complaintChart');
        if (!ctx) return;

        const statusCounts = complaints.reduce((acc, complaint) => {
            acc[complaint.status] = (acc[complaint.status] || 0) + 1;
            return acc;
        }, {});

        const data = {
            labels: ['Pending', 'In Progress', 'Resolved'],
            datasets: [{
                label: 'Complaints',
                data: [
                    statusCounts.pending || 0,
                    statusCounts.in_progress || 0,
                    statusCounts.resolved || 0
                ],
                backgroundColor: [
                    '#f59e0b',
                    '#06b6d4',
                    '#10b981'
                ],
                borderWidth: 0
            }]
        };

        if (this.charts.complaintChart) {
            this.charts.complaintChart.destroy();
        }

        this.charts.complaintChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    async loadVoters() {
        try {
            const voters = await this.fetchWithAuth('/voters');
            this.renderVotersTable(voters.data || voters);
        } catch (error) {
            console.error('Voters load error:', error);
            this.showAlert('Failed to load voters', 'warning');
        }
    }

    renderVotersTable(voters) {
        const tbody = document.getElementById('voterTableBody');
        tbody.innerHTML = voters.map(voter => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000) + 1500000000000}?w=40&h=40&fit=crop&crop=face" 
                             alt="Voter" class="rounded-circle me-3" width="40" height="40">
                        <div>
                            <div class="fw-semibold">${voter.name}</div>
                            <small class="text-muted">ID: ${voter.id}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="text-truncate" style="max-width: 200px;" title="${voter.address}">
                        ${voter.address}
                    </div>
                </td>
                <td>
                    <span class="badge bg-info">${voter.booth}</span>
                </td>
                <td>${voter.phone}</td>
                <td>
                    <span class="badge bg-${this.getCategoryColor(voter.category)}">
                        ${this.formatCategory(voter.category)}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="app.editVoter(${voter.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="app.deleteVoter(${voter.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async loadComplaints() {
        try {
            const status = document.getElementById('complaintFilter').value;
            const url = status ? `/complaints?status=${status}` : '/complaints';
            const complaints = await this.fetchWithAuth(url);
            this.renderComplaintsTable(complaints);
        } catch (error) {
            console.error('Complaints load error:', error);
            this.showAlert('Failed to load complaints', 'warning');
        }
    }

    renderComplaintsTable(complaints) {
        const tbody = document.getElementById('complaintTableBody');
        tbody.innerHTML = complaints.map(complaint => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000) + 1500000000000}?w=40&h=40&fit=crop&crop=face" 
                             alt="Voter" class="rounded-circle me-3" width="40" height="40">
                        <div>
                            <div class="fw-semibold">${complaint.voter_name || 'Unknown Voter'}</div>
                            <small class="text-muted">${complaint.voter_phone || 'No phone'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="text-truncate" style="max-width: 250px;" title="${complaint.issue}">
                        ${complaint.issue}
                    </div>
                </td>
                <td>
                    <span class="badge bg-${this.getStatusColor(complaint.status)}">
                        ${this.formatStatus(complaint.status)}
                    </span>
                </td>
                <td>${this.formatDate(complaint.created_at)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="app.updateComplaintStatus(${complaint.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async loadEvents() {
        try {
            const events = await this.fetchWithAuth('/events');
            this.renderEventsTable(events);
            document.getElementById('statEvents').textContent = events.length;
        } catch (error) {
            console.error('Events load error:', error);
            this.showAlert('Failed to load events', 'warning');
        }
    }

    renderEventsTable(events) {
        const tbody = document.getElementById('eventTableBody');
        tbody.innerHTML = events.map(event => `
            <tr>
                <td>
                    <div class="fw-semibold">${event.title}</div>
                </td>
                <td>
                    <div class="text-truncate" style="max-width: 300px;" title="${event.description}">
                        ${event.description}
                    </div>
                </td>
                <td>
                    <div class="fw-semibold">${this.formatDate(event.event_date)}</div>
                    <small class="text-muted">${this.getTimeUntilEvent(event.event_date)}</small>
                </td>
                <td>
                    <i class="fas fa-map-marker-alt me-1 text-danger"></i>
                    ${event.location}
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="app.editEvent(${event.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="app.deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    loadReports() {
        // Create activity chart for reports
        this.createActivityChart();
    }

    createActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Voter Registrations',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4
            }, {
                label: 'Complaints Resolved',
                data: [2, 3, 20, 5, 1, 4],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }]
        };

        if (this.charts.activityChart) {
            this.charts.activityChart.destroy();
        }

        this.charts.activityChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    showAddVoterModal() {
        const modal = new bootstrap.Modal(document.getElementById('addVoterModal'));
        modal.show();
    }

    async saveVoter() {
        const voterData = {
            name: document.getElementById('voterName').value,
            address: document.getElementById('voterAddress').value,
            booth: document.getElementById('voterBooth').value,
            phone: document.getElementById('voterPhone').value,
            category: document.getElementById('voterCategory').value
        };

        try {
            const response = await fetch(`${this.apiBase}/voters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify(voterData)
            });

            if (response.ok) {
                this.showAlert('Voter added successfully!', 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('addVoterModal'));
                modal.hide();
                this.loadVoters();
                this.loadDashboard();
            } else {
                const error = await response.json();
                this.showAlert('Failed to add voter: ' + error.message, 'danger');
            }
        } catch (error) {
            console.error('Save voter error:', error);
            this.showAlert('Failed to add voter', 'danger');
        }
    }

    showAddComplaintModal() {
        this.showAlert('Add complaint functionality coming soon!', 'info');
    }

    showAddEventModal() {
        this.showAlert('Add event functionality coming soon!', 'info');
    }

    async fetchWithAuth(endpoint) {
        const response = await fetch(`${this.apiBase}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.authToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
    }

    getCategoryColor(category) {
        const colors = {
            'supporter': 'success',
            'neutral': 'secondary',
            'opponent': 'danger'
        };
        return colors[category] || 'secondary';
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    getStatusColor(status) {
        const colors = {
            'pending': 'warning',
            'in_progress': 'info',
            'resolved': 'success'
        };
        return colors[status] || 'secondary';
    }

    formatStatus(status) {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getTimeUntilEvent(eventDate) {
        const now = new Date();
        const event = new Date(eventDate);
        const diffTime = event - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Past event';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `In ${diffDays} days`;
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Placeholder methods for future functionality
    editVoter(id) {
        this.showAlert(`Edit voter ${id} functionality coming soon!`, 'info');
    }

    deleteVoter(id) {
        this.showAlert(`Delete voter ${id} functionality coming soon!`, 'info');
    }

    updateComplaintStatus(id) {
        this.showAlert(`Update complaint ${id} status functionality coming soon!`, 'info');
    }

    editEvent(id) {
        this.showAlert(`Edit event ${id} functionality coming soon!`, 'info');
    }

    deleteEvent(id) {
        this.showAlert(`Delete event ${id} functionality coming soon!`, 'info');
    }
}

// Initialize the application
const app = new MyNetaApp();

