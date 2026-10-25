import React from 'react';

export const admissionReportColumns = [
  { header: "Admission No", accessor: "admissionNo" },
  { header: "Student Name", accessor: "name" },
  { header: "Class (Section)", accessor: "class", render: (row) => `${row.class} (${row.section})` },
  { header: "Father Name", accessor: "fatherName" },
  { header: "Date", accessor: "date" },
  { header: "Source", accessor: "source" },
  { header: "Status", accessor: "status" },
];

export const studentHistoryColumns = [
  { header: "Date", accessor: "date" },
  { header: "Student", accessor: "studentName" },
  { header: "Action", accessor: "action", render: (row) => (
    <span className="font-bold text-slate-900">{row.action}</span>
  )},
  { header: "Performed By", accessor: "performedBy" },
  { header: "Details", accessor: "details" },
];

export const loginCredentialsColumns = [
  { header: "Admission No", accessor: "admissionNo" },
  { header: "Student Name", accessor: "name" },
  { header: "Username", accessor: "username", render: (row) => (
    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">
      {row.username}
    </span>
  )},
  { header: "Last Login", accessor: "lastLogin" },
  { header: "Status", accessor: "status" },
];

export const categoryColumns = [
  { header: "Category Name", accessor: "name" },
  { header: "Category Code", accessor: "code" },
  { header: "Student Count", accessor: "count", render: (row) => (
    <span className="font-bold">{row.count}</span>
  )},
];

export const subjectAssignmentColumns = [
  { header: "Admission No", accessor: "admissionNo" },
  { header: "Student Name", accessor: "name" },
  { header: "Class", accessor: "class" },
  { header: "Assigned Subjects", accessor: "subjects", render: (row) => (
    <div className="flex flex-wrap gap-1">
      {row.subjects?.map((sub, i) => (
        <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100">
          {sub}
        </span>
      ))}
    </div>
  )},
];
