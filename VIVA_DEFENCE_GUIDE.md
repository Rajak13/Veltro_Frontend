# Veltro Frontend — Viva Defence Guide

## 1. Project Overview

Veltro is a Vehicle Parts Selling and Inventory Management System. The frontend is Next.js 16 + TypeScript + Tailwind CSS, talking to a .NET 8 Web API backend. Three user roles: **Admin**, **Staff**, **Customer** — each with their own protected section.

---

## 2. Why These Technologies?

**Next.js 16 (App Router)**
- File-system routing — no React Router config needed
- Nested layouts via route groups `(admin)`, `(staff)`, `(customer)` — parentheses are stripped from the URL, so `app/(admin)/dashboard/page.tsx` becomes `/dashboard`. This lets each role have its own sidebar/navbar without affecting URLs
- `router.replace()` not `router.push()` in guards — so protected pages don't appear in browser history

**TypeScript with `strict: true`**
- Catches type errors at compile time. In a team of 5, this prevents one person's API change silently breaking another's component
- All backend models mirrored in `types/index.ts` — if the backend renames a field, TypeScript flags every usage immediately

**Tailwind CSS**
- Styles co-located with markup — no context switching, no naming collisions between team members
- We built our own design system (`components/ui/`) instead of using MUI/Chakra — full control over every pixel, important for the 5 UX marks

---

## 3. Directory Architecture

```
app/
  (public)/     ← Landing page, no auth
  (auth)/       ← Login + Register, no sidebar
  (admin)/      ← Role guard: Admin only
  (staff)/      ← Role guard: Staff only
  (customer)/   ← Role guard: Customer only

components/
  ui/           ← Generic primitives (Button, Input, Modal, Table, Badge, Card, Spinner)
  layout/       ← Structural (AdminSidebar, StaffSidebar, CustomerNavbar, PageHeader)
  forms/        ← Domain forms wired to react-hook-form + zod

hooks/          ← React Query hooks, one file per domain
lib/            ← Singletons: axios instance, queryClient, auth helpers, cn utility
store/          ← Zustand auth store (user, token, role)
types/          ← Single source of truth for all TypeScript interfaces
constants/      ← ROLES and ROUTES — no magic strings anywhere
```

**Why separate `ui/` from `layout/` from `forms/`?**
`ui/` components know nothing about the business domain. `layout/` knows navigation structure but not data. `forms/` knows both. This means team members can change a form without touching Button, and vice versa — zero merge conflicts on shared components.

**Why `constants/roles.ts` and `constants/routes.ts`?**
Without these, `"Admin"` is hardcoded in 20 files. If the backend changes it, you hunt through everything. With `ROLES.ADMIN`, you change one line and TypeScript flags every usage. Same for routes — `ROUTES.ADMIN_DASHBOARD` instead of `"/dashboard"` scattered everywhere.

---

## 4. Authentication & Route Protection

**Flow:**
1. User logs in → `lib/auth.ts` calls `POST /api/auth/login`
2. Backend returns `{ user, token }` inside `{ success, data, message }`
3. `setAuth(user, token)` called on Zustand store
4. Zustand `persist` middleware saves to `localStorage` under key `"veltro-auth"`
5. On page refresh, Zustand rehydrates from localStorage — user stays logged in

**`store/authStore.ts` explained line by line:**
```ts
export const useAuthStore = create<AuthState>()(
  persist(                          // middleware: auto-syncs to localStorage
    (set) => ({
      user: null, token: null, role: null,
      setAuth: (user, token) => set({ user, token, role: user.role }),
      logout: () => set({ user: null, token: null, role: null }),
                                    // setting null writes null to localStorage = clears session
    }),
    { name: "veltro-auth" }         // the localStorage key
  )
);
```

**Why Zustand over Redux?**
Redux needs actions, reducers, selectors, Provider — ~50 lines of boilerplate for a simple auth store. Zustand does it in 15 lines. Crucially, Zustand state is readable outside React via `getState()` — used in `lib/api.ts` to attach the token to every request without hooks.

