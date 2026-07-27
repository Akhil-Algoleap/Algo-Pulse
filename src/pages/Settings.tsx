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
  Save,
  CheckSquare,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'general' | 'email' | 'sms' | 'branding' | 'numbering' | 'backup' | 'storage' | 'features' | 'projectConfig' | 'taskSettings' | 'notificationPrefs' | 'financeConfig' | 'financePolicies' | 'financeApprovals' | 'financeBanking' | 'payrollCycle' | 'complianceConfig' | 'overtimeRules';

const ADMIN_TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'general', label: 'General Settings', icon: SettingsIcon },
  { id: 'email', label: 'Email Configuration', icon: Mail },
  { id: 'sms', label: 'SMS Configuration', icon: MessageSquare },
  { id: 'branding', label: 'Company Branding', icon: ImageIcon },
  { id: 'numbering', label: 'Number Series', icon: Hash },
  { id: 'backup', label: 'Backup Settings', icon: Database },
  { id: 'storage', label: 'Storage Settings', icon: HardDrive },
  { id: 'features', label: 'Feature Flags', icon: ToggleRight }
];

const PM_TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'projectConfig', label: 'Project Configuration', icon: SettingsIcon },
  { id: 'taskSettings', label: 'Task Settings', icon: CheckSquare },
  { id: 'notificationPrefs', label: 'Notification Preferences', icon: Bell }
];

const FINANCE_TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'financeConfig', label: 'Financial Configuration', icon: SettingsIcon },
  { id: 'financePolicies', label: 'Financial Policies', icon: FileText },
  { id: 'financeApprovals', label: 'Approval Limits', icon: CheckSquare },
  { id: 'financeBanking', label: 'Banking & Payments', icon: CreditCard }
];

const PAYROLL_TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'payrollCycle', label: 'Payroll Calendar & Frequency', icon: SettingsIcon },
  { id: 'salaryComponents', label: 'Salary Components', icon: Database },
  { id: 'taxSlabs', label: 'Tax Slabs', icon: Hash },
  { id: 'overtimeRules', label: 'Overtime & Leave Rules', icon: CheckSquare },
  { id: 'bonusRules', label: 'Bonus Rules', icon: CheckSquare },
  { id: 'financeBanking', label: 'Currency & Bank Format', icon: CreditCard }
];

