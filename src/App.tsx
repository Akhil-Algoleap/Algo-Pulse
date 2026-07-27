import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { EmployeeList } from './pages/EmployeeList';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { Onboarding } from './pages/Onboarding';
import { Assets } from './pages/Assets';
import { Leave } from './pages/Leave';
import { Attendance } from './pages/Attendance';
import { Performance } from './pages/Performance';
import { Documents } from './pages/Documents';
import { Settings } from './pages/Settings';

import { SprintBoard } from './pages/SprintBoard';
import { Tasks } from './pages/Tasks';
import { ResourceAllocation } from './pages/ResourceAllocation';
import { Timesheets } from './pages/Timesheets';
import { ProjectCalendar } from './pages/ProjectCalendar';
import { ProjectRisks } from './pages/ProjectRisks';
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
import { MasterData } from './pages/MasterData';
import { IntegrationCenter } from './pages/IntegrationCenter';
import { PayrollApproval } from './pages/PayrollApproval';
import { ExpenseManagement } from './pages/ExpenseManagement';
import { TravelClaims } from './pages/TravelClaims';
import { PurchaseRequests } from './pages/PurchaseRequests';
import { VendorPayments } from './pages/VendorPayments';
import { BudgetManagement } from './pages/BudgetManagement';
import { Reimbursements } from './pages/Reimbursements';
import { Invoices } from './pages/Invoices';
import { FinanceReports } from './pages/FinanceReports';
import { PayrollProcessing } from './pages/PayrollProcessing';
import { SalaryStructure } from './pages/SalaryStructure';
import { EmployeeSalary } from './pages/EmployeeSalary';
import { PayrollAttendance } from './pages/PayrollAttendance';
import { PayrollOvertime } from './pages/PayrollOvertime';
import { PayrollBonuses } from './pages/PayrollBonuses';
import { PayrollLoans } from './pages/PayrollLoans';
import { PayrollTax } from './pages/PayrollTax';
import { PayrollCompliance } from './pages/PayrollCompliance';
import { PayrollPayslips } from './pages/PayrollPayslips';
import { PayrollReimbursements } from './pages/PayrollReimbursements';
import { PayrollReports } from './pages/PayrollReports';
import { Audit } from './pages/Audit';
import { Notifications } from './pages/Notifications';
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
            <Route path="employees/:id" element={<EmployeeProfile />} />
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
            <Route path="master-data" element={<MasterData />} />
            <Route path="integrations" element={<IntegrationCenter />} />

            {/* Payroll Manager Routes */}
            <Route path="payroll-processing" element={<PayrollProcessing />} />
            <Route path="salary-structure" element={<SalaryStructure />} />
            <Route path="employee-salary" element={<EmployeeSalary />} />
            <Route path="attendance-leave" element={<PayrollAttendance />} />
            <Route path="overtime" element={<PayrollOvertime />} />
            <Route path="bonuses" element={<PayrollBonuses />} />
            <Route path="loans" element={<PayrollLoans />} />
            <Route path="reimbursements" element={<PayrollReimbursements />} />
            <Route path="tax-management" element={<PayrollTax />} />
            <Route path="statutory-compliance" element={<PayrollCompliance />} />
            <Route path="payslips" element={<PayrollPayslips />} />
            <Route path="reports" element={<PayrollReports />} />

            {/* Finance Routes */}
            <Route path="payroll-approval" element={<PayrollApproval />} />
            <Route path="expense-management" element={<ExpenseManagement />} />
            <Route path="travel-claims" element={<TravelClaims />} />
            <Route path="purchase-requests" element={<PurchaseRequests />} />
            <Route path="vendor-payments" element={<VendorPayments />} />
            <Route path="budget-management" element={<BudgetManagement />} />
            <Route path="reimbursements" element={<Reimbursements />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="finance-reports" element={<FinanceReports />} />
            <Route path="audit" element={<Audit />} />
            <Route path="notifications" element={<Notifications />} />

            {/* IT Admin Routes */}
            <Route path="hardware" element={<PlaceholderPage title="Hardware Assets" />} />
            <Route path="software" element={<PlaceholderPage title="Software Licenses" />} />
            <Route path="network" element={<PlaceholderPage title="Network Status" />} />
            <Route path="access" element={<PlaceholderPage title="Access Management" />} />
            <Route path="asset-receipts" element={<PurchaseRequests />} />
            <Route path="repairs" element={<PlaceholderPage title="Repairs" />} />
            
            {/* HR Admin Specific Routes */}
            <Route path="recruitment" element={<PlaceholderPage title="Recruitment" />} />
            <Route path="onboarding" element={<Onboarding />} />
            <Route path="training" element={<PlaceholderPage title="Training" />} />
            <Route path="offboarding" element={<PlaceholderPage title="Offboarding" />} />
            <Route path="payslips" element={<PlaceholderPage title="Payslips" />} />
            <Route path="my-expenses" element={<ExpenseManagement />} />
            <Route path="my-travel" element={<TravelClaims />} />
            <Route path="my-purchases" element={<PurchaseRequests />} />
            <Route path="my-reimbursements" element={<Reimbursements />} />
            
            {/* Project Manager Routes */}
            <Route path="sprint-board" element={<SprintBoard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="team-travel" element={<TravelClaims />} />
            <Route path="team-purchases" element={<PurchaseRequests />} />
            <Route path="team-reimbursements" element={<Reimbursements />} />
            <Route path="resource-allocation" element={<ResourceAllocation />} />
            <Route path="timesheets" element={<Timesheets />} />
            <Route path="project-calendar" element={<ProjectCalendar />} />
            <Route path="project-risks" element={<ProjectRisks />} />
            <Route path="notifications" element={<Notifications />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
