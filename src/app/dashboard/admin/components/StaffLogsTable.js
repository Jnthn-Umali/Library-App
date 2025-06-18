'use client';
import React, { useState } from 'react';
import './LogsTable.css'; // ✅ Reusing consistent styling

export default function StaffLogsTable({ logs }) {
  const [searchQuery, setSearchQuery] = useState('');

  const query = searchQuery.toLowerCase();
  const filteredLogs = logs.filter((log) => {
    const email = log.staffId?.email?.toLowerCase() || '';
    const action = log.action?.toLowerCase() || '';
    const title = log.details?.title?.toLowerCase() || '';
    return (
      email.includes(query) ||
      action.includes(query) ||
      title.includes(query)
    );
  });

  return (
    <div className="logs-container">
      <h2 className="logs-title">Staff Logs</h2>
      
      {/* ✅ Search Input */}
      <input
        type="text"
        placeholder="Search by email, action, or title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="logs-search-input"
      />

      <table className="logs-table">
        <thead>
          <tr>
            <th>Staff Email</th>
            <th>Action</th>
            <th>Target</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log._id}>
              <td>{log.staffId?.email || 'Unknown'}</td>
              <td>{log.action}</td>
              <td>{log.details?.title || '-'}</td>
              <td>
                {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
