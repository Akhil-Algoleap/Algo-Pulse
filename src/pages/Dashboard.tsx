import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Building2, 
  Briefcase,
  Globe,
  UserCheck
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
import { Card, cn, Badge } from '../components/UI';
import { apiService } from '../services/api';
import { Employee, Department, Client } from '../types';

export const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes, clientRes] = await Promise.all([
          apiService.getEmployees(),
          apiService.getDepartments(),
          apiService.getClients()
        ]);
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setClients(clientRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: Users, color: 'bg-primary-600' },
    { label: 'Active Staff', value: employees.filter(e => e.status === 'Active').length, icon: UserCheck, color: 'bg-emerald-600' },
    { label: 'Clients', value: clients.length, icon: Briefcase, color: 'bg-emerald-600' },
    { label: 'Departments', value: departments.length, icon: Building2, color: 'bg-green-600' },
  ];

  // Data for Department Chart
  const deptData = departments.map(dept => ({
    name: dept.department_name,
    count: employees.filter(e => e.department_id === dept.id).length
  }));

  // Data for Client Chart
  const clientData = clients.map(client => ({
    name: client.client_name,
    value: employees.filter(e => e.client_id === client.id).length
  }));

  const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organization Overview</h1>
        <p className="text-slate-500 text-lg">Real-time workforce analytics and distribution</p>
      </div>

      {/* Stats Grid */}
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
        {/* Department Chart */}
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

        {/* Client Chart */}
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
