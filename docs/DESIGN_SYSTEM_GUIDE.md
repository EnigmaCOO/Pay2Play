# Design System Usage Guide for AI Assistants

## Overview

Pay2Play uses a dual-platform design system:
- **React Native/Expo**: Shared components in `shared/ui/` for mobile apps
- **Web (shadcn/ui)**: Components in `client/src/components/ui/` for web applications

## Component Locations

### React Native Components (Expo/Player App)

**Shared Components:**
- Location: `shared/ui/`
- Import pattern: `import ComponentName from '@shared/ui/ComponentName';`
- Available components:
  - `ScreenBackground` - Dark gradient background with light streaks
  - `PrimaryButton` - Gradient button with teal-green colors
  - `SecondaryButton` - Transparent button with border
  - `GlassCard` - Glassmorphism card component
  - `Chip` - Generic chip component
  - `SportChip` - Sport-specific chip with accent colors
  - `SegmentedTabs` - Tab navigation component
  - `DateChipStrip` - Horizontal date selector
  - `AppHeader` - App header component
  - `AppLogoHeader` - Logo and tagline header

**App-Specific Components:**
- Location: `apps/player-app/app/components/`
- Organized by feature area:
  - `booking/` - Booking-related components
  - `events/` - Event display components
  - `home/` - Home screen components
  - `matches/` - Match/game components
  - `messages/` - Messaging components
  - `onboarding/` - Onboarding flow components
  - `profile/` - Profile screen components
  - `venues/` - Venue display components

**Path Aliases (React Native):**
- `@/*` → `apps/player-app/*`
- `@shared/*` → `shared/*`

### Web Components (shadcn/ui)

**Base Components:**
- Location: `client/src/components/ui/` (based on shadcn/ui configuration)
- Import pattern: `import { ComponentName } from '@/components/ui/component-name';`
- Configured via: `components.json` (shadcn/ui "new-york" style)

**Custom Web Components:**
- Location: `client/src/components/`
- Import pattern: `import ComponentName from '@/components/ComponentName';`

**Path Aliases (Web):**
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

## Design System Guidelines

### Color System

**Primary Brand Colors:**
- Primary: `hsl(142 71% 45%)` - Vibrant teal-green (athletic, energetic)
- Surface (Dark): `hsl(220 13% 12%)` - Deep charcoal
- Surface (Light): `hsl(0 0% 98%)` - Off-white

**Sport-Specific Accents:**
- Cricket: `hsl(32 95% 55%)` - Orange (`cricket` in Tailwind)
- Football: `hsl(220 90% 56%)` - Electric blue (`football` in Tailwind)
- Padel: `hsl(280 65% 60%)` - Purple (`padel` in Tailwind)

**Semantic Colors:**
- Success: `hsl(142 71% 45%)` - Matches primary (`success` in Tailwind)
- Warning: `hsl(38 92% 50%)` - Amber (`warning` in Tailwind)
- Error: `hsl(0 84% 60%)` - Red (destructive in shadcn)

**Usage:**
- Use sport accent colors for CTAs, icons, active tabs, status badges
- Apply semantic colors for status indicators (confirmed, pending, cancelled)

### Typography

**Font Families:**
- Primary: `Inter` (Google Fonts) - Body text, UI elements
- Display: `Outfit` (Google Fonts) - Headlines, hero text

**Type Scale:**
- Hero Display: `text-6xl font-bold font-display`
- Section Headers: `text-4xl font-bold font-display`
- Card Titles: `text-xl font-semibold`
- Body: `text-base font-normal`
- Small/Meta: `text-sm font-medium`

**Tailwind Classes:**
- `font-sans` → Inter
- `font-display` → Outfit

### Spacing & Layout

**Spacing Primitives:**
- Common units: `2, 3, 4, 6, 8, 12, 16, 20, 24` (Tailwind units)
- Section padding: `py-16 md:py-24 lg:py-32`
- Card padding: `p-4 md:p-6`
- Gap utilities: `gap-3, gap-4, gap-6, gap-8`

**Container Strategy:**
- Page max-width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Content max-width: `max-w-4xl` (long-form reading)
- Grid breakpoints: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

### Component Patterns

#### Buttons

**React Native:**
- Use `PrimaryButton` from `@shared/ui/PrimaryButton` for main actions
- Use `SecondaryButton` from `@shared/ui/SecondaryButton` for secondary actions
- Props: `title`, `onPress`

