import React, { useState } from 'react';
import { X, Rocket, Copy, Check, ExternalLink } from 'lucide-react';

interface PromoOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'info') => void;
}

export const PromoOfferModal: React.FC<PromoOfferModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [copied, setCopied] = useState(false);
  const COUPON_CODE = 'DEVBRO75';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    setCopied(true);
    showToast('Hosting voucher copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Exclusive Partner Offer</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-5 space-y-4">
          <div className="text-center py-2">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full uppercase tracking-wider">
              75% Off Cloud Hosting
            </span>
            <h4 className="text-xl font-black text-slate-900 mt-2.5">
              Launch Your Web Project Fast
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Get NVMe SSD cloud VPS hosting with free SSL, automated Git deployments, and unlimited
              bandwidth.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                PROMO CODE
              </span>
              <code className="font-mono text-base font-black text-purple-700">{COUPON_CODE}</code>
            </div>
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              handleCopy();
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Apply Discount &amp; Claim Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
