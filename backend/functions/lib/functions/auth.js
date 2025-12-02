import * as admin from "firebase-admin";
// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
// Middleware to authenticate Firebase ID tokens
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided or invalid format" });
    }
    const idToken = authHeader.split("Bearer ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Attach user to request object
        return next();
    }
    catch (error) {
        console.error("Error verifying Firebase ID token:", error);
        return res.status(403).json({ error: "Unauthorized" });
    }
};
// Function for user registration
export const registerUser = async (req, res) => {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
        });
        return res.status(201).json({ uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName });
    }
    catch (error) {
        console.error("Error creating new user:", error);
        return res.status(500).json({ error: error.message });
    }
};
// Function for user login (this typically happens on the client-side,
// but we can provide a custom token endpoint if needed for specific flows)
// For standard Firebase Auth, client-side SDKs handle login and token generation.
// This example assumes client-side login and token verification on the backend.
export const loginUser = async (req, res) => {
    // In a typical Firebase Auth flow, login happens on the client-side,
    // and the client sends the ID token to the backend for verification.
    // This endpoint could be used for custom token generation if a specific
    // backend-driven login flow is required, but for now, it's a placeholder
    // to illustrate where login-related backend logic would go.
    res.status(200).json({ message: "Login handled client-side. Send ID token for authenticated requests." });
};
//# sourceMappingURL=auth.js.map