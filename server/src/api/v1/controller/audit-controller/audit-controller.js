const asyncHandler = require("express-async-handler");
const AuditModel = require("../../../../models/audit-model/audit-model");
const AppError = require("../../../../utils/app-error");
const { HTTP_STATUS_TEXT } = require("../../../../config/system-variables");

exports.getLog = asyncHandler(async (req, res) => {
  const { targetId } = req.params;

  if (!targetId) {
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "target id can not be blank",
    );
  }

  const logs = await AuditModel.find({ targetId }).sort({ createdAt: -1 });

  if (logs.length === 0) {
    throw new AppError(
      404,
      HTTP_STATUS_TEXT.ERROR,
      "can not find logs for this item",
    );
  }

  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: logs,
  });
});
