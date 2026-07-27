import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Check, 
  X, 
  AlertCircle,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Select, Badge, Card, Input } from '../components/UI';

type TimesheetStatus = 'Pending' | 'Approved' | 'Rejected' | 'Needs Correction';

interface Timesheet {
  id: string;
  employee_name: string;
  project_name: string;
  week: string;
  hours: number;
  status: TimesheetStatus;
}

const INITIAL_TIMESHEETS: Timesheet[] = [
  { id: 'TS-001', employee_name: 'Akhil', project_name: 'HRMS', week: 'Week 28', hours: 40, status: 'Pending' },
  { id: 'TS-002', employee_name: 'Rahul', project_name: 'CRM', week: 'Week 28', hours: 38, status: 'Approved' },
  { id: 'TS-003', employee_name: 'Priya', project_name: 'HRMS', week: 'Week 28', hours: 45, status: 'Needs Correction' },
  { id: 'TS-004', employee_name: 'Sneha', project_name: 'ERP System', week: 'Week 27', hours: 40, status: 'Approved' },
  { id: 'TS-005', employee_name: 'Akhil', project_name: 'HRMS', week: 'Week 27', hours: 40, status: 'Approved' }
];

export const Timesheets: React.FC = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>(INITIAL_TIMESHEETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleAction = (id: string, newStatus: TimesheetStatus) => {
    setTimesheets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    if (newStatus === 'Approved') toast.success('Timesheet approved');
    else if (newStatus === 'Rejected') toast.error('Timesheet rejected');
    else if (newStatus === 'Needs Correction') toast('Correction requested', { icon: '⚠️' });
  };

  const getStatusColor = (status: TimesheetStatus) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      case 'Needs Correction': return 'warning';
      default: return 'default';
    }
  };

  const filteredTimesheets = timesheets.filter(t => {
    const matchesSearch = 
      t.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.week.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === 'All' || t.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Timesheet Approvals</h1>
          <p className="text-slate-500">Review and manage weekly employee hours</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            Submitted Timesheets
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search employee or project..." 
                className="pl-9 bg-slate-50 border-none h-10 text-sm focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <Select 
                className="pl-9 bg-slate-50 border-none h-10 text-sm focus:ring-2 focus:ring-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Needs Correction">Needs Correction</option>
                <option value="Rejected">Rejected</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Project</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Week</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Hours</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTimesheets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                       <Clock className="w-10 h-10 text-slate-200 mb-2" />
                       <p className="text-slate-400 font-medium">No timesheets found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTimesheets.map(timesheet => (
                <tr key={timesheet.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center font-bold text-primary-700 text-xs shadow-sm border border-primary-200">
                        {timesheet.employee_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{timesheet.employee_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{timesheet.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{timesheet.project_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{timesheet.week}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black text-slate-800">{timesheet.hours}</p>
                      <span className="text-xs text-slate-400 font-bold uppercase">hrs</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(timesheet.status)} className="font-bold tracking-wide uppercase text-[10px]">
                      {timesheet.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {timesheet.status === 'Pending' ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => handleAction(timesheet.id, 'Approved')}
                            title="Approve"
                          >
                            <Check className="w-4 h-4 mr-1" /> <span className="text-xs">Approve</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                            onClick={() => handleAction(timesheet.id, 'Needs Correction')}
                            title="Request Correction"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" /> <span className="text-xs">Correction</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleAction(timesheet.id, 'Rejected')}
                            title="Reject"
                          >
                            <X className="w-4 h-4 mr-1" /> <span className="text-xs">Reject</span>
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Processed</span>
                      )}
                    </div>
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
