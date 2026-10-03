/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, Project, Transaction, DownloadAudit, UserProfile, UserAccount, PaymentReceipt, AdminSettings } from './types';
import {
  INITIAL_USER,
  INITIAL_ACCOUNTS,
  PROJECTS,
  INITIAL_TRANSACTIONS,
  INITIAL_DOWNLOAD_AUDITS,
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { WatchToUnlockScreen } from './components/screens/WatchToUnlockScreen';
import { WishlistScreen } from './components/screens/WishlistScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ProjectsScreen } from './components/screens/ProjectsScreen';
import { DonationHistoryScreen } from './components/screens/DonationHistoryScreen';
import { DownloadHistoryScreen } from './components/screens/DownloadHistoryScreen';
import { DonateModal } from './components/modals/DonateModal';
import { PasswordModal } from './components/modals/PasswordModal';
import { ProjectDetailsModal } from './components/modals/ProjectDetailsModal';
import { PromoOfferModal } from './components/modals/PromoOfferModal';
import { AuthModal } from './components/modals/AuthModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { UploadProjectModal } from './components/modals/UploadProjectModal';
import { AdminPermissionsModal } from './components/modals/AdminPermissionsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Navigation: Screen 1: Dashboard (Initial Screen), Screen 2: Watch to Unlock, Screen 3: Wishlist, Screen 4: Profile
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');

  // Application State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [downloadAudits, setDownloadAudits] = useState<DownloadAudit[]>(INITIAL_DOWNLOAD_AUDITS);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selected project for Watch to Unlock & Details & Donations
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);

  // Modal States
  const [donateModalProject, setDonateModalProject] = useState<Project | null>(null);
  const [detailsModalProject, setDetailsModalProject] = useState<Project | null>(null);
  const [passwordModalData, setPasswordModalData] = useState<{
    isOpen: boolean;
    password: string;
    title: string;
  }>({
    isOpen: false,
    password: '',
    title: '',
  });
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Admin Policy Settings
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem('devbro_admin_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      uploadPolicy: 'admin_only',
      visibilityPolicy: 'public',
    };
  });

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Registered User Accounts (persisted for verification)
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('devbro_accounts') || localStorage.getItem('devgive_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_ACCOUNTS;
  });

  // Role & Permissions Determination
  const isAdmin = isLoggedIn && (user.role === 'admin' || user.email.toLowerCase() === 'khanghulamuddin2@gmail.com');
  const canUploadProject =
    isLoggedIn &&
    (isAdmin ||
      adminSettings.uploadPolicy === 'all_users' ||
      (adminSettings.uploadPolicy === 'verified_only' && !!user.canUploadProject));

  // Admin Setting Handlers
  const handleUpdateAdminSettings = (newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
    try {
      localStorage.setItem('devbro_admin_settings', JSON.stringify(newSettings));
    } catch (e) {}
  };

  const handleUpdateUserPermissions = (email: string, canUpload: boolean, role: 'admin' | 'user') => {
    setRegisteredUsers((prev) => {
      const updated = prev.map((u) =>
        u.email.toLowerCase() === email.toLowerCase()
          ? { ...u, canUploadProject: canUpload, role }
          : u
      );
      try {
        localStorage.setItem('devbro_accounts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (user.email.toLowerCase() === email.toLowerCase()) {
      setUser((prev) => ({ ...prev, role, canUploadProject: canUpload }));
    }
  };

  const handleSwitchSimulatedRole = (role: 'admin' | 'user') => {
    setUser((prev) => ({
      ...prev,
      role,
      canUploadProject: role === 'admin',
    }));
  };

  // Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('projects');
    setMobileMenuOpen(false);
    addToast('Logged out successfully. Showing open-source projects.', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Register New Account Handler
  const handleRegisterUser = (newAccount: UserAccount) => {
    const isPrimaryAdmin = newAccount.email.toLowerCase() === 'khanghulamuddin2@gmail.com';
    const accountWithRole: UserAccount = {
      ...newAccount,
      role: newAccount.role || (isPrimaryAdmin ? 'admin' : 'user'),
      canUploadProject: newAccount.canUploadProject ?? isPrimaryAdmin,
    };
    setRegisteredUsers((prev) => {
      const updated = [accountWithRole, ...prev.filter((u) => u.email.toLowerCase() !== accountWithRole.email.toLowerCase())];
      try {
        localStorage.setItem('devbro_accounts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Update Password Handler (verifies current password & saves new password)
  const handleUpdatePassword = (currentPass: string, newPass: string): { success: boolean; message: string } => {
    const cleanEmail = user.email.toLowerCase().trim();
    const account = registeredUsers.find((u) => u.email.toLowerCase().trim() === cleanEmail);

    if (account && account.password !== currentPass) {
      return { success: false, message: 'Current password does not match our records.' };
    }

    setRegisteredUsers((prev) => {
      const updated = prev.map((u) =>
        u.email.toLowerCase().trim() === cleanEmail ? { ...u, password: newPass } : u
      );
      try {
        localStorage.setItem('devbro_accounts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    return { success: true, message: 'Password updated successfully!' };
  };

  // Auth Success Handler
  const handleAuthSuccess = (username: string, email: string) => {
    setIsLoggedIn(true);
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const role = existing?.role || (email.toLowerCase() === 'khanghulamuddin2@gmail.com' ? 'admin' : 'user');
    const canUpload = existing?.canUploadProject ?? (role === 'admin');
    setUser({ username, email, role, canUploadProject: canUpload });
    setCurrentScreen('dashboard');
    addToast(`Welcome back, ${username}! Signed in as ${role === 'admin' ? 'Admin 👑' : 'Developer'}.`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Protected navigation handler
  const handleNavigate = (screen: ScreenType) => {
    if (!isLoggedIn && (screen === 'dashboard' || screen === 'profile' || screen === 'wishlist' || screen === 'donations' || screen === 'downloads')) {
      // If user is logged out, allow them to view or prompt to sign in
      setAuthModalMode('signin');
      setAuthModalOpen(true);
      addToast('Please sign in or create an account to access this section.', 'info');
      return;
    }

    setCurrentScreen(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist toggle
  const handleToggleWishlist = (id: string) => {
    if (!isLoggedIn) {
      setAuthModalMode('signin');
      setAuthModalOpen(true);
      addToast('Please sign in to save projects to your wishlist.', 'info');
      return;
    }

    const exists = wishlistIds.includes(id);
    if (exists) {
      setWishlistIds((prev) => prev.filter((item) => item !== id));
      addToast('Removed from your wishlist', 'info');
    } else {
      setWishlistIds((prev) => [...prev, id]);
      addToast('Added to your wishlist! View it in My Wishlist', 'success');
    }
  };

  // Unlock completion handler
  const handleUnlockCompleted = (proj: Project) => {
    addToast(`Successfully unlocked free download for "${proj.title}"!`, 'success');

    // Add to transactions as Approved Free download
    const newTx: Transaction = {
      id: `tx-free-${Date.now()}`,
      projectId: proj.id,
      projectTitle: proj.title,
      gateway: 'YouTube Tasks',
      amount: 'Free',
      status: 'Approved',
      submittedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      downloadCount: 1,
      lastDownload: new Date().toISOString().replace('T', ' ').substring(0, 19),
      password: proj.password || 'DEVBRO_FREE_KEY_2026',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Add to download audit history
    const newAudit: DownloadAudit = {
      id: `dl-${Date.now()}`,
      projectId: proj.id,
      projectTitle: proj.title,
      downloadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '139.5.50.170',
    };
    setDownloadAudits((prev) => [newAudit, ...prev]);

    // Increase download counter on project
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, downloads: p.downloads + 1 } : p))
    );
  };

  // Donation submission handler
  const handleSubmitDonation = (
    proj: Project,
    gateway: string,
    amount: string,
    reference: string
  ) => {
    const isUpi = gateway.includes('UPI');
    const newTx: Transaction = {
      id: `tx-don-${Date.now()}`,
      projectId: proj.id,
      projectTitle: proj.title,
      gateway,
      amount,
      status: 'Approved',
      submittedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      downloadCount: 1,
      lastDownload: new Date().toISOString().replace('T', ' ').substring(0, 19),
      password: proj.password || 'DEVBRO_DONATION_PASS_2026',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setDonateModalProject(null);

    // Also record download audit so project is accessible immediately
    const newAudit: DownloadAudit = {
      id: `dl-${Date.now()}`,
      projectId: proj.id,
      projectTitle: proj.title,
      downloadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '139.5.50.170',
    };
    setDownloadAudits((prev) => [newAudit, ...prev]);

    // Generate normal form receipt
    const newReceipt: PaymentReceipt = {
      receiptId: `REC-${Date.now().toString().slice(-6)}`,
      transactionId: newTx.id,
      projectId: proj.id,
      projectTitle: proj.title,
      payerName: user.username || 'Khanghulamuddin',
      payerEmail: user.email || 'khanghulamuddin2@gmail.com',
      amount,
      currency: isUpi ? 'INR' : 'USDT',
      gateway,
      referenceId: reference,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed',
      projectPassword: proj.password || 'DEVBRO_REALESTATE_2026',
      platformFee: '₹0.00 (Zero Fee)',
      totalPaid: amount,
      beneficiaryUpiOrAddress: isUpi ? 'kdev.payment@upi' : '0xbf5255543c101a4b4d2c66e6b3f3425afcbebe3f',
    };

    setActiveReceipt(newReceipt);
    setReceiptModalOpen(true);

    if (!isLoggedIn) {
      setIsLoggedIn(true);
    }

    addToast(`Payment received! Official receipt generated for ${proj.title}`, 'success');

    // Email notification simulation confirming receipt generation
    setTimeout(() => {
      const recipientEmail = user.email || 'khanghulamuddin2@gmail.com';
      addToast(
        `✉️ Email notification sent to ${recipientEmail}: Verified Receipt #${newReceipt.receiptId} & download unlock code confirmed!`,
        'info'
      );
    }, 700);
  };

  // Re-download handler
  const handleReDownload = (title: string) => {
    addToast(`Re-downloading ${title}.zip...`, 'info');
    const newAudit: DownloadAudit = {
      id: `dl-${Date.now()}`,
      projectId: 'whatsapp-saas',
      projectTitle: title,
      downloadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '139.5.50.170',
    };
    setDownloadAudits((prev) => [newAudit, ...prev]);
  };

  // Upload project submission handler
  const handleUploadProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    addToast(`🎉 Project "${newProject.title}" published successfully to DevBro!`, 'success');
  };

  const totalDownloads = transactions.reduce((acc, t) => acc + (t.downloadCount || 1), 0);

  // When logged in and on dashboard/profile/wishlist/donations/downloads, show dashboard sidebar.
  // When logged out or viewing public projects page, don't show the sidebar for the full clean marketplace view.
  const showSidebar = isLoggedIn && currentScreen !== 'projects';

  return (
    <div className="bg-[#f5f8fd] font-sans text-slate-800 flex flex-col min-h-screen">
      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => {
          if (currentScreen !== 'projects') {
            setCurrentScreen('projects');
          }
        }}
        wishlistCount={wishlistIds.length}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenUploadModal={() => setUploadModalOpen(true)}
        canUploadProject={canUploadProject}
        isAdmin={isAdmin}
        onOpenAdminPermissions={() => setAdminModalOpen(true)}
      />

      {/* Mobile Header Menu Button */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-1.5 rounded-lg border border-slate-200 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileMenuOpen ? 'Close Menu' : 'Navigation Menu'}</span>
        </button>

        {isLoggedIn ? (
          <span className="text-xs text-slate-500 font-medium">
            Logged in: <strong className="text-slate-800">{user.username}</strong>
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAuthModalMode('signin');
                setAuthModalOpen(true);
              }}
              className="px-3 py-1 text-xs font-semibold text-white bg-[#2e1065] rounded-full"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              }}
              className="px-3 py-1 text-xs font-semibold text-white bg-[#0284c7] rounded-full"
            >
              Create account
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 z-30 shadow-md">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => handleNavigate('dashboard')}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                  currentScreen === 'dashboard' ? 'bg-sky-50 text-sky-600' : 'text-slate-700'
                }`}
              >
                1. Dashboard
              </button>
              <button
                onClick={() => handleNavigate('watch-to-unlock')}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                  currentScreen === 'watch-to-unlock' ? 'bg-sky-50 text-sky-600' : 'text-slate-700'
                }`}
              >
                2. Watch to Unlock Free Download
              </button>
              <button
                onClick={() => handleNavigate('wishlist')}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                  currentScreen === 'wishlist' ? 'bg-sky-50 text-sky-600' : 'text-slate-700'
                }`}
              >
                3. My Wishlist ({wishlistIds.length})
              </button>
              <button
                onClick={() => handleNavigate('profile')}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                  currentScreen === 'profile' ? 'bg-sky-50 text-sky-600' : 'text-slate-700'
                }`}
              >
                4. Profile
              </button>
              <button
                onClick={() => handleNavigate('projects')}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Explore Projects
              </button>

              {/* Upload Project - Only if user has upload permission */}
              {canUploadProject && (
                <button
                  onClick={() => {
                    setUploadModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg flex items-center justify-between"
                >
                  <span>+ Upload Project</span>
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-800 font-bold px-2 py-0.5 rounded-full">New</span>
                </button>
              )}

              {/* Admin Rights Control - Only visible to Admins */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setAdminModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 rounded-lg flex items-center justify-between"
                >
                  <span>👑 Admin Rights &amp; Permissions</span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full">Control</span>
                </button>
              )}

              <hr className="border-slate-100 my-2" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setCurrentScreen('projects');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-sky-600"
              >
                Explore Projects
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('signin');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Sign in to Dashboard
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Create new account
              </button>
            </>
          )}
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Left Sidebar (Displayed when logged in on management screens) */}
        {showSidebar && (
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            wishlistCount={wishlistIds.length}
            onLogout={handleLogout}
            onOpenUploadModal={() => setUploadModalOpen(true)}
            canUploadProject={canUploadProject}
            isAdmin={isAdmin}
            onOpenAdminPermissions={() => setAdminModalOpen(true)}
          />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 min-w-0 ${
            showSidebar ? 'p-5 sm:p-7 lg:p-10' : 'max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8'
          }`}
        >
          {/* Screen 1: Dashboard */}
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              username={user.username}
              onNavigate={handleNavigate}
              transactions={transactions}
              downloadsCount={totalDownloads}
              wishlistCount={wishlistIds.length}
              onSelectProjectForUnlock={setSelectedProject}
              featuredProjects={projects}
              onOpenDonateModal={(proj) => setDonateModalProject(proj)}
              onOpenPasswordModal={(password, title) =>
                setPasswordModalData({ isOpen: true, password, title })
              }
              onOpenUploadModal={() => setUploadModalOpen(true)}
              canUploadProject={canUploadProject}
              isAdmin={isAdmin}
              onOpenAdminPermissions={() => setAdminModalOpen(true)}
            />
          )}

          {/* Screen 2: Watch to Unlock Free Download */}
          {currentScreen === 'watch-to-unlock' && (
            <WatchToUnlockScreen
              project={selectedProject}
              onNavigate={handleNavigate}
              onUnlockCompleted={handleUnlockCompleted}
              onOpenPasswordModal={(password, title) =>
                setPasswordModalData({ isOpen: true, password, title })
              }
            />
          )}

          {/* Screen 3: My Wishlist */}
          {currentScreen === 'wishlist' && (
            <WishlistScreen
              wishlistIds={wishlistIds}
              allProjects={projects}
              onToggleWishlist={handleToggleWishlist}
              onNavigate={handleNavigate}
              onSelectProjectForUnlock={setSelectedProject}
              onOpenDonateModal={(proj) => setDonateModalProject(proj)}
              onOpenDetailsModal={(proj) => setDetailsModalProject(proj)}
            />
          )}

          {/* Screen 4: Profile */}
          {currentScreen === 'profile' && (
            <ProfileScreen
              user={user}
              onUpdateProfile={setUser}
              onUpdatePassword={handleUpdatePassword}
              showToast={addToast}
            />
          )}

          {/* Projects / Explore Marketplace (Matches User's Screenshot Exactly) */}
          {currentScreen === 'projects' && (
            <ProjectsScreen
              projects={projects}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onNavigate={handleNavigate}
              onSelectProjectForUnlock={(proj) => {
                setSelectedProject(proj);
                setCurrentScreen('watch-to-unlock');
              }}
              onOpenDonateModal={(proj) => setDonateModalProject(proj)}
              onOpenDetailsModal={(proj) => setDetailsModalProject(proj)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              canUploadProject={canUploadProject}
            />
          )}

          {/* Donation History */}
          {currentScreen === 'donations' && (
            <DonationHistoryScreen
              transactions={transactions}
              onNavigate={handleNavigate}
              onOpenPasswordModal={(password, title) =>
                setPasswordModalData({ isOpen: true, password, title })
              }
              onOpenPromoModal={() => setPromoModalOpen(true)}
              onDownloadProject={(tx) => handleReDownload(tx.projectTitle)}
              onViewReceipt={(tx) => {
                const isUpi = tx.gateway.includes('UPI');
                const receipt: PaymentReceipt = {
                  receiptId: `REC-${tx.id.replace(/\D/g, '').slice(-6) || '202601'}`,
                  transactionId: tx.id,
                  projectId: tx.projectId,
                  projectTitle: tx.projectTitle,
                  payerName: user.username || 'Khanghulamuddin',
                  payerEmail: user.email || 'khanghulamuddin2@gmail.com',
                  amount: tx.amount,
                  currency: isUpi ? 'INR' : 'USDT',
                  gateway: tx.gateway,
                  referenceId: tx.id,
                  date: tx.submittedDate.split(' ')[0] || new Date().toISOString().split('T')[0],
                  time: tx.submittedDate.split(' ')[1] || '12:00:00',
                  status: 'Confirmed',
                  projectPassword: tx.password,
                  platformFee: '₹0.00 (Zero Fee)',
                  totalPaid: tx.amount,
                  beneficiaryUpiOrAddress: isUpi ? 'kdev.payment@upi' : '0xbf5255543c101a4b4d2c66e6b3f3425afcbebe3f',
                };
                setActiveReceipt(receipt);
                setReceiptModalOpen(true);
              }}
            />
          )}

          {/* Download History */}
          {currentScreen === 'downloads' && (
            <DownloadHistoryScreen
              transactions={transactions}
              downloadAudits={downloadAudits}
              onNavigate={handleNavigate}
              onOpenPasswordModal={(password, title) =>
                setPasswordModalData({ isOpen: true, password, title })
              }
              onOpenPromoModal={() => setPromoModalOpen(true)}
              onReDownload={handleReDownload}
            />
          )}
        </main>
      </div>

      {/* Main Footer */}
      <Footer />

      {/* Authentication Modal (Sign in / Create account) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Global Modals */}
      <DonateModal
        project={donateModalProject}
        user={user}
        onClose={() => setDonateModalProject(null)}
        onGoToFreeUnlock={(proj) => {
          setSelectedProject(proj);
          setCurrentScreen('watch-to-unlock');
        }}
        onSubmitDonation={handleSubmitDonation}
      />

      {/* Payment Receipt Modal (Normal Form) */}
      <ReceiptModal
        receipt={activeReceipt}
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        onGoToDownloads={() => {
          setReceiptModalOpen(false);
          handleNavigate('downloads');
        }}
        showToast={addToast}
      />

      <ProjectDetailsModal
        project={detailsModalProject}
        onClose={() => setDetailsModalProject(null)}
        isWishlisted={detailsModalProject ? wishlistIds.includes(detailsModalProject.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenDonateModal={(proj) => {
          setDetailsModalProject(null);
          setDonateModalProject(proj);
        }}
        onGoToFreeUnlock={(proj) => {
          setDetailsModalProject(null);
          setSelectedProject(proj);
          setCurrentScreen('watch-to-unlock');
        }}
      />

      <PasswordModal
        isOpen={passwordModalData.isOpen}
        onClose={() => setPasswordModalData({ ...passwordModalData, isOpen: false })}
        password={passwordModalData.password}
        projectTitle={passwordModalData.title}
        showToast={addToast}
      />

      <PromoOfferModal
        isOpen={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
        showToast={addToast}
      />

      {/* Upload Project Modal */}
      <UploadProjectModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleUploadProject}
        user={user}
      />

      {/* Admin Permissions Modal */}
      <AdminPermissionsModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        currentUser={user}
        registeredUsers={registeredUsers}
        adminSettings={adminSettings}
        onUpdateAdminSettings={handleUpdateAdminSettings}
        onUpdateUserPermissions={handleUpdateUserPermissions}
        onSwitchSimulatedRole={handleSwitchSimulatedRole}
        showToast={addToast}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
