const { Router } = require("express");
const {
  getAuthorSocials,
  addAuthorSocial,
  getAuthorSocial,
  updateAuthorSocial,
  deleteAuthorSocial,
} = require("../controllers/authorSocial.controller");

const router = Router();
const authorPolice = require("../middleware/authorPolice");

router.get("/", getAuthorSocials);
router.post("/", authorPolice, addAuthorSocial);
router.get("/:id", getAuthorSocial);
router.put("/:id", authorPolice, updateAuthorSocial);
router.delete("/:id", authorPolice, deleteAuthorSocial);

module.exports = router;
