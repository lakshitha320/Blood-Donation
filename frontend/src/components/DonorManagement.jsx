import React, { useState } from 'react';
import { Users, UserPlus, Search, CheckCircle, XCircle, History, Phone, Mail, MapPin } from 'lucide-react';
import { apiDonors } from '../services/api';

export default function DonorManagement({ donors, setDonors, onShowToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDonorHistory, setSelectedDonorHistory] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    bloodType: 'O+',
    city: 'Colombo',
    phone: '',
    email: '',
    age: '',
    weight: '',
    lastDonated: '',
  });

  const handleRegisterDonor = async (e) => {
    e.preventDefault();
    const newDonorPayload = {
      ...formData,
      age: parseInt(formData.age, 10),
      weight: parseInt(formData.weight, 10),
      eligible: true,
      totalDonations: 1,
    };

    const res = await apiDonors.create(newDonorPayload);

    setDonors((prev) => [res, ...prev]);
    setShowAddModal(false);
    onShowToast(`[Donor Service] Registered donor ${res.name} (${res.bloodType}) via API /donors`);

    // Reset Form
    setFormData({
      name: '',
      bloodType: 'O+',
      city: 'Colombo',
      phone: '',
      email: '',
      age: '',
      weight: '',
      lastDonated: '',
    });
  };

  const handleViewHistory = async (donor) => {
    setSelectedDonorHistory(donor);
    const records = await apiDonors.getHistory(donor.id);
    setHistoryRecords(records);
  };

  const filteredDonors = donors.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.phone.includes(searchTerm);
    const matchesBlood = selectedBloodGroup === 'ALL' || d.bloodType === selectedBloodGroup;
    return matchesSearch && matchesBlood;
  });

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div className="section-title">
          <Users size={22} color="var(--color-brand-primary)" />
          <span>Registered Donors Directory</span>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} />
          <span>Register New Donor</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px', display: 'flex', alignItems: 'center', background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search donors by name, city, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', width: '100%', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Blood Group:</span>
          <select 
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="ALL">All Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Donors Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Donor ID</th>
              <th>Donor Name</th>
              <th>Blood Type</th>
              <th>Contact Details</th>
              <th>Location</th>
              <th>Eligibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map((donor) => (
              <tr key={donor.id}>
                <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{donor.id}</td>
                <td style={{ fontWeight: 600 }}>{donor.name}</td>
                <td>
                  <span className="stock-status-tag" style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--color-brand-primary)', border: '1px solid rgba(230,57,70,0.3)' }}>
                    {donor.bloodType}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={13} color="var(--text-dim)" /> {donor.phone}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-dim)' }}><Mail size={13} /> {donor.email}</span>
                  </div>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="var(--color-brand-primary)" /> {donor.city}
                  </span>
                </td>
                <td>
                  {donor.eligible ? (
                    <span className="stock-status-tag status-healthy">
                      <CheckCircle size={12} style={{ marginRight: '0.2rem' }} /> Eligible
                    </span>
                  ) : (
                    <span className="stock-status-tag status-critical">
                      <XCircle size={12} style={{ marginRight: '0.2rem' }} /> Temporary Ineligible
                    </span>
                  )}
                </td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    onClick={() => handleViewHistory(donor)}
                  >
                    <History size={14} /> History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Donor Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <UserPlus size={20} color="var(--color-brand-primary)" />
                <span>Register New Donor - Donor Service</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterDonor}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ruwan Wickramasinghe"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
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
                  <label className="form-label">City / District</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 7X XXX XXXX"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@gmail.com"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Age (Years)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="18-65"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Min 50kg"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register via API Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Donor History Modal */}
      {selectedDonorHistory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <History size={20} color="var(--color-brand-primary)" />
                <span>Donation History: {selectedDonorHistory.name}</span>
              </h3>
              <button 
                onClick={() => setSelectedDonorHistory(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <p><strong>Blood Group:</strong> {selectedDonorHistory.bloodType} | <strong>Total Donations:</strong> {selectedDonorHistory.totalDonations}</p>
              <p><strong>Phone:</strong> {selectedDonorHistory.phone} | <strong>City:</strong> {selectedDonorHistory.city}</p>
            </div>

            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Past Donation Events (/donors/history)
            </h4>

            {historyRecords.map(h => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{h.location}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{h.date}</div>
                </div>
                <span className="stock-status-tag status-healthy">{h.status} ({h.units} unit)</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedDonorHistory(null)}>
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
