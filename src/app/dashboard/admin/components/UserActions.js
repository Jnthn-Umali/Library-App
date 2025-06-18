// src/app/dashboard/admin/components/UserActions.js
import React from 'react';
import './UserActions.css';


export function EditUserModal({ isOpen, onClose, user, setUser, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-header">Edit User</h3>
        <form onSubmit={onSave} className="modal-form">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={user?.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="admin">admin</option>
              <option value="staff">staff</option>
              <option value="user">user</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={user?.age || ''}
              onChange={(e) => setUser({ ...user, age: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={user?.gender || ''}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>
    </div>

  );
}

export function DeleteUserModal({ isOpen, onClose, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-header">Confirm Delete</h3>
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this user?</p>
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={onDelete} className="delete-btn">Delete</button>
        </div>
      </div>
    </div>

  );
}

export async function handleUpdate(e, user, onClose) {
  e.preventDefault();
  try {
    await fetch(`/api/admin/users/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    onClose();
    window.location.reload(); // Refresh to reflect changes
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

export async function handleDelete(id) {
  try {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    window.location.reload(); // Refresh to reflect changes
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}