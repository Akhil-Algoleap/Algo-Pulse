import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  RefreshCw,
  Building2,
  MoreVertical
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

type InvoiceType = 'Incoming' | 'Outgoing' | 'Recurring';
type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';

type Invoice = {
  id: string;
  vendor: string;
  invoiceNumber: string;
  type: InvoiceType;
  amount: number;
  gst: number;
  dueDate: string;
  status: InvoiceStatus;
};

const MOCK_INVOICES: Invoice[] = [
  { id: '1', vendor: 'Acme Corp', invoiceNumber: 'INV-2026-001', type: 'Incoming', amount: 5000, gst: 500, dueDate: '2026-08-01', status: 'Pending' },
  { id: '2', vendor: 'Global Tech', invoiceNumber: 'OUT-2026-042', type: 'Outgoing', amount: 12500, gst: 1250, dueDate: '2026-07-15', status: 'Paid' },
  { id: '3', vendor: 'AWS Cloud', invoiceNumber: 'AWS-2026-07', type: 'Recurring', amount: 3200, gst: 320, dueDate: '2026-07-28', status: 'Pending' },
  { id: '4', vendor: 'Office Supplies Inc', invoiceNumber: 'INV-2026-088', type: 'Incoming', amount: 450, gst: 45, dueDate: '2026-07-10', status: 'Overdue' },
];

export const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | InvoiceType | InvoiceStatus>('All');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ vendor: '', invoiceNumber: '', type: 'Incoming', amount: '', gst: '', dueDate: '' });

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'All') return true;
    if (['Incoming', 'Outgoing', 'Recurring'].includes(activeTab)) return inv.type === activeTab;
    if (['Pending', 'Paid', 'Overdue'].includes(activeTab)) return inv.status === activeTab;
    return true;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'Pending': return <Badge variant="warning" className="bg-amber-100 text-amber-700"><Clock className="w-3 h-3 inline mr-1" />Pending</Badge>;
      case 'Paid': return <Badge variant="success"><CheckCircle2 className="w-3 h-3 inline mr-1" />Paid</Badge>;
      case 'Overdue': return <Badge variant="error" className="bg-rose-100 text-rose-700">Overdue</Badge>;
    }
  };

  const getTypeIcon = (type: InvoiceType) => {
    switch (type) {
      case 'Incoming': return <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ArrowDownRight className="w-5 h-5" /></div>;
      case 'Outgoing': return <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowUpRight className="w-5 h-5" /></div>;
      case 'Recurring': return <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><RefreshCw className="w-5 h-5" /></div>;
    }
  };

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.vendor || !newInvoice.amount || !newInvoice.dueDate) return;
    
    const inv: Invoice = {
      id: Math.random().toString(),
      vendor: newInvoice.vendor,
      invoiceNumber: newInvoice.invoiceNumber || `INV-${Math.floor(Math.random() * 10000)}`,
      type: newInvoice.type as InvoiceType,
      amount: parseFloat(newInvoice.amount),
      gst: parseFloat(newInvoice.gst) || 0,
      dueDate: newInvoice.dueDate,
      status: 'Pending'
    };
    
    setInvoices([inv, ...invoices]);
    setIsAddModalOpen(false);
    setNewInvoice({ vendor: '', invoiceNumber: '', type: 'Incoming', amount: '', gst: '', dueDate: '' });
    toast.success('Invoice added successfully');
  };

  const tabs = ['All', 'Incoming', 'Outgoing', 'Pending', 'Paid', 'Recurring'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Manage incoming, outgoing, and recurring invoices.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Invoice
        </Button>
      </div>

      <Card className="bg-white border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full md:w-auto">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {tab}
                </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Vendor / Client</th>
                <th className="px-6 py-4 font-medium">Invoice Number</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium text-right">Amount (Inc. GST)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-slate-600" />
                        </div>
                        {inv.vendor}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {getTypeIcon(inv.type)}
                        <span className="font-medium text-slate-700">{inv.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{inv.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-slate-900">${(inv.amount + inv.gst).toLocaleString()}</span>
                        <span className="text-xs text-slate-500">GST: ${inv.gst.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(inv.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" title="Download PDF" className="text-slate-400 hover:text-blue-600">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="More Options" className="text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No invoices found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create / Log Invoice">
        <form onSubmit={handleAddInvoice} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                    value={newInvoice.type}
                    onChange={(e) => setNewInvoice({...newInvoice, type: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                >
                    <option value="Incoming">Incoming (Payable)</option>
                    <option value="Outgoing">Outgoing (Receivable)</option>
                    <option value="Recurring">Recurring</option>
                </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number (Optional)</label>
              <input 
                type="text"
                value={newInvoice.invoiceNumber}
                onChange={(e) => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor / Client Name</label>
            <input 
              type="text" required
              value={newInvoice.vendor}
              onChange={(e) => setNewInvoice({...newInvoice, vendor: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base Amount ($)</label>
                <input 
                    type="number" required
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">GST Amount ($)</label>
                <input 
                    type="number" required
                    value={newInvoice.gst}
                    onChange={(e) => setNewInvoice({...newInvoice, gst: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
            <input 
              type="date" required
              value={newInvoice.dueDate}
              onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Invoice</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
