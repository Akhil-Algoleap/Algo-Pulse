import React, { useState } from 'react';
import { 
  Download, 
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Percent,
  ShieldCheck,
  Gift,
  CreditCard,
  Receipt
} from 'lucide-react';
import { Card, Button, cn } from '../components/UI';
import toast from 'react-hot-toast';

const REPORT_TYPES = [
  { id: 'payroll_monthly', title: 'Monthly Payroll Report', icon: Users, desc: 'Detailed breakdown of monthly payroll expenses.' },
  { id: 'payroll_dept', title: 'Department Payroll Cost', icon: Briefcase, desc: 'Payroll cost grouped by department.' },
  { id: 'salary_revision', title: 'Salary Revision Report', icon: TrendingUp, desc: 'Log of all salary hikes and adjustments.' },
  { id: 'overtime', title: 'Overtime Report', icon: Clock, desc: 'Approved overtime hours and calculated payouts.' },
  { id: 'tax', title: 'Tax Report', icon: Percent, desc: 'Employee TDS and tax declarations.' },
  { id: 'pf', title: 'PF Report', icon: ShieldCheck, desc: 'Provident Fund contributions and liabilities.' },
  { id: 'esi', title: 'ESI Report', icon: ShieldCheck, desc: 'Employee State Insurance liability logs.' },
  { id: 'bonus', title: 'Bonus Report', icon: Gift, desc: 'Variable pay and spot award payouts.' },
  { id: 'loan', title: 'Loan Report', icon: CreditCard, desc: 'Active loans, advances, and EMI schedules.' },
  { id: 'reimbursement', title: 'Reimbursement Report', icon: Receipt, desc: 'Approved expense claims processed via payroll.' }
];

export const PayrollReports: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'Excel' | 'PDF' | 'CSV'>('Excel');

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} as ${selectedFormat}...`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and export payroll data, compliance reports, and financial breakdowns.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {['Excel', 'PDF', 'CSV'].map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format as 'Excel' | 'PDF' | 'CSV')}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                selectedFormat === format 
                  ? "bg-slate-100 text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORT_TYPES.map((report) => (
          <Card key={report.id} className="p-6 bg-white border-slate-200 hover:border-primary-300 transition-colors group flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <report.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{report.title}</h3>
              <p className="text-sm text-slate-500 mb-6">{report.desc}</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => handleExport(report.title)}
            >
              <Download className="w-4 h-4" /> Export as {selectedFormat}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
