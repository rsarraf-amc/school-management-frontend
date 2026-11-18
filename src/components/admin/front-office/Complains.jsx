import { apiService } from "../../../services/apiService";
import { CrudRegister, formatDate } from "./FrontOfficeState";

const dash = (value) => value || "—";

const columns = [
  { header: "Complain ID", accessor: "id" },
  { header: "Complain By", accessor: "complainBy" },
  { header: "Against", accessor: "against", render: (r) => dash(r.against) },
  { header: "Date", accessor: "date", render: (r) => formatDate(r.date) },
  { header: "Status", accessor: "status" },
  { header: "Description", accessor: "description", render: (r) => dash(r.description) },
];

const fields = [
  { key: "complainBy", label: "Complain By", required: true },
  { key: "against", label: "Against" },
  { key: "date", label: "Date", type: "date" },
  { key: "status", label: "Status", required: true, options: ["Open", "In Progress", "Resolved"], default: "Open" },
  { key: "description", label: "Description", type: "textarea" },
];

export default function Complains() {
  return <CrudRegister title="Complain Register" entity="Complain" api={apiService.frontOffice.complaints} columns={columns} fields={fields} />;
}
