-- Initial Schema for Algo Pulse

-- 1. Departments Table
CREATE TABLE public.departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_name TEXT NOT NULL,
  head_id UUID, -- References employees(id) later
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Clients Table
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Employees Table
CREATE TABLE public.employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  employee_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  joining_date DATE NOT NULL,
  department_id TEXT,
  designation_id TEXT,
  client_id TEXT,
  workplace_id TEXT,
  status TEXT DEFAULT 'Active',
  experience_years NUMERIC DEFAULT 0,
  reporting_manager_id TEXT,
  role TEXT DEFAULT 'Employee',
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Attendance Table
CREATE TABLE public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id),
  employee_id_code TEXT,
  employee_name TEXT,
  date DATE NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE,
  clock_out TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'Present',
  total_hours NUMERIC,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Leaves Table
CREATE TABLE public.leaves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id),
  type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_by UUID REFERENCES public.employees(id)
);

-- 6. Documents Table
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
-- For demo purposes we can allow all, but in prod you'd want auth policies
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users" ON public.departments FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON public.clients FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON public.employees FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON public.leaves FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON public.documents FOR ALL USING (true);
