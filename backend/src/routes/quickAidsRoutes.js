const express = require("express");
const router = express.Router();
const quickAidsController = require("../controllers/quickAidsController");

router.get("/:table", quickAidsController.getData);
router.post("/:table", quickAidsController.addData);
router.put("/:table/:id", quickAidsController.updateData);
router.delete("/:table/:id", quickAidsController.deleteData);

module.exports = router;
