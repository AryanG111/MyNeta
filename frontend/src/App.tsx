import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

// Lazy load pages
const LandingPage = lazy(() => import('@/pages/Landing').then(module => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('@/pages/Login').then(module => ({ default: module.LoginPage })));
const RegisterVolunteerPage = lazy(() => import('@/pages/RegisterVolunteer').then(module => ({ default: module.RegisterVolunteerPage })));
const RegisterVoterPage = lazy(() => import('@/pages/RegisterVoter').then(module => ({ default: module.RegisterVoterPage })));
const DashboardPage = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.DashboardPage })));
const VolunteerDashboardPage = lazy(() => import('@/pages/VolunteerDashboard').then(module => ({ default: module.VolunteerDashboardPage })));
const VoterDashboardPage = lazy(() => import('@/pages/VoterDashboard').then(module => ({ default: module.VoterDashboardPage })));
const LeaderboardPage = lazy(() => import('@/pages/Leaderboard').then(module => ({ default: module.LeaderboardPage })));
const VotersPage = lazy(() => import('@/pages/Voters').then(module => ({ default: module.VotersPage })));
const VolunteersPage = lazy(() => import('@/pages/Volunteers').then(module => ({ default: module.VolunteersPage })));
const ComplaintsPage = lazy(() => import('@/pages/Complaints').then(module => ({ default: module.ComplaintsPage })));
const EventsPage = lazy(() => import('@/pages/Events').then(module => ({ default: module.EventsPage })));
const AdminPage = lazy(() => import('@/pages/Admin').then(module => ({ default: module.AdminPage })));

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center text-slate-400">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-volunteer" element={<RegisterVolunteerPage />} />
        <Route path="/register-voter" element={<RegisterVoterPage />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/my-dashboard" element={<VolunteerDashboardPage />} />
            <Route path="/voter-dashboard" element={<VoterDashboardPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/voters" element={<VotersPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/volunteers" element={<VolunteersPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
