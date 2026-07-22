import React, { useEffect, useState } from 'react';
import { 
  XCircle, 
  Plus,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Badge, Card, Input, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { LeaveRequest, LeaveType, Employee } from '../types';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

export const Leave: React.FC = () => {
  const { profile } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  
  // Form State
  const [newLeave, setNewLeave] = useState({
    type: 'Casual' as LeaveType,
    start_date: '',
    end_date: '',
    reason: ''
  });

  const isManagerOrAdmin = profile?.role === 'Admin' || profile?.role === 'Manager';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leaveRes, empRes] = await Promise.all([
        apiService.getLeaves(),
        apiService.getEmployees()
      ]);
      
      let fetchedLeaves = leaveRes.data as LeaveRequest[];
      if (profile?.role === 'Employee') {
        fetchedLeaves = fetchedLeaves.filter(l => l.employee_id === profile.id);
      }
      // If Manager, filter by team (reporting_manager_id). Simplified here assuming data returns relevant leaves for manager.

      setLeaves(fetchedLeaves);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100">Approved</Badge>;
      case 'Rejected': return <Badge variant="danger" className="bg-rose-50 text-rose-600 border-rose-100">Rejected</Badge>;
      case 'Pending': return <Badge variant="warning" className="bg-amber-50 text-amber-600 border-amber-100">Pending</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isManagerOrAdmin ? 'Leave Requests' : 'My Leaves'}</h1>
          <p className="text-slate-500">Track balance and process time-off requests</p>
        </div>
        {!isManagerOrAdmin && (
          <Button onClick={() => setIsApplyModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-primary-100">
            <Plus className="w-4 h-4" />
            Apply Leave
          </Button>
        )}
      </div>

      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Request History</h3>
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
