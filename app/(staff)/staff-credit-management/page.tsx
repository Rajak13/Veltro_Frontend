"use client";

// Credit Management — Staff
// Shows all unpaid invoices. Staff can record partial/full payments or send overdue reminders.
// Invoices older than 30 days are flagged as overdue.

import { useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import {
  useUnpaidInvoices,
  useRecordPayment,
  useSendOverdueReminder,
  type UnpaidInvoiceRow,
} from "@/hooks/useInvoices";
import { filterBySearch } from "@/lib/invoices";
import { AlertTriangle, Mail, CheckCircle, Clock, CreditCard } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const PAGE_SIZE = 10;
const OVERDUE_DAYS = 30;

export default function CreditManagementPage() {
  const [search, setSearch]           = useState("");
  const [page, setPage]               = useState(1);
  const [payingInvoice, setPayingInvoice] = useState<UnpaidInvoiceRow | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError]   = useState("");

  const { data: rawInvoices, isLoading } = useUnpaidInvoices();
  const recordPayment  = useRecordPayment();
  const sendReminder   = useSendOverdueReminder();

  const invoices = rawInvoices ?? [];

  const filtered = useMemo(() =>
    filterBySearch(invoices, search, (inv) =>
      `${inv.customerName} ${inv.customerEmail} ${inv.invoiceId}`
    ),
  [invoices, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const now = Date.now();
  const overdueCount = invoices.filter(
    inv => (now - new Date(inv.saleDate).getTime()) / 86_400_000 > OVERDUE_DAYS
  ).length;
  const totalOutstanding = invoices.reduce(
    (s, inv) => s + (inv.totalAmount - (inv.amountPaid ?? 0)), 0
  );

  // ── Payment modal helpers ──────────────────────────────────────────────────
  const openPayModal = (inv: UnpaidInvoiceRow) => {
    setPayingInvoice(inv);
    setPaymentAmount("");
    setPaymentError("");
  };

  const remaining = payingInvoice
    ? payingInvoice.totalAmount - (payingInvoice.amountPaid ?? 0)
    : 0;

  const handlePayFull = () => setPaymentAmount(String(remaining));

  const handleSubmitPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      setPaymentError("Enter a valid amount greater than 0.");
      return;
    }
    if (amount > remaining) {
      setPaymentError(`Amount cannot exceed the remaining balance of Rs. ${remaining.toLocaleString()}.`);
      return;
    }
    setPaymentError("");
    try {
      const result = await recordPayment.mutateAsync({
        invoiceId: payingInvoice!.invoiceId,
        amount,
      });
      const payload = result.data;
      if (payload?.fullyPaid) {
        setPayingInvoice(null);
      } else if (payingInvoice && payload) {
        setPayingInvoice({
          ...payingInvoice,
          amountPaid: payload.amountPaid,
        });
        setPaymentAmount("");
      }
    } catch {
      // error handled by hook
    }
  };

  return (
    <div>
      <PageHeader
        title="Credit Management"
        subtitle="Track and collect outstanding payments"
        breadcrumb={[{ label: "Staff" }, { label: "Credit Management" }]}
      />

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Unpaid Invoices</p>
            <p className="text-xl font-bold text-zinc-900 tabular-nums">{invoices.length}</p>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Overdue (&gt;30 days)</p>
            <p className="text-xl font-bold text-red-600 tabular-nums">{overdueCount}</p>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Total Outstanding</p>
            <p className="text-xl font-bold text-zinc-900 tabular-nums">Rs. {totalOutstanding.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by customer name or email…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center gap-2 text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          <CheckCircle className="w-10 h-10 text-green-300" />
          <p>{search ? "No invoices match your search." : "All invoices are settled. Great work!"}</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {["Invoice", "Customer", "Total", "Paid", "Remaining", "Sale Date", "Days", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((inv) => {
                    const daysPending = Math.floor((now - new Date(inv.saleDate).getTime()) / 86_400_000);
                    const isOverdue   = daysPending > OVERDUE_DAYS;
                    const paid        = inv.amountPaid ?? 0;
                    const rem         = inv.totalAmount - paid;
                    const pctPaid     = inv.totalAmount > 0 ? (paid / inv.totalAmount) * 100 : 0;

                    return (
                      <tr key={inv.invoiceId} className={`border-b border-zinc-50 transition-colors ${isOverdue ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-zinc-50/60"}`}>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-[12px] font-medium text-zinc-700">
                            #{inv.invoiceId.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link href={ROUTES.STAFF_CUSTOMER_DETAIL(inv.customerId)} className="hover:text-orange-600 transition-colors">
                            <div className="text-[13px] font-medium text-zinc-800">{inv.customerName}</div>
                            <div className="text-[11px] text-zinc-400">{inv.customerEmail}</div>
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-[13px] font-semibold text-zinc-900 tabular-nums">
                            Rs. {inv.totalAmount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div>
                            <span className="text-[13px] text-green-700 tabular-nums font-medium">
                              Rs. {paid.toLocaleString()}
                            </span>
                            {paid > 0 && (
                              <div className="w-16 h-1 rounded-full bg-zinc-100 mt-1 overflow-hidden">
                                <div className="h-full rounded-full bg-green-400" style={{ width: `${pctPaid}%` }} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`text-[13px] font-bold tabular-nums ${isOverdue ? "text-red-600" : "text-amber-600"}`}>
                            Rs. {rem.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-[12px] text-zinc-500">
                            {new Date(inv.saleDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`text-[12px] font-semibold tabular-nums ${isOverdue ? "text-red-600" : "text-amber-600"}`}>
                            {daysPending}d
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {isOverdue ? (
                            <Badge label="Overdue" variant="danger" />
                          ) : (
                            <Badge label="Pending" variant="warning" />
                          )}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => openPayModal(inv)}
                              className="text-[11px]"
                            >
                              <CreditCard className="w-3 h-3" /> Pay
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendReminder.mutate(inv.invoiceId)}
                              disabled={sendReminder.isPending}
                              className="text-[11px] text-orange-600 border-orange-200 hover:bg-orange-50"
                              title="Send overdue payment reminder email"
                            >
                              <Mail className="w-3 h-3" /> Remind
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* ── Payment Modal ── */}
      <Modal
        open={!!payingInvoice}
        onClose={() => setPayingInvoice(null)}
        title="Record Payment"
        size="sm"
      >
        {payingInvoice && (
          <div className="space-y-5">
            {/* Invoice summary */}
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-zinc-500">Customer</span>
                <span className="font-medium text-zinc-800">{payingInvoice.customerName}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-zinc-500">Invoice Total</span>
                <span className="font-medium text-zinc-800 tabular-nums">Rs. {payingInvoice.totalAmount.toLocaleString()}</span>
              </div>
              {(payingInvoice.amountPaid ?? 0) > 0 && (
                <div className="flex justify-between text-[13px]">
                  <span className="text-zinc-500">Already Paid</span>
                  <span className="font-medium text-green-700 tabular-nums">Rs. {(payingInvoice.amountPaid ?? 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[13px] border-t border-zinc-200 pt-2 mt-1">
                <span className="font-semibold text-zinc-700">Remaining Balance</span>
                <span className="font-bold text-orange-600 tabular-nums text-base">Rs. {remaining.toLocaleString()}</span>
              </div>
              {/* Progress bar */}
              {(payingInvoice.amountPaid ?? 0) > 0 && (
                <div className="h-1.5 rounded-full bg-zinc-200 overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full bg-green-400 transition-all"
                    style={{ width: `${((payingInvoice.amountPaid ?? 0) / payingInvoice.totalAmount) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Amount input */}
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1.5">
                Amount Received (Rs.)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0.01}
                  max={remaining}
                  step={0.01}
                  value={paymentAmount}
                  onChange={e => { setPaymentAmount(e.target.value); setPaymentError(""); }}
                  placeholder={`Max Rs. ${remaining.toLocaleString()}`}
                  className="flex-1 px-3 py-2 border border-zinc-200 rounded-xl text-sm text-zinc-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 tabular-nums"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handlePayFull}
                  className="px-3 py-2 rounded-xl text-[12px] font-semibold border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap"
                >
                  Pay Full
                </button>
              </div>
              {paymentError && (
                <p className="text-[12px] text-red-500 mt-1.5">{paymentError}</p>
              )}
              {paymentAmount && !paymentError && parseFloat(paymentAmount) > 0 && parseFloat(paymentAmount) <= remaining && (
                <p className="text-[12px] text-zinc-400 mt-1.5 tabular-nums">
                  After this payment: Rs. {(remaining - parseFloat(paymentAmount)).toLocaleString()} remaining
                  {parseFloat(paymentAmount) >= remaining && " — Invoice will be fully settled"}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleSubmitPayment}
                loading={recordPayment.isPending}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                className="flex-1"
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
