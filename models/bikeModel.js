const mongoose = require("mongoose");

const bikeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required : true
    },
    type: {
      type: String,
      required : true,
      enum: ["sport", "scooter", "adventure", "moped"],
    },
    year: {
      type: Number,
      required : true
    },
    brand: {
      type: String,
      required : true
    },
    model: {
      type: String,
      required : true
    },
    makeId: {
      type: Number,
      required : true
    },
    rating:{
        type : Number,
        required : true
    },
    review:{
        type : String,
        required : true
    },
    pic:{
      type:String,
      default:"https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  },
  {
    timestamps: true,
  }
);

const Bike = mongoose.model("Bike",bikeSchema)

module.exports = Bike

