import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  CreditCard,
  Mail,
  Phone,
  Building,
  Globe,
  DollarSign,
  Calendar,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Customer, Subscription, PaymentInvoice, Plan } from '../../types';

interface CustomersTabProps {
  customers: Customer[];
  subscriptions: Subscription[];
  invoices: PaymentInvoice[];
  plans: Plan[];
  onAddCustomer: () => void;
  onDeleteCustomer: (id: string) => void;
  onSelectInvoice: (invoice: PaymentInvoice) => void;
  onOpenUpgradeModal: (sub: Subscription) => void;
  onOpenCancelModal: (sub: Subscription) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  customers,
  subscriptions,
  invoices,
  plans,
  onAddCustomer,
  onDeleteCustomer,
  onSelectInvoice,
  onOpenUpgradeModal,
  onOpenCancelModal
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Filtered list
  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerSub = subscriptions.find(s => s.customerId === selectedCustomerId);
  const customerInvoices = invoices.filter(i => i.customerId === selectedCustomerId);

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-lime-600 focus:bg-white transition-all"
            />
          </div>

          {/* Status filter pills */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-medium">
            {['all', 'active', 'trial', 'past_due', 'churned'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === status
                    ? 'bg-white text-gray-900 font-bold shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onAddCustomer}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#558b2f] hover:bg-[#467525] text-white shadow-xs transition-transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Company & Location</th>
                <th className="py-3.5 px-4">Current Plan</th>
                <th className="py-3.5 px-4">Acquisition</th>
                <th className="py-3.5 px-4">MRR</th>
                <th className="py-3.5 px-4">Lifetime Value</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((cust) => {
                const plan = plans.find(p => p.id === cust.currentPlanId);
                return (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className="hover:bg-lime-50/40 cursor-pointer transition-colors"
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{cust.name}</div>
                          <div className="text-[11px] text-gray-400">{cust.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800">{cust.company}</div>
                      <div className="text-[11px] text-gray-400">{cust.country}</div>
                    </td>

                    {/* Current Plan */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                        {plan?.name || cust.currentPlanId}
                      </span>
                    </td>

                    {/* Lead Source */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-gray-600">
                        {cust.leadSource}
                      </span>
                    </td>

                    {/* MRR */}
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ${cust.mrr}/mo
                    </td>

                    {/* LTV */}
                    <td className="py-3.5 px-4 font-semibold text-gray-700">
                      ${cust.lifetimeValue.toLocaleString()}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        <span>{cust.paymentMethod.brand} •••• {cust.paymentMethod.last4}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          cust.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : cust.status === 'trial'
                            ? 'bg-blue-50 text-blue-700'
                            : cust.status === 'past_due'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cust.status === 'active'
                              ? 'bg-emerald-500'
                              : cust.status === 'trial'
                              ? 'bg-blue-500'
                              : cust.status === 'past_due'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span className="capitalize">{cust.status.replace('_', ' ')}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomerId(cust.id)}
                          className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-100"
                          title="View 360° Profile"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteCustomer(cust.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50"
                          title="Delete customer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360° Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto flex flex-col animate-slide-left border-l border-gray-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-lime-500/20"
                />
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <div className="text-xs text-gray-500">{selectedCustomer.company} • {selectedCustomer.country}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Financial Snapshot */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-[11px] text-gray-500 uppercase font-semibold">Monthly MRR</div>
                  <div className="text-2xl font-extrabold text-gray-900 mt-1">${selectedCustomer.mrr}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-[11px] text-gray-500 uppercase font-semibold">Lifetime Value</div>
                  <div className="text-2xl font-extrabold text-gray-900 mt-1">${selectedCustomer.lifetimeValue.toLocaleString()}</div>
                </div>
              </div>

              {/* Active Subscription Details */}
              {customerSub ? (
                <div className="p-4 rounded-xl border border-lime-200 bg-lime-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
                      <Sparkles className="w-4 h-4 text-lime-600" />
                      <span>{customerSub.planName} Plan</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full capitalize">
                      {customerSub.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Billing Cycle:</span>
                      <span className="font-semibold text-gray-900 capitalize">{customerSub.billingCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="font-semibold text-gray-900">${customerSub.amount} / {customerSub.billingCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Renewal Date:</span>
                      <span className="font-semibold text-gray-900">{new Date(customerSub.nextRenewalDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-lime-200">
                    <button
                      onClick={() => onOpenUpgradeModal(customerSub)}
                      className="flex-1 bg-[#558b2f] hover:bg-[#467525] text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-xs"
                    >
                      Change / Upgrade Plan
                    </button>
                    <button
                      onClick={() => onOpenCancelModal(customerSub)}
                      className="px-3 py-2 bg-white hover:bg-gray-100 text-rose-600 border border-rose-200 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Cancel Sub
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-gray-200 text-center text-xs text-gray-500">
                  No active subscription attached.
                </div>
              )}

              {/* Payment Method on file */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
                <div className="text-xs font-bold text-gray-900 flex items-center justify-between">
                  <span>Payment Method on File</span>
                  <ShieldCheck className="w-4 h-4 text-lime-600" />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-700 pt-1">
                  <div className="w-8 h-6 bg-gray-950 text-white rounded flex items-center justify-center font-bold text-[10px]">
                    {selectedCustomer.paymentMethod.brand}
                  </div>
                  <div>
                    <div className="font-semibold">{selectedCustomer.paymentMethod.brand} ending in {selectedCustomer.paymentMethod.last4}</div>
                    <div className="text-[11px] text-gray-400">Expires {selectedCustomer.paymentMethod.expMonth}/{selectedCustomer.paymentMethod.expYear}</div>
                  </div>
                </div>
              </div>

              {/* Invoices History */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-900 flex items-center justify-between">
                  <span>Customer Invoices ({customerInvoices.length})</span>
                </div>
                <div className="space-y-2">
                  {customerInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => onSelectInvoice(inv)}
                      className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-gray-50/50 flex items-center justify-between text-xs cursor-pointer hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-gray-400">{new Date(inv.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">${inv.amount.toFixed(2)}</div>
                        <span className="text-[10px] font-bold text-emerald-700 capitalize">{inv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
