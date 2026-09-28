import {
  Customer,
  Subscription,
  Plan,
  PaymentInvoice,
  RenewalItem,
  AnalyticsSummary,
  BillingCycle
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PLANS,
  INITIAL_INVOICES,
  INITIAL_ANALYTICS
} from '../data/mockData';

// Fallback in-memory state
let localCustomers: Customer[] = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
let localSubscriptions: Subscription[] = JSON.parse(JSON.stringify(INITIAL_SUBSCRIPTIONS));
let localPlans: Plan[] = JSON.parse(JSON.stringify(INITIAL_PLANS));
let localInvoices: PaymentInvoice[] = JSON.parse(JSON.stringify(INITIAL_INVOICES));

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Network response was not ok' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    console.warn(`API call failed to ${url}, using local state fallback:`, e);
    throw e;
  }
}

export const api = {
  // ANALYTICS
  async getAnalytics(): Promise<AnalyticsSummary> {
    try {
      return await fetchJson<AnalyticsSummary>('/api/analytics');
    } catch {
      const activeSubs = localSubscriptions.filter(s => s.status === 'active');
      const mrr = activeSubs.reduce((acc, s) => acc + (s.billingCycle === 'annually' ? s.amount / 12 : s.amount), 0);
      return {
        ...INITIAL_ANALYTICS,
        mrr: Math.round(mrr) || INITIAL_ANALYTICS.mrr,
        arr: Math.round(mrr * 12) || INITIAL_ANALYTICS.arr,
        activeSubscriptionsCount: activeSubs.length || INITIAL_ANALYTICS.activeSubscriptionsCount,
        totalCustomersCount: localCustomers.length
      };
    }
  },

  // CUSTOMERS
  async getCustomers(query?: { search?: string; status?: string }): Promise<Customer[]> {
    try {
      const params = new URLSearchParams();
      if (query?.search) params.append('search', query.search);
      if (query?.status) params.append('status', query.status);
      const url = `/api/customers${params.toString() ? `?${params.toString()}` : ''}`;
      return await fetchJson<Customer[]>(url);
    } catch {
      let list = [...localCustomers];
      if (query?.search) {
        const q = query.search.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
      }
      if (query?.status && query.status !== 'all') {
        list = list.filter(c => c.status === query.status);
      }
      return list;
    }
  },

  async getCustomer(id: string): Promise<Customer & { subscriptions: Subscription[]; invoices: PaymentInvoice[] }> {
    try {
      return await fetchJson<Customer & { subscriptions: Subscription[]; invoices: PaymentInvoice[] }>(`/api/customers/${id}`);
    } catch {
      const cust = localCustomers.find(c => c.id === id) || localCustomers[0];
      const subs = localSubscriptions.filter(s => s.customerId === cust.id);
      const invs = localInvoices.filter(i => i.customerId === cust.id);
      return { ...cust, subscriptions: subs, invoices: invs };
    }
  },

  async createCustomer(data: {
    name: string;
    email: string;
    company: string;
    planId: string;
    billingCycle?: BillingCycle;
    leadSource?: 'Inbound' | 'Outbound' | 'Referral' | 'Social';
    phone?: string;
    country?: string;
  }): Promise<{ customer: Customer; subscription: Subscription; invoice: PaymentInvoice }> {
    try {
      return await fetchJson('/api/customers', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch {
      const plan = localPlans.find(p => p.id === data.planId) || localPlans[0];
      const billingCycle = data.billingCycle || 'monthly';
      const amount = billingCycle === 'annually' ? plan.annualPrice : plan.monthlyPrice;
      const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        name: data.name,
        email: data.email,
        company: data.company || 'Innovate AI',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: data.phone || '+1 (555) 123-4567',
        country: data.country || 'United States',
        status: 'active',
        currentPlanId: plan.id,
        leadSource: data.leadSource || 'Inbound',
        mrr: billingCycle === 'annually' ? Math.round(amount / 12) : amount,
        lifetimeValue: amount,
        paymentMethod: {
          type: 'card',
          brand: 'Visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2028
        },
        createdAt: new Date().toISOString()
      };
      localCustomers.unshift(newCustomer);

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const newSub: Subscription = {
        id: `sub_${Date.now()}`,
        customerId: newCustomer.id,
        customerName: newCustomer.name,
        customerEmail: newCustomer.email,
        customerAvatar: newCustomer.avatar,
        customerCompany: newCustomer.company,
        planId: plan.id,
        planName: plan.name,
        billingCycle,
        amount,
        currency: 'USD',
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: nextMonth.toISOString(),
        nextRenewalDate: nextMonth.toISOString(),
        autoRenew: true,
        cancelAtPeriodEnd: false,
        createdAt: new Date().toISOString()
      };
      localSubscriptions.unshift(newSub);

      const newInvoice: PaymentInvoice = {
        id: `inv_${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        subscriptionId: newSub.id,
        customerId: newCustomer.id,
        customerName: newCustomer.name,
        customerEmail: newCustomer.email,
        amount,
        currency: 'USD',
        status: 'paid',
        date: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        description: `${plan.name} Plan - Initial Subscription`,
        planName: plan.name,
        paymentMethod: 'Visa ending in 4242'
      };
      localInvoices.unshift(newInvoice);

      return { customer: newCustomer, subscription: newSub, invoice: newInvoice };
    }
  },

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    try {
      return await fetchJson<Customer>(`/api/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch {
      const idx = localCustomers.findIndex(c => c.id === id);
      if (idx !== -1) {
        localCustomers[idx] = { ...localCustomers[idx], ...data };
        return localCustomers[idx];
      }
      throw new Error('Customer not found');
    }
  },

  async deleteCustomer(id: string): Promise<void> {
    try {
      await fetchJson(`/api/customers/${id}`, { method: 'DELETE' });
    } catch {
      localCustomers = localCustomers.filter(c => c.id !== id);
      localSubscriptions = localSubscriptions.filter(s => s.customerId !== id);
    }
  },

  // SUBSCRIPTIONS
  async getSubscriptions(query?: { status?: string; search?: string }): Promise<Subscription[]> {
    try {
      const params = new URLSearchParams();
      if (query?.status) params.append('status', query.status);
      if (query?.search) params.append('search', query.search);
      const url = `/api/subscriptions${params.toString() ? `?${params.toString()}` : ''}`;
      return await fetchJson<Subscription[]>(url);
    } catch {
      let list = [...localSubscriptions];
      if (query?.status && query.status !== 'all') {
        list = list.filter(s => s.status === query.status);
      }
      if (query?.search) {
        const q = query.search.toLowerCase();
        list = list.filter(s => (s.customerName && s.customerName.toLowerCase().includes(q)) || (s.planName && s.planName.toLowerCase().includes(q)));
      }
      return list;
    }
  },

  async upgradeSubscription(id: string, newPlanId: string, newBillingCycle?: BillingCycle): Promise<{
    subscription: Subscription;
    invoice: PaymentInvoice;
    proration: {
      unusedCurrentCredit: number;
      newPlanProratedCharge: number;
      netDue: number;
      remainingDays: number;
    };
  }> {
    try {
      return await fetchJson(`/api/subscriptions/${id}/upgrade`, {
        method: 'POST',
        body: JSON.stringify({ newPlanId, newBillingCycle })
      });
    } catch {
      const idx = localSubscriptions.findIndex(s => s.id === id);
      const plan = localPlans.find(p => p.id === newPlanId) || localPlans[1];
      const sub = localSubscriptions[idx];
      const cycle = newBillingCycle || sub.billingCycle;
      const newAmount = cycle === 'annually' ? plan.annualPrice : plan.monthlyPrice;

      const remainingDays = 18;
      const unusedCurrentCredit = 42.50;
      const newPlanProratedCharge = 71.40;
      const netDue = 28.90;

      localSubscriptions[idx] = {
        ...sub,
        planId: plan.id,
        planName: plan.name,
        billingCycle: cycle,
        amount: newAmount,
        status: 'active'
      };

      const invoice: PaymentInvoice = {
        id: `inv_${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        subscriptionId: sub.id,
        customerId: sub.customerId,
        customerName: sub.customerName || 'Customer',
        customerEmail: sub.customerEmail || '',
        amount: netDue,
        currency: 'USD',
        status: 'paid',
        date: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        description: `Plan Upgrade to ${plan.name} (Prorated adjustment: Credit $${unusedCurrentCredit}, New Tier $${newPlanProratedCharge})`,
        planName: plan.name,
        paymentMethod: 'Card on file'
      };
      localInvoices.unshift(invoice);

      return {
        subscription: localSubscriptions[idx],
        invoice,
        proration: { unusedCurrentCredit, newPlanProratedCharge, netDue, remainingDays }
      };
    }
  },

  async cancelSubscription(id: string, options: {
    cancelImmediately?: boolean;
    reason?: string;
    feedback?: string;
    applyRetentionDiscount?: boolean;
  }): Promise<{ success: boolean; retained?: boolean; message?: string; subscription: Subscription }> {
    try {
      return await fetchJson(`/api/subscriptions/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify(options)
      });
    } catch {
      const idx = localSubscriptions.findIndex(s => s.id === id);
      if (options.applyRetentionDiscount) {
        localSubscriptions[idx] = {
          ...localSubscriptions[idx],
          amount: Number((localSubscriptions[idx].amount * 0.8).toFixed(2)),
          discountPercent: 20
        };
        return {
          success: true,
          retained: true,
          message: 'Retention discount applied! 20% off active.',
          subscription: localSubscriptions[idx]
        };
      }

      if (options.cancelImmediately) {
        localSubscriptions[idx] = {
          ...localSubscriptions[idx],
          status: 'canceled',
          canceledAt: new Date().toISOString(),
          cancellationReason: options.reason,
          autoRenew: false
        };
      } else {
        localSubscriptions[idx] = {
          ...localSubscriptions[idx],
          cancelAtPeriodEnd: true,
          cancellationReason: options.reason,
          autoRenew: false
        };
      }
      return { success: true, subscription: localSubscriptions[idx] };
    }
  },

  async pauseSubscription(id: string, durationMonths: number = 1): Promise<{ success: boolean; subscription: Subscription }> {
    try {
      return await fetchJson(`/api/subscriptions/${id}/pause`, {
        method: 'POST',
        body: JSON.stringify({ durationMonths })
      });
    } catch {
      const idx = localSubscriptions.findIndex(s => s.id === id);
      const until = new Date();
      until.setMonth(until.getMonth() + durationMonths);
      localSubscriptions[idx] = {
        ...localSubscriptions[idx],
        status: 'paused',
        pausedUntil: until.toISOString()
      };
      return { success: true, subscription: localSubscriptions[idx] };
    }
  },

  async resumeSubscription(id: string): Promise<{ success: boolean; subscription: Subscription }> {
    try {
      return await fetchJson(`/api/subscriptions/${id}/resume`, { method: 'POST' });
    } catch {
      const idx = localSubscriptions.findIndex(s => s.id === id);
      localSubscriptions[idx] = {
        ...localSubscriptions[idx],
        status: 'active',
        pausedUntil: undefined
      };
      return { success: true, subscription: localSubscriptions[idx] };
    }
  },

  async processRenewal(id: string): Promise<{ subscription: Subscription; invoice: PaymentInvoice }> {
    try {
      return await fetchJson(`/api/subscriptions/${id}/renew`, { method: 'POST' });
    } catch {
      const idx = localSubscriptions.findIndex(s => s.id === id);
      const sub = localSubscriptions[idx];
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 1);

      localSubscriptions[idx] = {
        ...sub,
        status: 'active',
        nextRenewalDate: nextDate.toISOString()
      };

      const invoice: PaymentInvoice = {
        id: `inv_${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        subscriptionId: sub.id,
        customerId: sub.customerId,
        customerName: sub.customerName || 'Customer',
        customerEmail: sub.customerEmail || '',
        amount: sub.amount,
        currency: 'USD',
        status: 'paid',
        date: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        description: `${sub.planName} Plan - Renewal`,
        planName: sub.planName || 'Plan',
        paymentMethod: 'Card on file'
      };
      localInvoices.unshift(invoice);

      return { subscription: localSubscriptions[idx], invoice };
    }
  },

  // PLANS
  async getPlans(): Promise<Plan[]> {
    try {
      return await fetchJson<Plan[]>('/api/plans');
    } catch {
      return localPlans;
    }
  },

  async createPlan(data: Partial<Plan>): Promise<Plan> {
    try {
      return await fetchJson<Plan>('/api/plans', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch {
      const newPlan: Plan = {
        id: (data.name || 'custom').toLowerCase().replace(/\s+/g, '-'),
        name: data.name || 'Custom Plan',
        tagline: data.tagline || 'Custom tier',
        monthlyPrice: Number(data.monthlyPrice) || 99,
        annualPrice: (Number(data.monthlyPrice) || 99) * 10,
        annualMonthlyEquivalent: Math.round(((Number(data.monthlyPrice) || 99) * 10) / 12),
        leadsPerMonth: data.leadsPerMonth || 10000,
        features: data.features || ['Standard access', 'API integrations'],
        ctaText: data.ctaText || 'Get Started'
      };
      localPlans.push(newPlan);
      return newPlan;
    }
  },

  // RENEWALS
  async getRenewals(): Promise<RenewalItem[]> {
    try {
      return await fetchJson<RenewalItem[]>('/api/renewals');
    } catch {
      const now = new Date();
      return localSubscriptions
        .filter(s => s.status === 'active' || s.status === 'past_due')
        .map(sub => {
          const cust = localCustomers.find(c => c.id === sub.customerId);
          const renDate = new Date(sub.nextRenewalDate);
          const daysRemaining = Math.max(0, Math.ceil((renDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
          return {
            id: `ren_${sub.id}`,
            subscriptionId: sub.id,
            customerId: sub.customerId,
            customerName: cust?.name || sub.customerName || 'Customer',
            customerEmail: cust?.email || sub.customerEmail || '',
            customerAvatar: cust?.avatar || sub.customerAvatar || '',
            company: cust?.company || sub.customerCompany || '',
            planName: sub.planName || 'Plan',
            planId: sub.planId,
            amount: sub.amount,
            billingCycle: sub.billingCycle,
            renewalDate: sub.nextRenewalDate,
            daysRemaining,
            status: sub.status === 'past_due' ? 'at_risk' : 'scheduled',
            paymentMethod: cust?.paymentMethod ? `${cust.paymentMethod.brand} •••• ${cust.paymentMethod.last4}` : 'Card on file',
            lastPaymentStatus: sub.status === 'past_due' ? 'failed' : 'paid'
          };
        });
    }
  },

  async simulateBatchRenewals(): Promise<{ success: boolean; processedCount: number; message: string }> {
    try {
      return await fetchJson('/api/renewals/simulate-batch', { method: 'POST' });
    } catch {
      return { success: true, processedCount: 3, message: 'Simulated 3 renewals successfully.' };
    }
  },

  // PAYMENTS & INVOICES
  async getPayments(status?: string): Promise<PaymentInvoice[]> {
    try {
      const url = status && status !== 'all' ? `/api/payments?status=${status}` : '/api/payments';
      return await fetchJson<PaymentInvoice[]>(url);
    } catch {
      if (status && status !== 'all') {
        return localInvoices.filter(i => i.status === status);
      }
      return localInvoices;
    }
  },

  async retryPayment(invoiceId: string): Promise<{ success: boolean; invoice: PaymentInvoice }> {
    try {
      return await fetchJson(`/api/payments/${invoiceId}/retry`, { method: 'POST' });
    } catch {
      const idx = localInvoices.findIndex(i => i.id === invoiceId);
      if (idx !== -1) {
        localInvoices[idx] = { ...localInvoices[idx], status: 'paid', failureReason: undefined };
        return { success: true, invoice: localInvoices[idx] };
      }
      throw new Error('Invoice not found');
    }
  },

  async refundPayment(invoiceId: string): Promise<{ success: boolean; invoice: PaymentInvoice }> {
    try {
      return await fetchJson(`/api/payments/${invoiceId}/refund`, { method: 'POST' });
    } catch {
      const idx = localInvoices.findIndex(i => i.id === invoiceId);
      if (idx !== -1) {
        localInvoices[idx] = {
          ...localInvoices[idx],
          status: 'refunded',
          refundedAmount: localInvoices[idx].amount
        };
        return { success: true, invoice: localInvoices[idx] };
      }
      throw new Error('Invoice not found');
    }
  },

  // RESET
  async resetDemoData(): Promise<void> {
    try {
      await fetchJson('/api/demo/reset', { method: 'POST' });
    } catch {
      localCustomers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
      localSubscriptions = JSON.parse(JSON.stringify(INITIAL_SUBSCRIPTIONS));
      localPlans = JSON.parse(JSON.stringify(INITIAL_PLANS));
      localInvoices = JSON.parse(JSON.stringify(INITIAL_INVOICES));
    }
  }
};
