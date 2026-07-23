import { supabase } from '../lib/supabase';


export interface ApiService {
  getEmployees: () => Promise<any>;
  createEmployee: (data: any) => Promise<any>;
  bulkCreateEmployees: (data: any[]) => Promise<any>;
  updateEmployee: (id: string, data: any) => Promise<any>;
  deleteEmployee: (id: string) => Promise<any>;
  getAssets: () => Promise<any>;
  getAssetHistory: (assetId: string) => Promise<any>;
  assignAsset: (assetId: string, employeeId: string) => Promise<any>;
  createAsset: (data: any) => Promise<any>;
  updateAsset: (id: string, data: any) => Promise<any>;
  getAttendance: (employeeId?: string) => Promise<any>;
  clockIn: (employeeId: string) => Promise<any>;
  triggerBiometricSwipe: (employeeIdCode: string, timestamp?: string) => Promise<any>;
  getPerformance: (employeeId?: string) => Promise<any>;
  addPerformance: (data: any) => Promise<any>;
  getLeaves: () => Promise<any>;
  applyLeave: (data: any) => Promise<any>;
  updateLeaveStatus: (id: string, status: any) => Promise<any>;
  getRegularizations: () => Promise<any>;
  applyRegularization: (data: any) => Promise<any>;
  updateRegularizationStatus: (id: string, status: any) => Promise<any>;
  getDocuments: (employeeId?: string) => Promise<any>;
  getExpenses: () => Promise<any>;
  updateExpenseStatus: (id: string, status: any, comment?: string) => Promise<any>;
  getLookups: () => Promise<any>;
  getDepartments: () => Promise<any>;
  getDesignations: () => Promise<any>;
  getClients: () => Promise<any>;
  getWorkplaces: () => Promise<any>;
  createDepartment: (data: any) => Promise<any>;
  createDesignation: (data: any) => Promise<any>;
  createClient: (data: any) => Promise<any>;
  createWorkplace: (data: any) => Promise<any>;
}

