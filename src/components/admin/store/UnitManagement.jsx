import React from "react";
import { apiService } from "../../../services/apiService";
import { CrudRegister } from "../front-office/FrontOfficeState";

const columns = [
  { header: "Unit ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Description", accessor: "description", render: (r) => r.description || "—" },
];

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "description", label: "Description", type: "textarea" },
];

const UnitManagement = () => (
  <CrudRegister title="Units" entity="Unit" api={apiService.store.units} columns={columns} fields={fields} />
);

export default UnitManagement;
