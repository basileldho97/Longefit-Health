import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { UserCheck, ArrowRight, Building2 } from 'lucide-react';

const DepartmentHeadListPage = () => {
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchHeads();
  }, []);

  if (loading) return <LoadingSpinner message="Loading department heads..." />;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Department Heads</h1>
          <p className="page-subtitle">Leadership personnel leading functional units across the organization.</p>
        </div>
      </div>

      {heads.length === 0 ? (
        <EmptyState title="No Department Heads" message="No department head records were found." />
      ) : (
        <div className="grid-3">
          {heads.map((head) => (
            <Link key={head.id} to={`/department-heads/${head.id}`} style={{ textDecoration: 'none' }}>
              <div className="card">
                <div className="card-img-wrapper" style={{ height: '220px' }}>
                  <img
                    src={head.profile_image || '/assets/department-heads/cm-profile1.jpg'}
                    alt={head.name}
                    className="card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/180?text=Profile';
                    }}
                  />
                </div>
                <h3 className="card-title">{head.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="card-badge">{head.employee_number}</span>
                  {head.department_name && (
                    <span className="card-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-primary)' }}>
                      {head.department_name}
                    </span>
                  )}
                </div>
                <p className="card-desc">{head.profile_description || 'No profile description available.'}</p>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                    View Profile <ArrowRight size={16} />
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

export default DepartmentHeadListPage;
