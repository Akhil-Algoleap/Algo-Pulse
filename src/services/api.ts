import axios from 'axios';
import { 
  type Employee, 
  type Department, 
  type Designation, 
  type Client, 
  type Workplace,
  type Asset,
  type AssetHistory,
  type LeaveRequest,
  type Attendance,
  type PerformanceRecord,
  type Document,
  type ExpenseClaim
} from '../types';

const API_BASE = '/api';

// Initial Mock Data (for lookups that are still static or hardcoded)
const MOCK_DEPARTMENTS: Department[] = [
  { id: '1', department_name: 'Engineering' },
  { id: '2', department_name: 'Product' },
  { id: '3', department_name: 'Design' },
  { id: '4', department_name: 'HR' },
];

const MOCK_DESIGNATIONS: Designation[] = [
  { id: '1', designation_name: 'Software Engineer' },
  { id: '2', designation_name: 'Senior Software Engineer' },
  { id: '3', designation_name: 'Product Manager' },
  { id: '4', designation_name: 'UX Designer' },
];

const MOCK_CLIENTS: Client[] = [
  { id: '1', client_name: 'Google' },
  { id: '2', client_name: 'Microsoft' },
  { id: '3', client_name: 'Meta' },
];

const MOCK_WORKPLACES: Workplace[] = [
  { id: '1', workplace_name: 'New York Office' },
  { id: '2', workplace_name: 'London Office' },
  { id: '3', workplace_name: 'Remote' },
];

export const apiService = {
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
    // For simplicity, we'll just loop or handle it in backend
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
  getAssetHistory: async (assetId: string) => ({
    data: [] // Simplified for now
  }),
  assignAsset: async (assetId: string, employeeId: string) => {
    const res = await axios.post(`${API_BASE}/assets/assign`, { assetId, employeeId });
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
      status: 'Present'
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

  // Leaves (Simplified to local/mock for now as per plan focus on Employees/Assets)
  getLeaves: async () => ({ data: [] }),
  applyLeave: async (data: any) => ({ data }),
  
  // Documents
  getDocuments: async (employeeId?: string) => {
    try {
      const url = employeeId ? `${API_BASE}/documents/${employeeId}` : `${API_BASE}/documents`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error('getDocuments error:', err);
      throw err;
    }
  },
  updateLeaveStatus: async (id: string, status: any) => ({ data: {} }),

  // Lookups
  getDepartments: async () => ({ data: MOCK_DEPARTMENTS }),
  getDesignations: async () => ({ data: MOCK_DESIGNATIONS }),
  getClients: async () => ({ data: MOCK_CLIENTS }),
  getWorkplaces: async () => ({ data: MOCK_WORKPLACES }),
};
