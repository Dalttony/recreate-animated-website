# Motion and interactions

Use this map when adapting the starter or implementing comparable motion from another reference. The source video shows the brown egg descending into the center carton around 8.18–8.50 s. The alternate color, mobile layout, basket, and gallery controls are parts of the browser recreation.

| Scene | Trigger and visible result | Starter code |
| --- | --- | --- |
| Opening | The hen walks in from the side, the two eggs hop at staggered times, and the navigation and text enter. The speech note, sparkles, and scroll cue follow. | [style.css](../assets/huevos-co/style.css), keyframes and hero classes |
| Comparison | Scroll carries the same pair of eggs from the hero to the comparison. Their positions, scale, and tilt change together. Notes and headings reveal on entry. | [app.js](../assets/huevos-co/app.js), `measure()`, `updateMotion()`, reveal observer |
| Catalog | The selected egg leaves the pair, drifts toward the 10-pack, falls and shrinks, bounces at the cup, and settles behind the near rim. The other egg stays at the comparison. The color selector updates all three cartons, names, and prices. | [app.js](../assets/huevos-co/app.js), `renderProducts()` and the fall/handoff block. [carton.js](../assets/huevos-co/carton.js), cup and rim SVG |
| Packaging | A sticky scene holds the tray in place while the lid rotates around the rear hinge. The sticker appears after the lid closes. Step buttons seek to open, closed, and sealed. A separate selector lets the viewer change the preview color. | [app.js](../assets/huevos-co/app.js), `packProgress` and step handler. [carton.css](../assets/huevos-co/carton.css), hinge and seal |
| Farm | The two photos slide in from opposite sides as the gallery enters. Cards have hover zoom and captions. Clicking a card opens its photo in the gallery, which supports arrows, keyboard, and Escape. | [style.css](../assets/huevos-co/style.css), farm and dialog rules. [app.js](../assets/huevos-co/app.js), farm entry and `tourViews` |
| Navigation and purchase demo | Section links scroll to their anchors. Buttons respond to hover/press. The basket handles quantities, remove, empty state, persistence, and order review. Gallery, basket, and information dialogs have keyboard focus and close behavior. | [index.html](../assets/huevos-co/index.html), section anchors and dialogs. [app.js](../assets/huevos-co/app.js), event handlers |

## Adapt the shared object path

Measure stationary hero and comparison anchors and the actual receiving surface in document coordinates. Render the traveling copy in a layer that can cross section boundaries without stealing pointer events. Use a passive scroll listener and one pending animation frame. Recalculate geometry after viewport, asset, or layout changes and after controls replace the target. Convert back to viewport coordinates when placing a fixed layer.

In the starter the receiver is `.product-card[data-count="10"]`, even when mobile stacks it as the second card. The target is `[data-egg-slot="front-2"] .carton-egg-shell`. Measure the shell and the carton SVG separately. During entry, overlay the actual `.carton-front-lip` above the traveling egg and prefix cloned SVG paint IDs and their references. Fade out the traveling shell as the matching native SVG shell fades in. Keep the receiver's hover and color swap free of translation and scaling, so the measured coordinates stay valid. At the beginning and end, the native carton must show its full egg count. When moving upward the same progress unwinds the path, bounce, and crossfade.

When adapting the mechanism to a different product, choose a target the viewer recognizes as part of the destination. Keep color, shape, orientation, and size continuous through the handoff. If a short recording contains an edit, derive the web animation from the visible object and resting states without copying the camera cut.

## Adapt the staged transformation

Use the sticky section's scrollable distance for normalized progress. Keep the tray fixed and attach the lid at its hinge. The two CSS faces exchange visibility around edge-on. The starter derives `--close` and `--seal` separately and updates the active step and `aria-current` from the same scroll progress. The three buttons seek to the same positions the user can reach by scrolling. Keep those positions reachable on short screens and after resizing.

Preserve static or direct-access states for reduced motion. The starter removes the comparison-to-carton fall and farm slide, snaps the hero eggs between docks, and suppresses time-based CSS effects and smooth scroll. Its packaging still follows manual scroll and its step buttons seek instantly. When adding motion, keep the underlying content and controls accessible with reduced motion enabled.

## Browser check cases

1. Load at the top. Confirm the hero entrance and settled state, section anchors, title and CTA, and the first visible imagery. Check that assets load from the project origin.
2. Scroll from hero through comparison to the catalog, then back up. Pause while the selected egg crosses the gap, at the front rim, and after it settles. Verify visible overlap with the rim and a single egg at the target on landing. Switch the variant during descent. Repeat in a narrow layout and resize during the path.
3. Scroll the packaging both ways and use each step button. Verify an open carton, a partially rotated lid, a closed carton without a label, and a sealed carton. Check the active step and both preview colors.
4. Verify the farm slides finish inside the layout. Open both gallery starting images and use next/previous, keyboard arrows, and Escape. Verify the matching caption and focus on return.
5. Use the catalog selectors and buy controls. Verify quantity changes, removal, local reload persistence, and agreement between displayed prices, subtotal, and order review. Check the empty basket and information dialogs. Keep test storage separate from a user's existing basket.
6. Check at desktop, intermediate, and narrow mobile widths. Review layout overflow, control reachability, and JavaScript errors. Enable reduced motion to check direct access to the comparison, catalog, packaging steps, and gallery.
