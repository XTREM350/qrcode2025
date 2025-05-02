import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoadingScreen from './components/ui/LoadingScreen';
import { useAuth } from './contexts/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CookDashboard from './pages/cook/CookDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import EducatorDashboard from './pages/educator/EducatorDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import NotFound from './pages/NotFound';
import ParentDashboard from './pages/parent/ParentDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

// Lazy-loaded components
const Profile = lazy(() => import('./pages/Profile'));
const AdminStudents = lazy(() => import('./pages/admin/AdminStudents'));
const AdminTransactions = lazy(() => import('./pages/admin/AdminTransactions'));
const AdminBadges = lazy(() => import('./pages/admin/AdminBadges'));
const ParentPayment = lazy(() => import('./pages/parent/ParentPayment'));
const ParentTransactions = lazy(() => import('./pages/parent/ParentTransactions'));
const EducatorScanner = lazy(() => import('./pages/educator/EducatorScanner'));
const DriverScanner = lazy(() => import('./pages/driver/DriverScanner'));
const CookScanner = lazy(() => import('./pages/cook/CookScanner'));

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected routes */}
      {user ? (
        <>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={
                (() => {
                  switch(user.role) {
                    case 'admin': return <Navigate to="/admin" replace />;
                    case 'parent': return <ParentDashboard />;
                    case 'student': return <StudentDashboard />;
                    case 'educator': return <EducatorDashboard />;
                    case 'driver': return <DriverDashboard />;
                    case 'cook': return <CookDashboard />;
                    default: return <Navigate to="/login" replace />;
                  }
                })()
              }
            />
            <Route path="profile" element={
              <Suspense fallback={<LoadingScreen />}>
                <Profile />
              </Suspense>
            } />

            {/* Parent routes */}
            {user.role === 'parent' && (
              <>
                <Route path="payment" element={
                  <Suspense fallback={<LoadingScreen />}>
                    <ParentPayment />
                  </Suspense>
                } />
                <Route path="transactions" element={
                  <Suspense fallback={<LoadingScreen />}>
                    <ParentTransactions />
                  </Suspense>
                } />
              </>
            )}

            {/* Role-specific scanner routes */}
            {['educator', 'driver', 'cook'].includes(user.role) && (
              <Route path="scanner" element={
                <Suspense fallback={<LoadingScreen />}>
                  {user.role === 'educator' ? <EducatorScanner /> :
                   user.role === 'driver' ? <DriverScanner /> :
                   <CookScanner />}
                </Suspense>
              } />
            )}
          </Route>

          {/* Admin routes */}
          {user.role === 'admin' && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={
                <Suspense fallback={<LoadingScreen />}>
                  <AdminStudents />
                </Suspense>
              } />
              <Route path="transactions" element={
                <Suspense fallback={<LoadingScreen />}>
                  <AdminTransactions />
                </Suspense>
              } />
              <Route path="badges" element={
                <Suspense fallback={<LoadingScreen />}>
                  <AdminBadges />
                </Suspense>
              } />
            </Route>
          )}
        </>
      ) : (
        <Route path="/dashboard/*" element={<Navigate to="/login" replace />} />
      )}

      {/* Default routes */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
