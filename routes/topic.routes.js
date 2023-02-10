const { Router } = require("express");
const {
  addTopic,
  getTopics,
  getTopic,
  updateTopic,
  deleteTopic,
} = require("../controllers/topic.controller");

const router = Router();
const adminPolice = require("../middleware/adminPolice");

router.get("/", getTopics);
// router.post("/",adminPolice,addTopic)
router.get("/:id", getTopic);
// router.put("/:id",adminPolice,updateTopic)
// router.delete("/:id",adminPolice,deleteTopic)

module.exports = router;
