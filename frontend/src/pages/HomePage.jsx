import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Building2, Users, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

const HomePage = () => {
  const [stats, setStats] = useState({ depts: 0, heads: 0, emps: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [dRes, dhRes, eRes] = await Promise.all([
          API.get('/departments'),
          API.get('/department-heads'),
          API.get('/employees')
        ]);
        setStats({
          depts: dRes.data.length,
          heads: dhRes.data.length,
          emps: eRes.data.length
        });
      } catch (err) {
        console.error('Failed loading stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div>
      <section style={{
        background: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
        padding: '3rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        marginBottom: '3rem',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '20px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <ShieldCheck size={16} /> Enterprise Personnel System
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>
          Streamlined Department & Staff Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '720px', margin: '0 auto 2rem' }}>
          Explore organization structures, department leads, and workforce directories in real time.
        </p>

        {loading ? (
          <LoadingSpinner message="Gathering organization statistics..." />
        ) : (
          <div className="grid-3" style={{ maxWidth: '900px', margin: '0 auto 2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
              <Building2 style={{ width: 36, height: 36, color: 'var(--accent-primary)', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.depts}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Departments</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
              <UserCheck style={{ width: 36, height: 36, color: '#818cf8', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.heads}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Department Heads</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem' }}>
              <Users style={{ width: 36, height: 36, color: '#34d399', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.emps}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Staff Employees</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/departments" className="btn btn-primary">
            Browse Departments <ArrowRight size={18} />
          </Link>
          <Link to="/employees" className="btn btn-secondary">
            View Staff Directory
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
