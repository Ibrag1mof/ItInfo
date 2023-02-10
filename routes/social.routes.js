const { Router } = require("express");
const {
  getSocials,
  addSocial,
  getSocial,
  updateSocial,
  deleteSocial,
} = require("../controllers/social.controller");

const router = Router();
const adminPolice = require("../middleware/adminPolice");

router.get("/", getSocials);
router.post("/", addSocial);
router.get("/:id", getSocial);
// router.put("/:id",adminPolice,updateSocial)
// router.delete("/:id",adminPolice,deleteSocial)

module.exports = router;
