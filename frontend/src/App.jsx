import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthMe } from './redux/slices/authSlice';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';


// Public Detail/List Pages
import DepartmentListPage from './pages/departments/DepartmentListPage';
import DepartmentDetailPage from './pages/departments/DepartmentDetailPage';
import DepartmentHeadListPage from './pages/departmentHeads/DepartmentHeadListPage';
import DepartmentHeadDetailPage from './pages/departmentHeads/DepartmentHeadDetailPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminDepartmentsPage from './pages/admin/AdminDepartmentsPage';
import DepartmentFormPage from './pages/admin/DepartmentFormPage';
import AdminDepartmentHeadsPage from './pages/admin/AdminDepartmentHeadsPage';
import DepartmentHeadFormPage from './pages/admin/DepartmentHeadFormPage';
import AdminEmployeesPage from './pages/admin/AdminEmployeesPage';
import EmployeeFormPage from './pages/admin/EmployeeFormPage';
import ChangePasswordPage from './pages/admin/ChangePasswordPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('office_manager_token');
    if (token) {
      dispatch(checkAuthMe());
    }
  }, [dispatch]);

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/admin-login" element={<LoginPage />} />


          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/departments/:id" element={<DepartmentDetailPage />} />

          <Route path="/department-heads" element={<DepartmentHeadListPage />} />
          <Route path="/department-heads/:id" element={<DepartmentHeadDetailPage />} />

          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/change-password" element={<ChangePasswordPage />} />

            <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
            <Route path="/admin/departments/new" element={<DepartmentFormPage />} />
            <Route path="/admin/departments/:id/edit" element={<DepartmentFormPage />} />

            <Route path="/admin/department-heads" element={<AdminDepartmentHeadsPage />} />
            <Route path="/admin/department-heads/new" element={<DepartmentHeadFormPage />} />
            <Route path="/admin/department-heads/:id/edit" element={<DepartmentHeadFormPage />} />

            <Route path="/admin/employees" element={<AdminEmployeesPage />} />
            <Route path="/admin/employees/new" element={<EmployeeFormPage />} />
            <Route path="/admin/employees/:id/edit" element={<EmployeeFormPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}


export default App;
