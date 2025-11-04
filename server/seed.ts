import { db } from "./db";
import { storage } from "./storage";
import type { InsertVenue, InsertField, InsertSlot, InsertGame, InsertSeason, InsertTeam } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create test user
    const user = await storage.createUser({
      firebaseUid: "test-user-123",
      email: "test@example.com",
      displayName: "Test User",
      phoneNumber: "+92300123456",
    });
    console.log("✅ Created test user:", user.id);

    // Create venues
    const venues: InsertVenue[] = [
      {
        name: "DHA Sports Complex",
        address: "Phase 5, DHA",
        city: "Lahore",
        description: "Premium sports facility with multiple cricket and football fields",
        verified: true,
        partnerId: user.id,
      },
      {
        name: "Model Town Arena",
        address: "Model Town Link Road",
        city: "Lahore",
        description: "Modern futsal and padel courts in the heart of the city",
        verified: true,
        partnerId: user.id,
      },
      {
        name: "Cantt Cricket Stadium",
        address: "Mall Road, Cantt",
        city: "Lahore",
        description: "Professional cricket facility with excellent pitches",
        verified: true,
        partnerId: user.id,
      },
    ];

    const createdVenues = await Promise.all(
      venues.map(v => storage.createVenue(v))
    );
    console.log(`✅ Created ${createdVenues.length} venues`);

    // Create fields
    const fields: InsertField[] = [
      { venueId: createdVenues[0].id, name: "Cricket Ground A", sport: "cricket", pricePerHourPkr: 3000, capacity: 22 },
      { venueId: createdVenues[0].id, name: "Football Field 1", sport: "football", pricePerHourPkr: 2500, capacity: 22 },
      { venueId: createdVenues[1].id, name: "Futsal Court 1", sport: "futsal", pricePerHourPkr: 2000, capacity: 10 },
      { venueId: createdVenues[1].id, name: "Padel Court A", sport: "padel", pricePerHourPkr: 1800, capacity: 4 },
      { venueId: createdVenues[2].id, name: "Main Cricket Pitch", sport: "cricket", pricePerHourPkr: 3500, capacity: 22 },
    ];

    const createdFields = await Promise.all(
      fields.map(f => storage.createField(f))
    );
    console.log(`✅ Created ${createdFields.length} fields`);

    // Create slots for today and tomorrow
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const slots: InsertSlot[] = [];
    
    for (const field of createdFields) {
      // Create slots from 6 PM to 10 PM for today and tomorrow
      for (const day of [now, tomorrow]) {
        for (let hour = 18; hour <= 21; hour++) {
          const start = new Date(day);
          start.setHours(hour, 0, 0, 0);
          const end = new Date(start);
          end.setHours(hour + 1, 0, 0, 0);
          
          slots.push({
            fieldId: field.id,
            startTime: start,
            endTime: end,
            availableForBooking: true,
          });
        }
      }
    }

    await Promise.all(slots.map(s => storage.createSlot(s)));
    console.log(`✅ Created ${slots.length} time slots`);

    // Create sample games
    const games: InsertGame[] = [
      {
        hostId: user.id,
        fieldId: createdFields[1].id, // Football field
        sport: "football",
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 18, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 19, 0),
        minPlayers: 8,
        maxPlayers: 14,
        pricePerPlayerPkr: 400,
        status: "open",
      },
      {
        hostId: user.id,
        fieldId: createdFields[2].id, // Futsal court
        sport: "futsal",
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 20, 0),
        minPlayers: 6,
        maxPlayers: 10,
        pricePerPlayerPkr: 350,
        status: "open",
      },
      {
        hostId: user.id,
        fieldId: createdFields[0].id, // Cricket ground
        sport: "cricket",
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 17, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 19, 0),
        minPlayers: 12,
        maxPlayers: 22,
        pricePerPlayerPkr: 300,
        status: "open",
      },
    ];

    const createdGames = await Promise.all(
      games.map(g => storage.createGame(g))
    );
    console.log(`✅ Created ${createdGames.length} pickup games`);

    // Create a sample season
    const season = await storage.createSeason({
      name: "Lahore Premier League - Spring 2025",
      sport: "cricket",
      startDate: new Date(2025, 2, 1), // March 1, 2025
      endDate: new Date(2025, 4, 31), // May 31, 2025
      organizerId: user.id,
    });
    console.log("✅ Created season:", season.id);

    // Create teams for the season
    const teamNames = ["Lahore Lions", "Karachi Kings", "Islamabad United", "Multan Sultans"];
    const teams: InsertTeam[] = teamNames.map(name => ({
      seasonId: season.id,
      name,
      captainId: user.id,
    }));

    const createdTeams = await Promise.all(
      teams.map(t => storage.createTeam(t))
    );
    console.log(`✅ Created ${createdTeams.length} teams`);

    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed };
