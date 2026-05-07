import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Employee, EmployeeFormData } from '../types';
import { Button, Input, Select } from './UI';

const employeeSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required'),
  employee_name: z.string().min(2, 'Name must be at least 2 characters'),
  joining_date: z.string().min(1, 'Joining date is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  department_id: z.string().min(1, 'Department is required'),
  designation_id: z.string().min(1, 'Designation is required'),
  client_id: z.string().min(1, 'Client is required'),
  workplace_id: z.string().min(1, 'Workplace is required'),
  status: z.enum(['Active', 'Inactive', 'Resigned']),
  experience_years: z.coerce.number().min(0, 'Experience must be 0 or more'),
  reporting_manager_id: z.string().optional(),
});

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: EmployeeFormData) => void;
  isLoading?: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  initialData, 
  onSubmit, 
  isLoading 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData,
  });

  const onFormSubmit = (data: any) => {
    onSubmit(data as EmployeeFormData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID*</label>
          <Input {...register('employee_id')} placeholder="e.g. EMP123" />
          {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name*</label>
          <Input {...register('employee_name')} placeholder="e.g. John Doe" />
          {errors.employee_name && <p className="mt-1 text-xs text-red-500">{errors.employee_name.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address*</label>
          <Input type="email" {...register('email')} placeholder="john@example.com" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number*</label>
          <Input {...register('phone')} placeholder="+1 234 567 890" />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Joining Date*</label>
          <Input type="date" {...register('joining_date')} />
          {errors.joining_date && <p className="mt-1 text-xs text-red-500">{errors.joining_date.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status*</label>
          <Select {...register('status')}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Resigned">Resigned</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department*</label>
          <Input {...register('department_id')} placeholder="e.g. Engineering" />
          {errors.department_id && <p className="mt-1 text-xs text-red-500">{errors.department_id.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Designation*</label>
          <Input {...register('designation_id')} placeholder="e.g. Software Engineer" />
          {errors.designation_id && <p className="mt-1 text-xs text-red-500">{errors.designation_id.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Client*</label>
          <Input {...register('client_id')} placeholder="e.g. Google" />
          {errors.client_id && <p className="mt-1 text-xs text-red-500">{errors.client_id.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Workplace*</label>
          <Input {...register('workplace_id')} placeholder="e.g. New York Office" />
          {errors.workplace_id && <p className="mt-1 text-xs text-red-500">{errors.workplace_id.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)*</label>
          <Input type="number" {...register('experience_years')} placeholder="0" />
          {errors.experience_years && <p className="mt-1 text-xs text-red-500">{errors.experience_years.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reporting Manager ID</label>
          <Input {...register('reporting_manager_id')} placeholder="e.g. EMP001" />
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
          {initialData?.id ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
};
