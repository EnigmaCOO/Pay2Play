========================================
WIREFRAMES – PAY2PLAY VENUE DASHBOARD
========================================

----------------------------------------
Global Layout – App Shell
----------------------------------------
+--------------------------------------------------------------------------------+
| Pay2Play logo      [ Current Venue ▾ ]        [ User avatar ▾ ]                |
| (top nav bar)                                                                   |
+-----------+--------------------------------------------------------------------+
|           |                                                                    |
| NAV       | MAIN CONTENT AREA                                                 |
|           |                                                                    |
| > Dashboard                                                                   |
| > Venue Profile                                                               |
| > Slots                                                                       |
| > Bookings                                                                    |
| > Promotions                                                                  |
| > Analytics                                                                   |
| > Invoicing                                                                   |
| > Leagues                                                                     |
|           |                                                                    |
+-----------+--------------------------------------------------------------------+


========================================
Screen V1 – Dashboard Home / Overview
========================================
Purpose: Quick health snapshot – today’s bookings and key stats.

+--------------------------------------------------------------------------------+
| <Pay2Play> [ Star Futsal Arena ▾ ] [ User Abdullah ▾ ]                         |
+-----------+--------------------------------------------------------------------+
| NAV       | Dashboard                                                          |
|           | "Welcome back, Abdullah"      [ Today: 25 Nov ▾ ]                  |
|           |--------------------------------------------------------------------|
|           | [ KPI Card: Today’s occupancy ]  [ KPI Card: Today’s revenue ]     |
|           | [ KPI Card: Bookings today ]    [ KPI Card: Repeat players % ]     |
|           |--------------------------------------------------------------------|
|           | Today’s bookings                                                   |
|           | +--------------------------------------------------------------+   |
|           | | Time  | Pitch | Sport   | Player          | Status | Paid? | |   |
|           | | 7–8PM | A     | Football| Ali R.          | Conf.  | Yes   | |   |
|           | | 8–9PM | A     | Football| Host-led match  | Conf.  | Yes   | |   |
|           | | 9–10PM| B     | Football| (open slot)     | Open   |  —    | |   |
|           | +--------------------------------------------------------------+   |
|           | [ View full booking list ]                                         |
|           |--------------------------------------------------------------------|
|           | [ Insights snapshot panel ]                                        |
|           | "Tue 11 PM slots are 20% full. Try a 15–20% discount."             |
|           | [ View all insights → ]                                            |
+-----------+--------------------------------------------------------------------+


========================================
Screen V2 – Venue Profile
========================================
Purpose: Manage listing content, photos, and pricing.

+--------------------------------------------------------------------------------+
| Venue Profile         [ Save changes ]   [ Preview in app ]                    |
+-----------+--------------------------------------------------------------------+
| NAV       | [ Tabs: Profile | Photos | Pricing ]                               |
|           |--------------------------------------------------------------------|
|           | SECTION: Basic info                                                |
|           | Venue name:      [ Star Futsal Arena ]                             |
|           | Address:         [ DHA Phase 5, Lahore ]   [ Map ]                 |
|           | Contact phone:   [ 03xx-xxxxxxx ]                                  |
|           | Contact email:   [ info@starfutsal.pk ]                            |
|           | Sports offered:  [x] Football   [ ] Cricket   [ ] Padel            |
|           | Venue type:      (o) Indoor   ( ) Outdoor   ( ) Mixed              |
|           |--------------------------------------------------------------------|
|           | SECTION: Amenities                                                 |
|           | [x] Lights  [x] Parking  [x] Washrooms  [ ] Cafeteria  [ ] Showers |
|           |--------------------------------------------------------------------|
|           | SECTION: Description                                               |
|           | [ Multi-line text:                                                ]|
|           | [ "High-quality turf pitch in DHA with floodlights..."            ]|
|           |--------------------------------------------------------------------|
|           | (Photos tab)                                                       |
|           | [ Upload cover photo ]  [ Upload gallery images (min 3) ]          |
|           | [ Thumbnail grid of existing photos with edit/delete ]             |
|           |--------------------------------------------------------------------|
|           | (Pricing tab)                                                      |
|           | Table: Pitch | Sport   | Time range          | Rate (PKR/hr)       |
|           |        A     | Football| Weekdays 3–6 PM     | [ 3,000 ]           |
|           |        A     | Football| Evenings & weekends | [ 5,000 ]           |
|           | [ Add pricing rule ]                                               |
+-----------+--------------------------------------------------------------------+


