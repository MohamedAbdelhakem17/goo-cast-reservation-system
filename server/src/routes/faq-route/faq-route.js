const FqaController = require("../../controller/faq-controller/faq-controller");
const express = require("express");

const protectRoute = require("../../middleware/protect.middleware");
const allowTo = require("../../middleware/allow-to-middleware");

const { USER_ROLE } = require("../../config/system-variables");

const router = express.Router();

// Get all FAQs
router.get("/", FqaController.getAllFaqs);

// Protected routes for creating, updating, and deleting FAQs
router.use(protectRoute, allowTo(USER_ROLE.ADMIN));

// Create a new FAQ
router.post("/", FqaController.createFaq);
// Update an existing FAQ
router.put("/:id", FqaController.updateFaq);
// Delete an FAQ
router.delete("/:id", FqaController.deleteFaq);

module.exports = router;