export const apiService: ApiService = {
  // Employees
  getEmployees: async () => {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) throw error;
    return { data: data || [] };
  },
  createEmployee: async (data: any) => {
    const payload = { ...data };
    if (payload.reporting_manager_id === 'N/A' || payload.reporting_manager_id === '') {
      payload.reporting_manager_id = null;
    }
    if (payload.project_manager_id === 'N/A' || payload.project_manager_id === '') {
      payload.project_manager_id = null;
    }
    const { data: result, error } = await supabase.from('employees').insert([payload]).select().single();
    if (error) throw error;
    return { data: result };
  },
  bulkCreateEmployees: async (data: any[]) => {
    const { data: result, error } = await supabase.from('employees').insert(data).select();
    if (error) throw error;
    return { data: result || [] };
  },
  updateEmployee: async (id: string, data: any) => {
    const payload = { ...data };
    if (payload.reporting_manager_id === 'N/A' || payload.reporting_manager_id === '') {
      payload.reporting_manager_id = null;
    }
    if (payload.project_manager_id === 'N/A' || payload.project_manager_id === '') {
      payload.project_manager_id = null;
    }
    const { data: result, error } = await supabase.from('employees').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return { data: result };
  },
  deleteEmployee: async (id: string) => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) throw error;
    return { message: 'Deleted successfully' };
  },

  // Assets
  getAssets: async () => {
    const { data, error } = await supabase.from('assets').select('*');
    if (error) throw error;
    return { data: data || [] };
  },
  getAssetHistory: async (_assetId: string) => ({ data: [] }),
  assignAsset: async (_assetId: string, _employeeId: string) => ({ data: {} }),
  createAsset: async (data: any) => {
    const { data: result, error } = await supabase.from('assets').insert([data]).select().single();
    if (error) throw error;
    return { data: result };
  },
  updateAsset: async (employee_id: string, data: any) => {
    const { data: result, error } = await supabase.from('assets').update(data).eq('employee_id', employee_id).select().single();
    if (error) throw error;
    return { data: result };
  },

  // Attendance
  getAttendance: async (employeeId?: string) => {
    let query = supabase.from('attendance').select('*');
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data: data || [] };
  },
  clockIn: async (employeeId: string) => {
    const newRecord = {
      employee_id: employeeId,
      date: new Date().toISOString().split('T')[0],
      clock_in: new Date().toISOString(),
      status: 'Present'
    };
    const { data, error } = await supabase.from('attendance').insert([newRecord]).select().single();
    if (error) throw error;
    return { data };
  },
  triggerBiometricSwipe: async (employeeIdCode: string, timestamp?: string) => {
    // Basic implementation for biometric swipe
    const newRecord = {
      employee_id_code: employeeIdCode,
      date: new Date().toISOString().split('T')[0],
      clock_in: timestamp || new Date().toISOString(),
      status: 'Present'
    };
    const { data, error } = await supabase.from('attendance').insert([newRecord]).select().single();
    if (error) throw error;
    return { data };
  },

  // Performance (Mocked for now)
  getPerformance: async (_employeeId?: string) => ({ data: [] }),
  addPerformance: async (data: any) => ({ data: { id: Date.now().toString(), ...data, date: new Date().toISOString() } }),

  // Leaves
  getLeaves: async () => {
    const { data, error } = await supabase.from('leaves').select('*');
    if (error) throw error;
    return { data: data || [] };
  },
  applyLeave: async (data: any) => {
    const { data: result, error } = await supabase.from('leaves').insert([data]).select().single();
    if (error) throw error;
    return { data: result };
  },
  updateLeaveStatus: async (id: string, status: any) => {
    const { data, error } = await supabase.from('leaves').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    return { data };
  },

  // Regularizations (Mocked for now since table doesn't exist yet)
  getRegularizations: async () => ({ data: [] }),
  applyRegularization: async (data: any) => ({ data: { id: Date.now().toString(), ...data, applied_at: new Date().toISOString() } }),
  updateRegularizationStatus: async (id: string, status: any) => ({ data: { id, status } }),
  
  // Documents
  getDocuments: async (employeeId?: string) => {
    let query = supabase.from('documents').select('*');
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }
    const { data, error } = await query;
    if (error) throw error;
    
    // If no data exists in Supabase, return a mock document so the UI can be tested
    if (!data || data.length === 0) {
      return { 
        data: [{
          id: 'mock-doc-1',
          employee_id: employeeId || 'mock-emp',
          name: 'Signed Offer Letter',
          type: 'Offer Letter',
          url: '#',
          uploaded_at: new Date().toISOString()
        }, {
          id: 'mock-doc-2',
          employee_id: employeeId || 'mock-emp',
          name: 'ID Proof (Passport)',
          type: 'ID Proof',
          url: '#',
          uploaded_at: new Date().toISOString()
        }] 
      };
    }
    
    return { data: data || [] };
  },

  // Expenses (Mocked)
  getExpenses: async () => ({ data: [] }),
  updateExpenseStatus: async (_id: string, _status: any, _comment?: string) => ({ data: {} }),

  // Lookups
  getLookups: async () => {
    const [depts, clients] = await Promise.all([
      supabase.from('departments').select('*'),
      supabase.from('clients').select('*')
    ]);
    return {
      departments: depts.data || [],
      designations: [],
      clients: clients.data || [],
      workplaces: []
    };
  },
  getDepartments: async () => {
    const { data, error } = await supabase.from('departments').select('*');
    if (error) throw error;
    return { data: data || [] };
  },
  getDesignations: async () => ({ data: [] }),
  getClients: async () => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw error;
    return { data: data || [] };
  },
  getWorkplaces: async () => ({ data: [] }),
  
  createDepartment: async (data: any) => {
    const { data: result, error } = await supabase.from('departments').insert([data]).select().single();
    if (error) throw error;
    return { data: result };
  },
  createDesignation: async (data: any) => ({ data }),
  createClient: async (data: any) => {
    const { data: result, error } = await supabase.from('clients').insert([data]).select().single();
    if (error) throw error;
    return { data: result };
  },
  createWorkplace: async (data: any) => ({ data }),
};
