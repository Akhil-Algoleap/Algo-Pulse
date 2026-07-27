import React, { useState } from 'react';
import { 
  Plane, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  X, 
  FileText,
  Calendar,
  DollarSign,
  Globe,
  MapPin,
  Clock,
  Send,
  Building
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

type TravelClaim = {
  id: string;
  employeeName: string;
  type: 'Domestic' | 'International';
  destination: string;
  amount: number;
  date: string;
  purpose: string;
  status: 'Manager Pending' | 'Finance Pending' | 'Rejected' | 'Payment Released';
  attachments: { type: string, name: string }[];
};

// Shared mock data
let globalTravelClaims: TravelClaim[] = [
  { 
    id: '1', 
    employeeName: 'Akhil', 
    type: 'Domestic', 
    destination: 'Mumbai', 
    amount: 450, 
    date: '2026-07-20', 
    purpose: 'Client Onsite Meeting', 
    status: 'Manager Pending',
    attachments: [{ type: 'Flight', name: 'ticket.pdf' }, { type: 'Hotel', name: 'hotel_invoice.pdf' }]
  },
  { 
    id: '2', 
    employeeName: 'Sarah', 
    type: 'International', 
    destination: 'London', 
    amount: 3200, 
    date: '2026-07-15', 
    purpose: 'Annual Conference', 
    status: 'Finance Pending',
    attachments: [{ type: 'Flight', name: 'ba_ticket.pdf' }, { type: 'Hotel', name: 'hilton.pdf' }, { type: 'Meal', name: 'meals.pdf' }]
  },
  { 
    id: '3', 
    employeeName: 'Rahul', 
    type: 'Domestic', 
    destination: 'Delhi', 
    amount: 320, 
    date: '2026-07-10', 
    purpose: 'Sales Pitch', 
    status: 'Payment Released',
    attachments: [{ type: 'Flight', name: 'indigo.pdf' }, { type: 'Taxi', name: 'uber_receipts.pdf' }]
  },
];

export const TravelClaims: React.FC = () => {
  const { profile } = useAuth();
  const [claims, setClaims] = useState<TravelClaim[]>(globalTravelClaims);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Submission
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newClaim, setNewClaim] = useState({ type: 'Domestic', destination: '', amount: '', date: '', purpose: '' });

  // Action Modal
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<TravelClaim | null>(null);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Release' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const isFinance = profile?.role === 'Finance';
  const isManager = profile?.role === 'Project Manager';
  const isEmployee = !isFinance && !isManager;

  // Filter based on role
  const displayClaims = claims.filter(c => {
    const matchesSearch = c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (isFinance) return matchesSearch;
    if (isManager) return matchesSearch; // In real app, filter by reporting team
    return matchesSearch && c.employeeName === (profile?.employeeName || 'Akhil');
  });

  // Calculate KPIs
  const kpis = {
    pending: claims.filter(c => c.status.includes('Pending')).length,
    approved: claims.filter(c => c.status === 'Payment Released').length,
    rejected: claims.filter(c => c.status === 'Rejected').length,
    totalCost: claims.filter(c => c.status === 'Payment Released').reduce((sum, c) => sum + c.amount, 0),
    international: claims.filter(c => c.type === 'International').length,
    domestic: claims.filter(c => c.type === 'Domestic').length,
  };

  const getStatusBadge = (status: TravelClaim['status']) => {
    switch (status) {
      case 'Manager Pending':
        return <Badge variant="warning">Manager Pending</Badge>;
      case 'Finance Pending':
        return <Badge variant="warning" className="bg-orange-100 text-orange-700">Finance Pending</Badge>;
      case 'Payment Released':
        return <Badge variant="success">Payment Released</Badge>;
      case 'Rejected':
        return <Badge variant="error">Rejected</Badge>;
    }
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaim.amount || !newClaim.date || !newClaim.destination) return;
    
    const claim: TravelClaim = {
      id: Math.random().toString(),
      employeeName: profile?.employeeName || 'Akhil',
      type: newClaim.type as 'Domestic' | 'International',
      destination: newClaim.destination,
      amount: parseFloat(newClaim.amount),
      date: newClaim.date,
      purpose: newClaim.purpose,
      status: 'Manager Pending',
      attachments: [{ type: 'Flight', name: 'ticket.pdf' }]
    };
    
    const updated = [claim, ...claims];
    setClaims(updated);
    globalTravelClaims = updated;
    
    setIsSubmitModalOpen(false);
    setNewClaim({ type: 'Domestic', destination: '', amount: '', date: '', purpose: '' });
    toast.success('Travel claim submitted successfully!');
  };

  const openActionModal = (claim: TravelClaim, type: 'Approve' | 'Reject' | 'Release') => {
    setSelectedClaim(claim);
    setActionType(type);
    setActionReason('');
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedClaim || !actionType) return;
    
    const updated = claims.map(c => {
      if (c.id === selectedClaim.id) {
        if (actionType === 'Reject') return { ...c, status: 'Rejected' };
        
        if (actionType === 'Approve') {
          // If Manager approves -> goes to Finance Pending
          if (isManager && c.status === 'Manager Pending') return { ...c, status: 'Finance Pending' };
        }
        
        if (actionType === 'Release') {
          // If Finance releases -> Payment Released
          if (isFinance && c.status === 'Finance Pending') return { ...c, status: 'Payment Released' };
        }
      }
      return c;
    });
    
    setClaims(updated);
    globalTravelClaims = updated;
    
    setIsActionModalOpen(false);
    toast.success(`Claim ${actionType.toLowerCase()}d successfully`);
  };

  const canActionClaim = (claim: TravelClaim) => {
    if (isManager && claim.status === 'Manager Pending') return true;
    if (isFinance && claim.status === 'Finance Pending') return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isFinance ? 'Travel Claims' : isManager ? 'Team Travel Claims' : 'My Travel Claims'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage travel requests, flight tickets, hotel bills, and meal expenses.
          </p>
        </div>
        {(isEmployee || isManager) && (
          <Button onClick={() => setIsSubmitModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Submit Travel Claim
          </Button>
        )}
      </div>

      {(isFinance || isManager) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4 border-none shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Pending</p>
            <p className="text-2xl font-black text-amber-500">{kpis.pending}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Approved</p>
            <p className="text-2xl font-black text-emerald-500">{kpis.approved}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Rejected</p>
            <p className="text-2xl font-black text-rose-500">{kpis.rejected}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Travel Cost</p>
            <p className="text-2xl font-black text-slate-800">${kpis.totalCost}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">International</p>
            <p className="text-2xl font-black text-indigo-500">{kpis.international}</p>
          </Card>
          <Card className="p-4 border-none shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Domestic</p>
            <p className="text-2xl font-black text-blue-500">{kpis.domestic}</p>
          </Card>
        </div>
      )}

      <Card className="bg-white border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search destination or employee..."
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
                <th className="px-6 py-4 font-medium">Destination</th>
                {(isFinance || isManager) && <th className="px-6 py-4 font-medium">Employee</th>}
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {(isFinance || isManager) && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{claim.destination}</span>
                      <span className="text-xs text-slate-500">{new Date(claim.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  {(isFinance || isManager) && (
                    <td className="px-6 py-4 font-medium text-slate-900">{claim.employeeName}</td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {claim.type === 'International' ? <Globe className="w-4 h-4 text-indigo-500" /> : <MapPin className="w-4 h-4 text-blue-500" />}
                      {claim.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    ${claim.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(claim.status)}
                  </td>
                  {(isFinance || isManager) && (
                    <td className="px-6 py-4">
                      {canActionClaim(claim) ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openActionModal(claim, isFinance ? 'Release' : 'Approve')}
                            title={isFinance ? "Release Payment" : "Approve"}
                            className="text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50"
                          >
                            {isFinance ? <Send className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openActionModal(claim, 'Reject')}
                            title="Reject"
                            className="text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-right pr-4 text-slate-400">
                           <Button variant="ghost" size="sm" title="View Details"><FileText className="w-4 h-4" /></Button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              
              {displayClaims.length === 0 && (
                <tr>
                  <td colSpan={(isFinance || isManager) ? 6 : 5} className="px-6 py-12 text-center text-slate-500">
                    <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900 mb-1">No travel claims found</p>
                    <p>Try adjusting your search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Submit Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Travel Claim"
      >
        <form onSubmit={handleSubmitClaim} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Travel Type</label>
              <select 
                value={newClaim.type}
                onChange={(e) => setNewClaim({...newClaim, type: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              >
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <input 
                type="text" required
                value={newClaim.destination}
                onChange={(e) => setNewClaim({...newClaim, destination: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="e.g. New York"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount ($)</label>
              <div className="relative">
                <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="number" step="0.01" required
                  value={newClaim.amount}
                  onChange={(e) => setNewClaim({...newClaim, amount: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Travel Date</label>
              <input 
                type="date" required
                value={newClaim.date}
                onChange={(e) => setNewClaim({...newClaim, date: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Purpose</label>
            <textarea 
              required
              value={newClaim.purpose}
              onChange={(e) => setNewClaim({...newClaim, purpose: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-2 bg-slate-50 cursor-pointer hover:bg-slate-100">
                 <input type="checkbox" className="rounded text-primary-600" />
                 <Plane className="w-4 h-4 text-slate-500" />
                 <span className="text-sm font-medium">Flights</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-2 bg-slate-50 cursor-pointer hover:bg-slate-100">
                 <input type="checkbox" className="rounded text-primary-600" />
                 <Building className="w-4 h-4 text-slate-500" />
                 <span className="text-sm font-medium">Hotel</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-2 bg-slate-50 cursor-pointer hover:bg-slate-100">
                 <input type="checkbox" className="rounded text-primary-600" />
                 <Clock className="w-4 h-4 text-slate-500" />
                 <span className="text-sm font-medium">Taxi</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 flex items-center gap-2 bg-slate-50 cursor-pointer hover:bg-slate-100">
                 <input type="checkbox" className="rounded text-primary-600" />
                 <FileText className="w-4 h-4 text-slate-500" />
                 <span className="text-sm font-medium">Meals</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Claim</Button>
          </div>
        </form>
      </Modal>

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`${actionType === 'Release' ? 'Release Payment' : actionType} Travel Claim`}
      >
        {selectedClaim && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-slate-900">{selectedClaim.employeeName}</p>
                  <p className="text-sm text-slate-500">{selectedClaim.destination} ({selectedClaim.type})</p>
                </div>
                <p className="text-2xl font-black text-slate-900">${selectedClaim.amount.toFixed(2)}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedClaim.attachments.map((att, i) => (
                  <Badge key={i} variant="default" className="bg-white">
                    <FileText className="w-3 h-3 mr-1 inline" /> {att.type}
                  </Badge>
                ))}
              </div>
            </div>

            {actionType === 'Reject' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for rejection</label>
                <textarea 
                  required
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  rows={3}
                />
              </div>
            )}

            {actionType === 'Approve' && (
              <p className="text-slate-600">Approving this will forward the claim to Finance for payment processing.</p>
            )}

            {actionType === 'Release' && (
              <p className="text-slate-600">Releasing payment will mark this claim as closed and funds will be transferred to the employee.</p>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 mt-6">
              <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                className={actionType === 'Reject' ? 'bg-rose-600 hover:bg-rose-700' : ''}
                onClick={handleConfirmAction}
              >
                Confirm {actionType}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
