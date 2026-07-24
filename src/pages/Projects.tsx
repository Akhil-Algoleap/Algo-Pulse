import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Project } from '../types';
import { Card, Button, Badge, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { Briefcase, Plus, Users, Flag, AlertTriangle, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    budget: '',
    team_members_count: '',
    milestones_count: '',
    risks_count: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await apiService.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name) {
      toast.error('Project name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: newProject.name,
        budget: newProject.budget ? Number(newProject.budget) : 0,
        team_members_count: newProject.team_members_count ? Number(newProject.team_members_count) : 0,
        milestones_count: newProject.milestones_count ? Number(newProject.milestones_count) : 0,
        risks_count: newProject.risks_count ? Number(newProject.risks_count) : 0,
      };
      
      const { data } = await apiService.createProject(payload);
      setProjects([...projects, data]);
      setIsModalOpen(false);
      setNewProject({ name: '', budget: '', team_members_count: '', milestones_count: '', risks_count: '' });
      toast.success('Project created successfully');
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = projects.filter(p => p.status === activeTab);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">Manage deliverables, resource allocation, and sprints</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('Active')}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'Active' ? "border-primary-600 text-primary-600" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          Active Projects
        </button>
        <button
          onClick={() => setActiveTab('Completed')}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'Completed' ? "border-primary-600 text-primary-600" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          Completed Projects
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Card key={project.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0",
                  project.status === 'Active' ? "bg-blue-600" : "bg-green-600"
                )}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{project.name}</h3>
                  <Badge variant={project.status === 'Active' ? 'success' : 'default'} className="mt-1">
                    {project.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Team Size</p>
                <p className="text-lg font-bold text-slate-900">{project.team_members_count}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1"><Flag className="w-3 h-3"/> Milestones</p>
                <p className="text-lg font-bold text-slate-900">{project.milestones_count}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1"><IndianRupee className="w-3 h-3"/> Budget</p>
                <p className="text-lg font-bold text-slate-900">₹{(project.budget / 1000).toFixed(0)}k</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Risks</p>
                <p className={cn("text-lg font-bold", project.risks_count > 0 ? "text-amber-600" : "text-slate-900")}>
                  {project.risks_count}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
              <Button onClick={() => navigate(`/projects/${project.id}`)} variant="outline" size="sm" className="flex-1 text-xs py-1.5 text-primary-600 border-primary-200 hover:bg-primary-50">View Full Details</Button>
            </div>
          </Card>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
            <p className="text-slate-500">No {activeTab.toLowerCase()} projects found.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
            <input
              type="text"
              value={newProject.name}
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Website Redesign"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget (₹)</label>
              <input
                type="number"
                value={newProject.budget}
                onChange={e => setNewProject({ ...newProject, budget: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Team Size</label>
              <input
                type="number"
                value={newProject.team_members_count}
                onChange={e => setNewProject({ ...newProject, team_members_count: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Number of Milestones</label>
              <input
                type="number"
                value={newProject.milestones_count}
                onChange={e => setNewProject({ ...newProject, milestones_count: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Initial Risks Identified</label>
              <input
                type="number"
                value={newProject.risks_count}
                onChange={e => setNewProject({ ...newProject, risks_count: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 1"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} disabled={saving}>{saving ? 'Saving...' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
