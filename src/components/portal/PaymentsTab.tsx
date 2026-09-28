import React, { useState } from 'react';
import {
  Search,
  Receipt,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Download,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { PaymentInvoice } from '../../types';

interface PaymentsTabProps {
  invoices: PaymentInvoice[];
  onRetryPayment: (invoiceId: string) => void;
  onRefundPayment: (invoiceId: string) => void;
  onSelectInvoice: (invoice: PaymentInvoice) => void;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({
  invoices,
  onRetryPayment,
  onRefundPayment,
  onSelectInvoice
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [actingId, setActingId] = useState<string | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerEmail.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalCollected = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const failedAmount = invoices
    .filter(i => i.status === 'failed')
    .reduce((sum, i) => sum + i.amount, 0);

  const handleRetry = async (id: string) => {
    setActingId(id);
    await onRetryPayment(id);
    setActingId(null);
  };

  const handleRefund = async (id: string) => {
    if (!confirm('Are you sure you want to issue a refund for this transaction?')) return;
    setActingId(id);
    await onRefundPayment(id);
    setActingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-gray-700">Total Billed & Collected</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-gray-950 mt-1">
            ${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">✓ Processed successfully</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-gray-700">Failed / Uncollected Dunning</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 mt-1">
            ${failedAmount.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Automatic retry scheduled</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-gray-700">Total Invoices Generated</span>
            <Receipt className="w-4 h-4 text-lime-600" />
          </div>
          <div className="text-3xl font-extrabold text-gray-950 mt-1">
            {invoices.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">Across all subscription tiers</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-lime-600 focus:bg-white"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto w-full sm:w-auto">
          {['all', 'paid', 'pending', 'failed', 'refunded'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-white text-gray-900 shadow-xs font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((inv) => {
                const isActing = actingId === inv.id;
                return (
                  <tr key={inv.id} className="hover:bg-lime-50/40 transition-colors">
                    {/* Invoice # */}
                    <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">
                      {inv.invoiceNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{inv.customerName}</div>
                      <div className="text-[11px] text-gray-400">{inv.customerEmail}</div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate" title={inv.description}>
                      {inv.description}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-gray-900 font-sans">
                      ${inv.amount.toFixed(2)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                        <span>{inv.paymentMethod}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : inv.status === 'failed'
                            ? 'bg-rose-50 text-rose-700'
                            : inv.status === 'refunded'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500'
                              : inv.status === 'failed'
                              ? 'bg-rose-500'
                              : inv.status === 'refunded'
                              ? 'bg-gray-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="capitalize">{inv.status}</span>
                      </span>
                      {inv.failureReason && (
                        <div className="text-[10px] text-rose-600 mt-0.5 max-w-xs truncate" title={inv.failureReason}>
                          {inv.failureReason}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Retry button if failed */}
                        {inv.status === 'failed' && (
                          <button
                            onClick={() => handleRetry(inv.id)}
                            disabled={isActing}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] rounded-lg flex items-center gap-1"
                            title="Retry card payment now"
                          >
                            <RefreshCw className={`w-3 h-3 ${isActing ? 'animate-spin' : ''}`} />
                            <span>Retry</span>
                          </button>
                        )}

                        {/* Refund button if paid */}
                        {inv.status === 'paid' && (
                          <button
                            onClick={() => handleRefund(inv.id)}
                            disabled={isActing}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] rounded-lg"
                            title="Issue partial or full refund"
                          >
                            Refund
                          </button>
                        )}

                        {/* View Receipt */}
                        <button
                          onClick={() => onSelectInvoice(inv)}
                          className="px-2.5 py-1 bg-gray-950 hover:bg-gray-800 text-white font-semibold text-[11px] rounded-lg flex items-center gap-1 shadow-xs"
                          title="View printable PDF receipt"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Receipt</span>
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
    </div>
  );
};
