import React from 'react';
import { Transaction, DownloadAudit, ScreenType } from '../../types';
import { Clock, Download, Key, ChevronRight, ArrowLeft, Search, FileText } from 'lucide-react';

interface DownloadHistoryScreenProps {
  transactions: Transaction[];
  downloadAudits: DownloadAudit[];
  onNavigate: (screen: ScreenType) => void;
  onOpenPasswordModal: (password: string, title: string) => void;
  onOpenPromoModal: () => void;
  onReDownload: (title: string) => void;
}

export const DownloadHistoryScreen: React.FC<DownloadHistoryScreenProps> = ({
  transactions,
  downloadAudits,
  onNavigate,
  onOpenPasswordModal,
  onOpenPromoModal,
  onReDownload,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Download history
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View your past downloads and re-download files anytime.
          </p>
        </div>
        <div>
          <button
            onClick={() => onNavigate('donations')}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-full hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to donations</span>
          </button>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-600/90 bg-gradient-to-r from-purple-50 via-white to-pink-50 p-6 md:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start md:items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-[#7c3aed] flex items-center justify-center text-white shrink-0 shadow-md">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">🚀</span>
                <h3 className="text-lg md:text-xl font-extrabold text-[#6b21a8] tracking-tight">
                  Launch Your Website Today - 75% OFF!
                </h3>
              </div>
              <p className="text-sm text-slate-600 mt-1 max-w-xl font-normal leading-relaxed">
                Premium hosting with blazing-fast speeds, 99.9% uptime, and free domain. Perfect for
                your projects!
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPromoModal}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#7c3aed] hover:bg-violet-700 text-white font-semibold text-sm rounded-full transition shadow-md whitespace-nowrap shrink-0 group cursor-pointer"
          >
            <span>Claim Offer</span>
            <ChevronRight className="w-4 h-4 ml-1.5 transition transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Active Project Card Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-slate-700" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Projects ({transactions.length} downloaded)
          </h2>
        </div>

        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {tx.projectTitle}
                </h3>
                <div className="flex items-center space-x-8 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase block tracking-wider">
                      TOTAL DOWNLOADS
                    </span>
                    <span className="text-slate-800 font-bold text-sm font-mono">
                      {tx.downloadCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase block tracking-wider">
                      LAST DOWNLOAD
                    </span>
                    <span className="text-slate-700 font-medium text-sm font-mono">
                      {tx.lastDownload || tx.submittedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => onReDownload(tx.projectTitle)}
                  className="inline-flex items-center px-4 py-2 bg-[#0284c7] hover:bg-sky-600 text-white font-medium text-xs rounded-full shadow-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() =>
                    onOpenPasswordModal(
                      tx.password || 'WA_MULTI_TENANT_KEY_2026',
                      tx.projectTitle
                    )
                  }
                  className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-full shadow-2xs transition cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                  <span>View Password</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Download History Table Section */}
      <section>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-slate-500" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Full download history
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">All your download activity & audit trail</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 tracking-wider uppercase bg-slate-50/50">
                  <th className="py-3.5 px-6 font-semibold">PROJECT</th>
                  <th className="py-3.5 px-6 font-semibold">DOWNLOADED</th>
                  <th className="py-3.5 px-6 font-semibold">IP ADDRESS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {downloadAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {audit.projectTitle}
                    </td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap font-mono">
                      {audit.downloadedAt}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600 whitespace-nowrap">
                      {audit.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
