import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Users, Building2, UserCheck, ArrowLeft } from 'lucide-react';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        const response = await API.get(`/employees/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError('Employee record not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetail();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading employee record..." />;
  if (error) return <div className="alert-error">{error}</div>;
  if (!employee) return <EmptyState title="Employee Not Found" message="The requested employee record does not exist." />;

  return (
    <div>
      <Link to="/employees" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Employees
      </Link>

      <div className="detail-container">
        <div className="detail-layout-desktop">
          <div className="detail-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="nav-admin-badge" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
                Staff Employee
              </span>
              <span className="card-badge">{employee.employee_number}</span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>{employee.name}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {employee.age && (
                <div className="info-item">
                  <div className="info-label">Age</div>
                  <div className="info-value">{employee.age} years old</div>
                </div>
              )}

              <div className="info-item">
                <div className="info-label">Department</div>
                <div className="info-value">
                  {employee.department_id ? (
                    <Link to={`/departments/${employee.department_id}`} className="info-link-badge">
                      <Building2 size={16} />
                      {employee.department_name || 'View Department'}
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                  )}
                </div>
              </div>

              <div className="info-item">
                <div className="info-label">Report To</div>
                <div className="info-value">
                  {employee.report_to_head_id ? (
                    <Link to={`/department-heads/${employee.report_to_head_id}`} className="info-link-badge" style={{ background: 'rgba(129, 140, 248, 0.12)', borderColor: 'rgba(129, 140, 248, 0.3)', color: '#818cf8' }}>
                      <UserCheck size={16} />
                      {employee.report_to_head_name || 'View Department Head'}
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>None Assigned</span>
                  )}
                </div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Profile Description & Duties</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                {employee.profile_description || 'No specific role duties description provided.'}
              </p>
            </div>
          </div>

          <div className="detail-media">
            <div className="detail-img-card">
              <img
                src={employee.profile_image || '/assets/employees/offemp1.jpg'}
                alt={employee.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/250?text=Employee+Image';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
