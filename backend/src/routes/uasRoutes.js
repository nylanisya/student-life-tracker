const express = require("express");
const router = express.Router();
const uasController = require("../controllers/uasController");

router.get("/", uasController.getUasList);
router.post("/", uasController.addUas);
router.put("/:id", uasController.updateUas);
router.delete("/:id", uasController.deleteUas);

module.exports = router;
