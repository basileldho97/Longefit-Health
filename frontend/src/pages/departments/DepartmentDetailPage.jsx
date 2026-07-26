import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Building2, UserCheck, Users, ArrowLeft, ChevronRight } from 'lucide-react';

const DepartmentDetailPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentDetail = async () => {
      try {
        const response = await API.get(`/departments/${id}`);
        setDepartment(response.data);
      } catch (err) {
        setError('Department not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartmentDetail();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading department details..." />;
  if (error) return <div className="alert-error">{error}</div>;
  if (!department) return <EmptyState title="Department Not Found" message="The requested department does not exist." />;

  return (
    <div>
      <Link to="/departments" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Departments
      </Link>

      <div className="detail-container">
        <div className="detail-layout-desktop">
          <div className="detail-info">
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>{department.name}</h1>
            
            <div className="info-item" style={{ marginBottom: '2rem' }}>
              <div className="info-label">About Department</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                {department.description || 'No detailed description available.'}
              </p>
            </div>

            {/* Department Head Section */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck style={{ color: 'var(--accent-primary)' }} /> Department Leadership
              </h3>

              {department.department_heads && department.department_heads.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {department.department_heads.map((head) => (
                    <Link key={head.id} to={`/department-heads/${head.id}`} style={{ textDecoration: 'none' }}>
                      <div className="card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={head.profile_image || '/assets/department-heads/cm-profile1.jpg'}
                          alt={head.name}
                          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{head.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{head.employee_number}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No department head currently assigned.</p>
              )}
            </div>
          </div>

          <div className="detail-media">
            <div className="detail-img-card">
              <img
                src={department.profile_image || '/assets/department-logos/ambulance.png'}
                alt={department.name}
                className="contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200?text=Logo';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Staff Employees Section */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users style={{ color: '#34d399' }} /> Department Employees ({department.employees ? department.employees.length : 0})
        </h2>

        {!department.employees || department.employees.length === 0 ? (
          <EmptyState title="No Staff Members" message="There are currently no staff employees assigned to this department." />
        ) : (
          <div className="grid-4">
            {department.employees.map((emp) => (
              <Link key={emp.id} to={`/employees/${emp.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '1.25rem' }}>
                  <div className="card-img-wrapper" style={{ height: 160, marginBottom: '0.75rem' }}>
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
                  {emp.report_to_head_name && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Reports to: <span style={{ color: 'var(--text-secondary)' }}>{emp.report_to_head_name}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
