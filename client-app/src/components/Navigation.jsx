import React from 'react';
import { Database, Users, HeartHandshake, Bell, FileText } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'inventory', label: 'Inventory Dashboard', icon: Database, service: 'Blood Inventory Service' },
    { id: 'donors', label: 'Donor Directory', icon: Users, service: 'Donor Service' },
    { id: 'requests', label: 'Requests & Matching', icon: HeartHandshake, service: 'Request & Matching Service' },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell, service: 'Notification Service' },
    { id: 'docs', label: 'Microservices & API Docs', icon: FileText, service: 'API Gateway Hub' },
  ];

  return (
    <nav className="nav-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={18} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span>{tab.label}</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.7, fontWeight: 400 }}>
                {tab.service}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