========================================
Screen V3 – Slot Management (Calendar)
========================================
Purpose: Define and update availability per pitch.

+--------------------------------------------------------------------------------+
| Slots        [ Day ▾ | Week ▾ ]     [ Date: Tue 26 Nov ▾ ]                     |
+-----------+--------------------------------------------------------------------+
| NAV       | Pitch filter: [ All pitches ▾ ]   [ Apply weekly template ▾ ]      |
|           |--------------------------------------------------------------------|
|           | (Week view – columns = pitches, rows = time)                        |
|           |                                                                    |
|           |          Pitch A                 Pitch B                            |
|           | 3 PM  [ AVAILABLE ]          [ AVAILABLE ]                          |
|           | 4 PM  [ BOOKED (ID#1234) ]   [ AVAILABLE ]                          |
|           | 5 PM  [ BLOCKED ]            [ BOOKED (ID#5678) ]                  |
|           | 6 PM  [ AVAILABLE ]          [ AVAILABLE ]                          |
|           |                                                                    |
|           | Color legend:                                                      |
|           |   Green = Available   Blue = Booked   Grey = Blocked               |
|           |--------------------------------------------------------------------|
|           | Slot actions (popover on click):                                   |
|           | Time: 4–5 PM                                                       |
|           | Pitch: A                                                           |
|           | Status: Booked by Ali (ID #1234)                                   |
|           | [ View booking ]  [ Block slot ] (if available)                    |
|           | [ Unblock ] (if blocked)                                           |
+-----------+--------------------------------------------------------------------+


========================================
Screen V4 – Booking List
========================================
Purpose: Operational list of bookings for any day.

+--------------------------------------------------------------------------------+
| Bookings   Date: [ Today ▾ ]   Sport: [ All ▾ ]                                |
+-----------+--------------------------------------------------------------------+
| NAV       | Pitch: [ All ▾ ]   Status: [ All ▾ ]                               |
|           |--------------------------------------------------------------------|
|           | [ Bookings table ]                                                 |
|           | +----------------------------------------------------------------+ |
|           | | Time | Pitch | Sport   | Player      | Status | Paid | More |   |
|           | | 7–8PM| A     | Football| Ali R.      | Conf.  | Yes  | (...)|   |
|           | | 8–9PM| A     | Football| Host match  | Conf.  | Yes  | (...)|   |
|           | | 9–10| B      | Football| (open)      | Open   |  —   | (...)|   |
|           | +----------------------------------------------------------------+ |
|           | [ Export CSV ]                                                     |
|           |--------------------------------------------------------------------|
|           | On row click or "More" → side panel:                               |
|           | Booking detail                                                     |
|           | ----------------                                                   |
|           | Player: Ali R. (03xx-xx..)                                         |
|           | Time: Today 7–8 PM                                                 |
|           | Pitch: A                                                           |
|           | Sport: Football, 5-a-side                                          |
|           | Price: PKR 5,000 (Paid online)                                     |
|           | Status: Confirmed                                                  |
|           | [ Mark as checked-in ] [ Mark no-show ] [ View related match ]     |
+-----------+--------------------------------------------------------------------+


========================================
Screen V5 – Promotions Management
========================================

5A – Promotions List
--------------------
+--------------------------------------------------------------------------------+
| Promotions        [ Create promotion ]                                         |
+-----------+--------------------------------------------------------------------+
| NAV       | Tabs: [ Active ] [ Scheduled ] [ Past ]                            |
|           |--------------------------------------------------------------------|
|           | [ Promotions table ]                                               |
|           | Name              Type      Dates        Status     Spend          |
|           | ----------------------------------------------------------------- |
|           | Off-peak 20% OFF  Discount  1–31 Dec    Running    PKR X          |
|           | New venue boost   Featured  10–30 Nov   Ended      PKR Y          |
|           | Friday night feat Featured  Every Fri   Scheduled  PKR Z          |
|           |--------------------------------------------------------------------|
|           | Click row → Promotion detail card / side panel                     |
+-----------+--------------------------------------------------------------------+

5B – Create Promotion (Wizard)
------------------------------
+--------------------------------------------------------------------------------+
| Create promotion    [ Step 1 of 3 – Type ]                                     |
+-----------+--------------------------------------------------------------------+
| NAV       | Step 1: Choose type                                                |
|           |   (o) Featured listing                                             |
|           |   ( ) Time-based discount                                          |
|           |   ( ) New venue boost                                              |
|           |   [ Next → ]                                                       |
|           |--------------------------------------------------------------------|
|           | Step 2: Schedule and scope                                         |
|           | Name: [ Off-peak 20% Weekday Promo ]                               |
|           | Dates: [ 1 Dec ] to [ 31 Dec ]                                     |
|           | Days: [x Mon] [x Tue] [x Wed] [x Thu] [ ] Fri [ ] Sat [ ] Sun      |
|           | Time window: [ 3 PM ] to [ 6 PM ]                                  |
|           | Affected pitches: [ All pitches ▾ ]                                |
|           | Discount: [ 20 ] % (if time-based type)                            |
|           | [ Next → ]                                                         |
|           |--------------------------------------------------------------------|
|           | Step 3: Pricing and confirm                                        |
|           | Package: (o) PKR 10,000 / month                                    |
|           |          ( ) Custom budget [ PKR ____ ]                            |
|           | Summary: "20% off Mon–Thu, 3–6 PM, all pitches, 1–31 Dec."         |
|           | [ Confirm and activate ]                                           |
+-----------+--------------------------------------------------------------------+


========================================
Screen V6 – Analytics Overview
========================================
Purpose: High-level occupancy, revenue, and repeat metrics.

+--------------------------------------------------------------------------------+
| Analytics     Range: [ Last 30 days ▾ ]                                        |
+-----------+--------------------------------------------------------------------+
| NAV       | [ KPI cards row ]                                                  |
|           |   [ Occupancy this month: 68% ]  [ Revenue: PKR 450,000 ]          |
|           |   [ Bookings: 120 ]             [ Repeat players: 42% ]            |
|           |--------------------------------------------------------------------|
|           | SECTION: Occupancy over time                                       |
|           |   [ Line chart: Date vs % occupancy ]                              |
|           |--------------------------------------------------------------------|
|           | SECTION: Revenue by sport                                          |
|           |   [ Bar chart: Football, Cricket, Padel ]                          |
|           |--------------------------------------------------------------------|
|           | SECTION: Repeat players                                            |
|           |   [ Donut chart: New vs Returning ]                                |
|           |   [ List: Top repeat players (name, visits) ]                      |
|           |--------------------------------------------------------------------|
|           | [ Export summary CSV ]                                             |
+-----------+--------------------------------------------------------------------+


========================================
Screen V7 – Invoicing and Settlements
========================================
Purpose: View payouts, fees, and download invoices.

+--------------------------------------------------------------------------------+
| Invoicing and settlements                                                      |
+-----------+--------------------------------------------------------------------+
| NAV       | Settlement frequency: [ Monthly ▾ ]                                |
|           |--------------------------------------------------------------------|
|           | [ Settlements table ]                                              |
|           | Period              Gross   Fees   Net payout  Status   Files      |
|           | ----------------------------------------------------------------- |
|           | Nov 2025 (Week 3)   300,000 30,000 270,000     Paid     [PDF][CSV] |
|           | Nov 2025 (Week 4)   250,000 25,000 225,000     Pending  [PDF][CSV] |
|           |--------------------------------------------------------------------|
|           | Row click or PDF → invoice modal / download                        |
|           | [ Invoice preview: header, line items summary, totals ]            |
+-----------+--------------------------------------------------------------------+


========================================
Screen V8 – AI Insights Panel
========================================
Purpose: Show simple, actionable insights and shortcuts.

+--------------------------------------------------------------------------------+
| Analytics > Insights      Range: [ Last 30 days ▾ ]                            |
+-----------+--------------------------------------------------------------------+
| NAV       | [ Insight card #1 ]                                                |
|           | Title: "Underused late-night slots"                                |
|           | Text:                                                               |
|           |   "Tue and Wed 11 PM slots on Pitch B are only 20% occupied."      |
|           |   "Consider a 15–20% discount and a featured promotion."           |
|           | [ Apply suggested promotion → ]                                    |
|           |--------------------------------------------------------------------|
|           | [ Insight card #2 ]                                                |
|           | Title: "Consistently sold-out Friday nights"                       |
|           | Text:                                                               |
|           |   "Fri 8–10 PM is sold out 4 weeks in a row. You may be            |
|           |    underpricing this slot."                                        |
|           | [ Open pricing rules ]                                             |
|           |--------------------------------------------------------------------|
|           | [ Insight card #3 ]                                                |
|           | Title: "Loyal players pattern"                                     |
|           | Text:                                                               |
|           |   "Most repeat players come on Thursdays. Consider a loyalty promo."|
|           | [ Create Thursday promo → ]                                        |
+-----------+--------------------------------------------------------------------+


========================================
Screen V9 – Corporate Leagues Tools
========================================

9A – Leagues List
-----------------
+--------------------------------------------------------------------------------+
| Leagues      [ Create league ]                                                 |
+-----------+--------------------------------------------------------------------+
| NAV       | Tabs: [ Active ] [ Upcoming ] [ Completed ]                        |
|           |--------------------------------------------------------------------|
|           | [ Leagues table ]                                                  |
|           | Name                      Type      Sport   Status     Dates       |
|           | ----------------------------------------------------------------- |
|           | "ABC Bank Corporate"      Corporate Football Ongoing 10 Mar–5 Apr |
|           | "School Cup 2025"         School    Football Upcoming15 Apr–1 May |
|           |--------------------------------------------------------------------|
|           | Row click → League detail                                         |
+-----------+--------------------------------------------------------------------+

9B – League Detail
------------------
+--------------------------------------------------------------------------------+
| ABC Bank Corporate League    [ Edit ]   [ View in app ]                        |
+-----------+--------------------------------------------------------------------+
| NAV       | Summary                                                           |
|           | Name: ABC Bank Corporate League                                   |
|           | Type: Corporate    Sport: Football    Format: 7-a-side            |
|           | Dates: 10 Mar – 5 Apr 2025                                        |
|           | Venue: Star Futsal Arena                                          |
|           |--------------------------------------------------------------------|
|           | Tabs: [ Teams ] [ Fixtures ] [ Results ]                          |
|           |--------------------------------------------------------------------|
|           | (Teams tab)                                                       |
|           | List: Team name, Company, Contact                                 |
|           | [ Add team ]                                                      |
|           |--------------------------------------------------------------------|
|           | (Fixtures tab)                                                    |
|           | Table:                                                            |
|           | Date   Time  Pitch  Team A   Team B   Score                       |
|           | 12 Mar 8 PM  A      ABC 1    ABC 2    3–1                         |
|           | [ Add fixture ]                                                   |
|           |--------------------------------------------------------------------|
|           | (Results tab – optional MVP)                                      |
|           | Simple list of completed matches and scores                       |
+-----------+--------------------------------------------------------------------+