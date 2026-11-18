import React from "react";
import { apiService } from "../../../services/apiService";
import { CrudRegister } from "../front-office/FrontOfficeState";

const columns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Category", accessor: "category", render: (r) => r.category || "—" },
  { header: "Description", accessor: "description", render: (r) => r.description || "—" },
];

const fields = [
  { key: "name", label: "Name", required: true },
  { key: "category", label: "Category" },
  { key: "description", label: "Description", type: "textarea" },
];

const SubCategoryManagement = () => (
  <CrudRegister title="Sub Categories" entity="Sub Category" api={apiService.store.subCategories} columns={columns} fields={fields} />
);

export default SubCategoryManagement;
