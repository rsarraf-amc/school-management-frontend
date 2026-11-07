import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { classesApi } from '../../services/api';
import { classFromApi } from '../../utils/mappers';

export const fetchTeacherClasses = createAsyncThunk(
  'teacher/fetchClasses',
  async (_teacherUserId, thunkAPI) => {
    try {
      // The backend has no teacher-to-class assignment yet, so all classes of the school are listed.
      return (await classesApi.list() ?? []).map(classFromApi);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  classes: [],
  status: 'idle',
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherClasses.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTeacherClasses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.classes = action.payload;
      })
      .addCase(fetchTeacherClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default teacherSlice.reducer;
