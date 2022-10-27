const express = require("express");
const router = express.Router();

const {
  createSetting,
  getSetting,
  getSettings,
  deleteSetting,
  updateSetting,
  trainSetting
} = require("../controllers/settings");

router.route("/createSetting").post(createSetting);
router.route("/getSetting/:id").get(getSetting);
router.route("/getSettings").get(getSettings);
router.route("/deleteSetting/:id").delete(deleteSetting);
router.route("/updateSetting").put(updateSetting);
router.route("/trainSetting/:id").post(trainSetting);

module.exports = router;