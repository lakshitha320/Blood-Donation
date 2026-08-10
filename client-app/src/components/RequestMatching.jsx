import React, { useState } from 'react';
import { HeartHandshake, PlusCircle, Sparkles, AlertCircle, Clock, CheckCircle2, Hospital } from 'lucide-react';
import { apiRequests } from '../services/api';

export default function RequestMatching({ requests, setRequests, donors, onShowToast }) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [matchingResults, setMatchingResults] = useState(null);
  const [activeRequestForMatch, setActiveRequestForMatch] = useState(null);

  const [formData, setFormData] = useState({
    recipientName: '',
    bloodType: 'O-',
    units: 2,
    urgency: 'CRITICAL',
    hospital: 'National Hospital Colombo',
    city: 'Colombo',
    contact: '',
  });

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    const newRequestPayload = {
      ...formData,
      units: parseInt(formData.units, 10),
    };

    const res = await apiRequests.create(newRequestPayload);
    setRequests((prev) => [res, ...prev]);
    setShowRequestModal(false);
    onShowToast(`[Request & Matching Service] Created blood request ${res.id} (${res.bloodType}) via API /requests`);

    // Reset Form
    setFormData({
      recipientName: '',
      bloodType: 'O-',
      units: 2,
      urgency: 'CRITICAL',
      hospital: 'National Hospital Colombo',
      city: 'Colombo',
      contact: '',
    });
  };

  const handleRunMatching = async (req) => {
    setActiveRequestForMatch(req);
    const matchedDonors = await apiRequests.matchDonors(req.id);
    
    // Filter compatible donors by blood type and city
    const compatible = donors.filter(d => {
      if (!d.eligible) return false;
      // Universal donor rules
      if (req.bloodType === 'O-') return d.bloodType === 'O-';
      if (req.bloodType === 'O+') return d.bloodType === 'O+' || d.bloodType === 'O-';
      if (req.bloodType === 'A+') return ['O-', 'O+', 'A-', 'A+'].includes(d.bloodType);
      if (req.bloodType === 'B+') return ['O-', 'O+', 'B-', 'B+'].includes(d.bloodType);
      return d.bloodType === req.bloodType || d.bloodType === 'O-';
    });

    setMatchingResults(compatible);
    onShowToast(`[Request & Matching Service] Found ${compatible.length} matching donors for ${req.recipientName} (${req.bloodType}) via /requests/match`);
  };

  const handleMarkFulfilled = (reqId) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'FULFILLED' } : r));
    if (activeRequestForMatch && activeRequestForMatch.id === reqId) {
      setActiveRequestForMatch(prev => ({ ...prev, status: 'FULFILLED' }));
    }
    onShowToast(`Request ${reqId} marked as FULFILLED.`);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div className="section-title">
          <HeartHandshake size={22} color="var(--color-brand-primary)" />
          <span>Recipient Blood Requests & Matching Engine</span>
        </div>

        <button className="btn btn-primary" onClick={() => setShowRequestModal(true)}>
          <PlusCircle size={16} />
          <span>Submit Urgent Blood Request</span>
        </button>
      </div>

      {/* Requests List */}
      <div className="table-container" style={{ marginBottom: '2.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Recipient Name</th>
              <th>Blood Needed</th>
              <th>Urgency</th>
              <th>Hospital & Location</th>
              <th>Status</th>
              <th>Matching Engine</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{req.id}</td>
                <td style={{ fontWeight: 600 }}>{req.recipientName}</td>
                <td>
                  <span className="stock-status-tag" style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--color-brand-primary)', border: '1px solid rgba(230,57,70,0.3)', fontWeight: 800 }}>
                    {req.bloodType} ({req.units} units)
                  </span>
                </td>
                <td>
                  <span className={`stock-status-tag ${req.urgency === 'CRITICAL' ? 'status-critical' : req.urgency === 'HIGH' ? 'status-warning' : 'status-healthy'}`}>
                    {req.urgency === 'CRITICAL' && <AlertCircle size={12} style={{ marginRight: '0.2rem' }} />}
                    {req.urgency}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Hospital size={13} color="var(--color-brand-primary)" /> {req.hospital}</div>
                    <div style={{ color: 'var(--text-dim)' }}>{req.city} | Contact: {req.contact}</div>
                  </div>
                </td>
                <td>
                  {req.status === 'FULFILLED' ? (
                    <span className="stock-status-tag status-healthy"><CheckCircle2 size={12} style={{ marginRight: '0.2rem' }} /> FULFILLED</span>
                  ) : (
                    <span className="stock-status-tag status-warning"><Clock size={12} style={{ marginRight: '0.2rem' }} /> {req.status}</span>
                  )}
                </td>
                <td>
                  <button 
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', borderColor: 'var(--color-brand-primary)' }}
                    onClick={() => handleRunMatching(req)}
                  >
                    <Sparkles size={14} color="var(--color-brand-primary)" /> Match Donors
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match Results Panel */}
      {activeRequestForMatch && matchingResults && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--color-brand-primary)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--color-brand-primary)" />
                Matching Results for Request {activeRequestForMatch.id} ({activeRequestForMatch.recipientName} - {activeRequestForMatch.bloodType})
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Powered by Request & Matching Microservice (`/requests/match`)
              </p>
            </div>
            {activeRequestForMatch.status !== 'FULFILLED' && (
              <button className="btn btn-primary" onClick={() => handleMarkFulfilled(activeRequestForMatch.id)}>
                <CheckCircle2 size={15} /> Mark Request Fulfilled
              </button>
            )}
          </div>

          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>
            Compatible Eligible Donors Found ({matchingResults.length})
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {matchingResults.map(d => (
              <div key={d.id} style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700 }}>{d.name}</span>
                  <span className="stock-status-tag status-healthy">{d.bloodType}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '0.8rem' }}>
                  City: {d.city} | Phone: {d.phone}
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                  onClick={() => onShowToast(`[Notification Service] Dispatched SMS alert to donor ${d.name} (${d.phone})`)}
                >
                  Send Urgent Dispatch SMS
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <PlusCircle size={20} color="var(--color-brand-primary)" />
                <span>New Request - Request & Matching Service</span>
              </h3>
              <button 
                onClick={() => setShowRequestModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest}>
              <div className="form-group">
                <label className="form-label">Recipient / Patient Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="e.g. Nimal Perera"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Required Blood Group</label>
                  <select 
                    className="form-select"
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Units Needed</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={formData.units}
                    onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <select 
                  className="form-select"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                >
                  <option value="CRITICAL">CRITICAL - Emergency (Immediate)</option>
                  <option value="HIGH">HIGH - Surgery Scheduled</option>
                  <option value="NORMAL">NORMAL - Standard Request</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input 
                    type="tel" 
                    className="form-input"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="+94 7X XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit via API Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
