const express = require("express");

const roomController = require("../controller/room");
const { verifyAdmin } = require("../middleware/verifyAdmin");

const router = express.Router();

// Room Public APIs - more specific routes first
router.post("/reserve", roomController.reserveRoomAndSendEmail);
router.put("/availability/:id", roomController.updateRoomAvailability);

router.get("/", roomController.getAllRooms);

// Room Admin APIs
router.post("/", verifyAdmin, roomController.createRoom);
router.put("/:id", verifyAdmin, roomController.updateRoom);
router.delete("/:id", verifyAdmin, roomController.deleteRoom);
router.get("/:id", verifyAdmin, roomController.getRoomById);

module.exports = router;
