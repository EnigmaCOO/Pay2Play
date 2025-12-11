
import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { z } from "zod";

type VenueDoc = { ownerId?: string };
type PromotionDoc = {
  id: string;
  venueId: string;
  title: string;
  description: string;
  discountPercentage: number;
  validFrom: admin.firestore.Timestamp;
  validUntil: admin.firestore.Timestamp;
  isActive: boolean;
  createdAt: admin.firestore.Timestamp;
};

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const firestore = admin.firestore();

// Input validation schema for creating a promotion
const createPromotionSchema = z.object({
  venueId: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  discountPercentage: z.number().min(1).max(100),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
});

/**
 * Creates a new promotion for a venue.
 */
export const createPromotion = functions.https.onRequest(async (request, response) => {
  try {
    // 1. Authenticate the user
    const idToken = request.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      response.status(401).send({ error: "Unauthorized" });
      return;
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const requestingUid = decodedToken.uid;

    // 2. Validate the request body
    const validation = createPromotionSchema.safeParse(request.body);
    if (!validation.success) {
      response.status(400).send({ error: "Invalid request body", details: validation.error.errors });
      return;
    }
    const { venueId, title, description, discountPercentage, validFrom, validUntil } = validation.data;

    // 3. Authorize the user (is the user the owner of the venue?)
    const venueRef = firestore.collection("venues").doc(venueId);
    const venueDoc = await venueRef.get();
    if (!venueDoc.exists) {
      response.status(404).send({ error: "Venue not found" });
      return;
    }
    const venue = venueDoc.data() as VenueDoc;
    if (venue.ownerId !== requestingUid) {
      response.status(403).send({ error: "Forbidden: You are not the owner of this venue." });
      return;
    }

    // 4. Create the new promotion
    const promotionRef = firestore.collection("promotions").doc();
    const newPromotion: PromotionDoc = {
      id: promotionRef.id,
      venueId,
      title,
      description,
      discountPercentage,
      validFrom: admin.firestore.Timestamp.fromDate(new Date(validFrom)),
      validUntil: admin.firestore.Timestamp.fromDate(new Date(validUntil)),
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
    };
    await promotionRef.set(newPromotion);

    response.status(201).send({ success: true, promotion: newPromotion });

  } catch (error) {
    console.error("Error creating promotion:", error);
    if (error instanceof Error) {
        response.status(500).send({ error: error.message });
    } else {
        response.status(500).send({ error: "An unknown error occurred." });
    }
  }
});

/**
 * Retrieves all promotions for a given venue.
 */
export const getPromotions = functions.https.onRequest(async (request, response) => {
  try {
    const venueId = request.query.venueId as string;
    if (!venueId) {
      response.status(400).send({ error: "Missing venueId query parameter." });
      return;
    }

    const promotionsQuery = firestore.collection("promotions").where("venueId", "==", venueId);
    const snapshot = await promotionsQuery.get();
    const promotions = snapshot.docs.map(doc => doc.data() as PromotionDoc);

    response.status(200).send({ success: true, promotions });

  } catch (error) {
    console.error("Error getting promotions:", error);
    if (error instanceof Error) {
        response.status(500).send({ error: error.message });
    } else {
        response.status(500).send({ error: "An unknown error occurred." });
    }
  }
});

/**
 * Updates an existing promotion.
 */
export const updatePromotion = functions.https.onRequest(async (request, response) => {
  try {
    // 1. Authenticate the user
    const idToken = request.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      response.status(401).send({ error: "Unauthorized" });
      return;
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const requestingUid = decodedToken.uid;

    // 2. Get promotion ID from URL and validate request body
    const promotionId = request.query.id as string;
    if (!promotionId) {
      response.status(400).send({ error: "Missing promotion ID." });
      return;
    }

    // Using partial schema for updates
    const updateSchema = createPromotionSchema.partial();
    const validation = updateSchema.safeParse(request.body);
    if (!validation.success) {
      response.status(400).send({ error: "Invalid request body", details: validation.error.errors });
      return;
    }
    const updates = validation.data;

    // 3. Authorize the user
    const promotionRef = firestore.collection("promotions").doc(promotionId);
    const promotionDoc = await promotionRef.get();
    if (!promotionDoc.exists) {
      response.status(404).send({ error: "Promotion not found" });
      return;
    }
    const promotion = promotionDoc.data() as PromotionDoc;

    const venueRef = firestore.collection("venues").doc(promotion.venueId);
    const venueDoc = await venueRef.get();
    if (!venueDoc.exists) {
      // This should not happen if data is consistent
      response.status(404).send({ error: "Associated venue not found" });
      return;
    }
    const venue = venueDoc.data() as VenueDoc;
    if (venue.ownerId !== requestingUid) {
      response.status(403).send({ error: "Forbidden: You are not the owner of this venue." });
      return;
    }

    // 4. Update the promotion
    await promotionRef.update(updates);

    response.status(200).send({ success: true, message: "Promotion updated successfully." });

  } catch (error) {
    console.error("Error updating promotion:", error);
    if (error instanceof Error) {
        response.status(500).send({ error: error.message });
    } else {
        response.status(500).send({ error: "An unknown error occurred." });
    }
  }
});

/**
 * Deletes a promotion.
 */
export const deletePromotion = functions.https.onRequest(async (request, response) => {
  try {
    // 1. Authenticate the user
    const idToken = request.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      response.status(401).send({ error: "Unauthorized" });
      return;
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const requestingUid = decodedToken.uid;

    // 2. Get promotion ID from URL
    const promotionId = request.query.id as string;
    if (!promotionId) {
      response.status(400).send({ error: "Missing promotion ID." });
      return;
    }

    // 3. Authorize the user
    const promotionRef = firestore.collection("promotions").doc(promotionId);
    const promotionDoc = await promotionRef.get();
    if (!promotionDoc.exists) {
      response.status(404).send({ error: "Promotion not found" });
      return;
    }
    const promotion = promotionDoc.data() as PromotionDoc;

    const venueRef = firestore.collection("venues").doc(promotion.venueId);
    const venueDoc = await venueRef.get();
    if (!venueDoc.exists) {
      response.status(404).send({ error: "Associated venue not found" });
      return;
    }
    const venue = venueDoc.data() as VenueDoc;
    if (venue.ownerId !== requestingUid) {
      response.status(403).send({ error: "Forbidden: You are not the owner of this venue." });
      return;
    }

    // 4. Delete the promotion
    await promotionRef.delete();

    response.status(200).send({ success: true, message: "Promotion deleted successfully." });

  } catch (error) {
    console.error("Error deleting promotion:", error);
    if (error instanceof Error) {
        response.status(500).send({ error: error.message });
    } else {
        response.status(500).send({ error: "An unknown error occurred." });
    }
  }
});
