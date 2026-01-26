const asyncHandler = require("express-async-handler");
const PromotionModel = require("../../../../models/promotions-model/promotions-model");
const { HTTP_STATUS_TEXT } = require("../../../../config/system-variables");
const AppError = require("../../../../utils/app-error");
const validatePromotionDates = require("../../../../utils/validate-promotion-dates");

/**
 * Creates a new promotion in the database.
 *
 * @async
 * @function createPromotion
 * @description Creates a new promotion record with the provided details including title, date range, description, and enabled status.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing promotion details
 * @param {string} req.body.title - The title of the promotion
 * @param {Date|string} req.body.start_date - The start date of the promotion
 * @param {Date|string} req.body.end_date - The end date of the promotion
 * @param {string} req.body.description - The description of the promotion
 * @param {boolean} req.body.isEnabled - Whether the promotion is enabled or not
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} The newly created promotion object
 *
 * @throws {Error} If promotion creation fails
 *
 * @example
 * // Request body example
 * {
 *   "title": "Summer Sale",
 *   "start_date": "2024-06-01",
 *   "end_date": "2024-08-31",
 *   "description": "Get 20% off on all studio bookings",
 *   "isEnabled": true
 * }
 */

exports.createNwPromotion = asyncHandler(async (req, res) => {
  // Get Data from request body
  const { title, start_date, end_date, description, isEnabled, priority } =
    req.body;

  // Validated required fields
  if (!title || !start_date || !end_date) {
    throw new AppError(
      400,
      HTTP_STATUS_TEXT.FAIL,
      "title, start_date and end_date are required",
    );
  }

  // Validate promotion dates
  const dateError = validatePromotionDates(
    new Date(start_date),
    new Date(end_date),
  );

  // If date validation fails, throw an error
  if (dateError) {
    throw new AppError(400, HTTP_STATUS_TEXT.FAIL, dateError);
  }

  // Create new promotion
  const newPromotion = await PromotionModel.create({
    title,
    start_date,
    end_date,
    description,
    isEnabled,
    priority,
  });

  // Send response
  res.status(201).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: newPromotion,
  });
});

/**
 * Retrieves all promotions from the database.
 *
 * @async
 * @function getAllPromotions
 * @description Fetches all promotion records from the database, sorted by start date in descending order (newest first).
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} Response object containing all promotions
 * @returns {string} return.status - Status of the operation (SUCCESS)
 * @returns {number} return.results - Total number of promotions found
 * @returns {Array<Object>} return.data - Array of promotion objects
 *
 * @throws {AppError} 404 - If no promotions are found in the database
 *
 * @example
 * // Response example
 * {
 *   "status": "SUCCESS",
 *   "results": 5,
 *   "data": [
 *     {
 *       "_id": "...",
 *       "title": "Summer Sale",
 *       "start_date": "2024-06-01",
 *       "end_date": "2024-08-31",
 *       "description": "Get 20% off",
 *       "isEnabled": true,
 *       "priority": 1
 *     }
 *   ]
 * }
 */
exports.getAllPromotions = asyncHandler(async (req, res) => {
  // get all promotions from database
  const promotions = await PromotionModel.find().sort({ start_date: -1 });

  // If no promotions found, throw an error
  if (!promotions || promotions.length === 0) {
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "No promotions found");
  }

  // Send response
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    results: promotions.length,
    data: promotions,
  });
});

/**
 * Retrieves a specific promotion by its ID.
 *
 * @async
 * @function getPromotionById
 * @description Fetches a single promotion record from the database using the provided promotion ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - The unique identifier of the promotion to retrieve
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} Response object containing the requested promotion
 * @returns {string} return.status - Status of the operation (SUCCESS)
 * @returns {Object} return.data - The promotion object
 *
 * @throws {AppError} 404 - If promotion with the specified ID is not found
 *
 * @example
 * // Request URL example
 * // GET /api/v2/promotions/507f1f77bcf86cd799439011
 *
 * // Response example
 * {
 *   "status": "SUCCESS",
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "title": "Summer Sale",
 *     "start_date": "2024-06-01",
 *     "end_date": "2024-08-31",
 *     "description": "Get 20% off on all studio bookings",
 *     "isEnabled": true,
 *     "priority": 1
 *   }
 * }
 */
exports.getPromotionById = asyncHandler(async (req, res) => {
  // Get promotion ID from request parameters
  const { id } = req.params;

  // Find promotion by ID
  const promotion = await PromotionModel.findById(id);

  // If promotion not found, throw an error
  if (!promotion) {
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Promotion not found");
  }

  // Send response
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: promotion,
  });
});

