import React from 'react';
import { 
  BarChart, 
  Download, 
  PieChart, 
  TrendingUp,
  FileText,
  Building2,
  Plane,
  ShoppingCart,
  Users
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import toast from 'react-hot-toast';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const REPORT_TYPES = [
  { id: 'payroll', title: 'Payroll Cost', icon: Users, desc: 'Detailed breakdown of monthly payroll expenses.' },
  { id: 'expense', title: 'Expense Report', icon: FileText, desc: 'Employee general out-of-pocket expenses.' },
  { id: 'travel', title: 'Travel Expense', icon: Plane, desc: 'Flight, hotel, and domestic travel costs.' },
  { id: 'budget', title: 'Department Budget', icon: PieChart, desc: 'Budget allocation vs actual consumption.' },
  { id: 'vendor', title: 'Vendor Payment', icon: Building2, desc: 'Historical payments made to external vendors.' },
  { id: 'purchase', title: 'Purchase Report', icon: ShoppingCart, desc: 'Internal department asset purchases.' },
  { id: 'monthly', title: 'Monthly Financial', icon: TrendingUp, desc: 'Aggregated monthly P&L summary.' },
  { id: 'annual', title: 'Annual Cost', icon: BarChart, desc: 'Year-over-year operational cost comparison.' }
];

const mockData = [
  { name: 'Jan', payroll: 400000, travel: 24000, vendor: 120000 },
  { name: 'Feb', payroll: 410000, travel: 13980, vendor: 110000 },
  { name: 'Mar', payroll: 405000, travel: 98000, vendor: 150000 },
  { name: 'Apr', payroll: 415000, travel: 39080, vendor: 140000 },
  { name: 'May', payroll: 420000, travel: 48000, vendor: 130000 },
  { name: 'Jun', payroll: 420000, travel: 38000, vendor: 125000 },
];

export const FinanceReports: React.FC = () => {

  const handleExport = (type: string, format: 'Excel' | 'PDF' | 'CSV') => {
    toast.success(`Exporting ${type} report as ${format}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate, view, and export company financial data.</p>
        </div>
      </div>

      {/* Overview Chart */}
      <Card className="p-6 bg-white border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-6">YTD Expense Overview</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip 
                cursor={{fill: '#F8FAFC'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
              />
              <Bar dataKey="payroll" name="Payroll" fill="#0F172A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vendor" name="Vendor Payments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="travel" name="Travel & Expenses" fill="#10B981" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORT_TYPES.map((report) => (
          <Card key={report.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <report.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900">{report.title}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{report.desc}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport(report.title, 'Excel')} className="w-full text-xs gap-1 hover:bg-green-50 hover:text-green-700 hover:border-green-200">
                <Download className="w-3 h-3" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport(report.title, 'PDF')} className="w-full text-xs gap-1 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200">
                <Download className="w-3 h-3" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport(report.title, 'CSV')} className="w-full text-xs gap-1 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                <Download className="w-3 h-3" /> CSV
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
