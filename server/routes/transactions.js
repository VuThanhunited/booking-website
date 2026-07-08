const express = require("express");
const router = express.Router();

const transactionController = require("../controller/Transaction");

// More specific routes first
router.put("/cancel/:id", transactionController.cancelTransaction);
router.delete("/canceled", transactionController.deleteCanceledTransactions);
router.get("/user/:userId", transactionController.getUserTransactions);

// Generic routes
router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getAllTransactions);

module.exports = router;
