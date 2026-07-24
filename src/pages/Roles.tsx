import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Role, RolePermission } from '../types';
import { Card, Button, Badge, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { Shield, Plus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const defaultModules = ['Employees', 'Payroll', 'Leave', 'Assets', 'Projects', 'Finance'];

export const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newPermissions, setNewPermissions] = useState<RolePermission[]>(
    defaultModules.map(m => ({ module: m, view: false, create: false, edit: false, delete: false, approve: false }))
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data } = await apiService.getRoles();
      setRoles(data);
      if (data.length > 0 && !selectedRole) {
        setSelectedRole(data[0]);
      }
    } catch (error) {
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName) {
      toast.error('Please enter a role name');
      return;
    }
    setSaving(true);
    try {
      const { data } = await apiService.createRole({ name: newRoleName, permissions: newPermissions });
      setRoles([...roles, data]);
      setSelectedRole(data);
      setIsModalOpen(false);
      setNewRoleName('');
      setNewPermissions(defaultModules.map(m => ({ module: m, view: false, create: false, edit: false, delete: false, approve: false })));
      toast.success('Custom role created successfully');
    } catch (error) {
      toast.error('Failed to create role');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (moduleName: string, field: keyof RolePermission) => {
    setNewPermissions(prev => prev.map(p => {
      if (p.module === moduleName) {
        return { ...p, [field]: !p[field] };
      }
      return p;
    }));
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading roles...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="text-slate-500 mt-1">Manage system access and privileges</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 p-0 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary-500" />
              Available Roles
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between",
                  selectedRole?.id === role.id 
                    ? "bg-primary-50 text-primary-700 font-medium" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {role.name}
                {role.is_custom && <Badge variant="secondary">Custom</Badge>}
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3 p-0 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{selectedRole?.name}</h3>
              <p className="text-sm text-slate-500">Permission Matrix</p>
            </div>
            {selectedRole?.is_custom && (
              <Badge variant="warning">Custom Role</Badge>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Module</th>
                    <th className="px-4 py-4 font-semibold text-center w-24">View</th>
                    <th className="px-4 py-4 font-semibold text-center w-24">Create</th>
                    <th className="px-4 py-4 font-semibold text-center w-24">Edit</th>
                    <th className="px-4 py-4 font-semibold text-center w-24">Delete</th>
                    <th className="px-4 py-4 font-semibold text-center w-24">Approve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedRole?.permissions.map((perm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{perm.module}</td>
                      <td className="px-4 py-4 text-center">
                        {perm.view ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {perm.create ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {perm.edit ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {perm.delete ? <Check className="w-5 h-5 text-red-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {perm.approve ? <Check className="w-5 h-5 text-blue-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                  {(!selectedRole?.permissions || selectedRole.permissions.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No permissions defined for this role.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Custom Role">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role Name</label>
            <input
              type="text"
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Marketing Manager"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Define Permissions</label>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Module</th>
                    <th className="px-2 py-3 font-semibold text-center">View</th>
                    <th className="px-2 py-3 font-semibold text-center">Create</th>
                    <th className="px-2 py-3 font-semibold text-center">Edit</th>
                    <th className="px-2 py-3 font-semibold text-center">Del</th>
                    <th className="px-2 py-3 font-semibold text-center">Approve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {newPermissions.map((perm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{perm.module}</td>
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" checked={perm.view} onChange={() => togglePermission(perm.module, 'view')} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" checked={perm.create} onChange={() => togglePermission(perm.module, 'create')} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" checked={perm.edit} onChange={() => togglePermission(perm.module, 'edit')} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" checked={perm.delete} onChange={() => togglePermission(perm.module, 'delete')} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" checked={perm.approve} onChange={() => togglePermission(perm.module, 'approve')} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRole} disabled={saving}>{saving ? 'Saving...' : 'Create Role'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
