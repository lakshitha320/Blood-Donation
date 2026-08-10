import React, { useState, useEffect } from 'react';
import './styles/theme.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import InventoryDashboard from './components/InventoryDashboard';
import DonorManagement from './components/DonorManagement';
import RequestMatching from './components/RequestMatching';
import NotificationsPanel from './components/NotificationsPanel';
import GatewaySettingsModal from './components/GatewaySettingsModal';
import AuthModal from './components/AuthModal';

import { 
  getGatewayConfig, 
  apiInventory, 
  apiDonors, 
  apiRequests, 
  apiNotifications 
} from './services/api';
import { Shield, Server, FileText, CheckCircle, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [gatewayConfig, setGatewayConfigState] = useState(getGatewayConfig());
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Core Data States
  const [inventory, setInventory] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch initial data from microservices / API Gateway
    const loadInitialData = async () => {
      const invData = await apiInventory.getAll();
      const donorData = await apiDonors.getAll();
      const reqData = await apiRequests.getAll();
      const notifData = await apiNotifications.getAll();

      setInventory(invData);
      setDonors(donorData);
      setRequests(reqData);
      setNotifications(notifData);
    };

    loadInitialData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--color-brand-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-glow)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 2000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle size={20} color="var(--color-accent-emerald)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header 
        gatewayConfig={gatewayConfig}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        user={user}
        unreadCount={notifications.filter(n => n.type === 'EMERGENCY').length}
        onNavigateToNotifications={() => setActiveTab('notifications')}
      />

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab 1: Inventory Dashboard (Blood Inventory Service) */}
      {activeTab === 'inventory' && (
        <InventoryDashboard 
          inventory={inventory}
          setInventory={setInventory}
          onShowToast={showToast}
        />
      )}

      {/* Tab 2: Donor Management (Donor Service) */}
      {activeTab === 'donors' && (
        <DonorManagement 
          donors={donors}
          setDonors={setDonors}
          onShowToast={showToast}
        />
      )}

      {/* Tab 3: Request & Matching (Request & Matching Service) */}
      {activeTab === 'requests' && (
        <RequestMatching 
          requests={requests}
          setRequests={setRequests}
          donors={donors}
          onShowToast={showToast}
        />
      )}

      {/* Tab 4: Notifications (Notification Service) */}
      {activeTab === 'notifications' && (
        <NotificationsPanel 
          notifications={notifications}
          setNotifications={setNotifications}
          onShowToast={showToast}
        />
      )}

      {/* Tab 5: Microservices & API Docs Overview */}
      {activeTab === 'docs' && (
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div className="section-title" style={{ marginBottom: '1.5rem' }}>
            <FileText size={24} color="var(--color-brand-primary)" />
            <span>Microservices Architecture Specification</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>1. User & Auth Service</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Assigned:</strong> Gateway Lead (Student 1)</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> `/auth/register`, `/auth/login`, `/auth/profile`</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Handles OAuth 2.0, API Gateway integration, rate limiting, and token issuance.</p>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>2. Donor Service</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Assigned:</strong> Member (Student 2)</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> `/donors`, `/donors/{id}`, `/donors/history`</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Manages donor records, donation history, and eligibility checks with API Key security.</p>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>3. Blood Inventory Service</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Assigned:</strong> Member (Student 3)</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> `/inventory`, `/inventory/{bloodType}`, `/inventory/update`</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Tracks available blood units by type, stock levels, and transfusion updates.</p>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>4. Request & Matching Service</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Assigned:</strong> Member (Student 4)</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> `/requests`, `/requests/{id}`, `/requests/match`</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Handles recipient requests, matching donors to recipients based on blood type & location.</p>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>5. Notification Service</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Assigned:</strong> Member (Student 5)</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Endpoints:</strong> `/notify/email`, `/notify/sms`, `/notify/alerts`</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Sends urgent alerts to donors and hospitals. Enforces API Key authentication.</p>
            </div>
          </div>
        </div>
      )}

      {/* Gateway Settings Modal */}
      {showSettingsModal && (
        <GatewaySettingsModal 
          gatewayConfig={gatewayConfig}
          setGatewayConfigState={setGatewayConfigState}
          onClose={() => setShowSettingsModal(false)}
          onShowToast={showToast}
        />
      )}

      {/* User Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          user={user}
          setUser={setUser}
          onClose={() => setShowAuthModal(false)}
          onShowToast={showToast}
        />
      )}

      <footer className="app-footer">
        <p>VITA BLOOD DONATION SYSTEM • Microservices Architecture Client Frontend</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.3rem' }}>Connected via Spring Cloud API Gateway (OAuth 2.0 & API Key Enforced)</p>
      </footer>
    </div>
  );
}
