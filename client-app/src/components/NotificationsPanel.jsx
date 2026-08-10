import React, { useState } from 'react';
import { Bell, Send, AlertTriangle, CheckCircle, Smartphone, Mail, ShieldAlert } from 'lucide-react';
import { apiNotifications } from '../services/api';

export default function NotificationsPanel({ notifications, setNotifications, onShowToast }) {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const [smsForm, setSmsForm] = useState({
    recipient: 'O- Donors in Western Province',
    phone: '+94 77 123 4567',
    title: 'Urgency O- Blood Needed',
    message: 'Urgent need of O- blood at National Hospital Colombo. Please contact hospital or respond if available.',
  });

  const handleSendBroadcast = async (e) => {
    e.preventDefault();

    await apiNotifications.sendSms(smsForm);

    const newNotif = {
      id: `NOTIF-${Math.floor(10 + Math.random() * 90)}`,
      type: 'EMERGENCY',
      title: smsForm.title,
      message: smsForm.message,
      recipient: smsForm.recipient,
      time: 'Just now',
      status: 'SENT',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setShowBroadcastModal(false);
    onShowToast(`[Notification Service] Dispatched SMS Alert via API /notify/sms to ${smsForm.recipient}`);
  };

  const filteredNotifs = selectedFilter === 'ALL' 
    ? notifications 
    : notifications.filter(n => n.type === selectedFilter);

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div className="section-title">
          <Bell size={22} color="var(--color-brand-primary)" />
          <span>Notification & Emergency Alert Dispatcher</span>
        </div>

        <button className="btn btn-primary" onClick={() => setShowBroadcastModal(true)}>
          <Send size={16} />
          <span>Dispatch Emergency SMS Alert</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['ALL', 'EMERGENCY', 'MATCH', 'SYSTEM'].map((type) => (
          <button
            key={type}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.8rem',
              borderColor: selectedFilter === type ? 'var(--color-brand-primary)' : 'var(--border-color)',
              background: selectedFilter === type ? 'rgba(230, 57, 70, 0.15)' : 'var(--bg-surface-elevated)',
              color: selectedFilter === type ? 'var(--color-brand-primary)' : 'var(--text-muted)'
            }}
            onClick={() => setSelectedFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div>
        {filteredNotifs.map((n) => (
          <div key={n.id} className={`notif-card ${n.type.toLowerCase()}`}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.04)' }}>
              {n.type === 'EMERGENCY' && <AlertTriangle size={22} color="var(--color-accent-rose)" />}
              {n.type === 'MATCH' && <CheckCircle size={22} color="var(--color-accent-emerald)" />}
              {n.type === 'SYSTEM' && <Smartphone size={22} color="var(--color-accent-blue)" />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{n.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {n.message}
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <span>Target: {n.recipient}</span>
                <span>•</span>
                <span>Status: <strong style={{ color: 'var(--color-accent-emerald)' }}>{n.status}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast SMS Modal */}
      {showBroadcastModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <Send size={20} color="var(--color-brand-primary)" />
                <span>Emergency Broadcast - Notification Service</span>
              </h3>
              <button 
                onClick={() => setShowBroadcastModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast}>
              <div className="form-group">
                <label className="form-label">Alert Target / Group</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={smsForm.recipient}
                  onChange={(e) => setSmsForm({ ...smsForm, recipient: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Phone Number (/notify/sms)</label>
                <input 
                  type="tel" 
                  className="form-input"
                  value={smsForm.phone}
                  onChange={(e) => setSmsForm({ ...smsForm, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alert Title</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={smsForm.title}
                  onChange={(e) => setSmsForm({ ...smsForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alert Message Body</label>
                <textarea 
                  className="form-textarea"
                  rows="3"
                  value={smsForm.message}
                  onChange={(e) => setSmsForm({ ...smsForm, message: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBroadcastModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Dispatch SMS via Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
