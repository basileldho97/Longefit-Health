import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Building2, Users, UserCheck, Shield, LogOut, LogIn, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <Building2 className="brand-icon" />
          <span>Office Manager</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/departments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span>Departments</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/department-heads" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} />
              <span>Department Heads</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span>Employees</span>
            </NavLink>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <LayoutDashboard size={18} />
                  <span>Admin Portal</span>
                </NavLink>
              </li>
              <li>
                <span className="nav-admin-badge">Admin</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout" title="Sign out of Admin Session">
                  <LogOut size={16} inline="true" style={{ marginRight: '4px' }} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Shield size={18} />
                <span>Admin Login</span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
