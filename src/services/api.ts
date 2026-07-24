import { supabase } from '../lib/supabase';
import { AppNotification, AuditEvent, OnboardingTask, PayrollDeduction, SecuritySettings, MasterDataCategory, MasterDataItem } from '../types';

let mockNotifications: AppNotification[] = [];
let mockAuditLogs: AuditEvent[] = [];
let mockOnboardingTasks: OnboardingTask[] = [];
let mockPayrollDeductions: PayrollDeduction[] = [];

export const addMockAuditLog = (log: Omit<AuditEvent, 'id' | 'created_at'>) => {
  mockAuditLogs.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    ...log,
    created_at: new Date().toISOString()
  });
};

import { Role, Department, Branch, Project } from '../types';

let mockDepartments: Department[] = [
  { id: 'd1', department_name: 'Engineering', department_head_id: 'emp1', budget: 1500000, cost_center: 'CC-ENG' },
  { id: 'd2', department_name: 'HR', department_head_id: 'emp2', budget: 200000, cost_center: 'CC-HR' },
  { id: 'd3', department_name: 'Finance', department_head_id: 'emp3', budget: 300000, cost_center: 'CC-FIN' },
  { id: 'd4', department_name: 'Sales', department_head_id: 'emp4', budget: 500000, cost_center: 'CC-SAL' },
  { id: 'd5', department_name: 'Marketing', department_head_id: 'emp5', budget: 400000, cost_center: 'CC-MKT' },
  { id: 'd6', department_name: 'Support', department_head_id: 'emp6', budget: 250000, cost_center: 'CC-SUP' }
];

let mockBranches: Branch[] = [
  { id: 'b1', name: 'Hyderabad', address: 'Hi-Tech City, Hyderabad', branch_head_id: 'emp1', working_hours: '9 AM - 6 PM', holidays_count: 12, attendance_device_enabled: true, payroll_rules: 'Standard India' },
  { id: 'b2', name: 'Bangalore', address: 'Koramangala, Bangalore', branch_head_id: 'emp2', working_hours: '9 AM - 6 PM', holidays_count: 12, attendance_device_enabled: true, payroll_rules: 'Standard India' },
  { id: 'b3', name: 'Chennai', address: 'OMR, Chennai', branch_head_id: 'emp3', working_hours: '9 AM - 6 PM', holidays_count: 12, attendance_device_enabled: true, payroll_rules: 'Standard India' },
  { id: 'b4', name: 'USA', address: 'Silicon Valley, CA', branch_head_id: 'emp7', working_hours: '8 AM - 5 PM PST', holidays_count: 10, attendance_device_enabled: false, payroll_rules: 'US Standard' },
  { id: 'b5', name: 'Canada', address: 'Toronto, ON', branch_head_id: 'emp8', working_hours: '9 AM - 5 PM EST', holidays_count: 11, attendance_device_enabled: false, payroll_rules: 'Canada Standard' }
];

let mockProjects: Project[] = [
  { 
    id: 'p1', name: 'Website Redesign', status: 'Active', budget: 50000, team_members_count: 5, milestones_count: 4, risks_count: 1,
    team_members: [
      { id: 'tm1', employee_id: 'emp1', role: 'Project Manager', allocation: 100 },
      { id: 'tm2', employee_id: 'emp2', role: 'Lead Designer', allocation: 80 }
    ],
    sprints: [
      { id: 'sp1', name: 'Sprint 1: Wireframes', status: 'Completed', start_date: '2024-01-01', end_date: '2024-01-14', tasks_count: 12 },
      { id: 'sp2', name: 'Sprint 2: UI Dev', status: 'Active', start_date: '2024-01-15', end_date: '2024-01-28', tasks_count: 8 }
    ],
    milestones: [
      { id: 'm1', title: 'Design Approval', date: '2024-01-14', status: 'Achieved' },
      { id: 'm2', title: 'Beta Launch', date: '2024-02-15', status: 'Pending' }
    ],
    documents: [
      { id: 'doc1', title: 'Requirements.pdf', type: 'PDF', size: '2.4 MB', uploaded_by: 'emp1', uploaded_at: '2024-01-02' }
    ],
    timesheets: [
      { id: 'ts1', employee_id: 'emp2', date: '2024-01-16', hours: 8, task: 'UI Development' }
    ],
    risks: [
      { id: 'r1', title: 'API Dependency Delay', severity: 'Medium', status: 'Open' }
    ]
  },
  { 
    id: 'p2', name: 'Mobile App V2', status: 'Active', budget: 120000, team_members_count: 8, milestones_count: 6, risks_count: 2,
    team_members: [], sprints: [], milestones: [], documents: [], timesheets: [], risks: []
  },
  { 
    id: 'p3', name: 'Q1 Marketing Campaign', status: 'Completed', budget: 30000, team_members_count: 4, milestones_count: 3, risks_count: 0,
    team_members: [], sprints: [], milestones: [], documents: [], timesheets: [], risks: []
  }
];

