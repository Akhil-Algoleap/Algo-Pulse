import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, CheckCircle2, User, FileText, Monitor, LogIn } from 'lucide-react';
import { Card, Badge } from '../components/UI';
import { apiService } from '../services/api';
import { AuditEvent } from '../types';

export const EmployeeTimeline: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiService.getAuditLogs(id);
        setLogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [id]);

  const getIconForAction = (action: string) => {
    switch (action) {
      case 'Joined Company': return <LogIn className="w-5 h-5 text-emerald-500" />;
      case 'Onboarding Completed': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'Profile Updated': return <User className="w-5 h-5 text-amber-500" />;
      case 'Leave Applied': return <FileText className="w-5 h-5 text-purple-500" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employee Timeline</h1>
        <p className="text-slate-500">Audit logs and historical events</p>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
        {logs.length === 0 ? (
          <p className="text-slate-500 ml-8">No events found for this employee yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="relative ml-8">
              <span className="absolute -left-[41px] bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                {getIconForAction(log.action)}
              </span>
              <Card className="p-4 border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900">{log.action}</h3>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{log.description}</p>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
