// exports.getDiff = (oldObj = {}, newObj = {}) => {
//   const diffs = {};

//   const compare = (oldVal, newVal, path) => {
//     if (
//       typeof oldVal !== "object" ||
//       oldVal === null ||
//       typeof newVal !== "object" ||
//       newVal === null
//     ) {
//       if (oldVal !== newVal) {
//         diffs[path] = { old: oldVal, new: newVal };
//       }
//       return;
//     }

//     const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);

//     keys.forEach((key) => {
//       compare(oldVal[key], newVal[key], `${path}.${key}`);
//     });
//   };

//   compare(oldObj, newObj, "root");

//   return diffs;
// };

exports.getDiff = (oldObj = {}, newObj = {}) => {
  const diffs = [];

  Object.keys(newObj).forEach((key) => {
    const oldVal = oldObj[key];
    const newVal = newObj[key];

    // Skip if values are identical
    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) return;

    diffs.push({
      key,
      old: oldVal,
      new: newVal,
    });
  });

  return diffs;
};
