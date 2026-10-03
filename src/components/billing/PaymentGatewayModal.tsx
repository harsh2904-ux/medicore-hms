import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { 
  CreditCard, 
  QrCode, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  X, 
  ArrowRight, 
  Receipt,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Invoice } from '../../types/billing';
import { billingService } from '../../services/billingService';
import { useNotification } from '../../context/NotificationContext';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onPaymentSuccess?: (paidInvoice: Invoice, transactionId: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onPaymentSuccess,
}) => {
  const { showToast } = useNotification();
  const [activeMethod, setActiveMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8920');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  const [cardName, setCardName] = useState('RAHUL SHARMA');

  // Selected Bank state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const payableAmount = invoice ? (invoice.balanceDue > 0 ? invoice.balanceDue : invoice.totalAmount) : 0;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setPaymentSuccess(false);
      setIsProcessing(false);
      setTimeLeft(300);

      // Generate dynamic UPI QR string
      if (invoice) {
        const upiUri = `upi://pay?pa=medicore.hms@icici&pn=MediCore%20Hospital&am=${payableAmount}&tr=${invoice.invoiceNumber}&tn=Hospital%20Bill%20${invoice.invoiceNumber}&cu=INR`;
        QRCode.toDataURL(upiUri, {
          width: 240,
          margin: 1.5,
          color: {
            dark: '#0B0F17',
            light: '#FFFFFF',
          },
        }).then(url => {
          setQrCodeDataUrl(url);
        }).catch(() => {});
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, invoice, payableAmount]);

  // Expiry countdown timer
  useEffect(() => {
    if (!isOpen || paymentSuccess) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, paymentSuccess]);

  if (!isOpen || !invoice) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    const newTxnId = `TXN_PAY_${Date.now()}`;
    setTransactionId(newTxnId);

    try {
      // Simulate bank authorization delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Record payment in billing service
      await billingService.recordPayment({
        invoiceNumber: invoice.invoiceNumber,
        patientName: invoice.patientName,
        amount: payableAmount,
        paymentMethod: activeMethod === 'UPI' ? 'UPI' : 'Card',
        transactionReference: newTxnId,
        receivedBy: 'Online Gateway (Self-Pay)',
        status: 'Successful',
      });

      setPaymentSuccess(true);
      showToast(`Payment of ₹${payableAmount.toLocaleString()} received successfully!`, 'success', 'Payment Authorized');

      if (onPaymentSuccess) {
        onPaymentSuccess({ ...invoice, status: 'Paid', amountPaid: invoice.totalAmount, balanceDue: 0 }, newTxnId);
      }
    } catch {
      showToast('Payment processing failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const modalNode = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      />

      <div className="relative w-full max-w-xl bg-[#0F131A] text-text-primary rounded-3xl border border-white/[0.12] shadow-2xl overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">MediCore Secure Pay</h3>
              <p className="text-xs text-text-muted">256-Bit Encrypted Healthcare Payment Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Payment Success State */
          <div className="p-8 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-status-success/20 border-2 border-status-success text-status-success mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-status-success font-bold">
                PAYMENT COMPLETED
              </span>
              <h2 className="text-2xl font-bold text-white">₹{payableAmount.toLocaleString()}</h2>
              <p className="text-xs text-text-secondary">
                Official hospital invoice <strong className="text-white font-mono">{invoice.invoiceNumber}</strong> marked as Paid
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] text-left text-xs space-y-2">
              <div className="flex justify-between text-text-muted">
                <span>Transaction Ref:</span>
                <span className="font-mono text-white font-semibold">{transactionId}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Payment Mode:</span>
                <span className="text-white font-medium">{activeMethod} Instant Gateway</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Patient MRN:</span>
                <span className="font-mono text-accent-primary font-semibold">{invoice.patientMrn}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Timestamp:</span>
                <span className="text-white">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handlePrintReceipt}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Print Receipt
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Payment Selection State */
          <div className="p-6 space-y-6">
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-primary/15 via-blue-600/10 to-transparent border border-accent-primary/25 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted block">
                  INVOICE #{invoice.invoiceNumber}
                </span>
                <span className="text-xs text-text-secondary font-medium">
                  {invoice.patientName} ({invoice.items[0]?.category || 'General Care'})
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-white">
                  ₹{payableAmount.toLocaleString()}
                </div>
                <div className="text-[11px] text-text-muted font-mono flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3 text-amber-400" /> Session: {formattedTime}
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveMethod('UPI')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMethod === 'UPI'
                    ? 'bg-accent-primary text-white shadow-md shadow-accent-primary/25'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" /> UPI & QR
              </button>

              <button
                type="button"
                onClick={() => setActiveMethod('CARD')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMethod === 'CARD'
                    ? 'bg-accent-primary text-white shadow-md shadow-accent-primary/25'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Card
              </button>

              <button
                type="button"
                onClick={() => setActiveMethod('NETBANKING')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeMethod === 'NETBANKING'
                    ? 'bg-accent-primary text-white shadow-md shadow-accent-primary/25'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <Building className="w-4 h-4" /> Net Banking
              </button>
            </div>

            {/* Tab 1: UPI & Dynamic QR */}
            {activeMethod === 'UPI' && (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="UPI Payment QR" className="w-44 h-44 object-contain" />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-500">
                      Generating QR...
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-center sm:text-left flex-1">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-white">Scan with any UPI App</span>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Google Pay, PhonePe, Paytm, BHIM, or Navi. Instant zero-surcharge settlement.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-emerald-400">
                    VPA: medicore.hms@icici
                  </div>

                  <p className="text-[10px] text-text-muted">
                    QR refreshes automatically for each billing transaction.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Credit / Debit Card */}
            {activeMethod === 'CARD' && (
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Net Banking */}
            {activeMethod === 'NETBANKING' && (
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <label className="block text-xs font-semibold text-text-secondary">Select Primary Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                        selectedBank === bank
                          ? 'bg-accent-primary/20 border-accent-primary text-white font-bold'
                          : 'bg-white/[0.02] border-white/[0.08] text-text-muted hover:text-white'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Action */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/[0.08]">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleExecutePayment}
                isLoading={isProcessing}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Pay ₹{payableAmount.toLocaleString()} Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};
