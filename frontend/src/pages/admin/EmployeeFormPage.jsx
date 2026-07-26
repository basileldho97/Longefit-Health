import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';

const EMP_IMAGE_OPTIONS = [
  { label: 'Employee 1', path: '/assets/employees/offemp1.jpg' },
  { label: 'Employee 2', path: '/assets/employees/offemp2.jpg' },
  { label: 'Employee 3', path: '/assets/employees/offemp3.jpg' },
  { label: 'Employee 4', path: '/assets/employees/offemp4.jpg' },
  { label: 'Employee 5', path: '/assets/employees/offemp5.jpg' },
  { label: 'Employee 6', path: '/assets/employees/offemp6.jpg' }
];

const EmployeeFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [age, setAge] = useState('');
  const [profileImage, setProfileImage] = useState(EMP_IMAGE_OPTIONS[0].path);
  const [profileDescription, setProfileDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [reportToHeadId, setReportToHeadId] = useState('');

  const [departments, setDepartments] = useState([]);
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initForm = async () => {
      try {
        const [deptRes, dhRes] = await Promise.all([
          API.get('/departments'),
          API.get('/department-heads')
        ]);
        setDepartments(deptRes.data);
        setDepartmentHeads(dhRes.data);

        if (isEdit) {
          const empRes = await API.get(`/employees/${id}`);
          const e = empRes.data;
          setName(e.name || '');
          setEmployeeNumber(e.employee_number || '');
          setAge(e.age !== null && e.age !== undefined ? e.age : '');
          setProfileImage(e.profile_image || EMP_IMAGE_OPTIONS[0].path);
          setProfileDescription(e.profile_description || '');
          setDepartmentId(e.department_id || '');
          setReportToHeadId(e.report_to_head_id || '');
        }
      } catch (err) {
        setError('Failed to load required form data.');
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
      department_id: departmentId ? parseInt(departmentId, 10) : null,
      report_to_head_id: reportToHeadId ? parseInt(reportToHeadId, 10) : null
    };

    try {
      if (isEdit) {
        await API.put(`/employees/${id}`, payload);
      } else {
        await API.post('/employees', payload);
      }
      navigate('/admin/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving employee.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading employee details..." />;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <Link to="/admin/employees" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Employees Management
      </Link>

      <div className="form-card">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          {isEdit ? 'Edit Employee Record' : 'Create New Employee'}
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
                placeholder="John Smith"
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
                placeholder="EMP-2011"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                min="18"
                max="99"
                className="form-input"
                placeholder="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="departmentId">Department</label>
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

            <div className="form-group">
              <label className="form-label" htmlFor="reportToHeadId">Report To (Head)</label>
              <select
                id="reportToHeadId"
                className="form-select"
                value={reportToHeadId}
                onChange={(e) => setReportToHeadId(e.target.value)}
              >
                <option value="">-- Select Supervisor --</option>
                {departmentHeads.map((head) => (
                  <option key={head.id} value={head.id}>
                    {head.name} ({head.employee_number})
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
              {EMP_IMAGE_OPTIONS.map((opt) => (
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
                placeholder="/assets/employees/custom.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileDescription">Profile Description & Role Details</label>
            <textarea
              id="profileDescription"
              className="form-textarea"
              placeholder="Responsibilities, clinical focus, operational shifts..."
              value={profileDescription}
              onChange={(e) => setProfileDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <Link to="/admin/employees" className="btn btn-secondary">
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

export default EmployeeFormPage;
