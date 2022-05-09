const express = require("express");
const multer = require("multer");
const uuid = require("uuid").v4;
const kioskController = require("../controllers/kioskController");

const router = express.Router();

router.get("/getAllParticipants", kioskController.getAllParticipants);
router.post("/newParticipant", kioskController.newParticipant);
router.delete("/participants/:id", kioskController.deleteParticipant);

router.get("/getAllProducts", kioskController.getAllProducts);
router.post("/newProduct", kioskController.newProduct);
router.delete("/products/:id", kioskController.deleteProduct);
router.route("/participants/:id").patch(kioskController.updateGuthaben);

module.exports = router;
