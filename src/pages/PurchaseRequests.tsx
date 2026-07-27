import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  X, 
  Box,
  Monitor,
  Printer,
  CreditCard,
  Building2,
  PackageCheck
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

type PurchaseRequest = {
  id: string;
  requestor: string;
  department: string;
  item: string;
  category: 'Hardware' | 'Software' | 'Furniture' | 'Office Supplies' | 'Other';
  quantity: number;
  amount: number;
  status: 'Manager Pending' | 'Finance Pending' | 'Purchasing' | 'IT Receiving' | 'Completed' | 'Rejected';
  date: string;
  justification: string;
};

const CATEGORY_ICONS = {
  'Hardware': Monitor,
  'Software': Box,
  'Furniture': Building2,
  'Office Supplies': Printer,
  'Other': ShoppingCart
};

// Shared mock data
let globalPurchaseRequests: PurchaseRequest[] = [
  { 
    id: '1', 
    requestor: 'Akhil',
    department: 'IT',
    item: '10 Dell Laptops', 
    category: 'Hardware',
    quantity: 10,
    amount: 12000, 
    date: '2026-07-22', 
    status: 'Finance Pending',
    justification: 'New batch of hires starting next month.'
  },
  { 
    id: '2', 
    requestor: 'Sarah',
    department: 'Marketing',
    item: 'Adobe Creative Cloud Licenses', 
    category: 'Software',
    quantity: 5,
    amount: 3000, 
    date: '2026-07-20', 
    status: 'Manager Pending',
    justification: 'Required for the new design team.'
  },
  { 
    id: '3', 
    requestor: 'John',
    department: 'Operations',
    item: 'Ergonomic Office Chairs', 
    category: 'Furniture',
    quantity: 20,
    amount: 5000, 
    date: '2026-07-15', 
    status: 'IT Receiving',
    justification: 'Replacing broken chairs in the main hall.'
  },
];

