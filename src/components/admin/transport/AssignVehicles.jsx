import React, { useState } from "react";
import { Plus, Link, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState, inputClass } from "./TransportState";

const AssignVehicles = () => {
  const { data, loading, error, reload } = useAsync(async () => {
    const [routes, vehicles] = await Promise.all([
      apiService.transport.routes.list(),
      apiService.transport.vehicles.list(),
    ]);
    return { routes, vehicles };
  }, { routes: [], vehicles: [] });
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const { routes, vehicles } = data;
  const assigned = routes.filter((r) => r.vehicleId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routeId || !vehicleId) {
      setFormError("Select both a route and a vehicle.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await apiService.transport.routes.update(routeId, { VehicleId: Number(vehicleId) });
      setRouteId("");
      setVehicleId("");
      await reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnassign = async (row) => {
    if (!window.confirm(`Remove vehicle from route ${row.routeName}?`)) return;
    try {
      await apiService.transport.routes.update(row.id, { VehicleId: null });
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: "Route", accessor: "routeName", render: (row) => <span className="font-bold text-slate-900">{row.routeName}</span> },
    { header: "Vehicle", accessor: "vehicle", render: (row) => <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.vehicle?.vehicleNumber || row.vehicleId}</span> },
  ];

  const actions = [{ icon: Trash2, label: "Unassign", onClick: handleUnassign }];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
            <Link size={18} className="text-blue-600" /> Assign Vehicle to Route
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Route *</label>
              <select value={routeId} onChange={(e) => setRouteId(e.target.value)} className={inputClass}>
                <option value="">Select Route</option>
                {routes.map((r) => <option key={r.id} value={r.id}>{r.routeName}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle *</label>
              <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={inputClass}>
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.vehicleNumber}{v.vehicleType ? ` (${v.vehicleType})` : ""}</option>)}
              </select>
            </div>
            <FormMessage error={formError} />
            <button type="submit" disabled={saving} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
              <Plus size={18} /> {saving ? "Saving..." : "Save Assignment"}
            </button>
          </form>
        </div>
      </div>

      <div className="xl:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">Assigned Vehicles List</h3>
          </div>
          <LoadState loading={loading} error={error} />
          {!loading && !error && <DataTable columns={columns} data={assigned} actions={actions} />}
        </div>
      </div>
    </div>
  );
};

export default AssignVehicles;
