import { Users, LogIn, LogOut, FileText, Book, Library, BarChart2 } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ selectedTab, onSelectTab, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <h2>Admin Panel</h2>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <p className="sidebar-section-title">Users</p>
          <ul className="sidebar-list">
            <li
              className={`sidebar-item ${selectedTab === 'users' ? 'active' : ''}`}
              onClick={() => onSelectTab('users')}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectTab('users')}
              role="button"
              aria-current={selectedTab === 'users' ? 'page' : undefined}
            >
              <Users size={18} />
              Users
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-title">Logs</p>
          <ul className="sidebar-list">
            <li
              className={`sidebar-item ${selectedTab === 'adminLogs' ? 'active' : ''}`}
              onClick={() => onSelectTab('adminLogs')}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectTab('adminLogs')}
              role="button"
            >
              <FileText size={18} />
              Admin Logs
            </li>
            <li
              className={`sidebar-item ${selectedTab === 'staffLogs' ? 'active' : ''}`}
              onClick={() => onSelectTab('staffLogs')}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectTab('staffLogs')}
              role="button"
            >
              <LogIn size={18} />
              Staff Logs
            </li>
            <li
              className={`sidebar-item ${selectedTab === 'logs' ? 'active' : ''}`}
              onClick={() => onSelectTab('logs')}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectTab('logs')}
              role="button"
            >
              <LogIn size={18} />
              Login Logs
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-title">Library</p>
          <ul className="sidebar-list">
            <li
              className={`sidebar-item ${selectedTab === 'books' ? 'active' : ''}`}
              onClick={() => onSelectTab('books')}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectTab('books')}
              role="button"
              aria-current={selectedTab === 'books' ? 'page' : undefined}
            >
              <Book size={18} />
              Books
            </li>
            <li
              className={`sidebar-item ${selectedTab === 'rentals' ? 'active' : ''}`}
              onClick={() => onSelectTab('rentals')}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectTab('rentals')}
              role="button"
              aria-current={selectedTab === 'rentals' ? 'page' : undefined}
            >
              <Library size={18} />
              Rentals
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-title">Insights</p>
          <ul className="sidebar-list">
            <li
              className={`sidebar-item ${selectedTab === 'analytics' ? 'active' : ''}`}
              onClick={() => onSelectTab('analytics')}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectTab('analytics')}
              role="button"
              aria-current={selectedTab === 'analytics' ? 'page' : undefined}
            >
              <BarChart2 size={18} />
              Analytics
            </li>
          </ul>
        </div>
      </nav>

      <button
        onClick={onLogout}
        className="sidebar-logout"
        aria-label="Logout"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
