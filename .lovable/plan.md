## Changes

1. **`src/routes/knowledge-hub.index.tsx`** — Remove the badge in the page header that reads "Internal Banking Use Only • No download" (the `<div>` containing the `ShieldCheck` icon next to the Knowledge Hub title). Drop the now-unused `ShieldCheck` import.

2. **`src/components/CoreSphereAI.tsx`** — Remove the footer disclaimer "Internal Banking Use Only • Conversations are logged for compliance." inside the chat panel (the small `<div>` with the `ShieldCheck` icon under the input). Drop the now-unused `ShieldCheck` import.

No other UI, layout, or functionality changes.