let mockWorkflows: any[] = [
  {
    id: 'wf1',
    name: 'Leave Approval Workflow',
    description: 'Standard multi-level approval process for employee leave requests.',
    trigger_event: 'Leave Request Submitted',
    status: 'Active',
    steps: [
      { id: 's1', workflow_id: 'wf1', step_order: 1, role_name: 'Employee' },
      { id: 's2', workflow_id: 'wf1', step_order: 2, role_name: 'Reporting Manager' },
      { id: 's3', workflow_id: 'wf1', step_order: 3, role_name: 'HR' },
      { id: 's4', workflow_id: 'wf1', step_order: 4, role_name: 'Approved' }
    ]
  },
  {
    id: 'wf2',
    name: 'New Employee Onboarding',
    description: 'Cross-departmental setup process for new hires.',
    trigger_event: 'Employee Record Created',
    status: 'Active',
    steps: [
      { id: 's5', workflow_id: 'wf2', step_order: 1, role_name: 'HR' },
      { id: 's6', workflow_id: 'wf2', step_order: 2, role_name: 'Employee' },
      { id: 's7', workflow_id: 'wf2', step_order: 3, role_name: 'Reporting Manager' },
      { id: 's8', workflow_id: 'wf2', step_order: 4, role_name: 'IT' },
      { id: 's9', workflow_id: 'wf2', step_order: 5, role_name: 'Payroll' },
      { id: 's10', workflow_id: 'wf2', step_order: 6, role_name: 'Completed' }
    ]
  },
  {
    id: 'wf3',
    name: 'Resignation Workflow',
    description: 'Offboarding process for resigning employees.',
    trigger_event: 'Resignation Submitted',
    status: 'Active',
    steps: [
      { id: 's11', workflow_id: 'wf3', step_order: 1, role_name: 'Reporting Manager' },
      { id: 's12', workflow_id: 'wf3', step_order: 2, role_name: 'HR' },
      { id: 's13', workflow_id: 'wf3', step_order: 3, role_name: 'IT' },
      { id: 's14', workflow_id: 'wf3', step_order: 4, role_name: 'Finance' },
      { id: 's15', workflow_id: 'wf3', step_order: 5, role_name: 'Completed' }
    ]
  }
];

let mockApprovalRequests: any[] = [];

let mockNotificationTemplates: any[] = [
  {
    id: 'nt1',
    type: 'Leave Approved',
    subject_template: 'Leave Approved',
    body_template: 'Hello {{EmployeeName}},\n\nYour leave request for {{LeaveDetails}} has been approved.\n\nRegards,\nHR Team',
    channels: ['In-App', 'Email']
  },
  {
    id: 'nt2',
    type: 'Attendance Alert',
    subject_template: 'Missed Punch Alert',
    body_template: 'Hello {{EmployeeName}},\n\nWe noticed a missing punch for {{Date}}.\n\nPlease regularize.\n\nRegards,\nHR Team',
    channels: ['In-App']
  },
  {
    id: 'nt3',
    type: 'Birthday',
    subject_template: 'Happy Birthday!',
    body_template: 'Happy Birthday {{EmployeeName}}! Wishing you a fantastic day ahead from all of us at AlgoLeap.',
    channels: ['In-App', 'Teams']
  },
  {
    id: 'nt4',
    type: 'Promotion',
    subject_template: 'Congratulations on your Promotion!',
    body_template: 'Hello {{EmployeeName}},\n\nCongratulations on your promotion to {{NewRole}}!',
    channels: ['In-App', 'Email', 'Teams']
  },
  {
    id: 'nt5',
    type: 'Payroll Completed',
    subject_template: 'Payslip Available',
    body_template: 'Hello {{EmployeeName}},\n\nYour payslip for {{Month}} is now available.',
    channels: ['In-App', 'Email', 'SMS']
  },
  {
    id: 'nt6',
    type: 'Asset Assigned',
    subject_template: 'New Asset Assigned',
    body_template: 'Hello {{EmployeeName}},\n\nA new asset ({{AssetDetails}}) has been assigned to you.',
    channels: ['In-App', 'Email']
  },
  {
    id: 'nt7',
    type: 'New Employee',
    subject_template: 'Welcome to the Team!',
    body_template: 'Welcome aboard {{EmployeeName}}! We are excited to have you join as {{Role}}.',
    channels: ['In-App', 'Email']
  }
];