export const PurchaseRequests: React.FC = () => {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<PurchaseRequest[]>(globalPurchaseRequests);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Submission
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newReq, setNewReq] = useState({ item: '', category: 'Hardware', quantity: 1, amount: '', justification: '' });

  // Action Modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<PurchaseRequest | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Purchase' | 'Receive' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const isFinance = profile?.role === 'Finance';
  const isManager = profile?.role === 'Project Manager' || profile?.role === 'Reporting Manager' || profile?.role === 'Manager';
  const isIT = profile?.role === 'IT Admin';
  const isEmployee = !isFinance && !isManager && !isIT;

  // Filter based on role
  const displayRequests = requests.filter(r => {
    const matchesSearch = r.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (isFinance) return matchesSearch;
    if (isManager) return matchesSearch; // In real app, filter by reporting team
    if (isIT) return matchesSearch && (r.status === 'IT Receiving' || r.status === 'Completed');
    return matchesSearch && r.requestor === (profile?.employee_name || 'Akhil');
  });

  const getStatusBadge = (status: PurchaseRequest['status']) => {
    switch (status) {
      case 'Manager Pending': return <Badge variant="warning">Manager Pending</Badge>;
      case 'Finance Pending': return <Badge variant="warning" className="bg-orange-100 text-orange-700 border-orange-200">Finance Pending</Badge>;
      case 'Purchasing': return <Badge variant="default" className="bg-blue-100 text-blue-700">Procurement</Badge>;
      case 'IT Receiving': return <Badge variant="warning" className="bg-purple-100 text-purple-700">IT Receiving</Badge>;
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'Rejected': return <Badge variant="danger">Rejected</Badge>;
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReq.item || !newReq.amount || !newReq.justification) return;
    
    const req: PurchaseRequest = {
      id: Math.random().toString(),
      requestor: profile?.employee_name || 'Akhil',
      department: 'Engineering', // Mock department
      item: newReq.item,
      category: newReq.category as any,
      quantity: Number(newReq.quantity),
      amount: parseFloat(newReq.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Manager Pending',
      justification: newReq.justification
    };
    
    const updated = [req, ...requests];
    setRequests(updated as PurchaseRequest[]);
    globalPurchaseRequests = updated as PurchaseRequest[];
    
    setIsSubmitModalOpen(false);
    setNewReq({ item: '', category: 'Hardware', quantity: 1, amount: '', justification: '' });
    toast.success('Purchase request submitted successfully!');
  };

  const openActionModal = (req: PurchaseRequest, type: 'Approve' | 'Reject' | 'Purchase' | 'Receive') => {
    setSelectedReq(req);
    setActionType(type);
    setActionReason('');
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedReq || !actionType) return;
    
    const updated = requests.map(r => {
      if (r.id === selectedReq.id) {
        if (actionType === 'Reject') return { ...r, status: 'Rejected' };
        
        if (actionType === 'Approve') {
          if (isManager && r.status === 'Manager Pending') return { ...r, status: 'Finance Pending' };
          if (isFinance && r.status === 'Finance Pending') return { ...r, status: 'Purchasing' };
        }
        
        if (actionType === 'Purchase' && isFinance) {
          return { ...r, status: 'IT Receiving' }; // Finance has ordered it, now IT waits to receive
        }
        
        if (actionType === 'Receive' && isIT) {
          return { ...r, status: 'Completed' }; // IT logs the asset into inventory
        }
      }
      return r;
    });
    
    setRequests(updated as PurchaseRequest[]);
    globalPurchaseRequests = updated as PurchaseRequest[];
    
    setIsActionModalOpen(false);
    toast.success(`Request updated successfully`);
  };

  const canActionReq = (req: PurchaseRequest) => {
    if (isManager && req.status === 'Manager Pending') return true;
    if (isFinance && (req.status === 'Finance Pending' || req.status === 'Purchasing')) return true;
    if (isIT && req.status === 'IT Receiving') return true;
    return false;
  };

  const getActionButtons = (req: PurchaseRequest) => {
    if (!canActionReq(req)) return null;

    if (isManager && req.status === 'Manager Pending') {
      return (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => openActionModal(req, 'Approve')} className="text-emerald-600 bg-emerald-50"><Check className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => openActionModal(req, 'Reject')} className="text-rose-600 bg-rose-50"><X className="w-4 h-4" /></Button>
        </div>
      );
    }

    if (isFinance && req.status === 'Finance Pending') {
      return (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => openActionModal(req, 'Approve')} title="Approve Budget" className="text-emerald-600 bg-emerald-50"><Check className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => openActionModal(req, 'Reject')} className="text-rose-600 bg-rose-50"><X className="w-4 h-4" /></Button>
        </div>
      );
    }

    if (isFinance && req.status === 'Purchasing') {
      return (
        <Button variant="primary" size="sm" onClick={() => openActionModal(req, 'Purchase')} className="gap-2 text-xs">
          <CreditCard className="w-3 h-3" /> Mark Ordered
        </Button>
      );
    }

    if (isIT && req.status === 'IT Receiving') {
      return (
        <Button variant="primary" size="sm" onClick={() => openActionModal(req, 'Receive')} className="gap-2 text-xs bg-purple-600 hover:bg-purple-700 text-white">
          <PackageCheck className="w-3 h-3" /> Receive Asset
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Purchase Requests</h1>
          <p className="text-sm text-slate-500 mt-1">
            Request, approve, and track department equipment and software purchases.
          </p>
        </div>
        {(isEmployee || isManager) && (
          <Button onClick={() => setIsSubmitModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Request
          </Button>
        )}
      </div>

      <Card className="bg-white border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search request or department..."
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
                <th className="px-6 py-4 font-medium">Request</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayRequests.map((req) => {
                const Icon = CATEGORY_ICONS[req.category] || ShoppingCart;
                
                return (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{req.item} (x{req.quantity})</span>
                          <span className="text-xs text-slate-500">Requested by {req.requestor} on {req.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{req.department}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ${req.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {getActionButtons(req)}
                    </td>
                  </tr>
                );
              })}
              
              {displayRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No purchase requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Submit Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Purchase Request"
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
            <input 
              type="text" required
              value={newReq.item}
              onChange={(e) => setNewReq({...newReq, item: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g. Dell XPS 15 Laptops"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                value={newReq.category}
                onChange={(e) => setNewReq({...newReq, category: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              >
                {Object.keys(CATEGORY_ICONS).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input 
                type="number" min="1" required
                value={newReq.quantity}
                onChange={(e) => setNewReq({...newReq, quantity: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Total Cost ($)</label>
            <input 
              type="number" step="0.01" required
              value={newReq.amount}
              onChange={(e) => setNewReq({...newReq, amount: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Justification</label>
            <textarea 
              required
              value={newReq.justification}
              onChange={(e) => setNewReq({...newReq, justification: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              rows={3}
              placeholder="Why is this purchase needed?"
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Request</Button>
          </div>
        </form>
      </Modal>

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`${actionType === 'Receive' ? 'Receive Asset' : actionType} Purchase Request`}
      >
        {selectedReq && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-slate-900">{selectedReq.item}</p>
                  <p className="text-sm text-slate-500">Qty: {selectedReq.quantity} | {selectedReq.department}</p>
                </div>
                <p className="text-xl font-black text-slate-900">${selectedReq.amount.toLocaleString()}</p>
              </div>
              <p className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-200 mt-2">
                "{selectedReq.justification}"
              </p>
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

            {actionType === 'Approve' && (
              <p className="text-slate-600">Approving this request will advance it to the next stage in the procurement workflow.</p>
            )}

            {actionType === 'Purchase' && (
              <p className="text-slate-600">Marking this as ordered will notify IT that they should expect to receive this asset soon.</p>
            )}

            {actionType === 'Receive' && (
              <p className="text-slate-600">Confirm you have physically received this item and added it to the asset inventory.</p>
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
