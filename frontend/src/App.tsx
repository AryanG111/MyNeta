import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/Login').then(module => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.DashboardPage })));
const VotersPage = lazy(() => import('@/pages/Voters').then(module => ({ default: module.VotersPage })));
const VolunteersPage = lazy(() => import('@/pages/Volunteers').then(module => ({ default: module.VolunteersPage })));
const ComplaintsPage = lazy(() => import('@/pages/Complaints').then(module => ({ default: module.ComplaintsPage })));
const EventsPage = lazy(() => import('@/pages/Events').then(module => ({ default: module.EventsPage })));

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
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/voters" element={<VotersPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/volunteers" element={<VolunteersPage />} />
            <Route path="/admin" element={<div>Admin Page</div>} />
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

