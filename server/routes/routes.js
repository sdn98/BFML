const express = require("express");
const router = express.Router();
// declare routes to different services
const {
  createSetting,
  getSetting,
  getSettings,
  deleteSetting,
  updateSetting,
  trainSetting
} = require("../controllers/settings");

const {
  createDataset,
  getDatasets,
  deleteDataset,
} = require("../controllers/datasets");

const {
  createModel,
  getModels,
  deleteModel,
} = require("../controllers/models");

// router for settings functions
router.route("/createSetting").post(createSetting);
router.route("/getSetting/:id").get(getSetting);
router.route("/getSettings").get(getSettings);
router.route("/deleteSetting/:id").delete(deleteSetting);
router.route("/updateSetting").put(updateSetting);
router.route("/trainSetting/:id").get(trainSetting);

// router for datasets functions
router.route("/createDataset").post(createDataset);
router.route("/getDatasets").get(getDatasets);
router.route("/deleteDataset/:id").delete(deleteDataset);

// router for models functions
router.route("/createModel").post(createModel);
router.route("/getModels").get(getModels);
router.route("/deleteModel/:id").delete(deleteModel);

module.exports = router;