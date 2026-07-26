import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';

const HEAD_IMAGE_OPTIONS = [
  { label: 'Profile 1 (Dr. Sarah)', path: '/assets/department-heads/cm-profile1.jpg' },
  { label: 'Profile 2 (Dr. Robert)', path: '/assets/department-heads/cm-profile2.jpg' },
  { label: 'Profile 3 (Dr. Elena)', path: '/assets/department-heads/cm-profile3.jpg' },
  { label: 'Profile 4 (Dr. Marcus)', path: '/assets/department-heads/cm-profile4.jpg' },
  { label: 'Profile 5 (Olivia)', path: '/assets/department-heads/cm-profile5.jpg' },
  { label: 'Profile 6 (Daniel)', path: '/assets/department-heads/cm-profile6.jpg' }
];

const DepartmentHeadFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [age, setAge] = useState('');
  const [profileImage, setProfileImage] = useState(HEAD_IMAGE_OPTIONS[0].path);
  const [profileDescription, setProfileDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initForm = async () => {
      try {
        // Fetch departments list for selection dropdown
        const deptRes = await API.get('/departments');
        setDepartments(deptRes.data);

        if (isEdit) {
          const headRes = await API.get(`/department-heads/${id}`);
          const h = headRes.data;
          setName(h.name || '');
          setEmployeeNumber(h.employee_number || '');
          setAge(h.age !== null && h.age !== undefined ? h.age : '');
          setProfileImage(h.profile_image || HEAD_IMAGE_OPTIONS[0].path);
          setProfileDescription(h.profile_description || '');
          setDepartmentId(h.department_id || '');
        }
      } catch (err) {
        setError('Failed to load required data.');
      } finally {
        setLoading(false);
      }
    };
    initForm();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!employeeNumber.trim()) {
      setError('Employee number is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      employee_number: employeeNumber.trim(),
      age: age ? parseInt(age, 10) : null,
      profile_image: profileImage,
      profile_description: profileDescription.trim(),
      department_id: departmentId ? parseInt(departmentId, 10) : null
    };

    try {
      if (isEdit) {
        await API.put(`/department-heads/${id}`, payload);
      } else {
        await API.post('/department-heads', payload);
      }
      navigate('/admin/department-heads');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving department head.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading form data..." />;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <Link to="/admin/department-heads" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Department Heads
      </Link>

      <div className="form-card">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          {isEdit ? 'Edit Department Head' : 'Create Department Head'}
        </h2>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Dr. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="employeeNumber">Employee Number *</label>
              <input
                id="employeeNumber"
                type="text"
                className="form-input"
                placeholder="HD-1005"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                min="18"
                max="99"
                className="form-input"
                placeholder="45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="departmentId">Assigned Department</label>
              <select
                id="departmentId"
                className="form-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileImage">Profile Image Asset</label>
            <select
              id="profileImage"
              className="form-select"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
            >
              {HEAD_IMAGE_OPTIONS.map((opt) => (
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
                placeholder="/assets/department-heads/custom.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileDescription">Profile Description & Biography</label>
            <textarea
              id="profileDescription"
              className="form-textarea"
              placeholder="Summary of experience, qualifications, and department responsibilities..."
              value={profileDescription}
              onChange={(e) => setProfileDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <Link to="/admin/department-heads" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={18} />
              {submitting ? 'Saving...' : (isEdit ? 'Update Record' : 'Create Record')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentHeadFormPage;
