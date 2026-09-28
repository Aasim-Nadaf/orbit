import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, HeartHandshake, Pause, Clock } from 'lucide-react';
import { Subscription } from '../../types';

interface CancelModalProps {
  subscription: Subscription | null;
  onClose: () => void;
  onConfirmCancel: (options: {
    cancelImmediately: boolean;
    reason: string;
    feedback: string;
    applyRetentionDiscount?: boolean;
  }) => void;
  onPause: (months: number) => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  subscription,
  onClose,
  onConfirmCancel,
  onPause
}) => {
  if (!subscription) return null;

  const [reason, setReason] = useState('Too expensive');
  const [feedback, setFeedback] = useState('');
  const [cancelImmediately, setCancelImmediately] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Too expensive',
    'Missing key features',
    'Switched to another platform',
    'Not using it enough',
    'Project or campaign finished',
    'Other reason'
  ];

  const handleApplyDiscount = () => {
    onConfirmCancel({
      cancelImmediately: false,
      reason: 'Retention Discount Claimed',
      feedback: 'Customer accepted 20% discount offer to stay.',
      applyRetentionDiscount: true
    });
    onClose();
  };

  const handlePauseOption = () => {
    onPause(1);
    onClose();
  };

  const handleFinalCancel = () => {
    setIsSubmitting(true);
    onConfirmCancel({
      cancelImmediately,
      reason,
      feedback
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Subscription Cancellation</span>
            </div>
            <h3 className="text-xl font-extrabold text-gray-950">
              Manage Subscription for {subscription.customerName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Retention Special Offer Box */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            <span>Special Retention Incentive</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            We value your business! Stay on the <strong>{subscription.planName}</strong> plan today and receive{' '}
            <strong>20% off</strong> for your next 3 billing cycles.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleApplyDiscount}
              className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Claim 20% Discount
            </button>
            <button
              onClick={handlePauseOption}
              className="py-2 px-3 bg-white hover:bg-gray-100 text-gray-700 border border-amber-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Pause className="w-3 h-3" />
              <span>Pause for 1 Mo</span>
            </button>
          </div>
        </div>

        {/* Cancellation Survey */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Why would you like to cancel?
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-rose-600 bg-white"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1">
              Feedback / Suggestions (Optional)
            </label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What could we have improved?"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-rose-600"
            />
          </div>

          {/* Cancellation Timing Options */}
          <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
            <div className="font-bold text-gray-900 mb-1">Cancellation Timing</div>
            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="cancelTiming"
                checked={!cancelImmediately}
                onChange={() => setCancelImmediately(false)}
                className="mt-0.5 text-rose-600"
              />
              <div>
                <div className="font-bold text-gray-900">Cancel at end of current period (Recommended)</div>
                <div className="text-[11px] text-gray-500">
                  Retains access to leads and sequences until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="cancelTiming"
                checked={cancelImmediately}
                onChange={() => setCancelImmediately(true)}
                className="mt-0.5 text-rose-600"
              />
              <div>
                <div className="font-bold text-gray-900">Cancel immediately</div>
                <div className="text-[11px] text-gray-500">
                  Revokes access right away and changes status to churned.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full"
          >
            Keep Subscription
          </button>
          <button
            type="button"
            onClick={handleFinalCancel}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors shadow-xs"
          >
            {isSubmitting ? 'Canceling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </div>
    </div>
  );
};
