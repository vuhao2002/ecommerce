const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUserController,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  paidOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  getProfileUser,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
router.post("/register", registerUser);
router.post("/login", loginUserController);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.get("/logout", logout);
router.get("/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/profile", authMiddleware, getProfileUser);
router.get("/get-order/:id", authMiddleware, getOrder);
router.get("/get-all-orders", authMiddleware, getAllOrders);
router.get("/cart", authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getUser);

router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteUser);

router.put("/order/pay/:id", authMiddleware, paidOrder);
router.put("/save-address", authMiddleware, saveAddress);
router.put("/edit-user", authMiddleware, updateUser);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.put("/password", authMiddleware, updatePassword);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
