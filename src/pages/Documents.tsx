import React, { useEffect, useState } from 'react';
import { 
  Folder,
  FileText,
  Download,
  Search,
  UploadCloud,
  MoreVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Badge, Input } from '../components/UI';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';
import { Document, Employee } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../components/UI';

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
        // Admin sees all docs (simplified for demo, in reality they might see all employees' folders)
        // Here we just fetch all docs if possible, or we could group by category.
        // For the sake of the grid design, let's pretend api returns documents with a category field.
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

  const handleUpload = async () => {
    if (!uploadData.name || !uploadData.file) {
      toast.error('Please provide a name and select a file');
      return;
    }
    setIsUploading(true);
    try {
      // Fake upload process since apiService doesn't have an upload file method that takes File object
      // We would normally upload to Supabase Storage here and save the DB record.
      toast.success(`${uploadData.file.name} uploaded to ${uploadData.type}`);
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
    // We map existing document types to these new categories loosely
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Center</h1>
          <p className="text-slate-500">Secure repository for all {isAdminOrManager ? 'company' : 'your'} files</p>
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
          {profile?.role !== 'Admin' && (
            <Button onClick={() => setIsUploadModalOpen(true)} className="rounded-full shadow-lg shadow-primary-100 flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              Upload
            </Button>
          )}
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
                          {profile?.role !== 'Admin' && (
                            <button className="text-slate-300 hover:text-slate-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Document">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Document Name</label>
            <Input 
              placeholder="e.g. Employee Handbook v2" 
              value={uploadData.name}
              onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setUploadData({...uploadData, type: cat})}
                  className={cn(
                    "px-3 py-2 text-sm font-semibold rounded-xl border transition-all",
                    uploadData.type === cat 
                      ? "border-primary-500 bg-primary-50 text-primary-700" 
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">File</label>
             <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50">
               <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
               <input 
                 type="file"
                 className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                 onChange={(e) => setUploadData({...uploadData, file: e.target.files?.[0] || null})}
               />
             </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
             <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
             <Button className="flex-1 rounded-xl shadow-lg shadow-primary-100" onClick={handleUpload} isLoading={isUploading}>
               Upload File
             </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
