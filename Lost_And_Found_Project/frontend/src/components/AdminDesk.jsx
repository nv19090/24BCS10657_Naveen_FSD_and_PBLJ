import React, { useState, useEffect } from 'react';

export default function AdminDesk({ onShowToast }) {
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [claimStatusFilter, setClaimStatusFilter] = useState('PENDING');
  const [selectedClaimForReview, setSelectedClaimForReview] = useState(null);
  const [decision, setDecision] = useState('APPROVED');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchClaims();
    fetchItems();
  }, [claimStatusFilter]);

  async function fetchClaims() {
    try {
      const url = claimStatusFilter ? `/api/claims?status=${claimStatusFilter}` : '/api/claims';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setClaims(json.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchItems() {
    try {
      const res = await fetch('/api/items');
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!selectedClaimForReview) return;
    setSubmittingReview(true);

    try {
      const res = await fetch(`/api/claims/${selectedClaimForReview.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision, adminRemarks })
      });
      const json = await res.json();
      if (json.success) {
        onShowToast(`Claim #${selectedClaimForReview.id} decision recorded: ${decision}`);
        setSelectedClaimForReview(null);
        setAdminRemarks('');
        fetchClaims();
        fetchItems();
      } else {
        alert(json.message || 'Error processing review');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while processing review.');
    } finally {
      setSubmittingReview(false);
    }
  }

  async function handleStatusChange(itemId, newStatus) {
    try {
      const res = await fetch(`/api/items/${itemId}/status?status=${newStatus}`, { method: 'PATCH' });
      const json = await res.json();
      if (json.success) {
        onShowToast(`Item #${itemId} updated to ${newStatus}`);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteItem(itemId) {
    if (!window.confirm(`Permanently delete Item #${itemId}?`)) return;
    try {
      const res = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        onShowToast(`Item #${itemId} deleted.`);
        fetchItems();
        fetchClaims();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="main-container">
      {/* Claims Queue */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Verification Claims Queue</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
            Review ownership proof submitted by students and approve release of found property.
          </p>
        </div>
        <div>
          <select
            className="select-filter"
            value={claimStatusFilter}
            onChange={(e) => setClaimStatusFilter(e.target.value)}
          >
            <option value="">All Claims</option>
            <option value="PENDING">Pending Verification</option>
            <option value="APPROVED">Approved Claims</option>
            <option value="REJECTED">Rejected Claims</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Target Item</th>
              <th>Claimant Student</th>
              <th>Submitted Proof</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {claims.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No claims matching the selected filter.
                </td>
              </tr>
            ) : (
              claims.map((c) => (
                <tr key={c.id}>
                  <td><strong>#CLM-{c.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.itemTitle}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Item #{c.itemId} &bull; {c.itemCampusLocation}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.claimantName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {c.claimantUniversityId} &bull; {c.claimantEmail}</div>
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{c.proofDescription}</p>
                    {c.adminRemarks && (
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.25rem' }}>
                        <em>Admin Note: {c.adminRemarks}</em>
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: c.status === 'PENDING' ? '#fef3c7' : c.status === 'APPROVED' ? '#d1fae5' : '#fee2e2',
                        color: c.status === 'PENDING' ? '#d97706' : c.status === 'APPROVED' ? '#059669' : '#dc2626'
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.status === 'PENDING' ? (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => {
                          setSelectedClaimForReview(c);
                          setDecision('APPROVED');
                          setAdminRemarks('');
                        }}
                      >
                        Review
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Reviewed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Property Master Log */}
      <div style={{ marginBottom: '1rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Campus Property Master Log</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
          All recorded lost and found belongings with status overrides.
        </p>
      </div>

      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Title &amp; Type</th>
              <th>Location</th>
              <th>Reporter</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><strong>#ITM-{item.id}</strong></td>
                <td>
                  <span
                    className={`badge-type ${item.itemType === 'LOST' ? 'badge-lost' : 'badge-found'}`}
                    style={{ position: 'static', fontSize: '0.7rem', marginRight: '0.5rem' }}
                  >
                    {item.itemType}
                  </span>
                  <span style={{ fontWeight: 600 }}>{item.title}</span>
                </td>
                <td>{item.campusLocation}</td>
                <td>{item.reporterName} ({item.reporterUniversityId})</td>
                <td>
                  <select
                    className="select-filter"
                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  >
                    <option value="REPORTED">REPORTED</option>
                    <option value="UNDER_VERIFICATION">UNDER_VERIFICATION</option>
                    <option value="CLAIMED">CLAIMED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#dc2626' }}
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedClaimForReview && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Review Ownership Verification</h3>
              <button className="modal-close" onClick={() => setSelectedClaimForReview(null)}>&times;</button>
            </div>
            <form onSubmit={handleReviewSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Item</label>
                  <p style={{ fontWeight: 600, color: 'var(--primary)' }}>
                    {selectedClaimForReview.itemTitle} (Item #{selectedClaimForReview.itemId})
                  </p>
                </div>

                <div className="form-group">
                  <label>Claimant Student</label>
                  <p style={{ fontWeight: 600 }}>
                    {selectedClaimForReview.claimantName} ({selectedClaimForReview.claimantUniversityId})
                  </p>
                </div>

                <div className="form-group">
                  <label>Claimant's Submitted Proof</label>
                  <div style={{ padding: '0.75rem', background: 'var(--gray-100)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {selectedClaimForReview.proofDescription}
                  </div>
                </div>

                <div className="form-group">
                  <label>Verification Decision *</label>
                  <select
                    className="form-control"
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    required
                  >
                    <option value="APPROVED">APPROVE CLAIM (Verified Owner - Release Item)</option>
                    <option value="REJECTED">REJECT CLAIM (Insufficient / Incorrect Proof)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Officer Remarks &amp; Notes</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="e.g. Verified student badge STU202401 matches laptop serial number. Released at Gate 1."
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setSelectedClaimForReview(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                  {submittingReview ? 'Recording...' : 'Submit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
