import React, { useState } from 'react';
import { Settings, ExternalLink, ShieldCheck, Key, Server } from 'lucide-react';
import { setGatewayConfig } from '../services/api';

export default function GatewaySettingsModal({ gatewayConfig, setGatewayConfigState, onClose, onShowToast }) {
  const [gatewayUrl, setGatewayUrl] = useState(gatewayConfig.gatewayUrl);
  const [apiKey, setApiKey] = useState(gatewayConfig.apiKey);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { gatewayUrl, apiKey };
    setGatewayConfig(updated);
    setGatewayConfigState((prev) => ({ ...prev, ...updated }));
    onShowToast(`API Gateway URL updated to ${gatewayUrl}`);
    onClose();
  };

  const microserviceDocs = [
    { name: 'User & Auth Service (Gateway Lead)', port: 8080, path: '/swagger-ui.html', role: 'Student 1' },
    { name: 'Donor Service', port: 8081, path: '/swagger-ui.html', role: 'Student 2' },
    { name: 'Blood Inventory Service', port: 8082, path: '/swagger-ui.html', role: 'Student 3' },
    { name: 'Request & Matching Service', port: 8083, path: '/swagger-ui.html', role: 'Student 4' },
    { name: 'Notification Service', port: 8084, path: '/swagger-ui.html', role: 'Student 5' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Settings size={20} color="var(--color-brand-primary)" />
            <span>API Gateway & Microservices Infrastructure</span>
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">
              <Server size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
              API Gateway URL (OAuth 2.0 Entry Point)
            </label>
            <input 
              type="url" 
              className="form-input"
              value={gatewayUrl}
              onChange={(e) => setGatewayUrl(e.target.value)}
              placeholder="http://localhost:8080"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Key size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
              Microservices API Key (`X-API-KEY` header)
            </label>
            <input 
              type="text" 
              className="form-input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <div style={{ margin: '1.5rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Microservice Swagger API UI Links
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {microserviceDocs.map(s => (
                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.9rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Assigned: {s.role}</div>
                  </div>
                  <a 
                    href={`http://localhost:${s.port}${s.path}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ fontSize: '0.8rem', color: 'var(--color-brand-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    Open Swagger <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
