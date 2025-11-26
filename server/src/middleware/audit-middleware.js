const Audit = require("../models/audit-model/audit-model");
const { getDiff } = require("../utils/get-values-diff");

exports.audit = (model) => {
  return async function (req, res, next) {
    let oldDoc = null;
    let isUpdate = false;
    let isDelete = false;
    let id = req.params.id || req.body.id;
    // console.log(req.params);

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
        changes = getDiff(oldDoc, req.body);
      }

      if (action === "create") {
        changes = "Create new object";
      }

      if (action === "delete" && oldDoc) {
        changes = "Delete old object";
      }

      // سجل Audit Log
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
