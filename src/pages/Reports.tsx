import React, { useState } from 'react';
import { Card, Button, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { BarChart, Filter, Download, FileText, FileSpreadsheet, FileIcon, Settings, ChevronRight, CheckSquare, Calendar, Banknote, TrendingUp, Users, Laptop } from 'lucide-react';
import toast from 'react-hot-toast';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Custom Builder State
  const [builderSource, setBuilderSource] = useState<string>('employees');
  const [builderColumns, setBuilderColumns] = useState<string[]>([]);
  const [builderDateRange, setBuilderDateRange] = useState('Last 30 Days');

  const categories = [
    {
      title: 'Employee Reports',
      icon: <Users className="w-5 h-5 text-blue-500" />,
      reports: ['Headcount Report', 'Joining Report', 'Exit Report', 'Diversity Metrics']
    },
    {
      title: 'Attendance Reports',
      icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
      reports: ['Present Report', 'Absent Report', 'Late Coming Report', 'Overtime Summary']
    },
    {
      title: 'Leave Reports',
      icon: <Calendar className="w-5 h-5 text-amber-500" />,
      reports: ['Leave Balance Summary', 'Leave Consumption Analysis', 'Unpaid Leave Log']
    },
    {
      title: 'Payroll Reports',
      icon: <Banknote className="w-5 h-5 text-rose-500" />,
      reports: ['Salary Register', 'Tax Deductions', 'Bonus Payouts']
    },
    {
      title: 'Performance Reports',
      icon: <TrendingUp className="w-5 h-5 text-indigo-500" />,
      reports: ['KPI Scores', 'Review Cycle Progress', '9-Box Grid']
    },
    {
      title: 'Recruitment Reports',
      icon: <Users className="w-5 h-5 text-purple-500" />,
      reports: ['Time to Hire', 'Source of Hire', 'Pipeline Activity']
    },
    {
      title: 'Asset Reports',
      icon: <Laptop className="w-5 h-5 text-slate-500" />,
      reports: ['Asset Inventory', 'Assets by Department', 'Repair Logs']
    }
  ];

  const dataSourceOptions = {
    employees: ['Employee ID', 'Name', 'Department', 'Designation', 'Join Date', 'Status', 'Location'],
    attendance: ['Date', 'Employee', 'Clock In', 'Clock Out', 'Status', 'Total Hours'],
    leaves: ['Employee', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Manager'],
  };

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV', reportName: string) => {
    setIsExporting(true);
    toast.loading(`Generating ${format}...`, { id: 'export' });
    
    // Simulate network delay
    setTimeout(() => {
      toast.success(`${reportName.replace(' ', '_')}.${format.toLowerCase()} downloaded successfully!`, { id: 'export' });
      setIsExporting(false);
    }, 1500);
  };

  const toggleBuilderColumn = (col: string) => {
    setBuilderColumns(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports Center</h1>
          <p className="text-slate-500">Generate, analyze, and export enterprise data.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('standard')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === 'standard' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          <BarChart className="w-4 h-4" /> Standard Reports
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === 'custom' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          <Settings className="w-4 h-4" /> Custom Report Builder
        </button>
      </div>

      {activeTab === 'standard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in">
          {categories.map((category, idx) => (
            <Card key={idx} className="p-0 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                  {category.icon}
                </div>
                <h3 className="font-bold text-slate-900">{category.title}</h3>
              </div>
              <div className="p-2 flex-1">
                {category.reports.map((report, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => setSelectedReport(report)}
                    className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition-colors group"
                  >
                    <span>{report}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="animate-in fade-in">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Build Custom Report</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary-600 font-bold">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-sm">1</div>
                  Data Source
                </div>
                <select 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={builderSource}
                  onChange={(e) => {
                    setBuilderSource(e.target.value);
                    setBuilderColumns([]); // Reset columns on source change
                  }}
                >
                  <option value="employees">Employees</option>
                  <option value="attendance">Attendance</option>
                  <option value="leaves">Leaves</option>
                </select>
                
                <div className="pt-4 flex items-center gap-2 text-primary-600 font-bold">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-sm">2</div>
                  Date Range
                </div>
                <select 
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={builderDateRange}
                  onChange={(e) => setBuilderDateRange(e.target.value)}
                >
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="This Week">This Week</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="This Quarter">This Quarter</option>
                  <option value="This Year">This Year</option>
                  <option value="Custom">Custom Range...</option>
                </select>
              </div>

              {/* Step 2 */}
              <div className="md:col-span-2 space-y-4 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8 pt-4 md:pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary-600 font-bold">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-sm">3</div>
                    Select Columns
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setBuilderColumns(dataSourceOptions[builderSource as keyof typeof dataSourceOptions])}
                  >
                    Select All
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dataSourceOptions[builderSource as keyof typeof dataSourceOptions].map(col => (
                    <label 
                      key={col} 
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        builderColumns.includes(col) ? "bg-primary-50 border-primary-200" : "bg-white border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                        checked={builderColumns.includes(col)}
                        onChange={() => toggleBuilderColumn(col)}
                      />
                      <span className="text-sm font-medium text-slate-700">{col}</span>
                    </label>
                  ))}
                </div>
                
                {builderColumns.length === 0 && (
                  <p className="text-sm text-rose-500 pt-2">Please select at least one column to generate the report.</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <span className="text-sm text-slate-500">{builderColumns.length} columns selected</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  disabled={builderColumns.length === 0 || isExporting}
                  onClick={() => handleExport('CSV', `Custom_${builderSource}_Report`)}
                >
                  <FileText className="w-4 h-4 mr-2" /> CSV
                </Button>
                <Button 
                  variant="outline" 
                  disabled={builderColumns.length === 0 || isExporting}
                  onClick={() => handleExport('Excel', `Custom_${builderSource}_Report`)}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
                </Button>
                <Button 
                  disabled={builderColumns.length === 0 || isExporting}
                  onClick={() => handleExport('PDF', `Custom_${builderSource}_Report`)}
                >
                  <FileIcon className="w-4 h-4 mr-2" /> Generate PDF
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Report Viewer Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport || ''}
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1">Date Range</label>
                <select className="p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-primary-500 bg-white">
                  <option>Last 30 Days</option>
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Year to Date</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                <select className="p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-primary-500 bg-white">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>HR</option>
                  <option>Sales</option>
                </select>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" /> Apply Filters
            </Button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-16 text-center bg-slate-50">
              <BarChart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Data Preview available upon generation</p>
              <p className="text-xs text-slate-400 mt-1">Export to view full details</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button 
              variant="outline" 
              onClick={() => handleExport('CSV', selectedReport || 'Report')}
              disabled={isExporting}
            >
              <FileText className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExport('Excel', selectedReport || 'Report')}
              disabled={isExporting}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
            </Button>
            <Button 
              onClick={() => handleExport('PDF', selectedReport || 'Report')}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
