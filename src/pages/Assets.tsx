import React, { useEffect, useState } from 'react';
import { 
  Laptop, 
  BatteryCharging, 
  MousePointer2,
  Keyboard,
  Search,
  CheckCircle2,
  Plus,
  Edit2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Select, Badge, Card, Input, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { Employee, Asset } from '../types';

interface JoinedEmployeeAsset extends Employee {
  asset_id?: string;
  laptop_serial?: string;
  charger_serial?: string;
  has_mouse_assigned?: boolean;
  has_keyboard_assigned?: boolean;
  assignment_status?: string;
  assignment_date?: string;
}

export const Assets: React.FC = () => {
  const [joinedData, setJoinedData] = useState<JoinedEmployeeAsset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    employee_id: '',
    laptop_serial: '',
    charger_serial: '',
    has_mouse: false,
    has_keyboard: false
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [empRes, assetRes] = await Promise.all([
        apiService.getEmployees(),
        apiService.getAssets()
      ]);
      
      const allEmployees: Employee[] = empRes.data;
      const allAssets: Asset[] = assetRes.data || [];
      setEmployees(allEmployees);

      // Join data
      const joined = allEmployees.map(emp => {
        const asset = allAssets.find(a => a.employee_id?.toString() === emp.id.toString());
        return {
          ...emp,
          asset_id: asset?.employee_id,
          laptop_serial: asset?.laptop_serial_number,
          charger_serial: asset?.charger_serial_number,
          has_mouse_assigned: asset?.has_mouse,
          has_keyboard_assigned: asset?.has_keyboard,
          assignment_status: asset?.status || 'Not Assigned',
          assignment_date: asset?.last_assigned_date
        };
      });

      setJoinedData(joined);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (row?: JoinedEmployeeAsset) => {
    if (row) {
      setFormData({
        employee_id: row.id,
        laptop_serial: row.laptop_serial || '',
        charger_serial: row.charger_serial || '',
        has_mouse: !!row.has_mouse_assigned,
        has_keyboard: !!row.has_keyboard_assigned
      });
    } else {
      setFormData({
        employee_id: '',
        laptop_serial: '',
        charger_serial: '',
        has_mouse: false,
        has_keyboard: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee_id) return toast.error('Please select an employee');
    
    setIsSubmitting(true);
    try {
      const selectedEmp = employees.find(e => e.id.toString() === formData.employee_id.toString());
      
      // 1. Manage Assets Sheet (Inventory/History)
      const assetRes = await apiService.getAssets();
      const existingAsset = (assetRes.data || []).find((a: any) => 
        a.employee_id?.toString() === formData.employee_id.toString()
      );

      const payload = {
        employee_id: formData.employee_id,
        employee_name: selectedEmp?.employee_name || 'Unknown',
        laptop_serial_number: formData.laptop_serial,
        charger_serial_number: formData.charger_serial,
        has_mouse: formData.has_mouse,
        has_keyboard: formData.has_keyboard,
        status: 'Assigned',
        last_assigned_date: new Date().toLocaleDateString()
      };

      if (existingAsset) {
        // UPDATE Existing Row (using employee_id as the unique key)
        await apiService.updateAsset(formData.employee_id, payload);
        toast.success('Asset assignment updated successfully');
      } else {
        // CREATE New Row
        await apiService.createAsset(payload);
        toast.success('Assets assigned and recorded successfully');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error('Failed to save assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData = joinedData.filter(row => 
    row.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
          <p className="text-slate-500">Track and manage company hardware distribution</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 shadow-lg shadow-primary-100">
          <Plus className="w-4 h-4" />
          Add Assets
        </Button>
      </div>

      {/* Distribution Table */}
      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Laptop className="w-5 h-5 text-primary-600" />
            Inventory Distribution
          </h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search employee name or ID..." 
              className="pl-9 bg-slate-50 border-none h-10 text-sm focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Laptop Details</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Charger Details</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Peripherals</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                       <Search className="w-10 h-10 text-slate-200 mb-2" />
                       <p className="text-slate-400 font-medium">No results found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm shadow-sm">
                        {row.employee_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{row.employee_name}</p>
                        <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">{row.employee_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {row.laptop_serial ? (
                      <div className="flex items-center gap-2">
                        <Laptop className="w-3 h-3 text-slate-400" />
                        <span className="text-sm font-mono font-medium text-slate-700">{row.laptop_serial}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-slate-300 border-slate-100 font-medium">Not Assigned</Badge>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {row.charger_serial ? (
                      <div className="flex items-center gap-2">
                        <BatteryCharging className="w-3 h-3 text-slate-400" />
                        <span className="text-sm font-mono font-medium text-slate-700">{row.charger_serial}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-slate-300 border-slate-100 font-medium">Not Assigned</Badge>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      {row.has_mouse_assigned ? (
                        <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] py-0.5 px-2">Mouse</Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-200 border-slate-50 text-[10px] py-0.5 px-2">Mouse</Badge>
                      )}
                      {row.has_keyboard_assigned ? (
                        <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] py-0.5 px-2">Keyboard</Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-200 border-slate-50 text-[10px] py-0.5 px-2">Keyboard</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors"
                      onClick={() => handleOpenModal(row)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Assignment Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Asset Assignment"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Employee</label>
            <Select 
              required
              value={formData.employee_id} 
              onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
            >
              <option value="">Choose Employee...</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.employee_name} ({e.employee_id})</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Laptop SN</label>
              <div className="relative">
                <Laptop className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="SN123456" 
                  className="pl-10"
                  value={formData.laptop_serial}
                  onChange={(e) => setFormData({...formData, laptop_serial: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Charger SN</label>
              <div className="relative">
                <BatteryCharging className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="CH987654" 
                  className="pl-10"
                  value={formData.charger_serial}
                  onChange={(e) => setFormData({...formData, charger_serial: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={cn(
              "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
              formData.has_mouse ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
            )}>
              <div className="flex items-center gap-3">
                <MousePointer2 className="w-5 h-5" />
                <span className="text-sm font-bold">Mouse</span>
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={formData.has_mouse}
                onChange={(e) => setFormData({...formData, has_mouse: e.target.checked})}
              />
              {formData.has_mouse && <CheckCircle2 className="w-5 h-5" />}
            </label>

            <label className={cn(
              "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
              formData.has_keyboard ? "border-primary-500 bg-primary-50 text-primary-700" : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
            )}>
              <div className="flex items-center gap-3">
                <Keyboard className="w-5 h-5" />
                <span className="text-sm font-bold">Keyboard</span>
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={formData.has_keyboard}
                onChange={(e) => setFormData({...formData, has_keyboard: e.target.checked})}
              />
              {formData.has_keyboard && <CheckCircle2 className="w-5 h-5" />}
            </label>
          </div>

          <div className="flex gap-4 pt-2">
            <Button variant="outline" className="flex-1 py-3" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button className="flex-1 py-3 shadow-lg shadow-primary-100" isLoading={isSubmitting} type="submit">Save Assignment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
