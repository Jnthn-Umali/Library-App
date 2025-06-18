//src/app/dashboard/admin/components/AdminLogsTable.js
'use client';
import React, { useState } from 'react';
import './LogsTable.css'; // ✅ Reuse the same styling file

export default function AdminLogsTable({ logs }) {
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const query = searchQuery.toLowerCase();
  const filteredLogs = logs.filter((log) => {
    const email = log.adminId?.email?.toLowerCase() || '';
    const action = log.action?.toLowerCase() || '';
    return email.includes(query) || action.includes(query);
  });

  const sortedFilteredLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="logs-container">
      <h2 className="logs-title">Admin Logs</h2>
      <input
        type="text"
        placeholder="Search by email or action..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="logs-search-input"
      />
      <div className="logs-table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Admin Email</th>
              <th>Action</th>
              <th onClick={toggleSortOrder} className="sortable">
                Timestamp {sortOrder === 'desc' ? '↓' : '↑'}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedFilteredLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.adminId?.email || 'Unknown'}</td>
                <td>{log.action}</td>
                <td>
                  {log.createdAt || log.timestamp
                    ? new Date(log.createdAt || log.timestamp).toLocaleString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
