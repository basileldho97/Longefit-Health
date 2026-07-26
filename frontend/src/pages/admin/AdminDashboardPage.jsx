import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Building2, UserCheck, Users, PlusCircle, KeyRound, Shield, ArrowRight } from 'lucide-react';

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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Central management control panel for Office Manager records.</p>
        </div>
        <div>
          <Link to="/admin/change-password" className="btn btn-secondary" style={{ gap: '0.5rem' }}>
            <KeyRound size={18} /> Change Password
          </Link>
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

      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
              <Shield size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Admin Security & Account Settings</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Update your administrator account password anytime to maintain system security.</p>
            </div>
          </div>
          <Link to="/admin/change-password" className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <KeyRound size={16} /> Password Settings <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

