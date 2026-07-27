import React, { useState } from 'react';
import { 
  History, 
  Search, 
  User, 
  Calendar,
  Building2,
  Tag,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRightLeft
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';

type AuditLog = {
  id: string;
  action: 'Payroll Approved' | 'Expense Approved' | 'Vendor Paid' | 'Budget Changed' | 'Purchase Approved' | 'Invoice Cancelled';
  user: string;
  date: string;
  department: string;
  category: 'Payroll' | 'Expense' | 'Vendor' | 'Budget' | 'Purchase' | 'Invoice';
  details: string;
  status: 'Success' | 'Warning' | 'Failed';
};

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', action: 'Payroll Approved', user: 'Akhil', date: '2026-07-27 14:30', department: 'Company-Wide', category: 'Payroll', details: 'July 2026 Payroll approved for 520 employees. Total: $820,000.', status: 'Success' },
  { id: '2', action: 'Vendor Paid', user: 'Sarah', date: '2026-07-27 11:15', department: 'IT', category: 'Vendor', details: 'Paid $12,000 to AWS Cloud Services.', status: 'Success' },
  { id: '3', action: 'Expense Approved', user: 'Akhil', date: '2026-07-26 16:45', department: 'Marketing', category: 'Expense', details: 'Approved $450 travel expense for John Doe.', status: 'Success' },
  { id: '4', action: 'Budget Changed', user: 'Mike', date: '2026-07-25 09:00', department: 'Engineering', category: 'Budget', details: 'Increased Engineering budget by $50,000.', status: 'Warning' },
  { id: '5', action: 'Invoice Cancelled', user: 'Sarah', date: '2026-07-24 13:20', department: 'Operations', category: 'Invoice', details: 'Cancelled duplicated invoice INV-2026-088.', status: 'Failed' },
  { id: '6', action: 'Purchase Approved', user: 'Akhil', date: '2026-07-23 10:10', department: 'HR', category: 'Purchase', details: 'Approved $3,000 for new employee laptops.', status: 'Success' },
];

export const Audit: React.FC = () => {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = userFilter ? log.user === userFilter : true;
    const matchesDept = deptFilter ? log.department === deptFilter : true;
    const matchesCat = catFilter ? log.category === catFilter : true;

    return matchesSearch && matchesUser && matchesDept && matchesCat;
  });

  const getStatusIcon = (status: AuditLog['status']) => {
    switch (status) {
      case 'Success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'Failed': return <XCircle className="w-5 h-5 text-rose-500" />;
    }
  };

  const getCategoryColor = (cat: AuditLog['category']) => {
    switch(cat) {
      case 'Payroll': return 'bg-blue-100 text-blue-700';
      case 'Expense': return 'bg-emerald-100 text-emerald-700';
      case 'Vendor': return 'bg-purple-100 text-purple-700';
      case 'Budget': return 'bg-amber-100 text-amber-700';
      case 'Purchase': return 'bg-indigo-100 text-indigo-700';
      case 'Invoice': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const uniqueUsers = Array.from(new Set(logs.map(l => l.user)));
  const uniqueDepts = Array.from(new Set(logs.map(l => l.department)));
  const uniqueCats = Array.from(new Set(logs.map(l => l.category)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance Audit Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Track and monitor all sensitive financial transactions and approvals.</p>
        </div>
        <Button variant="outline" className="gap-2">
            <ArrowRightLeft className="w-4 h-4" /> Export Logs
        </Button>
      </div>

      <Card className="bg-white border-slate-200">
        <div className="p-4 border-b border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search audit details or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={userFilter} onChange={(e) => setUserFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none appearance-none bg-white"
            >
                <option value="">All Users</option>
                {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="relative">
            <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none appearance-none bg-white"
            >
                <option value="">All Depts</option>
                {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="relative">
            <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none appearance-none bg-white"
            >
                <option value="">All Categories</option>
                {uniqueCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Action & Details</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                        <Calendar className="w-4 h-4" />
                        {log.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{log.action}</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">{log.details}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getCategoryColor(log.category)}>{log.category}</Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{log.user}</td>
                  <td className="px-6 py-4 text-slate-600">{log.department}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                        {getStatusIcon(log.status)}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No audit logs found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
