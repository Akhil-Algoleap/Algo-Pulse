import React, { useState } from 'react';
import { 
  PieChart, 
  Search, 
  Plus, 
  ArrowUp,
  Snowflake,
  TrendingUp
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

type DepartmentBudget = {
  id: string;
  department: string;
  totalBudget: number;
  used: number;
  status: 'Active' | 'Frozen';
};

const INITIAL_BUDGETS: DepartmentBudget[] = [
  { id: '1', department: 'Engineering', totalBudget: 500000, used: 340000, status: 'Active' },
  { id: '2', department: 'HR', totalBudget: 120000, used: 70000, status: 'Active' },
  { id: '3', department: 'Marketing', totalBudget: 250000, used: 245000, status: 'Active' },
  { id: '4', department: 'Sales', totalBudget: 300000, used: 150000, status: 'Active' },
  { id: '5', department: 'Operations', totalBudget: 150000, used: 150000, status: 'Frozen' },
];

export const BudgetManagement: React.FC = () => {
  const [budgets, setBudgets] = useState<DepartmentBudget[]>(INITIAL_BUDGETS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<DepartmentBudget | null>(null);
  
  // Form State
  const [newBudget, setNewBudget] = useState({ department: '', amount: '' });
  const [increaseAmount, setIncreaseAmount] = useState('');

  const filteredBudgets = budgets.filter(b => 
    b.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.department || !newBudget.amount) return;
    
    const budget: DepartmentBudget = {
      id: Math.random().toString(),
      department: newBudget.department,
      totalBudget: Number(newBudget.amount),
      used: 0,
      status: 'Active'
    };
    
    setBudgets([...budgets, budget]);
    setIsAllocateModalOpen(false);
    setNewBudget({ department: '', amount: '' });
    toast.success('Budget allocated successfully');
  };

  const handleIncrease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudget || !increaseAmount) return;
    
    setBudgets(budgets.map(b => {
      if (b.id === selectedBudget.id) {
        return { ...b, totalBudget: b.totalBudget + Number(increaseAmount) };
      }
      return b;
    });
    
    setIsIncreaseModalOpen(false);
    setIncreaseAmount('');
    toast.success('Budget increased successfully');
  };

  const toggleFreeze = (id: string, currentStatus: string) => {
    setBudgets(budgets.map(b => {
      if (b.id === id) {
        return { ...b, status: currentStatus === 'Active' ? 'Frozen' : 'Active' };
      }
      return b;
    });
    toast.success(`Budget ${currentStatus === 'Active' ? 'frozen' : 'unfrozen'} successfully`);
  };

  const handleForecast = () => {
    toast('Forecast report generated and sent to your email.', { icon: '📊' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Budget Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage annual department budgets and forecasts.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleForecast} className="gap-2">
                <TrendingUp className="w-4 h-4" /> Budget Forecast
            </Button>
            <Button onClick={() => setIsAllocateModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" /> Allocate Budget
            </Button>
        </div>
      </div>

      <Card className="bg-white border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium text-right">Budget</th>
                <th className="px-6 py-4 font-medium text-right">Used</th>
                <th className="px-6 py-4 font-medium text-right">Remaining</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBudgets.map((budget) => {
                const remaining = budget.totalBudget - budget.used;
                const percentUsed = (budget.used / budget.totalBudget) * 100;
                
                return (
                  <tr key={budget.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{budget.department}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(budget.totalBudget)}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">{formatCurrency(budget.used)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-bold ${remaining < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                          {formatCurrency(remaining)}
                        </span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden flex">
                          <div 
                            className={`h-full ${percentUsed > 90 ? 'bg-rose-500' : percentUsed > 75 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(percentUsed, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {budget.status === 'Active' 
                        ? <Badge variant="success">Active</Badge> 
                        : <Badge variant="default" className="bg-slate-100 text-slate-600">Frozen</Badge>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setSelectedBudget(budget); setIsIncreaseModalOpen(true); }}
                          title="Increase Budget"
                          className="text-slate-400 hover:text-blue-600"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleFreeze(budget.id, budget.status)}
                          title={budget.status === 'Active' ? 'Freeze Budget' : 'Unfreeze Budget'}
                          className={`text-slate-400 ${budget.status === 'Active' ? 'hover:text-amber-600' : 'hover:text-emerald-600'}`}
                        >
                          <Snowflake className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredBudgets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <PieChart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No budgets found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Allocate Modal */}
      <Modal isOpen={isAllocateModalOpen} onClose={() => setIsAllocateModalOpen(false)} title="Allocate New Budget">
        <form onSubmit={handleAllocate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <input 
              type="text" required
              value={newBudget.department}
              onChange={(e) => setNewBudget({...newBudget, department: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g. Design"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Budget Amount ($)</label>
            <input 
              type="number" required
              value={newBudget.amount}
              onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="100000"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAllocateModalOpen(false)} className="mr-2">Cancel</Button>
            <Button type="submit" variant="primary">Allocate</Button>
          </div>
        </form>
      </Modal>

      {/* Increase Budget Modal */}
      <Modal isOpen={isIncreaseModalOpen} onClose={() => setIsIncreaseModalOpen(false)} title="Increase Department Budget">
        {selectedBudget && (
          <form onSubmit={handleIncrease} className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{selectedBudget.department}</p>
                <p className="text-sm text-slate-500">Current Budget: {formatCurrency(selectedBudget.totalBudget)}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Additional Amount ($)</label>
              <input 
                type="number" required
                value={increaseAmount}
                onChange={(e) => setIncreaseAmount(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="50000"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsIncreaseModalOpen(false)} className="mr-2">Cancel</Button>
              <Button type="submit" variant="primary">Increase Budget</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
