import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialToken = localStorage.getItem('office_manager_token') || null;
const initialUser = localStorage.getItem('office_manager_user')
  ? JSON.parse(localStorage.getItem('office_manager_user'))
  : null;

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('office_manager_token', token);
      localStorage.setItem('office_manager_user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return rejectWithValue(message);
    }
  }
);

export const checkAuthMe = createAsyncThunk(
  'auth/checkAuthMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      localStorage.removeItem('office_manager_token');
      localStorage.removeItem('office_manager_user');
      return rejectWithValue('Session expired or invalid.');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await API.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      return response.data.message;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password.';
      return rejectWithValue(message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: initialUser,
    isAuthenticated: !!initialToken,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('office_manager_token');
      localStorage.removeItem('office_manager_user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // loginAdmin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // checkAuthMe
      .addCase(checkAuthMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthMe.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
