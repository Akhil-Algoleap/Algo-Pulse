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
import { ProjectDetails } from './pages/ProjectDetails';
import { Approvals } from './pages/Approvals';
import { Reports } from './pages/Reports';
import { Kudos } from './pages/Kudos';
import { EmployeeTimeline } from './pages/EmployeeTimeline';
import { Roles } from './pages/Roles';
import { Departments } from './pages/Departments';
import { Branches } from './pages/Branches';
import { Workflows } from './pages/Workflows';
import { NotificationsConfig } from './pages/NotificationsConfig';
import { Security } from './pages/Security';
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

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-96">
    <h2 className="text-2xl font-bold text-slate-700">{title}</h2>
    <p className="text-slate-500 mt-2">This module is under development.</p>
  </div>
);

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
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="reports" element={<Reports />} />
            <Route path="documents" element={<Documents />} />
            <Route path="settings" element={<Settings />} />
            <Route path="regularization" element={<PlaceholderPage title="Regularization Requests" />} />
            <Route path="employee-profiles" element={<PlaceholderPage title="Employee Profiles" />} />
            <Route path="goals" element={<PlaceholderPage title="Goals & KPIs" />} />
            <Route path="notifications" element={<NotificationsConfig />} />
            <Route path="engage" element={<PlaceholderPage title="Engage" />} />
            <Route path="my-worklife/kudos" element={<Kudos />} />
            <Route path="my-worklife/feedback" element={<PlaceholderPage title="Feedback" />} />
            <Route path="todo" element={<PlaceholderPage title="To Do" />} />
            <Route path="salary" element={<PlaceholderPage title="Salary" />} />
            <Route path="helpdesk" element={<PlaceholderPage title="Helpdesk" />} />
            <Route path="request-hub" element={<PlaceholderPage title="Request Hub" />} />
            <Route path="workflow-delegates" element={<PlaceholderPage title="Workflow Delegates" />} />
            
            {/* Super Admin Routes */}
            <Route path="organization/company" element={<PlaceholderPage title="Company" />} />
            <Route path="organization/business-units" element={<PlaceholderPage title="Business Units" />} />
            <Route path="organization/branches" element={<Branches />} />
            <Route path="organization/departments" element={<Departments />} />
            <Route path="organization/designations" element={<PlaceholderPage title="Designations" />} />
            <Route path="organization/holiday-calendar" element={<PlaceholderPage title="Holiday Calendar" />} />
            <Route path="users" element={<EmployeeList />} />
            <Route path="users/timeline/:id" element={<EmployeeTimeline />} />
            <Route path="roles" element={<Roles />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="security" element={<Security />} />
            <Route path="audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
            <Route path="master-data" element={<PlaceholderPage title="Master Data" />} />
            <Route path="integrations" element={<PlaceholderPage title="Integration Center" />} />

            {/* Payroll Manager Routes */}
            <Route path="salary-structure" element={<PlaceholderPage title="Salary Structure" />} />
            <Route path="payroll-processing" element={<PlaceholderPage title="Payroll Processing" />} />
            <Route path="payslips" element={<PlaceholderPage title="Payslips" />} />
            <Route path="tax" element={<PlaceholderPage title="Tax" />} />
            <Route path="bonuses" element={<PlaceholderPage title="Bonuses" />} />
            <Route path="reimbursements" element={<PlaceholderPage title="Reimbursements" />} />
            <Route path="salary-revision" element={<PlaceholderPage title="Salary Revision" />} />
            <Route path="loans" element={<PlaceholderPage title="Loans" />} />
            <Route path="bank-export" element={<PlaceholderPage title="Bank Export" />} />

            {/* Finance Routes */}
            <Route path="expense-claims" element={<PlaceholderPage title="Expense Claims" />} />
            <Route path="travel-claims" element={<PlaceholderPage title="Travel Claims" />} />
            <Route path="payroll-approval" element={<PlaceholderPage title="Payroll Approval" />} />
            <Route path="budget" element={<PlaceholderPage title="Budget" />} />
            <Route path="invoices" element={<PlaceholderPage title="Invoices" />} />
            <Route path="vendor-payments" element={<PlaceholderPage title="Vendor Payments" />} />
            <Route path="finance-reports" element={<PlaceholderPage title="Finance Reports" />} />

            {/* IT Admin Routes */}
            <Route path="employee-accounts" element={<PlaceholderPage title="Employee Accounts" />} />
            <Route path="software" element={<PlaceholderPage title="Software" />} />
            <Route path="access-requests" element={<PlaceholderPage title="Access Requests" />} />
            <Route path="service-desk" element={<PlaceholderPage title="Service Desk" />} />
            <Route path="repairs" element={<PlaceholderPage title="Repairs" />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
