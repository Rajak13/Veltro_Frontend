"use client";

import { useState, useCallback } from "react";
import type { CustomerInvoiceDetail } from "@/lib/invoices";

/** Shared state for opening the customer invoice detail modal from any page. */
export function useCustomerInvoiceViewer() {
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [preview, setPreview] = useState<CustomerInvoiceDetail | null>(null);

  const openInvoice = useCallback((id: string, detail?: CustomerInvoiceDetail | null) => {
    if (!id) return;
    setInvoiceId(id);
    setPreview(detail ?? null);
  }, []);

  const closeInvoice = useCallback(() => {
    setInvoiceId(null);
    setPreview(null);
  }, []);

  return {
    invoiceId,
    preview,
    isOpen: !!invoiceId,
    openInvoice,
    closeInvoice,
  };
}
