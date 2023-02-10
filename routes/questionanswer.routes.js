const { Router } = require("express");
const {
  addQuestionAnswer,
  getQuestionAnswers,
  getQuestionAnswer,
  updateQuestionAnswer,
  deleteQuestionAnswer,
} = require("../controllers/questiona.controller");

const router = Router();
const adminPolice = require("../middleware/adminPolice");

router.get("/", getQuestionAnswers);
router.post("/", addQuestionAnswer);
router.get("/:id", getQuestionAnswer);
// router.put("/:id",adminPolice,updateQuestionAnswer)
// router.delete("/:id",adminPolice,deleteQuestionAnswer)

module.exports = router;
