// Converts backend (PascalCase) records into the shapes the existing UI components expect.

const dateOnly = (value) => (value ? String(value).slice(0, 10) : '');

export const studentFromApi = (s) => {
  const name = [s.FirstName, s.MiddleName, s.LastName].filter(Boolean).join(' ');
  return {
    id: s.Id,
    admissionNo: s.AdmissionNumber,
    rollNo: s.RollNumber,
    firstName: s.FirstName,
    middleName: s.MiddleName,
    lastName: s.LastName,
    name,
    class: s.Class,
    classId: s.ClassId,
    section: s.Section,
    fatherName: s.ParentName,
    guardianName: s.ParentName,
    guardianPhone: s.ParentPhone,
    guardianEmail: s.ParentEmail,
    guardianOccupation: s.ParentOccupation,
    guardianEducation: s.ParentEducation,
    dob: dateOnly(s.DateOfBirth),
    gender: s.Gender,
    phone: s.MobileNumber,
    email: s.Email,
    admissionDate: dateOnly(s.AdmissionDate),
    status: 'Active',
    bloodGroup: s.BloodGroup,
    religion: s.Religion,
    address: s.Address,
    aadharNumber: s.AadharNumber,
    classFee: s.ClassFee,
    photo:
      s.ProfilePhotoUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || s.Id)}`,
    raw: s,
  };
};

export const employeeFromApi = (e) => ({
  id: e.Id,
  staffId: e.EmployeeNumber,
  firstName: e.FirstName,
  lastName: e.LastName,
  name: `${e.FirstName ?? ''} ${e.LastName ?? ''}`.trim(),
  email: e.Email,
  phone: e.ContactNumber,
  gender: e.Gender,
  roleId: e.RoleId,
  departmentId: e.DepartmentId,
  designationId: e.DesignationId,
  shiftId: e.ShiftId,
  employmentType: e.EmploymentType,
  basicPay: e.BasicPay,
  netAmount: e.NetAmount,
  dateOfJoining: dateOnly(e.DateOfJoining),
  dob: dateOnly(e.DateOfBirth),
  photo: e.ProfilePhotoUrl,
  status: e.IsActive === false ? 'Inactive' : 'Active',
  raw: e,
});

export const classFromApi = (c) => ({
  id: c.Id,
  name: c.Name,
  fee: c.Fee,
  raw: c,
});

export const departmentFromApi = (d) => ({
  id: d.Id,
  name: d.DepartmentName,
  description: d.Description,
});

export const designationFromApi = (d) => ({
  id: d.Id,
  name: d.DesignationName,
  description: d.Description,
});

export const shiftFromApi = (s) => ({
  id: s.Id,
  name: s.ShiftName,
  startTime: s.StartTime,
  endTime: s.EndTime,
  description: s.Description,
});

export const leaveFromApi = (l) => ({
  id: l.Id,
  leaveType: l.LeaveType,
  startDate: dateOnly(l.StartDate),
  endDate: dateOnly(l.EndDate),
  reason: l.Reason,
  employeeId: l.EmployeeId,
  employeeName: l.employee ? `${l.employee.FirstName ?? ''} ${l.employee.LastName ?? ''}`.trim() : '',
});

export const feeTypeFromApi = (f) => ({
  id: f.Id,
  name: f.Name,
  description: f.Description,
  amount: f.Amount,
  frequency: f.Frequency,
});