let mockSecuritySettings: SecuritySettings = {
  password_policy: {
    min_length: 12,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_special: true,
    expiry_days: 90
  },
  mfa: {
    enabled: true,
    enforced_roles: ['Super Admin', 'Admin', 'Finance', 'HR']
  },
  session: {
    timeout_minutes: 30,
    allow_concurrent: false
  },
  access_control: {
    ip_whitelist: ['192.168.1.1', '10.0.0.0/24'],
    ip_blacklist: ['185.xxx.xxx.xxx']
  },
  oauth: {
    google_enabled: true,
    microsoft_enabled: false
  }
};

let mockLoginAttempts = [
  { id: '1', user: 'admin@algoleap.com', ip: '192.168.1.5', status: 'Success', location: 'Hyderabad, India', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', user: 'finance@algoleap.com', ip: '10.0.0.12', status: 'Failed', location: 'Mumbai, India', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', user: 'unknown', ip: '185.10.10.5', status: 'Blocked', location: 'Unknown', timestamp: new Date(Date.now() - 86400000).toISOString() }
];

let mockBlockedUsers = [
  { id: '1', user: 'finance@algoleap.com', reason: 'Multiple failed attempts', blocked_at: new Date(Date.now() - 7200000).toISOString() }
];

const defaultPermissions = [
  { module: 'Employees', view: true, create: false, edit: false, delete: false, approve: false },
  { module: 'Payroll', view: false, create: false, edit: false, delete: false, approve: false },
  { module: 'Leave', view: true, create: true, edit: false, delete: false, approve: false },
  { module: 'Assets', view: true, create: false, edit: false, delete: false, approve: false }
];

let mockRoles: Role[] = [
  { id: 'r1', name: 'Super Admin', is_custom: false, permissions: defaultPermissions.map(p => ({ ...p, create: true, edit: true, delete: true, approve: true })) },
  { id: 'r2', name: 'HR', is_custom: false, permissions: defaultPermissions.map(p => p.module === 'Employees' ? { ...p, create: true, edit: true } : p) },
  { id: 'r3', name: 'Employee', is_custom: false, permissions: defaultPermissions },
  { id: 'r4', name: 'Reporting Manager', is_custom: false, permissions: defaultPermissions.map(p => p.module === 'Leave' ? { ...p, approve: true } : p) },
  { id: 'r5', name: 'Project Manager', is_custom: false, permissions: defaultPermissions },
  { id: 'r6', name: 'Payroll', is_custom: false, permissions: defaultPermissions.map(p => p.module === 'Payroll' ? { ...p, view: true, create: true, edit: true, approve: true } : p) },
  { id: 'r7', name: 'Finance', is_custom: false, permissions: defaultPermissions.map(p => p.module === 'Payroll' ? { ...p, view: true, approve: true } : p) },
  { id: 'r8', name: 'IT', is_custom: false, permissions: defaultPermissions.map(p => p.module === 'Assets' ? { ...p, view: true, create: true, edit: true, delete: true } : p) },
];

const defaultITTasks = ['Create Outlook Account', 'Create Teams', 'Create GitHub', 'Assign Laptop', 'Assign ID Card', 'Assign VPN'];


const addMockNotification = (notification: Omit<AppNotification, 'id' | 'is_read' | 'created_at'>) => {
  mockNotifications.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    ...notification,
    is_read: false,
    created_at: new Date().toISOString()
  });
};

const dispatchNotification = (type: string, payload: any, recipientId?: string, recipientRole?: string) => {
  const template = mockNotificationTemplates.find(t => t.type === type);
  if (!template) return; // Silent fail if no template
  
  // Simple variable replacement: {{VarName}}
  let subject = template.subject_template;
  let body = template.body_template;
  
  Object.keys(payload).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, payload[key]);
    body = body.replace(regex, payload[key]);
  });
  
  // Dispatch based on channels
  if (template.channels.includes('In-App')) {
    addMockNotification({
      recipient_id: recipientId,
      recipient_role: recipientRole,
      title: subject,
      message: body
    });
  }
  
  if (template.channels.includes('Email')) console.log(`[EMAIL DISPATCH] To: ${recipientId || recipientRole} | Subject: ${subject} | Body: ${body}`);
  if (template.channels.includes('SMS')) console.log(`[SMS DISPATCH] To: ${recipientId || recipientRole} | Body: ${body}`);
  if (template.channels.includes('Teams')) console.log(`[TEAMS DISPATCH] To: ${recipientId || recipientRole} | Body: ${body}`);
};


