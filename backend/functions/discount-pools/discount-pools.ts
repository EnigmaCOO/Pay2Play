
import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { z } from "zod";

type VenueDoc = { ownerId?: string };
type DiscountPoolDoc = {
  id: string;
  venueId: string;
  balancePkr: number;
  totalFundedPkr: number;
  updatedAt: admin.firestore.Timestamp;
};

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const firestore = admin.firestore();

// Input validation schema for funding a discount pool
const fundDiscountPoolSchema = z.object({
  venueId: z.string().min(1),
  amountPkr: z.number().min(1),
});

/**
 * Adds funds to a venue's discount pool.
 */
export const fundDiscountPool = functions.https.onRequest(async (request, response) => {
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
    const validation = fundDiscountPoolSchema.safeParse(request.body);
    if (!validation.success) {
      response.status(400).send({ error: "Invalid request body", details: validation.error.errors });
      return;
    }
    const { venueId, amountPkr } = validation.data;

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

    // 4. Update the discount pool
    const discountPoolRef = firestore.collection("discountPools").doc(venueId);
    const discountPoolDoc = await discountPoolRef.get();

    if (discountPoolDoc.exists) {
      await discountPoolRef.update({
        balancePkr: admin.firestore.FieldValue.increment(amountPkr),
        totalFundedPkr: admin.firestore.FieldValue.increment(amountPkr),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      const newDiscountPool: DiscountPoolDoc = {
        id: venueId,
        venueId,
        balancePkr: amountPkr,
        totalFundedPkr: amountPkr,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as admin.firestore.Timestamp,
      };
      await discountPoolRef.set(newDiscountPool);
    }

    response.status(200).send({ success: true, message: "Discount pool funded successfully." });

  } catch (error) {
    console.error("Error funding discount pool:", error);
    if (error instanceof Error) {
        response.status(500).send({ error: error.message });
    } else {
        response.status(500).send({ error: "An unknown error occurred." });
    }
  }
});

/**
 * Retrieves the discount pool for a given venue.
 */
export const getDiscountPool = functions.https.onRequest(async (request, response) => {
    try {
        const venueId = request.query.venueId as string;
        if (!venueId) {
            response.status(400).send({ error: "Missing venueId query parameter." });
            return;
        }

        const discountPoolRef = firestore.collection("discountPools").doc(venueId);
        const discountPoolDoc = await discountPoolRef.get();

        if (!discountPoolDoc.exists) {
            response.status(404).send({ error: "Discount pool not found for this venue." });
            return;
        }

        response.status(200).send({ success: true, discountPool: discountPoolDoc.data() });

    } catch (error) {
        console.error("Error getting discount pool:", error);
        if (error instanceof Error) {
            response.status(500).send({ error: error.message });
        } else {
            response.status(500).send({ error: "An unknown error occurred." });
        }
    }
});
