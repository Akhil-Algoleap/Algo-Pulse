import React, { useEffect, useState } from 'react';
import { 
  XCircle, 
  CheckCircle2,
  Clock,
  Filter,
  DollarSign,
  TrendingUp,
  CreditCard,
  Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Badge, Card, Input, cn } from '../components/UI';
import { apiService } from '../services/api';
import { ExpenseClaim, ExpenseStatus, Employee } from '../types';

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseClaim[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [expenseRes, empRes] = await Promise.all([
        apiService.getExpenses(),
        apiService.getEmployees()
      ]);
      setExpenses(expenseRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      toast.error('Failed to fetch expense data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, status: ExpenseStatus) => {
    try {
      await apiService.updateExpenseStatus(id, status, 'Processed by Admin');
      toast.success(`Claim ${status.toLowerCase()}`);
      fetchData();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const getStatusBadge = (status: ExpenseStatus) => {
    switch (status) {
      case 'Approved': return <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100">Approved</Badge>;
      case 'Paid': return <Badge variant="success" className="bg-blue-50 text-blue-600 border-blue-100">Paid</Badge>;
      case 'Rejected': return <Badge variant="danger" className="bg-rose-50 text-rose-600 border-rose-100">Rejected</Badge>;
      case 'Pending': return <Badge variant="warning" className="bg-amber-50 text-amber-600 border-amber-100">Pending</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const pendingClaims = expenses.filter(e => e.status === 'Pending');
  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const filteredExpenses = expenses.filter(e => 
    e.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expense Management</h1>
          <p className="text-slate-500">Review and approve employee reimbursement claims</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search claims..." 
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 border-slate-200">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Claims</p>
              <h3 className="text-2xl font-black text-slate-900">${totalAmount.toLocaleString()}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
            <TrendingUp className="w-3 h-3" />
            <span>+12% from last month</span>
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
              <h3 className="text-2xl font-black text-slate-900">{pendingClaims.length}</h3>
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-slate-400">
            Requires immediate action
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Today</p>
              <h3 className="text-2xl font-black text-slate-900">0</h3>
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-slate-400">
            Processed successfully
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Payout</p>
              <h3 className="text-2xl font-black text-slate-900">{expenses.filter(e => e.status === 'Approved').length}</h3>
            </div>
          </div>
          <div className="mt-4 text-[10px] font-bold text-slate-400">
            Ready for accounting
          </div>
        </Card>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('overview')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === 'overview' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          All Claims
        </button>
        <button 
          onClick={() => setActiveTab('approvals')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === 'approvals' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Approvals Queue
          {pendingClaims.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-[10px] rounded-full">
              {pendingClaims.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-lg font-bold text-slate-900">
            {activeTab === 'overview' ? 'Claims History' : 'Pending Approvals'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {activeTab === 'overview' ? 'Status' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center"><div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" /></td></tr>
              ) : (activeTab === 'overview' ? filteredExpenses : pendingClaims).length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No claims found</td></tr>
              ) : (activeTab === 'overview' ? filteredExpenses : pendingClaims).map((claim) => {
                const emp = employees.find(e => e.id === claim.employee_id);
                return (
                  <tr key={claim.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 border border-slate-200">
                          {emp?.employee_name?.charAt(0) || claim.employee_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{emp?.employee_name || claim.employee_name}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{emp?.employee_id || 'ID N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] py-0 bg-slate-50 border-slate-200">{claim.category}</Badge>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{claim.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-slate-900">{claim.currency} {claim.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-600">{new Date(claim.date).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400">Applied {new Date(claim.applied_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {activeTab === 'overview' ? (
                        getStatusBadge(claim.status)
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(claim.id, 'Approved')}
                            className="text-emerald-600 hover:bg-emerald-50 h-9 w-9 p-0 rounded-xl"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleStatusUpdate(claim.id, 'Rejected')}
                            className="text-rose-600 hover:bg-rose-50 h-9 w-9 p-0 rounded-xl"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
