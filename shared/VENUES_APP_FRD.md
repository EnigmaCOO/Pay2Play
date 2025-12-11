FRD – PAY2PLAY VENUE DASHBOARD (BY SCREEN)

Note: Headings are standardized per screen. Key sections:
- Visual Walkthrough
- Detailed Visual Spec
- Component Mapping
- Feature Mapping


========================================
Global Layout – Venue Dashboard Shell
========================================

Visual Walkthrough
------------------
- Desktop-first responsive web app.
- Fixed top header bar:
  - Left: Pay2Play logo.
  - Center: current venue selector.
  - Right: logged-in user menu.
- Left sidebar navigation:
  - Dashboard, Venue Profile, Slots, Bookings, Promotions, Analytics, Invoicing, Leagues.
- Main content area:
  - Screen-specific content with cards, tables, and charts.

Detailed Visual Spec
--------------------
- TopBar:
  - Height approx 64 px, light or dark neutral background.
  - Contains logo, venue switcher (if multi-venue), and user avatar/menu.
- SidebarNav:
  - Width approx 240 px.
  - Icons + labels for primary sections.
  - Active item highlighted with accent bar and background.
- ContentArea:
  - Scrollable, with padding and max-width for readability.
  - Uses cards and tables as primary content containers.

Component Mapping
-----------------
- LayoutShell:
  - TopBar
  - SidebarNav
  - ContentArea
- Navigation:
  - NavItem (label, icon, route)
- Utilities:
  - Breadcrumb / SectionTitle
  - DateRangePicker (reused)

Feature Mapping
---------------
- Provides consistent container for all venue-side features:
  - Operational control (slots, bookings).
  - Commercial tools (promotions, invoicing).
  - Intelligence (analytics, AI insights).
- Supports multi-role usage:
  - Owner vs Manager view (future role-aware visibility).


========================================
Screen V1 – Dashboard Home / Overview
========================================

Visual Walkthrough
------------------
- Header:
  - TopBar with selected venue and user.
  - Section header "Dashboard".
  - Subheader: greeting line, e.g. "Welcome back, Abdullah".
  - Date selector pill: "Today: 25 Nov" with dropdown.
- KPI Row:
  - Four KPI cards in a grid:
    - Today’s occupancy.
    - Today’s revenue.
    - Bookings today.
    - Repeat players percent.
- Today’s Bookings Table:
  - Compact table of today’s slots and bookings.
  - Columns: Time, Pitch, Sport, Player, Status, Paid?.
  - Link under table: "View full booking list".
- Insights Snapshot:
  - Small panel with 1–2 AI insights for quick actions.
  - Short explanation text plus link "View all insights".

Detailed Visual Spec
--------------------
- KPI Cards:
  - Compact cards with metric label, primary value, and small trend indicator.
  - Color-coded icons for occupancy, revenue, bookings, repeats.
- TodayBookingsTable:
  - Sorting by time, default filter = today.
  - Status represented by color chips (Confirmed, Open, etc.).
- InsightsTeaser:
  - Card with:
    - Insight title.
    - One or two lines describing issue/opportunity.
    - Button linking to full Insights screen.

Component Mapping
-----------------
- DashboardScreen:
  - Props: venueId, selectedDate.
- KpiCard:
  - Props: title, value, trend, metricId.
- TodayBookingsTable:
  - Props: bookings[], onRowClick.
- InsightsTeaser:
  - Props: insights[], onViewAll.

Feature Mapping
---------------
- Provides at-a-glance operational health for the day.
- Allows manager to see who is coming and when.
- Surfaces AI suggestions that can lead to promotions or pricing changes.
- Quick link into detailed bookings and insights modules.


========================================
Screen V2 – Venue Profile
========================================

Visual Walkthrough
------------------
- Top bar inside content:
  - Title: "Venue Profile".
  - Actions: "Save changes" primary button, "Preview in app" secondary.
- Tab row:
  - Profile | Photos | Pricing.
- Profile tab:
  - Section: Basic info
    - Venue name.
    - Address with city, area, map link.
    - Contact phone and email.
    - Sports offered checkboxes.
    - Venue type radio buttons (Indoor / Outdoor / Mixed).
  - Section: Amenities
    - Checkbox list for lights, parking, washrooms, etc.
  - Section: Description
    - Multi-line text area.
