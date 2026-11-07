import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import teacherReducer from './slices/teacherSlice';
import studentReducer from './slices/studentSlice';
import { logout } from './slices/authSlice';
import { setUnauthorizedHandler } from '../services/apiClient';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    teacher: teacherReducer,
    student: studentReducer,
  },
});

// An expired or revoked token (401) signs the user out.
setUnauthorizedHandler(() => store.dispatch(logout()));
