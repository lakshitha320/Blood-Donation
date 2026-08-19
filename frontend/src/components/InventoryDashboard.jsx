import React, { useState } from 'react';
import { Database, PlusCircle, AlertTriangle, CheckCircle, RefreshCw, Filter } from 'lucide-react';
import { apiInventory } from '../services/api';

export default function InventoryDashboard({ inventory, setInventory, onShowToast }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBloodType, setSelectedBloodType] = useState('O-');
  const [unitsToAdd, setUnitsToAdd] = useState(5);
  const [filterType, setFilterType] = useState('ALL');

  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
  const criticalItems = inventory.filter((item) => item.status === 'Critical');
  const healthyItems = inventory.filter((item) => item.status === 'Healthy');

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    const updatePayload = {
      bloodType: selectedBloodType,
      amount: parseInt(unitsToAdd, 10),
      timestamp: new Date().toISOString(),
    };

    const res = await apiInventory.updateStock(updatePayload);

    setInventory((prev) =>
      prev.map((item) => {
        if (item.bloodType === selectedBloodType) {
          const newUnits = item.units + parseInt(unitsToAdd, 10);
          let newStatus = 'Healthy';
          if (newUnits < 10) newStatus = 'Critical';
          else if (newUnits < 20) newStatus = 'Warning';

          return {
            ...item,
            units: newUnits,
            status: newStatus,
            lastUpdated: 'Just now',
          };
        }
        return item;
      })
    );

    setShowUpdateModal(false);
    onShowToast(`[Blood Inventory Service] Updated ${selectedBloodType} stock (+${unitsToAdd} units) via API /inventory/update`);
  };

  const filteredInventory = filterType === 'ALL'
    ? inventory
    : inventory.filter(item => item.status === filterType);

  return (
    <div>
      {/* Overview Stat Cards */}
      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Total Available Stock</h4>
            <div className="stat-value" style={{ color: 'var(--color-brand-primary)' }}>
              {totalUnits} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Units</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-brand-primary)' }}>
            <Database size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Critical Low Stock</h4>
            <div className="stat-value" style={{ color: 'var(--color-accent-rose)' }}>
              {criticalItems.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Types</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-accent-rose)' }}>
            <AlertTriangle size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Optimal Stock Levels</h4>
            <div className="stat-value" style={{ color: 'var(--color-accent-emerald)' }}>
              {healthyItems.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Types</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-accent-emerald)' }}>
            <CheckCircle size={26} />
          </div>
        </div>
      </div>

      {/* Section Header & Controls */}
      <div className="section-header">
        <div className="section-title">
          <Database size={22} color="var(--color-brand-primary)" />
          <span>Real-time Blood Stock Inventory</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Critical">Critical Only</option>
              <option value="Warning">Warning Only</option>
              <option value="Healthy">Healthy Only</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={() => setShowUpdateModal(true)}>
            <PlusCircle size={16} />
            <span>Update Stock Level</span>
          </button>
        </div>
      </div>

      {/* Inventory Cards Grid */}
      <div className="inventory-grid">
        {filteredInventory.map((item) => (
          <div key={item.bloodType} className="inventory-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div className="blood-badge">{item.bloodType}</div>
              <span className={`stock-status-tag status-${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>
                {item.units}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.4rem' }}>
                  units in bank
                </span>
              </div>
            </div>

            {/* Visual Stock Meter */}
            <div style={{ background: 'rgba(255,255,255,0.06)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${Math.min(100, (item.units / 60) * 100)}%`,
                  background: item.status === 'Critical' 
                    ? 'var(--color-accent-rose)' 
                    : item.status === 'Warning' 
                      ? 'var(--color-accent-amber)' 
                      : 'var(--color-accent-emerald)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease'
                }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <span>Location: {item.location}</span>
              <span>Updated: {item.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Update Stock Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                <RefreshCw size={20} color="var(--color-brand-primary)" />
                <span>Update Stock - Blood Inventory Service</span>
              </h3>
              <button 
                onClick={() => setShowUpdateModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStock}>
              <div className="form-group">
                <label className="form-label">Select Blood Type (/inventory/update)</label>
                <select 
                  className="form-select"
                  value={selectedBloodType}
                  onChange={(e) => setSelectedBloodType(e.target.value)}
                >
                  {inventory.map(i => (
                    <option key={i.bloodType} value={i.bloodType}>
                      {i.bloodType} (Current: {i.units} units)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Units to Add / Deduct</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={unitsToAdd}
                  onChange={(e) => setUnitsToAdd(e.target.value)}
                  placeholder="e.g. 5 or -2"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Stock via Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
