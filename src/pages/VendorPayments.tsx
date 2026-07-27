import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Check, 
  Calendar,
  CreditCard,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

type VendorPayment = {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: 'Pending Approval' | 'Scheduled' | 'Paid';
};

const INITIAL_PAYMENTS: VendorPayment[] = [
  { id: '1', vendorName: 'AWS Services', invoiceNumber: 'INV-2026-089', amount: 4500.50, dueDate: '2026-08-01', status: 'Pending Approval' },
  { id: '2', vendorName: 'WeWork', invoiceNumber: 'INV-WW-442', amount: 12000.00, dueDate: '2026-07-28', status: 'Scheduled' },
  { id: '3', vendorName: 'Slack Technologies', invoiceNumber: 'SLK-8812', amount: 850.00, dueDate: '2026-07-15', status: 'Paid' },
  { id: '4', vendorName: 'Google Workspace', invoiceNumber: 'GWS-0092', amount: 1200.00, dueDate: '2026-08-05', status: 'Pending Approval' },
];

export const VendorPayments: React.FC = () => {
  const [payments, setPayments] = useState<VendorPayment[]>(INITIAL_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<VendorPayment | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Schedule' | 'Mark Paid' | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');

  const filteredPayments = payments.filter(p => 
    p.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: VendorPayment['status']) => {
    switch (status) {
      case 'Pending Approval':
        return <Badge variant="warning" className="bg-orange-100 text-orange-700 border-orange-200"><AlertCircle className="w-3 h-3 mr-1 inline" /> Pending Approval</Badge>;
      case 'Scheduled':
        return <Badge variant="default" className="bg-blue-100 text-blue-700"><Clock className="w-3 h-3 mr-1 inline" /> Scheduled</Badge>;
      case 'Paid':
        return <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1 inline" /> Paid</Badge>;
    }
  };

  const openActionModal = (payment: VendorPayment, type: 'Approve' | 'Schedule' | 'Mark Paid') => {
    setSelectedPayment(payment);
    setActionType(type);
    setScheduleDate(payment.dueDate);
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedPayment || !actionType) return;
    
    const updated = payments.map(p => {
      if (p.id === selectedPayment.id) {
        if (actionType === 'Approve') return { ...p, status: 'Pending Approval' }; // Or proceed to next
        if (actionType === 'Schedule') return { ...p, status: 'Scheduled', dueDate: scheduleDate };
        if (actionType === 'Mark Paid') return { ...p, status: 'Paid' };
      }
      return p;
    });
    
    // Auto transition logic for Approval -> Schedule
    if (actionType === 'Approve') {
        const idx = updated.findIndex(u => u.id === selectedPayment.id);
        if (idx !== -1) updated[idx].status = 'Scheduled'; // Approving schedules it immediately for demo
    }

    setPayments(updated as VendorPayment[]);
    setIsActionModalOpen(false);
    toast.success(`Payment ${actionType.toLowerCase()}d successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendor Payments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, schedule, and approve payments for company vendors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-none shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Outstanding</p>
                <p className="text-2xl font-black text-rose-500">$5,700.50</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-full"><AlertCircle className="w-6 h-6 text-rose-500" /></div>
        </Card>
        <Card className="p-4 border-none shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Scheduled Payments</p>
                <p className="text-2xl font-black text-blue-500">$12,000.00</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full"><Clock className="w-6 h-6 text-blue-500" /></div>
        </Card>
        <Card className="p-4 border-none shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Paid This Month</p>
                <p className="text-2xl font-black text-emerald-500">$850.00</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-full"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
        </Card>
      </div>

      <Card className="bg-white border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search vendor or invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Vendor</th>
                <th className="px-6 py-4 font-medium">Invoice Number</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-slate-600" />
                      </div>
                      {payment.vendorName}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{payment.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    {new Date(payment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" title="Download Invoice" className="text-slate-400 hover:text-blue-600">
                        <Download className="w-4 h-4" />
                      </Button>
                      
                      {payment.status === 'Pending Approval' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openActionModal(payment, 'Approve')}
                          title="Approve Payment"
                          className="text-slate-400 hover:text-emerald-600 bg-emerald-50"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}

                      {payment.status === 'Pending Approval' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openActionModal(payment, 'Schedule')}
                          title="Schedule Payment"
                          className="text-slate-400 hover:text-indigo-600 bg-indigo-50"
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      )}

                      {payment.status === 'Scheduled' && (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => openActionModal(payment, 'Mark Paid')}
                          className="gap-2 text-xs"
                        >
                          <CreditCard className="w-3 h-3" /> Mark Paid
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No vendor payments found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`${actionType} Payment`}
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{selectedPayment.vendorName}</p>
                <p className="text-sm text-slate-500 font-mono">{selectedPayment.invoiceNumber}</p>
              </div>
              <p className="text-xl font-black text-slate-900">${selectedPayment.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>

            {actionType === 'Schedule' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Schedule Date</label>
                <input 
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            )}

            {actionType === 'Approve' && (
              <p className="text-slate-600">Approving this invoice will schedule it for payment on {new Date(selectedPayment.dueDate).toLocaleDateString()}.</p>
            )}

            {actionType === 'Mark Paid' && (
              <p className="text-slate-600">This will mark the payment as completed and close the invoice.</p>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 mt-6">
              <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmAction}>Confirm {actionType}</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
