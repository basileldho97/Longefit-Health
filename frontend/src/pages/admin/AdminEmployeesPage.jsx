import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import { PlusCircle, Edit3, Trash2, Users } from 'lucide-react';

const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await API.get('/employees');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employee list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/employees/${deleteId}`);
      setEmployees(employees.filter((e) => e.id !== deleteId));
      setIsModalOpen(false);
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee record.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading employee directory..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Employees</h1>
          <p className="page-subtitle">Add, edit, or remove staff employee records.</p>
        </div>
        <Link to="/admin/employees/new" className="btn btn-primary">
          <PlusCircle size={18} /> Add Employee
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {employees.length === 0 ? (
        <EmptyState title="No Employees" message="Click 'Add Employee' to create the first employee record." />
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
                <th>Reports To</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <img
                      src={emp.profile_image || '/assets/employees/offemp1.jpg'}
                      alt={emp.name}
                      className="table-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/40?text=Emp';
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: 700 }}>{emp.name}</td>
                  <td>
                    <span className="card-badge">{emp.employee_number}</span>
                  </td>
                  <td>{emp.age ? `${emp.age} yrs` : 'N/A'}</td>
                  <td>
                    {emp.department_name ? (
                      <span className="card-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-primary)' }}>
                        {emp.department_name}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    {emp.report_to_head_name ? (
                      <span style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.85rem' }}>
                        {emp.report_to_head_name}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>None</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Link to={`/admin/employees/${emp.id}/edit`} className="btn btn-secondary btn-sm">
                        <Edit3 size={14} /> Edit
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(emp.id)}>
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
        title="Delete Employee Record"
        message="Are you sure you want to permanently delete this employee record?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default AdminEmployeesPage;
