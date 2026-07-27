import React, { useState } from 'react';
import { 
  Banknote, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  X, 
  Send,
  Stethoscope,
  Wifi,
  Plane,
  GraduationCap,
  Fuel,
  Smartphone,
  Receipt
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

type Reimbursement = {
  id: string;
  employeeName: string;
  category: 'Medical' | 'Internet' | 'Travel' | 'Training' | 'Fuel' | 'Phone Bill' | 'Other';
  amount: number;
  date: string;
  description: string;
  status: 'Manager Pending' | 'Finance Pending' | 'Payment Released' | 'Rejected';
};

const CATEGORY_ICONS = {
  'Medical': Stethoscope,
  'Internet': Wifi,
  'Travel': Plane,
  'Training': GraduationCap,
  'Fuel': Fuel,
  'Phone Bill': Smartphone,
  'Other': Receipt
};

// Shared mock data
let globalReimbursements: Reimbursement[] = [
  { id: '1', employeeName: 'Akhil', category: 'Internet', amount: 40, date: '2026-07-20', description: 'Monthly home internet', status: 'Manager Pending' },
  { id: '2', employeeName: 'Sarah', category: 'Medical', amount: 150, date: '2026-07-18', description: 'Annual health checkup', status: 'Finance Pending' },
  { id: '3', employeeName: 'John', category: 'Fuel', amount: 65, date: '2026-07-15', description: 'Client site visit', status: 'Payment Released' },
];

export const Reimbursements: React.FC = () => {
  const { profile } = useAuth();
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(globalReimbursements);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Submission
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newReimb, setNewReimb] = useState({ category: 'Internet', amount: '', date: '', description: '' });

  // Action Modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedReimb, setSelectedReimb] = useState<Reimbursement | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Release' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const isFinance = profile?.role === 'Finance';
  const isManager = profile?.role === 'Project Manager' || profile?.role === 'Reporting Manager' || profile?.role === 'Manager';
  const isEmployee = !isFinance && !isManager;

  const displayReimbursements = reimbursements.filter(r => {
    const matchesSearch = r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (isFinance || isManager) return matchesSearch;
    return matchesSearch && r.employeeName === (profile?.employee_name || 'Akhil');
  });

  const getStatusBadge = (status: Reimbursement['status']) => {
    switch (status) {
      case 'Manager Pending': return <Badge variant="warning">Manager Pending</Badge>;
      case 'Finance Pending': return <Badge variant="warning" className="bg-orange-100 text-orange-700">Finance Pending</Badge>;
      case 'Payment Released': return <Badge variant="success">Released</Badge>;
      case 'Rejected': return <Badge variant="danger">Rejected</Badge>;
    }
  };

  const handleSubmitReimbursement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReimb.amount || !newReimb.date) return;
    
    const reimb: Reimbursement = {
      id: Math.random().toString(),
      employeeName: profile?.employee_name || 'Akhil',
      category: newReimb.category as any,
      amount: parseFloat(newReimb.amount),
      date: newReimb.date,
      description: newReimb.description,
      status: 'Manager Pending'
    };
    
    const updated = [reimb, ...reimbursements];
    setReimbursements(updated);
    globalReimbursements = updated as Reimbursement[];
    
    setIsSubmitModalOpen(false);
    setNewReimb({ category: 'Internet', amount: '', date: '', description: '' });
    toast.success('Reimbursement request submitted!');
  };

  const openActionModal = (reimb: Reimbursement, type: 'Approve' | 'Reject' | 'Release') => {
    setSelectedReimb(reimb);
    setActionType(type);
    setActionReason('');
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedReimb || !actionType) return;
    
    const updated = reimbursements.map(r => {
      if (r.id === selectedReimb.id) {
        if (actionType === 'Reject') return { ...r, status: 'Rejected' };
        
        if (actionType === 'Approve') {
          if (isManager && r.status === 'Manager Pending') return { ...r, status: 'Finance Pending' };
        }
        
        if (actionType === 'Release') {
          if (isFinance && r.status === 'Finance Pending') return { ...r, status: 'Payment Released' };
        }
      }
      return r;
    });
    
    setReimbursements(updated as Reimbursement[]);
    globalReimbursements = updated as Reimbursement[];
    
    setIsActionModalOpen(false);
    toast.success(`Request ${actionType.toLowerCase()}d successfully`);
  };

  const canActionReimb = (r: Reimbursement) => {
    if (isManager && r.status === 'Manager Pending') return true;
    if (isFinance && r.status === 'Finance Pending') return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isFinance ? 'Reimbursements' : isManager ? 'Team Reimbursements' : 'My Reimbursements'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit and track out-of-pocket expenses for reimbursement.
          </p>
        </div>
        {(isEmployee || isManager) && (
          <Button onClick={() => setIsSubmitModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Request Reimbursement
          </Button>
        )}
      </div>

      <Card className="bg-white border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search category or employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                {(isFinance || isManager) && <th className="px-6 py-4 font-medium">Employee</th>}
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {(isFinance || isManager) && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayReimbursements.map((reimb) => {
                const Icon = CATEGORY_ICONS[reimb.category] || Receipt;
                return (
                  <tr key={reimb.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{reimb.date}</td>
                    {(isFinance || isManager) && (
                      <td className="px-6 py-4 font-bold text-slate-900">{reimb.employeeName}</td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{reimb.category}</span>
                          <span className="text-xs text-slate-500 max-w-[150px] truncate" title={reimb.description}>{reimb.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ${reimb.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(reimb.status)}
                    </td>
                    {(isFinance || isManager) && (
                      <td className="px-6 py-4 text-right">
                        {canActionReimb(reimb) ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openActionModal(reimb, isFinance ? 'Release' : 'Approve')}
                              className="text-emerald-600 bg-emerald-50"
                            >
                              {isFinance ? <Send className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openActionModal(reimb, 'Reject')}
                              className="text-rose-600 bg-rose-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="pr-4 text-slate-400">-</div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              
              {displayReimbursements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Banknote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No reimbursements found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Submit Modal */}
      <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Request Reimbursement">
        <form onSubmit={handleSubmitReimbursement} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                value={newReimb.category}
                onChange={(e) => setNewReimb({...newReimb, category: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              >
                {Object.keys(CATEGORY_ICONS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
              <input 
                type="number" step="0.01" required
                value={newReimb.amount}
                onChange={(e) => setNewReimb({...newReimb, amount: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Expense</label>
            <input 
              type="date" required
              value={newReimb.date}
              onChange={(e) => setNewReimb({...newReimb, date: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              required
              value={newReimb.description}
              onChange={(e) => setNewReimb({...newReimb, description: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              rows={2}
            />
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Request</Button>
          </div>
        </form>
      </Modal>

      {/* Action Modal */}
      <Modal isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)} title={`${actionType === 'Release' ? 'Release Payment for' : actionType} Reimbursement`}>
        {selectedReimb && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{selectedReimb.employeeName}</p>
                <p className="text-sm text-slate-500">{selectedReimb.category}</p>
              </div>
              <p className="text-xl font-black text-slate-900">${selectedReimb.amount.toFixed(2)}</p>
            </div>

            {actionType === 'Reject' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for rejection</label>
                <textarea 
                  required
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  rows={2}
                />
              </div>
            )}
            
            {actionType === 'Release' && (
              <p className="text-slate-600">This will initiate the bank transfer to the employee for ${selectedReimb.amount.toFixed(2)}.</p>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 mt-6">
              <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                className={actionType === 'Reject' ? 'bg-rose-600 hover:bg-rose-700' : ''}
                onClick={handleConfirmAction}
              >
                Confirm {actionType}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
