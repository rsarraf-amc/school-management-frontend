// Role ids seeded by the backend (seed-roles).
export const ROLE_IDS = {
  SYSTEM_ADMIN: 1,
  SCHOOL_ADMIN: 2,
  TEACHER: 3,
  STUDENT: 4,
};

// The frontend has admin, teacher and student portals; all other staff roles use the admin portal.
export const roleFromRoleId = (roleId) => {
  if (roleId === ROLE_IDS.TEACHER) return 'teacher';
  if (roleId === ROLE_IDS.STUDENT) return 'student';
  return 'admin';
};

export const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeJwt(token);
  return !payload?.exp || payload.exp * 1000 <= Date.now();
};

export const userFromToken = (token) => {
  const payload = decodeJwt(token);
  if (!payload) return null;
  return {
    id: payload.id,
    email: payload.email,
    username: payload.username,
    name: payload.username || payload.email,
    roleId: payload.roleId,
    role: roleFromRoleId(payload.roleId),
  };
};
