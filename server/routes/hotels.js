const express = require("express");

const hotelController = require("../controller/Hotel");
const { verifyAdmin } = require("../middleware/verifyAdmin");

// const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();

router.put("/add-room", hotelController.addRoomToHotel);

router.get("/countByCity", hotelController.countByCity);

router.get("/countByType", hotelController.countByType);

router.get("/top-rated", hotelController.getTopRated);

router.get("/search", hotelController.searchHotels);

// More specific routes first
router.get("/:id/available-rooms", hotelController.getAvailableRoomNumbers);

//admin page
router.post("/", verifyAdmin, hotelController.createHotel);

router.put("/:id", verifyAdmin, hotelController.updateHotel);

router.delete("/:id", verifyAdmin, hotelController.deleteHotel);

// Generic routes last
router.get("/:id", hotelController.getHotel);

router.get("/", hotelController.getHotels);

module.exports = router;
