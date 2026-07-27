import React, { useState } from 'react';
import { 
  Search,
  Filter,
  FileText,
  Calculator,
  Percent,
  AlertTriangle,
  Download,
  Eye,
  FileBarChart
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

const MOCK_TAX = [
  { id: 'EMP001', name: 'Akhil', regime: 'New', declarations: 0, incomeTax: 8000, pt: 200, pf: 1800, esi: 0, tds: 8000, status: 'Verified' },
  { id: 'EMP002', name: 'Jane Smith', regime: 'Old', declarations: 150000, incomeTax: 15000, pt: 200, pf: 3500, esi: 0, tds: 15000, status: 'Pending Verification' },
  { id: 'EMP003', name: 'Alice Johnson', regime: 'New', declarations: 0, incomeTax: 45000, pt: 200, pf: 1800, esi: 0, tds: 45000, status: 'No Declarations' },
  { id: 'EMP004', name: 'Robert Brown', regime: 'Old', declarations: 120000, incomeTax: 5000, pt: 200, pf: 1500, esi: 350, tds: 5000, status: 'Verified' },
];

export const PayrollTax: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [taxData, setTaxData] = useState(MOCK_TAX);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);

  const filteredData = taxData.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingVerification = taxData.filter(t => t.status === 'Pending Verification').length;

  const handleCalculateTax = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      toast.success('Income Tax, PT, PF, ESI, and TDS recalculated successfully for all employees.');
    }, 1500);
  };

  const handleGenerateReport = () => {
    toast.success('Tax Report generated successfully.');
  };

  const handleExportStatement = () => {
    toast.success('Tax Statement exported as CSV.');
  };

  const openDetails = (emp: any) => {
    setSelectedEmp(emp);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tax Management</h1>
          <p className="text-slate-500">Automatically calculate TDS, PT, PF, and ESI based on employee declarations and regimes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-300 text-slate-700" onClick={handleExportStatement}>
            <Download className="w-4 h-4" /> Export Tax Statement
          </Button>
          <Button variant="outline" className="gap-2 border-slate-300 text-slate-700" onClick={handleGenerateReport}>
            <FileBarChart className="w-4 h-4" /> Generate Tax Report
          </Button>
          <Button 
            variant="primary" 
            className="gap-2"
            onClick={handleCalculateTax}
            disabled={isRecalculating}
          >
            <Calculator className={`w-4 h-4 ${isRecalculating ? 'animate-bounce' : ''}`} /> 
            {isRecalculating ? 'Calculating...' : 'Calculate Tax'}
          </Button>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total Employees</p>
            <p className="text-2xl font-black text-slate-900">{taxData.length}</p>
          </div>
          <Calculator className="w-8 h-8 text-blue-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Total Monthly TDS</p>
            <p className="text-2xl font-black text-rose-600">
              ₹{taxData.reduce((acc, curr) => acc + curr.tds, 0).toLocaleString()}
            </p>
          </div>
          <Percent className="w-8 h-8 text-rose-300" />
        </Card>
        <Card className="p-6 border-none shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Pending Declarations</p>
            <p className="text-2xl font-black text-amber-600">{pendingVerification}</p>
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
                <th className="p-4 font-semibold text-center">Regime</th>
                <th className="p-4 font-semibold text-right">Income Tax</th>
                <th className="p-4 font-semibold text-right">PF</th>
                <th className="p-4 font-semibold text-right">PT</th>
                <th className="p-4 font-semibold text-right">Monthly TDS</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">{t.regime}</span>
                  </td>
                  <td className="p-4 text-sm font-medium text-rose-600 text-right">₹{t.incomeTax.toLocaleString()}</td>
                  <td className="p-4 text-sm text-slate-700 text-right">₹{t.pf.toLocaleString()}</td>
                  <td className="p-4 text-sm text-slate-700 text-right">₹{t.pt.toLocaleString()}</td>
                  <td className="p-4 text-sm font-bold text-rose-600 text-right">₹{t.tds.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <Badge variant={
                      t.status === 'Verified' ? 'success' :
                      t.status === 'No Declarations' ? 'default' : 'warning'
                    } className="text-xs">
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1 text-slate-600 hover:text-primary-600 border-slate-200"
                      onClick={() => openDetails(t)}
                    >
                      <Eye className="w-4 h-4" /> Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Employee Tax Details"
      >
        {selectedEmp && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
               <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                  {selectedEmp.name.split(' ').map((n: string) => n[0]).join('')}
               </div>
               <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedEmp.name}</h3>
                  <p className="text-sm text-slate-500">{selectedEmp.id}</p>
               </div>
               <div className="ml-auto flex items-center gap-2">
                  <Badge variant="default">{selectedEmp.regime} Regime</Badge>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Declared Investments (80C, etc)</p>
                <p className="text-xl font-black text-emerald-600">₹{selectedEmp.declarations.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Calculated Monthly TDS</p>
                <p className="text-xl font-black text-rose-600">₹{selectedEmp.tds.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase">Tax Calculation Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Income Tax (Estimated Annual)</span>
                  <span className="font-medium text-slate-900">₹{(selectedEmp.incomeTax * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Provident Fund (PF)</span>
                  <span className="font-medium text-slate-900">₹{selectedEmp.pf.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Professional Tax (PT)</span>
                  <span className="font-medium text-slate-900">₹{selectedEmp.pt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Employee State Insurance (ESI)</span>
                  <span className="font-medium text-slate-900">₹{selectedEmp.esi.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
               <Button variant="outline" className="gap-2" onClick={() => setIsModalOpen(false)}>
                 <FileText className="w-4 h-4" /> View Full Tax History
               </Button>
               {selectedEmp.status === 'Pending Verification' && (
                 <Button variant="primary" onClick={() => {
                   setTaxData(prev => prev.map(t => t.id === selectedEmp.id ? { ...t, status: 'Verified' } : t));
                   toast.success('Declarations verified.');
                   setIsModalOpen(false);
                 }}>
                   Verify Declarations
                 </Button>
               )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