**Web (shadcn/ui):**
- Use `Button` component from `@/components/ui/button`
- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Sport-colored buttons: Apply sport accent color classes (`bg-cricket`, `bg-football`, `bg-padel`)

#### Cards

**React Native:**
- Use `GlassCard` from `@shared/ui/GlassCard` for elevated content
- Glassmorphism style: `rgba(15, 23, 42, 0.8)` background with border

**Web:**
- Use `Card` component from `@/components/ui/card`
- Structure: `Card` → `CardHeader` → `CardTitle` → `CardContent`
- Apply sport accent borders for sport-specific cards

#### Forms

**React Native:**
- Input backgrounds: Slightly lighter than surface (`rgba(30, 41, 59, 0.8)`)
- Focus states: Sport accent color ring
- Validation: Inline error messages below fields
- Labels: `text-sm font-medium mb-2`

**Web:**
- Use `Input`, `Label`, `Textarea` from `@/components/ui/`
- Form validation with `react-hook-form` and `zod`
- Focus states: Sport accent color ring

#### Navigation

**React Native:**
- Sticky header with blur backdrop: `backdrop-blur-lg bg-surface/80`
- Sport selector tabs with active sport accent color
- Mobile: Hamburger menu with slide-out drawer
- Use `SegmentedTabs` from `@shared/ui/SegmentedTabs`

**Web:**
- Sticky header with blur backdrop
- Sport selector tabs maintain accent color
- Mobile: Hamburger menu with slide-out drawer

## Implementation Guidelines

### When Creating New Components

1. **Determine Platform:**
   - React Native → Use `shared/ui/` if reusable across apps
   - React Native → Use `apps/player-app/app/components/` if app-specific
   - Web → Use `client/src/components/ui/` for base components (shadcn/ui)
   - Web → Use `client/src/components/` for custom components

2. **Follow Design Patterns:**
   - Use sport accent colors for sport-specific elements
   - Apply semantic colors for status indicators
   - Use Inter for body text, Outfit for headlines
   - Follow spacing primitives from design guidelines

3. **Component Structure:**
   - React Native: Use `StyleSheet.create()` for styles
   - Web: Use Tailwind CSS classes
   - Both: Accept props for customization (variant, size, etc.)

4. **Import Patterns:**
   - Always use path aliases (`@shared/*`, `@/*`) instead of relative paths
   - React Native: `import ScreenBackground from '@shared/ui/ScreenBackground';`
   - Web: `import { Button } from '@/components/ui/button';`

### Styling Best Practices

1. **Dark Mode Support:**
   - Use CSS variables for colors (defined in Tailwind config)
   - React Native: Use theme-aware colors from `constants/theme.ts`

2. **Responsive Design:**
   - Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
   - Mobile-first approach

3. **Animations:**
   - Strategic use only (skeleton loaders, button interactions, modal entry/exit)
   - Button interactions: `active:scale-95`
   - Card hover: `hover:shadow-lg transition-shadow`
   - NO scroll-triggered animations or parallax

4. **Accessibility:**
   - Use semantic HTML elements (web)
   - Provide proper labels and ARIA attributes
   - Ensure sufficient color contrast

## Reference Files

- **Design Guidelines**: `design_guidelines.md` - Complete design system documentation
- **shadcn/ui Config**: `components.json` - Component library configuration
- **Tailwind Config**: `tailwind.config.ts` - Theme and color definitions
- **TypeScript Config**: `tsconfig.json` - Path alias definitions
- **React Native Theme**: `apps/player-app/constants/theme.ts` - Theme constants

## Common Patterns

### Game Discovery Cards
- Horizontal layout: Image left (16:9 aspect), content right
- Sport icon badge (top-right with sport accent color)
- Status indicator with semantic colors
- Price display: Large, bold with "per player" context
- Quick-join CTA: Sport-colored button

### Venue Cards
- Image gallery carousel (3-5 photos)
- Verified badge for partner venues
- Sport availability pills (Cricket, Football, Padel)
- Pricing range, amenities icons
- Rating stars with review count

### Booking Flow
- Step indicator (1/3, 2/3, 3/3) with progress bar
- Sticky summary card showing total, breakdown, refund policy
- Date/time picker with venue availability heatmap
- Payment method selector with saved cards
- Confirmation screen with calendar add, share options

