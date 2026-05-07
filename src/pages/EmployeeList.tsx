import React, { useEffect, useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit2,
  Trash2,
  Mail,
  ArrowUpDown,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { Button, Badge, Card } from '../components/UI';
import { Modal } from '../components/Modal';
import { EmployeeForm } from '../components/EmployeeForm';
import { apiService } from '../services/api';
import { Employee, Lookups, EmployeeFormData } from '../types';

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [lookups, setLookups] = useState<Lookups>({
    departments: [],
    designations: [],
    clients: [],
    workplaces: [],
    employees: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [empRes, lookupRes] = await Promise.all([
        apiService.getEmployees(),
        apiService.getLookups()
      ]);
      
      setEmployees(empRes.data);
      setLookups({
        ...lookupRes,
        employees: empRes.data.map((e: any) => ({ id: e.id, employee_name: e.employee_name }))
      });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch employee records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      if (editingEmployee) {
        await apiService.updateEmployee(editingEmployee.id, data);
        toast.success('Employee updated successfully');
      } else {
      await apiService.createEmployee(data);
      toast.success('Employee added successfully');
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
    fetchData();
  } catch (error: any) {
    const message = error.response?.data?.error || 'An error occurred';
    toast.error(message);
  }
};

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteEmployee(id);
      toast.success('Employee deleted successfully');
      fetchData();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete employee';
      toast.error(message);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        if (data.length === 0) {
          toast.error('The file is empty');
          return;
        }

        // Map data and resolve IDs by name
        const processedData = data.map(row => {
          const dept = lookups.departments.find(d => d.department_name.toLowerCase() === row.Department?.toString().toLowerCase());
          const desig = lookups.designations.find(d => d.designation_name.toLowerCase() === row.Designation?.toString().toLowerCase());
          const client = lookups.clients.find(c => c.client_name.toLowerCase() === row.Client?.toString().toLowerCase());
          const work = lookups.workplaces.find(w => w.workplace_name.toLowerCase() === row.Workplace?.toString().toLowerCase());

          return {
            employee_id: row.EmployeeID?.toString() || `EMP${Math.floor(Math.random() * 1000)}`,
            employee_name: row.Name || 'Unknown',
            email: row.Email || '',
            phone: row.Phone?.toString() || '',
            joining_date: row.JoiningDate || new Date().toISOString().split('T')[0],
            department_id: dept?.id || lookups.departments[0]?.id,
            designation_id: desig?.id || lookups.designations[0]?.id,
            client_id: client?.id || lookups.clients[0]?.id,
            workplace_id: work?.id || lookups.workplaces[0]?.id,
            status: row.Status || 'Active',
            experience_years: Number(row.Experience) || 0
          };
        });

        await apiService.bulkCreateEmployees(processedData);
        toast.success(`Successfully imported ${processedData.length} employees`);
        fetchData();
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error(error);
        toast.error('Failed to parse Excel file. Ensure it follows the template.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        EmployeeID: 'EMP001',
        Name: 'John Doe',
        Email: 'john@example.com',
        Phone: '1234567890',
        JoiningDate: '2023-01-01',
        Department: 'Engineering',
        Designation: 'Software Engineer',
        Client: 'Google',
        Workplace: 'New York Office',
        Status: 'Active',
        Experience: 5
      }
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'Employee_Import_Template.xlsx');
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !deptFilter || emp.department_id === deptFilter;
    const matchesStatus = !statusFilter || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Resigned': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
          <p className="text-slate-500">Manage your workforce and handle bulk operations</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleImport}
          />
          <Button variant="outline" className="flex items-center gap-2" onClick={downloadTemplate}>
            <Download className="w-4 h-4" />
            Template
          </Button>
          <Button variant="secondary" className="flex items-center gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" />
            Bulk Import
          </Button>
          <Button onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }} className="shadow-lg shadow-primary-100">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-0 border-none shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="relative p-4">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-transparent text-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="p-4">
            <select 
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-transparent text-sm outline-none appearance-none"
            >
              <option value="">All Departments</option>
              {lookups.departments.map(d => (
                <option key={d.id} value={d.id}>{d.department_name}</option>
              ))}
            </select>
          </div>
          <div className="p-4">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent text-sm outline-none appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2">Employee <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dept & Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Assignment</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing workforce...</p>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No records match your filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                          {emp.employee_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{emp.employee_name}</p>
                          <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">
                        {lookups.departments.find(d => d.id === emp.department_id)?.department_name || 'N/A'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {lookups.designations.find(d => d.id === emp.designation_id)?.designation_name || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm font-medium text-slate-600">
                        {lookups.clients.find(c => c.id === emp.client_id)?.client_name || 'Direct'}
                       </p>
                       <p className="text-[10px] text-slate-400">
                        {lookups.workplaces.find(w => w.id === emp.workplace_id)?.workplace_name || 'On-site'}
                       </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={getStatusVariant(emp.status)} className="text-[10px] px-2 py-0.5">
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          onClick={() => { setEditingEmployee(emp); setIsModalOpen(true); }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          onClick={() => handleDelete(emp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{filteredEmployees.length}</span> Records
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-[10px] uppercase font-black" disabled>Prev</Button>
            <Button variant="outline" size="sm" className="text-[10px] uppercase font-black" disabled>Next</Button>
          </div>
        </div>
      </Card>

      {/* Modal for Add/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingEmployee ? 'Update Profile' : 'Register New Employee'}
      >
        <EmployeeForm 
          initialData={editingEmployee || undefined} 
          lookups={lookups} 
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};
