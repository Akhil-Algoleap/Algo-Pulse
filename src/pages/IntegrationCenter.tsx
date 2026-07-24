import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { 
  Fingerprint, 
  ShieldCheck, 
  Mail, 
  MessageSquare, 
  Database, 
  Landmark, 
  Calculator, 
  Cloud,
  CheckCircle2,
  XCircle,
  Settings2,
  Link,
  Unlink
} from 'lucide-react';
import toast from 'react-hot-toast';

type IntegrationCategory = 'Identity & Access' | 'Communication' | 'ERP & Finance' | 'Biometrics & Hardware' | 'All';

interface Integration {
  id: string;
  name: string;
  provider: string;
  category: IntegrationCategory;
  description: string;
  icon: any;
  status: 'Connected' | 'Disconnected' | 'Pending';
  lastSync?: string;
  fields: { name: string; label: string; type: string; secret?: boolean }[];
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'azure-ad',
    name: 'Microsoft Entra ID (Azure AD)',
    provider: 'Microsoft',
    category: 'Identity & Access',
    description: 'Single Sign-On (SSO) and user lifecycle management.',
    icon: ShieldCheck,
    status: 'Connected',
    lastSync: '10 mins ago',
    fields: [
      { name: 'tenantId', label: 'Tenant ID', type: 'text' },
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', secret: true }
    ]
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    provider: 'Google',
    category: 'Identity & Access',
    description: 'SSO, Calendar sync, and Google Drive integrations.',
    icon: Cloud,
    status: 'Disconnected',
    fields: [
      { name: 'domain', label: 'Workspace Domain', type: 'text' },
      { name: 'adminEmail', label: 'Admin Email', type: 'text' },
      { name: 'serviceAccount', label: 'Service Account JSON', type: 'textarea', secret: true }
    ]
  },
  {
    id: 'm365',
    name: 'Outlook / Microsoft 365',
    provider: 'Microsoft',
    category: 'Communication',
    description: 'Calendar sync, meeting room bookings, and email notifications.',
    icon: Mail,
    status: 'Connected',
    lastSync: '1 hour ago',
    fields: [
      { name: 'tenantId', label: 'Tenant ID', type: 'text' },
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', secret: true }
    ]
  },
  {
    id: 'slack-teams',
    name: 'Slack / Microsoft Teams',
    provider: 'Slack / Microsoft',
    category: 'Communication',
    description: 'Bot notifications for approvals, attendance, and announcements.',
    icon: MessageSquare,
    status: 'Disconnected',
    fields: [
      { name: 'webhookUrl', label: 'Webhook URL', type: 'text', secret: true },
      { name: 'botToken', label: 'Bot OAuth Token', type: 'password', secret: true }
    ]
  },
  {
    id: 'sap',
    name: 'SAP',
    provider: 'SAP',
    category: 'ERP & Finance',
    description: 'Enterprise resource planning and financial syncing.',
    icon: Database,
    status: 'Disconnected',
    fields: [
      { name: 'endpoint', label: 'SAP OData Endpoint', type: 'text' },
      { name: 'username', label: 'API Username', type: 'text' },
      { name: 'password', label: 'API Password', type: 'password', secret: true }
    ]
  },
  {
    id: 'oracle',
    name: 'Oracle ERP',
    provider: 'Oracle',
    category: 'ERP & Finance',
    description: 'Oracle NetSuite or Fusion Cloud integration.',
    icon: Database,
    status: 'Disconnected',
    fields: [
      { name: 'endpoint', label: 'API Endpoint', type: 'text' },
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', secret: true }
    ]
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    provider: 'Intuit',
    category: 'ERP & Finance',
    description: 'Sync payroll expenses and employee reimbursements.',
    icon: Calculator,
    status: 'Pending',
    fields: [
      { name: 'companyId', label: 'Company ID', type: 'text' },
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', secret: true }
    ]
  },
  {
    id: 'banking',
    name: 'Banking APIs',
    provider: 'Various',
    category: 'ERP & Finance',
    description: 'Direct salary disbursements and automated reconciliation.',
    icon: Landmark,
    status: 'Disconnected',
    fields: [
      { name: 'bankName', label: 'Bank Name', type: 'text' },
      { name: 'apiKey', label: 'API Key', type: 'password', secret: true },
      { name: 'corporateId', label: 'Corporate ID', type: 'text' }
    ]
  },
  {
    id: 'essl',
    name: 'eSSL Biometric',
    provider: 'eSSL',
    category: 'Biometrics & Hardware',
    description: 'Hardware fingerprint and facial recognition attendance sync.',
    icon: Fingerprint,
    status: 'Connected',
    lastSync: 'Just now',
    fields: [
      { name: 'serverIp', label: 'eSSL Server IP', type: 'text' },
      { name: 'port', label: 'Port', type: 'text' },
      { name: 'username', label: 'Admin Username', type: 'text' },
      { name: 'password', label: 'Admin Password', type: 'password', secret: true }
    ]
  }
];

