import React, { useState } from 'react';
import { 
  Search,
  Filter,
  CheckCircle2,
  Banknote,
  Plus,
  CreditCard,
  CalendarDays,
  HandCoins
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

const MOCK_LOANS = [
  { id: 'LN-001', empId: 'EMP001', name: 'Akhil', type: 'Loan', principal: 10000, emi: 1000, remaining: 5000, status: 'Active', nextEmiDate: '2026-08-01' },
  { id: 'ADV-001', empId: 'EMP002', name: 'Jane Smith', type: 'Advance Salary', principal: 5000, emi: 5000, remaining: 0, status: 'Settled', nextEmiDate: '-' },
  { id: 'LN-003', empId: 'EMP003', name: 'Alice Johnson', type: 'Loan', principal: 15000, emi: 1500, remaining: 15000, status: 'Pending Approval', nextEmiDate: '-' },
];

export const PayrollLoans: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loans, setLoans] = useState(MOCK_LOANS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new_loan' | 'advance' | 'settlement'>('new_loan');
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const filteredData = loans.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOutstanding = loans.filter(l => l.status === 'Active').reduce((acc, curr) => acc + curr.remaining, 0);

  const handleAction = (id: string, action: 'Active' | 'Rejected') => {
    setLoans(prev => 
      prev.map(l => l.id === id ? { ...l, status: action, nextEmiDate: action === 'Active' ? '2026-08-01' : '-' } : l)
    );
    toast.success(`Request ${action === 'Active' ? 'approved' : 'rejected'} successfully.`);
  };

  const openModal = (mode: 'new_loan' | 'advance' | 'settlement', loan: any = null) => {
    setModalMode(mode);
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'new_loan') toast.success('New loan recorded successfully.');
    if (modalMode === 'advance') toast.success('Salary advance recorded successfully.');
    if (modalMode === 'settlement') toast.success('Loan settlement processed successfully.');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Loans & Advances</h1>
          <p className="text-slate-500">Track employee loans, salary advances, EMI schedules, and settlements.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2 border-slate-300 text-slate-700" onClick={() => openModal('settlement')}>
            <HandCoins className="w-4 h-4" /> Settlement
          </Button>
          <Button variant="outline" className="gap-2 border-slate-300 text-slate-700" onClick={() => openModal('advance')}>
            <CreditCard className="w-4 h-4" /> Advance Salary
          </Button>
          <Button variant="primary" className="gap-2" onClick={() => openModal('new_loan')}>
            <Plus className="w-4 h-4" /> New Loan
          </Button>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Active Loans</p>
            <p className="text-2xl font-black text-slate-900">{loans.filter(l => l.status === 'Active').length}</p>
          </div>
          <CreditCard className="w-8 h-8 text-blue-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total Outstanding Balance</p>
            <p className="text-2xl font-black text-rose-600">${totalOutstanding.toLocaleString()}</p>
          </div>
          <Banknote className="w-8 h-8 text-rose-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Pending Approvals</p>
            <p className="text-2xl font-black text-amber-600">{loans.filter(l => l.status === 'Pending Approval').length}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-amber-300" />
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button variant="outline" className="gap-2 w-full sm:w-auto shrink-0">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold text-right">Principal</th>
                <th className="p-4 font-semibold text-right">Monthly EMI</th>
                <th className="p-4 font-semibold text-right">Balance</th>
                <th className="p-4 font-semibold text-center">Next EMI Date</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-500">{l.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {l.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{l.name}</p>
                        <p className="text-xs text-slate-500">{l.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">{l.type}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-700 text-right">${l.principal.toLocaleString()}</td>
                  <td className="p-4 text-sm font-medium text-amber-600 text-right">${l.emi.toLocaleString()}</td>
                  <td className="p-4 text-sm font-bold text-rose-600 text-right">${l.remaining.toLocaleString()}</td>
                  <td className="p-4 text-sm text-slate-600 text-center">{l.nextEmiDate}</td>
                  <td className="p-4 text-center">
                    <Badge variant={
                      l.status === 'Active' ? 'default' :
                      l.status === 'Settled' ? 'success' : 'warning'
                    } className="text-xs">
                      {l.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    {l.status === 'Pending Approval' ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                          onClick={() => handleAction(l.id, 'Active')}
                        >
                          Approve
                        </Button>
                      </div>
                    ) : l.status === 'Active' ? (
                       <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1 text-slate-600 hover:text-primary-600"
                        onClick={() => openModal('settlement', l)}
                        title="EMI Schedule & Settlement"
                      >
                        <CalendarDays className="w-4 h-4" /> Schedule
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No Actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'new_loan' ? 'Record New Loan' :
          modalMode === 'advance' ? 'Record Advance Salary' :
          'Loan Settlement / Manual EMI'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {modalMode === 'settlement' ? 'Select Loan Account' : 'Employee'}
            </label>
            <select 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              defaultValue={selectedLoan ? selectedLoan.id : ""}
            >
              <option value="">Select...</option>
              {modalMode === 'settlement' ? (
                 loans.filter(l => l.status === 'Active').map(l => (
                  <option key={l.id} value={l.id}>{l.name} - {l.id} (Balance: ${l.remaining})</option>
                 ))
              ) : (
                <>
                  <option value="EMP001">Akhil (EMP001)</option>
                  <option value="EMP002">Jane Smith (EMP002)</option>
                </>
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {modalMode === 'settlement' ? 'Settlement Amount ($)' : 'Principal Amount ($)'}
            </label>
            <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          {modalMode === 'new_loan' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly EMI ($)</label>
                <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input required type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
          )}

          {modalMode === 'advance' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deduction Month</label>
              <input required type="month" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
              <p className="text-xs text-slate-500 mt-1">Advances are typically deducted fully in the next payroll cycle.</p>
            </div>
          )}

          {modalMode === 'settlement' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
              <select required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
