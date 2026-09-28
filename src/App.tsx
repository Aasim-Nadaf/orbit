import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { SocialProof } from './components/SocialProof';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { FooterSection } from './components/FooterSection';
import { PortalHeader, PortalTab } from './components/portal/PortalHeader';
import { OverviewTab } from './components/portal/OverviewTab';
import { CustomersTab } from './components/portal/CustomersTab';
import { SubscriptionsTab } from './components/portal/SubscriptionsTab';
import { PlansTab } from './components/portal/PlansTab';
import { RenewalsTab } from './components/portal/RenewalsTab';
import { PaymentsTab } from './components/portal/PaymentsTab';
import { UpgradeModal } from './components/modals/UpgradeModal';
import { CancelModal } from './components/modals/CancelModal';
import { NewCustomerModal } from './components/modals/NewCustomerModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { DemoVideoModal } from './components/modals/DemoVideoModal';
import { api } from './api/client';
import {
  Customer,
  Subscription,
  Plan,
  PaymentInvoice,
  RenewalItem,
  AnalyticsSummary,
  BillingCycle
} from './types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PLANS,
  INITIAL_INVOICES,
  INITIAL_ANALYTICS
} from './data/mockData';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function App() {
  const [view, setView] = useState<'landing' | 'portal'>('landing');
  const [portalTab, setPortalTab] = useState<PortalTab>('overview');

  // Core data states
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(INITIAL_ANALYTICS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [invoices, setInvoices] = useState<PaymentInvoice[]>(INITIAL_INVOICES);
  const [renewals, setRenewals] = useState<RenewalItem[]>([]);

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentInvoice | null>(null);
  const [upgradeSub, setUpgradeSub] = useState<Subscription | null>(null);
  const [cancelSub, setCancelSub] = useState<Subscription | null>(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Status & feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'success' | 'info' | 'error' } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Show Toast
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Initial data load
  const loadData = async () => {
    try {
      const [anData, custList, subList, planList, renList, invList] = await Promise.all([
        api.getAnalytics(),
        api.getCustomers(),
        api.getSubscriptions(),
        api.getPlans(),
        api.getRenewals(),
        api.getPayments(),
      ]);

      setAnalytics(anData);
      setCustomers(custList);
      setSubscriptions(subList);
      setPlans(planList);
      setRenewals(renList);
      setInvoices(invList);
    } catch (e) {
      console.error('Failed to load initial data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Plan Upgrades
  const handleConfirmUpgrade = async (subId: string, newPlanId: string, cycle: BillingCycle) => {
    try {
      const res = await api.upgradeSubscription(subId, newPlanId, cycle);
      await loadData();
      showToast(
        `Plan upgraded to ${res.subscription.planName}! Net charge of $${res.proration.netDue.toFixed(2)} invoiced.`,
        'success'
      );
    } catch (e: any) {
      showToast(e.message || 'Upgrade failed', 'error');
    }
  };

  // Handlers for Cancellations
  const handleConfirmCancel = async (options: {
    cancelImmediately: boolean;
    reason: string;
    feedback: string;
    applyRetentionDiscount?: boolean;
  }) => {
    if (!cancelSub) return;
    try {
      const res = await api.cancelSubscription(cancelSub.id, options);
      await loadData();
      if (res.retained) {
        showToast(res.message || 'Retention discount applied! Subscription remains active.', 'success');
      } else {
        showToast('Subscription status updated.', 'info');
      }
    } catch (e: any) {
      showToast(e.message || 'Cancellation failed', 'error');
    }
  };

  // Pause subscription
  const handlePauseSubscription = async (id: string, months: number = 1) => {
    try {
      await api.pauseSubscription(id, months);
      await loadData();
      showToast(`Subscription paused for ${months} month(s).`, 'info');
    } catch (e: any) {
      showToast(e.message || 'Pause failed', 'error');
    }
  };

  // Resume subscription
  const handleResumeSubscription = async (id: string) => {
    try {
      await api.resumeSubscription(id);
      await loadData();
      showToast('Subscription resumed and reactivated.', 'success');
    } catch (e: any) {
      showToast(e.message || 'Resume failed', 'error');
    }
  };

  // Process Renewal
  const handleProcessRenewal = async (subId: string) => {
    try {
      const res = await api.processRenewal(subId);
      await loadData();
      showToast(
        `Renewal processed for ${res.subscription.customerName || 'customer'}! Invoice #${res.invoice.invoiceNumber} paid.`,
        'success'
      );
    } catch (e: any) {
      showToast(e.message || 'Renewal processing failed', 'error');
    }
  };

  // Simulate Batch Renewals Cron
  const handleSimulateBatch = async () => {
    setIsSimulating(true);
    try {
      const res = await api.simulateBatchRenewals();
      await loadData();
      showToast(res.message, 'success');
    } catch (e: any) {
      showToast(e.message || 'Batch simulation failed', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  // Add Customer
  const handleAddCustomer = async (data: any) => {
    try {
      const res = await api.createCustomer(data);
      await loadData();
      showToast(
        `Customer ${res.customer.name} added with ${res.subscription.planName} plan!`,
        'success'
      );
    } catch (e: any) {
      showToast(e.message || 'Failed to add customer', 'error');
    }
  };

  // Delete Customer
  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.deleteCustomer(id);
      await loadData();
      showToast('Customer and related subscriptions removed.', 'info');
    } catch (e: any) {
      showToast(e.message || 'Delete failed', 'error');
    }
  };

  // Create Plan
  const handleCreatePlan = async (planData: Partial<Plan>) => {
    try {
      const newPlan = await api.createPlan(planData);
      await loadData();
      showToast(`Plan tier "${newPlan.name}" created successfully!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to create plan', 'error');
    }
  };

  // Retry Payment
  const handleRetryPayment = async (invoiceId: string) => {
    try {
      await api.retryPayment(invoiceId);
      await loadData();
      showToast('Payment retry succeeded! Invoice marked as paid.', 'success');
    } catch (e: any) {
      showToast(e.message || 'Payment retry failed', 'error');
    }
  };

  // Refund Payment
  const handleRefundPayment = async (invoiceId: string) => {
    try {
      await api.refundPayment(invoiceId);
      await loadData();
      showToast('Payment refunded successfully.', 'info');
    } catch (e: any) {
      showToast(e.message || 'Refund failed', 'error');
    }
  };

  // Reset Demo Data
  const handleResetData = async () => {
    if (!confirm('Reset all demo customers, subscriptions, and invoices to initial seed data?')) return;
    try {
      await api.resetDemoData();
      await loadData();
      showToast('Demo data has been reset to defaults.', 'info');
    } catch (e: any) {
      showToast(e.message || 'Reset failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-lime-200 selection:text-lime-950">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-in max-w-md bg-gray-950 text-white p-3.5 rounded-2xl shadow-2xl border border-lime-500/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span className="font-medium text-gray-100">{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentView={view}
        onViewChange={setView}
        onOpenSubscribe={() => setShowNewCustomerModal(true)}
        onOpenSignIn={() => setView('portal')}
      />

      {/* MAIN VIEW SWITCHER */}
      {view === 'landing' ? (
        <main>
          {/* Hero Section (Exact replica of landing.jpg) */}
          <HeroLanding
            analytics={analytics}
            onNavigateToPortal={() => setView('portal')}
            onWatchDemo={() => setShowDemoModal(true)}
          />

          {/* Social Proof (Exact replica of landing.jpg) */}
          <SocialProof />

          {/* Pricing Section (Exact replica of landing.jpg) */}
          <PricingSection
            plans={plans}
            onSelectPlan={(plan, cycle) => {
              setShowNewCustomerModal(true);
            }}
          />

          {/* FAQ Section (Exact replica of landing.jpg) */}
          <FAQSection />

          {/* Footer & CTA Section (Exact replica of landing.jpg) */}
          <FooterSection
            onStartTrial={() => setShowNewCustomerModal(true)}
            onScheduleDemo={() => setShowDemoModal(true)}
          />
        </main>
      ) : (
        /* SAAS SUBSCRIPTION MANAGEMENT PORTAL */
        <main className="bg-gray-50/50 min-h-[calc(100vh-72px)] pb-16">
          <PortalHeader
            activeTab={portalTab}
            onTabChange={setPortalTab}
            onNewCustomer={() => setShowNewCustomerModal(true)}
            onBatchRenew={handleSimulateBatch}
            onResetData={handleResetData}
            isSimulating={isSimulating}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {portalTab === 'overview' && (
              <OverviewTab
                analytics={analytics}
                invoices={invoices}
                customers={customers}
                subscriptions={subscriptions}
                onNavigateTab={(tab) => setPortalTab(tab)}
                onSelectInvoice={(inv) => setSelectedInvoice(inv)}
              />
            )}

            {portalTab === 'customers' && (
              <CustomersTab
                customers={customers}
                subscriptions={subscriptions}
                invoices={invoices}
                plans={plans}
                onAddCustomer={() => setShowNewCustomerModal(true)}
                onDeleteCustomer={handleDeleteCustomer}
                onSelectInvoice={(inv) => setSelectedInvoice(inv)}
                onOpenUpgradeModal={(sub) => setUpgradeSub(sub)}
                onOpenCancelModal={(sub) => setCancelSub(sub)}
              />
            )}

            {portalTab === 'subscriptions' && (
              <SubscriptionsTab
                subscriptions={subscriptions}
                plans={plans}
                onOpenUpgradeModal={(sub) => setUpgradeSub(sub)}
                onOpenCancelModal={(sub) => setCancelSub(sub)}
                onPauseSubscription={handlePauseSubscription}
                onResumeSubscription={handleResumeSubscription}
                onProcessRenewal={handleProcessRenewal}
              />
            )}

            {portalTab === 'plans' && (
              <PlansTab
                plans={plans}
                onCreatePlan={handleCreatePlan}
              />
            )}

            {portalTab === 'renewals' && (
              <RenewalsTab
                renewals={renewals}
                onProcessRenewal={handleProcessRenewal}
                onSimulateBatch={handleSimulateBatch}
                isSimulating={isSimulating}
              />
            )}

            {portalTab === 'payments' && (
              <PaymentsTab
                invoices={invoices}
                onRetryPayment={handleRetryPayment}
                onRefundPayment={handleRefundPayment}
                onSelectInvoice={(inv) => setSelectedInvoice(inv)}
              />
            )}
          </div>
        </main>
      )}

      {/* MODALS */}
      {upgradeSub && (
        <UpgradeModal
          subscription={upgradeSub}
          plans={plans}
          onClose={() => setUpgradeSub(null)}
          onConfirmUpgrade={handleConfirmUpgrade}
        />
      )}

      {cancelSub && (
        <CancelModal
          subscription={cancelSub}
          onClose={() => setCancelSub(null)}
          onConfirmCancel={handleConfirmCancel}
          onPause={(months) => handlePauseSubscription(cancelSub.id, months)}
        />
      )}

      {showNewCustomerModal && (
        <NewCustomerModal
          plans={plans}
          onClose={() => setShowNewCustomerModal(false)}
          onSubmit={handleAddCustomer}
        />
      )}

      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {showDemoModal && (
        <DemoVideoModal
          onClose={() => setShowDemoModal(false)}
          onExplorePortal={() => {
            setShowDemoModal(false);
            setView('portal');
          }}
        />
      )}
    </div>
  );
}

export default App;