**Route guards — each layout.tsx:**
```ts
useEffect(() => {
  if (!isAuthenticated || role !== ROLES.ADMIN) {
    router.replace("/login");   // replace not push — no back-button bypass
  }
}, [isAuthenticated, role, router]);

if (!isAuthenticated || role !== ROLES.ADMIN) {
  return <Spinner />;           // prevents content flash during redirect
}
```
Why client-side guards and not Next.js middleware? Middleware runs on the Edge runtime which has no access to localStorage. Our token lives in localStorage (via Zustand persist), so client-side is the correct approach.

---

## 5. API Client — `lib/api.ts`

```ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
```
`NEXT_PUBLIC_` prefix — Next.js only exposes env vars to the browser if they start with this. Without it, the variable is `undefined` in the browser. The `??` fallback means local dev works without a `.env.local` file.

**Why Axios over fetch?**
- Axios automatically parses JSON — no `.json()` call
- Axios throws on non-2xx status codes — `fetch` only throws on network errors, so a 401 would silently "succeed" with fetch
- Axios has a built-in interceptor system — with fetch you'd wrap every call manually

**Request interceptor:**
```ts
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;  // getState() = outside React, no hook needed
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
Every API call gets the auth token automatically. No team member ever needs to pass a token manually.

**Response interceptor:**
```ts
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```
If the token expires, the server returns 401. This interceptor catches it, clears the session, and redirects to login — automatically, from any page, without any per-page logic. `typeof window !== "undefined"` guards against server-side rendering where `window` doesn't exist.

---

## 6. Server State — React Query

**`lib/queryClient.ts`:**
```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // data is fresh for 5 minutes — no unnecessary re-fetches
      retry: 1,                   // retry once on failure before showing error
    },
  },
});
```
Defined outside any component — it's a singleton. If defined inside a component, it would be recreated on every render, destroying the cache.

**Why React Query over useEffect + useState?**
`useEffect` + `useState` for data fetching requires manually managing: loading state, error state, caching, deduplication, re-fetching on focus, and cache invalidation — roughly 30 lines per fetch. React Query handles all of this with `useQuery` in 5 lines.

**queryKey explained:**
```ts
queryKey: ["parts", page, pageSize]
```
React Query uses this array as a cache key. Changing `page` from 1 to 2 automatically triggers a new fetch because the key changed. This is how pagination works with zero extra logic.

**Cache invalidation after mutations:**
```ts
onSuccess: () => qc.invalidateQueries({ queryKey: ["parts"] })
```
After creating/updating/deleting a part, this tells React Query to re-fetch all queries whose key starts with `"parts"`. The list updates automatically — no manual state management.

**`enabled: !!id` on detail queries:**
```ts
queryKey: ["parts", id],
enabled: !!id,
```
Prevents the query from running if `id` is `0`, `null`, or `undefined`. Without this, the component would fire a request to `/parts/0` on mount.

---

## 7. Form Handling — React Hook Form + Zod

**Why React Hook Form?**
Uncontrolled inputs — values are read from the DOM on submit, not stored in React state on every keystroke. Zero re-renders while typing. `useState` per field would re-render the entire form on every keypress.

**Why Zod?**
TypeScript-first — `z.infer<typeof schema>` gives you the TypeScript type for free from the schema. Validates at runtime (on submit) AND at compile time (TypeScript types). Two layers of safety.

**`z.coerce` explained:**
```ts
price: z.coerce.number().positive()
```
HTML inputs always return strings. `z.coerce.number()` converts `"42"` → `42` before validation. Without `coerce`, every number field would fail validation because `"42" !== 42`.

**The `as never` cast:**
```ts
resolver: zodResolver(schema) as never
```
Known TypeScript incompatibility between `z.coerce` (which gives fields `unknown` input type) and React Hook Form's `Resolver` generic. The cast is safe — it only affects TypeScript's type checker, not runtime behaviour. Validation still works correctly.

**`useFieldArray` for line items:**
```ts
const { fields, append, remove } = useFieldArray({ control, name: "items" });
```
Used in `CreateSalesInvoiceForm` and `CreatePurchaseInvoiceForm`. `append()` adds a new row, `remove(i)` removes row at index `i`. React Hook Form tracks all rows and validates each independently.

---

## 8. UI Component System

**`Button.tsx`**
- `forwardRef` — allows parent components to get a ref to the `<button>` DOM element. Required for accessibility tools and animation libraries
- `loading` prop — disables the button AND shows a spinner. Prevents double-submission
- `disabled || loading` — button is disabled in both cases. A loading button that can still be clicked causes duplicate API calls
- 5 variants defined as `Record<Variant, string>` — adding a new variant is one line

**`Input.tsx`**
- `forwardRef` — required for React Hook Form's `register()` to work. `register()` attaches a ref to read the input's value on submit
- Auto-generates `id` from `label`: `label?.toLowerCase().replace(/\s+/g, "-")` — links `<label>` to `<input>` for accessibility (clicking the label focuses the input)
- Error state changes border and focus ring to red automatically

**`Badge.tsx` + `statusVariant()`**
```ts
export function statusVariant(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (["completed", "confirmed", "received", "sourced"].includes(s)) return "success";
  if (["pending"].includes(s)) return "warning";
  if (["cancelled", "unavailable"].includes(s)) return "danger";
  return "neutral";
}
```
Maps backend status strings to visual variants automatically. Every page calls `statusVariant(row.status)` — no per-page colour logic. Case-insensitive (`.toLowerCase()`) — defensive against `"Pending"` vs `"pending"`.

**`Modal.tsx`**
- `useEffect` adds `keydown` listener for Escape when `open` is true, removes it when false — prevents memory leaks
- `e.target === overlayRef.current` — only closes on backdrop click, not modal content click. Without the ref check, clicking inside the modal would bubble up and close it
- `if (!open) return null` — completely unmounts when closed, resetting all internal state

**`Table.tsx`**
- Generic: `Table<T extends Record<string, unknown>>` — works with any data shape
- `Column<T>` with optional `render` function — custom cell content (badges, buttons, dates) without changing the Table component
- Built-in loading, empty state, and pagination — only renders pagination if `onPageChange` is provided AND `totalPages > 1`

**`Spinner.tsx`**
- Pure SVG, no external dependency. `animate-spin` is a Tailwind CSS animation class
- `text-current` — inherits colour from parent's CSS `color` property. `className="text-orange-500"` makes it orange. Works in any context

**`cn()` utility — `lib/utils.ts`**
```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
- `clsx` — conditional class joining: `clsx("a", condition && "b")` → `"a b"` or `"a"`
- `twMerge` — resolves Tailwind conflicts: `twMerge("p-4 p-6")` → `"p-6"`. Without this, both classes would be in the DOM and the browser would apply whichever has higher specificity — unpredictable

---

## 9. Layout Components

**`AdminSidebar.tsx` / `StaffSidebar.tsx`**
- `usePathname()` — returns current URL path, used to highlight the active nav item
- Active check: `pathname === href || pathname.startsWith(href + "/")` — the second condition handles nested routes. `/customers/42` still highlights the Customers nav item
- `useAuth()` provides `user` for the profile section and `logout` for sign-out

**`CustomerNavbar.tsx`**
- Responsive: desktop = horizontal nav, mobile = hamburger menu
- `useState(false)` for `mobileOpen` — controls mobile menu visibility
- Mobile menu renders below the header, pushing content down — no absolute positioning needed

**`PageHeader.tsx`**
- `breadcrumb` prop: array of `{ label, href? }` — links only rendered if `href` provided
- `action` prop: any React node (typically a Button) — keeps title-left, action-right layout consistent across all pages

---

## 10. TypeScript Types — `types/index.ts`

All interfaces mirror the backend C# models exactly.

- **Optional navigation properties** — `vendor?: Vendor` on `Part` is optional because the backend may or may not include the related entity. TypeScript forces you to handle the `undefined` case
- **Union type status fields** — `status: "Pending" | "Completed" | "Cancelled"` instead of `string`. TypeScript errors on typos like `"Cancled"`. The `statusVariant()` function handles exactly these values
- **Generic wrappers** — `ApiResponse<T>` and `PaginatedResponse<T>` match the backend's consistent response envelope. Every API call is typed against these, so `res.data.data` is always the correct type

---

## 11. Environment Variables

- `.env.local` — actual values, gitignored. Never committed
- `.env.local.example` — template committed to repo. Team members copy and fill in
- `NEXT_PUBLIC_` prefix — required by Next.js to expose the variable to browser-side code. Server-only variables (without the prefix) are never sent to the browser

---

## 12. Library Quick Reference

