import React, { useEffect, useState } from 'react';
import { 
  XCircle, 
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  FileText,
  Download,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Badge, Card, Input, cn } from '../components/UI';
import { apiService } from '../services/api';
import { LeaveRequest, LeaveType, Employee } from '../types';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

type AdminTab = 'requests' | 'types' | 'balances' | 'calendar';

export const Leave: React.FC = () => {
  const { profile } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  
  // Admin Tabs State
  const [adminTab, setAdminTab] = useState<AdminTab>('requests');

  // Employee Sub-tabs State
  const [employeeTab, setEmployeeTab] = useState<'Apply'|'Balances'|'Calendar'|'Holiday'|'Regularization'>('Apply');
  const [applySubTab, setApplySubTab] = useState<'Apply'|'Pending'|'History'>('Apply');
  
  // Form State
  const [newLeave, setNewLeave] = useState({
    type: 'Casual' as LeaveType,
    start_date: '',
    end_date: '',
    reason: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leaveRes, empRes] = await Promise.all([
        apiService.getLeaves(),
        apiService.getEmployees(),
      ]);
      
      let fetchedLeaves = leaveRes.data as LeaveRequest[];
      
      if (profile?.role === 'Employee') {
        fetchedLeaves = fetchedLeaves.filter(l => l.employee_id === profile.id);
      }

      setLeaves(fetchedLeaves.reverse());
      setEmployees(empRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) fetchData();
  }, [profile]);

  const handleApply = async () => {
    if (!newLeave.start_date || !newLeave.end_date || !newLeave.reason) {
      return toast.error('Please fill all fields');
    }
    setIsSubmitting(true);
    try {
      await apiService.applyLeave({
        ...newLeave,
        employee_id: profile?.id
      });
      toast.success('Leave applied successfully');
      setNewLeave({ type: 'Casual', start_date: '', end_date: '', reason: '' });
      fetchData();
    } catch (error) {
      toast.error('Application failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
    setLoadingActionId(id);
    try {
      await apiService.updateLeaveStatus(id, status);
      toast.success(`Leave ${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setLoadingActionId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100">Approved</Badge>;
      case 'Rejected': return <Badge variant="danger" className="bg-rose-50 text-rose-600 border-rose-100">Rejected</Badge>;
      case 'Pending': return <Badge variant="warning" className="bg-amber-50 text-amber-600 border-amber-100">Pending</Badge>;
      case 'Cancelled': return <Badge variant="default" className="bg-slate-50 text-slate-500 border-slate-200">Cancelled</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  if (profile?.role === 'Employee') {
    return (
      <div className="flex bg-white min-h-[calc(100vh-8rem)] rounded-xl border border-slate-200 overflow-hidden">
        {/* Left Sidebar for Leave module */}
        <div className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col pt-4 shrink-0">
           <div className="px-6 mb-2 text-sm font-bold text-slate-800">Leave</div>
           <button onClick={() => setEmployeeTab('Apply')} className={cn("px-6 py-2.5 text-left text-sm", employeeTab === 'Apply' ? "bg-white border-l-4 border-primary-500 text-primary-600 font-medium shadow-sm" : "text-slate-600 hover:bg-slate-100")}>Leave Apply</button>
           <button onClick={() => setEmployeeTab('Balances')} className={cn("px-6 py-2.5 text-left text-sm", employeeTab === 'Balances' ? "bg-white border-l-4 border-primary-500 text-primary-600 font-medium shadow-sm" : "text-slate-600 hover:bg-slate-100")}>Leave Balances</button>
           <button onClick={() => setEmployeeTab('Calendar')} className={cn("px-6 py-2.5 text-left text-sm", employeeTab === 'Calendar' ? "bg-white border-l-4 border-primary-500 text-primary-600 font-medium shadow-sm" : "text-slate-600 hover:bg-slate-100")}>Leave Calendar</button>
           <button onClick={() => setEmployeeTab('Holiday')} className={cn("px-6 py-2.5 text-left text-sm", employeeTab === 'Holiday' ? "bg-white border-l-4 border-primary-500 text-primary-600 font-medium shadow-sm" : "text-slate-600 hover:bg-slate-100")}>Holiday Calendar</button>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
           {employeeTab === 'Apply' && (
             <div>
                {/* top tabs */}
                <div className="flex justify-center mb-8">
                  <div className="inline-flex bg-slate-100 rounded-md p-1">
                    <button onClick={() => setApplySubTab('Apply')} className={cn("px-8 py-1.5 text-sm rounded transition-colors", applySubTab === 'Apply' ? "bg-blue-500 text-white shadow" : "text-slate-500 hover:text-slate-700")}>Apply</button>
                    <button onClick={() => setApplySubTab('Pending')} className={cn("px-8 py-1.5 text-sm rounded transition-colors", applySubTab === 'Pending' ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700")}>Pending</button>
                    <button onClick={() => setApplySubTab('History')} className={cn("px-8 py-1.5 text-sm rounded transition-colors", applySubTab === 'History' ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700")}>History</button>
                  </div>
                </div>

                {applySubTab === 'Apply' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-yellow-50 border border-yellow-100 p-3 flex justify-between text-xs text-yellow-800 rounded">
                      <span>Leave is earned by an employee and granted by the employer to take time off work.</span>
                    </div>

                    <h3 className="font-bold text-slate-700 text-lg">Applying for Leave</h3>

                    <div className="space-y-6">
                       <div>
                         <label className="block text-xs text-slate-600 mb-1">Leave type <span className="text-red-500">*</span></label>
                         <select 
                           className="w-1/2 p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400"
                           value={newLeave.type}
                           onChange={(e) => setNewLeave({...newLeave, type: e.target.value as LeaveType})}
                         >
                           <option value="Casual">Casual Leave</option>
                           <option value="Sick">Sick Leave</option>
                           <option value="Earned">Earned Leave</option>
                         </select>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                           <div>
                             <label className="block text-xs text-slate-600 mb-1">From date <span className="text-red-500">*</span></label>
                             <input type="date" value={newLeave.start_date} onChange={(e) => setNewLeave({...newLeave, start_date: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400" />
                           </div>
                           <div>
                             <label className="block text-xs text-slate-600 mb-1">To date <span className="text-red-500">*</span></label>
                             <input type="date" value={newLeave.end_date} onChange={(e) => setNewLeave({...newLeave, end_date: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400" />
                           </div>
                         </div>
                       </div>

                       <div>
                         <label className="block text-xs text-slate-600 mb-1">Reason</label>
                         <textarea value={newLeave.reason} onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400 h-24" />
                       </div>
                       
                       <div className="pt-4 flex gap-4">
                         <Button onClick={handleApply} className="bg-blue-500 hover:bg-blue-600 px-6" isLoading={isSubmitting}>Apply</Button>
                         <Button variant="outline">Cancel</Button>
                       </div>
                    </div>
                  </div>
                )}
                {applySubTab !== 'Apply' && (
                  <div className="text-center text-slate-500 mt-20">View {applySubTab} leaves.</div>
                )}
             </div>
           )}

           {employeeTab !== 'Apply' && (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <CalendarIcon className="w-16 h-16 mb-4 opacity-50" />
               <p>{employeeTab} Module Under Construction</p>
             </div>
           )}
        </div>
      </div>
    );
  }

  // --- Admin Perspective ---
  const totalRequests = leaves.length;
  const pendingRequests = leaves.filter(l => l.status === 'Pending').length;
  const approvedRequests = leaves.filter(l => l.status === 'Approved').length;
  const rejectedRequests = leaves.filter(l => l.status === 'Rejected').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500">Manage company policies, leave types, and employee requests</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button variant="primary"><Plus className="w-4 h-4 mr-2" /> Assign Leave</Button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-none shadow-sm flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Requests</p>
            <p className="text-2xl font-black text-slate-900">{totalRequests}</p>
          </div>
        </Card>
        <Card className="p-5 border-none shadow-sm flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Pending</p>
            <p className="text-2xl font-black text-slate-900">{pendingRequests}</p>
          </div>
        </Card>
        <Card className="p-5 border-none shadow-sm flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Approved</p>
            <p className="text-2xl font-black text-slate-900">{approvedRequests}</p>
          </div>
        </Card>
        <Card className="p-5 border-none shadow-sm flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-100 text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Rejected</p>
            <p className="text-2xl font-black text-slate-900">{rejectedRequests}</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 overflow-x-auto pb-1" aria-label="Tabs">
          {[
            { id: 'requests', label: 'Leave Requests' },
            { id: 'types', label: 'Leave Types' },
            { id: 'balances', label: 'Leave Balances' },
            { id: 'calendar', label: 'Leave Calendar' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as AdminTab)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                adminTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {adminTab === 'requests' && (
          <Card className="border-none shadow-sm overflow-hidden p-0">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search employee..." className="pl-10" />
              </div>
              <Button variant="outline"><Filter className="w-4 h-4 mr-2"/> Filter</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Leave Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reason</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {isLoading ? (
                     <tr><td colSpan={4} className="p-12 text-center"><div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" /></td></tr>
                  ) : leaves.length === 0 ? (
                     <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No requests found</td></tr>
                  ) : leaves.map((leave) => {
                    const emp = employees.find(e => e.id === leave.employee_id);
                    return (
                      <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-700">
                               {emp?.employee_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{emp?.employee_name || 'Unknown'}</p>
                              <p className="text-[10px] text-slate-400">{emp?.employee_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] py-0 border-slate-200 text-slate-600">{leave.type}</Badge>
                            <span className="text-xs font-bold text-slate-700">
                               {formatDate(leave.start_date)} to {formatDate(leave.end_date)}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">Submitted: {new Date(leave.applied_at).toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4 max-w-[250px] truncate">
                          <p className="text-sm text-slate-600">"{leave.reason}"</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {leave.status === 'Pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleStatusUpdate(leave.id, 'Approved')}
                                className="text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 border-slate-200"
                                isLoading={loadingActionId === leave.id}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                                className="text-rose-600 hover:bg-rose-50 hover:border-rose-200 border-slate-200"
                                isLoading={loadingActionId === leave.id}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            getStatusBadge(leave.status)
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {adminTab === 'types' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Casual Leave', days: '12 Days/Year', accrual: 'Monthly', rollover: 'No', color: 'bg-blue-500' },
              { name: 'Sick Leave', days: '12 Days/Year', accrual: 'Monthly', rollover: 'Yes (Max 30)', color: 'bg-rose-500' },
              { name: 'Earned Leave', days: '18 Days/Year', accrual: 'Monthly', rollover: 'Yes (Max 45)', color: 'bg-emerald-500' },
              { name: 'Maternity Leave', days: '26 Weeks', accrual: 'One-time', rollover: 'No', color: 'bg-purple-500' },
              { name: 'Paternity Leave', days: '5 Days', accrual: 'One-time', rollover: 'No', color: 'bg-amber-500' },
              { name: 'Comp Off', days: 'Variable', accrual: 'Manual', rollover: 'Valid 60 days', color: 'bg-indigo-500' }
            ].map((type, i) => (
              <Card key={i} className="p-6 border-slate-200 shadow-sm relative overflow-hidden">
                <div className={cn("absolute top-0 left-0 w-full h-1", type.color)} />
                <h3 className="text-lg font-bold text-slate-900 mb-1 mt-2">{type.name}</h3>
                <p className="text-2xl font-black text-slate-700 mb-4">{type.days}</p>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex justify-between"><span>Accrual:</span> <span className="font-medium text-slate-700">{type.accrual}</span></div>
                  <div className="flex justify-between"><span>Rollover:</span> <span className="font-medium text-slate-700">{type.rollover}</span></div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button variant="outline" className="w-full text-slate-600">Edit Policy</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {adminTab === 'balances' && (
          <Card className="border-none shadow-sm overflow-hidden p-0">
             <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div className="relative w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input placeholder="Search employee..." className="pl-10" />
               </div>
               <Button variant="outline"><Filter className="w-4 h-4 mr-2"/> Department</Button>
             </div>
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Casual</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Sick</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Earned</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Comp Off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {employees.slice(0, 5).map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-bold text-slate-900">{emp.employee_name}</td>
                       <td className="px-6 py-4 text-center"><Badge variant="outline">8</Badge></td>
                       <td className="px-6 py-4 text-center"><Badge variant="outline">10</Badge></td>
                       <td className="px-6 py-4 text-center"><Badge variant="outline" className="bg-emerald-50 text-emerald-700">14</Badge></td>
                       <td className="px-6 py-4 text-center"><Badge variant="outline">0</Badge></td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </Card>
        )}

        {adminTab === 'calendar' && (
          <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
             <CalendarIcon className="w-16 h-16 text-slate-300 mb-4" />
             <h2 className="text-xl font-bold text-slate-700">Department Leave Calendar</h2>
             <p className="text-slate-500 mt-2 max-w-md">Visual grid showing overlapping leaves by department to ensure team coverage and avoid project delays.</p>
             <div className="flex gap-4 mt-6">
                <select className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 outline-none">
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>HR</option>
                </select>
                <Button variant="primary">View Calendar</Button>
             </div>
          </Card>
        )}
      </div>
    </div>
  );
};
