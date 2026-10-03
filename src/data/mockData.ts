import { Project, Transaction, DownloadAudit, UserProfile, UserAccount } from '../types';

export const INITIAL_USER: UserProfile = {
  username: 'Khanghulamuddin (Admin)',
  email: 'khanghulamuddin2@gmail.com',
  role: 'admin',
  canUploadProject: true,
};

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    username: 'Khanghulamuddin (Admin)',
    email: 'khanghulamuddin2@gmail.com',
    password: 'password123',
    role: 'admin',
    canUploadProject: true,
  },
  {
    username: 'Rahul Verma (Regular User)',
    email: 'rahul.developer@gmail.com',
    password: 'password123',
    role: 'user',
    canUploadProject: false,
  },
  {
    username: 'Amit Kumar (Regular User)',
    email: 'amit.coder@gmail.com',
    password: 'password123',
    role: 'user',
    canUploadProject: false,
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'real-estate-saas',
    title: 'Complete Real Estate Marketplace SaaS Script',
    category: 'SAAS',
    description:
      'Launch your multi-vendor Real Estate SaaS platform effortlessly with this complete free source code! Features 3 stunning themes, subscription plans, 20+ payment gateways, and agent commission systems.',
    bannerTitle: 'FREE! COMPLETE REAL ESTATE SaaS CODE - Multivendor Marketplace Platform',
    bannerSubtext: 'DOWNLOAD FREE SOURCE CODE',
    features: [
      { label: 'Multivendor', sub: 'System' },
      { label: '3 Stunning', sub: 'Themes' },
      { label: 'Subscription', sub: 'Plans' },
      { label: '20+ Gateways', sub: 'Payment' },
    ],
    accentColor: '#3b82f6',
    gradient: 'from-blue-900 via-sky-950 to-blue-950',
    downloads: 25,
    type: 'Source code',
    minDonationUsdt: 1.0,
    password: 'DEVBRO_REALESTATE_2026',
    youtubeVideoId: 'video_real_estate',
    youtubeChannel: 'Codetai',
    freeTasksAvailable: true,
  },
  {
    id: 'ecommerce-multitenancy',
    title: 'Multi-Tenancy eCommerce SaaS Engine – Automated Subdomains & Multi-Database Architecture',
    category: 'SAAS',
    description:
      'Launch a high-performance eCommerce website builder SaaS platform with this complete PHP script. Featuring a separate database per tenant, 07+ premium themes, and automated domain routing.',
    bannerTitle: 'FREE DOWNLOAD: ULTIMATE SaaS eCommerce PLATFORM BUILDER',
    bannerSubtext: 'DOWNLOAD NOW',
    features: [
      { label: 'MULTITENANCY', sub: 'Separate DB' },
      { label: '07+ PREMIUM', sub: 'Themes' },
      { label: '20+ GATEWAYS', sub: 'Stripe, PayPal' },
    ],
    accentColor: '#10b981',
    gradient: 'from-emerald-950 via-slate-900 to-emerald-900',
    downloads: 24,
    type: 'Source code',
    minDonationUsdt: 1.0,
    password: 'DEVBRO_ECOMMERCE_TENANT',
    youtubeChannel: 'Codetai',
    freeTasksAvailable: true,
  },
  {
    id: 'multivendor-marketplace',
    title: 'Ultimate Multi-Vendor E-Commerce & Marketplace SaaS Script',
    category: 'E-COMMERCE',
    description:
      'Launch your own online business with this ultimate multi-vendor e-commerce and marketplace SaaS script. Sell physical goods, digital assets, and software license keys with automated payouts.',
    bannerTitle: 'ULTIMATE MULTI-VENDOR MARKETPLACE SCRIPT - COMPLETE SaaS PLATFORM - FREE DOWNLOAD!',
    bannerSubtext: 'FREE DOWNLOAD: FULL CODE & DOCUMENTATION',
    features: [
      { label: 'Multi-Vendor', sub: 'Ready' },
      { label: '10+ Gateways', sub: 'Stripe, PayPal' },
      { label: 'Physical & Digital', sub: 'License keys' },
    ],
    accentColor: '#059669',
    gradient: 'from-teal-900 via-emerald-950 to-slate-950',
    downloads: 32,
    type: 'Source code',
    minDonationUsdt: 1.0,
    password: 'DEVBRO_MULTIVENDOR_PRO',
    youtubeChannel: 'Codetai',
    freeTasksAvailable: true,
  },
  {
    id: 'marketing-automation',
    title: 'All-in-One Marketing Automation SaaS: WhatsApp, Messenger, SMS & Email (Full Source Code)',
    category: 'SAAS',
    description:
      'Launch your own SaaS with this complete, self-hosted omnichannel marketing automation platform. Built with Laravel 12 and React 19, with AI-powered bots and omnichannel shared inbox.',
    bannerTitle: 'FREE SAAS SOURCE CODE! AI Omnichannel Marketing & Chatbot Platform',
    bannerSubtext: 'DOWNLOAD NOW - FREE & OPEN SOURCE',
    features: [
      { label: 'AI Chatbots', sub: 'Gemini & OpenAI' },
      { label: 'No-Code', sub: 'Automation' },
      { label: 'Omnichannel', sub: 'Unified Inbox' },
      { label: 'SMS & Email', sub: 'Bulk Campaigns' },
    ],
    accentColor: '#10b981',
    gradient: 'from-slate-900 via-zinc-900 to-emerald-950',
    downloads: 115,
    type: 'Source code',
    minDonationUsdt: 1.0,
    password: 'DEVBRO_MARKETING_OMNI',
    youtubeChannel: 'Codetai',
    freeTasksAvailable: true,
  },
  {
    id: 'crypto-trading-bot',
    title: 'Crypto Trading Bot Platform with Automated Deposits and Withdrawals',
    category: 'TRADING',
    description:
      'Launch a self-hosted crypto trading and copy-trading platform with automated bot management, multi-chain wallet integration (BTC/ETH/TRX), and real-time copy trading engine.',
    bannerTitle: 'LAUNCH YOUR OWN CRYPTO TRADING PLATFORM! FREE CODE DOWNLOAD!',
    bannerSubtext: 'DOWNLOAD NOW! GET THE COMPLETE SCRIPT!',
    features: [
      { label: 'Automated', sub: 'Trading Bots' },
      { label: 'BTC / ETH / TRX', sub: 'Multi-chain Wallets' },
      { label: 'Real-Time', sub: 'Copy Trading' },
    ],
    accentColor: '#f59e0b',
    gradient: 'from-blue-950 via-indigo-950 to-slate-950',
    downloads: 34,
    type: 'Source code',
    minDonationUsdt: 1.5,
    password: 'DEVBRO_CRYPTO_BOT_2026',
    youtubeChannel: 'Codetai',
    freeTasksAvailable: true,
  },
  {
    id: 'stock-photo-script',
    title: 'Advanced Stock Image Gallery Script with Subscription',
    category: 'SAAS',
    description:
      'Advanced Stock Image Gallery Script with Subscription System is a feature-rich, open-source platform for building high-quality stock photo, vector, and illustration marketplace websites.',
    bannerTitle: 'CREATE YOUR OWN STOCK PHOTO WEBSITE - Free & Premium Photos Script',
    bannerSubtext: 'DOWNLOAD FREE SCRIPT - START NOW',
    features: [
      { label: 'Upload & Share', sub: 'Media library' },
      { label: 'Subscriptions', sub: 'Tiered memberships' },
      { label: 'Stripe & PayPal', sub: 'Automated payouts' },
    ],
    accentColor: '#0284c7',
    gradient: 'from-sky-950 via-slate-900 to-indigo-950',
    downloads: 20,
    type: 'Source code',
    minDonationUsdt: 1.0,
    password: 'DEVBRO_STOCK_GALLERY',
    youtubeChannel: 'Codetai',
    freeTasksAvailable: true,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-whatsapp-1',
    projectId: 'marketing-automation',
    projectTitle: 'Launch Your WhatsApp Marketing SaaS Business – WhatsApp Cloud API Multi-Tenant Script',
    gateway: 'YouTube Tasks',
    amount: 'Free',
    status: 'Approved',
    submittedDate: '2026-09-02 15:01:00',
    downloadCount: 2,
    lastDownload: '2026-10-03 21:37:18',
    password: 'WA_MULTI_TENANT_KEY_2026',
  },
];

export const INITIAL_DOWNLOAD_AUDITS: DownloadAudit[] = [
  {
    id: 'dl-1',
    projectId: 'marketing-automation',
    projectTitle: 'Launch Your WhatsApp Marketing SaaS Business – WhatsApp Cloud API Multi-Tenant Script',
    downloadedAt: '2026-10-03 21:37:18',
    ipAddress: '139.5.50.170',
  },
  {
    id: 'dl-2',
    projectId: 'marketing-automation',
    projectTitle: 'Launch Your WhatsApp Marketing SaaS Business – WhatsApp Cloud API Multi-Tenant Script',
    downloadedAt: '2026-09-04 20:54:46',
    ipAddress: '103.210.146.29',
  },
];
