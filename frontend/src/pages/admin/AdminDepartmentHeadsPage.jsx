import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import { PlusCircle, Edit3, Trash2, UserCheck } from 'lucide-react';

const AdminDepartmentHeadsPage = () => {
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHeads = async () => {
    try {
      const response = await API.get('/department-heads');
      setHeads(response.data);
    } catch (err) {
      setError('Failed to load department heads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeads();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/department-heads/${deleteId}`);
      setHeads(heads.filter((h) => h.id !== deleteId));
      setIsModalOpen(false);
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete department head.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading department heads..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Department Heads</h1>
          <p className="page-subtitle">Add, edit, or remove leadership personnel.</p>
        </div>
        <Link to="/admin/department-heads/new" className="btn btn-primary">
          <PlusCircle size={18} /> Add Department Head
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {heads.length === 0 ? (
        <EmptyState title="No Department Heads" message="Click 'Add Department Head' to add a leader." />
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Photo</th>
                <th>Name</th>
                <th>Employee #</th>
                <th>Age</th>
                <th>Department</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {heads.map((head) => (
                <tr key={head.id}>
                  <td>
                    <img
                      src={head.profile_image || '/assets/department-heads/cm-profile1.jpg'}
                      alt={head.name}
                      className="table-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/40?text=Head';
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: 700 }}>{head.name}</td>
                  <td>
                    <span className="card-badge">{head.employee_number}</span>
                  </td>
                  <td>{head.age ? `${head.age} yrs` : 'N/A'}</td>
                  <td>
                    {head.department_name ? (
                      <span className="card-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-primary)' }}>
                        {head.department_name}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Link to={`/admin/department-heads/${head.id}/edit`} className="btn btn-secondary btn-sm">
                        <Edit3 size={14} /> Edit
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(head.id)}>
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
        title="Delete Department Head"
        message="Are you sure you want to delete this department head record? Employees reporting to this head will have their report-to field set to null."
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default AdminDepartmentHeadsPage;
