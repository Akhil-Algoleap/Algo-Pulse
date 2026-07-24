export type EmployeeStatus = 'Active' | 'Inactive' | 'Resigned';
export type UserRole = 'Admin' | 'Manager' | 'Reporting Manager' | 'Employee' | 'Super Admin' | 'Payroll Manager' | 'Finance' | 'IT Admin';

export interface Department {
  id: string;
  department_name: string;
  department_head_id?: string;
  budget?: number;
  cost_center?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  branch_head_id?: string;
  working_hours: string;
  holidays_count: number;
  attendance_device_enabled: boolean;
  payroll_rules: string;
}

export interface ProjectTeamMember {
  id: string;
  employee_id: string;
  role: string;
  allocation: number;
}

export interface ProjectSprint {
  id: string;
  name: string;
  status: 'Planning' | 'Active' | 'Completed';
  start_date: string;
  end_date: string;
  tasks_count: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  date: string;
  status: 'Pending' | 'Achieved';
}

export interface ProjectDocument {
  id: string;
  title: string;
  type: string;
  size: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface ProjectTimesheet {
  id: string;
  employee_id: string;
  date: string;
  hours: number;
  task: string;
}

export interface ProjectRisk {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Mitigated' | 'Closed';
}

export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Completed';
  budget: number;
  team_members_count: number;
  milestones_count: number;
  risks_count: number;
  
  // Detailed nested data for ProjectDetails page
  team_members?: ProjectTeamMember[];
  sprints?: ProjectSprint[];
  milestones?: ProjectMilestone[];
  documents?: ProjectDocument[];
  timesheets?: ProjectTimesheet[];
  risks?: ProjectRisk[];
}

export interface WorkflowStep {
  id: string;
  workflow_id: string;
  step_order: number;
  role_name: string; // e.g. "Employee", "Reporting Manager", "HR"
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger_event: string;
  status: 'Active' | 'Inactive';
  steps: WorkflowStep[];
}

export interface ApprovalRequest {
  id: string;
  workflow_id: string;
  employee_id: string;
  request_type: string; // e.g. 'Leave', 'Resignation', 'Onboarding'
  payload: any; // e.g. { start_date, end_date, reason }
  current_step_order: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  applied_at: string;
}

export interface Designation {
  id: string;
  designation_name: string;
}

export interface Client {
  id: string;
  client_name: string;
}

export interface Workplace {
  id: string;
  workplace_name: string;
}

export interface Employee {
  id: string;
  employee_id: string;
  employee_name: string;
  joining_date: string;
  email: string;
  phone: string;
  department_id: string;
  designation_id: string;
  client_id: string;
  workplace_id: string;
  status: EmployeeStatus;
  experience_years: number;
  reporting_manager_id?: string;
  project_manager_id?: string;
  role: UserRole;
  avatar?: string;
}

export interface EmployeeFormData extends Omit<Employee, 'id'> {}

export interface RolePermission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

export interface Role {
  id: string;
  name: string;
  is_custom: boolean;
  permissions: RolePermission[];
}

// --- New Types ---

export type AssetStatus = 'Assigned' | 'Returned' | 'In Repair' | 'Damaged';

export interface Asset {
  employee_id: string;
  employee_name: string;
  laptop_serial_number: string;
  charger_serial_number: string;
  has_mouse: boolean;
  has_keyboard: boolean;
  status: AssetStatus;
  last_assigned_date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Reporting Manager' | 'Employee';
  department_id?: string;
  avatar_url?: string;
}

export interface AssetHistory {
  id: string;
  asset_id: string;
  employee_id: string;
  action: 'Assigned' | 'Returned' | 'Replaced';
  date: string;
  notes?: string;
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Sick' | 'Casual' | 'Paid';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  manager_comment?: string;
  applied_at: string;
}

export type RegularizationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface RegularizationRequest {
  id: string;
  employee_id: string;
  date: string;
  reason: string;
  status: RegularizationStatus;
  manager_comment?: string;
  applied_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  employee_name?: string; // For display
  employee_id_code?: string; // e.g. EMP001
  date: string;
  clock_in: string;
  clock_out?: string;
  total_hours?: number;
  status: 'Present' | 'Late' | 'Absent';
}

export interface PerformanceRecord {
  id: string;
  employee_id: string;
  reviewer_id: string;
  rating: number; // 1-5
  feedback: string;
  date: string;
}

export interface Document {
  id: string;
  employee_id: string;
  emp_name?: string;
  emp_code?: string;
  name: string;
  type: 'Resume' | 'ID Proof' | 'Offer Letter' | 'Other';
  url: string;
  uploaded_at: string;
}

export type ExpenseStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected';
export type ExpenseCategory = 'Travel' | 'Food' | 'Supplies' | 'Software' | 'Other';

export interface ExpenseClaim {
  id: string;
  employee_id: string;
  employee_name?: string; // For display
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: string;
  description: string;
  receipt_url?: string;
  status: ExpenseStatus;
  admin_comment?: string;
  applied_at: string;
}

export interface Lookups {
  departments: Department[];
  designations: Designation[];
  clients: Client[];
  workplaces: Workplace[];
  employees: Pick<Employee, 'id' | 'employee_name'>[];
}

export interface AppNotification {
  id: string;
  recipient_role?: string;
  recipient_id?: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationTemplate {
  id: string;
  type: string;
  subject_template: string;
  body_template: string;
  channels: ('In-App' | 'Email' | 'Teams' | 'SMS')[];
}

export interface SecuritySettings {
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_special: boolean;
    expiry_days: number;
  };
  mfa: {
    enabled: boolean;
    enforced_roles: string[];
  };
  session: {
    timeout_minutes: number;
    allow_concurrent: boolean;
  };
  access_control: {
    ip_whitelist: string[];
    ip_blacklist: string[];
  };
  oauth: {
    google_enabled: boolean;
    microsoft_enabled: boolean;
  };
}

export interface AuditEvent {
  id: string;
  employee_id: string;
  action: string;
  description: string;
  created_at: string;
}

export interface OnboardingTask {
  id: string;
  employee_id: string;
  task_name: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface PayrollDeduction {
  id: string;
  employee_id: string;
  reason: string;
  amount: number;
  status: 'Pending' | 'Processed';
  created_at: string;
}
