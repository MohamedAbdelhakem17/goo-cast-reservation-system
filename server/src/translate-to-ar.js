// const mongoose = require("mongoose");
// const translate = require("@vitalets/google-translate-api");

// const uri =
//   "mongodb+srv://abdelhakem:gUWwV4BpMRv8z9f2@dottopia.gjvd3.mongodb.net/goocast";

// // عداد للترجمات
// let translationCount = 0;
// const BATCH_DELAY = 2000; // 2 ثانية بين كل دفعة

// async function safeTranslate(text) {
//   if (!text || typeof text !== "string") return text;

//   // تجاهل النصوص القصيرة جداً أو الأرقام
//   if (text.trim().length < 2 || /^\d+$/.test(text)) return text;

//   for (let attempt = 1; attempt <= 3; attempt++) {
//     try {
//       const res = await translate(text, { from: "en", to: "ar" });
//       translationCount++;

//       // تأخير بسيط بعد كل ترجمة لتجنب Rate Limiting
//       await new Promise((r) => setTimeout(r, 300));

//       return res.text;
//     } catch (err) {
//       console.warn(
//         `⚠️ Error translating "${text.substring(0, 50)}..." (try ${attempt}): ${err.message}`
//       );
//       if (attempt === 3) return text;
//       await new Promise((r) => setTimeout(r, 1000 * attempt));
//     }
//   }
// }

// async function translateValue(value) {
//   if (!value) return value;

//   // تحقق إذا كانت القيمة مترجمة بالفعل
//   if (typeof value === "object" && value.en && value.ar) {
//     return value;
//   }

//   // String
//   if (typeof value === "string") {
//     const ar = await safeTranslate(value);
//     return { en: value, ar };
//   }

//   // Array
//   if (Array.isArray(value)) {
//     const translatedAr = [];
//     for (const item of value) {
//       if (typeof item === "string") {
//         translatedAr.push(await safeTranslate(item));
//       } else if (typeof item === "object") {
//         const translatedObj = {};
//         for (const [k, v] of Object.entries(item)) {
//           translatedObj[k] = await translateValue(v);
//         }
//         translatedAr.push(translatedObj);
//       } else {
//         translatedAr.push(item);
//       }
//     }
//     return { en: value, ar: translatedAr };
//   }

//   // Object (nested)
//   if (typeof value === "object") {
//     const translatedObj = {};
//     for (const [key, val] of Object.entries(value)) {
//       translatedObj[key] = await translateValue(val);
//     }
//     return translatedObj;
//   }

//   return value;
// }

// function needsTranslation(value) {
//   // تحقق إذا كان الحقل يحتاج ترجمة
//   if (!value) return false;

//   // لو كائن بالفعل وفيه en و ar، مش محتاج ترجمة
//   if (typeof value === "object" && value.en && value.ar) {
//     return false;
//   }

//   // لو string أو array، محتاج ترجمة
//   if (typeof value === "string" || Array.isArray(value)) {
//     return true;
//   }

//   // لو object عادي، شوف جواه
//   if (typeof value === "object") {
//     return Object.values(value).some((v) => needsTranslation(v));
//   }

//   return false;
// }

// async function translateCollections() {
//   try {
//     await mongoose.connect(uri);
//     console.log("✅ Connected to MongoDB\n");

//     const collections = [
//       { name: "categories", fields: ["name"] },
//       { name: "faqs", fields: ["question", "answer"] },
//       {
//         name: "hourlypackages",
//         fields: [
//           "name",
//           "target_audience",
//           "description",
//           "details",
//           "post_session_benefits",
//           "session_type",
//         ],
//       },
//       {
//         name: "studios",
//         fields: ["name", "address", "description", "facilities", "equipment"],
//       },
//       { name: "addons", fields: ["name", "description"] },
//     ];

//     const startTime = Date.now();

//     for (const coll of collections) {
//       const Model = mongoose.model(
//         coll.name,
//         new mongoose.Schema({}, { strict: false }),
//         coll.name
//       );

//       console.log(`\n${"=".repeat(60)}`);
//       console.log(`🚀 Processing collection: "${coll.name}"`);
//       console.log(`${"=".repeat(60)}`);

//       const docs = await Model.find({});
//       console.log(`📊 Found ${docs.length} document(s)`);

//       let translatedDocs = 0;
//       let skippedDocs = 0;

//       for (let i = 0; i < docs.length; i++) {
//         const doc = docs[i];
//         const updatedFields = {};
//         let hasChanges = false;

//         for (const field of coll.fields) {
//           const value = doc[field];

//           if (needsTranslation(value)) {
//             console.log(
//               `   🔄 Translating field "${field}" in doc ${i + 1}/${docs.length}...`
//             );
//             updatedFields[field] = await translateValue(value);
//             hasChanges = true;
//           }
//         }

//         if (hasChanges) {
//           await Model.updateOne({ _id: doc._id }, { $set: updatedFields });
//           translatedDocs++;
//           console.log(
//             `   ✅ Updated document ${i + 1}/${docs.length} (ID: ${doc._id})`
//           );
//         } else {
//           skippedDocs++;
//           console.log(
//             `   ⏭️  Skipped document ${i + 1}/${docs.length} (already translated)`
//           );
//         }

//         // تأخير بين المستندات لتجنب الضغط على API
//         if (hasChanges && i < docs.length - 1) {
//           await new Promise((r) => setTimeout(r, BATCH_DELAY));
//         }
//       }

//       console.log(`\n📈 Collection "${coll.name}" Summary:`);
//       console.log(`   ✅ Translated: ${translatedDocs}`);
//       console.log(`   ⏭️  Skipped: ${skippedDocs}`);
//       console.log(`   📝 Total translations made: ${translationCount}`);
//     }

//     const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

//     console.log(`\n${"=".repeat(60)}`);
//     console.log(`🎉 All collections processed successfully!`);
//     console.log(`⏱️  Total time: ${duration} minutes`);
//     console.log(`📝 Total translations: ${translationCount}`);
//     console.log(`${"=".repeat(60)}\n`);
//   } catch (error) {
//     console.error("\n❌ Fatal error:", error);
//     throw error;
//   } finally {
//     await mongoose.disconnect();
//     console.log("🔌 Disconnected from MongoDB");
//   }
// }

// // تشغيل السكريبت
// translateCollections().catch(console.error);
