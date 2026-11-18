import { Clock } from "lucide-react";
import MasterDataPanel from "./MasterDataPanel";
import { apiService } from "../../../services/apiService";

const time = (value) => (value ? String(value).slice(0, 5) : "-");

const columns = [
  { header: "Shift Name", accessor: "shiftName", render: (row) => <span className="font-bold text-slate-900">{row.shiftName}</span> },
  { header: "Time From", accessor: "startTime", render: (row) => <span className="text-slate-500 font-medium">{time(row.startTime)}</span> },
  { header: "Time To", accessor: "endTime", render: (row) => <span className="text-slate-500 font-medium">{time(row.endTime)}</span> },
];

const fields = [
  { key: "shiftName", label: "Name", required: true },
  { key: "startTime", label: "Time From", type: "time", required: true },
  { key: "endTime", label: "Time To", type: "time", required: true },
];

const ShiftManagement = () => (
  <MasterDataPanel title="Shift Setup" singular="Shift" icon={Clock} api={apiService.shifts} fields={fields} columns={columns} />
);

export default ShiftManagement;
