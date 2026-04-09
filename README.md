# Veltro — Frontend

Vehicle Parts Selling and Inventory Management System.
Built with Next.js 16, TypeScript, Tailwind CSS.

---

## Prerequisites

- Node.js 18+
- npm

---

## Setup

```bash
# 1. Clone and checkout develop
git clone <repo-url>
git checkout develop

# 2. Copy env file and fill in the API URL
cp .env.local.example .env.local

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

Open http://localhost:3000

---

## Folder Structure

```
app/
  (public)/           ← Landing page (no auth)
  (auth)/             ← Login + Register pages
  (admin)/            ← Admin-only pages (role guard)
  (staff)/            ← Staff-only pages (role guard)
  (customer)/         ← Customer-only pages (role guard)

components/
  ui/                 ← Reusable: Button, Input, Modal, Table, Badge, Card, Spinner
  layout/             ← AdminSidebar, StaffSidebar, CustomerNavbar, PageHeader
  forms/              ← Feature forms (react-hook-form + zod)

hooks/                ← React Query hooks per domain
lib/                  ← api.ts (axios), auth.ts, queryClient.ts, utils.ts
store/                ← Zustand authStore (user, token, role)
types/                ← All TypeScript interfaces
constants/            ← ROLES, ROUTES
```

---

## Pages & Feature Ownership

| Page | Feature | Branch |
|------|---------|--------|
| `/dashboard` | Feature 1 — Financial Reports | `feature/financial-dashboard` |
| `/staff` | Feature 2 — Staff Management | `feature/staff-management` |
| `/parts` | Feature 3 — Parts Management | `feature/parts-management` |
| `/purchase-invoices` | Feature 4 — Purchase Invoices | `feature/purchase-invoices` |
| `/vendors` | Feature 5 — Vendor Management | `feature/vendor-management` |
| `/customers` | Feature 6 — Register Customer | `feature/register-customer` |
| `/sales-invoices` | Feature 7 — Create Sales Invoice | `feature/sales-invoices` |
| `/customers/[id]` | Feature 8 — Customer Detail + History | `feature/customer-detail` |
| `/reports` | Feature 9 — Customer Reports | `feature/customer-reports` |
| `/search` | Feature 10 — Search Customers | `feature/search-customers` |
| `/customer/profile` | Feature 12 — Customer Profile + Vehicles | `feature/customer-profile` |
| `/customer/appointments` | Feature 13 — Book Appointments | `feature/book-appointments` |
| `/customer/part-requests` | Feature 13 — Request Parts | `feature/part-requests` |
| `/customer/reviews` | Feature 13 — Submit Review | `feature/reviews` |
| `/customer/history` | Feature 14 — Purchase + Service History | `feature/customer-history` |

---

## Design System

**Colors**
- Primary: `orange-500` (#f97316)
- Background: `zinc-50` (#fafafa)
- Text: `zinc-900` / `zinc-500`
- Borders: `zinc-200`

**Typography**
- Font: Inter (via next/font/google)
- Weights: 300, 400, 500, 600, 700

**Reusable Components** (`components/ui/`)
- `Button` — variants: primary, secondary, danger, ghost, outline
- `Input` — with label, error state, hint text
- `Modal` — keyboard-dismissible overlay
- `Table` — sortable columns, built-in pagination
- `Badge` — auto-maps status strings to color variants
- `Card` — consistent white card with border
- `Spinner` — animated loading indicator

---

## Branch Naming

Always branch from `develop`:

```bash
git checkout develop
git checkout -b feature/your-feature-name
```

Never commit directly to `main` or `develop`.
