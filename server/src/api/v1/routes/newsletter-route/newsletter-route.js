const express = require("express");

const router = express.Router();

const NewsLetter = require("../../controller/newsletter-controller/newsletter-controller");

router.route("/").post(NewsLetter.subscribe);

module.exports = router;
