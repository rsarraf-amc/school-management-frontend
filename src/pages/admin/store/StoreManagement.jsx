import { Outlet, useNavigate, useLocation } from "react-router-dom";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function StoreManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/vendors")) return { title: "Vendor Management", desc: "Manage suppliers and vendor records." };
    if (path.includes("/products")) return { title: "Product Catalog", desc: "View and manage store items and products." };
    if (path.includes("/category")) return { title: "Product Categories", desc: "Manage classification of store items." };
    if (path.includes("/sub-category")) return { title: "Product Sub-Categories", desc: "Manage nested classification of store items." };
    if (path.includes("/transactions")) return { title: "Inventory Transactions", desc: "Record buy and sell events for store products." };
    if (path.includes("/units")) return { title: "Unit Management", desc: "Manage measurement units for products." };
    if (path.includes("/reports")) return { title: "Sales Reports", desc: "Detailed analytical reports of store sales." };

    return {
      title: "Store & Inventory",
      desc: "Comprehensive management of school products, vendors, and inventory transactions.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex = location.pathname === "/admin/store" || location.pathname === "/admin/store/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/store")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
