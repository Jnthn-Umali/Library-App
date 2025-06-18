// src/app/dashboard/staff/components/Sidebar.js
import React from 'react';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <div className="sidebar">
      <h2>Staff Panel</h2>
      <ul className="sidebar-menu">
        <li
          className={activeTab === 'books' ? 'active' : ''}
          onClick={() => setActiveTab('books')}
        >
          Books
        </li>
        <li
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending Rentals
        </li>
        <li
          className={activeTab === 'confirmed' ? 'active' : ''}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed Rentals
        </li>
        <li
          className={activeTab === 'returned' ? 'active' : ''}
          onClick={() => setActiveTab('returned')}
        >
          Returned Rentals
        </li>
      </ul>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}