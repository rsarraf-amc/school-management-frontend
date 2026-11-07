import { useState } from "react";
import { useParams } from "react-router-dom";
import useApiData from "../../../hooks/useApiData";
import { feesApi } from "../../../services/api";
import { studentFromApi, feeTypeFromApi } from "../../../utils/mappers";
import { buildLedger, formatDate } from "./feeUtils";

export default function FeeCollectionDetail() {
  const { studentId } = useParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [form, setForm] = useState({
    feeTypeId: "",
    paidAmount: "",
    paidOn: new Date().toISOString().slice(0, 10),
    receiptNumber: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    data: report,
    loading,
    error,
    reload,
  } = useApiData(() => feesApi.studentReport(studentId), [studentId]);

  const student = report?.student ? studentFromApi(report.student) : {};
  const ledger = buildLedger(report);
  const payments = report?.payments || [];
  const totalOutstanding = ledger.reduce((sum, r) => sum + r.balance, 0);

  // Fee types the student has been assigned (one option per type)
  const assignedTypes = [
    ...new Map(
      (report?.assignedFees || [])
        .filter((a) => a.feeType)
        .map((a) => [a.FeeTypeId, feeTypeFromApi(a.feeType)]),
    ).values(),
  ];

  const openModal = () => {
    setFormError("");
    setShowPaymentModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const body = {
        studentId,
        feeTypeId: Number(form.feeTypeId),
        paidAmount: Number(form.paidAmount),
        paidOn: new Date(form.paidOn).toISOString(),
      };
      if (form.receiptNumber.trim()) body.receiptNumber = form.receiptNumber.trim();
      await feesApi.collect(body);
      setShowPaymentModal(false);
      setForm({ ...form, paidAmount: "", receiptNumber: "" });
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !report) {
    return <p className="p-8 text-sm text-slate-400">Loading fee details...</p>;
  }

  if (error && !report) {
    return (
      <div className="p-8 text-sm text-rose-600">
        {error}{" "}
        <button onClick={reload} className="font-bold underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {error && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}{" "}
          <button onClick={reload} className="font-bold underline">
            Retry
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-8 relative overflow-hidden">
        {/* Student Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-sm text-slate-500">
            Admission No: {student.admissionNo}
          </p>
          <p className="text-sm text-slate-500">
            Outstanding: ₹{totalOutstanding}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={openModal}
          disabled={assignedTypes.length === 0}
          title={
            assignedTypes.length === 0
              ? "No fees assigned to this student"
              : undefined
          }
          className="bg-emerald-500 text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          Collect Fees
        </button>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold mb-4">Fees Ledger</h3>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Fee</th>
              <th>Session</th>
              <th>Frequency</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {ledger.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-sm text-slate-400">
                  No fees assigned.
                </td>
              </tr>
            )}
            {ledger.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.session}</td>
                <td>{row.frequency}</td>
                <td>₹{row.amount}</td>
                <td>₹{row.paid}</td>
                <td>₹{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold mb-4">Payment History</h3>

        {payments.length === 0 && (
          <p className="text-sm text-slate-400">No payments yet.</p>
        )}
        {payments.map((p) => (
          <div key={p.Id} className="mb-3">
            {p.feeType?.Name || `Fee #${p.FeeTypeId}`} - ₹{p.PaidAmount} on{" "}
            {formatDate(p.PaidOn)}
            {p.ReceiptNumber ? ` (Receipt ${p.ReceiptNumber})` : ""}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4"
          >
            <h2 className="font-bold">Collect Payment</h2>

            {formError && (
              <div className="rounded bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {formError}
              </div>
            )}

            <select
              required
              value={form.feeTypeId}
              onChange={(e) => setForm({ ...form, feeTypeId: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">Select fee type</option>
              {assignedTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="Amount (₹)"
              value={form.paidAmount}
              onChange={(e) => setForm({ ...form, paidAmount: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <input
              type="date"
              required
              value={form.paidOn}
              onChange={(e) => setForm({ ...form, paidOn: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Receipt number (optional)"
              value={form.receiptNumber}
              onChange={(e) =>
                setForm({ ...form, receiptNumber: e.target.value })
              }
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {saving ? "Saving..." : "Collect"}
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                disabled={saving}
                className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
