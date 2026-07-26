import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Building2, ArrowRight } from 'lucide-react';

const DepartmentListPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await API.get('/departments');
        setDepartments(response.data);
      } catch (err) {
        setError('Failed to load departments. Please make sure backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (loading) return <LoadingSpinner message="Loading departments..." />;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Explore functional departments and their dedicated staff structures.</p>
        </div>
      </div>

      {departments.length === 0 ? (
        <EmptyState title="No Departments Available" message="No department records were found." />
      ) : (
        <div className="grid-3">
          {departments.map((dept) => (
            <Link key={dept.id} to={`/departments/${dept.id}`} style={{ textDecoration: 'none' }}>
              <div className="card">
                <div className="card-img-wrapper">
                  <img
                    src={dept.profile_image || '/assets/department-logos/ambulance.png'}
                    alt={dept.name}
                    className="card-img card-img-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Department';
                    }}
                  />
                </div>
                <h3 className="card-title">{dept.name}</h3>
                <p className="card-desc">{dept.description || 'No description provided.'}</p>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {dept.employee_count || 0} Staff Member{(dept.employee_count || 0) === 1 ? '' : 's'}
                  </span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                    View Detail <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentListPage;
