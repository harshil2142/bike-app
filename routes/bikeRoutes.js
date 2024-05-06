const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { addBike, editBike, deleteBike, fetchBike, searchBike, filterBike } = require("../controllers/bikeController");

const router = express.Router()

router.post("/add",protect,addBike)
router.put("/edit",protect,editBike)
router.delete("/delete/:makeId",protect,deleteBike)
router.get("/",fetchBike)
router.post("/search",searchBike)
router.post("/filter",filterBike)


// router.route('/login').get(authUser)

module.exports = router