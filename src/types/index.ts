export type EmployeeStatus = 'Active' | 'Inactive' | 'Resigned';
export type UserRole = 'Admin' | 'Manager' | 'Employee';

export interface Department {
  id: string;
  department_name: string;
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
  role: UserRole;
  avatar?: string;
}

export interface EmployeeFormData extends Omit<Employee, 'id'> {}

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
  role: 'Admin' | 'Manager' | 'Employee';
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
