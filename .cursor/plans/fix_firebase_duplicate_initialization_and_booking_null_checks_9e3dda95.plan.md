---
name: Fix Firebase duplicate initialization and Booking null checks
overview: Fix duplicate Firebase initialization in firebase.ts (if present) and add null/undefined checks for optional Booking properties in BookingCard.tsx and bookings.tsx
todos:
  - id: verify-firebase-duplicate
    content: Verify if duplicate Firebase initialization exists in firebase.ts (lines 33-62) and remove if present
    status: pending
  - id: fix-bookingcard-null-checks
    content: Add null/undefined checks for slotStartTime, venueName, and fieldName in BookingCard.tsx with appropriate fallbacks
    status: pending
  - id: fix-bookings-filter-null-check
    content: Add null check for slotStartTime in bookings.tsx filter function (line 63)
    status: pending
  - id: handle-orderby-optional-field
    content: Review and handle orderBy on optional slotStartTime field in bookings.tsx query
    status: pending
---

# Fix Firebase Duplicate Initialization and Booking Null Checks

## Bug 1: Firebase Duplicate Initialization

**Current State**: The `firebase.ts` file currently shows 32 lines with no duplicate initialization block. However, if a duplicate block exists (lines 33-62 as described), it needs to be removed.

**Verification**: The file should only contain one Firebase initialization block using `process.env.NODE_ENV` (not `__DEV__`).

**Fix**: If duplicate code exists, remove lines 33-62 that contain the second initialization block.

## Bug 2: Missing Null Checks for Optional Booking Properties

**Issue Confirmed**: The code accesses optional properties without null/undefined checks in multiple locations:

### Files to Fix:

1. **[apps/player-app/app/components/booking/BookingCard.tsx](apps/player-app/app/components/booking/BookingCard.tsx)**

- Line 8: `booking.slotStartTime.seconds` - no null check
- Line 14: `booking.slotStartTime.seconds` - no null check  
- Line 17: `booking.venueName` - no null check
- Line 18: `booking.fieldName` - no null check

2. **[apps/player-app/app/(tabs)/bookings.tsx](apps/player-app/app/\\\\\(tabs)/bookings.tsx)**

- Line 63: `b.slotStartTime.seconds` - no null check in filter function
- Line 39: `orderBy('slotStartTime', 'desc')` - ordering by optional field (may need handling)

### Type Definition Reference:

From `packages/types/src/firestore-schema.ts`:

- `slotStartTime?: Timestamp` (optional)
- `venueName?: string` (optional)
- `fieldName?: string` (optional)

### Implementation Strategy:

1. **BookingCard.tsx**: Add null checks and provide fallback values:

- Check `slotStartTime` before accessing `.seconds`
- Provide fallback text for `venueName` and `fieldName` (e.g., "Unknown Venue", "Unknown Field")
- Handle missing date gracefully

2. **bookings.tsx**: 

- Add null check in filter function before accessing `slotStartTime.seconds`
- Consider filtering out bookings without `slotStartTime` or handle them separately
- The `orderBy` on optional field may need to be handled differently if the field can be missing

### Safe Defaults:

- Missing `slotStartTime`: Skip date comparison or treat as invalid booking
- Missing `venueName`: Display "Unknown Venue" or empty string
- Missing `fieldName`: Display "Unknown Field" or empty string