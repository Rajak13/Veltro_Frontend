"use client";

import { use } from "react";
import CustomerDetailView from "@/components/customers/CustomerDetailView";
import { ROUTES } from "@/constants/routes";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <CustomerDetailView
      customerId={id}
      listHref={ROUTES.STAFF_CUSTOMERS}
      breadcrumbRoot={{ label: "Staff" }}
    />
  );
}
