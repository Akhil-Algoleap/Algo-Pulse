import React, { useEffect, useState } from 'react';
import { 
  Folder,
  FileText,
  Download,
  Search,
  UploadCloud,
  Mail,
  Receipt,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Badge, Input } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { Document, Employee } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = ['Onboarding', 'Identity', 'Contracts', 'Policies', 'Other'];

export const Documents: React.FC = () => {
  const { profile } = useAuth();
  const [docs, setDocs] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ name: '', type: 'Onboarding', file: null as File | null });
  const [isUploading, setIsUploading] = useState(false);

  const isAdminOrManager = profile?.role === 'Admin' || profile?.role === 'Manager';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (isAdminOrManager) {
        const empRes = await apiService.getEmployees();
        const allDocs = await Promise.all(
          empRes.data.map((emp: Employee) => apiService.getDocuments(emp.id))
        );
        const flatDocs = allDocs.flatMap(res => res.data);
        setDocs(flatDocs);
      } else {
        if (profile?.id) {
          const res = await apiService.getDocuments(profile.id);
          setDocs(res.data);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) fetchData();
  }, [profile]);

  const handleUpload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!uploadData.name || !uploadData.file) {
      toast.error('Please provide a name and select a file');
      return;
    }
    setIsUploading(true);
    try {
      // Since it's a mock frontend, just show toast
      toast.success(`${uploadData.file.name} uploaded successfully!`);
      setIsUploadModalOpen(false);
      setUploadData({ name: '', type: 'Onboarding', file: null });
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDocsByCategory = (category: string) => {
    return filteredDocs.filter(doc => {
      const typeStr = (doc.type || 'Other').toLowerCase();
      const catStr = category.toLowerCase();
      if (catStr === 'identity' && (typeStr.includes('id') || typeStr.includes('pan') || typeStr.includes('aadhar'))) return true;
      if (catStr === 'contracts' && typeStr.includes('offer')) return true;
      if (catStr === 'onboarding' && typeStr.includes('resume')) return true;
      if (catStr === 'other' && !['resume', 'id proof', 'offer letter'].includes(typeStr)) return true;
      if (typeStr === catStr) return true;
      return false;
    });
  };

  if (!isAdminOrManager) {
    // Employee View (Matches Screenshot 3)
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Document Center</h1>
          <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload Document
          </Button>
        </div>
        
        {/* Banner */}
        <div className="bg-white rounded-xl border border-slate-100 p-8 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="space-y-4 z-10">
            <h2 className="text-xl font-bold text-slate-800">We've got it sorted for you!</h2>
            <div className="space-y-1">
              <p className="text-sm text-slate-600">All Documents are now in one place..</p>
              <p className="text-sm text-slate-600">You can now request a new letter if you don't find the one you were looking for..</p>
            </div>
          </div>
          <div className="relative z-10 hidden md:block opacity-90">
            <div className="w-32 h-32 flex items-center justify-center">
              <div className="w-20 h-28 bg-white rounded shadow-md border border-slate-200 relative overflow-hidden flex flex-col justify-between p-2">
                <div className="space-y-1.5 mt-2">
                  <div className="w-full h-1 bg-slate-200 rounded"></div>
                  <div className="w-3/4 h-1 bg-slate-200 rounded"></div>
                  <div className="w-5/6 h-1 bg-slate-200 rounded"></div>
                </div>
                <div className="w-8 h-8 self-end bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-4">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[14px] font-medium text-slate-700">Documents</span>
              </div>
              <span className="text-[13px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View All</span>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                  <Receipt className="w-4 h-4" />
                </div>
                <span className="text-[14px] font-medium text-slate-700">Payslips</span>
              </div>
              <span className="text-[13px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View All</span>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[14px] font-medium text-slate-700">Form 16</span>
              </div>
              <span className="text-[13px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View All</span>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[14px] font-medium text-slate-700">Company Policies</span>
              </div>
              <span className="text-[13px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View All</span>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[14px] font-medium text-slate-700">Forms</span>
              </div>
              <span className="text-[13px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View All</span>
            </div>

          </div>
        </div>

        {/* Request Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-4">Request</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[14px] font-medium text-slate-700">Letters</span>
                </div>
                <span className="text-[13px] font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View All</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="border-r border-slate-200 pr-4">Pending: <span className="text-slate-700">0</span></span>
                <span>Closed: <span className="text-slate-700">0</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload Document"
        >
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Name</label>
              <Input
                required
                placeholder="e.g., Q3 Performance Review"
                value={uploadData.name}
                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                className="w-full rounded-lg border-slate-200 border p-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                value={uploadData.type}
                onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
              <input
                type="file"
                required
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
                onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || !uploadData.file || !uploadData.name}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Admin View (Existing code layout)
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Center</h1>
          <p className="text-slate-500">Secure repository for all company files</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search files..."
              className="pl-10 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
           <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.map(category => {
            const categoryDocs = getDocsByCategory(category);
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-primary-500 fill-primary-100" />
                  <h2 className="text-lg font-bold text-slate-800">{category}</h2>
                  <Badge variant="outline" className="ml-2 text-xs">{categoryDocs.length}</Badge>
                </div>

                {categoryDocs.length === 0 ? (
                  <div className="p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm font-medium">No files in {category}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryDocs.map(doc => (
                      <div key={doc.id} className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50 transition-all cursor-pointer flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 truncate" title={doc.name}>{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">{doc.type}</p>
                        </div>
                        <div className="pt-3 mt-auto border-t border-slate-50 flex items-center justify-between">
                          <p className="text-[10px] text-slate-400 font-mono">1.2 MB</p>
                          <button className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal is no longer rendered for admin since they can't upload */}
    </div>
  );
};
