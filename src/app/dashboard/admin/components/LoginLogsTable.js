'use client';
import React, { useState } from 'react';
import './LogsTable.css'; // ✅ Use same shared CSS file for styling

export default function LoginLogsTable({ logs }) {
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const query = searchQuery.toLowerCase();
  const filteredLogs = logs.filter((log) => {
    const email = log.email?.toLowerCase() || '';
    const userAgent = log.userAgent?.toLowerCase() || '';
    const ip = log.ip?.toLowerCase() || '';
    return email.includes(query) || userAgent.includes(query) || ip.includes(query);
  });

  const sortedFilteredLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="logs-container">
      <h2 className="logs-title">Login Logs</h2>
      <input
        type="text"
        placeholder="Search by email, IP, or user agent..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="logs-search-input"
      />
      <div className="logs-table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>IP</th>
              <th>User Agent</th>
              <th className="sortable" onClick={toggleSortOrder}>
                Timestamp {sortOrder === 'desc' ? '↓' : '↑'}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedFilteredLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.email}</td>
                <td>{log.ip}</td>
                <td>
                  <span className="group relative" title={log.userAgent}>
                    {log.userAgent?.slice(0, 50)}...
                    <span className="tooltip-content">
                      {log.userAgent}
                    </span>
                  </span>
                </td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
