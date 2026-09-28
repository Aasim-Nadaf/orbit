import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PaymentInvoice } from '../../types';

interface InvoiceModalProps {
  invoice: PaymentInvoice | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-gray-200 overflow-y-auto max-h-[95vh] print:p-0 print:border-none print:shadow-none">
        {/* Controls - Hidden on print */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">Invoice Receipt</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                invoice.status === 'paid'
                  ? 'bg-emerald-50 text-emerald-700'
                  : invoice.status === 'failed'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              title="Print Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="pt-6 space-y-8">
          {/* Brand & Invoice Meta */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gray-950 flex items-center justify-center text-white text-xs font-bold">
                  ▲
                </div>
                <span className="text-xl font-extrabold text-gray-950 tracking-tight">
                  LeadPilot AI
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                LeadPilot Technologies, Inc.<br />
                548 Market St, Suite 3000<br />
                San Francisco, CA 94104<br />
                billing@leadpilot.ai
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-extrabold text-gray-950 font-mono">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Date: {new Date(invoice.date).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500">
                Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
                Billed To
              </div>
              <div className="font-bold text-gray-900">{invoice.customerName}</div>
              <div className="text-gray-500">{invoice.customerEmail}</div>
            </div>

            <div>
              <div className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider mb-1">
                Payment Method
              </div>
              <div className="font-semibold text-gray-900">{invoice.paymentMethod}</div>
              <div className="text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Charge</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4">
                    <div className="font-bold text-gray-900">{invoice.planName} Plan</div>
                    <div className="text-gray-500 text-[11px]">{invoice.description}</div>
                  </td>
                  <td className="py-4 text-center text-gray-700">1</td>
                  <td className="py-4 text-right font-bold text-gray-900 font-sans">
                    ${invoice.amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="border-t border-gray-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Tax (0%):</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-extrabold text-gray-950">
              <span>Total Paid:</span>
              <span className="font-sans">${invoice.amount.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[11px] text-gray-400 pt-6 border-t border-gray-100">
            Thank you for subscribing to LeadPilot AI. For questions regarding your invoice or renewals, contact support@leadpilot.ai.
          </div>
        </div>
      </div>
    </div>
  );
};
