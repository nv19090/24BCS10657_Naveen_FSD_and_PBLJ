import React from 'react';

export default function ItemDetailModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Item Details</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className={`badge-type ${item.itemType === 'LOST' ? 'badge-lost' : 'badge-found'}`} style={{ position: 'static' }}>
              {item.itemType}
            </span>
            <span className="badge-status" style={{ position: 'static' }}>
              {item.status}
            </span>
          </div>

          <div className="form-group">
            <label>Item Name</label>
            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.title}</p>
          </div>

          <div className="form-group">
            <label>Category</label>
            <p style={{ fontWeight: 600 }}>{item.categoryName || 'General'}</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Campus Location</label>
              <p>{item.campusLocation}</p>
            </div>
            <div className="form-group">
              <label>Event Date</label>
              <p>{item.eventDate || 'N/A'}</p>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <p style={{ lineHeight: 1.5 }}>{item.description || 'No description provided.'}</p>
          </div>

          <div className="form-group">
            <label>Holding / Security Desk</label>
            <p style={{ fontWeight: 600, color: 'var(--primary)' }}>
              {item.storageLocation || 'N/A (Held by reporter)'}
            </p>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--gray-200)' }}>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--gray-600)', fontWeight: 700 }}>
              Reporter Information
            </label>
            <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>
              {item.reporterName} ({item.reporterUniversityId})
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
              {item.reporterEmail} | {item.reporterPhone}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
