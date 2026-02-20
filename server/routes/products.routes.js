const { Router } = require("express");
const {createProduct, getSingleProduct, getProducts, updateProduct, disableProduct} = require("../controllers/products.controller");
const { auth, authorize } = require("../middlewares/auth");
const router = Router();

router.post("/",  createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.patch("/:id", auth, authorize(["moderator", "admin"]), updateProduct);
router.patch("/", auth, authorize(["moderator", "admin"]), disableProduct);


module.exports = router;