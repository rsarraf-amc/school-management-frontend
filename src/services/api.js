import apiClient, { unwrap } from './apiClient';

const get = async (url, params) => unwrap(await apiClient.get(url, { params }));
const post = async (url, body, config) => unwrap(await apiClient.post(url, body, config));
const put = async (url, body) => unwrap(await apiClient.put(url, body));
const patch = async (url, body, config) => unwrap(await apiClient.patch(url, body, config));
const remove = async (url) => unwrap(await apiClient.delete(url));

// Standard CRUD client for resources exposing POST/GET /x and GET/PUT/DELETE /x/:id.
const crud = (base) => ({
  list: (params) => get(base, params),
  get: (id) => get(`${base}/${id}`),
  create: (body) => post(base, body),
  update: (id, body) => put(`${base}/${id}`, body),
  remove: (id) => remove(`${base}/${id}`),
});

// Request bodies use camelCase keys; responses use PascalCase model properties.
export const authApi = {
  // Backend accepts either `email` or `username` plus `password` and returns { token }.
  login: async (identifier, password) => {
    const key = identifier.includes('@') ? 'email' : 'username';
    const data = await post('/auth/login', { [key]: identifier, password });
    if (!data?.token && typeof data !== 'string') throw new Error('Invalid username/email or password');
    return typeof data === 'string' ? data : data.token;
  },
  registerUser: (body) => apiClient.post('/users/register', body).then((r) => r.data?.data ?? null),
};

export const classesApi = crud('/classes');
export const departmentsApi = crud('/departments');
export const designationsApi = crud('/designations');
export const shiftsApi = crud('/shifts');
export const leavesApi = crud('/leaves');
export const teachersApi = crud('/teachers');
export const organizationsApi = crud('/organizations');
export const employeesApi = crud('/employee');

export const payrollApi = {
  listByEmployee: (employeeId) => get(`/payroll/employee/${employeeId}`),
};

export const feesApi = {
  listTypes: () => get('/fees/fee-types'),
  createType: (body) => post('/fees/fee-types', body),
  assign: (body) => post('/fees/assign', body),
  collect: (body) => post('/fees/collect', body),
  studentReport: (studentId) => get(`/fees/report/${studentId}`),
};

// Students are sent as multipart/form-data so photos and documents can be attached.
export const toStudentFormData = (values) => {
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (key === 'uploadFiles') {
      Array.from(value).forEach((file) => form.append('uploadFiles', file));
    } else {
      form.append(key, value);
    }
  });
  return form;
};

export const studentsApi = {
  // NOTE: the backend declares GET /students/searchAll after GET /students/:id, so it is
  // currently shadowed (swagger marks it UNREACHABLE). It starts working once the route order is fixed.
  list: () => get('/students/searchAll'),
  get: (id) => get(`/students/${id}`),
  create: (values) => post('/students', toStudentFormData(values)),
  update: (id, values) => patch(`/students/${id}/edit`, toStudentFormData(values)),
  remove: (id) => remove(`/students/${id}`),
};
