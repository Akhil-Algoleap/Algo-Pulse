import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Workflow, WorkflowStep } from '../types';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { ArrowRight, Plus, Settings, Trash2, GitMerge } from 'lucide-react';
import toast from 'react-hot-toast';

export const Workflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowTrigger, setNewWorkflowTrigger] = useState('');
  const [newWorkflowDesc, setNewWorkflowDesc] = useState('');
  const [newSteps, setNewSteps] = useState<WorkflowStep[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const { data } = await apiService.getWorkflows();
      setWorkflows(data);
    } catch (error) {
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = () => {
    setNewSteps([...newSteps, {
      id: `tmp-${Date.now()}`,
      workflow_id: '',
      step_order: newSteps.length + 1,
      role_name: 'Employee'
    }]);
  };

  const handleRemoveStep = (index: number) => {
    const updated = newSteps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_order: i + 1 }));
    setNewSteps(updated);
  };

  const handleUpdateStepRole = (index: number, role: string) => {
    const updated = [...newSteps];
    updated[index].role_name = role;
    setNewSteps(updated);
  };

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName || !newWorkflowTrigger) {
      toast.error('Name and Trigger Event are required');
      return;
    }
    if (newSteps.length === 0) {
      toast.error('Workflow must have at least one step');
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        name: newWorkflowName,
        trigger_event: newWorkflowTrigger,
        description: newWorkflowDesc,
        status: 'Active',
        steps: newSteps.map(s => ({ step_order: s.step_order, role_name: s.role_name }))
      };
      
      const { data } = await apiService.createWorkflow(payload);
      setWorkflows([...workflows, data]);
      setIsModalOpen(false);
      
      // Reset form
      setNewWorkflowName('');
      setNewWorkflowTrigger('');
      setNewWorkflowDesc('');
      setNewSteps([]);
      
      toast.success('Workflow created successfully');
    } catch (error) {
      toast.error('Failed to create workflow');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading workflows...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workflow Engine</h1>
          <p className="text-slate-500 mt-1">Design and manage automated approval and business processes</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Workflow
        </Button>
      </div>

      <div className="space-y-6">
        {workflows.map(wf => (
          <Card key={wf.id} className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                  <GitMerge className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    {wf.name}
                    <Badge variant={wf.status === 'Active' ? 'success' : 'default'}>{wf.status}</Badge>
                  </h3>
                  <p className="text-slate-500 mt-1 text-sm">{wf.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trigger Event:</span>
                    <Badge variant="outline" className="bg-slate-50">{wf.trigger_event}</Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
            </div>
            
            <div className="p-6 bg-slate-50/50">
              <h4 className="text-sm font-semibold text-slate-700 mb-4">Process Sequence</h4>
              <div className="flex flex-wrap items-center gap-2">
                {wf.steps.sort((a, b) => a.step_order - b.step_order).map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        {step.step_order}
                      </div>
                      <span className="font-medium text-slate-800 text-sm whitespace-nowrap">{step.role_name}</span>
                    </div>
                    {idx < wf.steps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Card>
        ))}
        {workflows.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <GitMerge className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Workflows Configured</h3>
            <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">Create your first workflow to automate approvals and business processes across the organization.</p>
            <Button onClick={() => setIsModalOpen(true)}>Create Workflow</Button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Workflow">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Workflow Name</label>
            <input
              type="text"
              value={newWorkflowName}
              onChange={e => setNewWorkflowName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Expense Reimbursement"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trigger Event</label>
            <input
              type="text"
              value={newWorkflowTrigger}
              onChange={e => setNewWorkflowTrigger(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Expense Claim Submitted"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={newWorkflowDesc}
              onChange={e => setNewWorkflowDesc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Briefly describe what this workflow does..."
              rows={2}
            />
          </div>
          
          <div className="border-t border-slate-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-slate-900">Define Process Sequence</label>
              <Button onClick={handleAddStep} variant="outline" size="sm" className="gap-1 text-xs">
                <Plus className="w-3 h-3" /> Add Step
              </Button>
            </div>
            
            <div className="space-y-3">
              {newSteps.map((step, idx) => (
                <div 
                  key={idx} 
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', idx.toString());
                    e.currentTarget.classList.add('opacity-50');
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.classList.remove('opacity-50');
                  }}
                  onDragOver={(e) => {
                    e.preventDefault(); // Necessary to allow dropping
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                    const toIdx = idx;
                    if (fromIdx === toIdx) return;
                    
                    const updated = [...newSteps];
                    const [moved] = updated.splice(fromIdx, 1);
                    updated.splice(toIdx, 0, moved);
                    
                    // Reassign step orders
                    const reordered = updated.map((s, i) => ({ ...s, step_order: i + 1 }));
                    setNewSteps(reordered);
                  }}
                  className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-move hover:border-slate-300 transition-colors"
                  title="Drag and drop to reorder"
                >
                  <div className="cursor-grab active:cursor-grabbing text-slate-400 px-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0 shadow-sm">
                    {step.step_order}
                  </div>
                  <div className="flex-1">
                    <select
                      value={step.role_name}
                      onChange={(e) => handleUpdateStepRole(idx, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Reporting Manager">Reporting Manager</option>
                      <option value="Department Head">Department Head</option>
                      <option value="HR">HR</option>
                      <option value="IT">IT</option>
                      <option value="Finance">Finance</option>
                      <option value="Payroll">Payroll</option>
                      <option value="Approved">Approved (Final State)</option>
                      <option value="Completed">Completed (Final State)</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => handleRemoveStep(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {newSteps.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-500 text-sm">No steps defined. Add a step to begin building the workflow.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateWorkflow} disabled={saving}>{saving ? 'Saving...' : 'Create Workflow'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
