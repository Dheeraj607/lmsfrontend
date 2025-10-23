### Repo snapshot

- Framework: Next.js (App Router / app/ dir). See `app/layout.tsx`, `app/page.tsx`.
- React 19, Next 16, TypeScript, TailwindCSS. See `package.json`, `tsconfig.json`, `eslint.config.mjs`.

### Goal for an AI editing this repo

- Make small, well-scoped edits that keep the Next.js app-dir routing and React client/server boundaries intact.
- Preserve existing client-side conventions (localStorage usage and simple fetch/axios calls) and Tailwind classes.

### Key files to inspect before changing behavior

- `package.json` — scripts: `dev`, `build`, `start`, `lint`.
- `app/` — the app directory. Routes are implemented as folders with `page.tsx` files (e.g. `app/register/page.tsx`, `app/verify-otp/page.tsx`, `app/payment-requests/page.tsx`).
- `app/layout.tsx` — global layout, fonts and CSS import (`globals.css`).
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` — project config.

### Important runtime / environment conventions

- Backend base URL is read from `process.env.NEXT_PUBLIC_API_URL` with fallback `http://localhost:5000`. Many pages call `${API_URL}/...` (see `register`, `verify-otp`, `payment-requests`).
- Client pages use `"use client"` at top of files and rely on window/localStorage. Do not move client-only code to server components.

### LocalStorage contract (explicit keys used across pages)

- `registerName`, `registerEmail`, `registerPhone` — set on successful registration (see `app/register/page.tsx`).
- `verifiedName`, `verifiedEmail`, `verifiedPhone` — set after OTP verification (see `app/verify-otp/page.tsx`).
- `selectedPackage`, `selectedPackageName`, `selectedPackageRate` — used to prefill payment/package flows. Keep these keys unchanged.

### Network & navigation patterns

- API calls are simple fetch/axios POSTs to the backend. Examples:
  - `axios.post(`${API_URL}/users/create`, formData)` in register
  - `axios.post(`${API_URL}/users/verify-otp`, { email, otp })` in verify-otp
  - `fetch(`${API_URL}/payment-requests/order`, { method: 'POST', ... })` in payment-requests
- After success the app uses `router.push('/payment-requests')` or `window.location.href = '/product?transactionId=...'` for navigation. Preserve this behavior when modifying flows.

### Styling and assets

- TailwindCSS (v4) is used; classes appear inline on JSX elements. Avoid introducing global CSS changes without checking `globals.css`.
- Images use `next/image` (see `app/page.tsx`). Prefer `next/image` for new images when appropriate.

### TypeScript / linting expectations

- TS is strict (`strict: true`) and project uses Next's recommended eslint settings. Small fixes should include types where straightforward (e.g., annotate API response shapes) but keep changes minimal.

### Safe edit checklist for AI

1. Confirm edit is inside `app/` or a config file. For UI changes, edit the corresponding `page.tsx` only.
2. If touching client code, ensure file starts with `"use client"` when using hooks or browser APIs.
3. Preserve localStorage keys and environment variable names exactly.
4. Use `API_URL` pattern from files rather than hardcoding `localhost`.
5. Add small, focused tests or console logs only when necessary; avoid broad refactors.

### Examples to reference

- Autofill package info in payment page: `localStorage.getItem('selectedPackageName')` and `selectedPackageRate` in `app/payment-requests/page.tsx`.
- OTP flow: `register` stores `register*` keys; `verify-otp` reads them and sets `verified*` keys before redirecting to `/payment-requests`.

### When to ask the maintainers

- If a change requires changing localStorage key names, the backend contract, or global routing behavior.
- If adding new environment variables or changing build/deploy scripts (see `package.json` and `next.config.ts`).

---

If you want I can: (a) merge these instructions into an existing `.github` file if you already have one elsewhere, (b) expand examples with exact lines to change, or (c) add a minimal CONTRIBUTING or developer-setup note with PowerShell commands for Windows devs.
