import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/api';
import { TOKEN_KEY, USER_KEY } from '../../services/apiClient';
import { isTokenExpired, userFromToken } from '../../utils/auth';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ identifier, password }, thunkAPI) => {
    try {
      const token = await authApi.login(identifier.trim(), password);
      const user = userFromToken(token);
      if (!user) return thunkAPI.rejectWithValue('Received an invalid token from the server');
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { user, token };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Restore the session from storage only while the JWT is still valid.
const loadSession = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    clearSession();
    return { user: null, token: null };
  }
  return { user: userFromToken(token), token };
};

const initialState = {
  ...loadSession(),
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      clearSession();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
