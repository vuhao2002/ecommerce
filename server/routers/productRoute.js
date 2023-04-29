const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  addToWishList,
  rating,
  uploadImages,
  checkUserBuyProduct,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  productImgResize,
  uploadPhoto,
} = require("../middlewares/uploadImages");

router.post("/create", authMiddleware, isAdmin, createProduct);

router.get("/", getAllProduct);
router.get("/checkuser/:id", authMiddleware, checkUserBuyProduct);
router.get("/:id", getProduct);

router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

module.exports = router;
