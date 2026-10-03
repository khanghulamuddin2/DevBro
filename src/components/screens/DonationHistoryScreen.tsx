import React from 'react';
import { Transaction, ScreenType } from '../../types';
import { Clock, Download, Key, ChevronRight, Video, ArrowLeft, Heart, FileText } from 'lucide-react';

interface DonationHistoryScreenProps {
  transactions: Transaction[];
  onNavigate: (screen: ScreenType) => void;
  onOpenPasswordModal: (password: string, title: string) => void;
  onOpenPromoModal: () => void;
  onDownloadProject: (tx: Transaction) => void;
  onViewReceipt?: (tx: Transaction) => void;
}

export const DonationHistoryScreen: React.FC<DonationHistoryScreenProps> = ({
  transactions,
  onNavigate,
  onOpenPasswordModal,
  onOpenPromoModal,
  onDownloadProject,
  onViewReceipt,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title and Back Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Donation history
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View all your donations, transaction statuses, and download approved projects.
          </p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-2xs transition cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Promo Banner Card */}
      <div className="p-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xs">
        <div className="bg-white rounded-[0.95rem] p-5 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#7c3aed] text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-purple-700 flex items-center gap-1.5">
                <span>🚀</span> Launch Your Website Today - 75% OFF!
              </h2>
              <p className="text-xs lg:text-sm text-slate-500 mt-0.5 max-w-xl leading-relaxed">
                Premium hosting with blazing-fast speeds, 99.9% uptime, and free domain. Perfect for
                your projects!
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPromoModal}
            className="shrink-0 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-xs lg:text-sm px-6 py-2.5 rounded-full shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
          >
            <span>Claim Offer</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Donations Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No donations recorded yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Donate to any project or unlock via video tasks to see them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6 font-semibold">PROJECT</th>
                  <th className="py-4 px-4 font-semibold">GATEWAY</th>
                  <th className="py-4 px-4 font-semibold">AMOUNT</th>
                  <th className="py-4 px-4 font-semibold">STATUS</th>
                  <th className="py-4 px-4 font-semibold">SUBMITTED</th>
                  <th className="py-4 px-6 font-semibold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-5 px-6 font-bold text-slate-900 leading-snug max-w-[240px]">
                      {tx.projectTitle}
                    </td>

                    <td className="py-5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1.5 bg-cyan-100/70 text-slate-700 font-semibold px-3 py-1.5 rounded-full text-[11px]">
                        <Video className="w-3.5 h-3.5 text-red-600" />
                        <span>{tx.gateway}</span>
                      </span>
                    </td>

                    <td className="py-5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 bg-emerald-100/60 text-emerald-700 font-semibold px-2.5 py-1 rounded-full text-[11px]">
                        <span>🎁</span>
                        <span>{tx.amount}</span>
                      </span>
                    </td>

                    <td className="py-5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block font-semibold px-3 py-1 rounded-full text-[11px] ${
                          tx.status === 'Approved'
                            ? 'bg-emerald-100/70 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    <td className="py-5 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {tx.submittedDate}
                    </td>

                    <td className="py-5 px-6 whitespace-nowrap">
                      <div className="flex flex-col space-y-2 w-32">
                        <button
                          onClick={() => onDownloadProject(tx)}
                          className="w-full flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-3 rounded-lg shadow-2xs transition text-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() =>
                            onOpenPasswordModal(
                              tx.password || 'DEVBRO_SECURE_PASS',
                              tx.projectTitle
                            )
                          }
                          className="w-full flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded-lg border border-slate-200/60 transition text-xs cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Password</span>
                        </button>
                        {onViewReceipt && (
                          <button
                            onClick={() => onViewReceipt(tx)}
                            className="w-full flex items-center justify-center space-x-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium py-1.5 px-3 rounded-lg border border-sky-200 transition text-xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-sky-600" />
                            <span>Receipt</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
