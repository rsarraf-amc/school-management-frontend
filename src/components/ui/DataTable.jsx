import { MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function DataTable({
  columns,
  data,
  actions = [],
  rowKey = (row, rowIndex) => row.id ?? row.key ?? rowIndex,
  containerClassName = "",
  tableClassName = "",
}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  const getRowKey = (row, rowIndex) => {
    if (typeof rowKey === "function") return rowKey(row, rowIndex);
    return row[rowKey] ?? rowIndex;
  };

  const columnWidths = {
    id: 150,
    name: 180,
    purpose: 260,
    phone: 150,
    source: 120,
    date: 120,
    class: 110,
    inTime: 110,
    outTime: 110,
    status: 130,
    nextFollowUp: 130,
  };

  const nowrapColumns = [
    "id",
    "phone",
    "date",
    "nextFollowUp",
    "class",
    "source",
    "inTime",
    "outTime",
  ];

  const getColumnStyle = (col) => {
    if (col.width) return { width: col.width };
    if (columnWidths[col.accessor])
      return { width: columnWidths[col.accessor] };
    return undefined;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`overflow-x-auto max-w-full ${containerClassName}`}>
      <table className={`w-full min-w-full table-auto ${tableClassName}`}>
        <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
          <tr className="text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
            {columns.map((col, index) => (
              <th
                key={index}
                style={getColumnStyle(col)}
                className="px-6 py-4 text-left align-top whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-6 py-4 text-right align-top whitespace-nowrap w-[90px]">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                className="px-6 py-8 text-center text-sm font-normal text-slate-500"
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className="group hover:bg-slate-50 transition-all duration-200"
              >
                {columns.map((col, colIndex) => {
                  const cellValue = col.render
                    ? col.render(row)
                    : row[col.accessor];

                  // Specific styling for status pills
                  if (!col.render && col.accessor === "status") {
                    let pillColor = "bg-slate-100 text-slate-600";
                    if (cellValue === "Active" || cellValue === "Resolved")
                      pillColor = "bg-emerald-100 text-emerald-700";
                    if (cellValue === "Pending" || cellValue === "Follow up")
                      pillColor = "bg-amber-100 text-amber-700";
                    if (cellValue === "Closed")
                      pillColor = "bg-rose-100 text-rose-700";
                    if (cellValue === "In Progress")
                      pillColor = "bg-indigo-100 text-indigo-700";

                    return (
                      <td
                        key={colIndex}
                        style={getColumnStyle(col)}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <span
                          className={`whitespace-nowrap text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${pillColor}`}
                        >
                          {cellValue}
                        </span>
                      </td>
                    );
                  }

                  // Default cell styling
                  return (
                    <td
                      key={colIndex}
                      style={getColumnStyle(col)}
                      className={`px-6 py-4 text-sm font-normal text-slate-700 ${
                        nowrapColumns.includes(col.accessor)
                          ? "whitespace-nowrap"
                          : "break-words"
                      } ${colIndex === 0 ? "text-slate-900" : ""}`}
                    >
                      {cellValue}
                    </td>
                  );
                })}

                {actions.length > 0 && (
                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === rowIndex ? null : rowIndex)
                      }
                      className={`p-1.5 rounded-lg transition-all border ${
                        activeMenu === rowIndex
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                          : "hover:bg-white border-transparent hover:border-slate-200 text-slate-400 hover:text-indigo-600"
                      }`}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {activeMenu === rowIndex && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-[100] py-1.5 animate-in fade-in zoom-in-95 duration-100"
                      >
                        {actions.map((action, actionIdx) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={actionIdx}
                              onClick={() => {
                                action.onClick(row);
                                setActiveMenu(null);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-bold transition-colors ${
                                action.variant === "danger"
                                  ? "text-rose-500 hover:bg-rose-50"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                              }`}
                            >
                              {Icon && <Icon size={16} strokeWidth={2.5} />}
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
