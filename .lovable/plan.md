## Reorder dashboard: Promotions strip first

Move the "Products & News from UBA" section to be the very first content block on the dashboard, directly under the slim live ticker, so it stands out from the rest.

### Change

**`src/routes/index.tsx`**
- Move `<PromotionsStrip />` (currently between the champions grid and the "Recent Learning Activity" grid) to the top of the `AppShell` content, immediately above the greeting header (`"Good morning, …"`).
- Keep a wrapping div with bottom spacing (e.g. `mb-6`) so it visually separates from the greeting + stat cards below.
- Remove the now-empty `<div className="mt-6"><PromotionsStrip /></div>` wrapper from its old position.
- Leave the champions grid and all other sections in their current order.

### Out of scope
- No changes to `PromotionsStrip` styling or content.
- No changes to `ActivityTicker`, `AppShell`, sidebar, or any other route.
- No new data, no backend changes.
