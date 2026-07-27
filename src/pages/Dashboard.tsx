import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Briefcase,
  UserCheck,
  Calendar,
  FileText,
  CheckSquare,
  UserPlus,
  Search,
  Banknote,
  Clock,
  Plus,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  Percent,
  Rocket,
  ShieldAlert,
  TrendingUp,
  Plane,
  Receipt,
  CreditCard,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  RefreshCw,
  Calculator,
  Download,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { Card, cn, Badge, Button } from '../components/UI';
import { apiService } from '../services/api';
import { Employee, Department, LeaveRequest, OnboardingTask, PayrollDeduction } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>([]);
  const [deductions, setDeductions] = useState<PayrollDeduction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes, leaveRes, tasksRes, deducRes] = await Promise.all([
          apiService.getEmployees(),
          apiService.getDepartments(),
          apiService.getLeaves(),
          apiService.getOnboardingTasks(),
          apiService.getPayrollDeductions()
        ]);
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setLeaves(leaveRes.data);
        setOnboardingTasks(tasksRes.data);
        setDeductions(deducRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (profile) fetchData();
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  // --- SUPER ADMIN DASHBOARD ---
  if (profile?.role === 'Super Admin') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Super Admin Dashboard</h1>
          <p className="text-slate-500 text-lg">System Overview & Company Health</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Total Employees</p>
               <Users className="w-6 h-6 text-blue-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">550</p>
          </Card>
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Active Users</p>
               <UserCheck className="w-6 h-6 text-emerald-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">543</p>
          </Card>
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Pending Approvals</p>
               <CheckSquare className="w-6 h-6 text-amber-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">18</p>
          </Card>
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">System Health</p>
               <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500" />
             </div>
             <p className="text-3xl font-black text-emerald-600">Healthy</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="p-6 border-none shadow-sm text-center">
            <p className="text-sm text-slate-500 mb-2">Today's Attendance</p>
            <p className="text-2xl font-bold text-slate-800">512</p>
          </Card>
          <Card className="p-6 border-none shadow-sm text-center">
            <p className="text-sm text-slate-500 mb-2">New Joiners</p>
            <p className="text-2xl font-bold text-slate-800">5</p>
          </Card>
          <Card className="p-6 border-none shadow-sm text-center">
            <p className="text-sm text-slate-500 mb-2">On Leave</p>
            <p className="text-2xl font-bold text-slate-800">12</p>
          </Card>
          <Card className="p-6 border-none shadow-sm text-center">
            <p className="text-sm text-slate-500 mb-2">Open Recruitment</p>
            <p className="text-2xl font-bold text-slate-800">16</p>
          </Card>
          <Card className="p-6 border-none shadow-sm text-center">
            <p className="text-sm text-slate-500 mb-2">Audit Events</p>
            <p className="text-2xl font-bold text-slate-800">42</p>
          </Card>
        </div>
      </div>
    );
  }

  // --- PROJECT MANAGER DASHBOARD ---
  if (profile?.role === 'Project Manager') {
    const sprintBurndownData = [
      { day: 'Day 1', expected: 100, actual: 100 },
      { day: 'Day 2', expected: 80, actual: 85 },
      { day: 'Day 3', expected: 60, actual: 65 },
      { day: 'Day 4', expected: 40, actual: 50 },
      { day: 'Day 5', expected: 20, actual: 25 },
    ];
    const projectProgressData = [
      { name: 'Alpha', progress: 75 },
      { name: 'Beta', progress: 40 },
      { name: 'Gamma', progress: 90 },
      { name: 'Delta', progress: 20 },
    ];
    const taskStatusData = [
      { name: 'To Do', value: 20, color: '#94a3b8' },
      { name: 'In Progress', value: 45, color: '#3b82f6' },
      { name: 'Review', value: 15, color: '#f59e0b' },
      { name: 'Done', value: 30, color: '#10b981' },
    ];
    const velocityData = [
      { sprint: 'Sprint 1', planned: 40, completed: 35 },
      { sprint: 'Sprint 2', planned: 45, completed: 45 },
      { sprint: 'Sprint 3', planned: 50, completed: 42 },
      { sprint: 'Sprint 4', planned: 45, completed: 50 },
    ];
    const resourceUtilizationData = [
      { name: 'Frontend', allocated: 90, available: 10 },
      { name: 'Backend', allocated: 100, available: 0 },
      { name: 'Design', allocated: 70, available: 30 },
      { name: 'QA', allocated: 60, available: 40 },
    ];
    const teamCapacityData = [
      { name: 'Available', value: 30, color: '#10b981' },
      { name: 'Allocated', value: 70, color: '#3b82f6' },
    ];

    return (
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Project Manager Dashboard</h1>
            <p className="text-slate-500 text-lg">Project Health & Team Metrics</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white gap-2"><Plus className="w-4 h-4" /> Create Project</Button>
            <Button size="sm" variant="outline" className="gap-2"><UserPlus className="w-4 h-4" /> Assign Resource</Button>
            <Button size="sm" variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Create Sprint</Button>
            <Button size="sm" variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Create Task</Button>
            <Button size="sm" variant="outline" className="gap-2"><CheckSquare className="w-4 h-4" /> Approve Timesheet</Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Projects Assigned</p>
               <Briefcase className="w-6 h-6 text-blue-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">6</p>
          </Card>
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Tasks Completed</p>
               <CheckCircle2 className="w-6 h-6 text-emerald-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">142</p>
          </Card>
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Tasks Pending</p>
               <Clock className="w-6 h-6 text-amber-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">38</p>
          </Card>
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Team Utilization</p>
               <Percent className="w-6 h-6 text-indigo-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">85%</p>
          </Card>
          
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Team Availability</p>
               <UserCheck className="w-6 h-6 text-blue-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">15%</p>
          </Card>
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Sprint Progress</p>
               <Rocket className="w-6 h-6 text-purple-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">72%</p>
          </Card>
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Pending Timesheets</p>
               <FileText className="w-6 h-6 text-orange-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">12</p>
          </Card>
          <Card className="flex flex-col p-6 border-none shadow-md bg-white">
             <div className="flex justify-between items-center mb-4">
               <p className="text-sm font-bold text-slate-400 uppercase">Open Risks</p>
               <ShieldAlert className="w-6 h-6 text-rose-500" />
             </div>
             <p className="text-3xl font-black text-rose-600">3</p>
          </Card>
        </div>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Sprint Burndown Chart</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sprintBurndownData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="expected" stroke="#94a3b8" strokeDasharray="5 5" name="Expected" />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Project Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectProgressData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} width={60} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="progress" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Team Capacity</h3>
            <div className="h-64 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={teamCapacityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {teamCapacityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Task Status</h3>
            <div className="h-64 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} dataKey="value">
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Resource Utilization</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="allocated" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} name="Allocated %" maxBarSize={40} />
                  <Bar dataKey="available" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Available %" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Velocity Chart</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="sprint" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="planned" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Planned" maxBarSize={30} />
                  <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Completed" maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // --- PAYROLL MANAGER DASHBOARD ---
  if (profile?.role === 'Payroll Manager') {
    const monthlyPayrollCostData = [
      { month: 'Jan', cost: 110 }, { month: 'Feb', cost: 112 },
      { month: 'Mar', cost: 115 }, { month: 'Apr', cost: 118 },
      { month: 'May', cost: 120 }, { month: 'Jun', cost: 125 }
    ];
    
    const salaryDistributionData = [
      { category: 'Base Pay', amount: 80, color: '#3b82f6' },
      { category: 'Allowances', amount: 12, color: '#10b981' },
      { category: 'Bonuses', amount: 5, color: '#f59e0b' },
      { category: 'Overtime', amount: 3, color: '#8b5cf6' }
    ];
    
    const overtimeCostData = [
      { month: 'Jan', cost: 2.1 }, { month: 'Feb', cost: 2.5 },
      { month: 'Mar', cost: 2.3 }, { month: 'Apr', cost: 3.0 },
      { month: 'May', cost: 2.8 }, { month: 'Jun', cost: 3.5 }
    ];
    
    const taxDeductionTrendData = [
      { month: 'Jan', tax: 15 }, { month: 'Feb', tax: 15.2 },
      { month: 'Mar', tax: 15.5 }, { month: 'Apr', tax: 16 },
      { month: 'May', tax: 16.2 }, { month: 'Jun', tax: 17 }
    ];
    
    const departmentPayrollCostData = [
      { name: 'Engineering', cost: 45 }, { name: 'Sales', cost: 25 },
      { name: 'Marketing', cost: 15 }, { name: 'Operations', cost: 20 },
      { name: 'HR', cost: 10 }
    ];
    
    const bonusDistributionData = [
      { type: 'Performance', amount: 60, color: '#10b981' },
      { type: 'Retention', amount: 20, color: '#3b82f6' },
      { type: 'Joining', amount: 15, color: '#f59e0b' },
      { type: 'Referral', amount: 5, color: '#ec4899' }
    ];

    return (
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Manager Dashboard</h1>
            <p className="text-slate-500 text-lg">Payroll Month: July 2026</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white gap-2"><RefreshCw className="w-4 h-4" /> Process Payroll</Button>
            <Button size="sm" variant="outline" className="gap-2"><FileText className="w-4 h-4" /> Generate Payslips</Button>
            <Button size="sm" variant="outline" className="gap-2"><Calculator className="w-4 h-4" /> Calculate Tax</Button>
            <Button size="sm" variant="outline" className="gap-2"><TrendingUp className="w-4 h-4" /> Approve Salary Revision</Button>
            <Button size="sm" variant="outline" className="gap-2"><Download className="w-4 h-4" /> Generate Bank File</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Total Employees</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-slate-800">550</p>
               <Users className="w-5 h-5 text-blue-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Payroll Ready</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-emerald-500">480</p>
               <CheckCircle2 className="w-5 h-5 text-emerald-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Payroll Processed</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-indigo-500">30</p>
               <RefreshCw className="w-5 h-5 text-indigo-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Payroll Pending</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-amber-500">40</p>
               <AlertTriangle className="w-5 h-5 text-amber-300 mb-1" />
             </div>
          </Card>
          
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Salary Revisions</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-purple-500">8</p>
               <TrendingUp className="w-5 h-5 text-purple-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Overtime Hours</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-rose-500">320</p>
               <Clock className="w-5 h-5 text-rose-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Tax Pending</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-orange-500">5</p>
               <Percent className="w-5 h-5 text-orange-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Payroll Cost</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-slate-800">₹1.25Cr</p>
               <Banknote className="w-5 h-5 text-slate-300 mb-1" />
             </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Payroll Cost (in Lakhs)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyPayrollCostData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="cost" fill="#d1fae5" stroke="#10b981" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Salary Distribution</h3>
            <div className="h-64 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={salaryDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="amount" nameKey="category">
                    {salaryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Overtime Cost (in Lakhs)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overtimeCostData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="cost" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Overtime Cost" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Tax Deduction Trend (in Lakhs)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taxDeductionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="tax" stroke="#f59e0b" strokeWidth={3} name="Tax Deductions" dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Department-wise Payroll Cost (in Lakhs)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentPayrollCostData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} width={80} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="cost" name="Cost" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Bonus Distribution</h3>
            <div className="h-64 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bonusDistributionData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} dataKey="amount" nameKey="type">
                    {bonusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // --- FINANCE DASHBOARD ---
  // --- FINANCE DASHBOARD ---
  if (profile?.role === 'Finance') {
    const departmentBudgets = [
      { name: 'Engineering', allocated: 50, consumed: 42 },
      { name: 'Marketing', allocated: 20, consumed: 18 },
      { name: 'Sales', allocated: 30, consumed: 15 },
      { name: 'HR', allocated: 10, consumed: 8 },
      { name: 'Operations', allocated: 25, consumed: 21 },
    ];
    
    const monthlyExpensesData = [
      { month: 'Jan', amount: 15 },
      { month: 'Feb', amount: 18 },
      { month: 'Mar', amount: 16 },
      { month: 'Apr', amount: 20 },
      { month: 'May', amount: 17 },
      { month: 'Jun', amount: 19 },
    ];
    
    const payrollCostTrendData = [
      { month: 'Jan', cost: 110 },
      { month: 'Feb', cost: 112 },
      { month: 'Mar', cost: 115 },
      { month: 'Apr', cost: 118 },
      { month: 'May', cost: 120 },
      { month: 'Jun', cost: 125 },
    ];
    
    const travelExpensesData = [
      { category: 'Flights', amount: 45, color: '#3b82f6' },
      { category: 'Hotels', amount: 30, color: '#10b981' },
      { category: 'Meals', amount: 15, color: '#f59e0b' },
      { category: 'Transit', amount: 10, color: '#8b5cf6' },
    ];
    
    const vendorPaymentsData = [
      { month: 'Jan', payments: 5 },
      { month: 'Feb', payments: 7 },
      { month: 'Mar', payments: 6 },
      { month: 'Apr', payments: 8 },
      { month: 'May', payments: 5 },
      { month: 'Jun', payments: 9 },
    ];

    const budgetVsActualData = [
      { category: 'Q1', budget: 100, actual: 95 },
      { category: 'Q2', budget: 120, actual: 125 },
      { category: 'Q3', budget: 110, actual: 105 },
      { category: 'Q4', budget: 130, actual: 120 },
    ];

    return (
      <div className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Finance Dashboard</h1>
            <p className="text-slate-500 text-lg">Financial Overview, Approvals & Budgets</p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white gap-2"><CheckSquare className="w-4 h-4" /> Approve Payroll</Button>
            <Button size="sm" variant="outline" className="gap-2"><Receipt className="w-4 h-4" /> Approve Expense</Button>
            <Button size="sm" variant="outline" className="gap-2"><FileText className="w-4 h-4" /> Approve Purchase Request</Button>
            <Button size="sm" variant="outline" className="gap-2"><BarChartIcon className="w-4 h-4" /> Generate Financial Report</Button>
          </div>
        </div>

        {/* KPI Cards (8 items) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Payroll Cost</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-slate-800">₹1.25Cr</p>
               <Banknote className="w-5 h-5 text-slate-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Approved Expenses</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-slate-800">₹8.4L</p>
               <CheckCircle2 className="w-5 h-5 text-emerald-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Pending Claims</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-amber-500">24</p>
               <AlertTriangle className="w-5 h-5 text-amber-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Budget Utilization</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-indigo-500">68%</p>
               <PieChartIcon className="w-5 h-5 text-indigo-300 mb-1" />
             </div>
          </Card>
          
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Vendor Payments</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-purple-500">15</p>
               <CreditCard className="w-5 h-5 text-purple-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Pending Approvals</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-rose-500">12</p>
               <CheckSquare className="w-5 h-5 text-rose-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Travel Claims</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-blue-500">8</p>
               <Plane className="w-5 h-5 text-blue-300 mb-1" />
             </div>
          </Card>
          <Card className="p-4 border-none shadow-sm bg-white flex flex-col justify-between">
             <p className="text-xs font-bold text-slate-400 uppercase mb-2">Monthly Spend</p>
             <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-slate-800">₹18.4L</p>
               <TrendingUp className="w-5 h-5 text-slate-300 mb-1" />
             </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Expenses (in Lakhs)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyExpensesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="amount" fill="#bfdbfe" stroke="#3b82f6" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Department-wise Budget (in Lakhs)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentBudgets}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="allocated" name="Allocated" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="consumed" name="Consumed" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Payroll Cost Trend (in Lakhs)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={payrollCostTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={3} name="Payroll Cost" dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Travel Expenses Breakdown</h3>
            <div className="h-64 flex flex-col items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={travelExpensesData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="amount" nameKey="category">
                    {travelExpensesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Vendor Payments (in Lakhs)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorPaymentsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="payments" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Payments" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Budget vs Actual (in Lakhs)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetVsActualData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} width={60} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={20} />
                  <Bar dataKey="actual" name="Actual" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // --- IT ADMIN DASHBOARD ---
  if (profile?.role === 'IT Admin') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">IT Administrator Dashboard</h1>
          <p className="text-slate-500 text-lg">Hardware & Access Management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-none shadow-md bg-white text-center">
             <p className="text-sm font-bold text-slate-400 uppercase mb-2">Laptop Requests</p>
             <p className="text-4xl font-black text-slate-800">3</p>
          </Card>
          <Card className="p-6 border-none shadow-md bg-white text-center">
             <p className="text-sm font-bold text-slate-400 uppercase mb-2">Email Creation</p>
             <p className="text-4xl font-black text-slate-800">2</p>
          </Card>
          <Card className="p-6 border-none shadow-md bg-white text-center">
             <p className="text-sm font-bold text-slate-400 uppercase mb-2">Asset Returns</p>
             <p className="text-4xl font-black text-amber-500">4</p>
          </Card>
          <Card className="p-6 border-none shadow-md bg-white text-center">
             <p className="text-sm font-bold text-slate-400 uppercase mb-2">Inactive Devices</p>
             <p className="text-4xl font-black text-rose-500">6</p>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="p-6 border-none shadow-sm flex items-center justify-between bg-purple-50">
            <div>
              <p className="font-bold text-purple-900 text-lg">Software Licenses Expiring</p>
              <p className="text-sm text-purple-700">Require renewal</p>
            </div>
            <span className="text-4xl font-black text-purple-600">8</span>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Pending Employee Setup</h2>
          {onboardingTasks.filter(t => !t.is_completed).length === 0 ? (
            <Card className="p-8 border-none shadow-sm text-center">
              <p className="text-slate-500">No pending setups at the moment.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(new Set(onboardingTasks.filter(t => !t.is_completed).map(t => t.employee_id))).map(empId => {
                const emp = employees.find(e => e.id === empId);
                const tasks = onboardingTasks.filter(t => t.employee_id === empId && !t.is_completed);
                return (
                  <Card key={empId} className="p-6 border-none shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{emp?.employee_name || 'Unknown Employee'}</h3>
                    <p className="text-sm text-slate-500 mb-4">{emp?.role}</p>
                    <div className="space-y-3">
                      {tasks.map(task => (
                        <label key={task.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                            onChange={async () => {
                              await apiService.completeOnboardingTask(task.id);
                              // Refresh tasks
                              const res = await apiService.getOnboardingTasks();
                              setOnboardingTasks(res.data);
                            }}
                          />
                          <span className="text-sm text-slate-700">{task.task_name}</span>
                        </label>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- MANAGER DASHBOARD ---
  if (profile?.role === 'Manager' || profile?.role === 'Reporting Manager') {
    // Assuming manager sees data for their team. For now we use dummy aggregated data that matches the mock.
    const myTeamSize = employees.length > 0 ? Math.min(employees.length, 18) : 18; 
    const presentToday = myTeamSize > 2 ? myTeamSize - 2 : myTeamSize;
    const absent = 1;
    const onLeave = 1;
    
    const pendingLeaves = leaves.filter(l => l.status === 'Pending').length || 3;

    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, {profile?.employee_name || 'John'}</h1>
          <p className="text-slate-500 text-lg">Project Manager - {profile?.department_id || 'Engineering'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex flex-col items-center justify-center p-6 border-none shadow-md bg-white">
             <Users className="w-8 h-8 text-blue-500 mb-2" />
             <p className="text-sm font-bold text-slate-400 uppercase">My Team</p>
             <p className="text-3xl font-black text-slate-900">{myTeamSize}</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 border-none shadow-md bg-white">
             <UserCheck className="w-8 h-8 text-emerald-500 mb-2" />
             <p className="text-sm font-bold text-slate-400 uppercase">Present Today</p>
             <p className="text-3xl font-black text-slate-900">{presentToday}</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 border-none shadow-md bg-white">
             <XCircleIcon className="w-8 h-8 text-rose-500 mb-2" />
             <p className="text-sm font-bold text-slate-400 uppercase">Absent</p>
             <p className="text-3xl font-black text-slate-900">{absent}</p>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 border-none shadow-md bg-white">
             <Calendar className="w-8 h-8 text-amber-500 mb-2" />
             <p className="text-sm font-bold text-slate-400 uppercase">On Leave</p>
             <p className="text-3xl font-black text-slate-900">{onLeave}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 border-none shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Pending Leave Requests</p>
                <p className="text-sm text-slate-500">Require your approval</p>
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900">{pendingLeaves}</span>
          </Card>

          <Card className="p-6 border-none shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Pending Profile Approvals</p>
                <p className="text-sm text-slate-500">Require your approval</p>
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900">2</span>
          </Card>

          <Card className="p-6 border-none shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Open Tasks</p>
                <p className="text-sm text-slate-500">Assigned to your team</p>
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900">5</span>
          </Card>
        </div>
      </div>
    );
  }

  // --- PAYROLL MANAGER DASHBOARD ---
  if (profile?.role === 'Payroll Manager') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Manager Dashboard</h1>
          <p className="text-slate-500 text-lg">Payroll Processing & Compliance Overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Payroll Month</p>
             <p className="text-xl font-black text-slate-900 mt-1">July 2026</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Employees to Process</p>
             <p className="text-xl font-black text-blue-600 mt-1">520</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Payroll Completed</p>
             <p className="text-xl font-black text-emerald-600 mt-1">480</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Pending Payroll</p>
             <p className="text-xl font-black text-amber-600 mt-1">40</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Payroll Errors</p>
             <p className="text-xl font-black text-rose-600 mt-1">2</p>
          </Card>
          
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Salary Revisions</p>
             <p className="text-xl font-black text-indigo-600 mt-1">8</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Pending Loans</p>
             <p className="text-xl font-black text-slate-700 mt-1">12</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Pending Reimbursements</p>
             <p className="text-xl font-black text-slate-700 mt-1">15</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Tax Calculations Pending</p>
             <p className="text-xl font-black text-amber-600 mt-1">5</p>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-400 uppercase">Overtime Requests</p>
             <p className="text-xl font-black text-blue-600 mt-1">18</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Clock className="w-5 h-5"/></div>
              <h3 className="text-lg font-bold text-slate-900">Daily Responsibilities</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Monitor attendance synchronization (eSSL)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Review salary changes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Process reimbursements</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Validate overtime approvals</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Calendar className="w-5 h-5"/></div>
              <h3 className="text-lg font-bold text-slate-900">Weekly Responsibilities</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Review pending payroll changes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Verify employee salary updates</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Resolve payroll discrepancies</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 border-none shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckSquare className="w-5 h-5"/></div>
              <h3 className="text-lg font-bold text-slate-900">Monthly Responsibilities</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 font-medium">Process payroll</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Generate payslips</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Submit payroll to Finance</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Generate statutory reports</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 font-medium text-emerald-600">Close payroll cycle</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  // --- EMPLOYEE DASHBOARD ---
  if (profile?.role === 'Employee') {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-4 max-w-lg pt-4">
            <h1 className="text-3xl font-medium text-slate-800">Good Afternoon</h1>
            <div className="space-y-1">
              <p className="text-slate-500 text-[15px]">Don't worry about failures, worry about the chances you miss when you don't even try.</p>
              <p className="text-slate-500 text-[15px]">- Jack Canfield</p>
            </div>
          </div>
          <div className="hidden md:block w-72 h-40 bg-slate-100 rounded-2xl relative overflow-hidden flex-shrink-0 border border-slate-200">
            {/* Placeholder for the car illustration */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <Briefcase className="w-12 h-12 opacity-20" />
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="w-full bg-gradient-to-r from-pink-50 via-white to-blue-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-center gap-4">
           <div className="flex items-center gap-2 border-r border-slate-300 pr-4">
             <span className="font-bold text-slate-800">Unite</span>
             <span className="text-slate-500">by Algo Pulse</span>
           </div>
           <div className="flex items-center gap-4 pl-2">
             <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500"><Users className="w-5 h-5"/></div>
             <div>
               <p className="font-bold text-slate-800 text-sm">Your Gateway to Possibilities</p>
               <p className="text-xs text-slate-500">Loans, Taxes, Salary Advances, <span className="text-primary-600 font-medium">All within Algo Pulse!</span></p>
             </div>
             <Button size="sm" className="ml-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg px-6">Explore</Button>
           </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Review Card */}
          <Card className="p-5 border-slate-200 shadow-sm flex flex-col h-[280px]">
            <h3 className="text-sm text-slate-600 font-medium mb-auto">Review</h3>
            <div className="flex flex-col items-center justify-center gap-4 mt-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-400">
                <CheckSquare className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-500">Hurrah! You've nothing to review.</p>
            </div>
            <div className="mt-auto"></div>
          </Card>

          {/* Time & Attendance Card */}
          <Card className="p-5 border-slate-200 shadow-sm flex flex-col h-[280px] bg-slate-50/50">
            <p className="text-sm font-medium text-slate-800">22 July 2026</p>
            <p className="text-xs text-slate-500 mb-6">Wednesday | General Shift</p>
            
            <p className="text-3xl font-medium text-slate-700 mb-8">15 : 59 : 00</p>
            
            <div className="mt-auto flex gap-3">
              <Button variant="outline" className="flex-1 bg-white border-slate-300 text-slate-600">Web Sign In</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Sign Out</Button>
            </div>
          </Card>

          {/* Upcoming Holidays Card */}
          <Card className="p-5 border-slate-200 shadow-sm flex flex-col h-[280px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm text-slate-600 font-medium">Upcoming Holidays</h3>
              <button className="text-slate-400 hover:text-slate-600">→</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700">02 Oct <span className="text-xs text-slate-500 font-normal ml-2">Friday</span></p>
                <p className="text-xs text-slate-500">Mahatma Gandhi Jayanti</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">20 Oct <span className="text-xs text-slate-500 font-normal ml-2">Tuesday</span></p>
                <p className="text-xs text-slate-500">Dussehra</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">25 Dec <span className="text-xs text-slate-500 font-normal ml-2">Friday</span></p>
                <p className="text-xs text-slate-500">Christmas</p>
              </div>
            </div>
          </Card>

          {/* Bottom Row placehodlers */}
          <Card className="p-5 border-slate-200 shadow-sm h-[200px]">
             <div className="flex items-center justify-between">
                <h3 className="text-sm text-slate-600 font-medium">IT Declaration</h3>
             </div>
          </Card>
          <Card className="p-5 border-slate-200 shadow-sm h-[200px]">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-slate-600 font-medium">Payslip</h3>
                <button className="text-slate-400 hover:text-slate-600">→</button>
             </div>
             <div className="w-full flex justify-center">
               <div className="w-24 h-24 rounded-full border-[12px] border-slate-100 border-b-blue-500 border-l-blue-500 border-t-emerald-500 border-r-emerald-500"></div>
             </div>
          </Card>
          <Card className="p-5 border-slate-200 shadow-sm h-[200px]">
             <h3 className="text-sm text-slate-600 font-medium mb-4">Quick Access</h3>
          </Card>
        </div>
      </div>
    );
  }

  // --- HR ADMIN DASHBOARD ---
  const stats = [
    { label: 'Total Employees', value: employees.length, icon: Users, color: 'bg-blue-600' },
    { label: 'Today\'s Attendance', value: '94%', icon: Clock, color: 'bg-emerald-600' },
    { label: 'New Joiners', value: 8, icon: UserPlus, color: 'bg-purple-600' },
    { label: 'Employees On Leave', value: leaves.filter(l => l.status === 'Approved').length, icon: Calendar, color: 'bg-orange-500' },
    { label: 'Pending Approvals', value: 15, icon: CheckSquare, color: 'bg-rose-500' },
    { label: 'Pending Documents', value: 22, icon: FileText, color: 'bg-amber-500' },
    { label: 'Open Positions', value: 5, icon: Search, color: 'bg-cyan-600' },
    { label: 'Pending Payroll', value: deductions.filter(d => d.status === 'Pending').length, icon: Banknote, color: 'bg-lime-600' },
  ];

  const quickActions = [
    { label: 'Add Employee', icon: Plus, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' },
    { label: 'Start Onboarding', icon: Briefcase, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700' },
    { label: 'Create Announcement', icon: Megaphone, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700' },
    { label: 'Generate Payroll', icon: Banknote, color: 'bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700' },
  ];

  // Mock data for new charts
  const attendanceTrendData = [
    { name: 'Mon', present: 95, leave: 5 },
    { name: 'Tue', present: 92, leave: 8 },
    { name: 'Wed', present: 96, leave: 4 },
    { name: 'Thu', present: 93, leave: 7 },
    { name: 'Fri', present: 88, leave: 12 },
  ];

  const monthlyHiringData = [
    { name: 'Jan', hires: 12 },
    { name: 'Feb', hires: 19 },
    { name: 'Mar', hires: 15 },
    { name: 'Apr', hires: 22 },
    { name: 'May', hires: 18 },
    { name: 'Jun', hires: 25 },
  ];

  const growthData = [
    { name: 'Jan', count: 400 },
    { name: 'Feb', count: 419 },
    { name: 'Mar', count: 434 },
    { name: 'Apr', count: 456 },
    { name: 'May', count: 474 },
    { name: 'Jun', count: 499 },
  ];

  const attritionData = [
    { name: 'Voluntary', value: 15 },
    { name: 'Involuntary', value: 4 },
    { name: 'Retirement', value: 2 },
  ];

  const leaveAnalysisData = [
    { name: 'Sick', value: 45 },
    { name: 'Casual', value: 30 },
    { name: 'Paid', value: 25 },
  ];

  const deptData = departments.map(dept => ({
    name: dept.department_name,
    count: employees.filter(e => e.department_id === dept.id).length
  }));

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 text-lg">Comprehensive HR & Workforce Analytics</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
           {quickActions.map((action, i) => (
             <Button key={i} variant="primary" className={cn("whitespace-nowrap flex items-center gap-2 border-none shadow-sm", action.color)}>
               <action.icon className="w-4 h-4" />
               {action.label}
             </Button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group border-none shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-xl text-white shadow-inner", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Attendance Trend */}
        <Card className="h-[400px] flex flex-col border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Attendance Trend</h3>
            <Badge variant="default">This Week</Badge>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="present" name="Present %" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="leave" name="Leave %" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Employee Growth */}
        <Card className="h-[400px] flex flex-col border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Employee Growth</h3>
            <Badge variant="default">YTD</Badge>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="count" name="Headcount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Monthly Hiring */}
        <Card className="h-[400px] flex flex-col border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Monthly Hiring</h3>
            <Badge variant="default">6 Months</Badge>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHiringData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="hires" name="New Hires" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Department-wise Headcount */}
        <Card className="h-[400px] flex flex-col border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Department Headcount</h3>
            <Badge variant="default">Current</Badge>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} width={100} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" name="Employees" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 5: Attrition Breakdown */}
        <Card className="h-[400px] flex flex-col border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Attrition Breakdown</h3>
            <Badge variant="default">YTD</Badge>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attritionData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                  <Cell fill="#f43f5e" />
                  <Cell fill="#f97316" />
                  <Cell fill="#94a3b8" />
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 6: Leave Analysis */}
        <Card className="h-[400px] flex flex-col border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Leave Analysis</h3>
            <Badge variant="default">This Month</Badge>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leaveAnalysisData} cx="50%" cy="50%" outerRadius={120} paddingAngle={2} dataKey="value" label>
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                  <Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
};

// Helper for Manager Dashboard missing icon
const XCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);
