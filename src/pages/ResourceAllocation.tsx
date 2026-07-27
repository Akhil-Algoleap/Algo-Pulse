import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  PieChart,
  UserX,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Select, Badge, Card, Input, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { Employee } from '../types';

interface Allocation {
  id: string;
  employee_id: string;
  employee_name: string;
  project_id: string;
  project_name: string;
  allocation_percentage: number;
  role: string;
}

const MOCK_PROJECTS = [
  { id: 'P1', name: 'HRMS' },
  { id: 'P2', name: 'CRM' },
  { id: 'P3', name: 'ERP System' }
];

const INITIAL_ALLOCATIONS: Allocation[] = [
  { id: 'A1', employee_id: 'EMP001', employee_name: 'Akhil', project_id: 'P1', project_name: 'HRMS', allocation_percentage: 100, role: 'Frontend Lead' },
  { id: 'A2', employee_id: 'EMP002', employee_name: 'Rahul', project_id: 'P2', project_name: 'CRM', allocation_percentage: 50, role: 'Backend Developer' },
  { id: 'A3', employee_id: 'EMP003', employee_name: 'Priya', project_id: 'P1', project_name: 'HRMS', allocation_percentage: 75, role: 'UI/UX Designer' }
];

export const ResourceAllocation: React.FC = () => {
  const [allocations, setAllocations] = useState<Allocation[]>(INITIAL_ALLOCATIONS);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState<'Allocated' | 'Bench'>('Allocated');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<Allocation | null>(null);
  const [formData, setFormData] = useState<Partial<Allocation>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await apiService.getEmployees();
        setEmployees(data || []);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleOpenModal = (allocation?: Allocation) => {
    if (allocation) {
      setEditingAllocation(allocation);
      setFormData({ ...allocation });
    } else {
      setEditingAllocation(null);
      setFormData({
        employee_id: '',
        project_id: '',
        allocation_percentage: 100,
        role: 'Developer'
      });
    }
    setIsModalOpen(true);
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this employee from the project?')) {
      setAllocations(prev => prev.filter(a => a.id !== id));
      toast.success('Employee removed from project');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.project_id || !formData.allocation_percentage) {
      return toast.error('Please fill in all required fields');
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedEmp = employees.find(e => e.id.toString() === formData.employee_id?.toString());
      const empName = selectedEmp?.employee_name || formData.employee_name || 'Unknown Employee';
      const selectedProj = MOCK_PROJECTS.find(p => p.id === formData.project_id);
      const projName = selectedProj?.name || formData.project_name || 'Unknown Project';

      if (editingAllocation) {
        setAllocations(prev => prev.map(a => a.id === editingAllocation.id ? {
          ...a,
          ...formData,
          employee_name: empName,
          project_name: projName
        } as Allocation : a));
        toast.success('Allocation updated successfully');
      } else {
        const newAllocation: Allocation = {
          ...(formData as Allocation),
          id: `A-${Date.now()}`,
          employee_name: empName,
          project_name: projName
        };
        setAllocations(prev => [newAllocation, ...prev]);
        toast.success('Employee assigned to project successfully');
      }

      setIsModalOpen(false);
      setIsSubmitting(false);
    }, 500);
  };

  // Calculate total allocations per employee to determine bench status
  const employeeAllocations = employees.map(emp => {
    const totalAllocation = allocations
      .filter(a => a.employee_id === emp.id.toString())
      .reduce((sum, current) => sum + current.allocation_percentage, 0);
    return { ...emp, totalAllocation };
  });

  const benchResources = employeeAllocations.filter(emp => emp.totalAllocation === 0);
  const partiallyAllocated = employeeAllocations.filter(emp => emp.totalAllocation > 0 && emp.totalAllocation < 100);

  const filteredAllocations = allocations.filter(a => 
    a.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBench = benchResources.filter(emp => 
    emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resource Allocation</h1>
          <p className="text-slate-500">Assign employees to projects and manage availability</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 shadow-lg shadow-primary-100">
          <Plus className="w-4 h-4" />
          Assign Resource
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-sm flex items-center gap-4 bg-gradient-to-br from-white to-slate-50">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Allocated</p>
            <p className="text-3xl font-black text-slate-900">{allocations.length}</p>
          </div>
        </Card>
        
        <Card className="p-6 border-none shadow-sm flex items-center gap-4 bg-gradient-to-br from-white to-slate-50">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Partial Allocation</p>
            <p className="text-3xl font-black text-slate-900">{partiallyAllocated.length}</p>
          </div>
        </Card>

        <Card className="p-6 border-none shadow-sm flex items-center gap-4 bg-gradient-to-br from-white to-slate-50">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">On Bench</p>
            <p className="text-3xl font-black text-slate-900">{benchResources.length}</p>
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="border-b border-slate-100 bg-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <button
              className={cn("text-sm font-bold pb-4 -mb-4 border-b-2 transition-colors", activeTab === 'Allocated' ? "text-primary-600 border-primary-600" : "text-slate-500 border-transparent hover:text-slate-700")}
              onClick={() => setActiveTab('Allocated')}
            >
              Allocated Resources
            </button>
            <button
              className={cn("text-sm font-bold pb-4 -mb-4 border-b-2 transition-colors", activeTab === 'Bench' ? "text-primary-600 border-primary-600" : "text-slate-500 border-transparent hover:text-slate-700")}
              onClick={() => setActiveTab('Bench')}
            >
              Bench Resources ({benchResources.length})
            </button>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search employee or project..." 
              className="pl-9 bg-slate-50 border-none h-10 text-sm focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'Allocated' ? (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Project</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Allocation</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAllocations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                         <UserCheck className="w-10 h-10 text-slate-200 mb-2" />
                         <p className="text-slate-400 font-medium">No allocated resources found</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredAllocations.map(allocation => (
                  <tr key={allocation.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center font-bold text-primary-700 text-xs shadow-sm border border-primary-200">
                          {allocation.employee_name.charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-slate-900">{allocation.employee_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{allocation.project_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{allocation.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-[150px]">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all", allocation.allocation_percentage === 100 ? "bg-primary-500" : "bg-orange-400")} 
                            style={{ width: `${allocation.allocation_percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 w-10">{allocation.allocation_percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors"
                          onClick={() => handleOpenModal(allocation)}
                          title="Change Allocation"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          onClick={() => handleRemove(allocation.id)}
                          title="Remove from Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Designation</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBench.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                         <UserX className="w-10 h-10 text-slate-200 mb-2" />
                         <p className="text-slate-400 font-medium">No resources on bench</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredBench.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shadow-sm">
                          {emp.employee_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{emp.employee_name}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{emp.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="warning" className="bg-orange-50 text-orange-600 border-orange-100">On Bench</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" onClick={() => handleOpenModal({ employee_id: emp.id.toString(), allocation_percentage: 100 } as any)}>
                        Assign to Project
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Assignment Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingAllocation ? "Edit Allocation" : "Assign Resource"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Employee *</label>
            <Select 
              required
              value={formData.employee_id || ''} 
              onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
              disabled={!!editingAllocation}
            >
              <option value="">Select an employee...</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.employee_name} ({e.role})</option>
              ))}
              {/* Fallback for mock initial data if employee not fetched yet */}
              {!employees.length && INITIAL_ALLOCATIONS.map(a => (
                <option key={a.employee_id} value={a.employee_id}>{a.employee_name}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Project *</label>
            <Select 
              required
              value={formData.project_id || ''} 
              onChange={(e) => setFormData({...formData, project_id: e.target.value})}
            >
              <option value="">Select a project...</option>
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Project Role</label>
            <Input 
              required
              placeholder="e.g. Frontend Developer" 
              value={formData.role || ''}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
              <span>Allocation Percentage *</span>
              <span className="text-primary-600 font-bold">{formData.allocation_percentage || 0}%</span>
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range"
                min="5"
                max="100"
                step="5"
                className="w-full accent-primary-600"
                value={formData.allocation_percentage || 100}
                onChange={(e) => setFormData({...formData, allocation_percentage: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-bold">
              <span>5%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4 mt-4 border-t border-slate-100">
            <Button variant="outline" className="flex-1 py-3" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button className="flex-1 py-3 shadow-lg shadow-primary-100" isLoading={isSubmitting} type="submit">
              {editingAllocation ? 'Update Allocation' : 'Assign Resource'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
