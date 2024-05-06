const express = require("express");
const { registerUser, authUser, editUser, deleteUser, countUser, lastCount, searchUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router()

router.route('/').post(registerUser)
router.post("/login",authUser)
router.put("/edit",protect,editUser)
router.delete("/delete",protect,deleteUser)
router.get("/count",countUser)
router.get("/lastcount",lastCount)
router.get("/search",protect,searchUser)


// router.route('/login').get(authUser)

module.exports = router