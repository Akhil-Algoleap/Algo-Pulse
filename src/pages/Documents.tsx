import React, { useEffect, useState } from 'react';
import { 
  Eye,
  Search,
  FileText,
  Download,
  Filter,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { Document, Employee } from '../types';

export const Documents: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeDocs, setEmployeeDocs] = useState<Document[]>([]);
  const [docTypeFilter, setDocTypeFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const empRes = await apiService.getEmployees();
      setEmployees(empRes.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewEmployeeDocs = async (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsLoading(true);
    try {
      const docRes = await apiService.getDocuments(emp.id);
      setEmployeeDocs(docRes.data);
      setDocTypeFilter('');
      setIsPreviewModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch documents for this employee');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs = employeeDocs.filter(doc => 
    !docTypeFilter || doc.type === docTypeFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Hub</h1>
          <p className="text-slate-500">Administrative employee document repository</p>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search employee name or ID..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading && employees.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee Profile</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Department</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Documents</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 flex items-center justify-center font-black text-primary-600 shadow-sm group-hover:scale-110 transition-transform">
                        {emp.employee_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1.5">{emp.employee_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{emp.employee_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-100 text-[10px] font-bold">Engineering</Badge>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => handleViewEmployeeDocs(emp)}
                      className="p-3 bg-primary-50 text-primary-600 rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-primary-100 flex items-center gap-2 mx-auto"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-tight">View Docs</span>
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Badge variant={emp.status === 'Active' ? 'success' : 'secondary'} className="text-[10px] font-bold px-3 py-1">
                      {emp.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Document Detail Modal */}
      <Modal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)}
        title="Employee Documents"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-5 bg-primary-600 rounded-3xl text-white shadow-xl shadow-primary-100">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl border border-white/30">
              {selectedEmployee?.employee_name.charAt(0)}
            </div>
            <div>
              <h4 className="text-lg font-bold">{selectedEmployee?.employee_name}</h4>
              <p className="text-xs text-primary-100 font-medium tracking-wide">ID: {selectedEmployee?.employee_id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document List</h5>
              <div className="flex items-center gap-2">
                <Filter className="w-3 h-3 text-slate-400" />
                <select 
                  className="text-xs font-bold text-slate-600 bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-primary-500 py-1"
                  value={docTypeFilter}
                  onChange={(e) => setDocTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Resume">Resume</option>
                  <option value="ID Proof">ID Proof</option>
                  <option value="Offer Letter">Offer Letter</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {filteredDocs.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <FileText className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 text-sm font-medium">No documents found for this criteria.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="group p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-primary-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-primary-50 text-slate-400 group-hover:text-primary-600 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{doc.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-primary-50 hover:text-primary-600">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button variant="outline" className="w-full py-3 rounded-2xl font-bold" onClick={() => setIsPreviewModalOpen(false)}>
            Close Repository
          </Button>
        </div>
      </Modal>
    </div>
  );
};
