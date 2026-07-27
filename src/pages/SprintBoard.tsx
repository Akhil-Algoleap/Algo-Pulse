import React, { useState } from 'react';
import { Badge, cn } from '../components/UI';
import { MoreHorizontal, Plus, CheckCircle2 } from 'lucide-react';

type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Code Review' | 'Testing' | 'Done';

interface Task {
  id: string;
  title: string;
  type: 'Bug' | 'Feature' | 'Story' | 'Task';
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
  status: TaskStatus;
  assignee: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 'T-1', title: 'Implement SSO Login', type: 'Feature', priority: 'High', storyPoints: 8, status: 'To Do', assignee: 'Akhil' },
  { id: 'T-2', title: 'Fix Dashboard Chart Rendering', type: 'Bug', priority: 'Medium', storyPoints: 3, status: 'In Progress', assignee: 'Rahul' },
  { id: 'T-3', title: 'Update Navigation Icons', type: 'Story', priority: 'Low', storyPoints: 2, status: 'Done', assignee: 'Priya' },
  { id: 'T-4', title: 'Write API Documentation', type: 'Story', priority: 'Medium', storyPoints: 5, status: 'Backlog', assignee: 'Akhil' },
  { id: 'T-5', title: 'Code Review for PR #42', type: 'Task', priority: 'High', storyPoints: 1, status: 'Code Review', assignee: 'Rahul' },
  { id: 'T-6', title: 'E2E Testing for Onboarding', type: 'Task', priority: 'High', storyPoints: 5, status: 'Testing', assignee: 'Priya' },
];

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'Backlog', label: 'Backlog' },
  { id: 'To Do', label: 'To Do' },
  { id: 'In Progress', label: 'In Progress' },
  { id: 'Code Review', label: 'Code Review' },
  { id: 'Testing', label: 'Testing' },
  { id: 'Done', label: 'Done' }
];

export const SprintBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires setting data to drag
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(prev => prev.map(t => t.id === draggedTaskId ? { ...t, status } : t));
      setDraggedTaskId(null);
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
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Sprint 42
            <Badge variant="success">Active</Badge>
          </h1>
          <p className="text-slate-500 mt-1">Goal: Stabilize core auth flows and improve dashboard performance.</p>
        </div>
        <div className="flex items-center gap-6 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-center px-4 border-r border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Points</p>
            <p className="text-xl font-black text-slate-900">
              {tasks.reduce((acc, t) => acc + t.storyPoints, 0)}
            </p>
          </div>
          <div className="text-center px-4 border-r border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Completed</p>
            <p className="text-xl font-black text-green-600">
              {tasks.filter(t => t.status === 'Done').reduce((acc, t) => acc + t.storyPoints, 0)}
            </p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Velocity</p>
            <p className="text-xl font-black text-primary-600">45 pts/sp</p>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-6 h-full items-start min-w-max pb-8">
          {COLUMNS.map(column => {
            const columnTasks = tasks.filter(t => t.status === column.id);
            return (
              <div 
                key={column.id} 
                className="w-80 flex flex-col h-full max-h-full bg-slate-100/50 rounded-2xl p-4 border border-slate-200 shrink-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700">{column.label}</h3>
                    <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar">
                  {columnTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={cn(
                        "bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-primary-300 hover:shadow-md transition-all group",
                        draggedTaskId === task.id ? "opacity-50 border-primary-500 scale-95" : ""
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-sm mb-3 leading-snug">{task.title}</h4>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{task.id}</span>
                          <span className="flex items-center text-xs font-semibold gap-1" title="Story Points">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {task.storyPoints}
                          </span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-black text-primary-700 border-2 border-white shadow-sm" title={task.assignee}>
                          {task.assignee.charAt(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="h-24 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm font-medium">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
