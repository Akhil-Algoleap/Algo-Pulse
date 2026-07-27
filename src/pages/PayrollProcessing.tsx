import React, { useState } from 'react';
import { 
  Calculator, 
  Lock, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Calendar,
  Users,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../components/UI';
import toast from 'react-hot-toast';

const WORKFLOW_STEPS = [
  'eSSL Sync',
  'Attendance Approved',
  'Leave Approved',
  'Overtime Approved',
  'Bonuses Added',
  'Loans Deducted',
  'Tax Calculated',
  'Payroll Generated',
  'Finance Approval',
  'Salary Released'
];

const MOCK_EMPLOYEES = [
  { id: 'EMP001', name: 'John Doe', department: 'Engineering', gross: 120000, deductions: 15000, net: 105000, status: 'Calculated' },
  { id: 'EMP002', name: 'Jane Smith', department: 'Sales', gross: 95000, deductions: 12000, net: 83000, status: 'Pending' },
  { id: 'EMP003', name: 'Alice Johnson', department: 'Marketing', gross: 85000, deductions: 10000, net: 75000, status: 'Calculated' },
  { id: 'EMP004', name: 'Robert Brown', department: 'HR', gross: 70000, deductions: 8000, net: 62000, status: 'Locked' },
  { id: 'EMP005', name: 'Michael Davis', department: 'Operations', gross: 60000, deductions: 5000, net: 55000, status: 'Error' },
];

export const PayrollProcessing: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(6); // 0-indexed, 6 = 'Generate Payroll'
  const [searchTerm, setSearchTerm] = useState('');
  const [payrollStatus, setPayrollStatus] = useState<'In Progress' | 'Locked' | 'Submitted'>('In Progress');

  const handleCalculate = () => {
    toast.success('Calculating payroll for 520 employees...');
  };

  const handleRecalculate = () => {
    toast.success('Recalculating pending records...');
  };

  const handleLock = () => {
    setPayrollStatus('Locked');
    toast.success('Payroll records locked successfully.');
  };

  const handleSubmit = () => {
    setPayrollStatus('Submitted');
    setCurrentStep(7); // Move to Finance Approval
    toast.success('Payroll submitted to Finance for approval.');
  };

  const filteredEmployees = MOCK_EMPLOYEES.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Processing</h1>
          <p className="text-slate-500">Manage and finalize payroll for the current cycle.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleRecalculate}
            disabled={payrollStatus !== 'In Progress'}
          >
            <RefreshCw className="w-4 h-4" /> Recalculate Payroll
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleCalculate}
            disabled={payrollStatus !== 'In Progress'}
          >
            <Calculator className="w-4 h-4" /> Calculate Payroll
          </Button>
          <Button 
            variant="primary" 
            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white border-none" 
            onClick={handleLock}
            disabled={payrollStatus !== 'In Progress'}
          >
            <Lock className="w-4 h-4" /> Lock Payroll
          </Button>
          <Button 
            variant="primary" 
            className="gap-2" 
            onClick={handleSubmit}
            disabled={payrollStatus === 'Submitted'}
          >
            <Send className="w-4 h-4" /> Submit to Finance
          </Button>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Payroll Month</p>
            <p className="text-2xl font-black text-slate-900">July 2026</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Employees</p>
            <p className="text-2xl font-black text-slate-900">520</p>
          </div>
          <Users className="w-8 h-8 text-indigo-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Status</p>
            <Badge 
              variant={payrollStatus === 'Submitted' ? 'success' : payrollStatus === 'Locked' ? 'warning' : 'default'}
              className="text-sm px-3 py-1 mt-1"
            >
              {payrollStatus}
            </Badge>
          </div>
          <CheckCircle2 className={cn(
            "w-8 h-8",
            payrollStatus === 'Submitted' ? "text-emerald-300" : 
            payrollStatus === 'Locked' ? "text-amber-300" : 
            "text-blue-300"
          )} />
        </Card>
      </div>

      {/* Workflow Tracker */}
      <Card className="p-6 border-none shadow-sm overflow-x-auto">
        <div className="flex items-center min-w-[800px]">
          {WORKFLOW_STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center relative z-10 w-24 shrink-0">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors",
                    isCompleted ? "bg-emerald-500 text-white" :
                    isCurrent ? "bg-primary-600 text-white ring-4 ring-primary-100" :
                    "bg-slate-100 text-slate-400"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={cn(
                    "text-xs font-semibold mt-2 text-center leading-tight",
                    isCompleted ? "text-emerald-600" :
                    isCurrent ? "text-primary-700" :
                    "text-slate-400"
                  )}>
                    {step}
                  </span>
                </div>
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-1 mx-2 rounded",
                    index < currentStep ? "bg-emerald-500" : "bg-slate-100"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Card>

      {/* Employee Data Grid */}
      <Card className="border-none shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Employee Processing Details</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search employees..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-semibold">Employee ID</th>
                <th className="p-4 font-semibold">Employee Name</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold text-right">Gross Pay</th>
                <th className="p-4 font-semibold text-right">Deductions</th>
                <th className="p-4 font-semibold text-right">Net Pay</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{emp.id}</td>
                  <td className="p-4 text-sm text-slate-700">{emp.name}</td>
                  <td className="p-4 text-sm text-slate-500">{emp.department}</td>
                  <td className="p-4 text-sm font-medium text-slate-700 text-right">₹{emp.gross.toLocaleString()}</td>
                  <td className="p-4 text-sm text-rose-500 text-right">-₹{emp.deductions.toLocaleString()}</td>
                  <td className="p-4 text-sm font-bold text-emerald-600 text-right">₹{emp.net.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <Badge variant={
                      emp.status === 'Calculated' ? 'success' :
                      emp.status === 'Locked' ? 'default' :
                      emp.status === 'Pending' ? 'warning' : 'danger'
                    } className="text-xs">
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex justify-center">
                    <Button variant="outline" size="sm" className="h-8 px-2 text-slate-500 hover:text-primary-600">
                      <FileText className="w-4 h-4" />
                    </Button>
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