export const IntegrationCenter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory>('All');
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const filteredIntegrations = activeCategory === 'All' 
    ? integrations 
    : integrations.filter(i => i.category === activeCategory);

  const categories: IntegrationCategory[] = ['All', 'Identity & Access', 'Communication', 'ERP & Finance', 'Biometrics & Hardware'];

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    // Mock pre-filled data for connected ones
    const initialData: Record<string, string> = {};
    if (integration.status === 'Connected') {
      integration.fields.forEach(f => {
        initialData[f.name] = f.secret ? '********' : `mock_${f.name}_value`;
      });
    }
    setFormData(initialData);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedIntegration) return;
    setIsSaving(true);
    
    setTimeout(() => {
      setIntegrations(integrations.map(i => {
        if (i.id === selectedIntegration.id) {
          return { ...i, status: 'Connected', lastSync: 'Just now' };
        }
        return i;
      }));
      setIsSaving(false);
      setIsModalOpen(false);
      toast.success(`${selectedIntegration.name} configured successfully`);
    }, 1000);
  };

  const handleDisconnect = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to disconnect ${name}?`)) {
      setIntegrations(integrations.map(i => {
        if (i.id === id) {
          return { ...i, status: 'Disconnected', lastSync: undefined };
        }
        return i;
      }));
      toast.success(`${name} disconnected`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Integration Center</h1>
          <p className="text-slate-500">Connect Algo Pulse with your external enterprise systems</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id} className="flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    integration.status === 'Connected' ? 'bg-green-50 text-green-600' :
                    integration.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant={
                    integration.status === 'Connected' ? 'success' :
                    integration.status === 'Pending' ? 'warning' :
                    'default'
                  }>
                    {integration.status}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{integration.name}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{integration.description}</p>
                
                <div className="flex items-center text-xs text-slate-400">
                  <span className="font-medium text-slate-500 mr-2">Category:</span>
                  {integration.category}
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between mt-auto">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  {integration.status === 'Connected' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="truncate max-w-[100px]">Synced {integration.lastSync}</span>
                    </>
                  ) : integration.status === 'Pending' ? (
                    <>
                      <Settings2 className="w-4 h-4 text-yellow-500 animate-spin-slow" />
                      <span>Action required</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span>Not configured</span>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {integration.status === 'Connected' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(integration.id, integration.name)}
                      className="px-2"
                      title="Disconnect"
                    >
                      <Unlink className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                  <Button 
                    variant={integration.status === 'Connected' ? 'outline' : 'primary'}
                    size="sm" 
                    onClick={() => handleConfigure(integration)}
                    className="flex items-center gap-1.5"
                  >
                    {integration.status === 'Connected' ? (
                      <>
                        <Settings2 className="w-4 h-4" />
                        Configure
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Configure ${selectedIntegration?.name}`}
      >
        {selectedIntegration && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3 mb-6">
              <selectedIntegration.icon className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-slate-900 text-sm mb-1">{selectedIntegration.name} Integration</h4>
                <p className="text-sm text-slate-500">{selectedIntegration.description}</p>
              </div>
            </div>

            {selectedIntegration.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                    rows={4}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    placeholder={`Enter ${field.label}`}
                  />
                ) : (
                  <input
                    type={field.type}
                    className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${
                      field.secret ? 'font-mono tracking-wider text-sm' : ''
                    }`}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    placeholder={`Enter ${field.label}`}
                  />
                )}
              </div>
            ))}

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} isLoading={isSaving} className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                {selectedIntegration.status === 'Connected' ? 'Update Connection' : 'Connect'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
