import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import { PlusCircle, Edit3, Trash2, Building2 } from 'lucide-react';

const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDepartments = async () => {
    try {
      const response = await API.get('/departments');
      setDepartments(response.data);
    } catch (err) {
      setError('Failed to load departments list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/departments/${deleteId}`);
      setDepartments(departments.filter((d) => d.id !== deleteId));
      setIsModalOpen(false);
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete department.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading departments..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Departments</h1>
          <p className="page-subtitle">Create, update, or remove department records.</p>
        </div>
        <Link to="/admin/departments/new" className="btn btn-primary">
          <PlusCircle size={18} /> Add Department
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {departments.length === 0 ? (
        <EmptyState title="No Departments" message="Click 'Add Department' to create the first department." />
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Logo</th>
                <th>Department Name</th>
                <th>Description</th>
                <th>Staff Count</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td>
                    <img
                      src={dept.profile_image || '/assets/department-logos/ambulance.png'}
                      alt={dept.name}
                      className="table-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/40?text=Logo';
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: 700 }}>{dept.name}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '360px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {dept.description || 'N/A'}
                  </td>
                  <td>
                    <span className="card-badge">
                      {dept.employee_count || 0} Member{(dept.employee_count || 0) === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Link to={`/admin/departments/${dept.id}/edit`} className="btn btn-secondary btn-sm">
                        <Edit3 size={14} /> Edit
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(dept.id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Department"
        message="Are you sure you want to delete this department? Employees assigned to this department will remain unassigned."
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default AdminDepartmentsPage;
