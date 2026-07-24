import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Branch } from '../types';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { MapPin, Plus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    branch_head_id: '',
    working_hours: '',
    holidays_count: '',
    attendance_device_enabled: false,
    payroll_rules: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data } = await apiService.getBranches();
      setBranches(data);
    } catch (error) {
      toast.error('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranch.name || !newBranch.address) {
      toast.error('Branch name and address are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: newBranch.name,
        address: newBranch.address,
        branch_head_id: newBranch.branch_head_id || undefined,
        working_hours: newBranch.working_hours,
        holidays_count: newBranch.holidays_count ? Number(newBranch.holidays_count) : 0,
        attendance_device_enabled: newBranch.attendance_device_enabled,
        payroll_rules: newBranch.payroll_rules
      };
      
      const { data } = await apiService.createBranch(payload);
      setBranches([...branches, data]);
      setIsModalOpen(false);
      setNewBranch({ name: '', address: '', branch_head_id: '', working_hours: '', holidays_count: '', attendance_device_enabled: false, payroll_rules: '' });
      toast.success('Branch created successfully');
    } catch (error) {
      toast.error('Failed to create branch');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading branches...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Branches</h1>
          <p className="text-slate-500 mt-1">Manage office locations and global branches</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Branch
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Branch Head</th>
                <th className="px-6 py-4 font-semibold">Working Hours</th>
                <th className="px-6 py-4 font-semibold text-center">Holidays</th>
                <th className="px-6 py-4 font-semibold text-center">eSSL Device</th>
                <th className="px-6 py-4 font-semibold">Payroll Rules</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branches.map((branch, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{branch.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{branch.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${branch.branch_head_id || 'User'}`} alt="Avatar" />
                      </div>
                      <span className="text-slate-700">{branch.branch_head_id || 'Not Assigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <Badge variant="outline">{branch.working_hours || 'Standard'}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="secondary">{branch.holidays_count}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {branch.attendance_device_enabled 
                      ? <Badge variant="success" className="flex inline-flex items-center gap-1"><Check className="w-3 h-3"/> Active</Badge> 
                      : <Badge variant="default" className="flex inline-flex items-center gap-1"><X className="w-3 h-3"/> None</Badge>}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {branch.payroll_rules || 'Default'}
                  </td>
                </tr>
              ))}
              {branches.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No branches found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Branch">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Name (City/Region)</label>
              <input
                type="text"
                value={newBranch.name}
                onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Hyderabad"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
              <textarea
                value={newBranch.address}
                onChange={e => setNewBranch({ ...newBranch, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 4th Floor, Tech Park..."
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Head ID</label>
              <input
                type="text"
                value={newBranch.branch_head_id}
                onChange={e => setNewBranch({ ...newBranch, branch_head_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. EMP001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Working Hours</label>
              <input
                type="text"
                value={newBranch.working_hours}
                onChange={e => setNewBranch({ ...newBranch, working_hours: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 9 AM - 6 PM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Holidays Count</label>
              <input
                type="number"
                value={newBranch.holidays_count}
                onChange={e => setNewBranch({ ...newBranch, holidays_count: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payroll Rules</label>
              <input
                type="text"
                value={newBranch.payroll_rules}
                onChange={e => setNewBranch({ ...newBranch, payroll_rules: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Standard India"
              />
            </div>
            <div className="col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                id="essl_device"
                checked={newBranch.attendance_device_enabled}
                onChange={e => setNewBranch({ ...newBranch, attendance_device_enabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="essl_device" className="ml-2 text-sm font-medium text-slate-700">
                Enable Physical eSSL Attendance Device Integration
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateBranch} disabled={saving}>{saving ? 'Saving...' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
