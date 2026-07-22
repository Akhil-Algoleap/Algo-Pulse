import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { EmployeeList } from './pages/EmployeeList';
import { Assets } from './pages/Assets';
import { Leave } from './pages/Leave';
import { Attendance } from './pages/Attendance';
import { Performance } from './pages/Performance';
import { Documents } from './pages/Documents';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Projects } from './pages/Projects';
import { Approvals } from './pages/Approvals';
import { Reports } from './pages/Reports';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin w-8 h-8 text-blue-600" /></div>;
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="assets" element={<Assets />} />
            <Route path="leave" element={<Leave />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="performance" element={<Performance />} />
            <Route path="projects" element={<Projects />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="reports" element={<Reports />} />
            <Route path="documents" element={<Documents />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