- Photos tab:
  - Upload cover photo control.
  - Upload gallery images (min 3 recommended).
  - Thumbnail grid with edit/delete actions.
- Pricing tab:
  - Pricing rules table:
    - Columns: Pitch, Sport, Time range, Rate (PKR/hr).
    - "Add pricing rule" row/action.

Detailed Visual Spec
--------------------
- ProfileTabs:
  - Clear active tab styling.
  - Validation warning if leaving tab with unsaved required fields.
- VenueBasicInfoForm:
  - Required fields: name, city/area, at least one sport, contact phone.
  - City selection restricted to supported cities for MVP.
- AmenitiesChecklist:
  - Simple pill or checkbox list.
- PhotoUploader:
  - Drag-and-drop and "Browse" buttons.
  - File size and type validation.
- PricingRulesTable:
  - Editable rows.
  - Time range inputs with picker.
  - Support for multiple rules per pitch/sport.

Component Mapping
-----------------
- VenueProfileScreen:
  - State: activeTab, unsavedChanges.
- VenueBasicInfoForm
- AmenitiesChecklist
- PhotoUploader (CoverUploader, GalleryUploader)
- PricingRulesTable

Feature Mapping
---------------
- Implements "Venue Profile" feature from PRD:
  - Controls listing data shown in Player App.
- Pricing defines base hourly rates and basic time-based pricing.
- Profile completeness gating:
  - Venue cannot be set to Live status without required data and photos.
- Supports multi-sport and per-pitch pricing configuration.


========================================
Screen V3 – Slot Management (Calendar)
========================================

Visual Walkthrough
------------------
- Header row:
  - Title: "Slots".
  - View mode selector: Day / Week.
  - Date picker: specific day or week start.
- Filter row:
  - Pitch filter dropdown: All pitches or specific pitch.
  - "Apply weekly template" action.
- Calendar grid:
  - Columns: Pitches (e.g., Pitch A, Pitch B).
  - Rows: Time slots (e.g., per hour).
  - Cells:
    - Color-coded status: Available, Booked, Blocked.
    - Text label inside cell.
- Legend:
  - Small row showing color mapping for Available, Booked, Blocked.
- Slot actions:
  - On cell click, a popover shows details and actions:
    - Time, pitch, status, booking reference.
    - Actions based on state: Block, Unblock, View booking.

Detailed Visual Spec
--------------------
- ScheduleHeader:
  - Controls view mode and date navigation.
- SlotsGrid:
  - Scrollable both horizontally (pitches) and vertically (time).
  - Hover tooltip with details.
- SlotCell:
  - Colors aligned with PRD:
    - Green: Free.
    - Blue: Booked.
    - Grey: Blocked.
  - "Booked" cells cannot be edited except via Booking flows.
- SlotActionPopover:
  - Buttons:
    - View booking (for booked).
    - Block slot (for available).
    - Unblock slot (for blocked).
  - Confirmation dialogs for blocking/unblocking.

Component Mapping
-----------------
- SlotsScreen:
  - Props: venueId.
- ScheduleHeader:
  - Props: currentView, currentDate, onViewChange, onDateChange.
- PitchFilter:
  - Props: pitches[], selectedPitchId.
- SlotsGrid:
  - Props: slotsByPitchAndTime, onCellClick.
- SlotActionPopover
- Legend

Feature Mapping
---------------
- Implements "Slot Management" feature:
  - Default weekly template and real-time availability control.
- Directly feeds Player App availability APIs.
- Prevents double-booking by making booked slots non-editable.
- Supports operational changes:
  - Maintenance blocks, holiday hours, etc.


========================================
Screen V4 – Booking List
========================================

Visual Walkthrough
------------------
- Header:
  - Title: "Bookings".
- Filters bar:
  - Date selector (default: today).
  - Sport dropdown.
  - Pitch dropdown.
  - Booking status dropdown (Confirmed, Pending, Cancelled, No-show).
- Bookings table:
  - Columns: Time, Pitch, Sport, Player, Status, Paid, More.
  - Status and Paid columns show chip or badge.
  - "More" column uses an icon or is click-target for detail.
- Export button:
  - "Export CSV" at top or bottom of table.
- Booking detail panel:
  - Opens on row click or "More".
  - Shows:
    - Player name and masked phone.
    - Time, pitch, sport, price, payment status, booking status.
    - Number of players, any notes.
  - Actions:
    - Mark as checked-in.
    - Mark as no-show.
    - View related match (if host-led).

