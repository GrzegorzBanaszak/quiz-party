---
name: Quiz Clash
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ffb2b7'
  on-secondary: '#67001b'
  secondary-container: '#b50036'
  on-secondary-container: '#ffc2c4'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#00a74b'
  on-tertiary-container: '#003111'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#ffdadb'
  secondary-fixed-dim: '#ffb2b7'
  on-secondary-fixed: '#40000d'
  on-secondary-fixed-variant: '#92002a'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is engineered to evoke the high-energy, competitive atmosphere of a live game show, distilled into a sleek, modern web interface. It targets a social, tech-savvy audience looking for instant entertainment. 

The aesthetic is **Vibrant Modernism**—combining the immersive depth of dark mode with high-octane neon accents. It utilizes deep, atmospheric backgrounds to make interactive elements pop with almost tactile energy. The style avoids the "flatness" of traditional SaaS by using subtle gradients and layered depth, ensuring the UI feels alive and responsive to player actions.

## Colors
The palette is centered on a "Deep Universe" dark mode. The primary background is a rich navy-purple (`#0F172A`), providing a high-contrast canvas for the energetic action colors.

- **Action Palette:** 
    - **Electric Blue (`#0EA5E9`)**: Used for primary navigation and information.
    - **Neon Pink (`#F43F5E`)**: Used for "clash" moments, timers, and critical UI.
    - **Toxic Green (`#22C55E`)**: Reserved for correct answers and success states.
    - **Sunset Orange (`#F97316`)**: Used for warnings, secondary answer options, and points.
- **Surface Logic:** Backgrounds should use subtle radial gradients (e.g., from `#1E293B` to `#0F172A`) to create a sense of focus toward the center of the screen.

## Typography
This design system uses **Plus Jakarta Sans** for its friendly, rounded geometry and excellent legibility under pressure. 

- **Headlines:** Use ExtraBold (800) for question text and "Winner" screens. Tighten letter spacing on larger sizes to maintain a punchy, editorial feel.
- **Body:** Use Medium (500) for standard interface text to ensure it holds weight against the dark background.
- **Stats & Labels:** Use the `label-caps` style for player names, scores, and category tags to differentiate data from conversational text.

## Layout & Spacing
The layout follows a **Fluid-Center model**. On desktop, content is contained within a 1200px max-width, while mobile layouts utilize a full-width single column with generous 16px side margins.

- **Rhythm:** Use an 8px base grid. Components like answer cards should have "room to breathe," using `stack-md` (24px) for vertical separation.
- **Touch Targets:** In the game view, ensure all interactive elements (answers) have a minimum height of 64px to accommodate fast-paced mobile play.
- **Grids:** Use a 4-column grid for mobile and a 12-column grid for desktop. Answer options should span 6 columns (2x2 grid) on desktop and 12 columns (vertical stack) on mobile.

## Elevation & Depth
Depth is created through **Tonal Stacking** and **Vibrant Glows** rather than traditional grey shadows.

1.  **Base (0dp):** The main app background (`#0F172A`).
2.  **Surface (1dp):** Cards and panels (`#1E293B`) with a 1px inner border of `white @ 10%` to define edges.
3.  **Active/Hover (2dp):** Elements should appear to lift using a 12px blur shadow tinted with the element's accent color (e.g., a green answer card gets a soft green glow).
4.  **Overlays:** Modals and pop-ups use a backdrop blur (12px) to keep the game state visible but obscured.

## Shapes
The shape language is "Hyper-Rounded." This design system leverages large corner radii to maintain a friendly, toy-like feel that reduces the "stress" of a competitive quiz.

- **Large Components:** Main containers and game cards use `rounded-2xl` (1.5rem) or `rounded-3xl` (2rem).
- **Interactive Elements:** Buttons and input fields use pill-shaped (full-round) corners to signify clickability.
- **Feedback Icons:** Use rounded iconography (e.g., Lucide Rounded or Phosphor Duotone) to match the typeface.

## Components
- **Answer Cards:** Large, surface-colored blocks with thick 2px borders. On hover, the border and background should transition to the option's specific accent color (Blue, Pink, Green, or Orange).
- **Buttons:** 
    - *Primary:* Solid fill with a subtle top-down gradient and a "drop-glow" shadow.
    - *Secondary:* Ghost style with thick borders.
- **Progress Bars (Timer):** A thick, rounded track. As the timer depletes, transition the color from Electric Blue to Neon Pink.
- **Player Chips:** Circular avatars with a "Glow Ring" indicating who is currently typing or who has already answered.
- **Scoreboard:** A list component where the top player has a slight vertical offset and a "Golden" shadow effect.
- **Input Fields:** Darker than the surface background, using a "focus-glow" that matches the primary brand blue.