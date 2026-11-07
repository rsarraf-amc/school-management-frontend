export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN") : "-";

// Assigned amount = CustomAmount ?? feeType.Amount; outstanding = assigned - payments per fee type.
export const buildLedger = (report) => {
  const assigned = report?.assignedFees || [];
  const payments = report?.payments || [];

  const paidByType = payments.reduce((acc, p) => {
    acc[p.FeeTypeId] = (acc[p.FeeTypeId] || 0) + Number(p.PaidAmount || 0);
    return acc;
  }, {});

  const rows = assigned.map((a) => {
    const amount = Number(a.CustomAmount ?? a.feeType?.Amount ?? 0);
    return {
      id: a.Id,
      feeTypeId: a.FeeTypeId,
      name: a.feeType?.Name || `Fee #${a.FeeTypeId}`,
      frequency: a.feeType?.Frequency,
      session: a.Session,
      amount,
      paid: 0,
      balance: amount,
    };
  });

  // Payments are per fee type, so allocate them across that type's assignments in order.
  const remaining = { ...paidByType };
  rows.forEach((row) => {
    const available = remaining[row.feeTypeId] || 0;
    const applied = Math.min(available, row.amount);
    remaining[row.feeTypeId] = available - applied;
    row.paid = applied;
    row.balance = row.amount - applied;
  });

  return rows;
};
