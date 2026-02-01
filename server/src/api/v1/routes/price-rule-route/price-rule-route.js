const express = require("express");

const router = express.Router();

const priceRuleController = require("../../controller/price-rules-controller/price-rules-controller");
const protectRoute = require("../../../../middleware/protect.middleware");
const allowTo = require("../../../../middleware/allow-to-middleware");
const { USER_ROLE } = require("../../../../config/system-variables");

// router.use(protectRoute, allowTo(USER_ROLE.ADMIN))

router
  .route("/")
  .post(priceRuleController.addNewPriceRule)
  .delete(priceRuleController.deletePriceRule)
  .put(priceRuleController.editPriceRule);

router.route("/:id").get(priceRuleController.getAllPriceRules);

module.exports = router;
