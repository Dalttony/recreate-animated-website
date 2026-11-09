---
name: recreate-animated-website
description: Recreate a complete animated product or brand website from a screen recording, visual reference, or the Huevos Co. example. Use when the page must preserve its visual design, custom imagery, scroll-driven transitions, and working browser interactions.
---

# Recreate an animated website

Deliver an editable, runnable website with the full sequence of sections from the reference. Preserve the objects that carry the story across sections and the controls that let people use the page.

## Choose a starting point

- **Huevos Co. or a close adaptation.** Copy the complete [Huevos Co. starter](assets/huevos-co/index.html). It includes the illustrated opening, egg comparison, catalog, scroll-driven packaging, farm gallery, and footer, with the original local fonts and optimized images.
- **A different reference.** Map the reference first. Read [Motion and interactions](references/motion.md) for the implementation patterns, and use only the starter components that serve the new reference. Follow the existing stack if working in an established project.

To copy the starter, resolve `skill_dir` to the absolute path of this skill folder and `destination` to a new project directory with an existing parent:

```sh
mkdir "$destination" && cp -R "$skill_dir/assets/huevos-co/." "$destination/"
npm --prefix "$destination" run check
npm --prefix "$destination" run dev
```

The starter needs Node.js and serves at `http://127.0.0.1:4173/`. If the port is occupied, use `PORT=4174 npm --prefix "$destination" run dev`. Open the URL from the server log in a browser.

## Map the reference before changing the page

For video, extract representative frames across the entire scroll sequence. Sample more densely around the start, crossing, and landing of a transition. Record the section or timestamp, visible composition, likely trigger, moving object, destination, stacking order, and final state. When the recording includes a device or browser chrome, study the visible page within it. Separate observed behavior from inferred behavior such as mobile layout, hover, and checkout.

Capture the whole page in order, including the opening, product detail, catalog, story or demonstration, gallery, navigation, and footer where present. Identify the type scale, palette, image crops, section edges, and spacing before tuning motion. Build the readable resting states and controls first, then connect them. Compare the same section and phase at comparable viewport sizes.

## Preserve motion and assets

- For a shared object that travels across sections, measure its source and real destination, including the target's size and any foreground mask. Derive progress from scroll so the motion can reverse and survive layout changes. For the Huevos Co. path, the selected egg falls into a cup of the 10-pack and passes behind the carton rim.
- For a transformation with stages, drive the visuals and step controls from the same progress. In the starter the carton goes from open to closed to sealed; the label appears after the lid closes.
- Keep artwork that moves independently in separate layers. Read [Artwork and visual system](references/artwork.md) when creating or replacing imagery. Keep text, controls, and receiving geometry editable. Store the assets locally with their attribution.
- Localize visible copy, accessibility labels, product data, amounts, and the brand on the artwork together. Keep one source for prices and units. Namespace demo storage for a separate brand or project sharing the same browser origin. Connect real commerce only when requested and supported by the project.

## Verify in a browser

Inspect desktop and mobile at the start, middle, and end of each major transition. Scroll backward, change the selected variant during its trajectory, and resize before rechecking its landing. Check that navigation, step controls, dialogs, gallery, and any catalog or basket work using their visible controls and keyboard. Review focus, reduced motion, horizontal overflow, image and font loading, and browser errors. See the [motion check cases](references/motion.md#browser-check-cases) for the starter.

Give the user the editable project and a working preview. Identify any interactions or assets inferred from the reference and any demo data. Show browser evidence of the signature transition and its final state when it helps the user review the result.
