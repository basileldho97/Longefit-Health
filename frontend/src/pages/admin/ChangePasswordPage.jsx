import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../redux/slices/authSlice';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password cannot be identical to current password.');
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(changePassword({ currentPassword, newPassword, confirmPassword }));
      if (changePassword.fulfilled.match(resultAction)) {
        setSuccess(resultAction.payload || 'Password updated successfully!');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(resultAction.payload || 'Failed to update password. Please check your current password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/dashboard" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="form-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--accent-primary)'
          }}>
            <KeyRound size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Change Admin Password</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Update your administrator credentials for securing access to Office Manager.
          </p>
        </div>

        {error && (
          <div className="alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.95rem'
          }}>
            <CheckCircle2 size={20} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">Current Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="currentPassword"
                name="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
                tabIndex="-1"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="newPassword"
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Enter new password (min. 6 characters)"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
                tabIndex="-1"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
                tabIndex="-1"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.85rem' }}
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
