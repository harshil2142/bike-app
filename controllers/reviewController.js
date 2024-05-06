const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const { paginatedArray } = require("../helper/pagination");

const getReviews = asyncHandler(async (req, res) => {
  try {
    const allReview = await Review.find().populate('userId','-password')
    
    res.status(200).json(allReview)
  } catch (error) {
    res.status(400).json(error.message);
    // throw new Error("Failed to load the reviews");
  }
});

const addReviews = asyncHandler(async (req, res) => {
  try {
    const { makeId, review, rating, userEmail,userId } = req.body;

    const isReview = await Review.findOne({ makeId, userEmail });
    if (isReview) {
      res.status(200).json({
        error : " You have already added your review in this bike , User allow to add only one review per bike"
      });
    } else {
      const reviewAdd = await Review.create({
        makeId,
        review,
        rating,
        userEmail,
        userId
      });
      if (reviewAdd) {
        
        res.status(201).json({
          status:"success",
          _id: reviewAdd._id,
          makeId: reviewAdd.makeId,
          review: reviewAdd.review,
          rating: reviewAdd.rating,
          userEmail: reviewAdd.userEmail,
          userId:reviewAdd.userId
        });
      } else {
        res.status(400);
        throw new Error("Failed to create the review");
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error("Review can not be added");
  }
});

const filterReviews = asyncHandler(async(req,res)=>{
try {
  const {makeId} = req.body
  if(makeId){
    const filterReview = await Review.find({makeId}).populate('userId','-password')
    if(filterReview){
      res.status(200).json(filterReview)
    }
  }
} catch (error) {
  res.status(400).json(error.message)
    
}
})

module.exports = { getReviews, addReviews,filterReviews };
