import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Badge, cn } from '../components/UI';
import { CheckCircle2, XCircle, FileText, Briefcase, Calendar, FileType, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const Approvals: React.FC = () => {
  const { profile } = useAuth();
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role) {
      fetchApprovals();
    }
  }, [profile?.role]);

  const fetchApprovals = async () => {
    try {
      const { data } = await apiService.getPendingApprovals(profile?.role || '');
      setApprovals(data);
    } catch (error) {
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'Approve' | 'Reject') => {
    setProcessingId(id);
    try {
      await apiService.processApproval(id, action);
      toast.success(`Request ${action.toLowerCase()}d successfully`);
      fetchApprovals(); // Refresh list
    } catch (error) {
      toast.error(`Failed to ${action.toLowerCase()} request`);
    } finally {
      setProcessingId(null);
    }
  };

  const renderPayload = (type: string, payload: any) => {
    if (type === 'Leave') {
      return (
        <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 font-semibold mb-1">Leave Type</p>
              <p className="text-slate-900">{payload.type}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold mb-1">Duration</p>
              <p className="text-slate-900">{payload.start_date} to {payload.end_date}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 font-semibold mb-1">Reason</p>
              <p className="text-slate-900 italic">"{payload.reason}"</p>
            </div>
          </div>
        </div>
      );
    }
    if (type === 'Resignation') {
      return (
        <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 font-semibold mb-1">Last Working Day</p>
              <p className="text-slate-900">{payload.last_working_day || 'Not specified'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 font-semibold mb-1">Reason for leaving</p>
              <p className="text-slate-900 italic">"{payload.reason}"</p>
            </div>
          </div>
        </div>
      );
    }
    return <pre className="bg-slate-50 p-4 rounded-xl text-xs">{JSON.stringify(payload, null, 2)}</pre>;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Leave': return <Calendar className="w-5 h-5 text-indigo-500" />;
      case 'Resignation': return <FileText className="w-5 h-5 text-rose-500" />;
      default: return <FileType className="w-5 h-5 text-primary-500" />;
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your inbox...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Approvals Inbox</h1>
        <p className="text-slate-500">Review and process requests awaiting your role's approval.</p>
      </div>
      
      <div className="space-y-4">
        {approvals.map((req) => (
          <Card key={req.id} className="p-0 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {getIcon(req.request_type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{req.request_type} Request</h3>
                      <Badge variant="warning">Pending Your Approval</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span>Employee ID: <span className="font-semibold text-slate-700">{req.employee_id}</span></span>
                      <span>•</span>
                      <span>Workflow: <span className="font-semibold text-slate-700">{req.workflow_name}</span></span>
                      <span>•</span>
                      <span>Step <span className="font-semibold text-slate-700">{req.current_step_order}</span></span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Applied on</p>
                  <p className="text-sm font-semibold text-slate-700">{new Date(req.applied_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                {renderPayload(req.request_type, req.payload)}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  onClick={() => handleAction(req.id, 'Reject')}
                  disabled={processingId === req.id}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => handleAction(req.id, 'Approve')}
                  disabled={processingId === req.id}
                  className="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve & Forward
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {approvals.length === 0 && (
          <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white shadow-sm">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">You're all caught up!</h3>
            <p className="text-slate-500 mt-2">There are no pending requests awaiting your approval at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};
