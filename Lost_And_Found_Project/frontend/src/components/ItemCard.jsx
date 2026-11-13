import React from 'react';

export default function ItemCard({ item, onOpenDetail, onOpenClaim, onFoundContact }) {
  const isLost = item.itemType === 'LOST';
  const typeClass = isLost ? 'badge-lost' : 'badge-found';
  const defaultImage = isLost
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  const isClaimable = item.itemType === 'FOUND' && (item.status === 'REPORTED' || item.status === 'UNDER_VERIFICATION');

  function formatStatus(status) {
    switch (status) {
      case 'REPORTED': return 'Reported';
      case 'UNDER_VERIFICATION': return 'Verifying Claim';
      case 'CLAIMED': return 'Claimed';
      case 'RESOLVED': return 'Resolved';
      default: return status;
    }
  }

  return (
    <div className="item-card">
      <div className="card-img-wrapper">
        <img
          src={item.imageUrl || defaultImage}
          alt={item.title}
          className="card-img"
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <span className={`badge-type ${typeClass}`}>{item.itemType}</span>
        <span className="badge-status">{formatStatus(item.status)}</span>
      </div>

      <div className="card-body">
        <div className="card-category">{item.categoryName || 'General'}</div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-desc">{item.description || 'No description provided.'}</p>

        <div className="card-meta">
          <div className="meta-row">
            <span>📍</span> <span><strong>Location:</strong> {item.campusLocation}</span>
          </div>
          <div className="meta-row">
            <span>📅</span> <span><strong>Date:</strong> {item.eventDate || 'Recent'}</span>
          </div>
          {item.storageLocation && (
            <div className="meta-row">
              <span>🏢</span> <span><strong>Desk:</strong> {item.storageLocation}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <button className="btn btn-outline" onClick={() => onOpenDetail(item)}>
          Details
        </button>
        {isClaimable && (
          <button className="btn btn-success" onClick={() => onOpenClaim(item)}>
            Claim Item
          </button>
        )}
        {isLost && (
          <button className="btn btn-danger" onClick={() => onFoundContact(item)}>
            I Found This
          </button>
        )}
      </div>
    </div>
  );
}
