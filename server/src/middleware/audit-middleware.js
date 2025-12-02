const Audit = require("../models/audit-model/audit-model");
const { getDiff } = require("../utils/get-values-diff");

exports.audit = (model) => {
  return async function (req, res, next) {
    let oldDoc = null;
    let isUpdate = false;
    let isDelete = false;
    let id = req.params.id || req.body.id;

    if (req.method === "PUT" || req.method === "PATCH") {
      oldDoc = await model.findById(id).lean();
      isUpdate = true;
    }

    if (req.method === "DELETE") {
      oldDoc = await model.findById(id).lean();
      isDelete = true;
    }

    const send = res.json;

    res.json = async function (data) {
      let action = "";

      if (req.method === "POST") action = "create";
      if (isUpdate) action = "update";
      if (isDelete) action = "delete";

      let changes = {};

      if (action === "update" && oldDoc) {
        let newDoc = null;
        try {
          newDoc = await model
            .findById(id)
            .populate([
              {
                path: "studio",
                select: "name thumbnail address basePricePerSlot",
              },
              { path: "package", select: "name price" },
              { path: "addOns.item", select: "name price" },
            ])
            .lean();
        } catch (error) {
          console.error("Error fetching updated document:", error);
          newDoc = req.body;
        }

        changes = getDiff(oldDoc, newDoc);
      }

      if (action === "create") {
        changes = "Create new object";
      }

      if (action === "delete" && oldDoc) {
        changes = "Delete old object";
      }

      await Audit.create({
        actor: req.user?.id,
        action,
        model: model.modelName,
        targetId: id || (data?._id ?? null),
        changes,
        ip: req.ip,
      });

      return send.call(this, data);
    };

    next();
  };
};
