const express = require("express");
const router = express.Router();
const sksController = require("../controllers/sksController");

// Routes
router.get("/", sksController.getSksHistory);
router.post("/", sksController.addSks);
router.put("/:id", sksController.updateSks);
router.delete("/:id", sksController.deleteSks);

module.exports = router;
