"use client";

import Modal from "@/components/ui/Modal";
import CustomerSalesInvoiceDetail from "@/components/invoices/CustomerSalesInvoiceDetail";
import { useMySalesInvoice } from "@/hooks/useInvoices";
import {
  formatInvoiceLabel,
  isValidInvoiceId,
  type CustomerInvoiceDetail,
} from "@/lib/invoices";

interface Props {
  invoiceId: string | null;
  preview?: CustomerInvoiceDetail | null;
  open: boolean;
  onClose: () => void;
}

export default function CustomerInvoiceViewModal({
  invoiceId,
  preview,
  open,
  onClose,
}: Props) {
  const validId = isValidInvoiceId(invoiceId) ? invoiceId! : undefined;
  const { data, isLoading, isError, error } = useMySalesInvoice(
    validId,
    open,
    preview
  );

  const titleId = validId ? formatInvoiceLabel(validId) : "";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titleId ? `Invoice #${titleId}` : "Invoice"}
      size="lg"
    >
      {validId ? (
        <CustomerSalesInvoiceDetail
          invoice={data as CustomerInvoiceDetail | undefined}
          isLoading={isLoading}
          error={isError ? (error as Error)?.message : undefined}
          onClose={onClose}
        />
      ) : (
        <p className="text-sm text-red-600 py-6 text-center">
          Invalid invoice reference. Refresh the page and try again.
        </p>
      )}
    </Modal>
  );
}
