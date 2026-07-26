import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Building2, UserCheck, Users, PlusCircle, Settings, ArrowRight } from 'lucide-react';

const AdminDashboardPage = () => {
  const [counts, setCounts] = useState({ depts: 0, heads: 0, emps: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [dRes, dhRes, eRes] = await Promise.all([
          API.get('/departments'),
          API.get('/department-heads'),
          API.get('/employees')
        ]);
        setCounts({
          depts: dRes.data.length,
          heads: dhRes.data.length,
          emps: eRes.data.length
        });
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (loading) return <LoadingSpinner message="Loading admin control metrics..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Central management control panel for Office Manager records.</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span className="info-label">Departments</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{counts.depts}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
              <Building2 size={28} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <Link to="/admin/departments" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Manage List
            </Link>
            <Link to="/admin/departments/new" className="btn btn-primary btn-sm">
              <PlusCircle size={14} /> Add New
            </Link>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span className="info-label">Department Heads</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{counts.heads}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(129, 140, 248, 0.15)', borderRadius: '12px', color: '#818cf8' }}>
              <UserCheck size={28} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <Link to="/admin/department-heads" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Manage List
            </Link>
            <Link to="/admin/department-heads/new" className="btn btn-primary btn-sm">
              <PlusCircle size={14} /> Add New
            </Link>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span className="info-label">Staff Employees</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{counts.emps}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(52, 211, 153, 0.15)', borderRadius: '12px', color: '#34d399' }}>
              <Users size={28} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <Link to="/admin/employees" className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Manage List
            </Link>
            <Link to="/admin/employees/new" className="btn btn-primary btn-sm">
              <PlusCircle size={14} /> Add New
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
