const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Instructions:
// 1. Download your serviceAccountKey.json from Firebase Console
//    (Project Settings > Service Accounts > Generate new private key).
// 2. Place it in the root directory (it is gitignored).
// 3. Find your Target UID from Firebase Console > Authentication.
// 4. Run this script: TARGET_UID="your_uid" node scripts/migrate_legacy_tasks.js

const targetUid = process.env.TARGET_UID;

if (!targetUid) {
  console.error("Error: TARGET_UID environment variable is missing.");
  console.error('Usage: TARGET_UID="your_uid" node scripts/migrate_legacy_tasks.js');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = require("../serviceAccountKey.json");
} catch (error) {
  console.error("Error: Could not find ../serviceAccountKey.json");
  console.error("Please download it from the Firebase Console and place it in the root directory.");
  process.exit(1);
}

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function migrateLegacyTasks() {
  console.log(`Starting migration. Target UID: ${targetUid}`);
  
  try {
    const tasksSnapshot = await db.collection("tasks").get();
    
    let totalFound = tasksSnapshot.size;
    let migratedCount = 0;
    let skippedCount = 0;
    
    console.log(`Found ${totalFound} total tasks in the database.`);
    
    const batch = db.batch();
    
    tasksSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Strict Idempotency: Only migrate if userId is completely missing
      if (data.userId === undefined || data.userId === null) {
        batch.update(doc.ref, { userId: targetUid });
        migratedCount++;
      } else {
        skippedCount++;
      }
    });
    
    if (migratedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully migrated ${migratedCount} legacy tasks to UID: ${targetUid}.`);
    } else {
      console.log(`✅ No legacy tasks needed migration.`);
    }
    
    console.log(`Skipped ${skippedCount} tasks that already have a userId.`);
    
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    process.exit(0);
  }
}

migrateLegacyTasks();
