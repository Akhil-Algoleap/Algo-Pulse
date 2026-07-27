import React, { useState } from 'react';
import { 
  Calculator, 
  Plus,
  Users,
  MinusCircle,
  PlusCircle,
  Edit
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

const EARNINGS = [
  'Basic Salary',
  'House Rent Allowance',
  'Medical Allowance',
  'Special Allowance',
  'Transport Allowance',
  'Meal Allowance',
  'Performance Allowance'
];

const DEDUCTIONS = [
  'Provident Fund',
  'Professional Tax',
  'Income Tax',
  'ESI',
  'Loan EMI',
  'Leave Deduction',
  'Other Deductions'
];

const MOCK_TEMPLATES = [
  { id: 1, name: 'L1 - Entry Level (Engineering)', baseGross: 600000, components: 8, assigned: 145 },
  { id: 2, name: 'L2 - Mid Level (Engineering)', baseGross: 1200000, components: 10, assigned: 89 },
  { id: 3, name: 'L3 - Senior (Management)', baseGross: 2400000, components: 12, assigned: 42 },
  { id: 4, name: 'Sales Executive (Commission Based)', baseGross: 450000, components: 7, assigned: 56 }
];

export const SalaryStructure: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Salary template created successfully.');
    setIsCreateModalOpen(false);
  };

  const handleAssignGrade = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Salary grade assigned to employees.');
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Salary Structure</h1>
          <p className="text-slate-500">Manage earnings, deductions, and salary templates.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsAssignModalOpen(true)}
          >
            <Users className="w-4 h-4" /> Assign Salary Grade
          </Button>
          <Button 
            variant="primary" 
            className="gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" /> Create Salary Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Components */}
        <Card className="border-none shadow-sm flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Earnings Components</h2>
                <p className="text-sm text-slate-500">Additions to gross pay</p>
              </div>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {EARNINGS.map(item => (
                <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate">{item}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-auto gap-2 border-dashed text-slate-500 hover:text-slate-700 hover:border-slate-400">
              <Plus className="w-4 h-4" /> Add Custom Earning
            </Button>
          </div>
        </Card>

        {/* Deductions Components */}
        <Card className="border-none shadow-sm flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <MinusCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Deduction Components</h2>
                <p className="text-sm text-slate-500">Subtractions from gross pay</p>
              </div>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {DEDUCTIONS.map(item => (
                <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate">{item}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-auto gap-2 border-dashed text-slate-500 hover:text-slate-700 hover:border-slate-400">
              <Plus className="w-4 h-4" /> Add Custom Deduction
            </Button>
          </div>
        </Card>
      </div>

      {/* Salary Templates */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Salary Templates & Grades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_TEMPLATES.map(template => (
            <Card key={template.id} className="p-6 border-none shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-primary-600" />
                </div>
                <Badge variant="default">{template.assigned} Assigned</Badge>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{template.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{template.components} configured components</p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Base CTC</p>
                  <p className="text-lg font-black text-slate-800">₹{(template.baseGross / 100000).toFixed(1)}L</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 text-primary-600 hover:bg-primary-50 border-primary-200">
                  <Edit className="w-4 h-4" /> Update
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Template Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Salary Template"
      >
        <form onSubmit={handleCreateTemplate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Template Name</label>
            <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Mid Level Engineering" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Base Annual CTC (₹)</label>
            <input required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="1200000" />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-500 mb-2">Select the components you wish to include. You can configure exact percentages/formulas after creation.</p>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Basic Salary</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> HRA</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Provident Fund</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Professional Tax</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Template</Button>
          </div>
        </form>
      </Modal>

      {/* Assign Grade Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Salary Grade"
      >
        <form onSubmit={handleAssignGrade} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee or Department</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white">
              <option>Engineering Department (All)</option>
              <option>John Doe (EMP001)</option>
              <option>Jane Smith (EMP002)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Salary Template</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white">
              {MOCK_TEMPLATES.map(t => (
                <option key={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Assign Grade</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
