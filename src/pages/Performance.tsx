import React, { useEffect, useState } from 'react';
import { 
  Star, 
  Search,
  Eye,
  Target,
  FileBarChart,
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Card, Badge, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { PerformanceRecord, Employee } from '../types';

export const Performance: React.FC = () => {
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordEmployee, setSelectedRecordEmployee] = useState<Employee | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [perfRes, empRes] = await Promise.all([
        apiService.getPerformance(), 
        apiService.getEmployees()
      ]);
      setRecords(perfRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      toast.error('Failed to fetch performance data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            className={`w-3 h-3 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
          />
        ))}
      </div>
    );
  };

  const getLatestRecord = (employeeId: string) => {
    return records
      .filter(r => r.employee_id === employeeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedRecordEmployee(employee);
    setIsPreviewModalOpen(true);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Performance Management</h1>
          <p className="text-slate-500">View and manage employee performance reviews and appraisals</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-200 shadow-sm bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Performance Table */}
      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-primary-600" />
            Performance Matrix
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by name or ID..."
              className="w-full sm:w-80 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Loading performance data...</p>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No matching employees found
                  </td>
                </tr>
              ) : filteredEmployees.map((emp) => {
                const latest = getLatestRecord(emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all shadow-sm">
                          {emp.employee_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{emp.employee_name}</p>
                          <p className="text-xs text-slate-400 font-mono">#{emp.employee_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tight">{emp.department_id || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{latest?.rating || '---'}</span>
                          {latest && renderStars(latest.rating)}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {latest ? `Reviewed: ${new Date(latest.date).toLocaleDateString()}` : 'Awaiting review'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn(
                        "text-[10px] px-2 py-0.5 font-bold",
                        latest?.rating && latest.rating >= 4 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        latest?.rating && latest.rating >= 3 ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-slate-50 text-slate-500 border-slate-200"
                      )}>
                        {latest?.rating && latest.rating >= 4 ? 'Top Performer' : 
                         latest?.rating && latest.rating >= 3 ? 'On Track' : 'Not Rated'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => handleViewDetails(emp)}
                         className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                         title="View Detailed Appraisal"
                       >
                          <Eye className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Appraisal Details Modal */}
      <Modal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)} 
        title="Detailed Appraisal Log"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-xl bg-primary-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary-100">
              {selectedRecordEmployee?.employee_name.charAt(0)}
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">{selectedRecordEmployee?.employee_name}</h4>
              <p className="text-sm text-slate-500">Employee ID: {selectedRecordEmployee?.employee_id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Appraisal History</h5>
            {records.filter(r => r.employee_id === selectedRecordEmployee?.id).length === 0 ? (
               <div className="py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                 <Target className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                 <p className="text-slate-400 text-sm">No appraisal history available.</p>
               </div>
            ) : (
              records
                .filter(r => r.employee_id === selectedRecordEmployee?.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record) => (
                  <div key={record.id} className="relative pl-6 border-l-2 border-primary-100 pb-8 last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary-500" />
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">{new Date(record.date).toLocaleDateString()}</span>
                       {renderStars(record.rating)}
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-600 italic leading-relaxed font-medium">"{record.feedback}"</p>
                    </div>
                  </div>
                ))
            )}
          </div>
          
          <div className="pt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsPreviewModalOpen(false)}>Close</Button>
            <Button className="flex-1">Add New Review</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
