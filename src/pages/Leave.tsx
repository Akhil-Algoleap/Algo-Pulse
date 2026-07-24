import React, { useEffect, useState } from 'react';
import { 
  XCircle, 
  Plus,
  Calendar,
  CheckCircle2,
  FileText,
  Download,
  Search,
  Filter,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Badge, Card, Input, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { LeaveRequest, LeaveType, Employee, RegularizationRequest } from '../types';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

export const Leave: React.FC = () => {
  const { profile } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [regularizations, setRegularizations] = useState<RegularizationRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  
  // Manager Tab State
  const [managerTab, setManagerTab] = useState<'Leaves'|'Regularizations'>('Leaves');

  // Employee Sub-tabs State
  const [employeeTab, setEmployeeTab] = useState<'Apply'|'Balances'|'Calendar'|'Holiday'|'Regularization'>('Apply');
  const [applySubTab, setApplySubTab] = useState<'Apply'|'Pending'|'History'>('Apply');
  const [regSubTab, setRegSubTab] = useState<'Apply'|'History'>('Apply');
  
  // Form State
  const [newLeave, setNewLeave] = useState({
    type: 'Casual' as LeaveType,
    start_date: '',
    end_date: '',
    reason: ''
  });

  const [newRegularization, setNewRegularization] = useState({
    date: '',
    reason: ''
  });

  const isManagerOrAdmin = profile?.role === 'Admin' || profile?.role === 'Super Admin' || profile?.role === 'Manager';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leaveRes, empRes, regRes] = await Promise.all([
        apiService.getLeaves(),
        apiService.getEmployees(),
        apiService.getRegularizations()
      ]);
      
      let fetchedLeaves = leaveRes.data as LeaveRequest[];
      let fetchedRegs = regRes.data as RegularizationRequest[];
      
      if (profile?.role === 'Employee') {
        fetchedLeaves = fetchedLeaves.filter(l => l.employee_id === profile.id);
        fetchedRegs = fetchedRegs.filter(r => r.employee_id === profile.id);
      }
      // If Manager, filter by team (reporting_manager_id). Simplified here assuming data returns relevant leaves for manager.

      setLeaves(fetchedLeaves);
      setRegularizations(fetchedRegs);
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
      setIsApplyModalOpen(false);
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

  const handleApplyReg = async () => {
    if (!newRegularization.date || !newRegularization.reason) {
      return toast.error('Please fill all fields');
    }
    setIsSubmitting(true);
    try {
      await apiService.applyRegularization({
        ...newRegularization,
        employee_id: profile?.id,
        status: 'Pending'
      });
      toast.success('Regularization requested successfully');
      setNewRegularization({ date: '', reason: '' });
      fetchData();
    } catch (error) {
      toast.error('Application failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegStatusUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
    setLoadingActionId(id);
    try {
      await apiService.updateRegularizationStatus(id, status);
      toast.success(`Regularization ${status.toLowerCase()}`);
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
           
           <div className="px-6 mb-2 mt-6 text-sm font-bold text-slate-800">Attendance</div>
           <button onClick={() => setEmployeeTab('Regularization')} className={cn("px-6 py-2.5 text-left text-sm", employeeTab === 'Regularization' ? "bg-white border-l-4 border-primary-500 text-primary-600 font-medium shadow-sm" : "text-slate-600 hover:bg-slate-100")}>Regularizations</button>
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
                      <span>Leave is earned by an employee and granted by the employer to take time off work. The employee is free to avail this leave in accordance with the company policy.</span>
                      <button className="text-blue-500 hover:underline">Hide</button>
                    </div>

                    <h3 className="font-bold text-slate-700 text-lg">Applying for Leave</h3>

                    <div className="space-y-6">
                       <div>
                         <label className="block text-xs text-slate-600 mb-1">Leave type <span className="text-red-500">*</span></label>
                         <select className="w-1/2 p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400">
                           <option>Select type</option>
                           <option>Casual Leave</option>
                           <option>Sick Leave</option>
                         </select>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                           <div>
                             <label className="block text-xs text-slate-600 mb-1">From date <span className="text-red-500">*</span></label>
                             <div className="relative">
                               <input type="date" className="w-full p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400" />
                             </div>
                           </div>
                           <div>
                             <label className="block text-xs text-slate-600 mb-1">To date <span className="text-red-500">*</span></label>
                             <div className="relative">
                               <input type="date" className="w-full p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400" />
                             </div>
                           </div>
                         </div>
                         <div className="space-y-4">
                           <div>
                             <label className="block text-xs text-slate-600 mb-1">Session</label>
                             <select className="w-full p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400">
                               <option>Session 1</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-xs text-slate-600 mb-1">Session</label>
                             <select className="w-full p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400">
                               <option>Session 2</option>
                             </select>
                           </div>
                         </div>
                       </div>

                       <div className="flex items-center gap-2 border-y border-slate-100 py-3">
                         <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-white"><UserCheck className="w-4 h-4"/></div>
                         <span className="text-sm text-slate-600">Applying to</span>
                         <span className="ml-auto text-xs text-slate-400">▼</span>
                       </div>

                       <div>
                         <label className="block text-xs text-slate-600 mb-2">CC to</label>
                         <button className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400">
                           <Plus className="w-4 h-4" />
                         </button>
                         <span className="text-xs text-slate-500 ml-2">Add</span>
                       </div>

                       <div>
                         <label className="block text-xs text-slate-600 mb-1">Contact details</label>
                         <input type="text" className="w-1/2 p-2 border border-slate-200 rounded text-sm outline-none focus:border-blue-400" />
                       </div>
                       
                       <div className="pt-4 flex gap-4">
                         <Button onClick={handleApply} className="bg-blue-500 hover:bg-blue-600 px-6">Apply</Button>
                         <Button variant="outline">Cancel</Button>
                       </div>
                    </div>
                  </div>
                )}
             </div>
           )}

           {employeeTab === 'Balances' && (
             <div>
               <div className="flex justify-end gap-2 mb-6">
                 <Button className="bg-blue-500 hover:bg-blue-600 px-6">Apply</Button>
                 <Button variant="outline" className="px-3 border-slate-200 text-blue-500"><Download className="w-4 h-4"/></Button>
                 <select className="border border-slate-200 rounded px-4 py-1.5 text-sm text-slate-600 outline-none bg-white">
                   <option>2026</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="border border-slate-200 rounded shadow-sm p-4 h-40 flex flex-col bg-white">
                   <div className="flex justify-between text-sm text-slate-500">
                     <span>Loss Of Pay</span>
                     <span>Granted: 0</span>
                   </div>
                   <div className="m-auto text-center">
                     <p className="text-3xl font-medium text-slate-800">0</p>
                     <p className="text-xs text-slate-400">Balance</p>
                   </div>
                 </div>
                 <div className="border border-slate-200 rounded shadow-sm p-4 h-40 flex flex-col bg-white">
                   <div className="flex justify-between text-sm text-slate-500">
                     <span>Bereavement Leave</span>
                     <span>Granted: 0</span>
                   </div>
                   <div className="m-auto text-center">
                     <p className="text-3xl font-medium text-slate-800">0</p>
                     <p className="text-xs text-slate-400">Balance</p>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {employeeTab === 'Calendar' && (
             <div className="flex gap-6">
               <div className="flex-1">
                 <div className="flex items-center gap-4 mb-6">
                   <div>
                     <label className="block text-xs text-slate-500 mb-1">Filter Type</label>
                     <select className="border border-slate-200 rounded p-1.5 text-sm text-slate-700 w-32 outline-none bg-white">
                       <option>Me</option>
                     </select>
                   </div>
                 </div>
                 
                 {/* Mock Calendar Grid */}
                 <div className="border border-slate-200 rounded bg-white overflow-hidden shadow-sm">
                   <div className="flex justify-between items-center p-3 border-b border-slate-200">
                     <button className="text-slate-400 text-sm">{'< Prev'}</button>
                     <span className="font-bold text-slate-700 text-sm">July 2026</span>
                     <button className="text-slate-400 text-sm">{'Next >'}</button>
                   </div>
                   <div className="grid grid-cols-7 text-center border-b border-slate-200 bg-slate-50">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                       <div key={day} className="py-2 text-xs font-bold text-slate-500">{day}</div>
                     ))}
                   </div>
                   <div className="grid grid-cols-7 h-[400px]">
                     {/* Generating mock dates */}
                     {Array.from({length: 35}).map((_, i) => (
                       <div key={i} className={cn("border-r border-b border-slate-100 p-2 text-sm", i === 24 ? "border-2 border-blue-400 bg-blue-50 text-blue-600 font-bold" : "text-slate-600")}>
                         {i < 2 ? 28 + i : (i - 1 <= 31 ? String(i - 1).padStart(2, '0') : '01')}
                       </div>
                     ))}
                   </div>
                   <div className="p-3 text-xs text-slate-500 flex gap-4">
                     <span>Team on Leave <b className="text-slate-700">0</b></span>
                     <span className="flex items-center gap-1">Restricted Holiday <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div></span>
                     <span className="flex items-center gap-1">General Holiday <div className="w-2.5 h-2.5 rounded-full bg-purple-300"></div></span>
                   </div>
                 </div>
               </div>
               
               <div className="w-80 border-l border-slate-200 pl-6 space-y-4 hidden lg:block">
                 <div className="flex justify-end">
                   <Button className="bg-blue-500 hover:bg-blue-600 px-3"><Download className="w-4 h-4"/></Button>
                 </div>
                 <div className="relative">
                   <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   <input type="text" placeholder="Search Employee" className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded outline-none text-sm focus:border-blue-400" />
                   <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" />
                 </div>
                 
                 <div className="border border-slate-200 rounded overflow-hidden mt-6 bg-white shadow-sm">
                   <div className="bg-slate-50 p-3 text-sm font-medium text-slate-700 flex justify-between border-b border-slate-200">
                     Leave Transactions (0) <span>▼</span>
                   </div>
                   <div className="grid grid-cols-3 text-[10px] text-slate-400 uppercase p-2 border-b border-slate-100">
                     <span>Employee</span>
                     <span className="text-center">Number of days</span>
                     <span className="text-right">From-To</span>
                   </div>
                   <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                     <Calendar className="w-12 h-12 text-slate-200" />
                     <p className="text-sm">No Employees are on leave</p>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {employeeTab === 'Holiday' && (
             <div>
               <div className="flex justify-end mb-6">
                 <select className="border border-slate-200 rounded px-4 py-1.5 text-sm text-slate-600 outline-none bg-white">
                   <option>2026</option>
                 </select>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="border border-slate-200 rounded p-4 min-h-[180px] bg-white shadow-sm">
                   <h4 className="text-sm font-bold text-slate-600 mb-4">JAN 2026</h4>
                   <div className="space-y-4">
                     <div className="flex gap-4 items-start">
                       <div className="text-center text-slate-400 w-8"><p className="text-lg font-bold text-slate-600 leading-none">01</p><p className="text-[10px] uppercase">Thu</p></div>
                       <p className="text-sm text-slate-600 leading-tight">New Year's Day</p>
                     </div>
                     <div className="flex gap-4 items-start">
                       <div className="text-center text-slate-400 w-8"><p className="text-lg font-bold text-slate-600 leading-none">14</p><p className="text-[10px] uppercase">Wed</p></div>
                       <p className="text-sm text-slate-600 leading-tight">Sankrantri (Vialto)</p>
                     </div>
                     <div className="flex gap-4 items-start">
                       <div className="text-center text-slate-400 w-8"><p className="text-lg font-bold text-slate-600 leading-none">26</p><p className="text-[10px] uppercase">Mon</p></div>
                       <p className="text-sm text-slate-600 leading-tight">Republic Day</p>
                     </div>
                   </div>
                 </div>
                 {['FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'].map(m => (
                   <div key={m} className="border border-slate-200 rounded p-4 min-h-[180px] flex flex-col bg-white shadow-sm">
                     <h4 className="text-sm font-bold text-slate-600 mb-auto">{m} 2026</h4>
                     <p className="text-sm text-slate-400 text-center m-auto">No Holidays</p>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {employeeTab === 'Regularization' && (
             <div>
                <div className="flex justify-center mb-8">
                  <div className="inline-flex bg-slate-100 rounded-md p-1">
                    <button onClick={() => setRegSubTab('Apply')} className={cn("px-8 py-1.5 text-sm rounded transition-colors", regSubTab === 'Apply' ? "bg-blue-500 text-white shadow" : "text-slate-500 hover:text-slate-700")}>Apply</button>
                    <button onClick={() => setRegSubTab('History')} className={cn("px-8 py-1.5 text-sm rounded transition-colors", regSubTab === 'History' ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700")}>History</button>
                  </div>
                </div>

                {regSubTab === 'Apply' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    <h3 className="font-bold text-slate-700 text-lg">Apply for Regularization</h3>
                    <div className="space-y-6">
                       <div>
                         <label className="block text-xs text-slate-600 mb-1">Date <span className="text-red-500">*</span></label>
                         <input type="date" value={newRegularization.date} onChange={(e) => setNewRegularization({...newRegularization, date: e.target.value})} className="w-1/2 p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400" />
                       </div>
                       
                       <div>
                         <label className="block text-xs text-slate-600 mb-1">Reason <span className="text-red-500">*</span></label>
                         <textarea value={newRegularization.reason} onChange={(e) => setNewRegularization({...newRegularization, reason: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-sm text-slate-600 outline-none focus:border-blue-400 h-24" placeholder="Reason for regularization..." />
                       </div>

                       <div className="pt-4 flex gap-4">
                         <Button onClick={handleApplyReg} className="bg-blue-500 hover:bg-blue-600 px-6" isLoading={isSubmitting}>Apply</Button>
                         <Button variant="outline">Cancel</Button>
                       </div>
                    </div>
                  </div>
                )}
                
                {regSubTab === 'History' && (
                  <div className="max-w-4xl mx-auto">
                    <table className="w-full bg-white border border-slate-200 rounded overflow-hidden">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-slate-500">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-slate-500">Reason</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-slate-500">Applied At</th>
                          <th className="px-6 py-3 text-right text-xs font-bold text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {regularizations.length === 0 ? (
                          <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No requests found</td></tr>
                        ) : regularizations.map(reg => (
                          <tr key={reg.id}>
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{formatDate(reg.date)}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{reg.reason}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{new Date(reg.applied_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right">{getStatusBadge(reg.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
             </div>
           )}

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isManagerOrAdmin ? 'Requests & Approvals' : 'My Leaves'}</h1>
          <p className="text-slate-500">Track balance and process time-off requests</p>
        </div>
        {isManagerOrAdmin && (
           <div className="inline-flex bg-slate-100 rounded-md p-1">
             <button onClick={() => setManagerTab('Leaves')} className={cn("px-6 py-1.5 text-sm rounded transition-colors", managerTab === 'Leaves' ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700")}>Leaves</button>
             <button onClick={() => setManagerTab('Regularizations')} className={cn("px-6 py-1.5 text-sm rounded transition-colors", managerTab === 'Regularizations' ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700")}>Regularizations</button>
           </div>
        )}
      </div>

      {managerTab === 'Leaves' ? (
      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Leave Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Leave Details</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Reason</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status/Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                 <tr><td colSpan={4} className="p-8 text-center"><div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" /></td></tr>
              ) : leaves.length === 0 ? (
                 <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No requests found</td></tr>
              ) : leaves.map((leave) => {
                const emp = employees.find(e => e.id === leave.employee_id) || { employee_name: profile?.employee_name, employee_id: profile?.employee_id };
                return (
                  <tr key={leave.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
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
                        <Badge variant="outline" className="text-[10px] py-0">{leave.type}</Badge>
                        <span className="text-xs font-bold text-slate-700">
                           {formatDate(leave.start_date)} to {formatDate(leave.end_date)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Submitted on {new Date(leave.applied_at).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 italic">"{leave.reason}"</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isManagerOrAdmin && leave.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(leave.id, 'Approved')}
                            className="text-emerald-600 hover:bg-emerald-50 h-9 w-9 p-0 rounded-xl"
                            title="Approve"
                            isLoading={loadingActionId === leave.id}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(leave.id, 'Rejected')}
                            className="text-rose-600 hover:bg-rose-50 h-9 w-9 p-0 rounded-xl"
                            title="Reject"
                            isLoading={loadingActionId === leave.id}
                          >
                            <XCircle className="w-5 h-5" />
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
      ) : (
      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Regularization Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Reason</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status/Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                 <tr><td colSpan={4} className="p-8 text-center"><div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" /></td></tr>
              ) : regularizations.length === 0 ? (
                 <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No requests found</td></tr>
              ) : regularizations.map((reg) => {
                const emp = employees.find(e => e.id === reg.employee_id) || { employee_name: profile?.employee_name, employee_id: profile?.employee_id };
                return (
                  <tr key={reg.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                           {emp?.employee_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{emp?.employee_name || 'Unknown'}</p>
                          <p className="text-[10px] text-slate-400">{emp?.employee_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-700">{formatDate(reg.date)}</span>
                      <p className="text-[10px] text-slate-400">Applied {new Date(reg.applied_at).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 italic">"{reg.reason}"</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isManagerOrAdmin && reg.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRegStatusUpdate(reg.id, 'Approved')}
                            className="text-emerald-600 hover:bg-emerald-50 h-9 w-9 p-0 rounded-xl"
                            title="Approve"
                            isLoading={loadingActionId === reg.id}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRegStatusUpdate(reg.id, 'Rejected')}
                            className="text-rose-600 hover:bg-rose-50 h-9 w-9 p-0 rounded-xl"
                            title="Reject"
                            isLoading={loadingActionId === reg.id}
                          >
                            <XCircle className="w-5 h-5" />
                          </Button>
                        </div>
                      ) : (
                        getStatusBadge(reg.status)
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

      {/* Apply Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Apply for Leave">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Leave Category</label>
              <div className="grid grid-cols-3 gap-3">
                {['Casual', 'Sick', 'Paid'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewLeave({...newLeave, type: type as LeaveType})}
                    className={cn(
                      "py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all",
                      newLeave.type === type 
                        ? "border-primary-500 bg-primary-50 text-primary-700" 
                        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="date" 
                    className="pl-10"
                    value={newLeave.start_date} 
                    onChange={(e) => setNewLeave({...newLeave, start_date: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="date" 
                    className="pl-10"
                    value={newLeave.end_date} 
                    onChange={(e) => setNewLeave({...newLeave, end_date: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div>
               <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Reason</label>
               <div className="relative">
                 <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                 <textarea 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-primary-500 outline-none" 
                  placeholder="Reason for your leave..."
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                 />
               </div>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <Button variant="outline" className="flex-1 py-3" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button onClick={handleApply} className="flex-1 py-3 shadow-lg shadow-primary-100" isLoading={isSubmitting}>Submit Application</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
