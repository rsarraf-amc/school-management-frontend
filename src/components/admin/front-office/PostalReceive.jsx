import { apiService } from "../../../services/apiService";
import { CrudRegister, formatDate } from "./FrontOfficeState";

const dash = (value) => value || "—";

const columns = [
  { header: "Receive ID", accessor: "id" },
  { header: "From Title", accessor: "fromTitle", render: (r) => dash(r.fromTitle) },
  { header: "Reference No", accessor: "refNo", render: (r) => dash(r.refNo) },
  { header: "Address", accessor: "address", render: (r) => dash(r.address) },
  { header: "To Title", accessor: "toTitle", render: (r) => dash(r.toTitle) },
  { header: "Date", accessor: "date", render: (r) => formatDate(r.date) },
];

const fields = [
  { key: "fromTitle", label: "From Title" },
  { key: "refNo", label: "Reference No" },
  { key: "address", label: "Address", type: "textarea" },
  { key: "toTitle", label: "To Title" },
  { key: "date", label: "Date", type: "date" },
];

const listParams = { type: "RECEIVE" };
const createExtra = { type: "RECEIVE" };

export default function PostalReceive() {
  return (
    <CrudRegister
      title="Postal Receive Log"
      entity="Receipt"
      api={apiService.frontOffice.postal}
      listParams={listParams}
      createExtra={createExtra}
      columns={columns}
      fields={fields}
    />
  );
}
