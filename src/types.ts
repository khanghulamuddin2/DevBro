export type ScreenType = 
  | 'dashboard'
  | 'watch-to-unlock'
  | 'wishlist'
  | 'profile'
  | 'projects'
  | 'donations'
  | 'downloads';

export interface Project {
  id: string;
  title: string;
  category: 'SAAS' | 'E-COMMERCE' | 'TRADING' | string;
  description: string;
  bannerTitle: string;
  bannerSubtext?: string;
  features: { label: string; sub: string }[];
  accentColor: string;
  gradient: string;
  downloads: number;
  type: string;
  minDonationUsdt: number;
  password?: string;
  youtubeVideoId?: string;
  youtubeChannel?: string;
  freeTasksAvailable: boolean;
  sourceCodeUrl?: string;
  demoUrl?: string;
  author?: string;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  projectId: string;
  projectTitle: string;
  gateway: string;
  amount: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  submittedDate: string;
  downloadCount: number;
  lastDownload?: string;
  password?: string;
}

export interface DownloadAudit {
  id: string;
  projectId: string;
  projectTitle: string;
  downloadedAt: string;
  ipAddress: string;
}

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  role?: UserRole;
  canUploadProject?: boolean;
}

export interface UserAccount {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  canUploadProject?: boolean;
}

export interface AdminSettings {
  uploadPolicy: 'admin_only' | 'verified_only' | 'all_users';
  visibilityPolicy: 'public' | 'registered_only';
}

export interface PaymentReceipt {
  receiptId: string;
  transactionId: string;
  projectId: string;
  projectTitle: string;
  payerName: string;
  payerEmail: string;
  amount: string;
  currency: string;
  gateway: string;
  referenceId: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Verified' | 'Pending Review';
  projectPassword?: string;
  platformFee: string;
  totalPaid: string;
  beneficiaryUpiOrAddress?: string;
}