export interface ApiService {
  getEmployees: () => Promise<any>;
  createEmployee: (data: any) => Promise<any>;
  bulkCreateEmployees: (data: any[]) => Promise<any>;
  updateEmployee: (id: string, data: any) => Promise<any>;
  deleteEmployee: (id: string) => Promise<any>;
  getAssets: () => Promise<any>;
  getAssetHistory: (assetId: string) => Promise<any>;
  assignAsset: (assetId: string, employeeId: string) => Promise<any>;
  createAsset: (data: any) => Promise<any>;
  updateAsset: (id: string, data: any) => Promise<any>;
  getAttendance: (employeeId?: string) => Promise<any>;
  clockIn: (employeeId: string) => Promise<any>;
  triggerBiometricSwipe: (employeeIdCode: string, timestamp?: string) => Promise<any>;
  getPerformance: (employeeId?: string) => Promise<any>;
  addPerformance: (data: any) => Promise<any>;
  getLeaves: () => Promise<any>;
  applyLeave: (data: any) => Promise<any>;
  updateLeaveStatus: (id: string, status: any) => Promise<any>;
  getRegularizations: () => Promise<any>;
  applyRegularization: (data: any) => Promise<any>;
  updateRegularizationStatus: (id: string, status: any) => Promise<any>;
  getDocuments: (employeeId?: string) => Promise<any>;
  getExpenses: () => Promise<any>;
  updateExpenseStatus: (id: string, status: any, comment?: string) => Promise<any>;
  getLookups: () => Promise<any>;
  getDepartments: () => Promise<any>;
  getDesignations: () => Promise<any>;
  getClients: () => Promise<any>;
  getWorkplaces: () => Promise<any>;
  createDepartment: (data: any) => Promise<any>;
  createDesignation: (data: any) => Promise<any>;
  createClient: (data: any) => Promise<any>;
  createWorkplace: (data: any) => Promise<any>;
  getNotifications: (role?: string, employeeId?: string) => Promise<{ data: AppNotification[] }>;
  markNotificationAsRead: (id: string) => Promise<any>;
  getNotificationTemplates: () => Promise<{ data: any[] }>;
  updateNotificationTemplate: (id: string, data: any) => Promise<{ data: any }>;
  
  // New workflow endpoints
  getAuditLogs: (employeeId?: string) => Promise<{ data: AuditEvent[] }>;
  getOnboardingTasks: () => Promise<{ data: OnboardingTask[] }>;
  completeOnboardingTask: (id: string) => Promise<any>;
  getPayrollDeductions: () => Promise<{ data: PayrollDeduction[] }>;
  processPayrollDeduction: (id: string) => Promise<any>;
  getRoles: () => Promise<{ data: Role[] }>;
  createRole: (data: any) => Promise<any>;
  updateRole: (id: string, data: any) => Promise<any>;
  getBranches: () => Promise<{ data: Branch[] }>;
  createBranch: (data: any) => Promise<any>;
  getProjects: () => Promise<{ data: Project[] }>;
  getProjectById: (id: string) => Promise<{ data: Project | null }>;
  createProject: (data: any) => Promise<any>;
  getWorkflows: () => Promise<{ data: any[] }>;
  createWorkflow: (data: any) => Promise<any>;
  getPendingApprovals: (role: string) => Promise<{ data: any[] }>;
  processApproval: (id: string, action: 'Approve' | 'Reject') => Promise<{ data: any }>;
  applyResignation: (data: any) => Promise<any>;
  
  // Security endpoints
  getSecuritySettings: () => Promise<{ data: SecuritySettings }>;
  updateSecuritySettings: (data: Partial<SecuritySettings>) => Promise<{ data: SecuritySettings }>;
  getLoginAttempts: () => Promise<{ data: any[] }>;
  getBlockedUsers: () => Promise<{ data: any[] }>;
  unblockUser: (id: string) => Promise<any>;
  getMasterData: (category: MasterDataCategory) => Promise<{ data: MasterDataItem[] }>;
  addMasterData: (item: Omit<MasterDataItem, 'id'>) => Promise<{ data: MasterDataItem }>;
  updateMasterData: (id: string, item: Partial<MasterDataItem>) => Promise<{ data: MasterDataItem | undefined }>;
  deleteMasterData: (id: string) => Promise<any>;
}

