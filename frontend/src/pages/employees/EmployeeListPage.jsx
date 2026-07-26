import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Users, ArrowRight } from 'lucide-react';

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await API.get('/employees');
        setEmployees(response.data);
      } catch (err) {
        setError('Failed to load employee directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) return <LoadingSpinner message="Loading employee directory..." />;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees Directory</h1>
          <p className="page-subtitle">Full staff directory of operational and clinical personnel.</p>
        </div>
      </div>

      {employees.length === 0 ? (
        <EmptyState title="No Employees Found" message="No employee records exist in the system." />
      ) : (
        <div className="grid-4">
          {employees.map((emp) => (
            <Link key={emp.id} to={`/employees/${emp.id}`} style={{ textDecoration: 'none' }}>
              <div className="card">
                <div className="card-img-wrapper" style={{ height: '200px' }}>
                  <img
                    src={emp.profile_image || '/assets/employees/offemp1.jpg'}
                    alt={emp.name}
                    className="card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/180?text=Employee';
                    }}
                  />
                </div>
                <h3 className="card-title" style={{ fontSize: '1.15rem' }}>{emp.name}</h3>
                <span className="card-badge">{emp.employee_number}</span>

                {emp.department_name && (
                  <p className="card-desc" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    Dept: <span style={{ color: 'var(--text-primary)' }}>{emp.department_name}</span>
                  </p>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                    View Profile <ArrowRight size={14} />
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

export default EmployeeListPage;
