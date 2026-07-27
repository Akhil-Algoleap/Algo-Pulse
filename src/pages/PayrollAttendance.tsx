import React, { useState } from 'react';
import { 
  Search,
  Filter,
  RefreshCw,
  CalendarDays,
  UserX,
  Clock,
  Download
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import toast from 'react-hot-toast';

const MOCK_ATTENDANCE = [
  { id: 'EMP001', name: 'Akhil', department: 'Engineering', workingDays: 22, present: 21, paidLeaves: 1, lop: 0, lateDeductions: 0, halfDays: 0, holidayMultiplier: 1 },
  { id: 'EMP002', name: 'Jane Smith', department: 'Sales', workingDays: 22, present: 20, paidLeaves: 0, lop: 2, lateDeductions: 1, halfDays: 0, holidayMultiplier: 1 },
  { id: 'EMP003', name: 'Alice Johnson', department: 'Marketing', workingDays: 22, present: 22, paidLeaves: 0, lop: 0, lateDeductions: 0, halfDays: 0, holidayMultiplier: 1.5 },
  { id: 'EMP004', name: 'Robert Brown', department: 'HR', workingDays: 22, present: 19, paidLeaves: 1, lop: 1, lateDeductions: 3, halfDays: 2, holidayMultiplier: 1 },
];

export const PayrollAttendance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredData = MOCK_ATTENDANCE.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Attendance data synced successfully from the Core HR module.');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Attendance & Leave</h1>
          <p className="text-slate-500">Review calculated time logs and deductions before payroll processing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button 
            variant="primary" 
            className="gap-2"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
            {isSyncing ? 'Syncing Data...' : 'Sync from Core Attendance'}
          </Button>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total Cycle Days</p>
            <p className="text-2xl font-black text-slate-900">22</p>
          </div>
          <CalendarDays className="w-8 h-8 text-blue-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total LOP Days</p>
            <p className="text-2xl font-black text-rose-600">3</p>
          </div>
          <UserX className="w-8 h-8 text-rose-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total Late Deductions</p>
            <p className="text-2xl font-black text-amber-600">4</p>
          </div>
          <Clock className="w-8 h-8 text-amber-300" />
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
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold text-center">Working Days</th>
                <th className="p-4 font-semibold text-center">Present</th>
                <th className="p-4 font-semibold text-center">Paid Leave</th>
                <th className="p-4 font-semibold text-center">LOP / LWP</th>
                <th className="p-4 font-semibold text-center">Half Days</th>
                <th className="p-4 font-semibold text-center">Late Penality</th>
                <th className="p-4 font-semibold text-center">Holiday Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-700 text-center">{emp.workingDays}</td>
                  <td className="p-4 text-sm font-bold text-emerald-600 text-center">{emp.present}</td>
                  <td className="p-4 text-sm text-slate-600 text-center">{emp.paidLeaves}</td>
                  <td className="p-4 text-sm font-bold text-rose-600 text-center">{emp.lop > 0 ? emp.lop : '-'}</td>
                  <td className="p-4 text-sm text-slate-600 text-center">{emp.halfDays > 0 ? emp.halfDays : '-'}</td>
                  <td className="p-4 text-sm font-bold text-amber-600 text-center">{emp.lateDeductions > 0 ? emp.lateDeductions : '-'}</td>
                  <td className="p-4 text-center">
                    <Badge variant={emp.holidayMultiplier > 1 ? 'primary' : 'secondary'} className="text-xs">
                      {emp.holidayMultiplier}x
                    </Badge>
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
