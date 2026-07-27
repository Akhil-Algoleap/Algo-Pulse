import React, { useState } from 'react';
import { 
  Search,
  Filter,
  CheckCircle2,
  Receipt,
  Download,
  Wifi,
  Car,
  Stethoscope,
  Plane,
  Phone,
  GraduationCap
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import toast from 'react-hot-toast';

const MOCK_REIMBURSEMENTS = [
  { id: 'REIM-001', empId: 'EMP001', name: 'Akhil', category: 'Internet', amount: 40, status: 'Pending', date: '2026-07-25' },
  { id: 'REIM-002', empId: 'EMP002', name: 'Jane Smith', category: 'Fuel', amount: 120, status: 'Approved for Salary', date: '2026-07-26' },
  { id: 'REIM-003', empId: 'EMP003', name: 'Alice Johnson', category: 'Medical', amount: 500, status: 'Pending', date: '2026-07-27' },
  { id: 'REIM-004', empId: 'EMP004', name: 'Robert Brown', category: 'Travel', amount: 350, status: 'Approved for Salary', date: '2026-07-20' },
  { id: 'REIM-005', empId: 'EMP005', name: 'Sarah Lee', category: 'Phone Bill', amount: 60, status: 'Pending', date: '2026-07-28' },
  { id: 'REIM-006', empId: 'EMP006', name: 'Mike Doe', category: 'Training', amount: 800, status: 'Pending', date: '2026-07-28' },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Internet': return <Wifi className="w-4 h-4 text-blue-500" />;
    case 'Fuel': return <Car className="w-4 h-4 text-amber-500" />;
    case 'Medical': return <Stethoscope className="w-4 h-4 text-rose-500" />;
    case 'Travel': return <Plane className="w-4 h-4 text-indigo-500" />;
    case 'Phone Bill': return <Phone className="w-4 h-4 text-emerald-500" />;
    case 'Training': return <GraduationCap className="w-4 h-4 text-purple-500" />;
    default: return <Receipt className="w-4 h-4 text-slate-500" />;
  }
};

export const PayrollReimbursements: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reimbursements, setReimbursements] = useState(MOCK_REIMBURSEMENTS);

  const filteredData = reimbursements.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingAmount = reimbursements.filter(r => r.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  const approvedAmount = reimbursements.filter(r => r.status === 'Approved for Salary').reduce((acc, curr) => acc + curr.amount, 0);

  const handleApprove = (id: string) => {
    setReimbursements(prev => 
      prev.map(r => r.id === id ? { ...r, status: 'Approved for Salary' } : r)
    );
    toast.success('Reimbursement approved and added to the upcoming salary run.');
  };

  const handleApproveAll = () => {
    setReimbursements(prev => 
      prev.map(r => r.status === 'Pending' ? { ...r, status: 'Approved for Salary' } : r)
    );
    toast.success('All pending reimbursements approved for salary run.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reimbursements (Payroll)</h1>
          <p className="text-slate-500">Review finance-approved claims and add them to the final salary processing.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-slate-300 text-slate-700">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="primary" className="gap-2" onClick={handleApproveAll}>
            <CheckCircle2 className="w-4 h-4" /> Approve All for Salary
          </Button>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Pending Approval Amount</p>
            <p className="text-2xl font-black text-amber-600">${pendingAmount.toLocaleString()}</p>
          </div>
          <Receipt className="w-8 h-8 text-amber-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total Added to Salary</p>
            <p className="text-2xl font-black text-emerald-600">${approvedAmount.toLocaleString()}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-300" />
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by employee or category..." 
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
                <th className="p-4 font-semibold">Claim ID</th>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-500">
                    <div>{r.id}</div>
                    <div className="text-xs text-slate-400">{r.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {r.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{r.name}</p>
                        <p className="text-xs text-slate-500">{r.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(r.category)}
                      <span className="text-sm font-medium text-slate-700">{r.category}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800 text-right">${r.amount.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <Badge variant={r.status === 'Approved for Salary' ? 'success' : 'warning'} className="text-xs">
                      {r.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex justify-center">
                    {r.status === 'Pending' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-2 text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                        onClick={() => handleApprove(r.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Add to Salary
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Added</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
