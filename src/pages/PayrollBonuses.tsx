import React, { useState } from 'react';
import { 
  Search,
  Filter,
  Gift,
  CheckCircle2,
  DollarSign,
  Plus,
  Edit2,
  CalendarDays
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

const MOCK_BONUSES = [
  { id: 'BON-001', empId: 'EMP001', name: 'Akhil', type: 'Performance Bonus', amount: 1500, date: '2026-07-28', status: 'Approved' },
  { id: 'BON-002', empId: 'EMP002', name: 'Jane Smith', type: 'Retention Bonus', amount: 3000, date: '2026-07-28', status: 'Pending' },
  { id: 'BON-003', empId: 'EMP003', name: 'Alice Johnson', type: 'Referral Bonus', amount: 500, date: '2026-07-28', status: 'Pending' },
  { id: 'BON-004', empId: 'EMP004', name: 'Robert Brown', type: 'Spot Award', amount: 200, date: '2026-08-15', status: 'Scheduled' },
];

const BONUS_TYPES = [
  'Performance Bonus',
  'Annual Bonus',
  'Festival Bonus',
  'Referral Bonus',
  'Retention Bonus',
  'Spot Award'
];

export const PayrollBonuses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bonuses, setBonuses] = useState(MOCK_BONUSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'schedule'>('add');
  const [selectedBonus, setSelectedBonus] = useState<any>(null);

  const filteredData = bonuses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalApproved = bonuses.filter(b => b.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingCount = bonuses.filter(b => b.status === 'Pending').length;

  const handleAction = (id: string) => {
    setBonuses(prev => 
      prev.map(b => b.id === id ? { ...b, status: 'Approved' } : b)
    );
    toast.success(`Bonus approved successfully.`);
  };

  const openModal = (mode: 'add' | 'edit' | 'schedule', bonus: any = null) => {
    setModalMode(mode);
    setSelectedBonus(bonus);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') toast.success('New bonus added successfully.');
    if (modalMode === 'edit') toast.success('Bonus updated successfully.');
    if (modalMode === 'schedule') toast.success('Bonus scheduled successfully.');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bonuses & Incentives</h1>
          <p className="text-slate-500">Manage variable pay, spot awards, and annual incentives.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-slate-300 text-slate-700" onClick={() => openModal('schedule')}>
            <CalendarDays className="w-4 h-4" /> Schedule Bonus
          </Button>
          <Button variant="primary" className="gap-2" onClick={() => openModal('add')}>
            <Plus className="w-4 h-4" /> Add Bonus
          </Button>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total Bonuses</p>
            <p className="text-2xl font-black text-slate-900">{bonuses.length}</p>
          </div>
          <Gift className="w-8 h-8 text-blue-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Approved Payout</p>
            <p className="text-2xl font-black text-emerald-600">${totalApproved.toLocaleString()}</p>
          </div>
          <DollarSign className="w-8 h-8 text-emerald-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Pending Approvals</p>
            <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
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
              placeholder="Search employee or type..." 
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
                <th className="p-4 font-semibold">Bonus ID</th>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Bonus Type</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-center">Payout Date</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-500">{b.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {b.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{b.name}</p>
                        <p className="text-xs text-slate-500">{b.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">{b.type}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-emerald-600 text-right">${b.amount.toLocaleString()}</td>
                  <td className="p-4 text-sm text-slate-600 text-center">{b.date}</td>
                  <td className="p-4 text-center">
                    <Badge variant={
                      b.status === 'Approved' ? 'success' : 
                      b.status === 'Scheduled' ? 'primary' : 'warning'
                    } className="text-xs">
                      {b.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    {b.status === 'Pending' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1 text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                        onClick={() => handleAction(b.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-slate-500 hover:text-primary-600"
                      onClick={() => openModal('edit', b)}
                      title="Edit Bonus"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
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
          modalMode === 'add' ? 'Add New Bonus' :
          modalMode === 'edit' ? 'Edit Bonus Details' : 'Schedule Future Bonus'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
            <select 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              defaultValue={selectedBonus ? selectedBonus.name : ""}
            >
              <option value="">Select Employee...</option>
              <option value="Akhil">Akhil (EMP001)</option>
              <option value="Jane Smith">Jane Smith (EMP002)</option>
              <option value="Alice Johnson">Alice Johnson (EMP003)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bonus Category</label>
            <select 
              required 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              defaultValue={selectedBonus ? selectedBonus.type : ""}
            >
              <option value="">Select Type...</option>
              {BONUS_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
              <input 
                required 
                type="number" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                defaultValue={selectedBonus ? selectedBonus.amount : ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payout Date</label>
              <input 
                required 
                type="date" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                defaultValue={selectedBonus ? selectedBonus.date : modalMode === 'schedule' ? "" : new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (Optional)</label>
            <textarea 
              rows={2} 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none" 
              placeholder="E.g., Exceptional performance in Q2..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              {modalMode === 'add' ? 'Issue Bonus' : modalMode === 'edit' ? 'Save Changes' : 'Schedule Payout'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
