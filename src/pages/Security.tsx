import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Card, Button, Badge } from '../components/UI';
import { Shield, Key, Lock, Globe, Activity, Server, CheckCircle, SmartphoneNfc } from 'lucide-react';
import toast from 'react-hot-toast';
import { SecuritySettings } from '../types';

export const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'auth' | 'session' | 'integrations' | 'logs'>('auth');
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, logsRes, blockedRes] = await Promise.all([
        apiService.getSecuritySettings(),
        apiService.getLoginAttempts(),
        apiService.getBlockedUsers()
      ]);
      setSettings(settingsRes.data);
      setLoginAttempts(logsRes.data);
      setBlockedUsers(blockedRes.data);
    } catch (error) {
      toast.error('Failed to load security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedSettings: SecuritySettings) => {
    setSaving(true);
    try {
      const { data } = await apiService.updateSecuritySettings(updatedSettings);
      setSettings(data);
      toast.success('Security settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await apiService.unblockUser(id);
      setBlockedUsers(blockedUsers.filter(u => u.id !== id));
      toast.success('User unblocked successfully');
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  if (loading || !settings) return <div className="p-8 text-center text-slate-500">Loading Enterprise Security...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Security Center</h1>
        <p className="text-slate-500">Manage enterprise security policies, access controls, and authentication settings.</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('auth')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'auth' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" /> Authentication
        </button>
        <button
          onClick={() => setActiveTab('session')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'session' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" /> Session & Access
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'integrations' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Server className="w-4 h-4" /> Integrations
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'logs' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" /> Logs & Blocks
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'auth' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Password Policy</h3>
                  <p className="text-sm text-slate-500">Configure rules for user passwords.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Length</label>
                  <input 
                    type="number" 
                    value={settings.password_policy.min_length}
                    onChange={(e) => setSettings({ ...settings, password_policy: { ...settings.password_policy, min_length: parseInt(e.target.value) } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry (Days)</label>
                  <input 
                    type="number" 
                    value={settings.password_policy.expiry_days}
                    onChange={(e) => setSettings({ ...settings, password_policy: { ...settings.password_policy, expiry_days: parseInt(e.target.value) } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                  />
                </div>
                <div className="pt-2 grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={settings.password_policy.require_uppercase} onChange={(e) => setSettings({ ...settings, password_policy: { ...settings.password_policy, require_uppercase: e.target.checked } })} /> Require Uppercase
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={settings.password_policy.require_lowercase} onChange={(e) => setSettings({ ...settings, password_policy: { ...settings.password_policy, require_lowercase: e.target.checked } })} /> Require Lowercase
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={settings.password_policy.require_numbers} onChange={(e) => setSettings({ ...settings, password_policy: { ...settings.password_policy, require_numbers: e.target.checked } })} /> Require Numbers
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={settings.password_policy.require_special} onChange={(e) => setSettings({ ...settings, password_policy: { ...settings.password_policy, require_special: e.target.checked } })} /> Require Special Char
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => handleSave(settings)} disabled={saving}>Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <SmartphoneNfc className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Multi-Factor Auth (MFA)</h3>
                    <p className="text-sm text-slate-500">Require 2FA for logins.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={settings.mfa.enabled} onChange={(e) => setSettings({ ...settings, mfa: { ...settings.mfa, enabled: e.target.checked } })} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              
              <div className={settings.mfa.enabled ? '' : 'opacity-50 pointer-events-none'}>
                <label className="block text-sm font-medium text-slate-700 mb-2">Enforced Roles</label>
                <div className="flex flex-wrap gap-2">
                  {['Super Admin', 'Admin', 'Finance', 'HR', 'Manager', 'Employee'].map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        const roles = [...settings.mfa.enforced_roles];
                        if (roles.includes(role)) {
                          roles.splice(roles.indexOf(role), 1);
                        } else {
                          roles.push(role);
                        }
                        setSettings({ ...settings, mfa: { ...settings.mfa, enforced_roles: roles } });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        settings.mfa.enforced_roles.includes(role) ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => handleSave(settings)} disabled={saving}>Save Changes</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'session' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Session Management</h3>
                  <p className="text-sm text-slate-500">Control active sessions and timeouts.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Session Timeout (Minutes)</label>
                  <input 
                    type="number" 
                    value={settings.session.timeout_minutes}
                    onChange={(e) => setSettings({ ...settings, session: { ...settings.session, timeout_minutes: parseInt(e.target.value) } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Users will be logged out after this period of inactivity.</p>
                </div>
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={settings.session.allow_concurrent} onChange={(e) => setSettings({ ...settings, session: { ...settings.session, allow_concurrent: e.target.checked } })} /> 
                    Allow concurrent sessions (login from multiple devices)
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => handleSave(settings)} disabled={saving}>Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">IP Restrictions</h3>
                  <p className="text-sm text-slate-500">Whitelist or blacklist IP ranges.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Whitelisted IPs (comma separated)</label>
                  <textarea 
                    rows={2}
                    value={settings.access_control.ip_whitelist.join(', ')}
                    onChange={(e) => setSettings({ ...settings, access_control: { ...settings.access_control, ip_whitelist: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blacklisted IPs (comma separated)</label>
                  <textarea 
                    rows={2}
                    value={settings.access_control.ip_blacklist.join(', ')}
                    onChange={(e) => setSettings({ ...settings, access_control: { ...settings.access_control, ip_blacklist: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm" 
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => handleSave(settings)} disabled={saving}>Save Changes</Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">OAuth / SSO Settings</h3>
                  <p className="text-sm text-slate-500">Configure Single Sign-On providers.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                    <span className="font-medium text-slate-700">Google Workspace</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.oauth.google_enabled} onChange={(e) => setSettings({ ...settings, oauth: { ...settings.oauth, google_enabled: e.target.checked } })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <img src="https://www.svgrepo.com/show/475666/microsoft-color.svg" alt="Microsoft" className="w-6 h-6" />
                    <span className="font-medium text-slate-700">Microsoft Azure AD</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.oauth.microsoft_enabled} onChange={(e) => setSettings({ ...settings, oauth: { ...settings.oauth, microsoft_enabled: e.target.checked } })} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => handleSave(settings)} disabled={saving}>Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">API Keys</h3>
                    <p className="text-sm text-slate-500">Manage programmable access keys.</p>
                  </div>
                </div>
                <Button size="sm">Generate Key</Button>
              </div>
              
              <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-sm">No active API keys found.</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Blocked Users</h3>
                  <p className="text-sm text-slate-500">Users temporarily locked out due to failed attempts.</p>
                </div>
              </div>
              {blockedUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-50">
                  <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                  No blocked users at this time.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">User</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Reason</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Blocked At</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {blockedUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">{user.user}</td>
                          <td className="px-6 py-4 text-slate-500">{user.reason}</td>
                          <td className="px-6 py-4 text-slate-500">{new Date(user.blocked_at).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <Button size="sm" variant="outline" onClick={() => handleUnblock(user.id)}>Unblock</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-lg">Recent Login Attempts</h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">User</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">IP & Location</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loginAttempts.map(attempt => (
                      <tr key={attempt.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-500">{new Date(attempt.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 text-sm">{attempt.user}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          <div>{attempt.ip}</div>
                          <div className="text-xs text-slate-400">{attempt.location}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={attempt.status === 'Success' ? 'success' : attempt.status === 'Failed' ? 'warning' : 'danger'}>
                            {attempt.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
