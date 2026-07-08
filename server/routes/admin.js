const express = require("express");
const adminController = require("../controller/admin");
const { verifyAdmin } = require("../middleware/verifyAdmin");

const router = express.Router();

// Chỉ Admin mới truy cập được
router.get("/stats", verifyAdmin, adminController.getStats);
router.get("/transactions", verifyAdmin, adminController.getLatestTransactions);

module.exports = router;
