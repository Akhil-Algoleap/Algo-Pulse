import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Department } from '../types';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { Layers, Plus, Users, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    department_name: '',
    department_head_id: '',
    budget: '',
    cost_center: '',
    projects: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await apiService.getDepartments();
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDept.department_name) {
      toast.error('Department name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        department_name: newDept.department_name,
        department_head_id: newDept.department_head_id || undefined,
        budget: newDept.budget ? Number(newDept.budget) : undefined,
        cost_center: newDept.cost_center || undefined,
        projects: newDept.projects || undefined
      };
      
      const { data } = await apiService.createDepartment(payload);
      setDepartments([...departments, data]);
      setIsModalOpen(false);
      setNewDept({ department_name: '', department_head_id: '', budget: '', cost_center: '', projects: '' });
      toast.success('Department created successfully');
    } catch (error) {
      toast.error('Failed to create department');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading departments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-slate-500 mt-1">Manage organizational units and cost centers</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Department
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Cost Center</th>
                <th className="px-6 py-4 font-semibold">Head of Department</th>
                <th className="px-6 py-4 font-semibold text-right">Budget</th>
                <th className="px-6 py-4 font-semibold text-center">Projects</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-900">{dept.department_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {dept.cost_center || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dept.department_head_id || 'User'}`} alt="Avatar" />
                      </div>
                      <span className="text-slate-700">{dept.department_head_id || 'Not Assigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">
                    {dept.budget ? `₹${dept.budget.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="secondary">{(dept as any).projects || Math.floor(Math.random() * 5) + 1}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="success">Active</Badge>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No departments found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Department">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
            <input
              type="text"
              value={newDept.department_name}
              onChange={e => setNewDept({ ...newDept, department_name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Engineering"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cost Center Code</label>
            <input
              type="text"
              value={newDept.cost_center}
              onChange={e => setNewDept({ ...newDept, cost_center: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. CC-ENG"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department Head (ID or Name)</label>
            <input
              type="text"
              value={newDept.department_head_id}
              onChange={e => setNewDept({ ...newDept, department_head_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. EMP001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                value={newDept.budget}
                onChange={e => setNewDept({ ...newDept, budget: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 500000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Active Projects</label>
            <input
              type="text"
              value={newDept.projects}
              onChange={e => setNewDept({ ...newDept, projects: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. 3"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateDepartment} disabled={saving}>{saving ? 'Saving...' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
