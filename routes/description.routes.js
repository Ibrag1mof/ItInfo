const { Router } = require("express");
const {
  addDescription,
  getDescriptions,
  getDescription,
  deleteDescription,
  updateDescription,
} = require("../controllers/description.controller");

const router = Router();
const adminPolice = require("../middleware/adminPolice");
router.get("/", getDescriptions);
router.post("/", addDescription);
router.get("/:id", getDescription);
// router.put("/:id",adminPolice,updateDescription)
// router.delete("/:id",adminPolice,deleteDescription)

module.exports = router;
