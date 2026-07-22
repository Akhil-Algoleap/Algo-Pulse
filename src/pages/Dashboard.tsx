import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Building2, 
  Briefcase,
  Globe,
  UserCheck,
  Calendar,
  FileText,
  CheckSquare
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
  Cell
} from 'recharts';
import { Card, cn, Badge, Button } from '../components/UI';
import { apiService } from '../services/api';
import { Employee, Department, Client, LeaveRequest } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes, clientRes, leaveRes] = await Promise.all([
          apiService.getEmployees(),
          apiService.getDepartments(),
          apiService.getClients(),
          apiService.getLeaves()
        ]);
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setClients(clientRes.data);
        setLeaves(leaveRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (profile) fetchData();
  }, [profile]);

  const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  // --- MANAGER DASHBOARD ---
  if (profile?.role === 'Manager') {
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
             <span className="text-slate-500">by greytHR</span>
           </div>
           <div className="flex items-center gap-4 pl-2">
             <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500"><Users className="w-5 h-5"/></div>
             <div>
               <p className="font-bold text-slate-800 text-sm">Your Gateway to Possibilities</p>
               <p className="text-xs text-slate-500">Loans, Taxes, Salary Advances, <span className="text-primary-600 font-medium">All within greytHR!</span></p>
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

  // --- ADMIN DASHBOARD ---
  const stats = [
    { label: 'Total Employees', value: employees.length, icon: Users, color: 'bg-primary-600' },
    { label: 'Active Staff', value: employees.filter(e => e.status === 'Active').length, icon: UserCheck, color: 'bg-emerald-600' },
    { label: 'Clients', value: clients.length, icon: Briefcase, color: 'bg-emerald-600' },
    { label: 'Departments', value: departments.length, icon: Building2, color: 'bg-green-600' },
  ];

  const deptData = departments.map(dept => ({
    name: dept.department_name,
    count: employees.filter(e => e.department_id === dept.id).length
  }));

  const clientData = clients.map(client => ({
    name: client.client_name,
    value: employees.filter(e => e.client_id === client.id).length
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organization Overview</h1>
        <p className="text-slate-500 text-lg">Real-time workforce analytics and distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group border-none shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className={cn("p-4 rounded-2xl text-white shadow-inner", stat.color)}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
               <stat.icon className="w-24 h-24" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-[450px] flex flex-col border-none shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Employees by Department</h3>
            <Badge variant="default">Distribution</Badge>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#16a34a" radius={[8, 8, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="h-[450px] flex flex-col border-none shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Employees by Client</h3>
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
               <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {clientData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-4xl font-black text-slate-900">{employees.length}</p>
              <p className="text-sm font-bold text-slate-400 uppercase">Total</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {clientData.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-slate-700 truncate">{c.name}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">{c.value} Employees</p>
                </div>
              </div>
            ))}
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