### Auth, Sign-Up & OTP Screens

**Relevant files (Expo player app):**
- `apps/player-app/app/(auth)/sign-up.tsx`
- `apps/player-app/app/(auth)/phone-entry.tsx`
- `apps/player-app/app/(auth)/otp-verification.tsx`
- `apps/player-app/app/(onboarding)/welcome.tsx`
- Any new auth/onboarding screens under `apps/player-app/app/(auth)/` or `apps/player-app/app/(onboarding)/`

**Layout & Containers:**
- Always wrap auth screens with `ScreenBackground` from `@shared/ui/ScreenBackground` to get the signature dark gradient background.
- Use `AppLogoHeader` from `@shared/ui/AppLogoHeader` at the top for logo + tagline on the first auth/onboarding screens (welcome, sign-up entry).
- Maintain vertical spacing using the spacing primitives from the guide (e.g. 16–24 px equivalents in React Native via `padding`, `margin`).

**Buttons:**
- Primary CTA on each auth step MUST use `PrimaryButton` from `@shared/ui/PrimaryButton`:
  - Examples: “Continue”, “Send code”, “Verify code”, “Create account”.
- Secondary/tertiary actions (e.g. “Back”, “Log in instead”, “Resend code”) SHOULD use `SecondaryButton` from `@shared/ui/SecondaryButton` or simple text links styled with reduced emphasis.
- Do NOT invent new button styles for auth; reuse `PrimaryButton`/`SecondaryButton`.

**Inputs & Error States:**
- For phone, email, name, and OTP inputs:
  - Use React Native’s `TextInput` with styling aligned to forms guidelines:
    - Dark mode input background slightly lighter than the overall background.
    - Border or underline that changes color on focus (primary teal) and error (red).
  - Place labels above inputs using `text-sm font-medium` semantics (in RN styles).
  - Show validation errors directly under the relevant field with small red text and clear copy (e.g. “Enter a valid phone number”).
- OTP input rows SHOULD use the shared pattern from `apps/player-app/app/components/onboarding/OtpInputRow.tsx` where possible.

**State & Feedback:**
- When sending or verifying OTP:
  - Disable the primary button while the request is in flight.
  - Show a subtle loading indicator or “Verifying…” label; avoid aggressive animations.
  - Use semantic colors from the design system for error states (red) and success (primary teal).
- If a resend timer exists, visually de‑emphasize it (secondary text color) but keep it clearly readable.

**Copy & Hierarchy:**
- Headline text on auth screens uses the display typography guidelines:
  - Short, clear headlines in the style of `text-2xl–4xl font-display font-bold` (mapped to RN styles).
- Supporting text (explanations, helper copy) uses body typography:
  - `text-base` equivalent, Inter font, normal weight.
- Keep each step focused on **one primary action** (e.g. “Enter phone number” vs mixing multiple decisions on one screen).

**Color Usage:**
- Auth screens generally use the **primary teal** (`success` color) for CTAs and highlights.
- Avoid sport‑specific accents (cricket/football/padel) in auth flows unless the screen explicitly asks for sport preferences; in that case:
  - Use `SportChip` from `@shared/ui/SportChip` for selectable sport preferences.
  - Keep the rest of the screen neutral so chips stand out.

**Imports (Auth Screens):**
- Use aliases, not relative deep paths:
  - `import ScreenBackground from '@shared/ui/ScreenBackground';`
  - `import AppLogoHeader from '@shared/ui/AppLogoHeader';`
  - `import PrimaryButton from '@shared/ui/PrimaryButton';`
  - `import SecondaryButton from '@shared/ui/SecondaryButton';`
  - `import SportChip from '@shared/ui/SportChip';` (for sport preference steps)
- For app-specific auth helpers under `apps/player-app/app/components/onboarding/` or `(auth)/`, import them via relative paths but still prefer shared components where possible.

**AI Execution Rule:**
- When generating or editing any screen under `apps/player-app/app/(auth)/` or `apps/player-app/app/(onboarding)/`, the AI MUST:
  - Use `ScreenBackground` for the page wrapper.
  - Use `AppLogoHeader` on the first screen in the flow (or when branding needs emphasis).
  - Use `PrimaryButton`/`SecondaryButton` instead of ad‑hoc button implementations.
  - Apply typography, spacing, and color rules from this design system rather than raw ad‑hoc styles.

