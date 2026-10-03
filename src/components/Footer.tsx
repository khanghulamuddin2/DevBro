import React from 'react';
import { Send, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Footer Logo */}
        <div className="flex items-center space-x-2 text-xl font-bold tracking-tight mb-4">
          <div className="w-7 h-7 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
            &lt;/&gt;
          </div>
          <span className="text-[#092244] text-xl font-black">
            Dev<span className="text-[#0284c7]">Bro</span>
          </span>
        </div>

        {/* Platform Statement */}
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mb-6">
          DevBro is a developer-run platform for sharing original source code projects. Every
          project is built and maintained by the site owner and made available for learning,
          reference, and development use. Support the creator with a donation, or download select
          open-source projects for free.
        </p>

        {/* Social Channels */}
        <div className="flex items-center space-x-3 mb-6">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram Support"
            className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:opacity-90 transition shadow-xs"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube Channel"
            className="w-8 h-8 rounded-full bg-[#ff0000] flex items-center justify-center text-white hover:opacity-90 transition shadow-xs"
          >
            <Youtube className="w-4 h-4" />
          </a>
        </div>

        {/* Copyright Notice */}
        <span className="text-xs text-slate-400">
          © 2026 DevBro. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
