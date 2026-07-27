import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Project } from '../types';
import { Card, Badge, cn, Button } from '../components/UI';
import { 
  ArrowLeft, Users, Flag, FileText, AlertTriangle, 
  IndianRupee, Calendar, CheckCircle, Clock3, AlertCircle,
  Edit, XCircle, Archive, History, BarChart2, CheckSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

type Tab = 'Overview' | 'Team Members' | 'Tasks' | 'Milestones' | 'Documents' | 'Risks' | 'Budget' | 'Timeline' | 'Activity Log';
const TABS: Tab[] = ['Overview', 'Team Members', 'Tasks', 'Milestones', 'Documents', 'Risks', 'Budget', 'Timeline', 'Activity Log'];

export const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  useEffect(() => {
    if (id) fetchProject(id);
  }, [id]);

  const fetchProject = async (projectId: string) => {
    try {
      const { data } = await apiService.getProjectById(projectId);
      if (data) {
        setProject(data);
      } else {
        toast.error('Project not found');
        navigate('/projects');
      }
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading project details...</div>;
  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
              <Badge variant={project.status === 'Active' ? 'success' : 'default'}>
                {project.status}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1">Project ID: {project.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-2"><Edit className="w-4 h-4"/> Edit Project</Button>
          <Button size="sm" variant="outline" className="gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"><XCircle className="w-4 h-4"/> Close Project</Button>
          <Button size="sm" variant="outline" className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50"><Archive className="w-4 h-4"/> Archive Project</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab ? "border-primary-600 text-primary-600" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2 text-slate-600">
                <IndianRupee className="w-5 h-5" />
                <h3 className="font-semibold">Budget Allocation</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">₹{project.budget.toLocaleString()}</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2 text-slate-600">
                <Users className="w-5 h-5" />
                <h3 className="font-semibold">Team Members</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{project.team_members_count}</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2 text-slate-600">
                <Flag className="w-5 h-5" />
                <h3 className="font-semibold">Milestones</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">{project.milestones_count}</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2 text-slate-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold">Active Risks</h3>
              </div>
              <p className={cn("text-3xl font-bold", project.risks_count > 0 ? "text-amber-600" : "text-slate-900")}>
                {project.risks_count}
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'Team Members' && (
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Employee ID</th>
                  <th className="px-6 py-4 font-semibold">Project Role</th>
                  <th className="px-6 py-4 font-semibold">Allocation %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.team_members?.map(tm => (
                  <tr key={tm.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium">{tm.employee_id}</td>
                    <td className="px-6 py-4">{tm.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                          <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${tm.allocation}%` }}></div>
                        </div>
                        <span className="text-xs font-medium">{tm.allocation}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {!project.team_members?.length && <tr><td colSpan={3} className="p-8 text-center text-slate-500">No team members assigned</td></tr>}
              </tbody>
            </table>
          </Card>
        )}

        {activeTab === 'Tasks' && (
          <Card className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[200px]">
            <CheckSquare className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Tasks</h3>
            <p className="mt-2">View and manage tasks for this project.</p>
          </Card>
        )}

        {activeTab === 'Milestones' && (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
            {project.milestones?.map((ms) => (
              <div key={ms.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  {ms.status === 'Achieved' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Clock3 className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900">{ms.title}</h3>
                    <span className="text-xs font-medium text-slate-500">{ms.date}</span>
                  </div>
                  <Badge variant={ms.status === 'Achieved' ? 'success' : 'default'}>{ms.status}</Badge>
                </div>
              </div>
            ))}
            {!project.milestones?.length && <div className="p-8 text-center text-slate-500">No milestones defined</div>}
          </div>
        )}

        {activeTab === 'Documents' && (
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Document Title</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Size</th>
                  <th className="px-6 py-4 font-semibold">Uploaded By</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.documents?.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium flex items-center gap-2 text-primary-600 cursor-pointer">
                      <FileText className="w-4 h-4" /> {doc.title}
                    </td>
                    <td className="px-6 py-4">{doc.type}</td>
                    <td className="px-6 py-4">{doc.size}</td>
                    <td className="px-6 py-4">{doc.uploaded_by}</td>
                    <td className="px-6 py-4">{doc.uploaded_at}</td>
                  </tr>
                ))}
                {!project.documents?.length && <tr><td colSpan={5} className="p-8 text-center text-slate-500">No documents uploaded</td></tr>}
              </tbody>
            </table>
          </Card>
        )}

        {activeTab === 'Budget' && (
          <Card className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[200px]">
            <IndianRupee className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Budget Details</h3>
            <p className="mt-2">Track expenses, budget allocation, and financial health.</p>
          </Card>
        )}

        {activeTab === 'Risks' && (
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Risk Title</th>
                  <th className="px-6 py-4 font-semibold text-center">Severity</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.risks?.map(risk => (
                  <tr key={risk.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <AlertCircle className={cn(
                        "w-4 h-4",
                        risk.severity === 'High' ? "text-red-500" : risk.severity === 'Medium' ? "text-amber-500" : "text-blue-500"
                      )} />
                      {risk.title}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={risk.severity === 'High' ? 'danger' : risk.severity === 'Medium' ? 'warning' : 'outline'}>
                        {risk.severity}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={risk.status === 'Open' ? 'warning' : risk.status === 'Closed' ? 'default' : 'success'}>
                        {risk.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {!project.risks?.length && <tr><td colSpan={3} className="p-8 text-center text-slate-500">No active risks</td></tr>}
              </tbody>
            </table>
          </Card>
        )}
        {activeTab === 'Timeline' && (
          <Card className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[200px]">
            <Calendar className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Project Timeline</h3>
            <p className="mt-2">Gantt chart and schedule overview.</p>
          </Card>
        )}

        {activeTab === 'Activity Log' && (
          <Card className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[200px]">
            <History className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Activity Log</h3>
            <p className="mt-2">Audit trail and recent project activities.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
