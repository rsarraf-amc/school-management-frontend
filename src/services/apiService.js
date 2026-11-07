const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000")
  .replace(/\/+$/, "");

const request = async (path, { body, headers = {}, ...options } = {}) => {
  const requestHeaders = new Headers(headers);
  const token = localStorage.getItem("token");

  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  let requestBody = body;
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    body: requestBody,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`The server returned an invalid response (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(payload.message || `Request failed (${response.status}).`);
  }

  return Object.prototype.hasOwnProperty.call(payload, "data")
    ? payload.data
    : payload;
};

const collection = (path) => ({
  list: () => request(path),
  get: (id) => request(`${path}/${encodeURIComponent(id)}`),
  create: (data) => request(path, { method: "POST", body: data }),
  update: (id, data) =>
    request(`${path}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
    }),
  remove: (id) =>
    request(`${path}/${encodeURIComponent(id)}`, { method: "DELETE" }),
});

const mapRole = (role) => {
  const normalized = String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (["admin", "organization_admin", "super_admin"].includes(normalized)) {
    return "admin";
  }
  if (["teacher", "tutor"].includes(normalized)) return "teacher";
  if (["student", "user"].includes(normalized)) return "student";
  return normalized;
};

export const apiService = {
  async login(email, password) {
    const result = await request("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (!result?.token || !result?.user) {
      throw new Error("The login response did not include a user and token.");
    }

    const role = mapRole(result.user.role);
    if (!["admin", "teacher", "student"].includes(role)) {
      throw new Error("This account role is not supported by the frontend.");
    }

    return { ...result, user: { ...result.user, role } };
  },

  getAllStudents: () => request("/students/searchAll"),
  getStudentById: (id) => request(`/students/${encodeURIComponent(id)}`),
  createStudent: (data) => request("/students", { method: "POST", body: data }),
  updateStudent: (id, data) =>
    request(`/students/${encodeURIComponent(id)}/edit`, {
      method: "PATCH",
      body: data,
    }),
  deleteStudent: (id) =>
    request(`/students/${encodeURIComponent(id)}`, { method: "DELETE" }),

  getAllTeachers: () => request("/teachers"),
  getTeacherById: (id) => request(`/teachers/${encodeURIComponent(id)}`),
  createTeacher: (data) => request("/teachers", { method: "POST", body: data }),
  updateTeacher: (id, data) =>
    request(`/teachers/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
    }),
  deleteTeacher: (id) =>
    request(`/teachers/${encodeURIComponent(id)}`, { method: "DELETE" }),

  getAllClasses: () => request("/classes"),
  getClassById: (id) => request(`/classes/${encodeURIComponent(id)}`),
  createClass: (data) => request("/classes", { method: "POST", body: data }),
  updateClass: (id, data) =>
    request(`/classes/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
    }),
  deleteClass: (id) =>
    request(`/classes/${encodeURIComponent(id)}`, { method: "DELETE" }),

  getAllEmployees: (filters = {}) => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== ""),
    );
    return request(`/employee${query.size ? `?${query}` : ""}`);
  },
  getEmployeeById: (id) => request(`/employee/${encodeURIComponent(id)}`),
  createEmployee: (data) =>
    request("/employee", { method: "POST", body: data }),
  updateEmployee: (id, data) =>
    request(`/employee/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
    }),
  deleteEmployee: (id) =>
    request(`/employee/${encodeURIComponent(id)}`, { method: "DELETE" }),

  departments: collection("/departments"),
  designations: collection("/designations"),
  leaves: collection("/leaves"),
  shifts: collection("/shifts"),
  organizations: collection("/organizations"),

  getFeeTypes: () => request("/fees/fee-types"),
  createFeeType: (data) =>
    request("/fees/fee-types", { method: "POST", body: data }),
  assignFee: (data) => request("/fees/assign", { method: "POST", body: data }),
  collectFee: (data) => request("/fees/collect", { method: "POST", body: data }),
  getStudentFeeReport: (studentId) =>
    request(`/fees/report/${encodeURIComponent(studentId)}`),
  getEmployeePayroll: (employeeId) =>
    request(`/payroll/employee/${encodeURIComponent(employeeId)}`),
  registerUser: (data) =>
    request("/users/register", { method: "POST", body: data }),

  async getTeacherClasses() {
    throw new Error(
      "The backend does not provide a teacher-to-class assignment endpoint.",
    );
  },
  async getStudentProfile() {
    throw new Error(
      "The backend does not provide a student profile endpoint linked to the signed-in user.",
    );
  },
};
