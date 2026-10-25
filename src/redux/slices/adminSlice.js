import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

export const fetchAllStudents = createAsyncThunk('admin/fetchAllStudents', async (_, thunkAPI) => {
  try { return await apiService.getAllStudents(); } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});
export const fetchAllTeachers = createAsyncThunk('admin/fetchAllTeachers', async (_, thunkAPI) => {
  try { return await apiService.getAllTeachers(); } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});
export const fetchAllClasses = createAsyncThunk('admin/fetchAllClasses', async (_, thunkAPI) => {
  try { return await apiService.getAllClasses(); } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

const initialState = {
  students: [],
  teachers: [],
  classes: [],
  status: 'idle',
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudents.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAllStudents.fulfilled, (state, action) => { state.status = 'succeeded'; state.students = action.payload; })
      .addCase(fetchAllStudents.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(fetchAllTeachers.fulfilled, (state, action) => { state.teachers = action.payload; })
      .addCase(fetchAllClasses.fulfilled, (state, action) => { state.classes = action.payload; });
  }
});

export default adminSlice.reducer;
