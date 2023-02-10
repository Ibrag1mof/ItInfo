const { Router } = require("express");
const {
  addDictionary,
  getDictionaries,
  updateDictionary,
  getDictionary,
  getTermByLetter,
  deleteDictionary,
} = require("../controllers/dictionary.controller");

const router = Router();
const adminPolice = require("../middleware/adminPolice");

router.get("/", getDictionaries);
router.post("/", addDictionary);
router.get("/:id", getDictionary);
// router.put("/:id",adminPolice,updateDictionary)
// router.delete("/:id",adminPolice,deleteDictionary)
router.get("/letter/:letter", getTermByLetter);

module.exports = router;
