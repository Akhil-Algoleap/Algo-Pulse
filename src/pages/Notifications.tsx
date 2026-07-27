import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Check, 
  Trash2,
  FileText,
  CreditCard,
  PieChart
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'Approval' | 'Alert' | 'Reminder' | 'Info';
  isRead: boolean;
};

export const Notifications: React.FC = () => {
  const { profile } = useAuth();
  
  const FINANCE_NOTIFS: Notification[] = [
    { id: '1', title: 'Payroll Ready for Approval', message: 'July 2026 payroll has been generated and is awaiting your review.', time: '10 mins ago', type: 'Approval', isRead: false },
    { id: '2', title: 'New Travel Claim', message: 'Akhil submitted a new international travel claim for $1,200.', time: '1 hour ago', type: 'Approval', isRead: false },
    { id: '3', title: 'Budget Exceeded', message: 'Marketing department has exceeded 90% of their annual budget.', time: '2 hours ago', type: 'Alert', isRead: false },
    { id: '4', title: 'Vendor Invoice Due', message: 'Invoice INV-2026-089 for AWS Cloud is due in 3 days.', time: '5 hours ago', type: 'Reminder', isRead: true },
    { id: '5', title: 'Purchase Request Pending', message: '10 Dell Laptops requested by IT department require budget approval.', time: '1 day ago', type: 'Approval', isRead: true },
    { id: '6', title: 'Salary Release Reminder', message: 'Scheduled salary release for July 2026 is due tomorrow.', time: '1 day ago', type: 'Reminder', isRead: true },
    { id: '7', title: 'New Expense Claim', message: 'John Doe submitted a medical expense claim.', time: '2 days ago', type: 'Approval', isRead: true },
  ];

  const MANAGER_NOTIFS: Notification[] = [
    { id: '1', title: 'Leave Request', message: 'Akhil requested 2 days of annual leave.', time: '1 hour ago', type: 'Approval', isRead: false },
    { id: '2', title: 'Timesheet Submission', message: '3 team members submitted their weekly timesheets.', time: '3 hours ago', type: 'Info', isRead: false },
  ];

  const PAYROLL_NOTIFS: Notification[] = [
    { id: '1', title: 'Attendance Locked', message: 'July attendance data has been locked for processing.', time: '10 mins ago', type: 'Info', isRead: false },
    { id: '2', title: 'Leave Approved', message: 'Reporting manager approved 2 days leave for Jane Smith.', time: '1 hour ago', type: 'Info', isRead: false },
    { id: '3', title: 'Salary Revision Requested', message: 'HR requested a salary revision for Robert Brown.', time: '2 hours ago', type: 'Approval', isRead: false },
    { id: '4', title: 'Bonus Approved', message: 'Performance bonus approved for Q2.', time: '5 hours ago', type: 'Info', isRead: true },
    { id: '5', title: 'Payroll Ready', message: 'July payroll draft is ready for your review.', time: '1 day ago', type: 'Reminder', isRead: true },
    { id: '6', title: 'Finance Approved Payroll', message: 'Finance team has approved the July salary sheet.', time: '1 day ago', type: 'Approval', isRead: true },
    { id: '7', title: 'Tax Rule Updated', message: 'New income tax slabs have been applied to the system.', time: '2 days ago', type: 'Alert', isRead: true },
    { id: '8', title: 'Overtime Approved', message: 'Overtime hours for Alice Johnson have been approved.', time: '2 days ago', type: 'Info', isRead: true },
  ];

  const getNotifs = () => {
    if (profile?.role === 'Finance') return FINANCE_NOTIFS;
    if (profile?.role === 'Payroll Manager') return PAYROLL_NOTIFS;
    if (profile?.role === 'Project Manager' || profile?.role === 'Reporting Manager') return MANAGER_NOTIFS;
    return [{ id: '1', title: 'Welcome', message: 'Welcome to Algo Pulse.', time: '1 day ago', type: 'Info', isRead: true } as Notification];
  };

  const [notifications, setNotifications] = useState<Notification[]>(getNotifs());

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'Approval': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Alert': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'Reminder': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Info': return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">
            You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={markAllRead} className="gap-2 text-sm" disabled={unreadCount === 0}>
                <Check className="w-4 h-4" /> Mark all as read
            </Button>
            <Button variant="outline" onClick={clearAll} className="gap-2 text-sm text-rose-600 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50" disabled={notifications.length === 0}>
                <Trash2 className="w-4 h-4" /> Clear all
            </Button>
        </div>
      </div>

      <Card className="bg-white border-slate-200">
        <div className="divide-y divide-slate-100">
            {notifications.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                    <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">All caught up!</p>
                    <p className="text-sm">You have no new notifications.</p>
                </div>
            ) : (
                notifications.map(notif => (
                    <div 
                        key={notif.id} 
                        className={`p-4 flex gap-4 transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                        <div className="pt-1 shrink-0">
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className={`font-medium ${!notif.isRead ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                                    {notif.title}
                                </h3>
                                <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                            
                            {!notif.isRead && (
                                <button 
                                    onClick={() => markRead(notif.id)}
                                    className="mt-2 text-xs font-medium text-primary-600 hover:text-primary-700"
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                        {!notif.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
                        )}
                    </div>
                ))
            )}
        </div>
      </Card>
    </div>
  );
};
