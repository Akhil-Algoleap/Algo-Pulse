import React, { useEffect, useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  Edit2,
  Paperclip,
  MessageSquare,
  Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Select, Badge, Card, Input, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { Employee, ProjectTask, TaskStatus } from '../types';

// Mock data since we don't have a real backend for tasks yet
const INITIAL_TASKS: ProjectTask[] = [
  {
    id: 'TSK-001',
    name: 'Implement SSO Login',
    description: 'Integrate Google and Microsoft SSO for employee login.',
    priority: 'High',
    story_points: 8,
    assigned_employee_id: 'EMP001',
    assigned_employee_name: 'Akhil',
    due_date: '2026-08-10',
    status: 'In Progress',
    attachments_count: 2,
    comments_count: 5
  },
  {
    id: 'TSK-002',
    name: 'Fix Dashboard Chart Rendering',
    description: 'Charts are overflowing their containers on mobile devices.',
    priority: 'Medium',
    story_points: 3,
    assigned_employee_id: 'EMP002',
    assigned_employee_name: 'Rahul',
    due_date: '2026-08-05',
    status: 'To Do',
    attachments_count: 0,
    comments_count: 1
  },
  {
    id: 'TSK-003',
    name: 'Update Navigation Icons',
    description: 'Use Lucide icons across the entire sidebar navigation.',
    priority: 'Low',
    story_points: 2,
    assigned_employee_id: 'EMP003',
    assigned_employee_name: 'Priya',
    due_date: '2026-08-01',
    status: 'Completed',
    attachments_count: 1,
    comments_count: 0
  },
  {
    id: 'TSK-004',
    name: 'E2E Testing for Onboarding',
    description: 'Write Cypress tests for the new employee onboarding flow.',
    priority: 'High',
    story_points: 5,
    assigned_employee_id: 'EMP004',
    assigned_employee_name: 'Sneha',
    due_date: '2026-08-15',
    status: 'Testing',
    attachments_count: 3,
    comments_count: 8
  },
  {
    id: 'TSK-005',
    name: 'Database Migration',
    description: 'Migrate legacy user data to the new schema.',
    priority: 'High',
    story_points: 13,
    assigned_employee_id: 'EMP001',
    assigned_employee_name: 'Akhil',
    due_date: '2026-08-20',
    status: 'Blocked',
    attachments_count: 0,
    comments_count: 2
  }
];

const STATUS_OPTIONS: TaskStatus[] = ['To Do', 'In Progress', 'Blocked', 'Testing', 'Completed'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<ProjectTask[]>(INITIAL_TASKS);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<ProjectTask>>({});

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiService.getEmployees();
        setEmployees(data || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleOpenModal = (task?: ProjectTask) => {
    if (task) {
      setEditingTask(task);
      setFormData({ ...task });
    } else {
      setEditingTask(null);
      setFormData({
        name: '',
        description: '',
        priority: 'Medium',
        story_points: 1,
        assigned_employee_id: '',
        due_date: '',
        status: 'To Do',
        attachments_count: 0,
        comments_count: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.assigned_employee_id || !formData.due_date) {
      return toast.error('Please fill in all required fields');
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      const selectedEmp = employees.find(e => e.id.toString() === formData.assigned_employee_id?.toString());
      const empName = selectedEmp?.employee_name || 'Unassigned';

      if (editingTask) {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? { 
          ...t, 
          ...formData, 
          assigned_employee_name: empName 
        } as ProjectTask : t));
        toast.success('Task updated successfully');
      } else {
        const newTask: ProjectTask = {
          ...(formData as ProjectTask),
          id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
          assigned_employee_name: empName,
          attachments_count: 0,
          comments_count: 0
        };
        setTasks(prev => [newTask, ...prev]);
        toast.success('Task created successfully');
      }

      setIsModalOpen(false);
      setIsSubmitting(false);
    }, 600);
  };

  const filteredTasks = tasks.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assigned_employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do': return 'default';
      case 'In Progress': return 'primary';
      case 'Blocked': return 'danger';
      case 'Testing': return 'warning';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
          <p className="text-slate-500">Track and manage project tasks</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 shadow-lg shadow-primary-100">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden p-0">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary-600" />
            Project Tasks
          </h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search tasks, assignees..." 
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
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Task Details</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Assignee</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status & Priority</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading && employees.length === 0 ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                  </tr>
                ))
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                       <CheckSquare className="w-10 h-10 text-slate-200 mb-2" />
                       <p className="text-slate-400 font-medium">No tasks found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-1">{task.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{task.id}</span>
                        <span className="text-xs text-slate-500 truncate max-w-[200px]" title={task.description}>{task.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center font-bold text-primary-700 text-xs shadow-sm border border-primary-200">
                        {task.assigned_employee_name?.charAt(0) || '?'}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{task.assigned_employee_name || 'Unassigned'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <Badge variant={getStatusColor(task.status)} className="text-[10px] uppercase tracking-wider font-bold">
                        {task.status}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={getPriorityColor(task.priority)} className="bg-transparent border-none p-0 text-xs shadow-none">
                          <span className="w-2 h-2 rounded-full mr-1.5 inline-block bg-current opacity-70" />
                          {task.priority} Priority
                        </Badge>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-semibold text-slate-500">{task.story_points} pts</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CalendarIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium">{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-slate-400 hover:text-primary-600 transition-colors cursor-pointer" title="Attachments">
                        <Paperclip className="w-4 h-4" />
                        <span className="text-xs font-bold">{task.attachments_count}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 hover:text-primary-600 transition-colors cursor-pointer" title="Comments">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs font-bold">{task.comments_count}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors"
                      onClick={() => handleOpenModal(task)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Task Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Task Name *</label>
            <Input 
              required
              placeholder="e.g. Implement SSO Login" 
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl px-4 py-3 text-sm transition-all outline-none resize-none"
              rows={3}
              placeholder="Provide more details about this task..."
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
              <Select 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value as TaskStatus})}
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Priority</label>
              <Select 
                value={formData.priority} 
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
              >
                {PRIORITY_OPTIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Story Points</label>
              <Input 
                type="number"
                min="1"
                required
                value={formData.story_points || ''}
                onChange={(e) => setFormData({...formData, story_points: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Due Date *</label>
              <Input 
                type="date"
                required
                value={formData.due_date || ''}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Assign To *</label>
            <Select 
              required
              value={formData.assigned_employee_id || ''} 
              onChange={(e) => setFormData({...formData, assigned_employee_id: e.target.value})}
            >
              <option value="">Select an employee...</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.employee_name}</option>
              ))}
            </Select>
          </div>

          <div className="flex gap-4 pt-4 mt-4 border-t border-slate-100">
            <Button variant="outline" className="flex-1 py-3" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button className="flex-1 py-3 shadow-lg shadow-primary-100" isLoading={isSubmitting} type="submit">
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
