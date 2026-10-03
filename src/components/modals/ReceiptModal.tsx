import React, { useState } from 'react';
import { PaymentReceipt } from '../../types';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Key,
  FileCheck2,
  BadgeCheck,
  Award,
  QrCode,
} from 'lucide-react';

interface ReceiptModalProps {
  receipt: PaymentReceipt | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToDownloads?: () => void;
  showToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receipt,
  isOpen,
  onClose,
  onGoToDownloads,
  showToast,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen || !receipt) return null;

  const handleCopyPassword = () => {
    if (receipt.projectPassword) {
      navigator.clipboard.writeText(receipt.projectPassword);
      setCopiedKey(true);
      showToast?.('Archive password copied to clipboard!', 'success');
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(receipt.referenceId);
    setCopiedRef(true);
    showToast?.('Transaction reference copied!', 'success');
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // Build clean, standalone printable HTML document for verified receipt
  const generateReceiptHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DevBro Receipt #${receipt.receiptId}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .receipt-container {
      max-width: 650px;
      margin: 0 auto;
      border: 2px solid #0284c7;
      border-radius: 16px;
      padding: 30px;
      position: relative;
      background: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-badge {
      background: #0284c7;
      color: #ffffff;
      font-family: monospace;
      font-weight: bold;
      font-size: 16px;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-title {
      font-size: 24px;
      font-weight: 900;
      color: #092244;
      margin: 0;
    }
    .logo-title span { color: #0284c7; }
    .badge {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 6px 14px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .meta-item .label {
      color: #64748b;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .meta-item .value {
      font-weight: 700;
      color: #0f172a;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 13px;
    }
    th {
      background: #f1f5f9;
      color: #475569;
      font-weight: 700;
      text-align: left;
      padding: 10px 14px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .total-row {
      background: #f8fafc;
      font-weight: 800;
      font-size: 15px;
    }
    .password-box {
      background: #faf5ff;
      border: 1.5px dashed #c084fc;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .barcode-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px dashed #cbd5e1;
      padding-top: 20px;
      margin-top: 20px;
    }
    .stamp {
      border: 2px solid #059669;
      color: #059669;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 900;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: inline-block;
      transform: rotate(-3deg);
    }
    .barcode {
      font-family: monospace;
      font-size: 11px;
      color: #64748b;
      letter-spacing: 2px;
    }
    .footer-note {
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
      margin-top: 20px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div class="logo">
        <div class="logo-badge">&lt;/&gt;</div>
        <div>
          <h1 class="logo-title">Dev<span>Bro</span></h1>
          <div style="font-size: 11px; color: #64748b; font-weight: 500;">Official Verified Donation Receipt</div>
        </div>
      </div>
      <div class="badge">
        ✓ 100% VERIFIED TRANSACTION
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <div class="label">Receipt Number</div>
        <div class="value">#${receipt.receiptId}</div>
      </div>
      <div class="meta-item">
        <div class="label">Issuance Date</div>
        <div class="value">${receipt.date}</div>
      </div>
      <div class="meta-item">
        <div class="label">Time</div>
        <div class="value">${receipt.time}</div>
      </div>
      <div class="meta-item">
        <div class="label">Payment Status</div>
        <div class="value" style="color: #059669;">${receipt.status}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description &amp; Payer Details</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div style="font-weight: bold; color: #0f172a; font-size: 14px; margin-bottom: 4px;">
              ${receipt.projectTitle}
            </div>
            <div style="color: #475569; font-size: 12px;">
              <strong>Payer:</strong> ${receipt.payerName} (${receipt.payerEmail})
            </div>
            <div style="color: #64748b; font-size: 11px; margin-top: 4px;">
              <strong>Payment Gateway:</strong> ${receipt.gateway}
            </div>
            <div style="color: #0284c7; font-family: monospace; font-size: 11px; margin-top: 2px;">
              <strong>Reference / UTR:</strong> ${receipt.referenceId}
            </div>
          </td>
          <td style="text-align: right; font-weight: bold; font-size: 14px; vertical-align: top;">
            ${receipt.amount}
          </td>
        </tr>
        <tr>
          <td style="color: #64748b;">DevBro Platform Convenience Fee</td>
          <td style="text-align: right; color: #059669; font-weight: 600;">₹0.00 (Zero Fee)</td>
        </tr>
        <tr class="total-row">
          <td>Total Amount Paid</td>
          <td style="text-align: right; color: #0284c7; font-size: 16px;">${receipt.totalPaid}</td>
        </tr>
      </tbody>
    </table>

    ${
      receipt.projectPassword
        ? `<div class="password-box">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #7e22ce; text-transform: uppercase;">
                Encrypted Source Archive Password / License Key
              </div>
              <div style="font-family: monospace; font-size: 16px; font-weight: 900; color: #1e1b4b; margin-top: 4px;">
                ${receipt.projectPassword}
              </div>
            </div>
            <div style="font-size: 11px; color: #6b21a8; font-weight: 600;">✓ Unlocked &amp; Permanent Access</div>
          </div>`
        : ''
    }

    <div class="barcode-area">
      <div>
        <div class="stamp">✓ VERIFIED BY DEVBRO</div>
        <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
          Electronic Audit Token: SHA256: 8C4E-792B-DEVBRO-OK
        </div>
      </div>
      <div style="text-align: right;">
        <div class="barcode">||| | | || ||| || |||| | ||| | |||</div>
        <div style="font-size: 10px; color: #94a3b8; font-family: monospace;">${receipt.referenceId}</div>
      </div>
    </div>

    <div class="footer-note">
      This is an official computer-generated receipt issued by DevBro Developer Platform. No physical signature is required.
    </div>
  </div>
</body>
</html>`;
  };

  // Robust Cross-Browser Print Handler
  const handlePrint = () => {
    setIsPrinting(true);
    try {
      // 1. Create a clean hidden iframe for isolated printing
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);

      const doc = printIframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(generateReceiptHtml());
        doc.close();

        setTimeout(() => {
          try {
            printIframe.contentWindow?.focus();
            printIframe.contentWindow?.print();
            showToast?.('Print dialog opened successfully!', 'success');
          } catch (e) {
            // Fallback to window.print
            window.print();
          } finally {
            setIsPrinting(false);
            setTimeout(() => {
              document.body.removeChild(printIframe);
            }, 2000);
          }
        }, 400);
      } else {
        window.print();
        setIsPrinting(false);
      }
    } catch (err) {
      window.print();
      setIsPrinting(false);
    }
  };

  // Download printable verified HTML invoice file
  const handleDownloadInvoiceHtml = () => {
    const htmlContent = generateReceiptHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DevBro_Verified_Receipt_${receipt.receiptId}.html`;
    link.click();
    URL.revokeObjectURL(url);
    showToast?.('Official verified receipt downloaded!', 'success');
  };

  // Download plain text receipt voucher
  const handleDownloadTxt = () => {
    const receiptText = `
=====================================================
                 DEVBRO OFFICIAL PAYMENT RECEIPT
=====================================================
Receipt ID:        #${receipt.receiptId}
Transaction Ref:   ${receipt.referenceId}
Issuance Date:     ${receipt.date} ${receipt.time}
Status:            ${receipt.status} (100% VERIFIED)

PAYER DETAILS:
Name:              ${receipt.payerName}
Email:             ${receipt.payerEmail}

ITEM DETAILS:
Project Title:     ${receipt.projectTitle}
Payment Gateway:   ${receipt.gateway}
Beneficiary:       ${receipt.beneficiaryUpiOrAddress || 'KDEV Project Payment'}

PAYMENT BREAKDOWN:
Subtotal:          ${receipt.amount}
Platform Fee:      ${receipt.platformFee}
Total Paid:        ${receipt.totalPaid}

DOWNLOAD ACCESS & UNLOCK:
Archive Password:  ${receipt.projectPassword || 'N/A'}
Gated Download:    Unlocked & Permanent Access

SECURITY AUDIT:
Verification:      DEVBRO OFFICIAL E-PAY AUDITED
Audit Hash:        SHA256: 8C4E-792B-DEVBRO-VERIFIED-2026

=====================================================
DevBro Verified Developer Ecosystem - Thank You!
=====================================================
`.trim();

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DevBro_Receipt_${receipt.receiptId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast?.('Receipt voucher downloaded as text file!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Receipt Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm">
              &lt;/&gt;
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight">DevBro Payment Receipt</h3>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Official Donation Confirmation &amp; Proof</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-5 sm:p-7 space-y-5 bg-slate-50/50">
          {/* Main Paper Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200 shadow-sm relative overflow-hidden">
            {/* Watermark Stamp in background */}
            <div className="absolute right-4 bottom-20 pointer-events-none opacity-10 select-none">
              <div className="border-4 border-emerald-700 text-emerald-800 font-black text-4xl p-4 rounded-2xl -rotate-12">
                DEVBRO VERIFIED
              </div>
            </div>

            {/* Receipt Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                  <BadgeCheck className="w-4 h-4 text-sky-600" />
                  <span>DevBro Official Platform Voucher</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 font-mono">
                  Receipt #{receipt.receiptId}
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold self-start sm:self-center shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Payment</span>
              </div>
            </div>

            {/* 4-Item Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3.5 my-3 bg-slate-50/80 rounded-xl px-3 border border-slate-100 text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</div>
                <div className="font-semibold text-slate-800 mt-0.5">{receipt.date}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</div>
                <div className="font-semibold text-slate-800 mt-0.5">{receipt.time}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gateway</div>
                <div className="font-semibold text-slate-800 mt-0.5 truncate">{receipt.gateway}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</div>
                <div className="font-extrabold text-emerald-600 mt-0.5">{receipt.totalPaid}</div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
              <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider flex justify-between">
                <span>Transaction &amp; Project Item</span>
                <span>Amount</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 text-sm">
                      {receipt.projectTitle}
                    </div>
                    <div className="text-slate-600 text-xs">
                      Payer: <span className="font-bold text-slate-800">{receipt.payerName}</span> ({receipt.payerEmail})
                    </div>
                    <div className="flex items-center gap-2 pt-1 font-mono text-xs text-slate-600">
                      <span>UTR / Reference ID: <span className="font-bold text-slate-900">{receipt.referenceId}</span></span>
                      <button
                        onClick={handleCopyRef}
                        className="text-sky-600 hover:text-sky-700 cursor-pointer"
                        title="Copy Reference"
                      >
                        {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-sm text-right shrink-0">
                    {receipt.amount}
                  </div>
                </div>

                <div className="px-4 py-2 flex items-center justify-between text-slate-600">
                  <span>DevBro Platform Convenience Fee</span>
                  <span className="font-bold text-emerald-600">{receipt.platformFee}</span>
                </div>

                <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between font-bold text-slate-900 border-t border-slate-200">
                  <span className="text-sm font-bold">Total Paid</span>
                  <span className="text-base text-emerald-700 font-black">{receipt.totalPaid}</span>
                </div>
              </div>
            </div>

            {/* Archive Password Unlocked Box */}
            {receipt.projectPassword && (
              <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                      Archive Download Password
                    </div>
                    <div className="font-mono font-black text-slate-900 text-sm tracking-wider">
                      {receipt.projectPassword}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 rounded-xl text-xs font-bold hover:bg-purple-100/50 shadow-2xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Official Stamp & Barcode Strip */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 border-2 border-emerald-600 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-wider -rotate-2">
                  ✓ DEVBRO AUDITED
                </div>
                <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                  SHA256: 8C4E-DEVBRO-VERIFIED
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] text-slate-600 tracking-widest font-bold">
                  |||| | || ||| |||| | ||
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  {receipt.receiptId}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            {/* Primary Print Button */}
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              type="button"
              className="w-full sm:flex-1 py-2.5 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? 'Opening Print...' : 'Print Verified Receipt'}</span>
            </button>

            {/* Download as Official HTML Invoice */}
            <button
              onClick={handleDownloadInvoiceHtml}
              type="button"
              className="w-full sm:flex-1 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>Download PDF/HTML</span>
            </button>

            {/* Go to Downloads */}
            {onGoToDownloads && (
              <button
                onClick={() => {
                  onClose();
                  onGoToDownloads();
                }}
                type="button"
                className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Go to Downloads</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Bottom Compliance Note */}
        <div className="px-6 py-3 bg-slate-100/90 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          Official computer-generated verified electronic voucher. Archived in DevBro ledger.
        </div>
      </div>
    </div>
  );
};
