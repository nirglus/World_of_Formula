const { Router } = require("express");
const { createOrder, getOrder, updateOrderStatus, deleteOrder, getUserOrders } = require("../controllers/orders.controller");
const { auth, authorize } = require("../middlewares/auth");
const router = Router();

router.post("/", createOrder);
router.get("/",  getUserOrders);
router.get("/:id", getOrder);
router.patch("/:id", auth, authorize(["moderator", "admin"]), updateOrderStatus);
router.delete("/:id", auth, authorize(["admin"]), deleteOrder);

module.exports = router;