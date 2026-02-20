const { Router } = require("express");
const {createNewCart, getUserCart, addItemToCart, deleteCart, deleteItemFromCart, getUserCartByUserID} = require("../controllers/carts.controller");
const { auth, authorize } = require("../middlewares/auth");
const router = Router();

router.post("/", createNewCart);
router.get("/:id", getUserCartByUserID);
// router.get("/:id", getUserCart);
router.patch("/:id", addItemToCart);
router.delete("/:id/:itemID",deleteItemFromCart);
router.delete("/:id", auth, authorize(["admin"]) ,deleteCart);


module.exports = router;