export const apiService: ApiService = {
  // Employees
  getEmployees: async () => {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) throw error;
    return { data: data || [] };
  },
  createEmployee: async (data: any) => {
    const payload = { ...data };
    if (payload.reporting_manager_id === 'N/A' || payload.reporting_manager_id === '') {
      payload.reporting_manager_id = null;
    }
    if (payload.project_manager_id === 'N/A' || payload.project_manager_id === '') {
      payload.project_manager_id = null;
    }
    const { data: result, error } = await supabase.from('employees').insert([payload]).select().single();
    if (error) throw error;
    
    // Notifications for New Hire
    addMockNotification({
      recipient_role: 'IT Admin',
      title: 'New Employee Joined',
      message: `${payload.employee_name} has been added. Please provision their laptop and email.`
    });
    addMockNotification({
      recipient_role: 'Payroll Manager',
      title: 'New Employee Joined',
      message: `${payload.employee_name} requires payroll onboarding.`
    });
    if (payload.project_manager_id) {
      addMockNotification({
        recipient_id: payload.project_manager_id,
        title: 'New Team Member',
        message: `${payload.employee_name} has been assigned to your team.`
      });
    } else if (payload.reporting_manager_id) {
      addMockNotification({
        recipient_id: payload.reporting_manager_id,
        title: 'New Direct Report',
        message: `${payload.employee_name} now reports to you.`
      });
    }

    // Add Audit Log
    addMockAuditLog({
      employee_id: result.id,
      action: 'Joined Company',
      description: `${payload.employee_name} joined as ${payload.role}.`
    });

    // Generate IT Onboarding Tasks
    defaultITTasks.forEach(task => {
      mockOnboardingTasks.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        employee_id: result.id,
        task_name: task,
        is_completed: false
      });
    });

    return { data: result };
  },
  bulkCreateEmployees: async (data: any[]) => {
    const { data: result, error } = await supabase.from('employees').insert(data).select();
    if (error) throw error;
    return { data: result || [] };
  },
  updateEmployee: async (id: string, data: any) => {
    const payload = { ...data };
    if (payload.reporting_manager_id === 'N/A' || payload.reporting_manager_id === '') {
      payload.reporting_manager_id = null;
    }
    if (payload.project_manager_id === 'N/A' || payload.project_manager_id === '') {
      payload.project_manager_id = null;
    }
    const { data: result, error } = await supabase.from('employees').update(payload).eq('id', id).select().single();
    if (error) throw error;

    addMockAuditLog({
      employee_id: id,
      action: 'Profile Updated',
      description: 'Employee details were modified.'
    });

    return { data: result };
  },
  deleteEmployee: async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) throw error;
    return { message: 'Deleted successfully' };
  },

  // Assets
  getAssets: async () => {
    const { data, error } = await supabase.from('assets').select('*');
    if (error) throw error;
    return { data: data || [] };
  },
  getAssetHistory: async (_assetId: string) => ({ data: [] }),
  assignAsset: async (_assetId: string, _employeeId: string) => ({ data: {} }),
  createAsset: async (data: any) => {
    const { data: result, error } = await supabase.from('assets').insert([data]).select().single();
    if (error) throw error;
    return { data: result };
  },
  updateAsset: async (employee_id: string, data: any) => {
    const { data: result, error } = await supabase.from('assets').update(data).eq('employee_id', employee_id).select().single();
    if (error) throw error;
    return { data: result };
  },

  // Attendance
  getAttendance: async (employeeId?: string) => {
    let query = supabase.from('attendance').select('*');
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data: data || [] };
  },
  clockIn: async (employeeId: string) => {
    const newRecord = {
      employee_id: employeeId,
      date: new Date().toISOString().split('T')[0],
      clock_in: new Date().toISOString(),
      status: 'Present'
    };
    const { data, error } = await supabase.from('attendance').insert([newRecord]).select().single();
    if (error) throw error;
    return { data };
  },
  triggerBiometricSwipe: async (employeeIdCode: string, timestamp?: string) => {
    // Basic implementation for biometric swipe
    const newRecord = {
      employee_id_code: employeeIdCode,
      date: new Date().toISOString().split('T')[0],
      clock_in: timestamp || new Date().toISOString(),
      status: 'Present'
    };
    const { data, error } = await supabase.from('attendance').insert([newRecord]).select().single();
    if (error) throw error;
    return { data };
  },

  // Performance (Mocked for now)
  getPerformance: async (_employeeId?: string) => ({ data: [] }),
  addPerformance: async (data: any) => ({ data: { id: Date.now().toString(), ...data, date: new Date().toISOString() } }),

  // Leaves
  getLeaves: async () => {
    const { data, error } = await supabase.from('leaves').select('*');
    if (error) throw error;
    return { data: data || [] };
  },
  applyLeave: async (data: any) => {
    const { data: result, error } = await supabase.from('leaves').insert([data]).select().single();
    if (error) throw error;
    
    // Notification for Reporting Manager
    // Assuming the employee object has a reporting manager, or we broadcast to the manager role.
    addMockNotification({
      recipient_role: 'Reporting Manager',
      title: 'New Leave Request',
      message: `A new leave request requires your approval.`
    });
    addMockNotification({
      recipient_role: 'Manager',
      title: 'New Leave Request',
      message: `A new leave request requires your approval.`
    });

    if (data?.employee_id) {
      addMockAuditLog({
        employee_id: data.employee_id,
        action: 'Leave Applied',
        description: `Applied for ${data.leave_type}.`
      });
    }

    return { data: result };
  },
  updateLeaveStatus: async (id: string, status: any) => {
    const { data, error } = await supabase.from('leaves').update({ status }).eq('id', id).select().single();
    if (error) throw error;

    // Notify the employee whose leave was updated
    if (data?.employee_id) {
      addMockNotification({
        recipient_id: data.employee_id,
        title: `Leave Request ${status}`,
        message: `Your leave request has been ${status.toLowerCase()}.`
      });
    }

    // Notify HR Dashboard
    addMockNotification({
      recipient_role: 'Admin',
      title: `Leave ${status}`,
      message: `A leave request was ${status.toLowerCase()}.`
    });

    if (data?.employee_id) {
      addMockAuditLog({
        employee_id: data.employee_id,
        action: `Leave ${status}`,
        description: `Leave request was ${status.toLowerCase()}.`
      });

      // If approved and Unpaid Leave, trigger Payroll Deduction
      if (status === 'Approved' && data.leave_type === 'Unpaid Leave') {
        mockPayrollDeductions.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          employee_id: data.employee_id,
          reason: 'Unpaid Leave',
          amount: 1000, // Dummy fixed amount for deduction
          status: 'Pending',
          created_at: new Date().toISOString()
        });

        addMockNotification({
          recipient_role: 'Payroll',
          title: 'New Deduction Added',
          message: `Unpaid leave approved for employee.`
        });
      }
    }

    return { data };
  },

  // Regularizations (Mocked for now since table doesn't exist yet)
  getRegularizations: async () => ({ data: [] }),
  applyRegularization: async (data: any) => ({ data: { id: Date.now().toString(), ...data, applied_at: new Date().toISOString() } }),
  updateRegularizationStatus: async (id: string, status: any) => ({ data: { id, status } }),
  
  // Documents
  getDocuments: async (employeeId?: string) => {
    let query = supabase.from('documents').select('*');
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    const { data, error } = await query;
    if (error) throw error;
    
    // If no data exists in Supabase, return a mock document so the UI can be tested
    if (!data || data.length === 0) {
      return { 
        data: [{
          id: 'mock-doc-1',
          employee_id: employeeId || 'mock-emp',
          name: 'Signed Offer Letter',
          type: 'Offer Letter',
          url: '#',
          uploaded_at: new Date().toISOString()
        }, {
          id: 'mock-doc-2',
          employee_id: employeeId || 'mock-emp',
          name: 'ID Proof (Passport)',
          type: 'ID Proof',
          url: '#',
          uploaded_at: new Date().toISOString()
        }] 
      };
    }
    
    return { data: data || [] };
  },

  // Expenses (Mocked)
  getExpenses: async () => ({ data: [] }),
  updateExpenseStatus: async (_id: string, _status: any, _comment?: string) => ({ data: {} }),

  // Lookups
  getLookups: async () => {
    const [depts, clients] = await Promise.all([
      supabase.from('departments').select('*'),
      supabase.from('clients').select('*')
    ]);
    return {
      departments: depts.data || [],
      designations: [],
      clients: clients.data || [],
      workplaces: []
    };
  },
  getDepartments: async () => {
    // Return mock data since new schema fields might not be in supabase
    return { data: mockDepartments };
  },
  getDesignations: async () => ({ data: [] }),
  getClients: async () => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw error;
    return { data: data || [] };
  },
  getWorkplaces: async () => ({ data: [] }),
  
  createDepartment: async (data: any) => {
    const newDept = {
      id: Date.now().toString(),
      ...data
    };
    mockDepartments.push(newDept);
    return { data: newDept };
  },
  createDesignation: async (data: any) => ({ data }),
  createClient: async (data: any) => {
    const { data: result, error } = await supabase.from('clients').insert([data]).select().single();
    if (error) throw error;
    return { data: result };
  },
  createWorkplace: async (data: any) => {
    const { data: result, error } = await supabase.from('workplaces').insert([data]).select().single();
    if (error) throw error;
    return { data: result };
  },
  getRoles: async () => {
    return { data: mockRoles };
  },
  createRole: async (data: any) => {
    const newRole = {
      id: Date.now().toString(),
      is_custom: true,
      ...data
    };
    mockRoles.push(newRole);
    return { data: newRole };
  },
  updateRole: async (id: string, data: any) => {
    const index = mockRoles.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRoles[index] = { ...mockRoles[index], ...data };
      return { data: mockRoles[index] };
    }
    throw new Error('Role not found');
  },
  getBranches: async () => {
    return { data: mockBranches };
  },
  createBranch: async (data: any) => {
    const newBranch = {
      id: Date.now().toString(),
      ...data
    };
    mockBranches.push(newBranch);
    return { data: newBranch };
  },
  getProjects: async () => {
    return { data: mockProjects };
  },
  getProjectById: async (id: string) => {
    const project = mockProjects.find(p => p.id === id);
    return { data: project || null };
  },
  createProject: async (data: any) => {
    const newProject = {
      id: Date.now().toString(),
      status: 'Active',
      team_members_count: 0,
      milestones_count: 0,
      risks_count: 0,
      ...data
    };
    mockProjects.push(newProject);
    return { data: newProject };
  },
  getWorkflows: async () => {
    return { data: mockWorkflows };
  },
  createWorkflow: async (data: any) => {
    const newWorkflow = {
      id: Date.now().toString(),
      ...data
    };
    mockWorkflows.push(newWorkflow);
    return { data: newWorkflow };
  },
  applyResignation: async (data: any) => {
    const newApproval = {
      id: `app-${Date.now()}`,
      workflow_id: 'wf3', // Resignation Workflow
      employee_id: data.employee_id,
      request_type: 'Resignation',
      payload: { reason: data.reason, last_working_day: data.last_working_day },
      current_step_order: 1, // Start at step 1
      status: 'Pending',
      applied_at: new Date().toISOString()
    };
    mockApprovalRequests.push(newApproval);
    return { data: newApproval };
  },
  getPendingApprovals: async (role: string) => {
    // Find approvals where the current step's role matches the user's role
    const pending = mockApprovalRequests.filter(req => {
      if (req.status !== 'Pending') return false;
      const wf = mockWorkflows.find(w => w.id === req.workflow_id);
      if (!wf) return false;
      const currentStep = wf.steps.find((s: any) => s.step_order === req.current_step_order);
      if (!currentStep) return false;
      
      // If role is super admin, they can see everything. Otherwise, map strictly.
      if (role === 'Super Admin') return true;
      if (role === 'Admin') return true; // simplifying for mock
      
      return currentStep.role_name === role || (currentStep.role_name === 'Reporting Manager' && role === 'Manager');
    });
    
    // Attach workflow details for UI
    const enriched = pending.map(req => {
      const wf = mockWorkflows.find(w => w.id === req.workflow_id);
      const currentStep = wf?.steps.find((s: any) => s.step_order === req.current_step_order);
      return {
        ...req,
        workflow_name: wf?.name,
        pending_with_role: currentStep?.role_name
      };
    });
    
    return { data: enriched };
  },
  processApproval: async (id: string, action: 'Approve' | 'Reject') => {
    const req = mockApprovalRequests.find(r => r.id === id);
    if (!req) throw new Error('Request not found');
    
    if (action === 'Reject') {
      req.status = 'Rejected';
      // Also update the underlying entity if it was a leave
      if (req.request_type === 'Leave') {
         apiService.updateLeaveStatus(req.payload.id, 'Rejected').catch(console.error);
      }
      return { data: req };
    }
    
    // Approve action -> move to next step
    const wf = mockWorkflows.find(w => w.id === req.workflow_id);
    const maxStep = Math.max(...wf.steps.map((s: any) => s.step_order));
    
    if (req.current_step_order < maxStep) {
      req.current_step_order += 1;
      
      // Check if the new step is 'Approved' or 'Completed'
      const nextStep = wf.steps.find((s: any) => s.step_order === req.current_step_order);
      if (nextStep && (nextStep.role_name === 'Approved' || nextStep.role_name === 'Completed')) {
        req.status = 'Completed';
        if (req.request_type === 'Leave') {
          apiService.updateLeaveStatus(req.payload.id, 'Approved').catch(console.error);
          
          dispatchNotification('Leave Approved', { 
            EmployeeName: req.employee_id, // in real app, fetch name 
            LeaveDetails: `${req.payload.type} from ${req.payload.start_date}`
          }, req.employee_id);
        }
      }
    } else {
      req.status = 'Completed';
    }
    
    return { data: req };
  },
  getNotifications: async (role?: string, employeeId?: string) => {
    const filtered = mockNotifications.filter(n => {
      if (n.recipient_id) {
        return n.recipient_id === employeeId || n.recipient_id === 'all';
      }
      if (n.recipient_role) {
        return n.recipient_role === role || role === 'Super Admin';
      }
      return true;
    });
    const sorted = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { data: sorted };
  },
  markNotificationAsRead: async (id: string) => {
    const notif = mockNotifications.find(n => n.id === id);
    if (notif) notif.is_read = true;
    return { data: notif };
  },
  getNotificationTemplates: async () => {
    return { data: mockNotificationTemplates };
  },
  updateNotificationTemplate: async (id: string, data: any) => {
    const index = mockNotificationTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      mockNotificationTemplates[index] = { ...mockNotificationTemplates[index], ...data };
      return { data: mockNotificationTemplates[index] };
    }
    throw new Error('Template not found');
  },
  
  // New workflow endpoints
  getAuditLogs: async (employeeId?: string) => {
    const logs = employeeId ? mockAuditLogs.filter(l => l.employee_id === employeeId) : mockAuditLogs;
    const sorted = [...logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { data: sorted };
  },
  getOnboardingTasks: async () => {
    return { data: mockOnboardingTasks };
  },
  completeOnboardingTask: async (id: string) => {
    const task = mockOnboardingTasks.find(t => t.id === id);
    if (task) {
      task.is_completed = true;
      task.completed_at = new Date().toISOString();

      // Check if all tasks for this employee are complete
      const empTasks = mockOnboardingTasks.filter(t => t.employee_id === task.employee_id);
      if (empTasks.every(t => t.is_completed)) {
        addMockAuditLog({
          employee_id: task.employee_id,
          action: 'Onboarding Completed',
          description: 'All IT setup tasks have been completed.'
        });
        addMockNotification({
          recipient_role: 'Admin',
          title: 'Employee Setup Complete',
          message: `IT setup is complete.`
        });
      }
    }
    return { data: task };
  },
  getPayrollDeductions: async () => {
    return { data: mockPayrollDeductions };
  },
  processPayrollDeduction: async (id: string) => {
    const deduc = mockPayrollDeductions.find(d => d.id === id);
    if (deduc) {
      deduc.status = 'Processed';
      addMockAuditLog({
        employee_id: deduc.employee_id,
        action: 'Payroll Deduction Processed',
        description: `Processed deduction of ₹${deduc.amount} for ${deduc.reason}.`
      });
    }
    return { data: deduc };
  },
  
  // Security Methods
  getSecuritySettings: async () => {
    return { data: mockSecuritySettings };
  },
  updateSecuritySettings: async (data: Partial<SecuritySettings>) => {
    mockSecuritySettings = { ...mockSecuritySettings, ...data };
    addMockAuditLog({
      employee_id: 'System',
      action: 'Security Settings Updated',
      description: 'Super Admin updated security configurations.'
    });
    return { data: mockSecuritySettings };
  },
  getLoginAttempts: async () => {
    return { data: mockLoginAttempts };
  },
  getBlockedUsers: async () => {
    return { data: mockBlockedUsers };
  },
  unblockUser: async (id: string) => {
    mockBlockedUsers = mockBlockedUsers.filter(u => u.id !== id);
    return { message: 'User unblocked successfully' };
  },

  // Master Data
  getMasterData: async (category: MasterDataCategory) => {
    return { data: mockMasterData.filter(d => d.category === category) };
  },
  addMasterData: async (item: Omit<MasterDataItem, 'id'>) => {
    const newItem = {
      ...item,
      id: `md_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    };
    mockMasterData.push(newItem);
    addMockAuditLog({
      employee_id: 'System',
      action: `Master Data Added (${item.category})`,
      description: `Added ${item.name} to ${item.category}`
    });
    return { data: newItem };
  },
  updateMasterData: async (id: string, item: Partial<MasterDataItem>) => {
    mockMasterData = mockMasterData.map(d => d.id === id ? { ...d, ...item } : d);
    addMockAuditLog({
      employee_id: 'System',
      action: 'Master Data Updated',
      description: `Updated master data record ${id}`
    });
    return { data: mockMasterData.find(d => d.id === id) };
  },
  deleteMasterData: async (id: string) => {
    mockMasterData = mockMasterData.filter(d => d.id !== id);
    addMockAuditLog({
      employee_id: 'System',
      action: 'Master Data Deleted',
      description: `Deleted master data record ${id}`
    });
    return { message: 'Deleted successfully' };
  }
};

let mockMasterData: MasterDataItem[] = [
  { id: 'md1', category: 'Designations', name: 'Software Engineer', description: 'Core development role', status: 'Active' },
  { id: 'md2', category: 'Designations', name: 'Senior Software Engineer', description: 'Advanced development role', status: 'Active' },
  { id: 'md3', category: 'Employment Types', name: 'Full-Time', description: 'Permanent full-time', status: 'Active' },
  { id: 'md4', category: 'Employment Types', name: 'Contractor', description: 'Contractual basis', status: 'Active' },
  { id: 'md5', category: 'Skills', name: 'React', description: 'Frontend Library', status: 'Active' },
  { id: 'md6', category: 'Skills', name: 'Node.js', description: 'Backend Framework', status: 'Active' },
  { id: 'md7', category: 'Locations', name: 'Hyderabad', description: 'Main Office', status: 'Active' }
];
