import { Briefcase } from "lucide-react";
import MasterDataPanel from "./MasterDataPanel";
import { apiService } from "../../../services/apiService";

const columns = [
  { header: "Designation Name", accessor: "designationName", render: (row) => <span className="font-bold text-slate-900">{row.designationName}</span> },
  { header: "Description", accessor: "description", render: (row) => <span className="text-slate-500 text-xs">{row.description || "-"}</span> },
];

const fields = [
  { key: "designationName", label: "Name", required: true },
  { key: "description", label: "Description" },
];

const DesignationManagement = () => (
  <MasterDataPanel title="Designations" singular="Designation" icon={Briefcase} api={apiService.designations} fields={fields} columns={columns} />
);

export default DesignationManagement;
