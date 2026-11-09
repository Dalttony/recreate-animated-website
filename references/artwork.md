# Artwork and visual system

The [starter](../assets/huevos-co/index.html) ships with the working raster images, editable CSS/SVG artwork, and local fonts. Reuse those files for Huevos Co. Generate or obtain replacements when the new reference needs different art.

## Establish the look

The example uses cream `#f6f2e5`, soft yellow `#f3d975`, yolk `#eeb608`, and chocolate `#2c190f`. Baloo 2 gives display headings their rounded forms, DM Sans handles copy and controls, and Caveat handles handwritten notes. The sections use torn-paper edges, pill buttons, and subtle shadows. Extract these visual roles from the reference when the brand changes. Keep source text editable and check wrapping with the final copy at mobile and desktop widths.

For a rebrand, check the document title and description, header and footer wordmarks, contact and information dialogs, and printed sticker in `carton.js`. Update both reads and writes of the basket storage key in `app.js` when the adaptation needs its own basket.

## Recreate and integrate assets

| Layer | Bundled art | Adaptation |
| --- | --- | --- |
| Hero mascot | `assets/hen.webp`, 1254 × 1254 with alpha | Generate or source an isolated full-body mascot. Preserve usable transparent margins, the ground contact, and the composition with the product. Update the HTML preload, image dimensions, and accessible description. |
| Traveling objects | Shaded CSS egg silhouettes | Keep them separate from the mascot, copy, and background. Match their shading, texture, and profile to the receiving art. |
| Catalog and packaging | SVG cartons generated in [carton.js](../assets/huevos-co/carton.js) with 6, 10, or 12 egg shapes. The animated box has a separate rear hinge, two lid faces, and editable sticker. | Preserve unique SVG paint IDs per instance, actual receiving geometry, and a separate foreground rim. Update the printed brand and accessible text together. |
| Farm | `assets/farm-exterior.webp` and `assets/farm-interior.webp`, both 1536 × 1024 | Use a matched set with consistent light, setting, and visual style. Update the photo buttons in HTML and the URLs, captions, and alt text in `tourViews` in `app.js`. |
| Small graphic details | CSS logo mark, decorative SVGs and paper edges, local `assets/favicon.svg` | Keep brand shapes and text editable. Recolor or replace the mark, favicon, and box label with the same brand treatment. |

Use generated artwork, supplied assets, or properly licensed sources as the project calls for. Keep the attribution and font notices alongside the assets. The starter's three raster images were generated with Imagegen for Huevos Co. The farm pair depicts a fictional location. Font licenses ship under `assets/licenses/`.

## Prompt briefs for regenerating the example

- **Hen.** Full-body right-facing hen in a warm handcrafted illustration, with a rounded golden pear-shaped body, curved neck, red comb and wattle, small orange beak, dark expressive eye, dark pointed tail feathers, a scalloped amber wing, and thin splayed toes. Use soft rounded shading and a clean silhouette. Isolate it on true alpha with the feet fully visible and no floor shadow. Generate the hen by itself so the eggs, annotations, and background can move separately.
- **Exterior.** Fictional poultry barn in warm late-afternoon light from the right. A long low gray corrugated roof, open sides, brown hens, a silver feed silo, wire fence, and distant green fields. Use a three-quarter eye-level view and a 3:2 editorial photo crop.
- **Interior.** Match the exterior's light, hens, and building materials. Use a centered eye-level view along a straight concrete aisle, orderly perches, steel roof trusses, feed bins, and a bright far end with ventilation fans. Use the same 3:2 crop and earthy palette. Keep both farm images free of people, text, signs, and logos.

Inspect the hero on the actual cream background for halos, cut-off toes, and scale. Check both farm crops as cards and as full gallery images. Export appropriately sized web files and preserve alpha for cutouts. Keep prompts and asset provenance in project documentation where they help the next edit.
