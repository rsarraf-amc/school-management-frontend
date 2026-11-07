import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentsApi, teachersApi, classesApi } from '../../services/api';
import { studentFromApi, classFromApi } from '../../utils/mappers';

export const fetchAllStudents = createAsyncThunk('admin/fetchAllStudents', async (_, thunkAPI) => {
  try { return (await studentsApi.list() ?? []).map(studentFromApi); } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});
export const fetchAllTeachers = createAsyncThunk('admin/fetchAllTeachers', async (_, thunkAPI) => {
  try { return await teachersApi.list() ?? []; } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});
export const fetchAllClasses = createAsyncThunk('admin/fetchAllClasses', async (_, thunkAPI) => {
  try { return (await classesApi.list() ?? []).map(classFromApi); } catch (error) { return thunkAPI.rejectWithValue(error.message); }
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