/**
 * Retrieves the currently active promotion with the highest priority.
 *
 * @async
 * @function getActivePromotions
 * @description Fetches the active promotion that is currently running (based on start and end dates),
 * is enabled, and has the highest priority. Only returns a single promotion.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} Response object containing the active promotion
 * @returns {string} return.status - Status of the operation (SUCCESS)
 * @returns {Object} return.data - The active promotion object with the highest priority
 *
 * @throws {AppError} 404 - If no active promotion is currently running
 *
 * @example
 * // Response example
 * {
 *   "status": "SUCCESS",
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "title": "Summer Sale",
 *     "start_date": "2024-06-01T00:00:00.000Z",
 *     "end_date": "2024-08-31T23:59:59.999Z",
 *     "description": "Get 20% off on all studio bookings",
 *     "isEnabled": true,
 *     "priority": 1
 *   }
 * }
 */
exports.getActivePromotions = asyncHandler(async (req, res) => {
  // Find active promotions
  const now = new Date();

  // Find promotions that are currently active
  const activePromotions = await PromotionModel.findOne({
    start_date: { $lte: now },
    end_date: { $gte: now },
    isEnabled: true,
  }).sort({ priority: -1 });

  // If no active promotions found, throw an error
  if (!activePromotions) {
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "No active promotion found");
  }

  // Send response
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: activePromotions,
  });
});

/**
 * Updates an existing promotion in the database.
 *
 * @async
 * @function updatedPromotion
 * @description Updates a promotion record with new details. All fields are optional and only provided fields will be updated.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - The unique identifier of the promotion to update
 * @param {Object} req.body - Request body containing promotion details to update
 * @param {string} [req.body.title] - The new title of the promotion
 * @param {Date|string} [req.body.start_date] - The new start date of the promotion
 * @param {Date|string} [req.body.end_date] - The new end date of the promotion
 * @param {string} [req.body.description] - The new description of the promotion
 * @param {boolean} [req.body.isEnabled] - Whether the promotion is enabled or not
 * @param {number} [req.body.priority] - The priority level of the promotion
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} Response object containing the updated promotion
 * @returns {string} return.status - Status of the operation (SUCCESS)
 * @returns {Object} return.data - The updated promotion object
 *
 * @throws {AppError} 404 - If promotion with the specified ID is not found
 *
 * @example
 * // Request URL example
 * // PUT /api/v2/promotions/507f1f77bcf86cd799439011
 *
 * // Request body example
 * {
 *   "title": "Winter Sale",
 *   "description": "Get 30% off on all studio bookings",
 *   "isEnabled": false
 * }
 *
 * // Response example
 * {
 *   "status": "SUCCESS",
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "title": "Winter Sale",
 *     "start_date": "2024-06-01",
 *     "end_date": "2024-08-31",
 *     "description": "Get 30% off on all studio bookings",
 *     "isEnabled": false,
 *     "priority": 1
 *   }
 * }
 */
exports.updatedPromotion = asyncHandler(async (req, res) => {
  // Get promotion ID from request parameters
  const { id } = req.params;
  const { title, start_date, end_date, description, isEnabled, priority } =
    req.body;

  // Find promotion by ID and update
  const updatedPromotion = await PromotionModel.findByIdAndUpdate(
    id,
    { title, start_date, end_date, description, isEnabled, priority },
    { new: true, runValidators: true },
  );

  // If promotion not found, throw an error
  if (!updatedPromotion) {
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Promotion not found");
  }

  // Send response
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: updatedPromotion,
  });
});

/**
 * Deletes a promotion from the database.
 *
 * @async
 * @function deletePromotion
 * @description Permanently removes a promotion record from the database using the provided promotion ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - The unique identifier of the promotion to delete
 * @param {Object} res - Express response object
 *
 * @returns {Promise<Object>} Response object containing the deleted promotion data
 * @returns {string} return.status - Status of the operation (SUCCESS)
 * @returns {Object} return.data - The deleted promotion object
 *
 * @throws {AppError} 404 - If promotion with the specified ID is not found
 *
 * @example
 * // Request URL example
 * // DELETE /api/v2/promotions/507f1f77bcf86cd799439011
 *
 * // Response example
 * {
 *   "status": "SUCCESS",
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "title": "Summer Sale",
 *     "start_date": "2024-06-01",
 *     "end_date": "2024-08-31",
 *     "description": "Get 20% off on all studio bookings",
 *     "isEnabled": true,
 *     "priority": 1
 *   }
 * }
 */
exports.deletePromotion = asyncHandler(async (req, res) => {
  // Get promotion ID from request parameters
  const { id } = req.params;

  // Find promotion by ID and delete
  const deletedPromotion = await PromotionModel.findByIdAndDelete(id);

  // If promotion not found, throw an error
  if (!deletedPromotion) {
    throw new AppError(404, HTTP_STATUS_TEXT.FAIL, "Promotion not found");
  }

  // Send response
  res.status(200).json({
    status: HTTP_STATUS_TEXT.SUCCESS,
    data: deletedPromotion,
  });
});
