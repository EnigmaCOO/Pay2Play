# Pay2Play Player App: Screen Implementation Plan

This document provides a detailed implementation plan for each screen of the Pay2Play Player App, based on the Functional Requirements Document (FRD), Product Requirements Document (PRD), and wireframes.

## Shared Components & Structure

- **UI Library:** `react-native` with custom components.
- **Styling:** A consistent styling approach will be used, likely with a theme file (`styles/theme.ts`) for colors, fonts, and spacing.
- **State Management:** A global state management solution (like Redux Toolkit or Zustand) will be necessary to manage user authentication, profile data, and booking state.
- **Navigation:** `react-navigation` will be used for handling screen transitions and the main tab navigation.
- **Shared Directory:** As per `shared/AGENTS.md`, reusable components (e.g., `PrimaryButton`, `GlassCard`, `Chip`) will be developed in the `shared/ui/` directory to be consumed by the player app and other future apps.

---

## Screen 1: Onboarding Welcome

### 1.1. Objective
To introduce the Pay2Play brand and its core value proposition, providing a clear and inviting entry point for new users to sign up or existing users to log in.

### 1.2. Functional Requirements (from PRD & FRD)
- Display the app logo and taglines: "Pay less. Play more." and "Book a pitch in under 60 seconds."
- Present three core value propositions: "Vetted venues," "Real-time slots," and "Live discounts."
- **Primary Action:** A "Get Started" button that initiates the phone-based authentication flow.
- **Secondary Action:** An "Explore first" option for a guest mode (can be deferred post-MVP).
- A link for existing users to "Log in."
- Display links to the "Terms of Service" and "Privacy Policy."

### 1.3. Component Implementation Plan
- **`OnboardingWelcomeScreen.tsx`**: The main screen container.
- **`ScreenBackground`**: A reusable component for the app's signature dark, gradient background with subtle light streak effects.
- **`AppLogoHeader`**: Displays the Pay2Play logo and taglines.
- **`HeroOrb`**: A central animated visual with orbiting icons representing the available sports (Cricket, Football, Padel).
- **`FeaturePill`**: A reusable glassmorphism-styled pill with an icon and text for the value propositions.
- **`PrimaryButton`**: A full-width, gradient button for the "Get Started" CTA.
- **`SecondaryButton`**: An outlined or text-based button for "Explore first" and "Log in."
- **`BottomMeta`**: A component for the legal text and login prompt.

### 1.4. Data Models
- No new data models are directly manipulated on this screen. It serves as the entry point to user creation/authentication.

### 1.5. Proposed File Structure
```
apps/player-app/
├── app/
│   ├── screens/
│   │   └── onboarding/
│   │       └── WelcomeScreen.tsx
│   ├── components/
│   │   └── onboarding/
│   │       ├── HeroOrb.tsx
│   │       └── FeaturePill.tsx
shared/
├── ui/
│   ├── ScreenBackground.tsx
│   ├── AppLogoHeader.tsx
│   ├── PrimaryButton.tsx
│   └── SecondaryButton.tsx
```

---

## Screen 2: Authentication Flow (Phone & OTP)

This flow consists of three tightly coupled steps: Phone Entry (2A), OTP Verification (2B), and Basic Info Setup (2C).

### 2.1. Objective
To securely and smoothly authenticate the user via their phone number and collect the most essential profile information needed to personalize their experience.

### 2.2. Functional Requirements
- **Screen 2A (Phone Entry):**
    - Input field for the user's phone number, with a default country code for Pakistan (+92).
    - A "Continue" button that triggers sending an OTP to the provided number.
- **Screen 2B (OTP Verification):**
    - 6-digit input for the OTP code.
    - Display the phone number the code was sent to.
    - A countdown timer for resending the code.
    - Options to "Resend code" and "Change number."
    - A "Verify & Continue" button, enabled only when all 6 digits are entered.
- **Screen 2C (Basic Info Setup):**
    - Avatar selection from a predefined carousel.
    - Input field for the user's full name.
    - Multi-select chips for the user's preferred sports (Cricket, Football, Padel).
    - A "Continue" button to proceed to the next step.

### 2.3. Component Implementation Plan
- **`PhoneEntryScreen.tsx`, `OtpVerificationScreen.tsx`, `BasicInfoScreen.tsx`**: Screen containers for each step.
- **`AppHeader`**: A reusable header with a back button, title, and optional step indicator (e.g., "Step 2 of 3").
- **`GlassCard`**: A reusable container with a glassmorphism effect for input sections.
- **`PhoneInput`**: A specialized input component for the phone number.
- **`OtpInputRow`**: A component managing the 6 individual OTP input boxes.
- **`CountdownText`**: Displays the resend code timer.
- **`AvatarCarousel`**: A horizontal, scrollable list of selectable avatar images.
- **`SportChip`**: A selectable chip for sports preferences.

