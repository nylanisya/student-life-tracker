const express = require("express");
const router = express.Router();
const visionController = require("../controllers/visionController");

router.get("/", visionController.getVisions);
router.post("/", visionController.addVision);
router.put("/:id", visionController.updateVision);
router.delete("/:id", visionController.deleteVision);

module.exports = router;
