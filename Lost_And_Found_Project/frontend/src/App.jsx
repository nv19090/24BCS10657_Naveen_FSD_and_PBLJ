import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroStats from './components/HeroStats.jsx';
import FilterBar from './components/FilterBar.jsx';
import ItemCard from './components/ItemCard.jsx';
import ReportModal from './components/ReportModal.jsx';
import ClaimModal from './components/ClaimModal.jsx';
import ItemDetailModal from './components/ItemDetailModal.jsx';
import AdminDesk from './components/AdminDesk.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('portal'); // 'portal' | 'admin'
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportDefaultType, setReportDefaultType] = useState('LOST');
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);

  // Toasts
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [searchKeyword, selectedType, selectedCategory, selectedStatus]);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/dashboard/stats');
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchItems() {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.append('keyword', searchKeyword.trim());
    if (selectedType !== 'ALL') params.append('itemType', selectedType);
    if (selectedCategory) params.append('categoryId', selectedCategory);
    if (selectedStatus) params.append('status', selectedStatus);

    try {
      const res = await fetch(`/api/items?${params.toString()}`);
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  function handleOpenReport(type = 'LOST') {
    setReportDefaultType(type);
    setReportModalOpen(true);
  }

  function handleOpenClaim(item) {
    setSelectedItemForClaim(item);
    setClaimModalOpen(true);
  }

  function handleOpenDetail(item) {
    setSelectedItemForDetail(item);
    setDetailModalOpen(true);
  }

  function handleFoundContact(item) {
    alert(`To return this lost item to the student, please contact:\n\nStudent: ${item.reporterName}\nEmail: ${item.reporterEmail}\nPhone: ${item.reporterPhone}\n\nOr hand it to Campus Security Desk.`);
  }

  return (
    <div className="app-wrapper">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openReportModal={handleOpenReport}
      />

      {currentView === 'portal' ? (
        <>
          <HeroStats stats={stats} />

          <main className="main-container">
            <FilterBar
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              categories={categories}
            />

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading campus items...</p>
              </div>
            ) : items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '16px', border: '1px dashed var(--gray-200)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
                <h3>No items found</h3>
                <p style={{ color: 'var(--gray-600)' }}>Try adjusting your search query or selecting a different category filter.</p>
              </div>
            ) : (
              <div className="items-grid">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onOpenDetail={handleOpenDetail}
                    onOpenClaim={handleOpenClaim}
                    onFoundContact={handleFoundContact}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      ) : (
        <AdminDesk onShowToast={showToast} />
      )}

      {/* Modals */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        defaultType={reportDefaultType}
        categories={categories}
        onReportSubmitted={(item) => {
          showToast('Item reported successfully on campus portal!');
          fetchItems();
          fetchStats();
        }}
      />

      <ClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        item={selectedItemForClaim}
        onClaimSubmitted={(claim) => {
          showToast('Claim submitted for security verification!');
          fetchItems();
          fetchStats();
        }}
      />

      <ItemDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        item={selectedItemForDetail}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <span>✓</span> <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p><strong>CampusTrace University Portal</strong> &bull; Full Stack Web Development (React.js &amp; Node.js Express.js)</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
          Frontend: React 18 &bull; Backend: Node.js Express REST API &bull; Mode: Full Stack Course Submission
        </p>
      </footer>
    </div>
  );
}
