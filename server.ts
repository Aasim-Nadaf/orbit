import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_CUSTOMERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_PLANS,
  INITIAL_INVOICES,
  INITIAL_ANALYTICS
} from './src/data/mockData.js';
import { Customer, Subscription, Plan, PaymentInvoice, RenewalItem } from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store
let customers: Customer[] = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
let subscriptions: Subscription[] = JSON.parse(JSON.stringify(INITIAL_SUBSCRIPTIONS));
let plans: Plan[] = JSON.parse(JSON.stringify(INITIAL_PLANS));
let invoices: PaymentInvoice[] = JSON.parse(JSON.stringify(INITIAL_INVOICES));

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Helper to re-derive renewal items
  function getUpcomingRenewals(): RenewalItem[] {
    const now = new Date();
    return subscriptions
      .filter(s => s.status === 'active' || s.status === 'past_due')
      .map(sub => {
        const customer = customers.find(c => c.id === sub.customerId);
        const plan = plans.find(p => p.id === sub.planId);
        const renewalDate = new Date(sub.nextRenewalDate);
        const diffMs = renewalDate.getTime() - now.getTime();
        const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

        return {
          id: `ren_${sub.id}`,
          subscriptionId: sub.id,
          customerId: sub.customerId,
          customerName: customer ? customer.name : sub.customerName || 'Customer',
          customerEmail: customer ? customer.email : sub.customerEmail || '',
          customerAvatar: customer ? customer.avatar : sub.customerAvatar || '',
          company: customer ? customer.company : sub.customerCompany || '',
          planName: plan ? plan.name : sub.planName || 'Plan',
          planId: sub.planId,
          amount: sub.amount,
          billingCycle: sub.billingCycle,
          renewalDate: sub.nextRenewalDate,
          daysRemaining,
          status: (sub.status === 'past_due' ? 'at_risk' : 'scheduled') as 'at_risk' | 'scheduled',
          paymentMethod: customer?.paymentMethod ? `${customer.paymentMethod.brand} •••• ${customer.paymentMethod.last4}` : 'Card on file',
          lastPaymentStatus: (sub.status === 'past_due' ? 'failed' : 'paid') as 'failed' | 'paid'
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // ANALYTICS
  app.get('/api/analytics', (req, res) => {
    const activeSubs = subscriptions.filter(s => s.status === 'active' || s.status === 'trialing');
    const mrr = activeSubs.reduce((acc, s) => {
      if (s.status === 'trialing') return acc;
      return acc + (s.billingCycle === 'annually' ? s.amount / 12 : s.amount);
    }, 0);

    const churnedCount = subscriptions.filter(s => s.status === 'canceled').length;
    const totalCount = subscriptions.length;
    const churnRate = totalCount > 0 ? Number(((churnedCount / totalCount) * 100).toFixed(1)) : 1.8;

    res.json({
      ...INITIAL_ANALYTICS,
      mrr: Math.round(mrr) || INITIAL_ANALYTICS.mrr,
      arr: Math.round(mrr * 12) || INITIAL_ANALYTICS.arr,
      activeSubscriptionsCount: activeSubs.length || INITIAL_ANALYTICS.activeSubscriptionsCount,
      totalCustomersCount: customers.length,
      churnRate: churnRate,
    });
  });

  // CUSTOMERS
  app.get('/api/customers', (req, res) => {
    const { search, status } = req.query;
    let list = [...customers];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
      );
    }

    if (status && typeof status === 'string' && status !== 'all') {
      list = list.filter(c => c.status === status);
    }

    res.json(list);
  });

  app.get('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    const customerSubs = subscriptions.filter(s => s.customerId === customer.id);
    const customerInvoices = invoices.filter(i => i.customerId === customer.id);
    res.json({ ...customer, subscriptions: customerSubs, invoices: customerInvoices });
  });

  app.post('/api/customers', (req, res) => {
    const { name, email, company, planId, billingCycle = 'monthly', leadSource = 'Inbound', phone = '+1 (555) 000-0000', country = 'United States' } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const plan = plans.find(p => p.id === planId) || plans[0];
    const amount = billingCycle === 'annually' ? plan.annualPrice : plan.monthlyPrice;

    const newCustomerId = `cust_${Date.now()}`;
    const newCustomer: Customer = {
      id: newCustomerId,
      name,
      email,
      company: company || 'Self-Employed',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (customers.length % 10)}?w=150&auto=format&fit=crop&q=80`,
      phone,
      country,
      status: 'active',
      currentPlanId: plan.id,
      leadSource: leadSource || 'Inbound',
      mrr: billingCycle === 'annually' ? Math.round(amount / 12) : amount,
      lifetimeValue: amount,
      paymentMethod: {
        type: 'card',
        brand: 'Visa',
        last4: String(Math.floor(1000 + Math.random() * 9000)),
        expMonth: 12,
        expYear: 2029
      },
      createdAt: new Date().toISOString()
    };
    customers.unshift(newCustomer);

    // Create primary subscription
    const nextMonth = new Date();
    if (billingCycle === 'annually') {
      nextMonth.setFullYear(nextMonth.getFullYear() + 1);
    } else {
      nextMonth.setMonth(nextMonth.getMonth() + 1);
    }

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
    subscriptions.unshift(newSub);

    // Create first invoice
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
      description: `${plan.name} Plan - ${billingCycle === 'annually' ? 'Annual' : 'Monthly'} Subscription`,
      planName: plan.name,
      paymentMethod: `${newCustomer.paymentMethod.brand} ending in ${newCustomer.paymentMethod.last4}`
    };
    invoices.unshift(newInvoice);

    res.status(201).json({ customer: newCustomer, subscription: newSub, invoice: newInvoice });
  });

  app.put('/api/customers/:id', (req, res) => {
    const idx = customers.findIndex(c => c.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    customers[idx] = { ...customers[idx], ...req.body };
    res.json(customers[idx]);
  });

  app.delete('/api/customers/:id', (req, res) => {
    customers = customers.filter(c => c.id !== req.params.id);
    subscriptions = subscriptions.filter(s => s.customerId !== req.params.id);
    res.json({ success: true, message: 'Customer deleted' });
  });

  // SUBSCRIPTIONS
  app.get('/api/subscriptions', (req, res) => {
    const { status, search } = req.query;
    let list = subscriptions.map(sub => {
      const cust = customers.find(c => c.id === sub.customerId);
      const plan = plans.find(p => p.id === sub.planId);
      return {
        ...sub,
        customerName: cust?.name || sub.customerName,
        customerEmail: cust?.email || sub.customerEmail,
        customerAvatar: cust?.avatar || sub.customerAvatar,
        customerCompany: cust?.company || sub.customerCompany,
        planName: plan?.name || sub.planName,
      };
    });

    if (status && typeof status === 'string' && status !== 'all') {
      list = list.filter(s => s.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(s =>
        (s.customerName && s.customerName.toLowerCase().includes(q)) ||
        (s.customerCompany && s.customerCompany.toLowerCase().includes(q)) ||
        (s.planName && s.planName.toLowerCase().includes(q))
      );
    }

    res.json(list);
  });

  app.get('/api/subscriptions/:id', (req, res) => {
    const sub = subscriptions.find(s => s.id === req.params.id);
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });
    res.json(sub);
  });

  // UPGRADE OR DOWNGRADE
  app.post('/api/subscriptions/:id/upgrade', (req, res) => {
    const { newPlanId, newBillingCycle } = req.body;
    const subIndex = subscriptions.findIndex(s => s.id === req.params.id);
    if (subIndex === -1) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const sub = subscriptions[subIndex];
    const newPlan = plans.find(p => p.id === newPlanId);
    if (!newPlan) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const billingCycle = newBillingCycle || sub.billingCycle;
    const newAmount = billingCycle === 'annually' ? newPlan.annualPrice : newPlan.monthlyPrice;
    const isUpgrade = newAmount > sub.amount;

    // Proration math calculation:
    // Calculate remaining days in cycle
    const end = new Date(sub.currentPeriodEnd).getTime();
    const start = new Date(sub.currentPeriodStart).getTime();
    const now = Date.now();
    const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    const remainingDays = Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24)));
    const remainingRatio = remainingDays / totalDays;

    const unusedCurrentCredit = Number((sub.amount * remainingRatio).toFixed(2));
    const newPlanProratedCharge = Number((newAmount * remainingRatio).toFixed(2));
    const netDue = Math.max(0, Number((newPlanProratedCharge - unusedCurrentCredit).toFixed(2)));

    // Update subscription
    subscriptions[subIndex] = {
      ...sub,
      planId: newPlan.id,
      planName: newPlan.name,
      billingCycle,
      amount: newAmount,
      status: 'active',
    };

    // Update customer MRR
    const custIdx = customers.findIndex(c => c.id === sub.customerId);
    if (custIdx !== -1) {
      customers[custIdx].currentPlanId = newPlan.id;
      customers[custIdx].mrr = billingCycle === 'annually' ? Math.round(newAmount / 12) : newAmount;
      customers[custIdx].lifetimeValue += netDue;
    }

    // Generate invoice for prorated amount or receipt
    const customer = customers.find(c => c.id === sub.customerId);
    const invoice: PaymentInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      subscriptionId: sub.id,
      customerId: sub.customerId,
      customerName: customer?.name || 'Customer',
      customerEmail: customer?.email || '',
      amount: netDue,
      currency: 'USD',
      status: 'paid',
      date: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      description: `${isUpgrade ? 'Plan Upgrade' : 'Plan Change'} to ${newPlan.name} (Prorated adjustment: Credit $${unusedCurrentCredit}, New Tier $${newPlanProratedCharge})`,
      planName: newPlan.name,
      paymentMethod: customer?.paymentMethod ? `${customer.paymentMethod.brand} ending in ${customer.paymentMethod.last4}` : 'Card on file'
    };
    invoices.unshift(invoice);

    res.json({
      subscription: subscriptions[subIndex],
      invoice,
      proration: {
        unusedCurrentCredit,
        newPlanProratedCharge,
        netDue,
        remainingDays,
      }
    });
  });

  // CANCEL SUBSCRIPTION
  app.post('/api/subscriptions/:id/cancel', (req, res) => {
    const { cancelImmediately = false, reason = 'Not specified', feedback = '', applyRetentionDiscount = false } = req.body;
    const subIndex = subscriptions.findIndex(s => s.id === req.params.id);
    if (subIndex === -1) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const sub = subscriptions[subIndex];

    // If retention discount accepted (e.g. 20% discount offer)
    if (applyRetentionDiscount) {
      const discountedAmount = Number((sub.amount * 0.8).toFixed(2));
      subscriptions[subIndex] = {
        ...sub,
        amount: discountedAmount,
        discountPercent: 20,
        cancelAtPeriodEnd: false,
        status: 'active'
      };

      const custIdx = customers.findIndex(c => c.id === sub.customerId);
      if (custIdx !== -1) {
        customers[custIdx].mrr = sub.billingCycle === 'annually' ? Math.round(discountedAmount / 12) : discountedAmount;
      }

      return res.json({
        retained: true,
        message: 'Retention discount applied! Subscription remains active with 20% off.',
        subscription: subscriptions[subIndex]
      });
    }

    if (cancelImmediately) {
      subscriptions[subIndex] = {
        ...sub,
        status: 'canceled',
        autoRenew: false,
        canceledAt: new Date().toISOString(),
        cancellationReason: reason,
        cancellationFeedback: feedback,
      };
      const custIdx = customers.findIndex(c => c.id === sub.customerId);
      if (custIdx !== -1) {
        customers[custIdx].status = 'churned';
        customers[custIdx].mrr = 0;
      }
    } else {
      // Cancel at period end
      subscriptions[subIndex] = {
        ...sub,
        cancelAtPeriodEnd: true,
        autoRenew: false,
        cancellationReason: reason,
        cancellationFeedback: feedback,
      };
    }

    res.json({
      success: true,
      subscription: subscriptions[subIndex]
    });
  });

  // PAUSE SUBSCRIPTION
  app.post('/api/subscriptions/:id/pause', (req, res) => {
    const { durationMonths = 1 } = req.body;
    const subIndex = subscriptions.findIndex(s => s.id === req.params.id);
    if (subIndex === -1) return res.status(404).json({ error: 'Subscription not found' });

    const pauseUntil = new Date();
    pauseUntil.setMonth(pauseUntil.getMonth() + Number(durationMonths));

    subscriptions[subIndex] = {
      ...subscriptions[subIndex],
      status: 'paused',
      pausedUntil: pauseUntil.toISOString(),
      autoRenew: false
    };

    res.json({ success: true, subscription: subscriptions[subIndex] });
  });

  // RESUME SUBSCRIPTION
  app.post('/api/subscriptions/:id/resume', (req, res) => {
    const subIndex = subscriptions.findIndex(s => s.id === req.params.id);
    if (subIndex === -1) return res.status(404).json({ error: 'Subscription not found' });

    subscriptions[subIndex] = {
      ...subscriptions[subIndex],
      status: 'active',
      pausedUntil: undefined,
      autoRenew: true
    };

    res.json({ success: true, subscription: subscriptions[subIndex] });
  });

  // PROCESS RENEWAL NOW
  app.post('/api/subscriptions/:id/renew', (req, res) => {
    const subIndex = subscriptions.findIndex(s => s.id === req.params.id);
    if (subIndex === -1) return res.status(404).json({ error: 'Subscription not found' });

    const sub = subscriptions[subIndex];
    const customer = customers.find(c => c.id === sub.customerId);

    // Compute new renewal date
    const nextDate = new Date(sub.nextRenewalDate);
    if (sub.billingCycle === 'annually') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    subscriptions[subIndex] = {
      ...sub,
      status: 'active',
      currentPeriodStart: sub.nextRenewalDate,
      currentPeriodEnd: nextDate.toISOString(),
      nextRenewalDate: nextDate.toISOString(),
    };

    if (customer && customer.status === 'past_due') {
      customer.status = 'active';
    }

    // Generate paid invoice
    const newInvoice: PaymentInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      subscriptionId: sub.id,
      customerId: sub.customerId,
      customerName: customer?.name || 'Customer',
      customerEmail: customer?.email || '',
      amount: sub.amount,
      currency: 'USD',
      status: 'paid',
      date: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      description: `${sub.planName} Plan - Subscription Renewal (${sub.billingCycle})`,
      planName: sub.planName || 'Plan',
      paymentMethod: customer?.paymentMethod ? `${customer.paymentMethod.brand} ending in ${customer.paymentMethod.last4}` : 'Card on file'
    };
    invoices.unshift(newInvoice);

    res.json({ subscription: subscriptions[subIndex], invoice: newInvoice });
  });

  // PLANS
  app.get('/api/plans', (req, res) => {
    res.json(plans);
  });

  app.post('/api/plans', (req, res) => {
    const { name, tagline, monthlyPrice, annualPrice, leadsPerMonth, features, ctaText = 'Get Started' } = req.body;
    if (!name || !monthlyPrice) {
      return res.status(400).json({ error: 'Name and monthlyPrice are required' });
    }

    const newPlan: Plan = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      tagline: tagline || 'Custom plan for specialized requirements',
      monthlyPrice: Number(monthlyPrice),
      annualPrice: annualPrice ? Number(annualPrice) : Number(monthlyPrice) * 10,
      annualMonthlyEquivalent: annualPrice ? Math.round(Number(annualPrice) / 12) : Math.round((Number(monthlyPrice) * 10) / 12),
      leadsPerMonth: leadsPerMonth ? Number(leadsPerMonth) : 25000,
      features: Array.isArray(features) && features.length > 0 ? features : ['Custom features', 'Standard support'],
      ctaText
    };
    plans.push(newPlan);
    res.status(201).json(newPlan);
  });

  app.put('/api/plans/:id', (req, res) => {
    const idx = plans.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Plan not found' });
    plans[idx] = { ...plans[idx], ...req.body };
    res.json(plans[idx]);
  });

  // RENEWALS
  app.get('/api/renewals', (req, res) => {
    const renewals = getUpcomingRenewals();
    res.json(renewals);
  });

  app.post('/api/renewals/simulate-batch', (req, res) => {
    // Process all renewals due in <= 3 days
    const now = new Date();
    let processedCount = 0;
    subscriptions.forEach(sub => {
      if (sub.status === 'active' && sub.autoRenew) {
        const renDate = new Date(sub.nextRenewalDate);
        const days = Math.ceil((renDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 5) {
          const nextDate = new Date(renDate);
          nextDate.setMonth(nextDate.getMonth() + 1);
          sub.currentPeriodStart = renDate.toISOString();
          sub.currentPeriodEnd = nextDate.toISOString();
          sub.nextRenewalDate = nextDate.toISOString();
          processedCount++;
        }
      }
    });

    res.json({ success: true, processedCount, message: `Successfully simulated ${processedCount} renewal transactions.` });
  });

  // PAYMENTS & INVOICES
  app.get('/api/payments', (req, res) => {
    const { status } = req.query;
    let list = [...invoices];
    if (status && typeof status === 'string' && status !== 'all') {
      list = list.filter(i => i.status === status);
    }
    res.json(list);
  });

  app.post('/api/payments/:id/retry', (req, res) => {
    const idx = invoices.findIndex(i => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Invoice not found' });

    invoices[idx].status = 'paid';
    delete invoices[idx].failureReason;

    // Reactivate customer and subscription if past due
    const subIdx = subscriptions.findIndex(s => s.id === invoices[idx].subscriptionId);
    if (subIdx !== -1) {
      subscriptions[subIdx].status = 'active';
    }
    const custIdx = customers.findIndex(c => c.id === invoices[idx].customerId);
    if (custIdx !== -1) {
      customers[custIdx].status = 'active';
    }

    res.json({ success: true, invoice: invoices[idx] });
  });

  app.post('/api/payments/:id/refund', (req, res) => {
    const idx = invoices.findIndex(i => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Invoice not found' });

    invoices[idx].status = 'refunded';
    invoices[idx].refundedAmount = invoices[idx].amount;

    // Adjust customer lifetime value
    const custIdx = customers.findIndex(c => c.id === invoices[idx].customerId);
    if (custIdx !== -1) {
      customers[custIdx].lifetimeValue = Math.max(0, customers[custIdx].lifetimeValue - invoices[idx].amount);
    }

    res.json({ success: true, invoice: invoices[idx] });
  });

  // RESET DEMO DATA
  app.post('/api/demo/reset', (req, res) => {
    customers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
    subscriptions = JSON.parse(JSON.stringify(INITIAL_SUBSCRIPTIONS));
    plans = JSON.parse(JSON.stringify(INITIAL_PLANS));
    invoices = JSON.parse(JSON.stringify(INITIAL_INVOICES));
    res.json({ success: true, message: 'Demo data has been reset to defaults.' });
  });

  // VITE OR STATIC SERVING
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LeadPilot AI Subscription System running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
