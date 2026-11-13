import React from 'react';

export default function Navbar({ currentView, setCurrentView, openReportModal }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand" onClick={() => setCurrentView('portal')}>
          <div className="brand-icon">🎓</div>
          <div className="brand-text">
            <h1>CampusTrace</h1>
            <span>University Lost &amp; Found Portal</span>
          </div>
        </div>

        <div className="nav-actions">
          {currentView === 'portal' ? (
            <>
              <button className="btn btn-danger" onClick={() => openReportModal('LOST')}>
                <span>+</span> Report Lost Item
              </button>
              <button className="btn btn-success" onClick={() => openReportModal('FOUND')}>
                <span>+</span> Report Found Item
              </button>
              <button className="btn btn-outline" onClick={() => setCurrentView('admin')}>
                <span>🛡️</span> Security / Admin Desk
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setCurrentView('portal')}>
              <span>←</span> Return to Public Portal
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
