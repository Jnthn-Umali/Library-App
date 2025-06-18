// src/app/dashboard/admin/components/UsersTable.js
'use client';
import React, { useState } from 'react';
import {
  EditUserModal,
  DeleteUserModal,
  handleUpdate,
  handleDelete,
} from './UserActions';
import './UserTable.css';

export default function UsersTable({ users }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (user) => {
    const flattened = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.info?.role || 'user',
      age: user.info?.age || '',
      gender: user.info?.gender || '',
    };
    setSelectedUser(flattened);
    setIsEditModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    return (
      name.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <section className="mb-10">
      <div className="users-container">
        <h2 className="users-title">Users</h2>

        <div className="mb-4 flex justify-start">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="users-search"
          />
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm users-table">
            <thead>
              <tr>
                {['Name', 'Email', 'Age', 'Gender', 'Role', 'Created At', 'Actions'].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr
                    key={u._id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.info?.age ?? '-'}</td>
                    <td>{u.info?.gender ?? '-'}</td>
                    <td>{u.info?.role ?? '-'}</td>
                    <td>
                      {u.info?.createdAt
                        ? new Date(u.info.createdAt).toLocaleString()
                        : '-'}
                    </td>
                    <td className="space-x-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="users-action-button edit"
                        aria-label={`Edit user ${u.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(u._id);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="users-action-button delete"
                        aria-label={`Delete user ${u.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        setUser={setSelectedUser}
        onSave={(e) =>
          handleUpdate(e, selectedUser, () => setIsEditModalOpen(false))
        }
      />

      {/* Delete Modal */}
      <DeleteUserModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onDelete={() => {
          handleDelete(userToDelete);
          setIsDeleteConfirmOpen(false);
        }}
      />
    </section>
  );
}
