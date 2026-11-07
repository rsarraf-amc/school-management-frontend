import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../../../services/apiService";

const today = new Date().toISOString().slice(0, 10);

export default function FeeCollectionDetail() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [assignedFees, setAssignedFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [payment, setPayment] = useState({
    feeTypeId: "",
    paidAmount: "",
    paidOn: today,
    receiptNumber: "",
  });
  const [assignment, setAssignment] = useState({
    feeTypeId: "",
    session: "",
    customAmount: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      apiService.getStudentFeeReport(studentId),
      apiService.getFeeTypes(),
    ])
      .then(([report, types]) => {
        if (!active) return;
        setStudent(report.student);
        setAssignedFees(report.assignedFees || []);
        setPayments(report.payments || []);
        setFeeTypes(types);
        setPayment((current) => ({
          ...current,
          feeTypeId: types[0] ? String(types[0].id) : "",
        }));
        setAssignment((current) => ({
          ...current,
          feeTypeId: types[0] ? String(types[0].id) : "",
        }));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [studentId]);

  const ledger = useMemo(
    () =>
      assignedFees.map((assignedFee) => {
        const feeAmount = Number(
          assignedFee.customAmount ?? assignedFee.feeType?.amount ?? 0,
        );
        const paidAmount = payments
          .filter((entry) => Number(entry.feeTypeId) === Number(assignedFee.feeTypeId))
          .reduce((sum, entry) => sum + Number(entry.paidAmount || 0), 0);
        return {
          id: assignedFee.id,
          name: assignedFee.feeType?.name || "Fee",
          session: assignedFee.session,
          amount: feeAmount,
          paid: paidAmount,
          balance: Math.max(feeAmount - paidAmount, 0),
        };
      }),
    [assignedFees, payments],
  );

  const collectPayment = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const createdPayment = await apiService.collectFee({
        studentId: Number(studentId),
        feeTypeId: Number(payment.feeTypeId),
        paidAmount: Number(payment.paidAmount),
        paidOn: payment.paidOn,
        receiptNumber: payment.receiptNumber || undefined,
      });
      const feeType = feeTypes.find(
        (item) => Number(item.id) === Number(payment.feeTypeId),
      );
      setPayments((records) => [...records, { ...createdPayment, feeType }]);
      setPayment((current) => ({
        ...current,
        paidAmount: "",
        receiptNumber: "",
      }));
      setShowPaymentModal(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const assignFee = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const assignedFee = await apiService.assignFee({
        studentId: Number(studentId),
        feeTypeId: Number(assignment.feeTypeId),
        session: assignment.session,
        ...(assignment.customAmount
          ? { customAmount: Number(assignment.customAmount) }
          : {}),
      });
      const feeType = feeTypes.find(
        (item) => Number(item.id) === Number(assignment.feeTypeId),
      );
      setAssignedFees((records) => [...records, { ...assignedFee, feeType }]);
      setAssignment((current) => ({ ...current, customAmount: "" }));
      setShowAssignmentModal(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="rounded-xl bg-white p-6 text-sm text-slate-500">Loading student fee record...</p>;
  }

  if (!student) {
    return (
      <p role="alert" className="rounded-xl bg-rose-50 p-5 text-sm text-rose-700">
        {error || "Student record not found."}
      </p>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</p>}

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-8 relative overflow-hidden">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {[student?.firstName, student?.lastName].filter(Boolean).join(" ")}
          </h1>
          <p className="text-sm text-slate-500">
            Admission No: {student?.admissionNumber || "—"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAssignmentModal(true)}
            disabled={feeTypes.length === 0}
            className="rounded-xl border border-emerald-600 px-6 py-3 text-emerald-700 disabled:opacity-50"
          >
            Assign Fee
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={feeTypes.length === 0}
            className="bg-emerald-500 text-white px-6 py-3 rounded-xl disabled:opacity-50"
          >
            Collect Fees
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold mb-4">Fees Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Fee Type</th>
                <th>Session</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.session}</td>
                  <td>₹{row.amount.toFixed(2)}</td>
                  <td>₹{row.paid.toFixed(2)}</td>
                  <td>₹{row.balance.toFixed(2)}</td>
                </tr>
              ))}
              {ledger.length === 0 && (
                <tr><td colSpan={5} className="py-5 text-center text-sm text-slate-500">No fees have been assigned to this student.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold mb-4">Payment History</h3>
        {payments.map((entry) => (
          <div key={entry.id} className="mb-3 flex justify-between gap-4 text-sm">
            <span>{entry.feeType?.name || "Fee"} - ₹{Number(entry.paidAmount).toFixed(2)}</span>
            <span className="text-slate-500">{entry.paidOn} {entry.receiptNumber && `· ${entry.receiptNumber}`}</span>
          </div>
        ))}
        {payments.length === 0 && <p className="text-sm text-slate-500">No payments recorded.</p>}
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={collectPayment} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6">
            <h2 className="font-bold">Collect Payment</h2>
            <label className="block space-y-1 text-sm">
              <span>Fee type</span>
              <select
                required
                value={payment.feeTypeId}
                onChange={(event) => setPayment({ ...payment, feeTypeId: event.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              >
                {feeTypes.map((type) => <option key={type.id} value={type.id}>{type.name} — ₹{type.amount}</option>)}
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span>Amount paid</span>
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={payment.paidAmount}
                onChange={(event) => setPayment({ ...payment, paidAmount: event.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span>Payment date</span>
              <input
                required
                type="date"
                value={payment.paidOn}
                onChange={(event) => setPayment({ ...payment, paidOn: event.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span>Receipt number (optional)</span>
              <input
                value={payment.receiptNumber}
                onChange={(event) => setPayment({ ...payment, receiptNumber: event.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowPaymentModal(false)} className="rounded-xl border px-4 py-2">
                Cancel
              </button>
              <button disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-60">
                {saving ? "Saving..." : "Record Payment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={assignFee} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6">
            <h2 className="font-bold">Assign Fee</h2>
            <label className="block space-y-1 text-sm">
              <span>Fee type</span>
              <select
                required
                value={assignment.feeTypeId}
                onChange={(event) => setAssignment({ ...assignment, feeTypeId: event.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              >
                {feeTypes.map((type) => <option key={type.id} value={type.id}>{type.name} — ₹{type.amount}</option>)}
              </select>
            </label>
            <label className="block space-y-1 text-sm">
              <span>Session</span>
              <input
                required
                value={assignment.session}
                onChange={(event) => setAssignment({ ...assignment, session: event.target.value })}
                placeholder="2026-2027"
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span>Custom amount (optional)</span>
              <input
                min="0.01"
                step="0.01"
                type="number"
                value={assignment.customAmount}
                onChange={(event) => setAssignment({ ...assignment, customAmount: event.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAssignmentModal(false)} className="rounded-xl border px-4 py-2">
                Cancel
              </button>
              <button disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2 text-white disabled:opacity-60">
                {saving ? "Saving..." : "Assign Fee"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