Detailed Visual Spec
--------------------
- FilterBar:
  - Responsive layout – wraps on smaller screens.
  - Default date = today; controls also support quick jump.
- BookingsTable:
  - Sortable columns (Time, Pitch).
  - Visual emphasis on upcoming bookings (time-based).
- BookingDetailPanel:
  - Right-hand drawer or modal for quick review and actions.
  - Confirmation dialogues for status changes.

Component Mapping
-----------------
- BookingsScreen
- FilterBar
- BookingsTable
- BookingDetailPanel
- ExportButton

Feature Mapping
---------------
- Implements "Booking List" feature:
  - Clear operational view of all bookings for a given date.
- Supports on-ground operations:
  - Check-in, no-show marking, linking to match.
- Optional CSV export to support external reporting or backups.


========================================
Screen V5 – Promotions Management
========================================

Visual Walkthrough
------------------
- Promotions list view:
  - Header: "Promotions", primary action "Create promotion".
  - Tab bar: Active, Scheduled, Past.
  - Table columns:
    - Name, Type, Dates, Status, Spend/Budget.
  - Row click opens Promotion detail.
- Create promotion wizard:
  - Step 1 – Type:
    - Choose between:
      - Featured listing.
      - Time-based discount.
      - New venue boost.
  - Step 2 – Schedule and scope:
    - Name, date range.
    - Days of week checkboxes.
    - Time window (start/end).
    - Affected pitches selector.
    - Discount percent for time-based type.
  - Step 3 – Pricing and confirm:
    - Package or custom budget.
    - Summary description.
    - "Confirm and activate" button.

Detailed Visual Spec
--------------------
- PromotionsTable:
  - Clear status indicators (Running, Scheduled, Ended).
- CreatePromotionWizard:
  - Progress indicator (Step 1/3 etc).
  - Validation per step.
  - Contextual help text explaining what each type does.
- PromotionDetailPanel:
  - Shows details:
    - Type, scope (slots/time windows), budget/spend.
    - Basic performance metrics (future).

Component Mapping
-----------------
- PromotionsScreen
- PromotionsTable
- PromotionDetailPanel
- CreatePromotionWizard
  - StepTypeSelect
  - StepScheduleScope
  - StepPricingConfirm

Feature Mapping
---------------
- Implements "Promotions Management":
  - Venues can purchase visibility and configure discounts.
- Connects to Player App:
  - Featured and discounted slots appear to players.
- Links to billing and invoicing:
  - Spend flows into settlement reports and invoices.
- Supports future AI shortcuts:
  - Insights can pre-fill promotion wizard with suggested parameters.


========================================
Screen V6 – Analytics Overview
========================================

Visual Walkthrough
------------------
- Header:
  - Title: "Analytics".
  - Date range selector (Last 7 days, Last 30 days, Custom).
- KPI row:
  - Occupancy this period.
  - Revenue via Pay2Play.
  - Total bookings count.
  - Repeat players percentage.
- Occupancy section:
  - Line chart: date vs occupancy percentage.
- Revenue by sport:
  - Bar chart per sport (Football, Cricket, Padel).
- Repeat players section:
  - Donut chart: new vs returning.
  - List of top repeat players (name and visits count).
- Export:
  - Button "Export summary CSV".

Detailed Visual Spec
--------------------
- MetricCard:
  - Title, main value, optional delta vs previous period.
- Charts:
  - Minimalist, high contrast lines/bars.
  - Tooltips on hover with detailed data.
- TopRepeatPlayersList:
  - Show only necessary data (name, visit count) without sensitive info.

Component Mapping
-----------------
- AnalyticsScreen
- DateRangePicker
- MetricCard
- LineChart (OccupancyTrend)
- BarChart (RevenueBySport)
- DonutChart (NewVsReturning)
- TopRepeatPlayersList
- ExportSummaryButton

Feature Mapping
---------------
- Implements "Analytics Overview":
  - Occupancy, revenue, repeat users per PRD.
- Helps owners:
  - Understand performance over chosen period.
- Feeds AI insights:
  - Same underlying metrics power Insights screen.
- Supports optional exports for manual reports or presentations.


========================================
Screen V7 – Invoicing and Settlements
========================================

