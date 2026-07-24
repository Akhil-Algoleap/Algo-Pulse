import React, { useState } from 'react';
import { Card, Button } from '../components/UI';
import { 
  Settings as SettingsIcon,
  Mail,
  MessageSquare,
  Image as ImageIcon,
  Hash,
  Database,
  HardDrive,
  ToggleRight,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'general' | 'email' | 'sms' | 'branding' | 'numbering' | 'backup' | 'storage' | 'features';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'general', label: 'General Settings', icon: SettingsIcon },
  { id: 'email', label: 'Email Configuration', icon: Mail },
  { id: 'sms', label: 'SMS Configuration', icon: MessageSquare },
  { id: 'branding', label: 'Company Branding', icon: ImageIcon },
  { id: 'numbering', label: 'Number Series', icon: Hash },
  { id: 'backup', label: 'Backup Settings', icon: Database },
  { id: 'storage', label: 'Storage Settings', icon: HardDrive },
  { id: 'features', label: 'Feature Flags', icon: ToggleRight }
];

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isSaving, setIsSaving] = useState(false);

  // Mock State for Settings Forms
  const [general, setGeneral] = useState({ companyName: 'AlgoLeap', timezone: 'UTC+5:30', currency: 'INR', dateFormat: 'DD/MM/YYYY' });
  const [email, setEmail] = useState({ host: 'smtp.sendgrid.net', port: '587', user: 'apikey', sender: 'no-reply@algoleap.com' });
  const [sms, setSms] = useState({ gateway: 'https://api.twilio.com', apiKey: '****', senderId: 'ALGO' });
  const [branding, setBranding] = useState({ primaryColor: '#2563eb', secondaryColor: '#1e40af', logoUrl: '/logo.png' });
  const [numbering, setNumbering] = useState({ empPrefix: 'EMP-', empStart: '1000', invPrefix: 'INV-' });
  const [backup, setBackup] = useState({ enabled: true, frequency: 'Daily', location: 'AWS S3' });
  const [storage, setStorage] = useState({ provider: 'AWS S3', bucket: 'algopulse-assets', maxFileSize: '50' });
  const [features, setFeatures] = useState({ payroll: true, performance: true, recruitment: false });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${TABS.find(t => t.id === activeTab)?.label} saved successfully`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500">Configure core application behaviors and integrations</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="p-2 sticky top-6">
            <div className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 min-w-0">
          <Card>
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = TABS.find(t => t.id === activeTab)?.icon || SettingsIcon;
                  return <Icon className="w-6 h-6 text-primary-600" />;
                })()}
                <h2 className="text-lg font-semibold text-slate-900">
                  {TABS.find(t => t.id === activeTab)?.label}
                </h2>
              </div>
              <Button onClick={handleSave} isLoading={isSaving} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>

            <div className="p-6">
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input 
                      type="text" 
                      value={general.companyName}
                      onChange={e => setGeneral({...general, companyName: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                    <select 
                      value={general.timezone}
                      onChange={e => setGeneral({...general, timezone: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                      <option value="UTC">UTC</option>
                      <option value="UTC+5:30">UTC+5:30 (IST)</option>
                      <option value="UTC-5">UTC-5 (EST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                    <select 
                      value={general.currency}
                      onChange={e => setGeneral({...general, currency: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date Format</label>
                    <select 
                      value={general.dateFormat}
                      onChange={e => setGeneral({...general, dateFormat: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Host</label>
                    <input 
                      type="text" 
                      value={email.host}
                      onChange={e => setEmail({...email, host: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Port</label>
                    <input 
                      type="text" 
                      value={email.port}
                      onChange={e => setEmail({...email, port: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Username</label>
                    <input 
                      type="text" 
                      value={email.user}
                      onChange={e => setEmail({...email, user: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sender Email</label>
                    <input 
                      type="email" 
                      value={email.sender}
                      onChange={e => setEmail({...email, sender: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'sms' && (
                <div className="grid grid-cols-1 gap-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gateway URL</label>
                    <input 
                      type="text" 
                      value={sms.gateway}
                      onChange={e => setSms({...sms, gateway: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
                    <input 
                      type="password" 
                      value={sms.apiKey}
                      onChange={e => setSms({...sms, apiKey: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sender ID</label>
                    <input 
                      type="text" 
                      value={sms.senderId}
                      onChange={e => setSms({...sms, senderId: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={branding.primaryColor}
                        onChange={e => setBranding({...branding, primaryColor: e.target.value})}
                        className="h-10 w-10 border-0 p-0" 
                      />
                      <input 
                        type="text" 
                        value={branding.primaryColor}
                        onChange={e => setBranding({...branding, primaryColor: e.target.value})}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none uppercase" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Secondary Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={branding.secondaryColor}
                        onChange={e => setBranding({...branding, secondaryColor: e.target.value})}
                        className="h-10 w-10 border-0 p-0" 
                      />
                      <input 
                        type="text" 
                        value={branding.secondaryColor}
                        onChange={e => setBranding({...branding, secondaryColor: e.target.value})}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none uppercase" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Logo URL</label>
                    <input 
                      type="text" 
                      value={branding.logoUrl}
                      onChange={e => setBranding({...branding, logoUrl: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'numbering' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID Prefix</label>
                    <input 
                      type="text" 
                      value={numbering.empPrefix}
                      onChange={e => setNumbering({...numbering, empPrefix: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Employee Starting Number</label>
                    <input 
                      type="number" 
                      value={numbering.empStart}
                      onChange={e => setNumbering({...numbering, empStart: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Prefix</label>
                    <input 
                      type="text" 
                      value={numbering.invPrefix}
                      onChange={e => setNumbering({...numbering, invPrefix: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'backup' && (
                <div className="grid grid-cols-1 gap-6 max-w-xl">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-slate-900">Automated Backups</h4>
                      <p className="text-sm text-slate-500">Run scheduled database backups</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={backup.enabled}
                        onChange={(e) => setBackup({...backup, enabled: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Backup Frequency</label>
                    <select 
                      value={backup.frequency}
                      onChange={e => setBackup({...backup, frequency: e.target.value})}
                      disabled={!backup.enabled}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white disabled:opacity-50"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Backup Location</label>
                    <select 
                      value={backup.location}
                      onChange={e => setBackup({...backup, location: e.target.value})}
                      disabled={!backup.enabled}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white disabled:opacity-50"
                    >
                      <option>AWS S3</option>
                      <option>Google Cloud Storage</option>
                      <option>Local Server</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'storage' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Storage Provider</label>
                    <select 
                      value={storage.provider}
                      onChange={e => setStorage({...storage, provider: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    >
                      <option>AWS S3</option>
                      <option>Google Cloud Storage</option>
                      <option>Azure Blob Storage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bucket / Container Name</label>
                    <input 
                      type="text" 
                      value={storage.bucket}
                      onChange={e => setStorage({...storage, bucket: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Upload File Size (MB)</label>
                    <input 
                      type="number" 
                      value={storage.maxFileSize}
                      onChange={e => setStorage({...storage, maxFileSize: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid grid-cols-1 gap-4 max-w-2xl">
                  {[
                    { id: 'payroll', label: 'Payroll Module', description: 'Enable salary structures, processing, and payslips.', state: features.payroll },
                    { id: 'performance', label: 'Performance Module', description: 'Enable reviews, OKRs, and continuous feedback.', state: features.performance },
                    { id: 'recruitment', label: 'Recruitment Module (Beta)', description: 'Enable ATS tracking, interviews, and job postings.', state: features.recruitment }
                  ].map((feat) => (
                    <div key={feat.id} className="flex items-start justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-slate-900">{feat.label}</h4>
                        <p className="text-sm text-slate-500">{feat.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={feat.state}
                          onChange={(e) => setFeatures({...features, [feat.id]: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
