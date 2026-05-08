import React, { useEffect, useState } from 'react';
import { 
  XCircle, 
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Badge, Card, Select, Input, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { LeaveRequest, LeaveType, Employee } from '../types';
import { formatDate } from '../utils/dateUtils';

export const Leave: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'my-leaves' | 'approvals'>('my-leaves');
  
  // Form State
  const [newLeave, setNewLeave] = useState({
    employee_id: '',
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
        apiService.getEmployees()
      ]);
      setLeaves(leaveRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async () => {
    if (!newLeave.start_date || !newLeave.end_date || !newLeave.reason) {
      return toast.error('Please fill all fields');
    }
    setIsSubmitting(true);
    try {
      await apiService.applyLeave(newLeave);
      toast.success('Leave applied successfully');
      setIsApplyModalOpen(false);
      setNewLeave({ employee_id: '', type: 'Casual', start_date: '', end_date: '', reason: '' });
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
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const pendingApprovals = leaves.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500">Track balance and process time-off requests</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 border-slate-200">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button onClick={() => setIsApplyModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-primary-100">
            <Plus className="w-4 h-4" />
            Add Leave Entry
          </Button>
        </div>
      </div>

      {/* Custom Tab Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('my-leaves')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === 'my-leaves' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('approvals')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === 'approvals' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Management
          {pendingApprovals.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-[10px] rounded-full">
              {pendingApprovals.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'my-leaves' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Personal Summary */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-primary-600 text-white border-none shadow-xl shadow-primary-100 overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <h3 className="text-sm font-black uppercase tracking-widest opacity-70 mb-6">Org Leave Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end pb-3 border-b border-white/10">
                   <div className="text-xs font-bold opacity-80">Total Pending</div>
                   <div className="text-2xl font-black">{pendingApprovals.length}</div>
                </div>
                <div className="flex justify-between items-end pb-3 border-b border-white/10">
                   <div className="text-xs font-bold opacity-80">Approved Today</div>
                   <div className="text-2xl font-black">04</div>
                </div>
                <div className="flex justify-between items-end">
                   <div className="text-xs font-bold opacity-80">Active Leaves</div>
                   <div className="text-2xl font-black">12</div>
                </div>
              </div>
            </Card>

            <Card className="border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-4 h-4" /></div>
                  <h4 className="text-sm font-bold text-slate-800">New Requests</h4>
               </div>
               <p className="text-2xl font-black text-slate-900">{pendingApprovals.length}</p>
               <p className="text-xs text-slate-400 mt-1">Awaiting your review</p>
            </Card>
          </div>

          {/* Request List */}
          <Card className="lg:col-span-3 border-none shadow-sm overflow-hidden p-0">
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                     <tr><td colSpan={4} className="p-8 text-center"><div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" /></td></tr>
                  ) : leaves.length === 0 ? (
                     <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No data available</td></tr>
                  ) : leaves.slice(0, 10).map((leave) => {
                    const emp = employees.find(e => e.id === leave.employee_id);
                    return (
                      <tr key={leave.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                              {emp?.employee_name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{emp?.employee_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700">{leave.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-700">{formatDate(leave.start_date)} - {formatDate(leave.end_date)}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {getStatusBadge(leave.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* Management View - Same as Approvals but renamed */
        <Card className="border-none shadow-sm overflow-hidden p-0">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Manage All Requests</h3>
            <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-100">
               {pendingApprovals.length} Pending
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Leave Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Reason</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leaves.filter(l => l.status === 'Pending').length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">All requests processed!</td></tr>
                ) : leaves.filter(l => l.status === 'Pending').map((leave) => {
                  const emp = employees.find(e => e.id === leave.employee_id);
                  return (
                    <tr key={leave.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                             {emp?.employee_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{emp?.employee_name}</p>
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
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Record Leave Entry">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Employee</label>
              <Select 
                value={newLeave.employee_id} 
                onChange={(e) => setNewLeave({...newLeave, employee_id: e.target.value})}
              >
                <option value="">Choose Employee...</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.employee_name} ({e.employee_id})</option>
                ))}
              </Select>
            </div>

            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
               <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Detailed Reason</label>
               <div className="relative">
                 <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                 <textarea 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-primary-500 outline-none" 
                  placeholder="Tell us why you need this time off..."
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
