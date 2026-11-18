import React from "react";
import { apiService } from "../../../services/apiService";
import { CrudRegister } from "../front-office/FrontOfficeState";

const dash = (value) => value || "—";

const columns = [
  { header: "Vendor ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Phone", accessor: "phone", render: (r) => dash(r.phone) },
  { header: "Email", accessor: "email", render: (r) => dash(r.email) },
  { header: "Address", accessor: "address", render: (r) => dash(r.address) },
];

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email", type: "email" },
  { key: "address", label: "Address", type: "textarea" },
];

const VendorManagement = () => (
  <CrudRegister title="Vendors" entity="Vendor" api={apiService.store.vendors} columns={columns} fields={fields} />
);

export default VendorManagement;
