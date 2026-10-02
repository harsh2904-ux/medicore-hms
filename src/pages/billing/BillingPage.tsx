import React, { useState, useEffect } from 'react';
import { billingService } from '../../services/billingService';
import { initialPatients } from '../../services/mockData';
import { Invoice, PaymentRecord } from '../../types/billing';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useNotification } from '../../context/NotificationContext';
import { PrintInvoiceModal } from '../../components/billing/PrintInvoiceModal';
import {
  CreditCard,
  Receipt,
  IndianRupee,
  Clock,
  Printer,
  CheckCircle2,
  Plus,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const BillingPage: React.FC = () => {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'analytics'>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintInvoice, setSelectedPrintInvoice] = useState<Invoice | null>(null);

  // Record payment form
  const [paymentInvoiceNum, setPaymentInvoiceNum] = useState('');
  const [paymentPatientName, setPaymentPatientName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash' | 'Insurance / TPA'>('UPI');
  const [paymentRef, setPaymentRef] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const fetchBillingData = async () => {
    setIsLoading(true);
    try {
      const [invRes, payRes] = await Promise.all([
        billingService.getInvoices(),
        billingService.getPayments(),
      ]);
      setInvoices(invRes);
      setPayments(payRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleOpenInvoice = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenPaymentModal = (inv?: Invoice) => {
    if (inv) {
      setPaymentInvoiceNum(inv.invoiceNumber);
      setPaymentPatientName(inv.patientName);
      setPaymentAmount(inv.balanceDue > 0 ? inv.balanceDue : inv.totalAmount);
      setPaymentRef(`TXN-${Date.now().toString().slice(-6)}`);
    } else {
      setPaymentInvoiceNum(invoices[0]?.invoiceNumber || 'INV-2026-00431');
      setPaymentPatientName(invoices[0]?.patientName || 'Rahul Sharma');
      setPaymentAmount(2500);
      setPaymentRef(`UPI-${Date.now().toString().slice(-6)}`);
    }
    setIsPaymentModalOpen(true);
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await billingService.recordPayment({
        invoiceNumber: paymentInvoiceNum,
        patientName: paymentPatientName,
        amount: paymentAmount,
        paymentMethod,
        transactionReference: paymentRef || `POS-${Date.now()}`,
        receivedBy: 'Ramesh Sawant (Cashier)',
        status: 'Successful',
      });
      showToast(`Payment of ₹${paymentAmount.toLocaleString()} recorded successfully`, 'success', 'Settlement Completed');
      setIsPaymentModalOpen(false);
      fetchBillingData();
    } catch {
      showToast('Payment recording failed', 'error');
    }
  };

  const paymentMethodPieData = [
    { name: 'UPI', value: 45, color: '#5B8CFF' },
    { name: 'Card', value: 30, color: '#7C5CFF' },
    { name: 'Insurance/TPA', value: 20, color: '#30D158' },
    { name: 'Cash', value: 5, color: '#FFB547' },
  ];

  const deptRevenueData = [
    { name: 'Cardiology', revenue: 28.4 },
    { name: 'Neurology', revenue: 22.1 },
    { name: 'Orthopedics', revenue: 19.5 },
    { name: 'Gen Medicine', revenue: 14.2 },
    { name: 'Oncology', revenue: 31.8 },
    { name: 'Pediatrics', revenue: 8.6 },
  ];

  const tabs = [
    { id: 'invoices', label: 'Invoices Roster', badge: invoices.length },
    { id: 'payments', label: 'Payment Receipts', badge: payments.length },
    { id: 'analytics', label: 'Revenue Analytics' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Revenue & Billing Operations
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Cashless insurance settlements, POS payments, itemized invoices, and GST compliance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={() => handleOpenPaymentModal()}
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            Record Payment
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Today's Revenue"
          value="₹ 8.42L"
          icon={<IndianRupee className="w-5 h-5 text-status-success" />}
          trend={{ value: '+14.8% vs target', isPositive: true }}
          indicatorColor="success"
        />
        <StatCard
          label="Pending Receivables"
          value="₹ 30.60K"
          icon={<Clock className="w-5 h-5 text-status-warning" />}
          comparisonText="Across 2 invoices"
          indicatorColor="warning"
        />
        <StatCard
          label="Insurance Cashless"
          value="₹ 4.12L"
          icon={<ShieldCheck className="w-5 h-5 text-accent-primary" />}
          comparisonText="TPA desk claims"
          indicatorColor="primary"
        />
        <StatCard
          label="Refunds / Reversals"
          value="₹ 0.00"
          icon={<Receipt className="w-5 h-5 text-text-muted" />}
          comparisonText="Clean settlement"
          indicatorColor="primary"
        />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} />

      {/* TAB 1: Invoices */}
      {activeTab === 'invoices' && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Patient Invoices Roster</h2>
              <p className="text-xs text-text-muted">Itemized medical accounts and outstanding balances</p>
            </div>
            <span className="text-xs font-mono text-text-muted">{invoices.length} Invoices</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Billing Date</th>
                  <th className="py-2.5 px-3">Total Amount</th>
                  <th className="py-2.5 px-3">Amount Paid</th>
                  <th className="py-2.5 px-3">Balance Due</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-accent-primary whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-text-primary text-sm">{inv.patientName}</div>
                      <div className="text-[10px] text-text-muted font-mono">{inv.patientMrn}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-text-secondary">{inv.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-text-primary">
                      ₹{inv.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-status-success font-semibold">
                      ₹{inv.amountPaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-status-danger font-semibold">
                      ₹{inv.balanceDue.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={inv.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedPrintInvoice(inv);
                            setIsPrintModalOpen(true);
                          }}
                          leftIcon={<Printer className="w-3.5 h-3.5 text-blue-400" />}
                          className="py-1 text-xs"
                          title="Print Official Tax Invoice or Save as PDF"
                        >
                          Print PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenInvoice(inv)}
                          leftIcon={<Receipt className="w-3.5 h-3.5" />}
                          className="py-1 text-xs"
                        >
                          View Bill
                        </Button>
                        {inv.balanceDue > 0 && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenPaymentModal(inv)}
                            leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                            className="py-1 text-xs"
                          >
                            Pay Due
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* TAB 2: Payments */}
      {activeTab === 'payments' && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Settled Transactions & Receipts</h2>
              <p className="text-xs text-text-muted">Digital POS, UPI, Cash, and TPA claims payments received</p>
            </div>
            <span className="text-xs font-mono text-text-muted">{payments.length} Settlements</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                  <th className="py-2.5 px-3">Receipt ID</th>
                  <th className="py-2.5 px-3">Invoice Ref</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Transaction Reference</th>
                  <th className="py-2.5 px-3">Received By</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono font-bold text-accent-secondary">{pay.id}</td>
                    <td className="py-3 px-3 font-mono text-accent-primary">{pay.invoiceNumber}</td>
                    <td className="py-3 px-3 font-semibold text-text-primary">{pay.patientName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-status-success">
                      ₹{pay.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-text-secondary">{pay.paymentMethod}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-text-muted">{pay.transactionReference}</td>
                    <td className="py-3 px-3 text-text-muted">{pay.receivedBy}</td>
                    <td className="py-3 px-3 text-right">
                      <StatusBadge status={pay.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* TAB 3: Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-text-primary mb-1">Departmental Revenue (₹ Lakhs)</h3>
            <p className="text-xs text-text-muted mb-4">Total clinical revenue generation by medical specialty</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#687386" fontSize={11} tickLine={false} />
                  <YAxis stroke="#687386" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F131A',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      color: '#F5F7FA'
                    }}
                  />
                  <Bar dataKey="revenue" name="Revenue (₹ L)" fill="#5B8CFF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Payment Method Share</h3>
              <p className="text-xs text-text-muted mb-4">Breakdown across UPI, Card, Cashless & Cash</p>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentMethodPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                      {paymentMethodPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F131A',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        color: '#F5F7FA'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs">
              {paymentMethodPieData.map(m => (
                <div key={m.name} className="flex items-center justify-between text-text-secondary">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    {m.name}
                  </span>
                  <span className="font-mono font-semibold text-text-primary">{m.value}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          title={`Hospital Tax Invoice: ${selectedInvoice.invoiceNumber}`}
          subtitle={`Billing Date: ${selectedInvoice.date} • Due Date: ${selectedInvoice.dueDate}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs text-text-primary">
            {/* Hospital Header for print */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-base font-bold text-text-primary">MediCore Apex Hospital</div>
                <div className="text-[11px] text-text-muted mt-0.5">Bandra Kurla Complex, Mumbai 400051</div>
                <div className="text-[11px] text-text-muted">GSTIN: 27AABCM9102K1ZP • NABH Accredited</div>
              </div>
              <div className="text-right">
                <StatusBadge status={selectedInvoice.status} size="md" />
                <div className="font-mono text-xs text-accent-primary mt-1 font-bold">{selectedInvoice.invoiceNumber}</div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] grid grid-cols-2 gap-2">
              <div>
                <span className="text-text-muted">Billed To:</span>
                <div className="font-bold text-sm text-text-primary">{selectedInvoice.patientName}</div>
                <div className="text-text-muted font-mono">{selectedInvoice.patientMrn}</div>
              </div>
              <div className="text-right">
                <span className="text-text-muted">Phone:</span>
                <div className="text-text-primary font-mono">{selectedInvoice.patientPhone}</div>
                <div className="text-text-muted">Method: {selectedInvoice.paymentMethod || 'UPI'}</div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="rounded-xl border border-white/[0.08] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.04] border-b border-white/[0.08] text-text-muted uppercase text-[10px]">
                    <th className="py-2 px-3">Service / Procedure</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Rate</th>
                    <th className="py-2 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {selectedInvoice.items.map(it => (
                    <tr key={it.id}>
                      <td className="py-2.5 px-3 font-medium text-text-primary">{it.description}</td>
                      <td className="py-2.5 px-3 text-text-muted">{it.category}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{it.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{it.unitPrice}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">₹{it.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal:</span>
                  <span className="font-mono text-text-primary">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-status-success">
                    <span>Discount:</span>
                    <span className="font-mono">- ₹{selectedInvoice.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-muted">
                  <span>Tax (0% Healthcare):</span>
                  <span className="font-mono text-text-primary">₹0.00</span>
                </div>
                <div className="pt-2 border-t border-white/[0.08] flex justify-between text-sm font-bold text-text-primary">
                  <span>Total Payable:</span>
                  <span className="font-mono text-accent-primary">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-status-success font-semibold">
                  <span>Paid to Date:</span>
                  <span className="font-mono">₹{selectedInvoice.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-status-danger font-semibold">
                  <span>Balance Due:</span>
                  <span className="font-mono">₹{selectedInvoice.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                className="no-print"
              >
                Print Tax Invoice
              </Button>

              <Button variant="secondary" size="sm" onClick={() => setIsInvoiceModalOpen(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Cashier Payment"
        subtitle="Collect patient billing dues via UPI, Card, Cash, or Cashless TPA"
        maxWidth="md"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
          <Input
            label="Invoice Number"
            required
            value={paymentInvoiceNum}
            onChange={e => setPaymentInvoiceNum(e.target.value)}
          />
          <Input
            label="Patient Full Name"
            required
            value={paymentPatientName}
            onChange={e => setPaymentPatientName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount to Collect (₹)"
              type="number"
              required
              value={paymentAmount}
              onChange={e => setPaymentAmount(Number(e.target.value))}
            />
            <Select
              label="Payment Method"
              options={[
                { value: 'UPI', label: 'UPI / QR Code' },
                { value: 'Card', label: 'Debit / Credit Card (POS)' },
                { value: 'Cash', label: 'Cash Desk' },
                { value: 'Insurance / TPA', label: 'Insurance / TPA' },
              ]}
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as any)}
            />
          </div>
          <Input
            label="Transaction Reference / Cheque #"
            placeholder="e.g. UPI/20260930/192801"
            value={paymentRef}
            onChange={e => setPaymentRef(e.target.value)}
          />

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Confirm Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Official Printable Tax Invoice Modal */}
      <PrintInvoiceModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        invoice={selectedPrintInvoice}
      />
    </div>
  );
};
