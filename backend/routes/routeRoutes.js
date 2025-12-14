const express = require("express");
const router = express.Router();
const { recommendRoute } = require("../controllers/routeController");
const auth = require("../middleware/auth");

router.post("/recommend", auth, recommendRoute);

module.exports = router;