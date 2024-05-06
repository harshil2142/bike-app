const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    makeId: {
      type: Number,
    },
    review: {
      type: String,
    },
    rating: {
      type: Number,
    },
    userEmail: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
