# Custom Cursor, Magnetic Interactions & Interaction Physics Architecture

## 1. Overview & Core Philosophy
The custom cursor and interaction architecture is designed as a single-canvas interaction system inspired by the craft, fluid momentum, and tactile responsiveness of high-end creative engineering benchmarks (such as `haoqi.design`). The implementation directly couples to the dynamic four-palette design token system while maintaining strict separation between real application state and illustrative conceptual diagrams.

---

## 2. Contextual Cursor States Matrix

The application provides eight contextual cursor variants, managed via `CursorContext` and coordinated through `Cursor.tsx`:

| Variant | Geometry & Visual Style | Activation Triggers | Functional & Visual Purpose |
| :--- | :--- | :--- | :--- |
| **`default`** | 32px ring (1px border) + 7px precision dot (`shadow-[0_0_8px_var(--primary-glow)]`) | Default background, general layout surfaces | Minimal, high-precision pointer tracking with zero-latency center dot and spring-interpolated trailing ring. |
| **`link`** | 52px – 60px ring, frosted backdrop (`var(--paper-deep)/85`), monospace uppercase badge | Anchor links, buttons, navigation items (`data-cursor="link"`, `data-cursor-label`) | Contextual navigation guidance (`WORK`, `ABOUT`, `CONTACT`, `EXPLORE`, `HONOR`, `CERT`, `GITHUB`, `LINKEDIN`, `LAUNCH`, `CODE`). Center dot hides when label is present. |
| **`project`** | 74px translucent frosted circle with deep primary glow (`shadow-[0_0_24px_var(--primary-glow)]`) | Project interactive preview stages (`data-cursor="project"`, `data-cursor-label="DEMO"` or `"SPEC"`) | Focused interactive preview cue. Scoped specifically to preview stages, leaving project editorial narrative, titles, and highlights freely readable. |
| **`3d-scene`** | 78px frosted circular lens (`backdrop-blur-md`) with `↺ ROTATE` badge | Hovering over the WebGL 3D Computational Sculpture | Signals rotational degrees of freedom on the 3D refractive glass monolith. |
| **`drag`** | 72px × 40px rounded pill (`rounded-2xl`) with accent border and `← ROTATING →` indicator | Active pointer-down drag gesture on the 3D monolith | Real-time tactile feedback during active rotational drag manipulation. |
| **`text`** | 2px × 20px vertical I-beam cursor (`bg-[var(--primary)]`) | Editorial paragraphs, code snippets, and text-select areas (`data-cursor="text"`) | Unobtrusive, clean typographic cursor preserving native text selection. |
| **`disabled`** | 28px dashed border ring with subtle `✕` glyph | Disabled or aria-disabled interactive elements | Immediate visual feedback for non-actionable elements. |
| **`hidden`** | Scale 0 / Opacity 0 | Form inputs (`input`, `textarea`, `select`, `contenteditable`) | Automatic handover to native operating system text insertion caret. |

---

## 3. Magnetic Interaction Physics

Magnetic pull is implemented via `useMagnetic.ts` using an inverse power gravitational decay curve:

$$\text{decay} = \left(1 - \frac{\text{distance}}{\text{radius}}\right)^{1.4}$$

- **Non-Linear Gravity Well:** As the pointer approaches the center of an interactive element, attraction increases smoothly without sudden discontinuous jumps or jarring snaps.
- **Spring Parameters:** Configured with `stiffness: 240`, `damping: 24`, and `mass: 0.8` for crisp, organic attraction and rapid settling with zero oscillation overshoot.
- **Scroll & Blur Immunity:** Active window listeners (`scroll`, `blur`, `pointerleave`) immediately disengage magnetic displacement and restore element translation to `(0, 0)`.
- **Applied Controls:**
  - Hero primary CTAs (`Explore Selected Works ↓`, `Initiate Dialogue ↗`, `WorldQuant Challenge Gold ✦`)
  - Global navigation links (`Work`, `About`, `Contact`) & LC monogram
  - Project action buttons (`Launch Live App ↗`, `Source Code ↗`)
  - Contact section email copy button and social links (`GitHub ↗`, `LinkedIn ↗`)
  - Footer `Back to Top ↑` and `Replay Intro ←` buttons

---

## 4. Hardware-Accelerated Pointer Lighting (`usePointerGlow.ts`)

