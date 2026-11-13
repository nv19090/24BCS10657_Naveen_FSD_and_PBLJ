import React from 'react';

export default function HeroStats({ stats }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h2 className="hero-title">Recover &amp; Report Campus Belongings</h2>
        <p className="hero-subtitle">
          Centralized full-stack university portal connecting students, staff, and campus security
          to report, verify, and reclaim lost personal items across all campus departments.
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-num">{stats.totalLostItems || 0}</span>
            <span className="stat-label">Active Lost Items</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.totalFoundItems || 0}</span>
            <span className="stat-label">Found Belongings</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.totalPendingClaims || 0}</span>
            <span className="stat-label">Pending Claim Verifications</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.totalResolvedItems || 0}</span>
            <span className="stat-label">Reunited with Owners</span>
          </div>
        </div>
      </div>
    </section>
  );
}
