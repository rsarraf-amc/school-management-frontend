const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000")
  .replace(/\/+$/, "");

// The backend returns PascalCase model columns (Id, FirstName, ...); the UI uses camelCase.
const SENSITIVE_KEYS = new Set(["password", "loginPassword"]);
const KEY_ALIASES = {
  parentName: "guardianName",
  parentPhone: "guardianPhone",
  parentEmail: "guardianEmail",
  parentOccupation: "guardianOccupation",
  parentEducation: "guardianEducation",
};

const toCamelKey = (key) => {
  const camel = key.charAt(0).toLowerCase() + key.slice(1);
  return KEY_ALIASES[camel] || camel;
};

const normalize = (value) => {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, entry]) => [toCamelKey(key), entry])
        .filter(([key]) => !SENSITIVE_KEYS.has(key))
        // One-time issued credentials intentionally keep their password.
        .map(([key, entry]) => [key, key === "credentials" ? entry : normalize(entry)]),
    );
  }
  return value;
};

const ROLE_BY_ID = {
  1: "admin", // System Admin
  2: "admin", // School Admin
  3: "teacher",
  4: "student",
};

const decodeToken = (token) => {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(part)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

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
    if (response.status === 401 && token && path !== "/auth/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.assign("/login");
    }
    const details = Array.isArray(payload.errors) ? ` ${payload.errors.join(" ")}` : "";
    throw new Error(
      `${payload.message || `Request failed (${response.status}).`}${details}`,
    );
  }

  return normalize(
    Object.prototype.hasOwnProperty.call(payload, "data")
      ? payload.data
      : payload,
  );
};

const collection = (path) => ({
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v != null),
    ).toString();
    return request(query ? `${path}?${query}` : path);
  },
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

export const apiService = {
  // The backend login returns only { token }; the user is read from the JWT payload.
  async login(identifier, password) {
    const value = identifier.trim();
    const result = await request("/auth/login", {
      method: "POST",
      body: {
        [value.includes("@") ? "email" : "username"]: value,
        password,
      },
    });

    const claims = result?.token ? decodeToken(result.token) : null;
    if (!claims) {
      throw new Error("The login response did not include a valid token.");
    }

    const role = ROLE_BY_ID[claims.roleId];
    if (!role) {
      throw new Error("This account role is not supported by the frontend.");
    }

    return {
      token: result.token,
      user: {
        id: claims.id,
        name: claims.username || claims.email,
        email: claims.email,
        username: claims.username,
        roleId: claims.roleId,
        studentId: claims.studentId ?? null,
        teacherId: claims.teacherId ?? null,
        role,
      },
    };
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

  attendance: {
    ...collection("/attendance"),
    saveBulk: (data) => request("/attendance/bulk", { method: "POST", body: data }),
  },
  library: {
    books: collection("/library/books"),
    issues: {
      ...collection("/library/issues"),
      returnBook: (id, data = {}) =>
        request(`/library/issues/${encodeURIComponent(id)}/return`, { method: "PATCH", body: data }),
    },
  },
  transport: {
    vehicles: collection("/transport/vehicles"),
    routes: collection("/transport/routes"),
    assignments: collection("/transport/assignments"),
    drivers: collection("/transport/drivers"),
    stoppages: collection("/transport/stoppages"),
    schedules: collection("/transport/schedules"),
  },
  exams: {
    ...collection("/exams"),
    results: collection("/exams/results"),
  },
  examSetup: {
    types: collection("/exam-setup/types"),
    grades: collection("/exam-setup/grades"),
    observationTypes: collection("/exam-setup/observation-types"),
    observations: collection("/exam-setup/observations"),
    assessments: collection("/exam-setup/assessments"),
  },
  store: {
    items: collection("/store/items"),
    transactions: collection("/store/transactions"),
    vendors: collection("/store/vendors"),
    units: collection("/store/units"),
    subCategories: collection("/store/sub-categories"),
  },
  academics: {
    holidays: collection("/academics/holidays"),
    classSubjects: collection("/academics/class-subjects"),
    studentSubjects: collection("/academics/student-subjects"),
    studentCategories: collection("/academics/student-categories"),
    promote: (data) => request("/academics/promote", { method: "POST", body: data }),
  },
  accounts: {
    expenseHeads: collection("/accounts/expense-heads"),
    expenses: collection("/accounts/expenses"),
    incomeHeads: collection("/accounts/income-heads"),
    incomes: collection("/accounts/incomes"),
  },
  homework: {
    ...collection("/homework"),
    submissions: collection("/homework/submissions"),
  },
  communicate: {
    notices: collection("/communicate/notices"),
    sms: collection("/communicate/sms"),
  },
  frontOffice: {
    visitors: {
      ...collection("/front-office/visitors"),
      checkout: (id) =>
        request(`/front-office/visitors/${encodeURIComponent(id)}/checkout`, { method: "PATCH" }),
    },
    enquiries: collection("/front-office/enquiries"),
    complaints: collection("/front-office/complaints"),
    phoneLogs: collection("/front-office/phone-logs"),
    postal: collection("/front-office/postal"),
  },
  timetable: {
    ...collection("/timetable"),
    subjects: collection("/timetable/subjects"),
  },

  getFeeTypes: () => request("/fees/fee-types"),
  createFeeType: (data) =>
    request("/fees/fee-types", { method: "POST", body: data }),
  assignFee: (data) => request("/fees/assign", { method: "POST", body: data }),
  collectFee: (data) => request("/fees/collect", { method: "POST", body: data }),
  getStudentFeeReport: (studentId) =>
    request(`/fees/report/${encodeURIComponent(studentId)}`),
  getFeePayments: () => request("/fees/payments"),
  getFeeAssignments: () => request("/fees/assignments"),
  getEmployeePayroll: (employeeId) =>
    request(`/payroll/employee/${encodeURIComponent(employeeId)}`),
  getPayrolls: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v != null),
    ).toString();
    return request(`/payroll/dashboard${query ? `?${query}` : ""}`);
  },
  createPayroll: (data) => request("/payroll", { method: "POST", body: data }),
  payPayroll: (id, data) =>
    request(`/payroll/${encodeURIComponent(id)}/pay`, { method: "PATCH", body: data }),
  registerUser: (data) =>
    request("/users/register", { method: "POST", body: data }),

  // Self-service endpoints for the signed-in teacher/student (linked via the login).
  getTeacherClasses: () => request("/teachers/me/classes"),
  getStudentProfile: () => request("/students/me"),
  teacherSelf: {
    profile: () => request("/teachers/me"),
    classes: () => request("/teachers/me/classes"),
    timetable: () => request("/teachers/me/timetable"),
  },
  studentSelf: {
    profile: () => request("/students/me"),
    attendance: () => request("/students/me/attendance"),
    exams: () => request("/students/me/exams"),
    results: () => request("/students/me/results"),
    timetable: () => request("/students/me/timetable"),
    fees: () => request("/students/me/fees"),
  },
  // Creates the portal login, or resets its password; the password is returned once.
  issueStudentLogin: (id) =>
    request(`/students/${encodeURIComponent(id)}/credentials`, { method: "POST", body: {} }),
  issueTeacherLogin: (id) =>
    request(`/teachers/${encodeURIComponent(id)}/credentials`, { method: "POST", body: {} }),
};