Visual Walkthrough
------------------
- Header:
  - Title: "Invoicing and settlements".
- Controls:
  - Settlement frequency selector: Weekly / Monthly.
- Settlements table:
  - Columns:
    - Period (e.g., "Nov 2025 – Week 3").
    - Gross bookings value.
    - Fees (Pay2Play fee).
    - Net payout amount.
    - Status (Paid / Pending).
    - Files (PDF, CSV).
- Row click:
  - Opens invoice preview modal or downloads PDF.
  - Shows booking summary and totals.

Detailed Visual Spec
--------------------
- SettlementsTable:
  - Sorted by most recent period first.
  - Status chips with colors for Paid vs Pending.
- InvoicePreviewModal:
  - Simple invoice layout:
    - Header with venue and period.
    - Totals section.
    - Optional line items summary.
- DownloadButtons:
  - PDF and CSV icons or labelled buttons.

Component Mapping
-----------------
- InvoicingScreen
- SettlementsTable
- InvoicePreviewModal
- DownloadButtons

Feature Mapping
---------------
- Implements "Automated Invoicing":
  - Transparent view of settlements, fees, and payouts.
- Supports downloading:
  - Invoice PDF and detailed CSV report per period.
- Builds trust:
  - Clear reconciliation of bookings and net payouts.


========================================
Screen V8 – AI Insights Panel
========================================

Visual Walkthrough
------------------
- Header:
  - Section path: "Analytics > Insights".
  - Date range selector shared with Analytics.
- Insights list:
  - Vertical stack of insight cards.
- Each insight card:
  - Title summarizing the insight.
  - Body text explaining pattern (under-used slots, over-demanded times, loyalty patterns).
  - Suggested action:
    - E.g. "Consider a 15–20% discount."
  - CTA button:
    - "Apply suggested promotion".
    - "Open pricing rules".
    - "Create Thursday promo".

Detailed Visual Spec
--------------------
- InsightCard:
  - Title, description, highlight of key numbers (e.g., 20% occupancy).
  - Clear CTA area.
- InsightsList:
  - Scrollable, with most impactful insights at top.

Component Mapping
-----------------
- InsightsScreen
- InsightsList
- InsightCard

Feature Mapping
---------------
- Implements "Advanced Analytics and AI Insights (MVP slice)":
  - Provides simple, actionable recommendations.
- Integrations:
  - CTA buttons deep-link into Promotions or Pricing configuration with pre-filled values.
- Keeps model complexity out of UI:
  - Insights presented as read-only hints; edits still done by venue.


========================================
Screen V9 – Corporate Leagues Tools
========================================

Visual Walkthrough
------------------
- Leagues list:
  - Header: "Leagues" with primary action "Create league".
  - Tabs: Active, Upcoming, Completed.
  - Table columns:
    - Name, Type (Corporate / School / Open), Sport, Status, Dates.
  - Row click opens League detail.
- League detail:
  - Summary panel:
    - League name, type, sport, format (e.g., 7-a-side), date range, venue.
  - Tabs:
    - Teams
    - Fixtures
    - Results (optional MVP)
  - Teams tab:
    - List of teams with name, company, contact.
    - "Add team" action.
  - Fixtures tab:
    - Table of fixtures:
      - Date, Time, Pitch, Team A, Team B, Score.
    - "Add fixture" button.
  - Results tab:
    - Simple list of completed fixtures and scores.

Detailed Visual Spec
--------------------
- LeaguesTable:
  - Simple sortable table with status and date range.
- LeagueDetailHeader:
  - Clearly shows core league metadata and a "View in app" link.
- LeagueTabs:
  - Horizontal tabs switching between Teams/Fixtures/Results.
- TeamList:
  - Minimal columns to avoid clutter.
- FixturesTable:
  - Inline editing or modal for adding fixtures and scores.

Component Mapping
-----------------
- LeaguesScreen
- LeaguesTable
- LeagueDetailScreen
- LeagueDetailHeader
- LeagueTabs
- TeamList
- FixturesTable
- ResultsList (optional)

Feature Mapping
---------------
- Implements "Corporate League Tools (MVP slice)":
  - Structured information for leagues, teams, and fixtures.
- Connects to Player App:
  - Leagues and fixtures can surface in Leagues and Events section.
- Keeps scope light:
  - No complex bracket generation or advanced standings in MVP.