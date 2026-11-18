import { apiService } from "../../../services/apiService";
import { CrudRegister, formatDate } from "./FrontOfficeState";

const dash = (value) => value || "—";

const columns = [
  { header: "Dispatch ID", accessor: "id" },
  { header: "To Title", accessor: "toTitle", render: (r) => dash(r.toTitle) },
  { header: "Reference No", accessor: "refNo", render: (r) => dash(r.refNo) },
  { header: "Address", accessor: "address", render: (r) => dash(r.address) },
  { header: "From Title", accessor: "fromTitle", render: (r) => dash(r.fromTitle) },
  { header: "Date", accessor: "date", render: (r) => formatDate(r.date) },
];

const fields = [
  { key: "toTitle", label: "To Title" },
  { key: "refNo", label: "Reference No" },
  { key: "address", label: "Address", type: "textarea" },
  { key: "fromTitle", label: "From Title" },
  { key: "date", label: "Date", type: "date" },
];

const listParams = { type: "DISPATCH" };
const createExtra = { type: "DISPATCH" };

export default function PostalDispatch() {
  return (
    <CrudRegister
      title="Postal Dispatch Log"
      entity="Dispatch"
      api={apiService.frontOffice.postal}
      listParams={listParams}
      createExtra={createExtra}
      columns={columns}
      fields={fields}
    />
  );
}
