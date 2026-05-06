import axios from 'axios';
import { 
  type Department, 
  type Designation, 
  type Client, 
  type Workplace,
  type Attendance,
  type PerformanceRecord,
} from '../types';

const API_BASE = '/api';

export interface ApiService {
  getEmployees: () => Promise<any>;
  createEmployee: (data: any) => Promise<any>;
  bulkCreateEmployees: (data: any[]) => Promise<any>;
  updateEmployee: (id: string, data: any) => Promise<any>;
  deleteEmployee: (id: string) => Promise<any>;
  getAssets: () => Promise<any>;
  getAssetHistory: (assetId: string) => Promise<any>;
  assignAsset: (assetId: string, employeeId: string) => Promise<any>;
  updateAsset: (id: string, data: any) => Promise<any>;
  getAttendance: (employeeId?: string) => Promise<any>;
  clockIn: (employeeId: string) => Promise<any>;
  getPerformance: (employeeId?: string) => Promise<any>;
  getLeaves: () => Promise<any>;
  applyLeave: (data: any) => Promise<any>;
  getDocuments: (employeeId?: string) => Promise<any>;
  updateLeaveStatus: (id: string, status: any) => Promise<any>;
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
    try {
      const res = await axios.get(`${API_BASE}/employees`);
      return res.data;
    } catch (err) {
      console.error('getEmployees error:', err);
      throw err;
    }
  },
  createEmployee: async (data: any) => {
    try {
      const res = await axios.post(`${API_BASE}/employees`, data);
      return res.data;
    } catch (err) {
      console.error('createEmployee error:', err);
      throw err;
    }
  },
  bulkCreateEmployees: async (data: any[]) => {
    const results = [];
    for (const item of data) {
      const res = await axios.post(`${API_BASE}/employees`, item);
      results.push(res.data.data);
    }
    return { data: results };
  },
  updateEmployee: async (id: string, data: any) => {
    try {
      const res = await axios.put(`${API_BASE}/employees/${id}`, data);
      return res.data;
    } catch (err) {
      console.error('updateEmployee error:', err);
      throw err;
    }
  },
  deleteEmployee: async (id: string) => {
    try {
      const res = await axios.delete(`${API_BASE}/employees/${id}`);
      return res.data;
    } catch (err) {
      console.error('deleteEmployee error:', err);
      throw err;
    }
  },

  // Assets
  getAssets: async () => {
    const res = await axios.get(`${API_BASE}/assets`);
    return res.data;
  },
  getAssetHistory: async (_assetId: string) => ({
    data: [] 
  }),
  assignAsset: async (assetId: string, employeeId: string) => {
    const res = await axios.post(`${API_BASE}/assets`, { assetId, employeeId });
    return res.data;
  },
  updateAsset: async (id: string, data: any) => {
    const res = await axios.put(`${API_BASE}/assets/${id}`, data);
    return res.data;
  },

  // Attendance
  getAttendance: async (employeeId?: string) => {
    const res = await axios.get(`${API_BASE}/attendance`);
    const list = res.data.data as Attendance[];
    return { data: employeeId ? list.filter(a => a.employee_id === employeeId) : list };
  },
  clockIn: async (employeeId: string) => {
    const res = await axios.post(`${API_BASE}/attendance`, {
      employee_id: employeeId,
      date: new Date().toISOString().split('T')[0],
      clock_in: new Date().toISOString(),
      status: 'present'
    });
    return res.data;
  },

  // Performance
  getPerformance: async (employeeId?: string) => {
    try {
      const res = await axios.get(`${API_BASE}/performance`);
      const list = res.data.data as PerformanceRecord[];
      return { data: employeeId ? list.filter(r => r.employee_id === employeeId) : list };
    } catch (err) {
      console.error('getPerformance error:', err);
      throw err;
    }
  },

  // Leaves
  getLeaves: async () => ({ data: [] }),
  applyLeave: async (data: any) => ({ data }),
  
  // Documents
  getDocuments: async (employeeId?: string) => {
    try {
      const url = employeeId ? `${API_BASE}/documents?employeeId=${employeeId}` : `${API_BASE}/documents`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error('getDocuments error:', err);
      throw err;
    }
  },
  updateLeaveStatus: async (_id: string, _status: any) => ({ data: {} }),

  // Expenses
  getExpenses: async () => ({ data: [] }),
  updateExpenseStatus: async (_id: string, _status: any, _comment?: string) => ({ data: {} }),

  // Lookups
  getLookups: async () => {
    const [depts, desigs, clients, works] = await Promise.all([
      axios.get(`${API_BASE}/lookups?type=departments`),
      axios.get(`${API_BASE}/lookups?type=designations`),
      axios.get(`${API_BASE}/lookups?type=clients`),
      axios.get(`${API_BASE}/lookups?type=workplaces`)
    ]);
    return {
      departments: depts.data.data as Department[],
      designations: desigs.data.data as Designation[],
      clients: clients.data.data as Client[],
      workplaces: works.data.data as Workplace[]
    };
  },
  getDepartments: async () => axios.get(`${API_BASE}/lookups?type=departments`).then(r => r.data),
  getDesignations: async () => axios.get(`${API_BASE}/lookups?type=designations`).then(r => r.data),
  getClients: async () => axios.get(`${API_BASE}/lookups?type=clients`).then(r => r.data),
  getWorkplaces: async () => axios.get(`${API_BASE}/lookups?type=workplaces`).then(r => r.data),
  
  createDepartment: async (data: any) => axios.post(`${API_BASE}/lookups?type=departments`, data),
  createDesignation: async (data: any) => axios.post(`${API_BASE}/lookups?type=designations`, data),
  createClient: async (data: any) => axios.post(`${API_BASE}/lookups?type=clients`, data),
  createWorkplace: async (data: any) => axios.post(`${API_BASE}/lookups?type=workplaces`, data),
};
