const { Router } = require("express");
const {
  getSynonyms,
  addSynonym,
  getSynonym,
  updateSynonym,
  deleteSynonym,
} = require("../controllers/synonym.controller");

const router = Router();
const adminPolice = require("../middleware/adminPolice");

router.get("/", getSynonyms);
router.post("/", addSynonym);
router.get("/:id", getSynonym);
// router.put("/:id",adminPolice,updateSynonym)
// router.delete("/:id",adminPolice,deleteSynonym)

module.exports = router;
