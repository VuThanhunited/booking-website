const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

// GET all users (not deleted)
router.get("/", userController.getAllUsers);

// PUT - soft delete
router.put("/:id/delete", userController.softDeleteUser);

// PUT - update active status
router.put("/:id/status", userController.updateUserStatus);

// // POST - login
// router.post("/login", userController.login);

module.exports = router;
