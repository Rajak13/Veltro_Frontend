"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/queryClient";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#18181b",
            color: "#fff",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
        }}
      />
    </QueryClientProvider>
  );
}
