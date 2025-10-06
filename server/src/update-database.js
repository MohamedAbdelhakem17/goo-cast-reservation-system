const mongoose = require("mongoose");
const uri =
  "mongodb+srv://abdelhakem:gUWwV4BpMRv8z9f2@dottopia.gjvd3.mongodb.net/goocast";

async function updateAllCollections() {
  await mongoose.connect(uri);

  const collections = [
    { name: "categories", fields: ["name"] },
    { name: "faqs", fields: ["question", "answer"] },
    {
      name: "hourlypackages",
      fields: [
        "name",
        "target_audience",
        "description",
        "details",
        "post_session_benefits",
        "session_type",
      ],
    },
    {
      name: "studios",
      fields: ["name", "address", "description", "facilities", "equipment"],
    },
    { name: "addons", fields: ["name", "description"] },
  ];

  for (const coll of collections) {
    const Model = mongoose.model(
      coll.name,
      new mongoose.Schema({}, { strict: false }),
      coll.name
    );

    // بنبني الـ $set object مرة واحدة لكل الحقول
    const setObject = {};

    coll.fields.forEach((field) => {
      setObject[field] = {
        $cond: [
          // لو الحقل array
          { $eq: [{ $type: `$${field}` }, "array"] },
          {
            ar: [],
            en: `$${field}`, // لاحظ ال $ هنا مش جوا string
          },
          // لو الحقل object (معمول conversion قبل كده)
          {
            $cond: [
              { $eq: [{ $type: `$${field}` }, "object"] },
              {
                ar: { $ifNull: [`$${field}.ar`, ""] },
                en: { $ifNull: [`$${field}.en`, ""] },
              },
              // لو string عادي
              {
                ar: "",
                en: `$${field}`,
              },
            ],
          },
        ],
      };
    });

    const result = await Model.updateMany({}, [{ $set: setObject }]);

    console.log(
      `Collection "${coll.name}" updated: ${result.modifiedCount} documents`
    );
  }

  await mongoose.disconnect();
  console.log("All collections updated successfully!");
}

updateAllCollections().catch(console.error);
