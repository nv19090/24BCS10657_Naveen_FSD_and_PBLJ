import React, { useState } from 'react';

export default function ReportModal({ isOpen, onClose, defaultType, categories, onReportSubmitted }) {
  const [itemType, setItemType] = useState(defaultType || 'LOST');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    const payload = {
      title: formData.get('title'),
      itemType: formData.get('itemType'),
      categoryId: parseInt(formData.get('categoryId')),
      campusLocation: formData.get('campusLocation'),
      eventDate: formData.get('eventDate') || null,
      primaryColor: formData.get('primaryColor'),
      brandOrModel: formData.get('brandOrModel'),
      identifyingMarks: formData.get('identifyingMarks'),
      storageLocation: formData.get('storageLocation'),
      imageUrl: formData.get('imageUrl'),
      reporterUniversityId: formData.get('reporterUniversityId'),
      description: formData.get('description')
    };

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        onReportSubmitted(json.data);
        onClose();
      } else {
        alert(json.message || 'Error reporting item');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to backend.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Report Lost or Found Item</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Report Type *</label>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="itemType"
                    value="LOST"
                    checked={itemType === 'LOST'}
                    onChange={() => setItemType('LOST')}
                  />
                  I Lost Something
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="itemType"
                    value="FOUND"
                    checked={itemType === 'FOUND'}
                    onChange={() => setItemType('FOUND')}
                  />
                  I Found Something
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Item Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="e.g. Apple MacBook Air 13'' or Student ID Badge"
                required
                minLength={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="categoryId" className="form-control" required defaultValue="">
                  <option value="" disabled>Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Campus Location *</label>
                <input
                  type="text"
                  name="campusLocation"
                  className="form-control"
                  placeholder="e.g. Library 2nd Floor, Cafeteria"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date Lost / Found</label>
                <input type="date" name="eventDate" className="form-control" />
              </div>
              <div className="form-group">
                <label>Primary Color</label>
                <input type="text" name="primaryColor" className="form-control" placeholder="e.g. Space Gray, Navy Blue" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Brand / Model</label>
                <input type="text" name="brandOrModel" className="form-control" placeholder="e.g. Apple, Dell, Sony" />
              </div>
              <div className="form-group">
                <label>Storage Desk (if found item)</label>
                <input type="text" name="storageLocation" className="form-control" placeholder="e.g. Security Gate 1 Desk" />
              </div>
            </div>

            <div className="form-group">
              <label>Your University Student / Staff ID *</label>
              <input
                type="text"
                name="reporterUniversityId"
                className="form-control"
                placeholder="e.g. STU202401 or ADMIN001"
                required
              />
            </div>

            <div className="form-group">
              <label>Image URL (Optional)</label>
              <input type="url" name="imageUrl" className="form-control" placeholder="https://images.unsplash.com/..." />
            </div>

            <div className="form-group">
              <label>Description &amp; Identifying Details *</label>
              <textarea
                name="description"
                className="form-control"
                rows={3}
                placeholder="Distinct characteristics, circumstances where lost/found, stickers, scratches..."
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
