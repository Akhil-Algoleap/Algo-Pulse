import React, { useState } from 'react';
import { 
  Search,
  Filter,
  Eye,
  TrendingUp,
  ArrowUpCircle,
  PlusCircle,
  MinusCircle,
  X,
  Banknote,
  History,
  FileText,
  Briefcase,
  Calendar,
  Percent,
  Download
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

const MOCK_EMPLOYEES = [
  { id: 'EMP001', name: 'Akhil', department: 'Engineering', role: 'Software Engineer', salary: 4500, currency: '$', status: 'Active', joinedDate: '2022-01-15' },
  { id: 'EMP002', name: 'Jane Smith', department: 'Sales', role: 'Sales Manager', salary: 6000, currency: '$', status: 'Active', joinedDate: '2021-03-10' },
  { id: 'EMP003', name: 'Alice Johnson', department: 'Marketing', role: 'Marketing Lead', salary: 5500, currency: '$', status: 'Active', joinedDate: '2022-08-01' },
  { id: 'EMP004', name: 'Robert Brown', department: 'HR', role: 'HR Business Partner', salary: 4800, currency: '$', status: 'Probation', joinedDate: '2026-05-15' },
];

export const EmployeeSalary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('breakdown');
  const [actionModal, setActionModal] = useState<string | null>(null);

  const filteredEmployees = MOCK_EMPLOYEES.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (e: React.FormEvent, actionName: string) => {
    e.preventDefault();
    toast.success(`${actionName} processed successfully for ${selectedEmployee?.name}.`);
    setActionModal(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employee Salary</h1>
          <p className="text-slate-500">Manage individual compensation, histories, and adjustments.</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Download className="w-4 h-4" /> Export Salary Report
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
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
                <th className="p-4 font-semibold">Employee ID</th>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Monthly Salary</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{emp.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{emp.role}</td>
                  <td className="p-4 text-sm font-bold text-slate-800">{emp.currency}{emp.salary.toLocaleString()}</td>
                  <td className="p-4">
                    <Badge variant={emp.status === 'Active' ? 'success' : 'warning'} className="text-xs">
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-2 text-primary-600 hover:bg-primary-50 border-primary-200"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Employee Detail Slide-out / Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl shadow-sm">
                  {selectedEmployee.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedEmployee.name}</h2>
                    <Badge variant={selectedEmployee.status === 'Active' ? 'success' : 'warning'}>{selectedEmployee.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-4">
                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {selectedEmployee.role} ({selectedEmployee.department})</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined: {selectedEmployee.joinedDate}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Actions Bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-3 bg-white">
              <Button size="sm" variant="outline" className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50" onClick={() => setActionModal('Salary Revision')}>
                <TrendingUp className="w-4 h-4" /> Salary Revision
              </Button>
              <Button size="sm" variant="outline" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => setActionModal('Promotion Increment')}>
                <ArrowUpCircle className="w-4 h-4" /> Promotion Increment
              </Button>
              <Button size="sm" variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setActionModal('One-Time Adjustment')}>
                <PlusCircle className="w-4 h-4" /> One-Time Adjustment
              </Button>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-slate-200 flex gap-6 overflow-x-auto bg-white">
              {[
                { id: 'breakdown', label: 'Salary Breakdown', icon: Banknote },
                { id: 'increment', label: 'Increment History', icon: TrendingUp },
                { id: 'bonus', label: 'Bonus History', icon: PlusCircle },
                { id: 'loan', label: 'Loan Details', icon: Banknote },
                { id: 'tax', label: 'Tax Details', icon: Percent },
                { id: 'history', label: 'Payroll History', icon: History }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === tab.id 
                      ? "border-primary-600 text-primary-700" 
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              
              {activeTab === 'breakdown' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase">Total Monthly Gross</p>
                      <p className="text-3xl font-black text-slate-900">{selectedEmployee.currency}{selectedEmployee.salary.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-500 uppercase">Estimated Net Pay</p>
                      <p className="text-3xl font-black text-emerald-600">{selectedEmployee.currency}{(selectedEmployee.salary * 0.82).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-5 border-none shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-emerald-500" /> Earnings
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Basic Salary</span><span className="font-medium text-slate-900">{selectedEmployee.currency}{(selectedEmployee.salary * 0.4).toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">HRA</span><span className="font-medium text-slate-900">{selectedEmployee.currency}{(selectedEmployee.salary * 0.2).toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Special Allowance</span><span className="font-medium text-slate-900">{selectedEmployee.currency}{(selectedEmployee.salary * 0.3).toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Medical Allowance</span><span className="font-medium text-slate-900">{selectedEmployee.currency}{(selectedEmployee.salary * 0.1).toLocaleString()}</span></div>
                      </div>
                    </Card>
                    
                    <Card className="p-5 border-none shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MinusCircle className="w-5 h-5 text-rose-500" /> Deductions
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Provident Fund</span><span className="font-medium text-rose-600">{selectedEmployee.currency}{(selectedEmployee.salary * 0.05).toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Income Tax (TDS)</span><span className="font-medium text-rose-600">{selectedEmployee.currency}{(selectedEmployee.salary * 0.12).toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-600">Professional Tax</span><span className="font-medium text-rose-600">{selectedEmployee.currency}200</span></div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'increment' && (
                <Card className="p-6 border-none shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6">Increment History</h3>
                  <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
                    <div className="relative pl-6">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-primary-500 rounded-full ring-4 ring-white" />
                      <p className="text-sm text-slate-500 mb-1">January 2026</p>
                      <p className="font-bold text-slate-900">Annual Appraisal <span className="text-emerald-600 ml-2">+12%</span></p>
                      <p className="text-sm text-slate-600 mt-1">Salary revised from {selectedEmployee.currency}4,017 to {selectedEmployee.currency}{selectedEmployee.salary.toLocaleString()}</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-slate-300 rounded-full ring-4 ring-white" />
                      <p className="text-sm text-slate-500 mb-1">January 2025</p>
                      <p className="font-bold text-slate-900">Annual Appraisal <span className="text-emerald-600 ml-2">+10%</span></p>
                      <p className="text-sm text-slate-600 mt-1">Salary revised from {selectedEmployee.currency}3,652 to {selectedEmployee.currency}4,017</p>
                    </div>
                  </div>
                </Card>
              )}
              
              {activeTab === 'history' && (
                <Card className="p-0 border-none shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                        <th className="p-4 font-semibold">Month</th>
                        <th className="p-4 font-semibold">Gross Pay</th>
                        <th className="p-4 font-semibold">Net Pay</th>
                        <th className="p-4 font-semibold text-center">Status</th>
                        <th className="p-4 font-semibold text-center">Payslip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {['June 2026', 'May 2026', 'April 2026', 'March 2026'].map((month) => (
                        <tr key={month} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-medium text-slate-900">{month}</td>
                          <td className="p-4 text-sm text-slate-700">{selectedEmployee.currency}{selectedEmployee.salary.toLocaleString()}</td>
                          <td className="p-4 text-sm font-bold text-emerald-600">{selectedEmployee.currency}{(selectedEmployee.salary * 0.82).toLocaleString()}</td>
                          <td className="p-4 text-center"><Badge variant="success" className="text-xs">Paid</Badge></td>
                          <td className="p-4 flex justify-center">
                            <Button variant="outline" size="sm" className="h-8 px-2 text-slate-500 hover:text-primary-600">
                              <FileText className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}

              {['bonus', 'loan', 'tax'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <History className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Records Found</h3>
                  <p className="text-slate-500 max-w-sm">There are no {activeTab} records associated with {selectedEmployee.name} for the current financial year.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Actions Modal */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={actionModal || ''}
      >
        <form onSubmit={(e) => handleAction(e, actionModal!)} className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 mb-4">
            <p className="text-sm text-slate-600">Target Employee: <span className="font-bold text-slate-900">{selectedEmployee?.name}</span></p>
            <p className="text-sm text-slate-600">Current Salary: <span className="font-bold text-slate-900">{selectedEmployee?.currency}{selectedEmployee?.salary.toLocaleString()}</span></p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {actionModal === 'One-Time Adjustment' ? 'Adjustment Amount' : 'New Monthly Salary'}
            </label>
            <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          
          {actionModal !== 'One-Time Adjustment' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Effective Date</label>
              <input required type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason / Remarks</label>
            <textarea required rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Request</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
