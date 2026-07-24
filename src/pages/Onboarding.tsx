import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Monitor,
  Banknote,
  UserCheck,
  Presentation,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { Card, Badge, Button, cn } from '../components/UI';
import { Modal } from '../components/Modal';

// --- Types ---
type OnboardingStatus = 'Pending' | 'In Progress' | 'Completed';

interface OnboardingTask {
  id: string;
  name: string;
  status: 'Completed' | 'Pending';
  completedAt?: string;
}

interface OnboardingRecord {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  joiningDate: string;
  overallProgress: number;
  pillars: {
    profile: OnboardingStatus;
    documents: OnboardingStatus;
    itSetup: OnboardingStatus;
    payroll: OnboardingStatus;
    managerApproval: OnboardingStatus;
    orientation: OnboardingStatus;
  };
  checklist: OnboardingTask[];
}

// --- Mock Data ---
const MOCK_ONBOARDING_RECORDS: OnboardingRecord[] = [
  {
    id: 'OB-001',
    employeeName: 'Alice Johnson',
    role: 'Frontend Developer',
    department: 'Engineering',
    joiningDate: '2023-11-01',
    overallProgress: 85,
    pillars: {
      profile: 'Completed',
      documents: 'Completed',
      itSetup: 'Completed',
      payroll: 'Completed',
      managerApproval: 'Completed',
      orientation: 'In Progress'
    },
    checklist: [
      { id: '1', name: 'Offer Accepted', status: 'Completed', completedAt: '2023-10-15' },
      { id: '2', name: 'Employee Registered', status: 'Completed', completedAt: '2023-10-16' },
      { id: '3', name: 'Documents Uploaded', status: 'Completed', completedAt: '2023-10-18' },
      { id: '4', name: 'Laptop Assigned', status: 'Completed', completedAt: '2023-10-25' },
      { id: '5', name: 'Email Created', status: 'Completed', completedAt: '2023-10-25' },
      { id: '6', name: 'Bank Details Added', status: 'Completed', completedAt: '2023-10-28' },
      { id: '7', name: 'Completed', status: 'Pending' },
    ]
  },
  {
    id: 'OB-002',
    employeeName: 'Bob Smith',
    role: 'Product Manager',
    department: 'Product',
    joiningDate: '2023-11-15',
    overallProgress: 40,
    pillars: {
      profile: 'Completed',
      documents: 'In Progress',
      itSetup: 'Pending',
      payroll: 'Pending',
      managerApproval: 'Pending',
      orientation: 'Pending'
    },
    checklist: [
      { id: '1', name: 'Offer Accepted', status: 'Completed', completedAt: '2023-11-01' },
      { id: '2', name: 'Employee Registered', status: 'Completed', completedAt: '2023-11-02' },
      { id: '3', name: 'Documents Uploaded', status: 'Pending' },
      { id: '4', name: 'Laptop Assigned', status: 'Pending' },
      { id: '5', name: 'Email Created', status: 'Completed', completedAt: '2023-11-03' },
      { id: '6', name: 'Bank Details Added', status: 'Pending' },
      { id: '7', name: 'Completed', status: 'Pending' },
    ]
  },
  {
    id: 'OB-003',
    employeeName: 'Charlie Davis',
    role: 'UX Designer',
    department: 'Design',
    joiningDate: '2023-10-20',
    overallProgress: 100,
    pillars: {
      profile: 'Completed',
      documents: 'Completed',
      itSetup: 'Completed',
      payroll: 'Completed',
      managerApproval: 'Completed',
      orientation: 'Completed'
    },
    checklist: [
      { id: '1', name: 'Offer Accepted', status: 'Completed', completedAt: '2023-10-01' },
      { id: '2', name: 'Employee Registered', status: 'Completed', completedAt: '2023-10-02' },
      { id: '3', name: 'Documents Uploaded', status: 'Completed', completedAt: '2023-10-05' },
      { id: '4', name: 'Laptop Assigned', status: 'Completed', completedAt: '2023-10-10' },
      { id: '5', name: 'Email Created', status: 'Completed', completedAt: '2023-10-10' },
      { id: '6', name: 'Bank Details Added', status: 'Completed', completedAt: '2023-10-15' },
      { id: '7', name: 'Completed', status: 'Completed', completedAt: '2023-10-20' },
    ]
  }
];

export const Onboarding: React.FC = () => {
  const [records] = useState<OnboardingRecord[]>(MOCK_ONBOARDING_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<OnboardingRecord | null>(null);

  const stats = [
    { label: 'Total In Progress', value: 12, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed This Month', value: 8, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Overdue Tasks', value: 3, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Upcoming Joiners', value: 5, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const filteredRecords = records.filter(record => 
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBg = (status: OnboardingStatus) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700';
      case 'In Progress': return 'bg-amber-50 text-amber-700';
      case 'Pending': return 'bg-slate-50 text-slate-500';
    }
  };

  const PillarBadge = ({ label, status, icon: Icon }: { label: string, status: OnboardingStatus, icon: any }) => (
    <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase", getStatusBg(status))} title={`${label}: ${status}`}>
      <Icon className="w-3 h-3" />
      <span className="hidden xl:inline">{label}</span>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Onboarding Tracker</h1>
        <p className="text-slate-500 text-lg">Manage checklists and setup for new joiners</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm flex items-center gap-4 p-6">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search by name or role..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Progress</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tracking Pillars</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedRecord(record)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0">
                        {record.employeeName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{record.employeeName}</p>
                        <p className="text-xs text-slate-500">{record.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-500", record.overallProgress === 100 ? 'bg-emerald-500' : 'bg-primary-500')} 
                          style={{ width: `${record.overallProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{record.overallProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <PillarBadge label="Profile" status={record.pillars.profile} icon={UserCheck} />
                      <PillarBadge label="Docs" status={record.pillars.documents} icon={FileText} />
                      <PillarBadge label="IT Setup" status={record.pillars.itSetup} icon={Monitor} />
                      <PillarBadge label="Payroll" status={record.pillars.payroll} icon={Banknote} />
                      <PillarBadge label="Approval" status={record.pillars.managerApproval} icon={CheckCircle2} />
                      <PillarBadge label="Orientation" status={record.pillars.orientation} icon={Presentation} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-slate-400 group-hover:text-primary-600">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Checklist Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="Onboarding Checklist"
      >
        {selectedRecord && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl font-black text-primary-600">
                {selectedRecord.employeeName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedRecord.employeeName}</h3>
                <p className="text-slate-500">{selectedRecord.role} • {selectedRecord.department}</p>
                <p className="text-xs font-bold text-slate-400 uppercase mt-1">Joining: {selectedRecord.joiningDate}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Granular Tasks</h4>
              {selectedRecord.checklist.map((task) => (
                <div key={task.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <button className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                    task.status === 'Completed' 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-300 bg-white hover:border-primary-400'
                  )}>
                    {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <p className={cn("font-bold text-sm", task.status === 'Completed' ? 'text-slate-900' : 'text-slate-700')}>
                      {task.name}
                    </p>
                    {task.completedAt && (
                      <p className="text-xs text-slate-500 mt-0.5">Completed on {task.completedAt}</p>
                    )}
                  </div>
                  {task.status === 'Pending' && (
                    <Badge variant="warning" className="text-[10px]">Pending</Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
