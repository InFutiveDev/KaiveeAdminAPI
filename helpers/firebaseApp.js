require("dotenv").config(); // Load environment variables

const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");

// Safely parse environment variable
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
} catch (error) {
  console.error("Error parsing Firebase credentials:", error);
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
});

const bucket = getStorage().bucket("gs://kaivee.firebasestorage.app");

module.exports = { bucket };
