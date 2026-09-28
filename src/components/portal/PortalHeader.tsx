import React from 'react';
import {
  LayoutGrid,
  Users,
  CreditCard,
  Layers,
  RefreshCw,
  Receipt,
  Plus,
  PlayCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export type PortalTab = 'overview' | 'customers' | 'subscriptions' | 'plans' | 'renewals' | 'payments';

interface PortalHeaderProps {
  activeTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
  onNewCustomer: () => void;
  onBatchRenew: () => void;
  onResetData: () => void;
  isSimulating?: boolean;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  activeTab,
  onTabChange,
  onNewCustomer,
  onBatchRenew,
  onResetData,
  isSimulating
}) => {
  const tabs: { id: PortalTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'plans', label: 'Plans & Pricing', icon: Layers },
    { id: 'renewals', label: 'Renewals & Churn', icon: RefreshCw },
    { id: 'payments', label: 'Invoices & Payments', icon: Receipt },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top action row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>LeadPilot AI</span>
            <span>/</span>
            <span className="font-semibold text-gray-900 capitalize">{activeTab}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight flex items-center gap-2">
            <span>Subscription Management Engine</span>
            <span className="text-xs bg-lime-100 text-lime-800 font-semibold px-2 py-0.5 rounded-full">
              Production Light
            </span>
          </h1>
        </div>

        {/* Quick Simulation & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Simulate Batch Renewals Cron */}
          <button
            onClick={onBatchRenew}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors border border-gray-200 disabled:opacity-50"
            title="Simulate daily renewal billing cron for upcoming cycles"
          >
            <PlayCircle className={`w-3.5 h-3.5 text-lime-700 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Simulate Renewals</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors border border-gray-200"
            title="Reset data back to seed state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Add New Customer */}
          <button
            onClick={onNewCustomer}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#558b2f] hover:bg-[#477727] text-white shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto scrollbar-none gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-[#558b2f] text-[#558b2f]'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
