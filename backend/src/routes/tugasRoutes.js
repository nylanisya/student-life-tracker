const express = require("express");
const router = express.Router();
const tugasController = require("../controllers/tugasController");

router.get("/", tugasController.getTugasList);
router.post("/", tugasController.addTugas);
router.put("/:id", tugasController.updateTugas);
router.delete("/:id", tugasController.deleteTugas);

module.exports = router;
