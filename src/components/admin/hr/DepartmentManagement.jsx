import { Building } from "lucide-react";
import MasterDataPanel from "./MasterDataPanel";
import { apiService } from "../../../services/apiService";

const columns = [
  { header: "Department Name", accessor: "departmentName", render: (row) => <span className="font-bold text-slate-900">{row.departmentName}</span> },
  { header: "Description", accessor: "description", render: (row) => <span className="text-slate-500 text-xs">{row.description || "-"}</span> },
];

const fields = [
  { key: "departmentName", label: "Name", required: true },
  { key: "description", label: "Description" },
];

const DepartmentManagement = () => (
  <MasterDataPanel title="Departments" singular="Department" icon={Building} api={apiService.departments} fields={fields} columns={columns} />
);

export default DepartmentManagement;
