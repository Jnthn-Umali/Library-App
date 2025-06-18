// src/app/dashboard/admin/page.js
'use client';

import './components/Dashboard.css';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './components/Sidebar';
import UsersTable from './components/UsersTable';
import LoginLogsTable from './components/LoginLogsTable';
import AdminLogsTable from './components/AdminLogsTable';
import StaffLogsTable from './components/StaffLogsTable';
import BooksTable from './components/BooksTable';
import RentalsTable from './components/RentalsTable';
import AdminAnalytics from './components/AdminAnalytics';

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [staffLogs, setStaffLogs] = useState([]);
  const [books, setBooks] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [selectedTab, setSelectedTab] = useState('users');

  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      try {
        const res = await fetch('/api/session');
        const data = await res.json();

        if (!data.isLoggedIn) {
          router.push('/login');
          return;
        }
        if (data.user.role !== 'admin') {
          router.push('/unauthorized');
          return;
        }

        const [usersRes, logsRes, adminLogsRes, staffLogsRes, booksRes, rentalsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/loginlogs'),
          fetch('/api/admin/adminlogs'),
          fetch('/api/admin/stafflogs'),
          fetch('/api/admin/books'),
          fetch('/api/admin/rentals'),
        ]);

        setUsers(await usersRes.json());
        setLogs(await logsRes.json());
        setAdminLogs(await adminLogsRes.json());
        setStaffLogs(await staffLogsRes.json());
        setBooks(await booksRes.json());
        setRentals(await rentalsRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <div className="admin-dashboard">
      <div className="w-64">
        <Sidebar selectedTab={selectedTab} onSelectTab={setSelectedTab} onLogout={handleLogout} />
      </div>

      <main className="dashboard-content">
        <h1 className="dashboard-header">
          {selectedTab === 'users'
            ? 'Users'
            : selectedTab === 'logs'
            ? 'Login Logs'
            : selectedTab === 'adminLogs'
            ? 'Admin Logs'
            : selectedTab === 'staffLogs'
            ? 'Staff Logs'
            : selectedTab === 'books'
            ? 'Books'
            : selectedTab === 'rentals'
            ? 'Rentals'
            : selectedTab === 'analytics'
            ? 'Analytics'
            : ''}
        </h1>

        {loading ? (
          <div className="loading-spinner">
            <div></div>
          </div>
        ) : selectedTab === 'users' ? (
          <UsersTable users={users} />
        ) : selectedTab === 'logs' ? (
          <LoginLogsTable logs={logs} />
        ) : selectedTab === 'adminLogs' ? (
          <AdminLogsTable logs={adminLogs} />
        ) : selectedTab === 'staffLogs' ? (
          <StaffLogsTable logs={staffLogs} />
        ) : selectedTab === 'books' ? (
          <BooksTable books={books} />
        ) : selectedTab === 'rentals' ? (
          <RentalsTable rentals={rentals} />
        ) : selectedTab === 'analytics' ? (
          <AdminAnalytics users={users} books={books} rentals={rentals} />
        ) : null}
      </main>
    </div>
  );
}
