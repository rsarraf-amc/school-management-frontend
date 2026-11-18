import { apiService } from "../../../services/apiService";
import { CrudRegister, formatDate } from "./FrontOfficeState";

const dash = (value) => value || "—";

const columns = [
  { header: "Name / Caller", accessor: "name" },
  { header: "Phone", accessor: "phone", render: (r) => dash(r.phone) },
  { header: "Date", accessor: "date", render: (r) => formatDate(r.date) },
  { header: "Type", accessor: "type" },
  { header: "Duration", accessor: "duration", render: (r) => dash(r.duration) },
  { header: "Description", accessor: "description", render: (r) => dash(r.description) },
];

const fields = [
  { key: "name", label: "Name / Caller", required: true },
  { key: "phone", label: "Phone" },
  { key: "date", label: "Date", type: "date" },
  { key: "type", label: "Type", required: true, options: ["Incoming", "Outgoing"], default: "Incoming" },
  { key: "duration", label: "Duration" },
  { key: "description", label: "Description", type: "textarea" },
];

export default function PhoneLog() {
  return <CrudRegister title="Phone Call Log" entity="Call" api={apiService.frontOffice.phoneLogs} columns={columns} fields={fields} />;
}
