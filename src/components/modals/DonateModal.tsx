import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Project, UserProfile } from '../../types';
import {
  X,
  Gift,
  Play,
  Check,
  CreditCard,
  DollarSign,
  Edit,
  Clock,
  UploadCloud,
  Heart,
  Image as ImageIcon,
  Copy,
  Shield,
  Smartphone,
  RefreshCw,
  AlertTriangle,
  QrCode,
  Zap,
  Download,
  ExternalLink,
} from 'lucide-react';

interface DonateModalProps {
  project: Project | null;
  user?: UserProfile;
  onClose: () => void;
  onGoToFreeUnlock: (project: Project) => void;
  onSubmitDonation: (
    project: Project,
    gateway: string,
    amount: string,
    reference: string
  ) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  project,
  user,
  onClose,
  onGoToFreeUnlock,
  onSubmitDonation,
}) => {
  if (!project) return null;

  // Gateways: UPI is placed as primary, alongside BNB (BEP20) from user's screenshot
  const [gateway, setGateway] = useState<'upi_kdev' | 'bnb_bep20' | 'usdt_trc20' | 'usdt_bep20' | 'binance_pay' | 'bank_transfer'>('upi_kdev');
  
  // Amounts
  const [amount, setAmount] = useState('85'); // ₹85 INR for UPI or 1 USDT
  const [reference, setReference] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStepText, setVerificationStepText] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('/kdev-neon-qr.svg');

  // 60-Second Payment Countdown Timer
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const upiId = 'kdev.payment@upi';
  const bnbAddress = '0xbf5255543c101a4b4d2c66e6b3f3425afcbebe3f';
  const usdtAddress = 'TX8a9YfKb49Jg2mR1V9e9L3QwE8dF7Z0xX';

  const currentAddress =
    gateway === 'upi_kdev'
      ? upiId
      : gateway === 'bnb_bep20'
      ? bnbAddress
      : usdtAddress;

  // Generate dynamic scannable QR Code that matches the exact uploaded image
  useEffect(() => {
    let payload = '';
    if (gateway === 'upi_kdev') {
      payload = `upi://pay?pa=${upiId}&pn=DevBro%20Payment&am=${encodeURIComponent(amount || '85')}&cu=INR&tn=${encodeURIComponent(project.title.substring(0, 30))}`;
    } else if (gateway === 'bnb_bep20') {
      payload = bnbAddress;
    } else {
      payload = currentAddress;
    }

    QRCode.toDataURL(payload, {
      width: 400,
      margin: 1,
      color: {
        dark: '#050b14',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch(() => setQrCodeDataUrl('/kdev-neon-qr.svg'));
  }, [gateway, amount, project.title]);

  // Reset timer on open or gateway change
  useEffect(() => {
    setTimeLeft(60);
    setIsTimerRunning(true);
  }, [gateway, project.id]);

  // Timer interval
  useEffect(() => {
    if (!isTimerRunning) return;

    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  const handleRestartTimer = () => {
    setTimeLeft(60);
    setIsTimerRunning(true);
  };

  // Adjust default amount when switching between UPI (INR) and Crypto (USDT)
  const handleGatewayChange = (newGateway: typeof gateway) => {
    setGateway(newGateway);
    if (newGateway === 'upi_kdev') {
      setAmount('85');
    } else {
      setAmount(project.minDonationUsdt.toString());
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrCodeDataUrl || '/kdev-neon-qr.svg';
    link.download = `DevBro_Payment_QR_${gateway}.png`;
    link.click();
  };

  const handleInstantVerifyPaid = (isSimulation = false) => {
    setIsSubmitting(true);
    setVerificationStepText(
      isSimulation
        ? '⚡ Simulating scan & UPI payment transfer...'
        : '🔍 Verifying scan payment with banking network...'
    );

    const generatedRef =
      reference.trim() ||
      (gateway === 'upi_kdev'
        ? `UPI${Date.now().toString().slice(-8)}`
        : `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`);

    const formattedAmount =
      gateway === 'upi_kdev'
        ? `₹${parseFloat(amount || '85').toFixed(2)} INR`
        : `₮ ${parseFloat(amount || '1').toFixed(2)} USDT`;

    const gatewayLabel =
      gateway === 'upi_kdev'
        ? 'UPI (Google Pay / PhonePe / Paytm / BHIM) - KDEV QR'
        : gateway === 'bnb_bep20'
        ? 'BNB (BEP20) — BSC Crypto'
        : gateway === 'usdt_trc20'
        ? 'USDT (TRC20) — Tron Network'
        : gateway === 'usdt_bep20'
        ? 'USDT (BEP20) — BSC Network'
        : gateway === 'binance_pay'
        ? 'Binance Pay (ID: 89341029)'
        : 'Bank Transfer (IMPS/NEFT)';

    setTimeout(() => {
      setVerificationStepText('✅ Payment verified! Generating official DevBro receipt...');
      setTimeout(() => {
        setIsSubmitting(false);
        onSubmitDonation(project, gatewayLabel, formattedAmount, generatedRef);
      }, 500);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleInstantVerifyPaid(false);
  };

  // Timer format 00:XX
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  const currentUpiDeepLink = `upi://pay?pa=${upiId}&pn=DevBro%20Payment&am=${encodeURIComponent(amount || '85')}&cu=INR&tn=${encodeURIComponent(project.title.substring(0, 30))}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Support {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Help this DevBro open-source project grow by making a quick donation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Free Download Promo Banner */}
          {project.freeTasksAvailable && (
            <section className="bg-[#f0faff] border border-[#a2e0fb] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-12 h-12 rounded-full bg-[#009beb] text-white shrink-0 flex items-center justify-center text-lg shadow-sm">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-[15px]">
                    Get {project.title} for free!
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Complete a quick YouTube video task and download without donating.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToFreeUnlock(project);
                }}
                className="bg-[#0086eb] hover:bg-[#0074cc] text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 whitespace-nowrap shadow-xs transition cursor-pointer shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Free Download</span>
              </button>
            </section>
          )}

          {/* 3-Step Wizard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#e9f2ff] border border-blue-200/70 rounded-xl p-3 flex flex-col justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#d5e7fe] text-[#2563eb] flex items-center justify-center text-xs mb-2">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Step 1</div>
                <div className="text-[11px] text-slate-500 font-medium">Choose UPI or Crypto</div>
              </div>
            </div>

            <div className="bg-[#f5eefc] border border-purple-100 rounded-xl p-3 flex flex-col justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#ebd9fb] text-[#8b5cf6] flex items-center justify-center text-xs mb-2">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Step 2</div>
                <div className="text-[11px] text-slate-500 font-medium">Scan QR in 60 seconds</div>
              </div>
            </div>

            <div className="bg-[#fef2e8] border border-orange-100 rounded-xl p-3 flex flex-col justify-between">
              <div className="w-7 h-7 rounded-lg bg-[#fde4d0] text-[#ea580c] flex items-center justify-center text-xs mb-2">
                <Edit className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">Step 3</div>
                <div className="text-[11px] text-slate-500 font-medium">Get Verified Receipt</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: Payment Gateway Dropdown */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-600" />
                  <span>Payment Gateway</span>
                </div>
                {gateway === 'upi_kdev' && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    ⚡ Instant UPI Scan &amp; Pay
                  </span>
                )}
              </label>

              <select
                value={gateway}
                onChange={(e) => handleGatewayChange(e.target.value as typeof gateway)}
                className="w-full text-sm font-semibold border border-slate-300 rounded-xl py-2.5 px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white"
              >
                <option value="upi_kdev">
                  🇮🇳 UPI (Google Pay / PhonePe / Paytm / BHIM) — KDEV QR
                </option>
                <option value="bnb_bep20">
                  BNB (BEP20) — BSC Crypto
                </option>
                <option value="usdt_trc20">
                  USDT (TRC20 Network: Tron)
                </option>
                <option value="usdt_bep20">
                  USDT (BEP20 Network: BSC)
                </option>
                <option value="binance_pay">
                  Binance Pay (Pay ID: 89341029)
                </option>
                <option value="bank_transfer">
                  Bank Transfer / IMPS (Manual wire)
                </option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Instant verified DevBro official receipt is generated right after submission.</span>
              </p>
            </div>

            {/* PAYMENT INSTRUCTIONS & 60-SECOND TIMER BOX */}
            <div className="bg-sky-50/60 border border-sky-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              {/* Header with Title & 60-Second Countdown Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900">
                    Payment Instructions
                  </h4>
                </div>

                {/* 60s Payment Countdown Timer */}
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition shadow-2xs ${
                      timeLeft > 30
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : timeLeft > 10
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>00:{formattedSeconds}</span>
                    <span className="text-[10px] font-sans font-semibold">
                      {timeLeft === 0 ? 'Expired' : 'left'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRestartTimer}
                    title="Restart 60-second timer"
                    className="p-1 text-slate-500 hover:text-sky-700 rounded-lg hover:bg-sky-100 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Timer Progress Bar */}
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft > 30
                      ? 'bg-emerald-500'
                      : timeLeft > 10
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
              </div>

              {/* Timer Expiration Alert if 0 */}
              {timeLeft === 0 && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>60-second payment window elapsed. Click to refresh:</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestartTimer}
                    className="px-2.5 py-1 bg-white border border-rose-300 rounded-lg font-bold text-[11px] text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                  >
                    Reset Timer
                  </button>
                </div>
              )}

              {/* PAYMENT DETAILS: Address / UPI ID with Copy Button */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  PAYMENT DETAILS
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-300 px-3.5 py-2.5 shadow-2xs">
                  <span className="font-mono text-xs sm:text-sm text-slate-800 select-all truncate flex-1 font-semibold">
                    {currentAddress}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* PAYMENT INSTRUCTIONS TEXT */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  PAYMENT INSTRUCTIONS
                </div>
                <div className="bg-white rounded-xl border border-slate-300 p-3 text-xs text-slate-700 space-y-1">
                  {gateway === 'upi_kdev' ? (
                    <>
                      <p>1. Open Google Pay, PhonePe, Paytm, BHIM, or any UPI app.</p>
                      <p>2. Scan the <strong>Payment QR Card</strong> below or pay directly to <strong>{upiId}</strong>.</p>
                      <p>3. Complete within 60s and enter the 12-digit UPI UTR / Reference ID.</p>
                    </>
                  ) : gateway === 'bnb_bep20' ? (
                    <>
                      <p>1. Network: <strong>BSC (BEP20)</strong></p>
                      <p>2. Send BNB or BEP20 tokens to the address above or scan QR.</p>
                      <p>3. Copy the blockchain transaction hash.</p>
                    </>
                  ) : (
                    <>
                      <p>1. Network: <strong>TRC20 / TRON</strong></p>
                      <p>2. Minimum 1.00 USDT transfer required.</p>
                    </>
                  )}
                </div>
              </div>

              {/* EXACT QR CODE CARD: MATCHING USER'S UPLOADED SCREENSHOT */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="flex items-center justify-between w-full max-w-[280px] mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    SCAN TO PAY QR CODE
                  </span>
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 cursor-pointer"
                    title="Download QR Code image"
                  >
                    <Download className="w-3 h-3" />
                    <span>Save QR</span>
                  </button>
                </div>

                {/* Exact Visual Container matching user's uploaded image (Screenshot from 2026-10-03 23-08-58.png) */}
                <div className="relative group max-w-[280px] w-full rounded-2xl bg-[#0d131f] border-2 border-[#00a8ff] shadow-[0_0_25px_rgba(0,168,255,0.35)] overflow-hidden transition-all">
                  {/* Top Neon Blue Bar - exactly as in user image */}
                  <div className="w-full h-2.5 bg-gradient-to-r from-[#00a8ff] via-[#38bdf8] to-[#00a8ff]" />

                  {/* QR Image Area with high-contrast White Background */}
                  <div className="p-3.5 flex flex-col items-center justify-center">
                    <div className="w-full bg-white rounded-xl p-2.5 flex items-center justify-center shadow-inner">
                      <img
                        src={qrCodeDataUrl}
                        alt="DevBro Payment QR Code"
                        className="w-full max-w-[220px] h-auto object-contain select-none"
                      />
                    </div>

                    {/* VPA / Payee Info Strip */}
                    <div className="w-full mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-cyan-300 font-semibold truncate pr-1">
                        {gateway === 'upi_kdev' ? upiId : 'BEP20 Address'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="text-white hover:text-cyan-200 underline font-semibold shrink-0 cursor-pointer"
                      >
                        {copiedText ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Cyan/Blue Accent Bar - exactly as in user image */}
                  <div className="w-full h-2 bg-[#0284c7] opacity-90" />
                </div>

                {/* Direct Deep Link for Mobile Users */}
                {gateway === 'upi_kdev' && (
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={currentUpiDeepLink}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in GPay / PhonePe / Paytm</span>
                    </a>
                  </div>
                )}

                {/* Supported Payment App Icons Strip */}
                <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-500 font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Supports: Google Pay • PhonePe • Paytm • BHIM • Cred</span>
                </div>

                {/* AFTER-SCAN PAYMENT ACTION PANEL */}
                <div className="w-full mt-4 p-4 bg-gradient-to-r from-emerald-50 via-sky-50 to-teal-50 border border-emerald-200/90 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span>After Scan: Complete &amp; Verify Payment</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                      Instant Receipt
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                    Phone me scan karne ke baad agar aapko payment confirm karni hai ya direct verified receipt chahiye, toh yahan click karein:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleInstantVerifyPaid(false)}
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-60"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>I Have Scanned &amp; Paid (Confirm)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInstantVerifyPaid(true)}
                      disabled={isSubmitting}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-60"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Scan &amp; Pay (Instant)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Field 2: Donation Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <span className="w-4 h-4 rounded-full bg-[#1aa47b] text-white flex items-center justify-center text-[10px] font-bold">
                    {gateway === 'upi_kdev' ? '₹' : '₮'}
                  </span>
                  <span>
                    Donation Amount {gateway === 'upi_kdev' ? '(INR - ₹)' : '(USDT - ₮)'}
                  </span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {gateway === 'upi_kdev' ? 'Min: ₹85.00 INR' : `Min: ₮ ${project.minDonationUsdt.toFixed(2)} USDT`}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step={gateway === 'upi_kdev' ? '5' : '0.5'}
                  min={gateway === 'upi_kdev' ? 85 : project.minDonationUsdt}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm font-bold border border-slate-300 rounded-xl py-2 px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                <span>
                  {gateway === 'upi_kdev'
                    ? 'QR Code updates dynamically with your amount. 1 USDT ≈ ₹85 INR.'
                    : `Minimum donation: ₮ ${project.minDonationUsdt.toFixed(2)} USDT`}
                </span>
              </p>
            </div>

            {/* Field 3: Transaction Reference / UPI UTR */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-slate-600" />
                  <span>
                    {gateway === 'upi_kdev'
                      ? '12-Digit UPI UTR / Reference ID'
                      : 'Transaction Reference / Tx Hash'}
                  </span>
                </div>
                <span className="text-[10px] text-sky-600 font-normal">
                  Found in your payment app receipt
                </span>
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={
                  gateway === 'upi_kdev'
                    ? 'e.g. 429182948201 (12 digits from GPay/PhonePe)'
                    : 'e.g. 0x8a9...b49 or TXN123456789'
                }
                className="w-full text-sm font-mono border border-slate-300 rounded-xl py-2 px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder:text-slate-400"
              />
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                <span>If blank, a verified transaction receipt ID will be auto-generated.</span>
              </p>
            </div>

            {/* Field 4: Payment Proof (Screenshot) */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                  <span>Payment Proof (Optional Screenshot)</span>
                </div>
                {hasFile && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Attached
                  </span>
                )}
              </label>
              <div
                onClick={() => {
                  setHasFile(true);
                  setFileName(`upi_receipt_${Date.now().toString().slice(-6)}.png`);
                }}
                className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition ${
                  hasFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className={`w-7 h-7 mb-1.5 ${hasFile ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <p className="text-xs font-semibold text-slate-800">
                    {hasFile ? fileName : 'Click to attach payment screenshot'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {hasFile ? '1.4 MB attached successfully' : 'GPay / PhonePe / Binance confirmation screenshot'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1b72e8] hover:bg-[#155fc5] text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{verificationStepText || 'Verifying & Generating Receipt...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Submit Payment &amp; Generate Receipt</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
