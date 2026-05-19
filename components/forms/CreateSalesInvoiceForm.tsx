"use client";

// Feature 7 — Create Sales Invoice (Staff)
// Customer search → select parts → set payment status (Paid/Credit) → process sale
// Auto-applies 10% loyalty discount if subtotal ≥ Rs. 5,000

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useCreateSalesInvoice } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";
import { useParts } from "@/hooks/useParts";
import toast from "react-hot-toast";
import { Plus, Trash2, Gift, AlertTriangle, ChevronDown } from "lucide-react";

const LOYALTY_THRESHOLD = 5000;

interface LineItem { partId: string; quantity: number; }
interface Props { onSuccess?: () => void; }

export default function CreateSalesInvoiceForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateSalesInvoice();
  const { data: customersData }   = useCustomers(1, 200);
  const { data: partsData }       = useParts(1, 200);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string; phone?: string } | null>(null);
  const [customerSearch, setCustomerSearch]     = useState("");
  const [showDropdown, setShowDropdown]         = useState(false);
  const [paymentStatus, setPaymentStatus]       = useState<"paid" | "credit">("paid");
  const [saleDate, setSaleDate]                 = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems]                       = useState<LineItem[]>([{ partId: "", quantity: 1 }]);
  const [errors, setErrors]                     = useState<Record<string, string>>({});

  const customers = customersData?.items ?? [];
  const parts     = partsData?.data ?? [];
  const today     = new Date().toISOString().split("T")[0];

  // ── Customer search ──────────────────────────────────────────────────────────
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return [];
    const q = customerSearch.toLowerCase();
    return customers
      .filter(c => c.fullName?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q))
      .slice(0, 6);
  }, [customers, customerSearch]);

  // ── Totals ───────────────────────────────────────────────────────────────────
  const subtotal = useMemo(() =>
    items.reduce((sum, item) => {
      const part = parts.find(p => p.partId === item.partId);
      return sum + (part?.price ?? 0) * (item.quantity || 0);
    }, 0),
  [items, parts]);

  const discount    = subtotal >= LOYALTY_THRESHOLD ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const finalAmount = subtotal - discount;

  // ── Item helpers ─────────────────────────────────────────────────────────────
  const addItem    = () => setItems(prev => [...prev, { partId: "", quantity: 1 }]);
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof LineItem, value: string | number) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!selectedCustomer) newErrors.customer = "Please select a customer";

    const validItems = items.filter(i => i.partId && i.quantity > 0);
    if (validItems.length === 0) newErrors.items = "Add at least one part item";

    // Stock validation
    for (const item of validItems) {
      const part = parts.find(p => p.partId === item.partId);
      if (part && item.quantity > part.stockQuantity) {
        newErrors.items = `Insufficient stock for "${part.name}". Available: ${part.stockQuantity}`;
        break;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await mutateAsync({
        customerId: selectedCustomer!.id,
        isPaid:     paymentStatus === "paid",
        saleDate:   new Date(saleDate).toISOString(),
        items:      validItems.map(i => ({ partId: i.partId, quantity: i.quantity })),
      } as never);
      toast.success("Sale processed successfully!");
      onSuccess?.();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? "Failed to create invoice");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Header: Customer / Payment Status / Sale Date ── */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Customer */}
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
              Customer
            </label>
            {selectedCustomer ? (
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-orange-200 rounded-xl shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600 flex-shrink-0">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-800 truncate">{selectedCustomer.name}</p>
                  {selectedCustomer.phone && (
                    <p className="text-[11px] text-zinc-400">{selectedCustomer.phone}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCustomer(null); setErrors({}); }}
                  className="text-[11px] text-orange-500 hover:text-orange-700 font-semibold flex-shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className={`flex items-center gap-2 px-3 py-2.5 bg-white border rounded-xl transition-all ${showDropdown ? "border-orange-400 ring-2 ring-orange-100" : "border-zinc-200"}`}>
                  <svg className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name or phone…"
                    value={customerSearch}
                    onChange={e => { setCustomerSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-zinc-400 text-zinc-800"
                  />
                </div>
                {showDropdown && filteredCustomers.length > 0 && (
                  <div className="absolute z-30 top-full mt-1.5 w-full bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
                    {filteredCustomers.map(c => (
                      <button
                        key={c.customerId}
                        type="button"
                        onMouseDown={() => {
                          setSelectedCustomer({ id: c.customerId, name: c.fullName ?? "Unknown", phone: c.phone });
                          setCustomerSearch("");
                          setShowDropdown(false);
                          setErrors(prev => ({ ...prev, customer: "" }));
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-orange-50 border-b border-zinc-50 last:border-0 text-left transition-colors"
                      >
                        <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-[11px] font-bold text-zinc-500 flex-shrink-0">
                          {(c.fullName ?? "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-zinc-800 truncate">{c.fullName}</p>
                          <p className="text-[11px] text-zinc-400">{c.phone}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {errors.customer && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.customer}</p>
                )}
              </div>
            )}
          </div>

          {/* Payment Status */}
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
              Payment Status
            </label>
            <div className="relative">
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as "paid" | "credit")}
                className="w-full appearance-none px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-[13px] text-zinc-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 pr-8 cursor-pointer"
              >
                <option value="paid">Paid</option>
                <option value="credit">Credit (Unpaid)</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
            {paymentStatus === "credit" && (
              <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Credit — payment due within 30 days
              </p>
            )}
          </div>

          {/* Sale Date */}
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
              Sale Date
            </label>
            <input
              type="date"
              max={today}
              value={saleDate}
              onChange={e => setSaleDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-[13px] text-zinc-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>
      </div>

      {/* ── Part Items ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-800">Part Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Part
          </button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-3 px-1 mb-1.5">
          <div className="col-span-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Part / Item</div>
          <div className="col-span-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Unit Price</div>
          <div className="col-span-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Quantity</div>
          <div className="col-span-1" />
        </div>

        <div className="space-y-2">
          {items.map((item, i) => {
            const selectedPart = parts.find(p => p.partId === item.partId);
            const lineTotal    = (selectedPart?.price ?? 0) * (item.quantity || 0);
            const overStock    = selectedPart && item.quantity > selectedPart.stockQuantity;

            return (
              <div
                key={i}
                className={`grid grid-cols-12 gap-3 items-start p-3 rounded-xl border transition-colors ${
                  overStock ? "bg-red-50 border-red-200" : "bg-zinc-50 border-zinc-200"
                }`}
              >
                {/* Part selector */}
                <div className="col-span-5">
                  <div className="relative">
                    <select
                      value={item.partId}
                      onChange={e => updateItem(i, "partId", e.target.value)}
                      className="w-full appearance-none px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 pr-7 cursor-pointer"
                    >
                      <option value="">Select a part…</option>
                      {parts.map(p => (
                        <option key={p.partId} value={p.partId} disabled={p.stockQuantity === 0}>
                          {p.name}{p.stockQuantity === 0 ? " [Out of stock]" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
                  </div>
                  {selectedPart && (
                    <p className={`text-[11px] mt-0.5 pl-0.5 ${selectedPart.isLowStock ? "text-amber-600" : "text-zinc-400"}`}>
                      In Stock: {selectedPart.stockQuantity}
                      {selectedPart.isLowStock && " ⚠ Low"}
                    </p>
                  )}
                  {overStock && (
                    <p className="text-[11px] text-red-600 mt-0.5 pl-0.5 font-medium">Exceeds available stock</p>
                  )}
                </div>

                {/* Unit price */}
                <div className="col-span-3">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-600 tabular-nums">
                    <span className="text-zinc-400 text-[11px] font-medium">Rs.</span>
                    <span>{selectedPart ? selectedPart.price.toLocaleString() : "—"}</span>
                  </div>
                  {lineTotal > 0 && (
                    <p className="text-[11px] text-zinc-400 mt-0.5 pl-0.5 tabular-nums">
                      = Rs. {lineTotal.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="col-span-3">
                  <input
                    type="number"
                    min={1}
                    max={selectedPart?.stockQuantity ?? 9999}
                    value={item.quantity}
                    onChange={e => updateItem(i, "quantity", parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-[13px] text-zinc-900 outline-none focus:ring-2 tabular-nums ${
                      overStock
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-zinc-200 focus:border-orange-400 focus:ring-orange-100"
                    }`}
                  />
                </div>

                {/* Remove */}
                <div className="col-span-1 flex justify-center pt-1.5">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {errors.items && (
          <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />{errors.items}
          </p>
        )}
      </div>

      {/* ── Totals + Discount ── */}
      {subtotal > 0 && (
        <div className="flex flex-col items-end gap-3">
          {discount > 0 ? (
            <div className="w-full flex items-start gap-3 p-3.5 rounded-xl bg-green-50 border border-green-200">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-green-800">
                  Congratulations! 10% Loyalty Discount applied!
                </p>
                <p className="text-[12px] text-green-700 mt-0.5">
                  You save <span className="font-bold tabular-nums">Rs. {discount.toLocaleString()}</span> on this purchase.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
              <Gift className="w-3.5 h-3.5 flex-shrink-0" />
              Spend Rs. {(LOYALTY_THRESHOLD - subtotal).toLocaleString()} more to unlock 10% loyalty discount
            </div>
          )}

          <div className="w-full sm:w-72 bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[13px] text-zinc-600">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[13px] text-green-600">
                <span>Loyalty Discount (10%)</span>
                <span className="tabular-nums font-medium">− Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline border-t border-zinc-200 pt-2.5 mt-1">
              <span className="text-sm font-bold text-zinc-900">Total Amount:</span>
              <span className="text-lg font-bold text-orange-600 tabular-nums">
                Rs. {finalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 rounded-xl text-sm font-medium border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          Cancel
        </button>
        <Button type="submit" loading={isPending} className="px-6">
          Process Sale
        </Button>
      </div>
    </form>
  );
}
