import React, { useState } from 'react';
import { 
  Search,
  Filter,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  ChevronDown
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import toast from 'react-hot-toast';

const MOCK_COMPLIANCE = [
  { id: 'PF-JUL26', type: 'Provident Fund (PF)', amount: 125000, dueDate: '2026-08-15', status: 'Pending Filing' },
  { id: 'ESI-JUL26', type: 'Employee State Insurance (ESI)', amount: 45000, dueDate: '2026-08-15', status: 'Filed' },
  { id: 'PT-JUL26', type: 'Professional Tax (PT)', amount: 28000, dueDate: '2026-08-20', status: 'Pending Filing' },
  { id: 'LWF-JUL26', type: 'Labour Welfare Fund (LWF)', amount: 5000, dueDate: '2026-08-25', status: 'Pending Filing' },
  { id: 'TDS-JUL26', type: 'Tax Deducted at Source (TDS)', amount: 450000, dueDate: '2026-08-07', status: 'Pending Filing' },
  { id: 'GRAT-JUL26', type: 'Gratuity', amount: 8000, dueDate: '2026-08-30', status: 'Pending Filing' },
];

export const PayrollCompliance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [complianceData, setComplianceData] = useState(MOCK_COMPLIANCE);
  const [showReportsMenu, setShowReportsMenu] = useState(false);

  const filteredData = complianceData.filter(c => 
    c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLiability = complianceData.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingCount = complianceData.filter(c => c.status === 'Pending Filing').length;

  const handleFile = (id: string) => {
    setComplianceData(prev => prev.map(c => c.id === id ? { ...c, status: 'Filed' } : c));
    toast.success('Compliance record marked as filed.');
  };

  const handleGenerateReport = (reportType: string) => {
    setShowReportsMenu(false);
    toast.success(`${reportType} generated successfully.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Statutory Compliance</h1>
          <p className="text-slate-500">Manage PF, ESI, PT, LWF, TDS, and Gratuity liabilities.</p>
        </div>
        <div className="relative">
          <Button 
            variant="primary" 
            className="gap-2" 
            onClick={() => setShowReportsMenu(!showReportsMenu)}
          >
            <Download className="w-4 h-4" /> Generate Reports <ChevronDown className="w-4 h-4" />
          </Button>
          
          {showReportsMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10">
              <button onClick={() => handleGenerateReport('PF Report')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">PF Report</button>
              <button onClick={() => handleGenerateReport('ESI Report')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">ESI Report</button>
              <button onClick={() => handleGenerateReport('TDS Report')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">TDS Report</button>
              <div className="border-t border-slate-100 my-1"></div>
              <button onClick={() => handleGenerateReport('All Compliance Reports')} className="w-full text-left px-4 py-2 text-sm font-medium text-primary-600 hover:bg-slate-50">All Compliance Reports</button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total Registers</p>
            <p className="text-2xl font-black text-slate-900">{complianceData.length}</p>
          </div>
          <ShieldCheck className="w-8 h-8 text-blue-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total Liability (July)</p>
            <p className="text-2xl font-black text-rose-600">
              ₹{totalLiability.toLocaleString()}
            </p>
          </div>
          <FileText className="w-8 h-8 text-rose-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Pending Filings</p>
            <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-300" />
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search compliance type..." 
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
                <th className="p-4 font-semibold">Challan / ID</th>
                <th className="p-4 font-semibold">Compliance Type</th>
                <th className="p-4 font-semibold text-right">Calculated Liability</th>
                <th className="p-4 font-semibold text-center">Due Date</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{c.id}</td>
                  <td className="p-4 text-sm font-bold text-slate-700">{c.type}</td>
                  <td className="p-4 text-sm font-bold text-rose-600 text-right">₹{c.amount.toLocaleString()}</td>
                  <td className="p-4 text-sm text-slate-600 text-center">{c.dueDate}</td>
                  <td className="p-4 text-center">
                    <Badge variant={c.status === 'Filed' ? 'success' : 'warning'} className="text-xs">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    {c.status === 'Pending Filing' ? (
                      <>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-slate-600 hover:text-primary-600">
                          <Download className="w-4 h-4" /> View Challan
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 text-emerald-600 hover:bg-emerald-50 border-emerald-200"
                          onClick={() => handleFile(c.id)}
                        >
                          Mark Filed
                        </Button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completed
                      </span>
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
