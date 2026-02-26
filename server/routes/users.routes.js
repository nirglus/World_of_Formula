const { Router } = require("express");
const { auth, authorize } = require("../middlewares/auth");
const { register, login, deleteUser, updateUser, getUser } = require("../controllers/users.controller");
const { createNewCart } = require("../controllers/carts.controller");
const { demoLogin } = require("../controllers/auth.controller");
const demoRateLimit = require("../middlewares/demoRateLimit");

const router = Router();

router.post("/demo", demoRateLimit, demoLogin);
router.post("/register", register, createNewCart);
router.post("/login", login);
router.get("/", auth, getUser)
router.delete("/:id", auth, authorize(["admin"]), deleteUser);
router.patch("/:id", auth, updateUser);


module.exports = router;
