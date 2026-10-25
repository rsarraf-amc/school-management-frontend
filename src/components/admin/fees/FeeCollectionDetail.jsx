import { useState } from "react";
import {
  CreditCard,
  History,
  Receipt,
  Info,
  AlertCircle,
  Printer,
  CheckCircle2,
  IndianRupee,
  Clock,
  Plus,
  ArrowRight,
  X,
} from "lucide-react";

import { feeCollectionDetail } from "../../../mock/feesData";

export default function FeeCollectionDetail() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ✅ Extract data properly
  const student = feeCollectionDetail?.student || {};
  const ledger = feeCollectionDetail?.ledger || [];
  const payments = feeCollectionDetail?.payments || [];

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-8 relative overflow-hidden">
        
        {/* Student Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-sm text-slate-500">
            Admission No: {student.admissionNo}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-emerald-500 text-white px-6 py-3 rounded-xl"
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
              <th>Group</th>
              <th>Due</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {ledger.map((row) => (
              <tr key={row.id}>
                <td>{row.group}</td>
                <td>{row.dueDate}</td>
                <td>{row.status}</td>
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

        {payments.map((p) => (
          <div key={p.id} className="mb-3">
            {p.group} - ₹{p.amount}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="font-bold mb-4">Collect Payment</h2>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Helper */
function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}