export const Settings: React.FC = () => {
  const { profile } = useAuth();
  const isPM = profile?.role === 'Project Manager';
  const isFinance = profile?.role === 'Finance';
  const isPayroll = profile?.role === 'Payroll Manager';
  
  const TABS = isPM ? PM_TABS : isFinance ? FINANCE_TABS : isPayroll ? PAYROLL_TABS : ADMIN_TABS;

  const [activeTab, setActiveTab] = useState<Tab>(isPM ? 'projectConfig' : isFinance ? 'financeConfig' : isPayroll ? 'payrollCycle' : 'general');
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

  // Mock State for PM Settings
  const [projectConfig, setProjectConfig] = useState({ sprintDuration: '2 Weeks', workingDays: 'Monday - Friday', projectTemplates: 'Agile Software Development' });
  const [taskSettings, setTaskSettings] = useState({ defaultStoryPoints: '3', taskPriorities: 'Low, Medium, High, Critical', taskStatuses: 'To Do, In Progress, Review, Done' });
  const [notificationPrefs, setNotificationPrefs] = useState({ emailAlerts: true, inAppAlerts: true, dailyDigest: false });

  // Mock State for Finance Settings
  const [financeConfig, setFinanceConfig] = useState({ financialYearStart: 'April 1', defaultCurrency: 'USD', taxPercentage: '5', invoicePrefix: 'INV-', invoiceStart: '1000' });
  const [financeApprovals, setFinanceApprovals] = useState({ expenseLimit: '100', travelLimit: '500', purchaseLimit: '0' });
  const [financePolicies, setFinancePolicies] = useState({ expenseCategories: 'Medical, Internet, Travel, Training, Fuel', travelPolicies: 'Economy Class Only, Max $150 Hotel/night', budgetRules: 'Hard stop at 100%, alert at 80%' });
  const [financeBanking, setFinanceBanking] = useState({ paymentMethods: 'Bank Transfer, Stripe, PayPal', bankAccount: 'Chase Business ****8812' });

  // Mock State for Payroll Settings
  const [payrollCycle, setPayrollCycle] = useState({ cutoffDay: '25', payDay: '1', defaultWorkingHours: '8' });
  const [complianceConfig, setComplianceConfig] = useState({ pfPercentage: '12', esiPercentage: '1.75', taxRegime: 'New' });
  const [overtimeRules, setOvertimeRules] = useState({ otMultiplier: '1.5', maxOtHours: '20', deductLop: true });

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

          {/* PM Specific Tabs */}
          {isPM && (
            <Card className="mt-6">
              <div className="p-6">
                {activeTab === 'projectConfig' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sprint Duration</label>
                      <select 
                        value={projectConfig.sprintDuration}
                        onChange={e => setProjectConfig({...projectConfig, sprintDuration: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                      >
                        <option>1 Week</option>
                        <option>2 Weeks</option>
                        <option>3 Weeks</option>
                        <option>4 Weeks</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Working Days</label>
                      <select 
                        value={projectConfig.workingDays}
                        onChange={e => setProjectConfig({...projectConfig, workingDays: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                      >
                        <option>Monday - Friday</option>
                        <option>Monday - Saturday</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Default Project Template</label>
                      <select 
                        value={projectConfig.projectTemplates}
                        onChange={e => setProjectConfig({...projectConfig, projectTemplates: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                      >
                        <option>Agile Software Development</option>
                        <option>Waterfall Project Management</option>
                        <option>Kanban Basic</option>
                        <option>Marketing Campaign</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'taskSettings' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Default Story Points</label>
                      <input 
                        type="number"
                        value={taskSettings.defaultStoryPoints}
                        onChange={e => setTaskSettings({...taskSettings, defaultStoryPoints: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Task Priorities (comma separated)</label>
                      <input 
                        type="text"
                        value={taskSettings.taskPriorities}
                        onChange={e => setTaskSettings({...taskSettings, taskPriorities: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Custom Task Statuses (comma separated)</label>
                      <input 
                        type="text"
                        value={taskSettings.taskStatuses}
                        onChange={e => setTaskSettings({...taskSettings, taskStatuses: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="e.g. To Do, In Progress, Review, Testing, Done"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'notificationPrefs' && (
                  <div className="grid grid-cols-1 gap-4 max-w-2xl">
                    {[
                      { id: 'inAppAlerts', label: 'In-App Alerts', description: 'Receive real-time notifications for task updates, risks, and timesheets within the app.', state: notificationPrefs.inAppAlerts },
                      { id: 'emailAlerts', label: 'Email Notifications', description: 'Receive email alerts for important sprint and project milestones.', state: notificationPrefs.emailAlerts },
                      { id: 'dailyDigest', label: 'Daily Digest', description: 'Get a daily summary of team progress and pending actions at 9:00 AM.', state: notificationPrefs.dailyDigest }
                    ].map((pref) => (
                      <div key={pref.id} className="flex items-start justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div>
                          <h4 className="font-semibold text-slate-900">{pref.label}</h4>
                          <p className="text-sm text-slate-500">{pref.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer mt-1">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={pref.state}
                            onChange={(e) => setNotificationPrefs({...notificationPrefs, [pref.id]: e.target.checked})}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Finance Specific Tabs */}
          {isFinance && (
            <Card className="mt-6">
              <div className="p-6">
                {activeTab === 'financeConfig' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Financial Year Start</label>
                      <select 
                        value={financeConfig.financialYearStart}
                        onChange={e => setFinanceConfig({...financeConfig, financialYearStart: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                      >
                        <option>January 1</option>
                        <option>April 1</option>
                        <option>July 1</option>
                        <option>October 1</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Default Reporting Currency</label>
                      <select 
                        value={financeConfig.defaultCurrency}
                        onChange={e => setFinanceConfig({...financeConfig, defaultCurrency: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                      >
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>INR (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Default GST / Tax %</label>
                      <input 
                        type="number"
                        value={financeConfig.taxPercentage}
                        onChange={e => setFinanceConfig({...financeConfig, taxPercentage: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number Prefix</label>
                            <input 
                                type="text"
                                value={financeConfig.invoicePrefix}
                                onChange={e => setFinanceConfig({...financeConfig, invoicePrefix: e.target.value})}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Starting Number</label>
                            <input 
                                type="number"
                                value={financeConfig.invoiceStart}
                                onChange={e => setFinanceConfig({...financeConfig, invoiceStart: e.target.value})}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === 'financePolicies' && (
                  <div className="grid grid-cols-1 gap-6 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Expense Categories (comma separated)</label>
                      <input 
                        type="text"
                        value={financePolicies.expenseCategories}
                        onChange={e => setFinancePolicies({...financePolicies, expenseCategories: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Travel Policies</label>
                      <textarea 
                        value={financePolicies.travelPolicies}
                        onChange={e => setFinancePolicies({...financePolicies, travelPolicies: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Budget Threshold Rules</label>
                      <textarea 
                        value={financePolicies.budgetRules}
                        onChange={e => setFinancePolicies({...financePolicies, budgetRules: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'financeApprovals' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Auto-Approve Expenses Below ($)</label>
                      <input 
                        type="number"
                        value={financeApprovals.expenseLimit}
                        onChange={e => setFinanceApprovals({...financeApprovals, expenseLimit: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Auto-Approve Travel Claims Below ($)</label>
                      <input 
                        type="number"
                        value={financeApprovals.travelLimit}
                        onChange={e => setFinanceApprovals({...financeApprovals, travelLimit: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Auto-Approve Purchases Below ($)</label>
                      <input 
                        type="number"
                        value={financeApprovals.purchaseLimit}
                        onChange={e => setFinanceApprovals({...financeApprovals, purchaseLimit: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="0 means disabled"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'financeBanking' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Accepted Payment Methods (comma separated)</label>
                      <input 
                        type="text"
                        value={financeBanking.paymentMethods}
                        onChange={e => setFinanceBanking({...financeBanking, paymentMethods: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Primary Operating Bank Account</label>
                      <input 
                        type="text"
                        value={financeBanking.bankAccount}
                        onChange={e => setFinanceBanking({...financeBanking, bankAccount: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="e.g. Chase Business ****8812"
                      />
                    </div>
                  </div>
                )}
              </div>
              </div>
            </Card>
          )}

          {/* Payroll Specific Tabs */}
          {isPayroll && (
            <Card className="mt-6">
              <div className="p-6">
                {activeTab === 'payrollCycle' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Payroll Frequency</label>
                      <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                        <option>Monthly</option>
                        <option>Bi-Weekly</option>
                        <option>Weekly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Payroll Cut-off Day</label>
                      <input 
                        type="number"
                        value={payrollCycle.cutoffDay}
                        onChange={e => setPayrollCycle({...payrollCycle, cutoffDay: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Salary Pay Day</label>
                      <input 
                        type="number"
                        value={payrollCycle.payDay}
                        onChange={e => setPayrollCycle({...payrollCycle, payDay: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Default Working Hours / Day</label>
                      <input 
                        type="number"
                        value={payrollCycle.defaultWorkingHours}
                        onChange={e => setPayrollCycle({...payrollCycle, defaultWorkingHours: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'salaryComponents' && (
                  <div className="space-y-4">
                     <p className="text-sm text-slate-500 mb-4">Configure default formulas and limits for earnings and deductions.</p>
                     <Button variant="outline" className="gap-2"><SettingsIcon className="w-4 h-4" /> Manage Salary Components</Button>
                  </div>
                )}

                {activeTab === 'taxSlabs' && (
                  <div className="space-y-4">
                     <p className="text-sm text-slate-500 mb-4">Manage New and Old Regime tax slabs for TDS calculation.</p>
                     <Button variant="outline" className="gap-2"><Hash className="w-4 h-4" /> Edit Tax Slabs</Button>
                  </div>
                )}

                {activeTab === 'overtimeRules' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Overtime Multiplier (x Base Rate)</label>
                      <input 
                        type="number" step="0.1"
                        value={overtimeRules.otMultiplier}
                        onChange={e => setOvertimeRules({...overtimeRules, otMultiplier: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Max OT Hours / Month</label>
                      <input 
                        type="number"
                        value={overtimeRules.maxOtHours}
                        onChange={e => setOvertimeRules({...overtimeRules, maxOtHours: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-slate-900">Leave Deduction Rules (LOP)</h4>
                        <p className="text-sm text-slate-500">Automatically calculate and deduct unapproved absences based on Base Salary.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={overtimeRules.deductLop}
                          onChange={(e) => setOvertimeRules({...overtimeRules, deductLop: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'bonusRules' && (
                  <div className="space-y-4">
                     <p className="text-sm text-slate-500 mb-4">Define standard bonus percentages and eligibility criteria.</p>
                     <Button variant="outline" className="gap-2"><CheckSquare className="w-4 h-4" /> Manage Bonus Rules</Button>
                  </div>
                )}

                {activeTab === 'financeBanking' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">System Currency</label>
                      <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                        <option>USD ($)</option>
                        <option>INR (₹)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bank File Format</label>
                      <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                        <option>Standard CSV</option>
                        <option>HDFC / ICICI Corporate Format</option>
                        <option>SEPA XML</option>
                        <option>NACHA (US)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
