export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused';

export type BillingCycle = 'monthly' | 'annually';

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number; // yearly total or per month billed annually
  annualMonthlyEquivalent: number;
  leadsPerMonth: number;
  features: string[];
  isPopular?: boolean;
  badge?: string;
  ctaText: string;
  activeSubscribersCount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar: string;
  phone: string;
  country: string;
  status: 'active' | 'trial' | 'past_due' | 'churned';
  currentPlanId: string;
  leadSource: 'Inbound' | 'Outbound' | 'Referral' | 'Social';
  mrr: number;
  lifetimeValue: number;
  paymentMethod: {
    type: 'card' | 'paypal' | 'bank_transfer';
    brand?: string;
    last4?: string;
    expMonth?: number;
    expYear?: number;
  };
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  customerAvatar?: string;
  customerCompany?: string;
  planId: string;
  planName?: string;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextRenewalDate: string;
  trialEndsAt?: string;
  autoRenew: boolean;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  cancellationReason?: string;
  cancellationFeedback?: string;
  pausedUntil?: string;
  discountPercent?: number;
  createdAt: string;
}

export interface PaymentInvoice {
  id: string;
  invoiceNumber: string;
  subscriptionId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  date: string;
  dueDate: string;
  description: string;
  planName: string;
  paymentMethod: string;
  failureReason?: string;
  refundedAmount?: number;
}

export interface RenewalItem {
  id: string;
  subscriptionId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  company: string;
  planName: string;
  planId: string;
  amount: number;
  billingCycle: BillingCycle;
  renewalDate: string;
  daysRemaining: number;
  status: 'scheduled' | 'at_risk' | 'processed' | 'failed';
  paymentMethod: string;
  lastPaymentStatus: 'paid' | 'failed';
}

export interface AnalyticsSummary {
  totalLeads: number;
  totalLeadsGrowth: number;
  emailsSent: number;
  emailsSentGrowth: number;
  totalRevenue: number;
  totalRevenueGrowth: number;
  mrr: number;
  arr: number;
  activeSubscriptionsCount: number;
  totalCustomersCount: number;
  churnRate: number;
  arpu: number;
  sourcesDistribution: {
    inbound: number;
    outbound: number;
    referral: number;
    social: number;
  };
  revenueTimeline: {
    week: { label: string; amount: number }[];
    month: { label: string; amount: number; isPeak?: boolean }[];
    quarter: { label: string; amount: number }[];
    year: { label: string; amount: number }[];
  };
}
