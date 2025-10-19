import admin from "firebase-admin";

function getAdmin() {
  if (admin.apps.length) return admin;

  if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
    process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decoded = JSON.parse(
      Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
        "base64"
      ).toString()
    );

    admin.initializeApp({ credential: admin.credential.cert(decoded) });
  } else {
    // emulators
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
  return admin;
}

export const adminApp = getAdmin();
export const adminDb = adminApp.firestore();
export const adminAuth = adminApp.auth();
