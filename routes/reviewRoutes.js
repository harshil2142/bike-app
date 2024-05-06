const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { getReviews, addReviews, filterReviews } = require("../controllers/reviewController");


const router = express.Router()

router.get("/get",getReviews)
router.post('/add',protect,addReviews)
router.post('/filter',filterReviews)



// router.route('/login').get(authUser)

module.exports = router