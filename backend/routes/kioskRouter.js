const express = require("express");
const multer = require("multer");
const uuid = require("uuid").v4;
const gottesdienstController = require("../controllers/kioskController");

const router = express.Router();

router.get("/getAllParticipants", gottesdienstController.getAllParticipants);
router.post("/newParticipant", gottesdienstController.newParticipant);
router.delete("/participants/:id", gottesdienstController.deleteParticipant);

router.get("/getAllProducts", gottesdienstController.getAllProducts);
router.post("/newProduct", gottesdienstController.newProduct);
router.delete("/products/:id", gottesdienstController.deleteProduct);
router.route("/participants/:id").patch(gottesdienstController.updateGuthaben);

module.exports = router;
