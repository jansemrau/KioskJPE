const express = require("express");
const multer = require("multer");
const uuid = require("uuid").v4;
const gottesdienstController = require("../controllers/gottesdienstController");
const authController = require("./../controllers/authController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`);
    },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/getAllGottesdienste", gottesdienstController.getAllGottesdienste);
router.post("/newGottesdienst", gottesdienstController.createGottesdienst);
router.post("/upload", upload.array("files"), uploadFiles);
router
    .route("/deleteGottesdienst/:id")
    .delete(gottesdienstController.deleteGottesdienst);

module.exports = router;

function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.files);

    res.status(201).json({
        status: "success",
        data: {
            filename: req.files[0].filename,
        },
    });
}
