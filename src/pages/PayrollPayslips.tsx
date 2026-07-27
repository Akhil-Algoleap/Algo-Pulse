import React, { useState } from 'react';
import { 
  Search,
  Filter,
  FileText,
  Send,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import toast from 'react-hot-toast';

const MOCK_PAYSLIPS = [
  { id: 'PS-JUL26-001', empId: 'EMP001', name: 'Akhil', month: 'July 2026', netPay: 82000, status: 'Downloaded' },
  { id: 'PS-JUL26-002', empId: 'EMP002', name: 'Jane Smith', month: 'July 2026', netPay: 70000, status: 'Generated' },
  { id: 'PS-JUL26-003', empId: 'EMP003', name: 'Alice Johnson', month: 'July 2026', netPay: 60000, status: 'Downloaded' },
  { id: 'PS-JUL26-004', empId: 'EMP004', name: 'Robert Brown', month: 'July 2026', netPay: 45000, status: 'Pending' },
];

export const PayrollPayslips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [payslips, setPayslips] = useState(MOCK_PAYSLIPS);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredData = payslips.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = 90; // Mocked from requirement
  const generatedCount = 520; // Mocked from requirement
  const downloadedCount = 430; // Mocked from requirement

  const handleGenerateBatch = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPayslips(prev => prev.map(p => p.status === 'Pending' ? { ...p, status: 'Generated' } : p));
      toast.success('Batch payslips generated successfully as PDFs.');
    }, 2000);
  };

  const handleEmailAll = () => {
    toast.success('All generated payslips have been emailed to employees.');
  };

  const handleBulkDownload = () => {
    toast.success('Bulk download initiated. Zip file will be ready shortly.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payslips</h1>
          <p className="text-slate-500">Generate monthly payslips.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-300 text-slate-700" onClick={handleBulkDownload}>
            <Layers className="w-4 h-4" /> Bulk Download
          </Button>
          <Button variant="outline" className="gap-2 border-blue-300 text-blue-700" onClick={handleEmailAll}>
            <Send className="w-4 h-4" /> Email Payslips
          </Button>
          <Button 
            variant="primary" 
            className="gap-2"
            onClick={handleGenerateBatch}
            disabled={isGenerating}
          >
            <FileText className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} /> 
            {isGenerating ? 'Generating...' : 'Generate Payslips'}
          </Button>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Generated (July)</p>
            <p className="text-2xl font-black text-slate-900">{generatedCount}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-blue-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Downloaded</p>
            <p className="text-2xl font-black text-emerald-600">{downloadedCount}</p>
          </div>
          <Download className="w-8 h-8 text-emerald-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Pending</p>
            <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
          </div>
          <FileText className="w-8 h-8 text-amber-300 fill-amber-300" />
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
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white">
              <option>July 2026</option>
              <option>June 2026</option>
              <option>May 2026</option>
            </select>
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-semibold">Document ID</th>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold text-center">Payroll Month</th>
                <th className="p-4 font-semibold text-right">Net Pay</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-500">{p.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-700 text-center flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> {p.month}
                  </td>
                  <td className="p-4 text-sm font-bold text-emerald-600 text-right">₹{p.netPay.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <Badge variant={
                      p.status === 'Pending' ? 'warning' :
                      p.status === 'Generated' ? 'primary' : 'success'
                    } className="text-xs">
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    {p.status !== 'Pending' && (
                      <>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-slate-600 hover:text-primary-600" title="View PDF">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-slate-600 hover:text-primary-600" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
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
