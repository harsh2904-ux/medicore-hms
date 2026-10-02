import React from 'react';
import { Invoice } from '../../types/billing';
import { Printer, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-gray-900 text-white border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm">Printable Tax Invoice — {invoice.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print / Save as PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="printable-document p-8 sm:p-12 bg-white text-gray-900">
          
          {/* Hospital Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-blue-600 pb-6 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  M
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900">MEDICORE HOSPITAL</h1>
                  <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider">
                    Tertiary Care & Multi-Specialty Research Institute
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                450 Healthcare Boulevard, Suite 100, San Francisco, CA 94103<br />
                Phone: +1 (555) 019-8000 • Email: billing@medicore.com • Web: www.medicore.com
              </p>
            </div>

            <div className="text-right sm:self-center">
              <span className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                Official Tax Invoice
              </span>
              <p className="text-lg font-mono font-bold text-gray-900">{invoice.invoiceNumber}</p>
              <p className="text-xs text-gray-500 font-mono">GSTIN / EIN: 88-3928172-US</p>
            </div>
          </div>

          {/* Meta Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-4 rounded-xl bg-gray-50 border border-gray-200 mb-8 text-xs">
            <div>
              <span className="text-gray-500 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                Billed To (Patient)
              </span>
              <p className="font-bold text-sm text-gray-900">{invoice.patientName}</p>
              <p className="font-mono text-gray-600">MRN: {invoice.patientMrn}</p>
              <p className="text-gray-600">{invoice.patientPhone || '+1 (555) 234-5678'}</p>
            </div>

            <div>
              <span className="text-gray-500 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                Billing Dates
              </span>
              <p className="text-gray-700"><span className="font-medium text-gray-900">Invoice Date:</span> {invoice.date}</p>
              <p className="text-gray-700"><span className="font-medium text-gray-900">Due Date:</span> {invoice.dueDate}</p>
              <p className="text-gray-700"><span className="font-medium text-gray-900">Payment Terms:</span> Immediate</p>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-gray-500 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                Payment Status
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">
                <CheckCircle className="w-3.5 h-3.5" />
                {invoice.status}
              </div>
              {invoice.paymentMethod && (
                <p className="text-[11px] text-gray-600 mt-1.5">
                  Method: <span className="font-semibold text-gray-800">{invoice.paymentMethod}</span>
                </p>
              )}
            </div>
          </div>

          {/* Itemized Services Table */}
          <div className="mb-8">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-100 text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Service / Procedure Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price ($)</th>
                  <th className="py-2.5 px-3 text-right">Total ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 font-mono text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-gray-900">{item.description}</p>
                      <p className="text-[10px] text-gray-500">{item.category}</p>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-gray-900">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals Calculation */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-gray-300">
            <div className="text-xs text-gray-600 max-w-sm space-y-2">
              <div className="flex items-center gap-1.5 text-blue-800 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Hospital Billing & Insurance Clearing</span>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-500">
                Payments received are non-refundable. For reimbursement or insurance dispute queries, please quote
                Invoice #{invoice.invoiceNumber} to the Billing Department within 30 days.
              </p>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 text-gray-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex justify-between py-1 text-green-700">
                  <span>Hospital Discount:</span>
                  <span className="font-mono font-medium">-${invoice.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 text-gray-600">
                <span>Hospital Surcharge / Tax:</span>
                <span className="font-mono font-medium">${invoice.taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-gray-900 text-sm font-bold text-gray-900">
                <span>Grand Total:</span>
                <span className="font-mono text-base">${invoice.totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 text-green-800 bg-green-50 px-2 rounded font-semibold">
                <span>Amount Paid:</span>
                <span className="font-mono">${invoice.amountPaid.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-1 text-gray-900 font-bold border-t border-gray-200">
                <span>Balance Due:</span>
                <span className="font-mono text-red-600 font-bold">${invoice.balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer & Authorized Signature */}
          <div className="mt-12 pt-8 border-t border-dashed border-gray-300 flex justify-between items-end text-xs">
            <div className="text-gray-500 text-[10px]">
              <p>Generated by MediCore Hospital Electronic Records</p>
              <p className="font-mono">Timestamp: {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center">
              <div className="h-10 w-36 border-b border-gray-400 mb-1 mx-auto flex items-end justify-center pb-1">
                <span className="text-[10px] italic text-blue-900 font-serif">Electronic Sign-off</span>
              </div>
              <p className="text-[11px] font-bold text-gray-900">Authorized Accounts Officer</p>
              <p className="text-[10px] text-gray-500">MediCore Financial Services</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
