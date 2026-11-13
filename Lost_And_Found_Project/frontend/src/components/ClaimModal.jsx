import React, { useState } from 'react';

export default function ClaimModal({ isOpen, onClose, item, onClaimSubmitted }) {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    const payload = {
      itemId: item.id,
      claimantUniversityId: formData.get('claimantUniversityId'),
      proofDescription: formData.get('proofDescription'),
      proofDocumentOrImage: formData.get('proofDocumentOrImage') || null
    };

    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        onClaimSubmitted(json.data);
        onClose();
      } else {
        alert(json.message || 'Error submitting claim');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting claim.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Submit Verification Claim</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Claiming: {item.title}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '1.25rem' }}>
              To protect campus belongings and prevent wrongful pickups, please provide non-public proof of ownership.
              Campus security will verify these details before releasing the item.
            </p>

            <div className="form-group">
              <label>Your University Student / Staff ID *</label>
              <input
                type="text"
                name="claimantUniversityId"
                className="form-control"
                placeholder="e.g. STU202401"
                required
              />
            </div>

            <div className="form-group">
              <label>Detailed Proof of Ownership *</label>
              <textarea
                name="proofDescription"
                className="form-control"
                rows={4}
                placeholder="Mention unique marks: lockscreen wallpaper, serial number, bag contents, keychain charms, stickers..."
                required
                minLength={10}
              />
            </div>

            <div className="form-group">
              <label>Receipt / Proof Document URL (Optional)</label>
              <input
                type="url"
                name="proofDocumentOrImage"
                className="form-control"
                placeholder="Link to invoice, ID card, or photo proof"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Claim for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
