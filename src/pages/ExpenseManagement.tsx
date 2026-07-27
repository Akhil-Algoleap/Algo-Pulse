import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  X, 
  MessageSquare,
  Paperclip,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

type Expense = {
  id: string;
  employeeName: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Needs Info';
};

const EXPENSE_CATEGORIES = [
  'Internet', 'Fuel', 'Food', 'Medical', 'Office Supplies', 'Client Entertainment', 'Parking', 'Training'
];

// Shared mock data state for demo purposes
let globalExpenses: Expense[] = [
  { id: '1', employeeName: 'Akhil', category: 'Internet', amount: 40, date: '2026-07-20', description: 'Monthly home internet bill', status: 'Pending' },
  { id: '2', employeeName: 'Sarah', category: 'Client Entertainment', amount: 150, date: '2026-07-22', description: 'Lunch with Alpha Corp team', status: 'Pending' },
  { id: '3', employeeName: 'John', category: 'Fuel', amount: 25, date: '2026-07-15', description: 'Travel to client site', status: 'Approved' },
  { id: '4', employeeName: 'Rahul', category: 'Training', amount: 200, date: '2026-07-10', description: 'AWS Certification Course', status: 'Needs Info' },
];

export const ExpenseManagement: React.FC = () => {
  const { profile } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>(globalExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  
  // For Employee Submission
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'Internet', amount: '', date: '', description: '' });

  // For Finance Actions
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Needs Info' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const isFinance = profile?.role === 'Finance';

  // Filter based on role
  const displayExpenses = expenses.filter(e => {
    const matchesSearch = e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If not Finance, only show their own (Mocking 'Akhil' as current user for demo if not finance)
    const isOwner = isFinance ? true : e.employeeName === (profile?.employeeName || 'Akhil');
    return matchesSearch && isOwner;
  });

  const getStatusBadge = (status: Expense['status']) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Approved':
        return <Badge variant="success">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'Needs Info':
        return <Badge variant="default" className="bg-blue-100 text-blue-700 border-blue-200">Needs Info</Badge>;
    }
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.date) return;
    
    const expense: Expense = {
      id: Math.random().toString(),
      employeeName: profile?.employeeName || 'Akhil',
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      description: newExpense.description,
      status: 'Pending'
    };
    
    const updated = [expense, ...expenses];
    setExpenses(updated);
    globalExpenses = updated;
    
    setIsSubmitModalOpen(false);
    setNewExpense({ category: 'Internet', amount: '', date: '', description: '' });
    toast.success('Expense claim submitted successfully!');
  };

  const openActionModal = (expense: Expense, type: 'Approve' | 'Reject' | 'Needs Info') => {
    setSelectedExpense(expense);
    setActionType(type);
    setActionReason('');
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedExpense || !actionType) return;
    
    const updated = expenses.map(e => {
      if (e.id === selectedExpense.id) {
        return { ...e, status: actionType };
      }
      return e;
    });
    
    setExpenses(updated);
    globalExpenses = updated;
    
    setIsActionModalOpen(false);
    toast.success(`Expense ${actionType.toLowerCase()} successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isFinance ? 'Expense Management' : 'My Expenses'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isFinance ? 'Review and approve company expenses submitted by employees.' : 'Submit and track your company expenses for reimbursement.'}
          </p>
        </div>
        {!isFinance && (
          <Button onClick={() => setIsSubmitModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Submit Expense
          </Button>
        )}
      </div>

      <Card className="bg-white border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder={isFinance ? "Search employee or category..." : "Search category..."}
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
                {isFinance && <th className="px-6 py-4 font-medium">Employee</th>}
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {isFinance && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </td>
                  {isFinance && (
                    <td className="px-6 py-4 font-medium text-slate-900">{expense.employeeName}</td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Receipt className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{expense.category}</span>
                        <span className="text-xs text-slate-500 truncate max-w-[200px]" title={expense.description}>{expense.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(expense.status)}
                  </td>
                  {isFinance && (
                    <td className="px-6 py-4">
                      {expense.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openActionModal(expense, 'Approve')}
                            title="Approve"
                            className="text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openActionModal(expense, 'Reject')}
                            title="Reject"
                            className="text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openActionModal(expense, 'Needs Info')}
                            title="Request Details"
                            className="text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-right pr-4 text-slate-400">-</div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              
              {displayExpenses.length === 0 && (
                <tr>
                  <td colSpan={isFinance ? 6 : 5} className="px-6 py-12 text-center text-slate-500">
                    <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No expenses found</p>
                    <p>Try adjusting your search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Employee Submit Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit New Expense"
      >
        <form onSubmit={handleSubmitExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              required
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
            >
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
              <div className="relative">
                <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                type="date"
                required
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description / Business Purpose</label>
            <textarea 
              required
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              rows={3}
              placeholder="Provide details about this expense..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Receipt Attachment</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-900">Click to upload receipt</p>
              <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 5MB</p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Claim</Button>
          </div>
        </form>
      </Modal>

      {/* Finance Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`${actionType} Expense`}
      >
        {selectedExpense && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{selectedExpense.employeeName}</p>
                <p className="text-sm text-slate-500">{selectedExpense.category}</p>
              </div>
              <p className="text-xl font-black text-slate-900">${selectedExpense.amount.toFixed(2)}</p>
            </div>

            {actionType !== 'Approve' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {actionType === 'Needs Info' ? 'What information is missing?' : 'Reason for rejection'}
                </label>
                <textarea 
                  required
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  rows={3}
                  placeholder={`Enter details...`}
                />
              </div>
            )}

            {actionType === 'Approve' && (
              <p className="text-slate-600">Are you sure you want to approve this expense for ${selectedExpense.amount.toFixed(2)}?</p>
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
