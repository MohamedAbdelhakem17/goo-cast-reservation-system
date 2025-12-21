// // exports.getDiff = (oldObj = {}, newObj = {}) => {
// //   const diffs = {};

// //   const compare = (oldVal, newVal, path) => {
// //     if (
// //       typeof oldVal !== "object" ||
// //       oldVal === null ||
// //       typeof newVal !== "object" ||
// //       newVal === null
// //     ) {
// //       if (oldVal !== newVal) {
// //         diffs[path] = { old: oldVal, new: newVal };
// //       }
// //       return;
// //     }

// //     const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);

// //     keys.forEach((key) => {
// //       compare(oldVal[key], newVal[key], `${path}.${key}`);
// //     });
// //   };

// //   compare(oldObj, newObj, "root");

// //   return diffs;
// // };

// exports.getDiff = (oldObj = {}, newObj = {}) => {
//   const diffs = [];

//   Object.keys(newObj).forEach((key) => {
//     const oldVal = oldObj[key];
//     const newVal = newObj[key];

//     // Skip if values are identical
//     if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return;

//     diffs.push({
//       key,
//       old: oldVal,
//       new: newVal,
//     });
//   });

//   return diffs;
// };

const isEqual = (val1, val2) => {
  return JSON.stringify(val1) === JSON.stringify(val2);
};

exports.getDiff = (oldDoc, newDoc) => {
  const changes = [];

  const fieldsToTrack = [
    "studio",
    "package",
    "date",
    "startSlot",
    "endSlot",
    "status",
    "addOns",
    "selectedAddOns",
    "totalPrice",
    "totalPriceAfterDiscount",
    "persons",
    "duration",
    "paymentMethod",
    "isPaid",
  ];

  for (const key of fieldsToTrack) {
    if (!(key in oldDoc) && !(key in newDoc)) continue;

    const oldValue = oldDoc[key];
    const newValue = newDoc[key];

    if (!isEqual(oldValue, newValue)) {
      const change = { key };

      if (key === "studio" || key === "package") {
        change.old = oldValue;

        if (typeof newValue === "string" || newValue instanceof String) {
          change.new = newValue;
        } else {
          change.new = newValue;
        }
      } else if (key === "addOns" || key === "selectedAddOns") {
        change.old = oldValue || null;
        change.new = newValue || null;
      } else {
        change.old = oldValue;
        change.new = newValue;
      }

      changes.push(change);
    }
  }

  return changes;
};