### 2.4. Data Models
- This flow creates and populates the `User` document in the database.
- **Fields updated:** `phone`, `name`, `avatarUrl`, `preferredSports`.

### 1.5. Proposed File Structure
```
apps/player-app/
├── app/
│   ├── screens/
│   │   └── onboarding/
│   │       ├── PhoneEntryScreen.tsx
│   │       ├── OtpVerificationScreen.tsx
│   │       └── BasicInfoScreen.tsx
│   ├── components/
│   │   └── onboarding/
│   │       ├── OtpInputRow.tsx
│   │       └── AvatarCarousel.tsx
shared/
├── ui/
│   ├── AppHeader.tsx
│   ├── GlassCard.tsx
│   ├── SportChip.tsx
│   └── ...
```

---

## Screen 3: Preferences (Location & Play Style)

### 3.1. Objective
To gather the user's location and play style preferences to tailor the app's content, such as recommended venues and matches, from the very first use.

### 3.2. Functional Requirements
- Select primary city (defaulting to "Lahore" for MVP).
- Select neighborhood/area within the city via a search input with suggestions.
- Multi-select preferred play times (e.g., "Weekday evenings," "Weekend mornings").
- Multi-select desired game styles (e.g., "Casual pickup games," "Competitive matches").
- A final "Finish setup" button that navigates to the main app (Home screen).

### 3.3. Component Implementation Plan
- **`PreferencesScreen.tsx`**: The main screen container.
- **`GlassCard`**: Reused to group each preference section (City, Neighborhood, etc.).
- **`CityDropdown`**: A dropdown for city selection (built for future expansion).
- **`NeighborhoodField`**: A text input with a list of suggested area chips below it.
- **`Chip`**: Reusable selectable chip for play times and game styles.
- **`StepIndicator`**: A UI element showing "Step 3 of 3".

### 3.4. Data Models
- This screen further enriches the `User` document.
- **Fields updated:** `city`, `neighborhood`, `playTimePreferences`, `gameStylePreferences`.

### 3.5. Proposed File Structure
```
apps/player-app/
├── app/
│   ├── screens/
│   │   └── onboarding/
│   │       └── PreferencesScreen.tsx
│   ├── components/
│   │   └── onboarding/
│   │       ├── NeighborhoodField.tsx
│   │       └── StepIndicator.tsx
shared/
├── ui/
│   ├── Chip.tsx
│   └── ...
```

---

## Screen 4: Home

### 4.1. Objective
To serve as a personalized and dynamic dashboard, providing users with immediate access to the most relevant actions: booking a pitch, finding a game, and discovering top venues.

### 4.2. Functional Requirements
- Display a personalized greeting (e.g., "Hey, Abdullah 👋").
- Show the user's selected location ("Lahore").
- Provide quick filter chips like "Tonight," "This weekend," and "My sports" to dynamically adjust the content shown.
- A prominent "Book a pitch" hero action card that navigates to the venue discovery flow.
- A horizontally scrollable section for "Games needing players near you."
- A section showcasing "Top venues for you in Lahore."
- A preview section for "Leagues & events."
- A persistent bottom tab navigator for main app sections (Home, Venues, Matches, Messages, Me).

### 4.3. Component Implementation Plan
- **`HomeScreen.tsx`**: The main screen container.
- **`AppTabNavigator.tsx`**: The persistent bottom tab bar.
- **`HomeHeader`**: Component for the personalized greeting and location.
- **`FilterChipsRow`**: The horizontal list of quick filter chips.
- **`HeroActionCard`**: The main CTA card for booking a pitch.
- **`SectionHeader`**: A reusable header for content sections with a title and a "View all" link.
- **`HostMatchCard`**: A card to display a game that is looking for players.
- **`VenueCard`**: A card to display summary information for a recommended venue.
- **`EventMiniCard`**: A smaller card for the leagues and events preview.

### 4.4. Data Models
- Reads `User` data for personalization.
- Fetches and displays data from `Venues`, `Matches`, and `Events` collections, filtered by user preferences.

