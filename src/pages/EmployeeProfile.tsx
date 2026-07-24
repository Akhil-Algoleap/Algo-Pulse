import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  Briefcase,
  Clock,
  Calendar,
  Banknote,
  TrendingUp,
  Monitor,
  FileText,
  GraduationCap,
  History,
  Mail,
  MapPin,
  Edit2,
  AlertCircle
} from 'lucide-react';
import { Card, Badge, Button, cn } from '../components/UI';
import { apiService } from '../services/api';
import { Employee } from '../types';

type TabId = 
  | 'overview' 
  | 'personal' 
  | 'employment' 
  | 'attendance' 
  | 'leave' 
  | 'payroll' 
  | 'performance' 
  | 'assets' 
  | 'documents' 
  | 'training' 
  | 'timeline';

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'personal', label: 'Personal', icon: Mail },
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'leave', label: 'Leave', icon: Calendar },
  { id: 'payroll', label: 'Payroll', icon: Banknote },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'assets', label: 'Assets', icon: Monitor },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'training', label: 'Training', icon: GraduationCap },
  { id: 'timeline', label: 'Timeline', icon: History },
];

export const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;
      try {
        const res = await apiService.getEmployees();
        const found = res.data.find((e: Employee) => e.id === id);
        if (found) setEmployee(found);
      } catch (error) {
        console.error('Failed to fetch employee:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <AlertCircle className="w-12 h-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700">Employee Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/employees')}>Back to Directory</Button>
      </div>
    );
  }

  // ---- Mock Data for Tabs ----
  const mockAttendance = [
    { date: '2023-10-15', in: '09:00 AM', out: '06:00 PM', status: 'Present' },
    { date: '2023-10-14', in: '09:15 AM', out: '06:00 PM', status: 'Late' },
    { date: '2023-10-13', in: '-', out: '-', status: 'Absent' },
  ];

  const mockLeaves = [
    { type: 'Sick Leave', start: '2023-09-01', end: '2023-09-02', status: 'Approved' },
    { type: 'Casual Leave', start: '2023-10-20', end: '2023-10-20', status: 'Pending' },
  ];

  const mockPayroll = [
    { month: 'September 2023', basic: '$4,000', net: '$3,200', status: 'Paid' },
    { month: 'August 2023', basic: '$4,000', net: '$3,200', status: 'Paid' },
  ];

  const mockPerformance = [
    { period: 'Q3 2023', score: '4.5 / 5', reviewer: 'Jane Smith', feedback: 'Excellent work on the core platform upgrade.' },
    { period: 'Q2 2023', score: '4.0 / 5', reviewer: 'Jane Smith', feedback: 'Solid performance, needs improvement in communication.' },
  ];

  const mockAssets = [
    { name: 'MacBook Pro 16"', id: 'AST-MAC-001', assigned: '2023-01-15' },
    { name: 'Dell 27" Monitor', id: 'AST-MON-042', assigned: '2023-01-20' },
  ];

  const mockDocuments = [
    { name: 'Employment Contract.pdf', type: 'Contract', date: '2023-01-10' },
    { name: 'ID Proof.jpg', type: 'KYC', date: '2023-01-10' },
  ];

  const mockTraining = [
    { course: 'Security Awareness 2023', status: 'Completed', date: '2023-03-15' },
    { course: 'Advanced TypeScript', status: 'In Progress', date: '-' },
  ];

  const mockTimeline = [
    { title: 'Joined Algo Pulse', date: '2023-01-15', type: 'Hiring' },
    { title: 'Completed Probation', date: '2023-07-15', type: 'Status Change' },
    { title: 'Promoted to Senior', date: '2024-01-01', type: 'Promotion' },
  ];
  // ----------------------------

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Tenure</p>
                  <p className="text-xl font-black text-slate-900">2.5 Yrs</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Leave Balance</p>
                  <p className="text-xl font-black text-emerald-700">12 Days</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">YTD Attendance</p>
                  <p className="text-xl font-black text-blue-700">96%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs text-purple-600 font-bold uppercase mb-1">Perf. Score</p>
                  <p className="text-xl font-black text-purple-700">4.5/5</p>
                </div>
              </div>
            </Card>
            <Card className="border-none shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Reporting Line</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                    JS
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Jane Smith</p>
                    <p className="text-xs text-slate-500">Manager</p>
                  </div>
                </div>
                <div className="w-0.5 h-6 bg-slate-200 ml-5"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {employee.employee_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{employee.employee_name}</p>
                    <p className="text-xs text-slate-500">{employee.designation_id}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      
      case 'personal':
        return (
          <Card className="border-none shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Full Name</p>
                 <p className="font-medium text-slate-900">{employee.employee_name}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Email Address</p>
                 <p className="font-medium text-slate-900">{employee.email}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Phone Number</p>
                 <p className="font-medium text-slate-900">{employee.phone || '-'}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Date of Birth</p>
                 <p className="font-medium text-slate-900">Jan 15, 1990</p>
               </div>
               <div className="md:col-span-2">
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Address</p>
                 <p className="font-medium text-slate-900">123 Tech Lane, Silicon Valley, CA 94025</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Emergency Contact</p>
                 <p className="font-medium text-slate-900">Sarah {employee.employee_name.split(' ')[1] || 'Doe'} (Spouse)</p>
                 <p className="text-sm text-slate-500">+1 987 654 3210</p>
               </div>
             </div>
          </Card>
        );

      case 'employment':
        return (
          <Card className="border-none shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Employment Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Employee ID</p>
                 <p className="font-medium text-slate-900">{employee.employee_id}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Joining Date</p>
                 <p className="font-medium text-slate-900">{employee.joining_date}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Department</p>
                 <p className="font-medium text-slate-900">{employee.department_id || '-'}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Designation</p>
                 <p className="font-medium text-slate-900">{employee.designation_id || '-'}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Work Location</p>
                 <p className="font-medium text-slate-900">{employee.workplace_id || 'On-site'}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Client Allocation</p>
                 <p className="font-medium text-slate-900">{employee.client_id || 'Internal'}</p>
               </div>
             </div>
          </Card>
        );

      case 'attendance':
        return (
          <Card className="border-none shadow-sm p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Recent Attendance</h3>
              <Button variant="outline" size="sm">View Full Calendar</Button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Clock In</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Clock Out</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockAttendance.map((a, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-medium text-sm">{a.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{a.in}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{a.out}</td>
                    <td className="px-6 py-4">
                      <Badge variant={a.status === 'Present' ? 'success' : a.status === 'Absent' ? 'danger' : 'warning'}>{a.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        );

      case 'leave':
         return (
          <Card className="border-none shadow-sm p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Leave History</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Leave Type</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Start Date</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">End Date</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockLeaves.map((l, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-medium text-sm">{l.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{l.start}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{l.end}</td>
                    <td className="px-6 py-4">
                      <Badge variant={l.status === 'Approved' ? 'success' : 'warning'}>{l.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        );

      case 'payroll':
         return (
          <Card className="border-none shadow-sm p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Recent Payslips</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Month</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Basic Salary</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Pay</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockPayroll.map((p, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-medium text-sm">{p.month}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.basic}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{p.net}</td>
                    <td className="px-6 py-4">
                      <Badge variant="success">{p.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="outline" size="sm">Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        );

      case 'performance':
         return (
          <Card className="border-none shadow-sm p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Performance Reviews</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {mockPerformance.map((p, i) => (
                <div key={i} className="p-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{p.period} Review</h4>
                    <Badge variant="default">{p.score}</Badge>
                  </div>
                  <p className="text-sm text-slate-500">Reviewed by: {p.reviewer}</p>
                  <p className="text-sm text-slate-700 mt-2 p-3 bg-slate-50 rounded-lg">{p.feedback}</p>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'assets':
        return (
          <Card className="border-none shadow-sm p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Assigned Assets</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Name</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset ID</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Assigned Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockAssets.map((a, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-medium text-sm flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-slate-400" />
                      {a.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono text-xs">{a.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{a.assigned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        );

      case 'documents':
         return (
          <Card className="border-none shadow-sm p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Employee Documents</h3>
              <Button variant="outline" size="sm">Upload Document</Button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Document Name</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Date</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockDocuments.map((d, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-medium text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      {d.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{d.type}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{d.date}</td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        );

      case 'training':
        return (
          <Card className="border-none shadow-sm p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Training & Certifications</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Course Name</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Completion Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockTraining.map((t, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 font-medium text-sm flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      {t.course}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={t.status === 'Completed' ? 'success' : 'warning'}>{t.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        );

      case 'timeline':
        return (
          <Card className="border-none shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Employee Journey</h3>
             <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {mockTimeline.map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                       <History className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <Badge variant="default" className="text-[10px]">{item.type}</Badge>
                      </div>
                      <time className="text-xs font-bold text-slate-400 uppercase">{item.date}</time>
                    </div>
                  </div>
                ))}
             </div>
          </Card>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Profile Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/employees')} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Employee Profile</h1>
      </div>

      <Card className="border-none shadow-md overflow-hidden p-0 relative">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-400"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg shrink-0">
               <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-4xl font-black text-slate-400">
                 {employee.employee_name.charAt(0)}
               </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{employee.employee_name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {employee.designation_id || 'Employee'}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {employee.workplace_id || 'On-site'}</span>
                    <Badge variant={employee.status === 'Active' ? 'success' : 'warning'}>{employee.status}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </Button>
                  <Button variant="danger">Terminate</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-primary-600" : "text-slate-400")} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
