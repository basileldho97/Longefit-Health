import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';

const LOGO_OPTIONS = [
  { label: 'Ambulance Logo', path: '/assets/department-logos/ambulance.png' },
  { label: 'Hospital Symbol Logo', path: '/assets/department-logos/drop-with-hospital-symbol.png' },
  { label: 'ECG Heart Logo', path: '/assets/department-logos/heart-with-electrocardiogram.png' },
  { label: 'Human Brain Logo', path: '/assets/department-logos/human-brain.png' },
  { label: 'Pills Bottle Logo', path: '/assets/department-logos/pills-bottle.png' },
  { label: 'Test Tubes Logo', path: '/assets/department-logos/test-tubes.png' }
];

const DepartmentFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState(LOGO_OPTIONS[0].path);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchDept = async () => {
        try {
          const res = await API.get(`/departments/${id}`);
          setName(res.data.name || '');
          setProfileImage(res.data.profile_image || LOGO_OPTIONS[0].path);
          setDescription(res.data.description || '');
        } catch (err) {
          setError('Failed to fetch department details for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchDept();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Department Name is required.');
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      profile_image: profileImage,
      description: description.trim()
    };

    try {
      if (isEdit) {
        await API.put(`/departments/${id}`, payload);
      } else {
        await API.post('/departments', payload);
      }
      navigate('/admin/departments');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving department.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading department details..." />;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <Link to="/admin/departments" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Departments Management
      </Link>

      <div className="form-card">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          {isEdit ? 'Edit Department' : 'Create New Department'}
        </h2>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Department Name *</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="e.g., Cardiology & Critical Care"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileImage">Department Logo Image</label>
            <select
              id="profileImage"
              className="form-select"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            >
              {LOGO_OPTIONS.map((opt) => (
                <option key={opt.path} value={opt.path}>
                  {opt.label} ({opt.path})
                </option>
              ))}
            </select>

            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or enter custom image path:</label>
              <input
                type="text"
                className="form-input"
                style={{ marginTop: '0.25rem' }}
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="/assets/department-logos/custom.png"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Department Description</label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Describe department operations, specialization, and services..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <Link to="/admin/departments" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={18} />
              {submitting ? 'Saving...' : (isEdit ? 'Update Department' : 'Create Department')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentFormPage;
