# Pay2Play – Players App PRD

This document standardizes headings across all player-side screens.  
Each screen’s title is aligned with the **wireframes document** titles.  
For each screen, the core sections are:

- **Concept Snapshot** (when applicable)
- **Visual Walkthrough** (top → bottom)
- **Detailed Visual Spec**
- **Component Mapping**
- **Feature Mapping**

Only headings that apply to a given screen are used.

---

## Screen 1 – Onboarding Welcome

### Concept Snapshot
A dark, immersive “sports cosmos” that introduces Pay2Play as the place where all your games start. A glowing orb, floating sports icons, and a clean tagline establish brand, trust, and vibe.

---

### Visual Walkthrough

#### Background
- Full-screen vertical gradient:
  - Top: deep midnight navy (#020617)
  - Bottom: slightly brighter teal-indigo mix
- Soft diagonal “floodlight” streaks for stadium feel
- Tiny drifting particles to add depth without distracting

#### Status Bar
- Standard OS status bar at top
- Light icons (battery, network, time) in white
- Cleanly readable over dark gradient

#### Brand & Tagline Block (Top Center)
- Center-top Pay2Play wordmark:
  - White base
  - Neon accent on “2” or “Play” with subtle glow
- **Primary tagline** (one line, big and clean):
  - “Pay less. Play more.”
- **Secondary line** (smaller, below primary):
  - “Book a pitch in under 60 seconds.”
- Visual feeling:
  - Sharp humanist sans-serif
  - “Sports-tech fintech” tone — serious yet friendly

#### Hero Orb & Icons (Centerpiece)
- Large glowing orb (~240–280px tall) in the center
- Inner gradient: teal → electric green → cobalt
- Soft outer blur glow suggesting a light source on dark glass
- Orbiting icons with subtle motion paths:
  - Cricket bat/ball
  - Football
  - Padel racket/ball
- Each icon has a thin neon stroke/halo
- Faint pitch outlines behind orb (5-a-side or cricket arcs) at ultra-low opacity

#### Value Pill Row (Below Orb)
- Three rounded glass pills directly under orb:
  1. Shield icon — “Vetted venues”
  2. Clock/bolt icon — “Real-time slots”
  3. Tag/price icon — “Live discounts”
- Glassmorphism:
  - Background: rgba(15,23,42,0.6)
  - Border: 1px rgba(148,163,184,0.5)
  - Soft inner glow
- Subtle slide-up, staggered animation when screen appears

#### Primary Call-to-Action Block
- Centered large button:
  - Label: **“Get Started”**
  - Full-width with side margins
  - Height ~52px
  - Rounded-2xl
  - Gradient fill: teal → electric green
  - Slight outer glow and drop shadow
- Small helper text under button:
  - “Continue with your phone number”

#### Secondary Action
- Secondary action below primary:
  - “Explore first” (ghost / outline button or link)
  - Soft teal/indigo outline and label
  - Used for guest/teaser mode in MVP

#### Bottom Meta Block
- Login hint:
  - “Already playing with Pay2Play?” + tappable “Log in”
- Legal:
  - “By continuing, you agree to our Terms and Privacy Policy.”
  - “Terms” and “Privacy Policy” underlined and tappable

---

### Detailed Visual Spec

- **Layout**
  - Full-bleed gradient background anchored to safe areas
  - Vertical stack:
    1. Status bar
    2. Brand & tagline block
    3. Hero orb section
    4. Value pill row
    5. Primary & secondary CTAs
    6. Bottom meta (login + legal)
- **UI Components**
  - AppLogoHeader (logo + primary and secondary tagline)
  - HeroOrb (orb + orbiting sport icons)
  - FeaturePill (icon + label, glass style)
  - PrimaryButton (gradient)
  - SecondaryButton/GhostButton
  - BottomMeta (login + legal text)
- **Background & Overall Feel**
  - Futuristic, night-time sports arena
  - Calm but powerful—no harsh flashing, only soft glows
  - All text high contrast on dark background (accessibility)

---

### Component Mapping

- **Layout**
  - `ScreenBackground` – gradient + optional particles
  - `ScreenContainer` – safe-area wrapper + padding

- **UI Components**
  - `AppLogoHeader`
    - Props: primaryTagline, secondaryTagline
  - `HeroOrb`
    - Props: iconList, animationEnabled
  - `FeaturePill`
    - Props: iconName, label
  - `PrimaryButton`
    - Props: label, onPress
  - `SecondaryButton` / `GhostButton`
    - Props: label, onPress
  - `BottomMeta`
    - Props: loginLabel, onLoginPress, onTermsPress, onPrivacyPress

---

### Feature Mapping

- Introduces brand and core value proposition (discounted sports bookings).
- Entry point into:
  - Phone-based signup flow (Screens 2A–2C).
  - Optional guest exploration mode.
- Creates mental model:
  - Vetted venues
  - Real-time slots
  - Discounts
- Establishes visual identity used across rest of app.

---

## Screen 2A – Phone Entry

### Concept Snapshot
**Mock images:** `IMG_3452.jpeg`, `IMG_3459.jpeg`  
User tapped **Get Started**. The experience zooms “closer to the orb” and shifts from inspiration to identity: “Who’s stepping on the pitch?”

---

### Visual Walkthrough

#### Background & Overall Feel
- Same dark neon gradient as Screen 1 for continuity
- Hero orb smaller and slightly elevated, making room for form card
- Feels like entering a “control room” for your sports life

#### Header Row
- Left: Back chevron (`‹`) to Onboarding Welcome
- Right/center: small Pay2Play logo for continuity

#### Title & Subtitle
- Title: “Let’s get your number”
- Subtitle: “We’ll use it to secure your bookings.”
- Subtitle in muted, secondary color

#### Glass Card for Input
- Central glass card (~90% width):
  - Background: rgba(15,23,42,0.75) + blur
  - Border: soft 1px teal/indigo accent
- Inside:
  - Label: “Phone number”
  - Country code dropdown pill: `+92` on left
  - Single-line text field for phone number
  - Below:
    - Hint: “WhatsApp number works best.”
    - Small shield icon + copy: “We never spam.”

#### CTA Button
- Primary button under card:
  - Label: “Continue”
  - Subtext: “We’ll send you a one-time code.”

#### Secondary Helpers
- Support link under CTA:
  - “Having trouble? Chat with us” (future support channel)
- Bottom: repeated legal line from Screen 1 (same pattern)

---

### Detailed Visual Spec

- **Layout**
  - Stack:
    1. Header row
    2. Title + subtitle
    3. PhoneInputCard
    4. Primary CTA
    5. Secondary helpers
- **UI Components**
  - `AppHeader` (back + small logo)
  - `PhoneInputCard`:
    - Country code dropdown
    - Input field
    - Hint + trust badge
  - `PrimaryButton`
  - `SecondaryLinkText` (“Having trouble? Chat with us”)

---

### Component Mapping

- `ScreenBackground`
- `AppHeader`
  - Props: title?, onBack, showLogo
- `PhoneInputCard`
  - Props: value, onChange, countryCode, onCountryChange, hints
- `HintText`
- `SupportLink`
- `PrimaryButton`
- `LegalFooter` (reusable legal text row)

---

### Feature Mapping

- Collects primary authentication identifier (phone).
- Initiates OTP flow on **Continue**:
  - Validates local phone format.
  - Triggers OTP send (backend).
- Establishes trust with explicit “We never spam” and support access.

---

## Screen 2B – OTP Verification

### Concept Snapshot
**Mock images:** `IMG_3451.jpeg`, `IMG_3461.jpeg`  
The orb “sends a signal” as OTP is dispatched. Screen shifts to code entry state to confirm ownership of the phone.

---

### Visual Walkthrough

#### Background & Orb
- Same gradient and orb as 2A
- Orb dimmed behind a frosted layer to focus attention on OTP entry

#### Header & Number
- Back chevron to phone entry
- Number line:
  - “+92 XXX-XXXXXXX” (obfuscated or full per policy)

#### OTP Input
- Six rounded boxes in a horizontal row
- Each box:
  - Glassy background
  - Active box:
    - Teal border glow
- Activates numeric keyboard on focus

#### Timer & Options
- Under OTP boxes:
  - “Resend code in 00:34” (countdown)
  - “Change number” as text link

#### Primary CTA
- Button label: “Verify & Continue”
- Disabled state until all 6 digits filled

#### Success Micro-Animation
- On success:
  - Orb briefly glows bright
  - Microcopy: “Great, you’re in!”
  - Transition to Basic Info (Screen 2C)

---

### Detailed Visual Spec

- **Layout**
  - Header
  - Number description
  - OTPInputRow
  - Timer + change link
  - Primary button
- **UI Components**
  - `OtpInputRow` (6 boxes)
  - `CountdownText`
  - `InlineLink` (“Change number”)
  - `PrimaryButton` with disabled state

---

### Component Mapping

- `OtpInputRow`
  - Props: length=6, value, onChange, onFilled
- `CountdownText`
  - Props: remainingSeconds
- `InlineLink`
  - Props: label, onPress
- `PrimaryButton`

---

### Feature Mapping

- Verifies ownership of phone number.
- Manages OTP resend timing.
- Branches:
  - On success → Screen 2C
  - On change number → Screen 2A
- Hook for future security (rate limiting, error states, etc.).

---

## Screen 2C – Basic Info Setup (Name, Avatar, Sports)

### Concept Snapshot
**Mock images:** `IMG_3453.jpeg`, `IMG_3456.jpeg`  
Transition from device identity to **player identity**: who is actually stepping on the pitch?

---

### Visual Walkthrough

#### Step Indicator
- Top-right chip: “Step 2 of 3”
- Rounded pill with slim border

#### Avatar Carousel
- Horizontally scrollable avatars:
  - Stylized player headshots, diverse
- Selected avatar:
  - Neon ring outline
  - Slight scale-up + shadow glow

#### Name Card
- Glass card:
  - Label: “Your name”
  - Text field: placeholder “Your full name”
  - Example filled in mocks: “Muhammad Abdullah”

#### Preferred Sports Chips
- Label: “What do you play?”
- Multi-select chips:
  - [ Cricket ], [ Football ], [ Padel ]
- Selected:
  - Teal gradient fill, white text, icon
- Unselected:
  - Transparent with border

#### CTA
- Primary button: “Continue”
- Subtext: “Next: your city & time preferences” (or similar)

---

### Detailed Visual Spec

- **Layout**
  - Header with step indicator
  - Avatar row
  - Name card
  - Sports chip grid
  - CTA
- **UI Components**
  - `StepIndicator`
  - `AvatarCarousel`
  - `GlassField` (for name)
  - `SportChip` (multi-select)
  - `PrimaryButton`

---

### Component Mapping

- `StepIndicator`
  - Props: current=2, total=3
- `AvatarCarousel`
  - Props: avatars[], selectedId, onChange
- `GlassField`
  - Props: label, value, onChange
- `SportChip`
  - Props: label, iconName, selected, onToggle

---

### Feature Mapping

- Captures user identity (name + avatar).
- Captures preferred sports to:
  - Personalize “My sports” filters on Home & Matches.
  - Seed future recommendations.
- Progresses onboarding flow to Screen 3 (prefs).

---

## Screen 3 – City & Time Preferences + Game Style

### Concept Snapshot
Calibrates how and where the user plays so the app can personalize content: “We’ll surface the right games and venues from day one.”

---

### Visual Walkthrough

#### Background & Overall Feel
- Same neon sports cosmos
- Orb minimized and parked top-right as a “floating assistant”

#### Header Row
- Left: Back to Screen 2C
- Right: Step indicator — “Step 3 of 3”
- Title: “Where and when do you usually play?”
- Subtitle: “We’ll use this to surface the right games.”

#### City Card
- Glass card:
  - Label: “City”
  - Dropdown field default: “Lahore ▾”
  - Hint: “We’re starting with Lahore—more cities soon.”

#### Neighborhood Card
- Label: “Neighborhood”
- Pill-shaped text field:
  - Placeholder: “Type to search your area…”
- Suggested chips below:
  - [ DHA ], [ Gulberg ], [ Johar Town ], [ Model Town ], [ Cantt ]
- Selected chip uses teal gradient fill and glow
- Microcopy: “This helps us prioritize nearby venues.”

#### Typical Play Times Card
- Label: “When do you usually play?”
- Multi-select chips:
  - [ Weekday evenings ]
  - [ Weekend mornings ]
  - [ Weekend nights ]
  - [ Flexible / whenever ]
- 2-column arrangement; selected chips glow

#### Game Style Card
- Label: “What kind of games do you want?”
- Multi-select chips:
  - [ Casual pickup games ]
  - [ Competitive matches ]
  - [ Leagues & tournaments ]
  - [ I’m open to anything ]
- Each with small icon:
  - Casual = 🙂, Competitive = 🏆/target, Leagues = trophy/shield, Open = spark/∞

#### CTA
- Full-width primary button:
  - Label: “Finish setup and see games”
  - Gradient teal → lime, arrow icon
- Tap leads to first-time Home (Screen 4)

---

### Detailed Visual Spec

- **Layout**
  - Header (back + step indicator)
  - City card
  - Neighborhood card
  - Play times card
  - Game style card
  - CTA at bottom

- **UI Components**
  - `GlassCard`
  - `CityDropdown`
  - `NeighborhoodField` + suggested chips
  - `Chip` (reused for neighborhood, times, game styles)
  - `PrimaryButton`

---

### Component Mapping

- `OnboardingScreen` wrapper
- `GlassCard`
  - Props: title, hint?, children
- `CityDropdown`
  - Props: value, options, onChange
- `NeighborhoodField`
  - Props: value, onChangeText, suggestedAreas[], onAreaSelect
- `Chip`
  - Props: label, icon?, selected, onPress
- `StepIndicator`
- `PrimaryButton`

---

### Feature Mapping

- Writes to **Player Profile**:
  - City
  - Primary neighborhood
  - Preferred play times
  - Preferred game styles
- Drives:
  - Default filters on Home, Venues, Matches, Events
  - Personalization (“Tonight”, “This weekend”, “My sports” chips)
- Completes onboarding and enables personalized Home experience.

---

## Screen 4 – Home (First-Time Personalized View)

### Concept Snapshot
**Mock images:** `IMG_3442.jpeg`, `IMG_3447.jpeg`, `IMG_3448.jpeg`, `IMG_3454.jpeg`, `IMG_3455.jpeg`, `IMG_3464.jpeg`  
After onboarding, the app shifts from questions to **answers**:
“Here are the best venues and matches for you in Lahore, at your preferred times.”

---

### Visual Walkthrough

#### Background & Frame
- Same dark neon gradient as onboarding
- Orb becomes a small HUD element near top-right; gently pulsing

#### Header: Greeting & Location
- Left:
  - “Hey, Abdullah 👋”
  - “Ready to play this week?”
- Right:
  - Location pill: `📍 Lahore ▾`
- Orb nearby as ambient “AI presence”

#### Filter Chips Row
- Horizontal chips under greeting:
  - [ Tonight ], [ This weekend ], [ My sports ], [ All ] (optional)
- Selected: teal gradient, white text
- Unselected: transparent, bordered

#### Hero Action Card – Book a Pitch
- Prominent glass card:
  - Title: “Book a pitch in 60 seconds”
  - Subtitle: “See real-time slots at vetted venues near you.”
  - Future line: “You saved PKR X last time.”
- Internal button:
  - [ Book now ] (mini primary CTA)
- Right-aligned link under card:
  - “See all venues →”

#### Section: Games Needing Players
- Header:
  - “Games needing players near you”
  - “View all →” link to Matches tab pre-filtered
- Horizontal scroll of **HostMatchCard** items:
  - Sport chip (“Football · 5-a-side”)
  - Time (“Tonight · 9:00 PM”)
  - Venue + area
  - “Needs 2 players”
  - Avatars row
  - Right CTA: [ Join ]

#### Section: Top Venues for You
- Header:
  - “Top venues for you in Lahore”
  - “See all →” link to Venues tab
- Venue cards:
  - Image at top with “Up to 20% off” badge
  - Venue name, area, sport type
  - “From PKR X / hour”
  - Chip: highlight slot (e.g., “Tonight: 8 PM slot”)

#### Section: Leagues & Events
- Header:
  - “Leagues & events this month”
  - “All events →”
- Horizontal event mini-cards:
  - Name, sport/format
  - Date range
  - Venue
  - Optional urgency badge (“Spots filling fast”)

#### Bottom Navigation
- Frosted-glass tab bar with:
  - Home, Venues, Matches, Messages, Me
- Selected tab has solid icon & teal underline

---

### Detailed Visual Spec

- **Layout**
  - Scrollable content with sticky bottom tab bar
  - Sections separated by subtle spacing and headings
- **UI Components**
  - `HomeHeader` (greeting + location)
  - `FilterChipsRow`
  - `HeroActionCard`
  - `SectionHeader`
  - `HostMatchCard`
  - `VenueCard`
  - `EventMiniCard`
  - `AppTabNavigator` (custom frosted tab bar)

---

### Component Mapping

- `HomeScreen`
  - Props: user profile, personalization data
- `HomeHeader`
  - Props: userName, location, onLocationPress
- `FilterChipsRow`
  - Props: filters[], selectedFilter, onFilterChange
- `HeroActionCard`
- `SectionHeader`
- `HostMatchCard`
- `VenueCard`
- `EventMiniCard`
- `AppTabNavigator`

---

### Feature Mapping

- Central hub for:
  - Venue discovery
  - Host-led games & matching
  - Leagues & events discovery
- Uses onboarding prefs (city, sports, times, game style) to:
  - Pre-filter content
  - Drive “Tonight / This weekend / My sports”
- Single-tap paths to:
  - Book a pitch
  - Join games
  - Explore events

---

## Screen 5 – Venue Detail + Real-time Availability

### Concept Snapshot
**Mock images:** `IMG_3448.jpeg`, `IMG_3450.jpeg`, `IMG_3463.jpeg`, `IMG_3465.jpeg`  
Venue “profile + live control panel”: cinematic ground imagery at top, live availability grid at bottom, with discount messaging.

---

### Visual Walkthrough

#### Header
- Left: back arrow
- Title: venue name (single line, ellipsized)
- Subtitle: “Area · Sport · Indoor/Outdoor”
- Right:
  - Heart (favorite)
  - Overflow menu (share/report)

#### Hero Image Carousel
- Edge-to-edge image slideshow of turf/venue
- Overlay chips:
  - Top-left: “Vetted venue”
  - Bottom-left: “Save up to 20%”
  - Bottom-right: “Indoor · 5-a-side”

#### Venue Info Strip
- Glass info bar under hero:
  - **Rating**: ★4.7 & review count
  - **Price**: “From PKR 5,000 / hour”
  - **Discount**: “You save up to 20%”

#### Segmented Tabs
- [ About ] [ Availability ] [ Location ]
- Default active: **Availability**

#### Date Selector
- “Choose your date & time”
- Horizontal chips:
  - [ Today · 25 ], [ Wed 26 ], [ Thu 27 ], etc.
- Selected date: filled gradient, glowing border

#### Pitch / Court Selector
- Label: “Pitch”
- Chips:
  - [ Court A ], [ Court B ], [ Court C ]
- Hidden if only one pitch

#### Time Slot Grid
- Grid of slot cards (2–3 columns):
  - Each displays time range, status, price (when selected)
- States:
  - Available: accent border, hover/focus gradient
  - Booked: greyed with “Booked”
  - Unavailable/past: faint, non-interactive
  - Selected: strong gradient, white text, shadow
- Helper text under grid:
  - “Slots are for 60 minutes. Prices shown include your Pay2Play discount.”

#### Footer Booking Bar
- Sticky bar visible when a slot is selected:
  - Left:
    - Date + time
    - Discounted + original price
    - “You save PKR X”
  - Right:
    - [ Continue → ] primary CTA

---

### Detailed Visual Spec

- **Layout**
  - Scrollable content:
    - Header overlay
    - Hero image carousel
    - Info strip
    - Tabs
    - Availability content
    - Sticky footer
- **UI Components**
  - `VenueHeader`
  - `VenueImageCarousel`
  - `VenueInfoStrip`
  - `SegmentedTabs`
  - `DateChipStrip`
  - `PitchSelector`
  - `SlotGrid` + `SlotCard`
  - `BookingFooterBar`

---

### Component Mapping

- `VenueDetailScreen`
  - Props: venueId
- `VenueHeader`
  - Props: name, locationText, isFavorite, onBack, onToggleFavorite, onMenuPress
- `VenueImageCarousel`
  - Props: images[], discountBadgeText?, tags[]
- `VenueInfoStrip`
  - Props: rating, reviewsCount, priceFrom, discountPercentage
- `SegmentedTabs`
- `DateChipStrip`
- `PitchSelector`
- `SlotGrid`
  - Props: slots[], selectedSlotId, onSelectSlot
- `BookingFooterBar`
  - Props: visible, date, time, finalPrice, originalPrice, savingsAmount, onContinue

---

### Feature Mapping

- Venue discovery → builds trust with ratings & vetted badges.
- Slot selection → real-time availability UI for booking engine.
- Discounts → explicit vs original price, savings messaging.
- Entry into booking flow:
  - Selecting a slot + Continue → Screen 6 (review & payment).

---

## Screen 6 – Booking Review & Payment

### Concept Snapshot
**Mock images:** `IMG_3463.jpeg`, `IMG_3465.jpeg`  
Sports-fintech style checkout: transparent price breakdown, discounts, loyalty credits, and payment method choice.

---

### Visual Walkthrough

#### Header
- Back arrow
- Title: “Booking review”
- Subtitle lines:
  - Venue name
  - “Date · Time · Sport · Court”

#### Booking Summary Card
- Glass card summarizing booking:
  - Sport & format
  - Date/time
  - Venue + area
  - (Optional) players info
- “Change slot” link top-right (returns to Screen 5)

#### Price Breakdown Card
- Main financial hero card:
  - Line items:
    - Base pitch price — PKR X
    - Pay2Play discount — -PKR Y
    - Use credits (Z available) + toggle — -PKR Z (when ON)
  - Divider line
  - Total to pay — PKR final
  - Savings copy: “You save PKR X today.”
- Helper text under card:
  - “Discount powered by venue promos on Pay2Play.”

#### Payment Method Section
- Title: “Choose how you want to pay”
- Selectable tiles with radio buttons:
  - JazzCash
  - Easypaisa
  - Card (Visa/Mastercard)
- Selected tile:
  - Accent border + background highlight
- “Remember this method next time” checkbox + small copy

#### Confirm & Pay Button
- Large primary button near bottom:
  - “Confirm & Pay PKR {amount}”
  - Lock/shield icon
- Subtext:
  - “Secure payment via [GatewayName]”
  - “Your slot will be reserved once payment is successful.”

---

### Detailed Visual Spec

- **Layout**
  - Header
  - Booking summary card
  - Price breakdown card
  - Payment method list
  - Confirm button & helper text
- **UI Components**
  - `BookingSummaryCard`
  - `PriceBreakdownCard`
  - `PaymentMethodList`
  - `RememberMethodCheckbox`
  - `ConfirmPayButton`

---

### Component Mapping

- `BookingReviewScreen`
  - Route params: booking data (venue, date/time, prices, credits)
- `BookingSummaryCard`
- `PriceBreakdownCard`
  - Props: basePrice, discountAmount, creditsAvailable, creditsApplied, onToggleCredits
- `PaymentMethodList`
  - Props: methods[], selectedMethodId, onSelectMethod
- `RememberMethodCheckbox`
- `ConfirmPayButton`
  - Props: amount, onPress, loading

---

### Feature Mapping

- Final confirmation step for booking engine.
- Integrates digital payments (JazzCash/Easypaisa/card).
- Applies venue discounts + loyalty credits.
- Persists payment method preference for faster future checkouts.

---

## Screen 7 – Booking Success

### Concept Snapshot
Calm celebration moment: “You did it. Your game is locked in.” Provides next actions: host a match, share, or review bookings.

---

### Visual Walkthrough

#### Background & Atmosphere
- Same dark neon cosmos
- Large orb behind content, softly glowing
- Subtle streaks as “confetti” (not party-like, more sporty)

#### Hero Confirmation Block
- Center icon:
  - Glowing badge with neon ring
  - Checkmark overlay on small pitch icon
- Headline:
  - “Booking confirmed”
- Subheadline:
  - “Your game is locked in.”
- Small animation:
  - Orb pulse, checkmark scale-in

#### Booking Summary Card
- Glass card:
  - Venue
  - Date/time, sport, court
  - Area
  - Divider
  - “Paid: PKR X”
  - “You saved PKR Y with Pay2Play”
- Card tap opens Booking Detail (future screen)

#### Primary CTA – Host Match
- Button: “Host a match from this slot”
- Icon: whistle/captain symbol
- Full-width, gradient teal → blue

#### Secondary CTAs
- “Share with your team”
  - Ghost/outline button, opens OS share sheet
- “View my bookings”
  - Text/outline button; navigates to My Bookings

#### Helper Text
- “You can manage this booking anytime in My Bookings under your profile.”

---

### Detailed Visual Spec

- **Layout**
  - Hero icon + confirmation text
  - Booking summary card
  - Primary CTA
  - Secondary CTAs
  - Helper text
  - Bottom nav (optional visible)
- **UI Components**
  - `SuccessHero`
  - `BookingSummaryCard` (slightly different from review)
  - `PrimaryButton`
  - `SecondaryButton`

---

### Component Mapping

- `BookingSuccessScreen`
  - Params: bookingId
- `SuccessHero`
  - Props: title, subtitle, iconType
- `BookingSummaryCard`
  - Props: venueName, sport, dateTime, area, pitchName, amountPaid, savings
- `PrimaryButton` (“Host a match from this slot”)
- `SecondaryButton` (“Share with your team”, “View my bookings”)

---

### Feature Mapping

- Confirms booking visually & emotionally.
- Launchpad into:
  - Host Match Setup (Screen 9).
  - Sharing (virality; team coordination).
  - My Bookings (Screen 11).
- Re-affirms value of Pay2Play via savings copy.

---

## Screen 8 – Matches Tab (Games Needing Players)

### Concept Snapshot
**Mock images:** `IMG_3444.jpeg`, `IMG_3446.jpeg`  
A “live lobby” of open matches: host-led games and LFP/LFG posts, with filters and a clear Join action.

---

### Visual Walkthrough

#### Header
- Title: “Matches”
- Subtitle: “Find games you can join today”
- Right: [ Filters ▾ ] (opens advanced filter sheet)

#### Filter Chips Row
- Horizontal chips:
  - [ Near me ], [ Tonight ], [ This weekend ], [ My sports ], [ Casual ], [ Competitive ]
- Selected: gradient fill, white text
- Unselected: outline

#### Host Match CTA
- Inline pill button under filters:
  - Icon: whistle/hat
  - Label: “Host a match”
  - Outline style
- Opens Host Match Setup (Screen 9)

#### Match Card List
- Vertical scrolling stack of cards, each representing a match

**Match Card – Host-Led (with booking)**
- Top chips:
  - “Host-led · Slot confirmed”
  - Sport chip: e.g. “⚽ Football”
- Title:
  - e.g. “5-a-side high tempo”
- Time:
  - “Tonight · 9:00–10:00 PM”
- Location:
  - “Star Futsal Arena · DHA Phase 5”
- Players row:
  - Avatars of host + joined players + “+N”
  - “Needs X more players”
  - Skill level (optional)
- Footer:
  - Left: “PKR 400 each” or “Pay at venue”
  - Right: [ Join now ] (or [ Request to join ])

**Match Card – LFP/LFG (no booked venue)**
- Top chips:
  - “Looking for players”
  - Sport chip
- Title:
  - e.g. “Casual tape ball in DHA”
- Time:
  - “Friday · 11:00 PM–1:00 AM”
- Location:
  - “DHA · Looking for ground”
- Footer:
  - Payment note (if any)
  - CTA: [ Request to join ]

#### Tags / Microchips
- “Few spots left”, “New”, “Verified host” as small chips on card corner

#### Empty State
- If no matches for current filters:
  - Icon
  - “No games match your filters right now.”
  - [ Clear filters ]
  - Subtext: “Or tap ‘Host a match’ to start your own.”

---

### Detailed Visual Spec

- **Layout**
  - Header
  - Filter chips
  - Host-match CTA
  - Match card list
- **UI Components**
  - `ScreenHeader`
  - `FilterChipsRow`
  - `HostMatchPill`
  - `MatchCard`
  - `FiltersBottomSheet` (advanced filters)

---

### Component Mapping

- `MatchesScreen`
  - Drives data fetch by location + filters
- `ScreenHeader`
  - Props: title, subtitle, rightActionLabel, onRightActionPress
- `FilterChipsRow`
  - Props: filters[], selectedFilters[], onToggle
- `HostMatchPill`
- `MatchCard`
  - Props: type, sport, format, title, dateTime, locationText,
    needsPlayers, joinedPlayersAvatars[], skillLevel?, costPerPlayer?,
    paymentNote?, tags[], onPressJoin, onPressCard
- `FiltersBottomSheet`

---

### Feature Mapping

- Player matching hub:
  - Discover & join open games.
- Host-led gameplay:
  - Surface host-created matches and allow quick hosting.
- Uses onboarding prefs:
  - City, sports, time & game style for default filtering.
- Future integration point for in-app chat & notifications.

---

## Screen 9 – Host Match Setup

### Concept Snapshot
A mission setup panel for hosts: configure match details (title, players needed, skill, cost, notes) tied to a confirmed booking or general LFP.

---

### Visual Walkthrough

#### Header & Explanation
- Back arrow
- Title: “Host a match”
- Subtitle: “Turn this booking into a game others can join.”

#### Linked Booking Card
- Glass card showing:
  - Venue
  - Date & time
  - Sport + pitch
  - Area
- Right: `[ Change booking ▾ ]` to choose another upcoming booking

#### Game Details Card

1. **Match Title**
   - Label: “Match title”
   - Single-line input:
     - Placeholder: “e.g. 5-a-side high tempo”

2. **Players Needed**
   - Label: “Players needed”
   - Row:
     - [-] 2 [+] number stepper
   - Helper text:
     - “Total players: 10” (derived or static)

3. **Skill Level**
   - Label: “Skill level”
   - Single-select chips:
     - [ Casual ], [ Intermediate ], [ Competitive ]

4. **Game Type**
   - Label: “Game type”
   - Single-select chips:
     - [ Friendly ], [ Competitive ]

5. **Notes to Players (Optional)**
   - Label: “Notes to players (optional)”
   - Multiline text area:
     - Placeholder examples like “Bring turf shoes, no studs…”

#### Visibility & Cost Card

1. **Cost per Player (Optional)**
   - Label: “Cost per player (optional)”
   - Input with PKR prefix (e.g. “400”)
   - Note: “We’ll show this on the match card. Payment is handled by you at the ground for now.”

2. **Payment Note**
   - Static:
     - “Players will pay you directly at the venue for this match.”

#### Publish Button
- Full-width primary CTA:
  - “Publish match”
  - Small subtitle: “We’ll list it under Matches instantly.”

---

### Detailed Visual Spec

- **Layout**
  - LinkedBookingCard
  - GameDetailsCard
  - VisibilityCostCard
  - Primary CTA
- **UI Components**
  - `LinkedBookingCard`
  - `GameDetailsCard`
  - `VisibilityCostCard`
  - `NumberStepper`
  - `ChipGroupSingleSelect`
  - `TextArea`
  - `StepPrimaryButton`

---

### Component Mapping

- `HostMatchSetupScreen`
  - Route params: bookingId? (for pre-fill)
- `LinkedBookingCard`
- `GameDetailsCard`
- `VisibilityCostCard`
- `StepPrimaryButton`
- Generic reusables:
  - `NumberStepper`
  - `ChipGroupSingleSelect`
  - `GlassCard`
  - `TextField`
  - `TextArea`

---

### Feature Mapping

- Enables host-led gameplay:
  - Convert a confirmed booking into a public match.
- Player matching metadata:
  - Title, players needed, skill level, game type, cost, notes.
- Ties open match to a real slot:
  - Increases trust vs random group messages.

---

## Screen 10 – Match Detail + Join Flow

### Concept Snapshot
A full-screen “game lobby”: see who’s playing, where & when, how serious, and decide to join/request.

---

### Visual Walkthrough

#### Header
- Back arrow
- Title: “Match details”

#### Match Meta Header Block
- Chips:
  - Type chip: “Host-led · Slot confirmed” or “Looking for players”
  - Sport chip: e.g. “⚽ Football”
- Title:
  - Match title (“5-a-side high tempo”)
- Host line:
  - “Host: Abdullah Faisal · Verified host” (with badge if applicable)

#### Venue & Time Card
- Glass card with:
  - Date & time (“Today · 8:00–9:00 PM”)
  - Venue + area
  - Status text:
    - “Slot confirmed via Pay2Play” (green)
    - Or “Venue to be finalized” (amber)

#### Players Card
- Glass card:
  - Avatars row:
    - Host (crowned/”C”) + players + “+N”
  - Text: “8 of 10 spots filled”
  - Progress bar (fill rate)
  - Chips:
    - [ Skill: Intermediate ], [ Game: Friendly ]

#### Game Details Card
- Label: “Game details”
- Content:
  - Game type (Friendly/Competitive)
  - Payment: “PKR X each · Pay at venue” or “Pay at venue”
  - Notes from host:
    - Multi-line text

#### Booking Summary Mini Row (Host-Led Only)
- Slim row:
  - “Booking: Court A · Full pitch · Paid via Pay2Play”
  - Arrow `>` to Booking Detail (host read-only for others)

#### CTA Footer Bar (Join State)

- **State A – Not Joined & Spots Available**
  - Left:
    - “Needs 2 more players”
    - “Tonight · 8:00–9:00 PM”
  - Right:
    - [ Request to join ] or [ Join now ]

- **State B – Request Pending**
  - Left:
    - “Request sent to host”
    - “You’ll get a notification when accepted.”
  - Right:
    - [ Cancel request ] (outline)

- **State C – Joined**
  - Left:
    - “You’re in!”
    - “Arrive 10–15 mins early.”
  - Right:
    - [ Open chat ] or [ View booking ]

#### Join Confirmation Bottom Sheet
- Title: “Request to join this match?”
- Summary:
  - Sport & format
  - Date/time
  - Venue
- Position preference chips:
  - [ Any ], [ Defender ], [ Midfield ], [ Forward ], [ Keeper ]
- Note: “Your request will be sent to the host. They can accept or decline.”
- Buttons:
  - [ Send request ], [ Cancel ]

---

### Detailed Visual Spec

- **Layout**
  - Header
  - MatchMetaHeader
  - VenueTimeCard
  - PlayersCard
  - GameDetailsCard
  - BookingMiniRow (if host-led)
  - Sticky JoinFooterBar
  - JoinMatchSheet overlay
- **UI Components**
  - `MatchMetaHeader`
  - `VenueTimeCard`
  - `PlayersCard`
  - `GameDetailsCard`
  - `BookingMiniRow`
  - `JoinFooterBar`
  - `JoinMatchSheet`

---

### Component Mapping

- `MatchDetailScreen`
  - Route params: matchId
- `MatchMetaHeader`
- `VenueTimeCard`
- `PlayersCard`
- `GameDetailsCard`
- `BookingMiniRow`
- `JoinFooterBar`
- `JoinMatchSheet`

---

### Feature Mapping

- Player matching:
  - Join/request open games.
- Host-led vs LFP differentiation:
  - Clear trust cues (“Slot confirmed via Pay2Play”).
- Future chat integration:
  - Joined players can be directed to chat.
- Connects to booking logic (for host-led matches).

---

## Screen 11 – My Bookings (Upcoming & Past)

### Concept Snapshot
“Flight list” of games: clear split between upcoming and past bookings with direct access to details, hosting, chat, rebooking.

---

### Visual Walkthrough

#### Header
- Back arrow
- Title: “My bookings”
- Subtitle: “All your games in one place.”

#### Tabs: Upcoming | Past
- Segmented control:
  - [ Upcoming ] [ Past ]
  - Active tab: gradient filled, white label

#### Upcoming Booking Card
- Glass card:

Top row:
- `🗓 Today · 8:00–9:00 PM`
- Status chip: “Confirmed” (green) / “Pending” (amber)

Main:
- Venue: “Star Futsal Arena”
- Sport & format: “Football · 5-a-side · Court A”
- Area: “DHA Phase 5”

Footer:
- Icons & text:
  - 👥 “10 players”
  - 💸 “Paid: PKR 3,800” or “Pay at venue”
- CTA:
  - [ View details ]
  - Optional [ Host a match ] (if not already hosting)

#### Past Booking Card
- Similar layout but muted:
  - Status chip: “Completed”
  - Payment summary
  - CTA: [ Rebook ] (small outline button)

#### Empty States
- **No upcoming bookings**
  - “No games booked yet.”
  - “Book a pitch in under 60 seconds.”
  - [ Book a pitch ]
- **No past bookings**
  - “Once you play your first game, it will appear here.”

---

### Detailed Visual Spec

- **Layout**
  - Header
  - Tabs
  - Booking list (depends on tab)
  - Empty state when list empty
- **UI Components**
  - `SegmentedTabs`
  - `BookingList`
  - `BookingCard`
  - `EmptyState`

---

### Component Mapping

- `MyBookingsScreen`
  - State: activeTab
- `SegmentedTabs`
- `BookingList`
- `BookingCard`
- `EmptyState`

---

### Feature Mapping

- Booking engine:
  - Centralized view for upcoming & past bookings.
- Host-led gameplay:
  - Shortcut to host from existing upcoming bookings.
- Rebooking:
  - Fast path back to venue selection for recurring play.
- Future:
  - Integration with loyalty (credits per completed booking).

---

## Screen 12 – Messages Tab / Conversation List

### Concept Snapshot
WhatsApp-meets-PlayStation: simple chat list themed around matches and venues.

---

### Visual Walkthrough

#### Header
- Title: “Messages”
- Subtitle: “Chat with teammates and venues.”
- Right: [⋮] menu

#### Conversation Type Tabs
- Segmented control:
  - [ All ], [ Players ], [ Venues ]
- Active tab: gradient fill

#### Conversation Row
- Left:
  - Avatar:
    - Player/group avatar OR venue logo/stadium icon
- Center:
  - Title (bold):
    - Match thread: “5-a-side tonight at Turf Arena”
    - Group: “Sunday Padel Squad”
    - Venue: “Star Futsal Arena”
  - Snippet (grey):
    - “Ali: We’ll bring the ball.”
    - “Venue: Gate opens 15 mins early.”
- Right:
  - Timestamp: “9:24 PM”, “Yesterday”
  - Unread badge: small pill with count (if > 0)

#### Read vs Unread
- Unread:
  - Bold title & snippet
  - Accent bar on left
  - Unread count
- Read:
  - Medium weight
  - No accent bar
  - No count

#### Empty State
- Icon
- Text:
  - “No conversations yet.”
  - “Join a match or book a venue to start chatting.”
- Optional button: [ Explore matches ]

---

### Detailed Visual Spec

- **Layout**
  - Header
  - Tabs
  - Conversation list
  - Empty state
- **UI Components**
  - `MessagesScreen`
  - `TabSegmentedControl`
  - `ConversationRow`
  - `EmptyState`

---

### Component Mapping

- `MessagesScreen`
  - State: activeTab, conversations[]
- `TabSegmentedControl`
- `ConversationRow`
  - Props: type, title, subtitle, avatar, timestamp, unreadCount, onPress
- `EmptyState`

---

### Feature Mapping

- In-app messaging hub:
  - Player ↔ Player (1:1/group)
  - Player ↔ Venue
- Filterable by conversation type.
- Entry points from:
  - Match Detail
  - Booking Detail
  - Booking Success (future).

---

## Screen 13 – Chat Thread (1:1 or Group)

### Concept Snapshot
A familiar chat UI with Pay2Play’s neon flavor and pinned match/booking context.

---

### Visual Walkthrough

#### Header
- Back arrow
- Title:
  - Example: “5-a-side tonight at Turf Arena”
- Subtitle:
  - “Match chat · Today · 8:00–9:00 PM” or “Venue chat · Bookings & questions”
- Right: [⋮] menu (mute, view details, report)

#### Context Pill
- Glass pill under header:
  - Venue & area
  - For match chat: also date/time & sport
  - Right: [ View booking ] or [ View match ]

#### Messages List
- Grouped by sender
- Bubble styles:

You:
- Right-aligned
- Accent gradient bubble
- White text

Others:
- Left-aligned
- Glass dark bubble
- Light text

Venue:
- Left-aligned
- Bubble with accent border
- Small “Venue” label over bubble

- Timestamps under last bubble in each group
- Optional read indicators

#### Date Separators
- Centered pill:
  - “Today”, “Yesterday”, or calendar date

#### Typing Indicator (optional)
- “Ali is typing…” with animated dots

#### Message Input Bar
- Fixed at bottom above keyboard
- Glass bar with:
  - [ + ] (attachments, future)
  - Multi-line text input
  - Send icon [ ➤ ] (accent circle)
- Disabled send when empty

---

### Detailed Visual Spec

- **Layout**
  - Header
  - ContextPill
  - MessagesList
  - TypingIndicator (optional)
  - MessageInputBar
- **UI Components**
  - `ChatHeader`
  - `ChatContextPill`
  - `MessageList`
  - `MessageBubble`
  - `DateSeparator`
  - `MessageInputBar`
  - `TypingIndicator`

---

### Component Mapping

- `ChatScreen`
  - Route params: conversationId
- `ChatHeader`
- `ChatContextPill`
- `MessageList`
  - Props: messages[]
- `MessageInputBar`
- `TypingIndicator` (optional)

---

### Feature Mapping

- Real-time messaging for:
  - Match coordination
  - Venue communication
- Context-aware:
  - Quick access to booking/match details
- Future:
  - Attachments, location, voice, etc.

---

## Screen 14A – Profile (“Me” Tab) Overview

### Concept Snapshot
**Mock images:** `IMG_3443.jpeg`, `IMG_3445.jpeg`, `IMG_3449.jpeg`, `IMG_3453.jpeg`, `IMG_3456.jpeg`, `IMG_3457.jpeg`, `IMG_3462.jpeg`, `IMG_3466.jpeg`  
Player’s locker + dashboard: identity, quick stats, rewards, and navigation to bookings and settings.

---

### Visual Walkthrough

#### Header Identity Block
- Large circular avatar centered at top
  - Neon ring halo (orb behind)
  - Tap to “Edit profile” (future)
- Name:
  - “Abdullah Faisal”
- Location + sports:
  - “Lahore · Football, Cricket”
- Skill:
  - “Skill: Intermediate”
- Settings icon at top-right

#### Stats Row
- Three small glass cards:
  - **Games played** – e.g. 12
  - **Venues tried** – e.g. 4
  - **Credits** – e.g. 450
- Each with small icon (calendar, stadium, coin)

#### Rewards Summary Card
- Glass card “Rewards & savings”:
  - “450 credits”
  - “Worth PKR 450 on future bookings.”
  - “Total saved so far: PKR 3,200.”
  - “Biggest discount: PKR 900.”
  - Button: [ View rewards & invite friends ]
  - Helper text: explain credits and invites

#### Menu List
- Glass rows with icon, label, chevron:
  1. My bookings
  2. Rewards & referrals
  3. Payment methods
  4. Account & settings
  5. Help & support

---

### Detailed Visual Spec

- **Layout**
  - Identity block
  - Stats row
  - Rewards card
  - Menu list
- **UI Components**
  - `ProfileHeader`
  - `StatsRow`
  - `RewardsSummaryCard`
  - `ProfileMenuList`

---

### Component Mapping

- `ProfileScreen`
- `ProfileHeader`
  - Props: name, city, sports, skillLevel, avatar, onPressSettings
- `StatsRow`
- `RewardsSummaryCard`
  - Props: credits, creditsValue, totalSaved, biggestDiscount, onPressViewRewards
- `ProfileMenuList`

---

### Feature Mapping

- Identity / profile:
  - Central place for player info.
- Navigation hub:
  - Bookings, rewards, payment, account, help.
- Rewards highlight:
  - Encourages engagement and referrals.

---

## Screen 14B – Rewards & Referrals

### Concept Snapshot
Wallet-like view of credits and referral engine: how much you have, how to earn more, and how to bring friends.

---

### Visual Walkthrough

#### Header
- Back arrow
- Title: “Rewards & referrals”
- Subtitle: “Earn credits by playing and inviting friends.”

#### Balance Card
- Glass card:
  - “450 credits”
  - “Worth PKR 450”
  - “You can use up to 30% of a booking with credits.”
  - Note that credits toggle on checkout controls usage.

#### Earn Credits Section
- Two mini cards:
  - “Play more”
    - “Earn 100 credits for every completed booking.”
  - “Invite friends”
    - “Earn 250 credits when a friend plays their first game.”

#### Referral Card
- Title:
  - “Invite friends, get 250 credits each”
- Text:
  - “They get a welcome discount. You get credits once they play.”
- Referral code:
  - Big monospace e.g. “ABD123”
- Actions:
  - [ Copy code ]
  - [ Share link ] (OS share sheet)

#### Rewards Activity
- List of entries:
  - `+200 From booking at Star Futsal Arena · 25 Nov`
  - `+250 Friend Ali joined & booked · 21 Nov`
  - `-150 Used on Turf Arena booking · 18 Nov`
- Filter chips: [ All ], [ Earned ], [ Used ]

---

### Detailed Visual Spec

- **Layout**
  - Balance card
  - Earn cards
  - Referral card
  - Activity list
- **UI Components**
  - `RewardsBalanceCard`
  - `EarnCardsRow`
  - `ReferralCard`
  - `RewardsActivityList`

---

### Component Mapping

- `RewardsScreen`
- `RewardsBalanceCard`
- `EarnCardsRow`
- `ReferralCard`
- `RewardsActivityList`
  - Props: entries[], filter
- `RewardsActivityRow`

---

### Feature Mapping

- Loyalty & rewards:
  - Makes value of credits concrete (credits → PKR).
- Referrals:
  - Clear call to invite friends and track referral bonuses.
- Ties to checkout and wallet:
  - Same credit rules and values reused.

---

## Screen 15 – Leagues & Events Listing

### Concept Snapshot
**Mock images:** `IMG_3460.jpeg`  
Sports calendar + event marketplace: discover leagues and one-day events in Lahore.

---

### Visual Walkthrough

#### Header
- Back arrow
- Title: “Leagues & events”
- Subtitle: “Discover tournaments and special events.”
- Right: [ Filters ▾ ]

#### Filter Chips Row
- [ This month ], [ This weekend ], [ My sports ], [ Lahore ], [ Free/low cost ]

#### Hero Event Card
- Large highlighted event:
  - “Ramzan Night League 2025”
  - “Football · 7-a-side”
  - “10 Mar – 5 Apr”
  - “Model Town Sports Complex”
  - Badge: “Spots filling fast”
  - Small “From PKR 2,500 / team”
  - [ View details ]

#### Upcoming Leagues Section
- Header: “Upcoming leagues”
- League cards:
  - League name
  - Sport + format + teams count
  - Dates
  - Venue + area
  - Chips for time slot (e.g., [ Evenings ])
  - [ Register ] or “Few spots left” chip

#### One-Day Events Section
- Header: “One-day events & tournaments”
- Event card:
  - “Sunday Padel Shootout”
  - “Padel · Doubles · 16 teams”
  - “Sun 22 Dec · 4 PM–11 PM”
  - “Padel Club Lahore · Gulberg”
  - “PKR 1,500 / team”
  - [ Register ]

#### Empty State
- “No leagues match these filters.”
- [ Clear filters ]

---

### Detailed Visual Spec

- **Layout**
  - Header
  - Filter chips
  - Hero event
  - Upcoming leagues
  - One-day events
- **UI Components**
  - `EventsListingScreen`
  - `FilterChipsRow`
  - `HeroEventCard`
  - `EventSection`
  - `EventCard`

---

### Component Mapping

- `EventsListingScreen`
- `FilterChipsRow`
- `HeroEventCard`
- `EventSection`
- `EventCard`

---

### Feature Mapping

- Leagues & events discovery:
  - Highlights key, sponsored, or time-sensitive competitions.
- Filters:
  - By dates, sport, city, cost range.
- Entry to event detail & registration flows (Screen 16).

---

## Screen 16 – Event Detail & Registration

### Concept Snapshot
Tournament poster + registration hub: complete details about an event and simple “register interest” flow.

---

### Visual Walkthrough

#### Header
- Back arrow
- Title: event name (e.g. “Ramzan Night League 2025”)
- Subtitle: “Football · 7-a-side”
- Right: [⋮] menu + favorite heart

#### Hero Banner
- Event image or gradient with trophy/sport icon overlay
- Text overlay:
  - Date range
  - Venue & area
- Badge: “Slots open” / “Spots filling fast”

#### Key Info Chips
- [ 10 Mar – 5 Apr ], [ Fri & Sat nights ], [ Lahore · Model Town ], [ 7-a-side · 8 teams ]

#### Summary Card
- Title: “Summary”
- Lines:
  - Dates
  - Match days
  - Venue
  - Format
  - Fee
  - Prizes

#### Rules & Format Card
- Bullet style:
  - Player count limits
  - Sub rules
  - Standard rule notes
- “Read more” if long

#### Registration Card
- Text:
  - “To register your team, tap below and we’ll connect you with the organizer.”
- Buttons:
  - [ Register interest in app ]
  - [ Message organizer on WhatsApp ]

#### Footer Bar
- Left:
  - “From PKR 25,000 / team”
  - “Registration closes in 5 days”
- Right:
  - [ Register interest ]

#### Registration Interest Bottom Sheet
- Title: “Register interest”
- Prefilled Name + Phone
- Team name (optional)
- Skill level chips
- Checkbox: “I’m registering as an individual”
- [ Submit interest ]

---

### Detailed Visual Spec

- **Layout**
  - Header
  - Hero banner
  - Info chips
  - Summary card
  - Rules card
  - Registration card
  - Footer bar
  - Registration sheet
- **UI Components**
  - `EventHeader`
  - `EventHeroBanner`
  - `EventInfoChipsRow`
  - `EventSummaryCard`
  - `EventRulesCard`
  - `EventRegistrationCard`
  - `EventFooterBar`
  - `EventRegisterInterestSheet`

---

### Component Mapping

- `EventDetailScreen`
- `EventHeader`
- `EventHeroBanner`
- `EventInfoChipsRow`
- `EventSummaryCard`
- `EventRulesCard`
- `EventRegistrationCard`
- `EventFooterBar`
- `EventRegisterInterestSheet`

---

### Feature Mapping

- Leagues & events:
  - Full detail view with key info.
- Registration MVP:
  - “Register interest” via in-app form or WhatsApp.
- Future:
  - Support full in-app payments and team management.

---

## Screen 17 – Wallet (Loyalty & Savings Center)

### Concept Snapshot
**Mock images:** `IMG_3458.jpeg`  
Pay2Play’s internal wallet: credits balance, total savings, credit rules, and transaction history.

---

### Visual Walkthrough

#### Header
- Back arrow
- Title: “Wallet”
- Subtitle: “Your credits, savings, and history.”
- Info icon [ⓘ] for rules sheet

#### Balance Card
- Label: “Available balance”
- Value: “450 credits” ≈ “PKR 450”
- Chip: “Usable per booking: up to 30%”
- Bottom stats:
  - “Total saved so far: PKR 3,200”
  - “Credits expiring soon: 0 credits”

#### Status Chips
- [ Available · 450 ], [ Locked · 0 ], [ Expiring soon · 0 ]
- Tap to filter history

#### “How Your Wallet Works” Card
- Title: “How your wallet works”
- Bullet points:
  - 100 credits per completed booking
  - 250 credits per friend’s first game
  - Use up to 30% per booking
  - 1 credit ≈ PKR 1
- Link: “View referral options →” to Rewards screen

#### Activity List
- Header:
  - “Activity” + [ All ], [ Earned ], [ Used ] filters
- Rows:
  - Amount (+ or –) and “credits”
  - Description (booking/referral)
  - Subtitle (sport / booking context)
  - Date
  - Type pill (Earned, Used, Referral)

#### Empty State
- If no activity:
  - “No wallet activity yet.”
  - “Play a game or invite a friend to start earning credits.”
  - [ Browse matches ] or [ Book a pitch ]

---

### Detailed Visual Spec

- **Layout**
  - Header
  - Balance card
  - Status chips
  - Info card
  - Activity list
  - Empty state
- **UI Components**
  - `WalletBalanceCard`
  - `WalletStatusChips`
  - `WalletInfoCard`
  - `WalletActivityList`
  - `WalletActivityRow`
  - `WalletEmptyState`

---

### Component Mapping

- `WalletScreen`
- `WalletBalanceCard`
- `WalletStatusChips`
- `WalletInfoCard`
- `WalletActivityList`
- `WalletActivityRow`
- `WalletEmptyState`

---

### Feature Mapping

- Loyalty & savings:
  - Visible credits and monetary equivalence.
- Transparency:
  - Full history of how credits were earned/spent.
- Hooks:
  - Drives re-engagement via savings narrative.
  - Links to referrals and bookings.

---