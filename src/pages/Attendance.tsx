import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Search,
  Calendar as CalendarIcon,
  Filter,
  Download,
  User,
  Fingerprint,
  RefreshCw,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Card, Badge, Input } from '../components/UI';
import { apiService } from '../services/api';
import { Attendance as AttendanceType, Employee } from '../types';
import { formatDate, formatTime } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';

export const Attendance: React.FC = () => {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<AttendanceType[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AttendanceType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Simulator State
  const [selectedEmpCode, setSelectedEmpCode] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Live Sync Polling State
  const [isLiveSync, setIsLiveSync] = useState(false);

  const isAdmin = profile?.role === 'Admin';
  const isManager = profile?.role === 'Manager';

  const fetchData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const res = await apiService.getAttendance();
      let rawData = res.data || [];
      
      // Role-based filtering
      if (profile?.role === 'Employee') {
        // filter by employee_id matching profile id (assuming api doesn't do it)
        rawData = rawData.filter((log: any) => log.employee_id === profile.id);
      }
      
      const reversed = [...rawData].reverse();
      setLogs(reversed);
      setFilteredLogs(reversed);
    } catch (error) {
      if (showLoading) toast.error('Failed to fetch attendance logs');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    if (!isAdmin) return;
    try {
      const res = await apiService.getEmployees();
      const empList = res.data || [];
      setEmployees(empList);
      if (empList.length > 0) {
        setSelectedEmpCode(empList[0].employee_id || empList[0].id || 'EMP001');
      }
    } catch (error) {
      console.error('Error fetching employees for simulator:', error);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchData(true);
      fetchEmployees();
    }
  }, [profile]);

  // 5-second Live Sync Polling
  useEffect(() => {
    let interval: any = null;
    if (isLiveSync) {
      interval = setInterval(() => {
        fetchData(false);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveSync]);

  useEffect(() => {
    let result = logs;
    
    if (searchTerm) {
      result = result.filter(log => 
        log.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.employee_id_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (dateFilter) {
      result = result.filter(log => log.date === dateFilter);
    }
    
    setFilteredLogs(result);
  }, [searchTerm, dateFilter, logs]);

  const handleSimulateSwipe = async () => {
    if (!selectedEmpCode) {
      toast.error('Please select an employee code');
      return;
    }

    setIsSimulating(true);
    try {
      let timestamp: string | undefined = undefined;
      if (customTime) {
        const today = new Date().toISOString().split('T')[0];
        timestamp = new Date(`${today}T${customTime}:00`).toISOString();
      }

      const res = await apiService.triggerBiometricSwipe(selectedEmpCode, timestamp);
      if (res.success) {
        toast.success(res.message || 'Biometric swipe recorded successfully!');
        await fetchData(false);
      } else {
        toast.error(res.error || 'Failed to record punch');
      }
    } catch (err: any) {
      console.error('Biometric swipe error:', err);
      toast.error(err.response?.data?.error || 'Error sending swipe to eSSL endpoint');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExport = () => {
    toast.success('Exporting attendance report...');
  };

  // Dynamic Statistics Calculations
  const logsWithHours = logs.filter(l => l.total_hours && Number(l.total_hours) > 0);
  const avgHoursVal = logsWithHours.length > 0
    ? (logsWithHours.reduce((acc, l) => acc + Number(l.total_hours || 0), 0) / logsWithHours.length).toFixed(1)
    : '0.0';

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date === todayStr);
  const totalTodayCount = todayLogs.length;
  const onTimeTodayCount = todayLogs.filter(l => l.status === 'Present').length;
  const onTimePercentage = totalTodayCount > 0 
    ? Math.round((onTimeTodayCount / totalTodayCount) * 100) + '%'
    : (logs.length > 0 ? Math.round((logs.filter(l => l.status === 'Present').length / logs.length) * 100) + '%' : '100%');

  const lateArrivalsCount = todayLogs.length > 0
    ? todayLogs.filter(l => l.status === 'Late').length
    : logs.filter(l => l.status === 'Late').length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {profile?.role === 'Employee' ? 'My Attendance' : 'Attendance Management'}
            {isAdmin && (
              <span className="inline-flex items-center text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Zap className="w-3 h-3 mr-1 fill-emerald-500 text-emerald-500" />
                eSSL Biometric Ready
              </span>
            )}
          </h1>
          <p className="text-slate-500">Monitor employee work hours and daily biometric logs</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live Sync Toggle - Only for Admin */}
          {isAdmin && (
            <button
              onClick={() => {
                const nextState = !isLiveSync;
                setIsLiveSync(nextState);
                if (nextState) toast.success('Live Sync Enabled (polling every 5s)');
                else toast('Live Sync Disabled');
              }}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all border ${
                isLiveSync 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm animate-pulse' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLiveSync ? 'animate-spin text-emerald-600' : 'text-slate-400'}`} />
              <span>Live Sync {isLiveSync ? '(5s)' : 'Off'}</span>
            </button>
          )}

          {(isAdmin || isManager) && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none shadow-lg shadow-primary-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-none">Calculated</Badge>
          </div>
          <p className="text-primary-100 text-sm font-medium uppercase tracking-wider">Average Hours</p>
          <h3 className="text-3xl font-bold">{avgHoursVal}h</h3>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <User className="w-6 h-6" />
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">On Time Today</p>
          <h3 className="text-3xl font-bold text-slate-900">{onTimePercentage}</h3>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <Badge variant="warning">Cutoff: 9:30 AM</Badge>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Late Arrivals</p>
          <h3 className="text-3xl font-bold text-slate-900">{lateArrivalsCount}</h3>
        </Card>
      </div>

      {/* eSSL Biometric Device Simulator Widget - Admin Only */}
      {isAdmin && (
        <Card className="p-5 border-slate-200 bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-primary-400 animate-pulse" />
                <h2 className="text-lg font-bold text-white tracking-wide">eSSL Biometric Device Simulator</h2>
              </div>
              <p className="text-xs text-slate-400">
                Simulate hardware biometric card/finger punches directly to <code className="text-primary-300 font-mono bg-slate-800 px-1.5 py-0.5 rounded">/api/essl</code>. First swipe clocks IN (before/after 9:30 AM), second swipe clocks OUT.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col">
                <label className="text-[11px] text-slate-400 mb-1 font-medium">Select Employee</label>
                <select
                  value={selectedEmpCode}
                  onChange={(e) => setSelectedEmpCode(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 min-w-[200px]"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.employee_id || emp.id}>
                      {emp.employee_name} ({emp.employee_id || `ID:${emp.id}`})
                    </option>
                  ))}
                  {!employees.some(e => e.employee_id === 'EMP123') && (
                    <option value="EMP123">Jagan Mohan (EMP123)</option>
                  )}
                  <option value="EMP999">Test User (EMP999)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] text-slate-400 mb-1 font-medium font-mono">Custom Time (Optional)</label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  placeholder="Now"
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex flex-col justify-end pt-5">
                <Button
                  onClick={handleSimulateSwipe}
                  disabled={isSimulating}
                  className="bg-primary-500 hover:bg-primary-600 text-white border-none shadow-md shadow-primary-500/30 flex items-center gap-2"
                >
                  <Activity className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? 'Processing...' : 'Simulate Swipe'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters & Table */}
      <Card className="overflow-hidden border-slate-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row gap-4">
            {(isAdmin || isManager) && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by employee name or ID..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
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
              <Button variant="outline" onClick={() => { setSearchTerm(''); setDateFilter(''); }}>
                <Filter className="w-4 h-4 mr-2" />
                Reset Filters
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
                          {(log.employee_name || 'E').split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{log.employee_name || 'Employee'}</p>
                          <p className="text-xs text-slate-500 font-mono">{log.employee_id_code || log.employee_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(log.date)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {formatTime(log.clock_in)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {log.clock_out ? (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          {formatTime(log.clock_out)}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic font-light">Ongoing</span>
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
