import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { MasterDataCategory, MasterDataItem } from '../types';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { 
  Database,
  Award,
  Briefcase,
  Users,
  Calendar,
  Clock,
  MapPin,
  Flag,
  FileText,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES: { id: MasterDataCategory; label: string; icon: any }[] = [
  { id: 'Designations', label: 'Designations', icon: Briefcase },
  { id: 'Job Grades', label: 'Job Grades', icon: Award },
  { id: 'Employment Types', label: 'Employment Types', icon: Users },
  { id: 'Skills', label: 'Skills', icon: Award },
  { id: 'Certifications', label: 'Certifications', icon: FileText },
  { id: 'Leave Types', label: 'Leave Types', icon: Calendar },
  { id: 'Shift Types', label: 'Shift Types', icon: Clock },
  { id: 'Locations', label: 'Locations', icon: MapPin },
  { id: 'Nationalities', label: 'Nationalities', icon: Flag },
  { id: 'Document Types', label: 'Document Types', icon: FileText }
];

export const MasterData: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MasterDataCategory>('Designations');
  const [data, setData] = useState<MasterDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
  const [formData, setFormData] = useState<Partial<MasterDataItem>>({
    name: '',
    description: '',
    status: 'Active'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getMasterData(activeCategory);
      setData(res.data);
    } catch (error) {
      toast.error('Failed to fetch master data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  const handleOpenModal = (item?: MasterDataItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      return toast.error('Name is required');
    }

    try {
      if (editingItem) {
        await apiService.updateMasterData(editingItem.id, formData);
        toast.success('Updated successfully');
      } else {
        await apiService.addMasterData({
          category: activeCategory,
          name: formData.name,
          description: formData.description,
          status: formData.status as 'Active' | 'Inactive'
        });
        toast.success('Added successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save data');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await apiService.deleteMasterData(id);
        toast.success('Deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Master Data Management</h1>
        <p className="text-slate-500">Configure global dropdowns and system variables</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="p-2 sticky top-6">
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <Card>
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-primary-600" />
                <h2 className="text-lg font-semibold text-slate-900">{activeCategory}</h2>
              </div>
              <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 shrink-0">
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500">
                        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading data...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500">
                        <Database className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        No {activeCategory.toLowerCase()} configured yet.
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-medium text-slate-900">{item.name}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-slate-500 text-sm">{item.description || '-'}</span>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={item.status === 'Active' ? 'success' : 'default'}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleOpenModal(item)}
                              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit ${activeCategory.slice(0, -1)}` : `Add New ${activeCategory.slice(0, -1)}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`Enter ${activeCategory.slice(0, -1).toLowerCase()} name`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter brief description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