| Library | Why |
|---|---|
| `next` 16 | File-system routing, nested layouts, SSR, industry standard |
| `typescript` strict | Compile-time safety, team-scale refactoring, self-documenting |
| `tailwindcss` | Utility-first, no naming conflicts, co-located styles |
| `axios` | Interceptors, auto JSON parsing, throws on non-2xx |
| `zustand` + persist | Minimal boilerplate, works outside React via getState(), localStorage built-in |
| `@tanstack/react-query` | Caching, auto re-fetch, cache invalidation, loading/error for free |
| `react-hook-form` | Uncontrolled inputs = zero re-renders while typing |
| `zod` | Runtime + compile-time validation, TypeScript-first |
| `@hookform/resolvers` | Bridge between react-hook-form and zod |
| `react-hot-toast` | Lightweight toasts, single Toaster instance in Providers |
| `recharts` | React-native charts, composable API, for financial dashboard |
| `lucide-react` | Consistent icons, tree-shakeable |
| `clsx` | Conditional class joining |
| `tailwind-merge` | Resolves Tailwind class conflicts |

---

## 13. Common Viva Questions & Answers

**Q: Why Next.js instead of plain React?**
Nested layouts via route groups — `(admin)`, `(staff)`, `(customer)` each get their own sidebar/navbar without affecting URLs. File-system routing means no React Router config. This would require significant manual setup in plain React.

**Q: How does authentication work end-to-end?**
User logs in → backend returns JWT token → stored in Zustand with `persist` middleware → saved to localStorage → axios request interceptor reads it and attaches as Bearer header on every call → if server returns 401, response interceptor logs out and redirects automatically.

**Q: How do you prevent unauthorised access?**
Each route group layout reads the role from Zustand. If wrong role, calls `router.replace("/login")` in a `useEffect`. `replace` not `push` — protected page not in browser history. Spinner shown during redirect to prevent content flash.

**Q: Why Zustand over Redux?**
Redux needs actions, reducers, selectors, Provider — ~50 lines for a simple auth store. Zustand does it in 15 lines. Also readable outside React via `getState()` — used in `lib/api.ts` to attach the token without hooks.

**Q: Why React Query instead of useEffect?**
`useEffect` + `useState` requires manually managing loading, error, caching, deduplication, re-fetching — ~30 lines per fetch. React Query handles all of it. The `queryKey` array acts as a cache key — changing page number auto-triggers a new fetch. `invalidateQueries` after mutations keeps the UI in sync automatically.

**Q: What is the `cn()` function?**
Combines `clsx` (conditional class joining) and `tailwind-merge` (conflict resolution). `twMerge` ensures if you pass both `p-4` and `p-6`, only `p-6` wins — without it, both would be in the DOM and the result would be unpredictable.

**Q: Why `forwardRef` on Button and Input?**
`forwardRef` lets parent components get a ref to the underlying DOM element. For `Input`, React Hook Form's `register()` needs this ref to read the value on submit. For `Button`, it's best practice for reusable components used with accessibility tools.

**Q: What is `z.coerce` and why the `as never` cast?**
HTML inputs always return strings. `z.coerce.number()` converts `"42"` → `42` before validation. Without it, number fields always fail. The `as never` cast is a known TypeScript incompatibility between `z.coerce`'s `unknown` input type and React Hook Form's `Resolver` generic — safe at runtime, only affects the type checker.

**Q: Why client-side route guards instead of Next.js middleware?**
Next.js middleware runs on the Edge runtime which has no access to localStorage. Our token lives in localStorage via Zustand persist, so client-side is the only correct approach for this architecture.

**Q: What does `staleTime: 5 minutes` mean in React Query?**
Data fetched from the API is considered fresh for 5 minutes. React Query won't re-fetch it during this window even if the component re-mounts. Reduces unnecessary API calls without making the UI feel stale.

**Q: Why is `queryClient` defined outside the Providers component?**
If defined inside, it would be recreated on every render, destroying the entire cache. Defined outside as a module-level singleton, it persists for the lifetime of the app.

**Q: How does the Table component handle different data shapes?**
It's a TypeScript generic: `Table<T extends Record<string, unknown>>`. The `Column<T>` interface has an optional `render` function — if provided, it's called with the row for custom cell content (badges, buttons, formatted dates). If not provided, the raw value is stringified. This means one Table component handles every page.

---

*This document was generated from the actual codebase. Every code snippet is taken directly from the files in this project.*

---