- **Zero-Re-Render Strategy:** Instead of binding mouse coordinates to React component state, pointer coordinates are written directly as inline CSS custom properties (`--mouse-x`, `--mouse-y`, `--glow-opacity`) on the target DOM nodes via `requestAnimationFrame`.
- **GPU-Accelerated Rasterization:** The CSS custom properties directly drive GPU radial gradients:
  ```css
  radial-gradient(420px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), var(--primary-glow) 0%, transparent 80%)
  ```
- **Lifecycle Cleanliness:** Animation frame requests are throttled to a single in-flight `rafId` and automatically cancelled on pointer leave or component unmount.

---

## 5. WebGL Coordination & Gesture Reset Lifecycle

- **Multi-Context Harmony:** Coordinates smoothly with the central `webglCoordinator` and `scrollBus`.
- **State Transition Flow:**
  - Monolith Pointer Enter $\to$ `3d-scene` (`↺ ROTATE`)
  - Monolith Pointer Down $\to$ `drag` (`← ROTATING →`)
  - Monolith Pointer Release (Inside) $\to$ `3d-scene` (`↺ ROTATE`)
  - Monolith Pointer Release (Outside) $\to$ `default` (`resetCursor()`)
  - Monolith Pointer Cancel / Window Blur $\to$ `default` (`resetCursor()`)
  - Viewport Scroll / Navigation Hash Change $\to$ Element under point re-evaluated; cursor state synchronized or reset.
- **Zero Input Interception:** The cursor overlay layer enforces `pointer-events-none fixed inset-0 z-[10000]` across the container and all child elements, ensuring that orbital dragging, clicking, and text selection are never blocked.

---

## 6. Authenticity & Project Preview Specification

In accordance with strict portfolio integrity standards, project preview labels reflect actual status:

### FocusFlow (Verified Live Project)
- **Live Deployment:** Production application running at `https://focus-flow-eta-six.vercel.app` with verified open-source repository at `https://github.com/lalitchoudhary0907/FocusFlow`.
- **Implemented Capabilities:** Customizable 25-minute Pomodoro focus cycles, rest intervals, browser `localStorage` state persistence, audio alerts, and clean JavaScript timers.
- **Portfolio Preview Status:** Labeled explicitly as **`UI ARCHITECTURE PREVIEW`** and **`VERIFIED APP · LIVE`** with an illustrative 25-minute cycle dial to clearly indicate an interactive architectural preview rather than an artificial socket telemetry stream.

### VastraGo (System Concept Under Progress)
- **Status:** Architectural specification and AI fashion marketplace concept under active development.
- **Illustrative Parametric Model:** Dimensional nodes are explicitly labeled as illustrative design specifications:
  - `Sample Shoulder: 46.5 CM (EX)`
  - `Sample Chest Arc: 98.0 CM (EX)`
  - `Artisan Protocol: PLANNED SPEC` (replacing any premature verification claims).
- **Portfolio Preview Status:** Labeled explicitly as **`CONCEPT SPECIFICATION`** and **`UNDER PROGRESS`**, preserving truthfulness in all technical disclosures.

---

## 7. Accessibility, Scheduling & Performance Contract

1. **Fine-Pointer Gating:** Custom cursor elements are rendered only on devices satisfying `(hover: hover) and (pointer: fine)`. On mobile touch devices, tablets, and devices without precise pointers, the custom cursor DOM tree is unmounted and the native touch cursor experience is strictly preserved.
2. **Reduced Motion Compliance:** On `prefers-reduced-motion: reduce`:
   - Cursor follower spring lag is disabled (instant tracking).
   - 3D perspective card tilts (`rotateX`, `rotateY`) are bypassed.
   - Magnetic displacement offsets are set to `(0, 0)`.
3. **Continuous Loop Elimination:**
   - No unmanaged continuous `requestAnimationFrame` loops or `setInterval` timers are introduced.
   - All pointer glow effects are strictly event-driven.
   - Three.js render ticks in `Hero3DStage` are paused by an `IntersectionObserver` whenever the canvas scrolls out of the viewport.
4. **Text Selection & Keyboard Focus:**
   - Project cards, headlines, highlights, and body paragraphs retain full native text selection (`user-select: text`).
   - All interactive anchors and buttons include high-visibility focus indicators (`:focus-visible`) for accessibility.
