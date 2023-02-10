const { Router } = require("express");
const {
  addCategory,
  getCategories,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category.controller");

const router = Router();
const adminPolice = require("../middleware/adminPolice");

router.get("/", getCategories);
router.post("/", addCategory);
router.get("/:id", getCategory);
// router.put("/:id",adminPolice,updateCategory)
//router.get("/category/:category",getByNameCategory)
// router.delete("/:id",adminPolice,deleteCategory)

module.exports = router;
