-- Supabase PostgreSQL Schema for Algo Pulse

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- ENUMS
-- ==========================================
CREATE TYPE employee_status AS ENUM ('Active', 'Inactive', 'Resigned');
CREATE TYPE user_role AS ENUM ('Admin', 'Manager', 'Reporting Manager', 'Employee', 'Super Admin', 'Payroll Manager', 'Finance', 'IT Admin', 'Project Manager');
CREATE TYPE asset_status AS ENUM ('Assigned', 'Returned', 'In Repair', 'Damaged');
CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE leave_type AS ENUM ('Sick', 'Casual', 'Paid');
CREATE TYPE expense_status AS ENUM ('Pending', 'Approved', 'Paid', 'Rejected');
CREATE TYPE task_status AS ENUM ('To Do', 'In Progress', 'Blocked', 'Testing', 'Completed');
CREATE TYPE project_status AS ENUM ('Active', 'Completed');
CREATE TYPE priority_level AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE approval_status AS ENUM ('Manager Pending', 'Finance Pending', 'Approved', 'Rejected', 'Payment Released');

-- ==========================================
-- CORE TABLES
-- ==========================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_name VARCHAR(255) NOT NULL,
    department_head_id UUID,
    budget DECIMAL(15, 2),
    cost_center VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    branch_head_id UUID,
    working_hours VARCHAR(100),
    holidays_count INT DEFAULT 0,
    attendance_device_enabled BOOLEAN DEFAULT false,
    payroll_rules TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE designations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    designation_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workplaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workplace_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- EMPLOYEES & ROLES
-- ==========================================

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    joining_date DATE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    department_id UUID REFERENCES departments(id),
    designation_id UUID REFERENCES designations(id),
    client_id UUID REFERENCES clients(id),
    workplace_id UUID REFERENCES workplaces(id),
    status employee_status DEFAULT 'Active',
    experience_years INT DEFAULT 0,
    reporting_manager_id UUID REFERENCES employees(id),
    project_manager_id UUID REFERENCES employees(id),
    role user_role DEFAULT 'Employee',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add circular FK for department head
ALTER TABLE departments ADD CONSTRAINT fk_department_head FOREIGN KEY (department_head_id) REFERENCES employees(id) ON DELETE SET NULL;
ALTER TABLE branches ADD CONSTRAINT fk_branch_head FOREIGN KEY (branch_head_id) REFERENCES employees(id) ON DELETE SET NULL;

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    module VARCHAR(100) NOT NULL,
    can_view BOOLEAN DEFAULT false,
    can_create BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    can_approve BOOLEAN DEFAULT false
);

-- ==========================================
-- PROJECTS MODULE
-- ==========================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    status project_status DEFAULT 'Active',
    budget DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE project_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL,
    allocation INT DEFAULT 100
);

CREATE TABLE project_sprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Planning',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES project_sprints(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority priority_level DEFAULT 'Medium',
    story_points INT DEFAULT 0,
    assigned_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    due_date DATE,
    status task_status DEFAULT 'To Do',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    milestone_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending'
);

CREATE TABLE project_timesheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL,
    timesheet_date DATE NOT NULL,
    hours DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ATTENDANCE & LEAVE MODULE
-- ==========================================

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    clock_in TIME,
    clock_out TIME,
    total_hours DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'Present'
);

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status leave_status DEFAULT 'Pending',
    manager_comment TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- FINANCE MODULE
-- ==========================================

CREATE TABLE expense_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    claim_date DATE NOT NULL,
    description TEXT,
    receipt_url TEXT,
    status approval_status DEFAULT 'Manager Pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE travel_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    travel_type VARCHAR(50) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    claim_date DATE NOT NULL,
    purpose TEXT,
    status approval_status DEFAULT 'Manager Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE purchase_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requestor_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    request_date DATE NOT NULL,
    justification TEXT,
    status VARCHAR(100) DEFAULT 'Manager Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vendor_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_name VARCHAR(255) NOT NULL,
    invoice_number VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- PAYROLL MODULE
-- ==========================================

CREATE TABLE salary_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade_name VARCHAR(255) NOT NULL,
    basic_salary DECIMAL(15, 2) NOT NULL,
    hra DECIMAL(15, 2) NOT NULL,
    special_allowance DECIMAL(15, 2) NOT NULL,
    pf_deduction DECIMAL(15, 2) NOT NULL,
    tax_deduction DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE employee_salaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    structure_id UUID REFERENCES salary_structures(id),
    base_salary DECIMAL(15, 2) NOT NULL,
    effective_date DATE NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payroll_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_month VARCHAR(50) NOT NULL,
    run_year INT NOT NULL,
    total_employees INT,
    total_gross DECIMAL(15, 2),
    total_net DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'Draft',
    processed_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_run_id UUID REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    gross_pay DECIMAL(15, 2) NOT NULL,
    deductions DECIMAL(15, 2) NOT NULL,
    net_pay DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Generated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    loan_type VARCHAR(100) NOT NULL,
    principal_amount DECIMAL(15, 2) NOT NULL,
    emi_amount DECIMAL(15, 2) NOT NULL,
    balance_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Optional but recommended
-- ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
-- (Add specific RLS policies based on your auth setup)
