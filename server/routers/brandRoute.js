const express = require("express");
const router = express.Router();
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrand,
} = require("../controller/brandController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createBrand);

router.put("/:id", authMiddleware, isAdmin, updateBrand);

router.delete("/:id", authMiddleware, isAdmin, deleteBrand);

router.get("/:id", getBrand);

router.get("/", getAllBrand);

module.exports = router;
