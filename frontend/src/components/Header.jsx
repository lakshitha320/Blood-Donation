import React from 'react';
import { Droplet, ShieldCheck, Settings, User, Bell, Server } from 'lucide-react';

export default function Header({ 
  gatewayConfig, 
  onOpenSettings, 
  onOpenAuth, 
  user, 
  unreadCount, 
  onNavigateToNotifications 
}) {
  return (
    <header className="header-bar">
      <div className="brand-title">
        <div className="brand-logo">
          <Droplet size={24} color="#ffffff" fill="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="brand-name">VITA BLOOD</span>
            <span className="brand-tag">API Gateway Connected</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Unified Microservices Blood Donation Ecosystem
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div className="gateway-status-pill" onClick={onOpenSettings} style={{ cursor: 'pointer' }} title="Click to configure API Gateway">
          <span className="status-dot"></span>
          <Server size={15} />
          <span>Gateway: {gatewayConfig.gatewayUrl}</span>
        </div>

        <button 
          className="btn-icon" 
          onClick={onNavigateToNotifications}
          style={{ position: 'relative' }}
          title="Notifications Panel"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--color-accent-rose)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-surface)'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        <button className="btn-icon" onClick={onOpenSettings} title="API Gateway & Security Settings">
          <Settings size={18} />
        </button>

        {user ? (
          <button className="btn btn-secondary" onClick={onOpenAuth}>
            <ShieldCheck size={16} color="var(--color-accent-emerald)" />
            <span>{user.email}</span>
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onOpenAuth}>
            <User size={16} />
            <span>Login / OAuth 2.0</span>
          </button>
        )}
      </div>
    </header>
  );
}
