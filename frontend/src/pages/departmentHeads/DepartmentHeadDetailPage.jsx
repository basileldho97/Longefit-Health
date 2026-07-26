import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { UserCheck, Building2, Users, ArrowLeft } from 'lucide-react';

const DepartmentHeadDetailPage = () => {
  const { id } = useParams();
  const [head, setHead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeadDetail = async () => {
      try {
        const response = await API.get(`/department-heads/${id}`);
        setHead(response.data);
      } catch (err) {
        setError('Department head not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchHeadDetail();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading profile details..." />;
  if (error) return <div className="alert-error">{error}</div>;
  if (!head) return <EmptyState title="Profile Not Found" message="The requested department head does not exist." />;

  return (
    <div>
      <Link to="/department-heads" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Department Heads
      </Link>

      <div className="detail-container">
        <div className="detail-layout-desktop">
          <div className="detail-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="nav-admin-badge" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', borderColor: 'rgba(129, 140, 248, 0.3)' }}>
                Department Head
              </span>
              <span className="card-badge">{head.employee_number}</span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>{head.name}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
              {head.age && (
                <div className="info-item">
                  <div className="info-label">Age</div>
                  <div className="info-value">{head.age} years old</div>
                </div>
              )}

              <div className="info-item">
                <div className="info-label">Department</div>
                <div className="info-value">
                  {head.department_id ? (
                    <Link to={`/departments/${head.department_id}`} className="info-link-badge">
                      <Building2 size={16} />
                      {head.department_name || 'View Department'}
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                  )}
                </div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Profile Description</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                {head.profile_description || 'No detailed biography provided.'}
              </p>
            </div>
          </div>

          <div className="detail-media">
            <div className="detail-img-card">
              <img
                src={head.profile_image || '/assets/department-heads/cm-profile1.jpg'}
                alt={head.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/250?text=Department+Head';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Supervised Employees Section */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users style={{ color: '#34d399' }} /> Direct Reports ({head.supervised_employees ? head.supervised_employees.length : 0})
        </h2>

        {!head.supervised_employees || head.supervised_employees.length === 0 ? (
          <EmptyState title="No Direct Reports" message="No employees currently report directly to this department head." />
        ) : (
          <div className="grid-4">
            {head.supervised_employees.map((emp) => (
              <Link key={emp.id} to={`/employees/${emp.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '1.25rem' }}>
                  <div className="card-img-wrapper" style={{ height: 150, marginBottom: '0.75rem' }}>
                    <img
                      src={emp.profile_image || '/assets/employees/offemp1.jpg'}
                      alt={emp.name}
                      className="card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Employee';
                      }}
                    />
                  </div>
                  <h4 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{emp.name}</h4>
                  <span className="card-badge">{emp.employee_number}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentHeadDetailPage;
