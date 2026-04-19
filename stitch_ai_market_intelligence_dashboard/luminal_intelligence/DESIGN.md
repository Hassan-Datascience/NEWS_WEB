# Design System Document: AI Market Intelligence

## 1. Overview & Creative North Star: "The Neon Observatory"
This design system rejects the "SaaS-template" aesthetic in favor of a high-end, editorial experience tailored for deep focus and executive decision-making. The Creative North Star is **"The Neon Observatory."** 

Like an observatory peering into the dark expanse of space, this system uses a profound, dark foundation (`#0f1117`) to allow data—represented by vibrant, electric blue "stars"—to shine with maximum clarity. We move beyond the grid by using **tonal layering** and **asymmetric balance**. The goal is a UI that feels like a custom-built physical console: tactile, atmospheric, and authoritative. 

We prioritize white space (breathing room) over structural lines, ensuring the "Market Intelligence" is the protagonist of every frame.

---

## 2. Colors & Surface Philosophy
The palette is built on a "Dark Matter" spectrum, utilizing the Material Design convention to create sophisticated depth without relying on traditional borders.

### Surface Hierarchy & The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content.
Structure is defined by background shifts. To create separation, use the following nesting strategy:
*   **Base Layer:** `surface` (#111319) - The canvas.
*   **Section Layer:** `surface_container_low` (#191b22) - Large content areas.
*   **Active Component Layer:** `surface_container_high` (#282a30) - Cards and interactive panels.
*   **Floating/Highlight Layer:** `surface_container_highest` (#33343b) - Overlays and tooltips.

### The "Glass & Gradient" Rule
To elevate the "Electric Blue" accent beyond a flat color, apply the following:
*   **Signature Glow:** Primary CTAs should use a linear gradient: `primary` (#adc6ff) to `primary_container` (#4d8eff) at a 135-degree angle.
*   **Glassmorphism:** For the sidebar or floating filters, use `surface_container` at 70% opacity with a `24px` backdrop-blur. This creates an "Aero" effect that feels premium and integrated.

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance technical precision with executive elegance.

*   **Display & Headlines (Manrope):** Use Manrope for all data summaries and section headers. Its geometric yet warm construction provides a modern, "Tech-Forward" personality.
    *   *Headline-LG:* 2rem, tight letter-spacing (-0.02em) for a bold, editorial feel.
*   **Body & Labels (Inter):** Use Inter for all functional data points and descriptions. It is optimized for readability in high-density data environments.
    *   *Label-SM:* 0.6875rem, uppercase with +0.05em tracking for a "Terminal" metadata aesthetic.

**Hierarchy Tip:** Treat large numbers (Display-MD) as visual anchors. A 45% increase in market cap should be a "Display" moment, not a "Body" moment.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are forbidden. Instead, we use **Ambient Depth**.

*   **The Layering Principle:** Depth is achieved by "stacking." A card (`surface_container_high`) sitting on a section (`surface_container_low`) provides all the visual affordance needed.
*   **Ambient Shadows:** For floating elements like Modals, use a shadow with `blur: 40px`, `y: 20px`, and a color of `on_surface` (#e2e2eb) at only **4% opacity**. This mimics natural light dispersion in a dark room.
*   **The "Ghost Border" Fallback:** If high-contrast separation is required (e.g., in a complex data table), use a "Ghost Border": `outline_variant` (#424754) at **15% opacity**.

---

## 5. Components & Data Visualization

### Stats Cards
*   **Background:** `surface_container_low`.
*   **Corner Radius:** `xl` (0.75rem).
*   **Layout:** Asymmetric. Large `display-sm` value on the left, `label-md` trend indicator on the top right.
*   **Interaction:** On hover, shift background to `surface_container_high`. No border.

### Badges & Status
*   **Neutral:** `secondary_container` with `on_secondary_container` text.
*   **Positive (Market Up):** `tertiary_container` (#009eb9) with `on_tertiary` text.
*   **Critical (Market Down):** `error_container` (#93000a) with `on_error` text.
*   **Shape:** `full` (pill-shaped) for high contrast against rectangular cards.

### Progress Bars (Intelligence Meters)
*   **Track:** `surface_container_highest` (#33343b).
*   **Fill:** Linear gradient from `primary` to `tertiary`.
*   **Glow:** Apply a `drop-shadow(0 0 8px primary)` to the fill head to simulate an active "current" value.

### Sidebar Navigation
*   **Background:** `surface_container_lowest` (#0c0e14).
*   **Active State:** No "pill" background. Instead, use a 2px vertical "Electric Blue" (`primary`) line on the far left and change the icon/text color to `primary_fixed`.
*   **Spacing:** Use `padding-y: 1.5rem` between nav groups to maintain an editorial, "un-cluttered" feel.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use `surface_bright` sparingly as a "spotlight" background for the most important action on the screen.
*   **Do** embrace negative space. If a chart feels crowded, increase the padding to the next tier in the scale rather than adding lines.
*   **Do** use `on_surface_variant` for secondary labels to create a natural hierarchy.

### Don't:
*   **Don't** use 100% white (#ffffff) for text. Always use `on_surface` (#e2e2eb) to prevent eye strain in dark mode.
*   **Don't** use standard 1px dividers between list items. Use 8px or 12px of vertical space to separate rows.
*   **Don't** use high-saturation red for negative data. Use the `error` token (#ffb4ab) to maintain the sophisticated, slightly desaturated "Dark Intelligence" aesthetic.