const express = require("express");

const {
  getAllMeets,getOnlineMembers,getVoices
} = require("../controllers/dataToFron");

const router = express.Router();

router.route("/meets").get(getAllMeets)
router.route("/actives").get(getOnlineMembers)
router.route("/voices").get(getVoices)

module.exports = router;