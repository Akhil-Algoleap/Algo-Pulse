import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Search,
  Calendar as CalendarIcon,
  Filter,
  Download,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Card, Badge, Input } from '../components/UI';
import { apiService } from '../services/api';
import { Attendance as AttendanceType } from '../types';

export const Attendance: React.FC = () => {
  const [logs, setLogs] = useState<AttendanceType[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AttendanceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getAttendance(); // Fetches all attendance
      setLogs(res.data.reverse());
      setFilteredLogs(res.data);
    } catch (error) {
      toast.error('Failed to fetch attendance logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = logs;
    
    if (searchTerm) {
      result = result.filter(log => 
        log.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.employee_id_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (dateFilter) {
      result = result.filter(log => log.date === dateFilter);
    }
    
    setFilteredLogs(result);
  }, [searchTerm, dateFilter, logs]);

  const handleExport = () => {
    toast.success('Exporting attendance report...');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Management</h1>
          <p className="text-slate-500">Monitor employee work hours and daily logs</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none shadow-lg shadow-primary-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-none">Today</Badge>
          </div>
          <p className="text-primary-100 text-sm font-medium uppercase tracking-wider">Average Hours</p>
          <h3 className="text-3xl font-bold">8.4h</h3>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <User className="w-6 h-6" />
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">On Time Today</p>
          <h3 className="text-3xl font-bold text-slate-900">85%</h3>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <Badge variant="warning">Late</Badge>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Late Arrivals</p>
          <h3 className="text-3xl font-bold text-slate-900">12</h3>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="overflow-hidden border-slate-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by employee name or ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="date"
                  className="pl-10 min-w-[180px]"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clock Out</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      Loading logs...
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No attendance logs found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs">
                          {log.employee_name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{log.employee_name}</p>
                          <p className="text-xs text-slate-500 font-mono">{log.employee_id_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {new Date(log.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {log.clock_out ? (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          {new Date(log.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic font-light italic">Ongoing</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">
                      {log.total_hours ? `${log.total_hours}h` : '---'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={
                          log.status === 'Present' ? 'success' : 
                          log.status === 'Late' ? 'warning' : 'danger'
                        }
                        className="font-medium"
                      >
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
