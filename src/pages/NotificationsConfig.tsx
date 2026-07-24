import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Card, Button, Badge, Modal } from '../components/UI';
import { Bell, Mail, MessageSquare, Smartphone, Edit2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { NotificationTemplate } from '../types';

export const NotificationsConfig: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await apiService.getNotificationTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to fetch notification templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    try {
      await apiService.updateNotificationTemplate(editingTemplate.id, editingTemplate);
      toast.success('Template updated successfully');
      setEditingTemplate(null);
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to update template');
    }
  };

  const toggleChannel = (channel: 'In-App' | 'Email' | 'Teams' | 'SMS') => {
    if (!editingTemplate) return;
    const channels = [...editingTemplate.channels];
    if (channels.includes(channel)) {
      channels.splice(channels.indexOf(channel), 1);
    } else {
      channels.push(channel);
    }
    setEditingTemplate({ ...editingTemplate, channels });
  };

  const getChannelIcon = (channel: string, active: boolean) => {
    const className = `w-4 h-4 ${active ? 'text-primary-600' : 'text-slate-400'}`;
    switch (channel) {
      case 'In-App': return <Bell className={className} />;
      case 'Email': return <Mail className={className} />;
      case 'Teams': return <MessageSquare className={className} />;
      case 'SMS': return <Smartphone className={className} />;
      default: return <Bell className={className} />;
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Notification Center...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notification Center</h1>
        <p className="text-slate-500">Manage notification templates and delivery channels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <Card key={template.id} className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-900">{template.type}</h3>
              <Button variant="ghost" size="sm" onClick={() => setEditingTemplate({ ...template })}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 mb-4">
              <p className="text-sm font-semibold text-slate-600 mb-1">Subject</p>
              <p className="text-sm text-slate-900 mb-4">{template.subject_template}</p>
              
              <p className="text-sm font-semibold text-slate-600 mb-1">Preview</p>
              <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 whitespace-pre-wrap font-mono text-xs line-clamp-3">
                {template.body_template}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">Active Channels</p>
              <div className="flex gap-2">
                {['In-App', 'Email', 'Teams', 'SMS'].map(channel => (
                  <div 
                    key={channel}
                    title={channel}
                    className={`p-2 rounded-lg border ${template.channels.includes(channel as any) ? 'bg-primary-50 border-primary-200' : 'bg-slate-50 border-slate-200 opacity-50'}`}
                  >
                    {getChannelIcon(channel, template.channels.includes(channel as any))}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        title={`Edit Template: ${editingTemplate?.type}`}
        size="lg"
      >
        {editingTemplate && (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Active Channels</label>
              <div className="flex flex-wrap gap-3">
                {['In-App', 'Email', 'Teams', 'SMS'].map(channel => {
                  const isActive = editingTemplate.channels.includes(channel as any);
                  return (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => toggleChannel(channel as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        isActive ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {getChannelIcon(channel, isActive)}
                      {channel}
                      {isActive && <CheckCircle className="w-4 h-4 text-primary-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Template</label>
              <input
                type="text"
                value={editingTemplate.subject_template}
                onChange={e => setEditingTemplate({ ...editingTemplate, subject_template: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Body Template</label>
              <textarea
                value={editingTemplate.body_template}
                onChange={e => setEditingTemplate({ ...editingTemplate, body_template: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                required
              />
              <p className="text-xs text-slate-500 mt-2">
                Use {'{{VariableName}}'} syntax to inject dynamic data. E.g. {'{{EmployeeName}}'}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setEditingTemplate(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