### 4.5. Proposed File Structure
```
apps/player-app/
├── app/
│   ├── screens/
│   │   └── main/
│   │       └── HomeScreen.tsx
│   ├── navigation/
│   │   └── AppTabNavigator.tsx
│   ├── components/
│   │   ├── home/
│   │   │   ├── HomeHeader.tsx
│   │   │   ├── HeroActionCard.tsx
│   │   │   └── SectionHeader.tsx
│   │   ├── matches/
│   │   │   └── HostMatchCard.tsx
│   │   ├── venues/
│   │   │   └── VenueCard.tsx
│   │   └── events/
│   │       └── EventMiniCard.tsx
```

---

## Screen 5: Venue Detail

### 5.1. Objective
To provide a comprehensive view of a single venue, including its photos, amenities, and real-time slot availability, enabling the user to select a time to book.

### 5.2. Functional Requirements
- Display the venue's name, location, and key attributes (e.g., "Indoor").
- A swipeable carousel of venue images.
- An info strip with rating, price range, and potential savings.
- Tabbed content for "About" (description, amenities), "Availability" (the default view), and "Location" (map).
- A date selector to choose the booking day.
- A selector for a specific pitch/court if the venue has multiple.
- A grid displaying all time slots for the selected date, with clear visual states for "Available," "Booked," and "Unavailable."
- When a slot is selected, a sticky footer bar appears showing the selected details and a "Continue" button.

### 5.3. Component Implementation Plan
- **`VenueDetailScreen.tsx`**: The main screen, which takes a `venueId` as a navigation parameter.
- **`VenueHeader`**: Custom header for this screen with back, favorite, and share buttons.
- **`VenueImageCarousel`**: Displays venue photos.
- **`VenueInfoStrip`**: The horizontal strip for rating, price, etc.
- **`SegmentedTabs`**: The "About | Availability | Location" tabs.
- **`DateChipStrip`**: The horizontal date selector.
- **`SlotGrid`**: The core component for rendering the time slots with different states.
- **`BookingFooterBar`**: The sticky footer that appears on slot selection.

### 5.4. Data Models
- Fetches detailed data for a single `Venue` document using the `venueId`.
- Fetches all `Bookings` for that venue on the selected date to determine slot availability.

### 5.5. Proposed File Structure
```
apps/player-app/
├── app/
│   ├── screens/
│   │   └── venues/
│   │       └── VenueDetailScreen.tsx
│   ├── components/
│   │   └── venues/
│   │       ├── VenueHeader.tsx
│   │       ├── VenueImageCarousel.tsx
│   │       ├── VenueInfoStrip.tsx
│   │       ├── SlotGrid.tsx
│   │       └── BookingFooterBar.tsx
shared/
├── ui/
│   ├── SegmentedTabs.tsx
│   └── DateChipStrip.tsx
```

---

## Screen 6: Booking Review & Payment

### 6.1. Objective
To provide a final, transparent summary of the booking and cost, and to facilitate a secure and seamless payment process using local payment methods.

### 6.2. Functional Requirements
- Display a clear summary of the booking: venue, sport, date, time, and pitch.
- Present a detailed price breakdown: base price, Pay2Play discount, and total payable amount.
- Allow the user to apply available loyalty credits via a toggle, updating the total in real-time.
- Provide a selection of payment methods (JazzCash, Easypaisa, Card).
- Include a "Confirm & Pay" button that shows the final amount.
- The button should trigger the payment flow and show a loading state.

### 6.3. Component Implementation Plan
- **`BookingReviewScreen.tsx`**: The main screen container.
- **`BookingSummaryCard`**: A card that neatly displays all the details of the selected slot.
- **`PriceBreakdownCard`**: A dedicated card for all financial line items, including base price, discounts, credits, and the final total. A "You save X" line is crucial.
- **`PaymentMethodSelector`**: A component to list and select from the available payment gateways.
- **`PrimaryButton`**: The main CTA, dynamically updated with the final price.

### 6.4. Data Models
- Creates a `Booking` document with a `status: 'pending'`.
- Upon successful payment, updates the `Booking` status to `'confirmed'`.
- Creates a corresponding `Payment` document.
- If credits are used, it updates the `User`'s credit balance.

### 6.5. Proposed File Structure
```
apps/player-app/
├── app/
│   ├── screens/
│   │   └── booking/
│   │       └── BookingReviewScreen.tsx
│   ├── components/
│   │   └── booking/
│   │       ├── BookingSummaryCard.tsx
│   │       ├── PriceBreakdownCard.tsx
│   │       └── PaymentMethodSelector.tsx
```
