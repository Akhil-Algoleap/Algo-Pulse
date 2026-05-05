import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Briefcase, 
  Globe, 
  Users2,
  Plus,
  Save,
  CheckCircle2,
  Cloud
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Card, Input, Badge } from '../components/UI';
import { apiService } from '../services/api';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lookups' | 'organization' | 'sync'>('lookups');
  const [lookups, setLookups] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // New Item State
  const [newItem, setNewItem] = useState({
    type: 'departments',
    name: ''
  });

  const fetchLookups = async () => {
    try {
      const data = await apiService.getLookups();
      setLookups(data);
    } catch (err) {
      toast.error('Failed to load settings');
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

  const handleAddLookup = async () => {
    if (!newItem.name) return toast.error('Please enter a name');
    setIsLoading(true);
    try {
      if (newItem.type === 'departments') await apiService.createDepartment({ department_name: newItem.name });
      if (newItem.type === 'designations') await apiService.createDesignation({ designation_name: newItem.name });
      if (newItem.type === 'clients') await apiService.createClient({ client_name: newItem.name });
      if (newItem.type === 'workplaces') await apiService.createWorkplace({ workplace_name: newItem.name });
      
      toast.success('Successfully updated category');
      setNewItem({ ...newItem, name: '' });
      fetchLookups();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'lookups', label: 'Categories & Lookups', icon: Briefcase },
    { id: 'organization', label: 'Organization Profile', icon: Building2 },
    { id: 'sync', label: 'Cloud Sync Status', icon: Cloud },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary-600" />
            System Settings
          </h1>
          <p className="text-slate-500 font-medium">Configure global HR parameters and cloud synchronization</p>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTab === 'lookups' && (
          <>
            {/* Add New Category */}
            <Card className="lg:col-span-1 border-none shadow-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Category
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary-100 mb-2">Category Type</label>
                  <select 
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:bg-white/20 transition-all text-white"
                    value={newItem.type}
                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                  >
                    <option value="departments" className="text-slate-900">Department</option>
                    <option value="designations" className="text-slate-900">Designation</option>
                    <option value="clients" className="text-slate-900">Client</option>
                    <option value="workplaces" className="text-slate-900">Workplace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-primary-100 mb-2">Display Name</label>
                  <input 
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm font-bold outline-none placeholder:text-white/40 focus:bg-white/20 transition-all"
                    placeholder="e.g. Data Science"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                <Button 
                  onClick={handleAddLookup}
                  isLoading={isLoading}
                  className="w-full py-4 bg-white text-primary-700 hover:bg-slate-50 rounded-2xl font-black shadow-lg"
                >
                  Save Category
                </Button>
              </div>
            </Card>

            {/* Current Lookups List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Departments', key: 'departments', icon: Users2, label: 'department_name' },
                  { title: 'Designations', key: 'designations', icon: Briefcase, label: 'designation_name' },
                  { title: 'Clients', key: 'clients', icon: Globe, label: 'client_name' },
                  { title: 'Workplaces', key: 'workplaces', icon: Building2, label: 'workplace_name' }
                ].map((cat) => (
                  <Card key={cat.key} className="border-slate-100 shadow-sm overflow-hidden p-0">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <cat.icon className="w-4 h-4 text-primary-600" />
                        {cat.title}
                      </h4>
                      <Badge className="bg-primary-50 text-primary-600 border-none text-[10px]">{lookups?.[cat.key]?.length || 0}</Badge>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                      {lookups?.[cat.key]?.map((item: any) => (
                        <div key={item.id} className="px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center justify-between group">
                          {item[cat.label]}
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'organization' && (
          <Card className="lg:col-span-2 border-slate-100 shadow-sm">
             <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                    <Building2 className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Change Logo</Button>
                    <p className="text-[10px] text-slate-400 font-medium">Recommended: 400x400px, PNG or SVG</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                    <Input defaultValue="AlgoLeap Technologies" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Business Email</label>
                    <Input defaultValue="admin@algoleap.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">HQ Address</label>
                    <Input defaultValue="Innovation Hub, Tech Park, Suite 402" />
                  </div>
                </div>
                <Button className="w-fit flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Update Profile
                </Button>
             </div>
          </Card>
        )}

        {activeTab === 'sync' && (
          <Card className="lg:col-span-2 border-slate-100 shadow-sm overflow-hidden p-0">
             <div className="p-8 bg-emerald-50/50 flex items-center gap-6 border-b border-emerald-100">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
                   <Cloud className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900">OneDrive Real-time Sync</h3>
                   <p className="text-emerald-700 text-sm font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Status: Active & Connected
                   </p>
                </div>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-4">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Database</h4>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <Briefcase className="w-4 h-4" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900">database.xlsx</p>
                            <p className="text-[10px] text-slate-400 font-medium">Path: /AlgoLeap/Documents/Algo Pulse/</p>
                         </div>
                      </div>
                      <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-none">Synced 2m ago</Badge>
                   </div>
                </div>
                
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black">Admin Access Control</h4>
                      <Badge className="bg-primary-500 text-white border-none">Super Admin Only</Badge>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      The Excel backend is locked during write operations to prevent data corruption. 
                      Ensure Microsoft Excel is closed when performing bulk administrative updates.
                   </p>
                </div>
             </div>
          </Card>
        )}
      </div>
    </div>
  );
};
