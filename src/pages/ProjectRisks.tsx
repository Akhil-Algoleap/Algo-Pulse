import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Plus, 
  Edit2,
  AlertTriangle,
  User,
  FileText,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Select, Badge, Card, Input } from '../components/UI';
import { Modal } from '../components/Modal';

type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
type RiskStatus = 'Open' | 'Mitigating' | 'Closed';

interface Risk {
  id: string;
  name: string;
  severity: Severity;
  owner: string;
  status: RiskStatus;
  mitigationPlan: string;
}

const INITIAL_RISKS: Risk[] = [
  {
    id: 'RSK-001',
    name: 'Resource Shortage',
    severity: 'High',
    owner: 'Akhil',
    status: 'Open',
    mitigationPlan: 'Hire two more developers by end of sprint.'
  },
  {
    id: 'RSK-002',
    name: 'Client Delay in API specs',
    severity: 'Medium',
    owner: 'Sarah',
    status: 'Mitigating',
    mitigationPlan: 'Escalated to client management; using mock APIs in the interim.'
  }
];

export const ProjectRisks: React.FC = () => {
  const [risks, setRisks] = useState<Risk[]>(INITIAL_RISKS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [formData, setFormData] = useState<Partial<Risk>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (risk?: Risk) => {
    if (risk) {
      setEditingRisk(risk);
      setFormData({ ...risk });
    } else {
      setEditingRisk(null);
      setFormData({
        name: '',
        severity: 'Medium',
        owner: '',
        status: 'Open',
        mitigationPlan: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseRisk = (id: string) => {
    if (window.confirm('Are you sure you want to close this risk?')) {
      setRisks(prev => prev.map(r => r.id === id ? { ...r, status: 'Closed' } : r));
      toast.success('Risk closed successfully');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.owner) {
      return toast.error('Name and Owner are required');
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (editingRisk) {
        setRisks(prev => prev.map(r => r.id === editingRisk.id ? { ...r, ...formData } as Risk : r));
        toast.success('Risk updated successfully');
      } else {
        const newRisk: Risk = {
          ...(formData as Risk),
          id: `RSK-00${Math.floor(Math.random() * 10) + 3}`
        };
        setRisks(prev => [...prev, newRisk]);
        toast.success('Risk logged successfully');
      }

      setIsModalOpen(false);
      setIsSubmitting(false);
    }, 500);
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'Critical': return 'danger';
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: RiskStatus) => {
    switch (status) {
      case 'Open': return 'danger';
      case 'Mitigating': return 'warning';
      case 'Closed': return 'success';
      default: return 'default';
    }
  };

  const filteredRisks = risks.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Risks</h1>
          <p className="text-slate-500">Track and mitigate risks before they become issues</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 shadow-lg shadow-primary-100">
          <Plus className="w-4 h-4" />
          Log New Risk
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary-600" />
            Active Risk Register
          </h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search risks or owners..." 
              className="pl-9 bg-slate-50 border-none h-10 text-sm focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Name</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Severity</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Owner</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRisks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                       <ShieldAlert className="w-10 h-10 text-slate-200 mb-2" />
                       <p className="text-slate-400 font-medium">No risks found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredRisks.map(risk => (
                <tr key={risk.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${risk.severity === 'High' || risk.severity === 'Critical' ? 'text-red-500' : 'text-orange-400'}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{risk.name}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1" title={risk.mitigationPlan}>
                          <FileText className="w-3 h-3" />
                          <span className="truncate max-w-[250px] inline-block">{risk.mitigationPlan || 'No mitigation plan'}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getSeverityColor(risk.severity)} className="font-bold uppercase tracking-wider text-[10px]">
                      {risk.severity}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-3 h-3 text-slate-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{risk.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(risk.status)}>
                      {risk.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-primary-600 hover:bg-primary-50 px-2"
                        onClick={() => handleOpenModal(risk)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      {risk.status !== 'Closed' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-emerald-600 hover:bg-emerald-50 px-2"
                          onClick={() => handleCloseRisk(risk.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Close
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingRisk ? "Edit Project Risk" : "Log New Risk"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Risk Description *</label>
            <Input 
              required
              placeholder="e.g. Resource Shortage for Frontend" 
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Severity</label>
              <Select 
                value={formData.severity || 'Medium'} 
                onChange={(e) => setFormData({...formData, severity: e.target.value as Severity})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Owner *</label>
              <Input 
                required
                placeholder="e.g. John Doe"
                value={formData.owner || ''} 
                onChange={(e) => setFormData({...formData, owner: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
            <Select 
              value={formData.status || 'Open'} 
              onChange={(e) => setFormData({...formData, status: e.target.value as RiskStatus})}
            >
              <option value="Open">Open</option>
              <option value="Mitigating">Mitigating</option>
              <option value="Closed">Closed</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Mitigation Plan</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl px-4 py-3 text-sm transition-all outline-none resize-none"
              rows={3}
              placeholder="How are we addressing this risk?"
              value={formData.mitigationPlan || ''}
              onChange={(e) => setFormData({...formData, mitigationPlan: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-4 mt-4 border-t border-slate-100">
            <Button variant="outline" className="flex-1 py-3" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button className="flex-1 py-3 shadow-lg shadow-primary-100" isLoading={isSubmitting} type="submit">
              {editingRisk ? 'Save Changes' : 'Log Risk'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
