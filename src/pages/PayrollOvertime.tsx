import React, { useState } from 'react';
import { 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Banknote,
  XCircle,
  Download
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import toast from 'react-hot-toast';

const MOCK_OVERTIME = [
  { id: 'OT-001', empId: 'EMP001', name: 'Akhil', hours: 12, rate: 1.5, amount: 180, status: 'Pending' },
  { id: 'OT-002', empId: 'EMP002', name: 'Jane Smith', hours: 5, rate: 2.0, amount: 150, status: 'Approved' },
  { id: 'OT-003', empId: 'EMP003', name: 'Alice Johnson', hours: 8, rate: 1.5, amount: 120, status: 'Pending' },
  { id: 'OT-004', empId: 'EMP004', name: 'Robert Brown', hours: 10, rate: 1.5, amount: 150, status: 'Rejected' },
];

export const PayrollOvertime: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [overtimeData, setOvertimeData] = useState(MOCK_OVERTIME);

  const filteredData = overtimeData.filter(ot => 
    ot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ot.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingHours = overtimeData.filter(ot => ot.status === 'Pending').reduce((acc, curr) => acc + curr.hours, 0);
  const pendingAmount = overtimeData.filter(ot => ot.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setOvertimeData(prev => 
      prev.map(ot => ot.id === id ? { ...ot, status: action } : ot)
    );
    toast.success(`Overtime request ${action.toLowerCase()} successfully.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overtime Management</h1>
          <p className="text-slate-500">Review manager-approved overtime before adding it to the final salary.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total OT Requests</p>
            <p className="text-2xl font-black text-slate-900">{overtimeData.length}</p>
          </div>
          <Clock className="w-8 h-8 text-blue-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Pending Review</p>
            <p className="text-2xl font-black text-amber-600">{overtimeData.filter(ot => ot.status === 'Pending').length}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-amber-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Pending Hours</p>
            <p className="text-2xl font-black text-slate-900">{pendingHours}h</p>
          </div>
          <Clock className="w-8 h-8 text-indigo-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Est. Pending Cost</p>
            <p className="text-2xl font-black text-slate-900">${pendingAmount}</p>
          </div>
          <Banknote className="w-8 h-8 text-emerald-300" />
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
                <th className="p-4 font-semibold">Request ID</th>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold text-center">Hours Logged</th>
                <th className="p-4 font-semibold text-center">Multiplier</th>
                <th className="p-4 font-semibold text-right">Calculated Amount</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((ot) => (
                <tr key={ot.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-500">{ot.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {ot.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{ot.name}</p>
                        <p className="text-xs text-slate-500">{ot.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-700 text-center">{ot.hours}h</td>
                  <td className="p-4 text-sm text-slate-600 text-center">{ot.rate}x</td>
                  <td className="p-4 text-sm font-bold text-emerald-600 text-right">${ot.amount}</td>
                  <td className="p-4 text-center">
                    <Badge variant={
                      ot.status === 'Approved' ? 'success' : 
                      ot.status === 'Rejected' ? 'danger' : 'warning'
                    } className="text-xs">
                      {ot.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    {ot.status === 'Pending' ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                          onClick={() => handleAction(ot.id, 'Approved')}
                          title="Approve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 text-rose-600 hover:bg-rose-50 border-rose-200"
                          onClick={() => handleAction(ot.id, 'Rejected')}
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Processed</span>
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
