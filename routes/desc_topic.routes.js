const { Router } = require("express");
const {
  getDescTopics,
  addDescTopic,
  getDescTopic,
  updateDescTopic,
  deletedescTopic,
} = require("../controllers/desc_topic.controller");

const router = Router();
const adminPolice = require("../middleware/adminPolice");

router.get("/", getDescTopics);
router.post("/", addDescTopic);
router.get("/:id", getDescTopic);
// router.put("/:id",adminPolice,updateDescTopic)
// router.delete("/:id",adminPolice,deletedescTopic)

module.exports = router;
