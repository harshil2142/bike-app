const asyncHandler = require("express-async-handler");
const Bike = require("../models/bikeModel");
const { paginatedArray } = require("../helper/pagination");

const addBike = asyncHandler(async (req, res) => {
  try {
    const { name, type, year, brand, model, makeId, rating, review,pic } = req.body;

    const findBike = await Bike.findOne({ makeId: makeId });
    if (findBike) {
      res.json("Bike is already created");
    } else {
      const bikeAdd = await Bike.create({
        name,
        type,
        year,
        brand,
        model,
        makeId,
        rating,
        review,
        pic
      });

      if (bikeAdd) {
        res.status(201).json({
          _id: bikeAdd._id,
          name: bikeAdd.name,
          type: bikeAdd.type,
          year: bikeAdd.year,
          brand: bikeAdd.brand,
          model: bikeAdd.model,
          makeId: bikeAdd.makeId,
          rating: bikeAdd.rating,
          review: bikeAdd.review,
          pic:bikeAdd.pic
        });
      } else {
        res.status(400);
        throw new Error("Failed to create the bike");
      }
    }
  } catch (error) {
    res.json(error.message);
  }
});

const editBike = asyncHandler(async (req, res) => {
  try {
    const { name, type, year, brand, model, makeId, rating, review,pic } = req.body;

    const dataUpdate = {
      name,
      type,
      year,
      brand,
      model,
      rating,
      review,
      pic
    };
    const findBike = await Bike.findOne({ makeId: makeId });
    if (!findBike) {
      res.status(400).json("Bike is not found in database for given makeId");
    } else {
      const getBike = await Bike.findOneAndUpdate(
        { makeId: makeId },
        dataUpdate,
        { new: true }
      );
      res.status(201).json(getBike);
    }
  } catch (error) {
    res.status(400);
    throw new Error("Failed to update the bike details");
  }
});

const deleteBike = asyncHandler(async (req, res) => {
  try {
    const { makeId } = req.params;
    
    const findBike = await Bike.findOne({ makeId: makeId });
    
    if (!findBike) {
      res.status(401).json("bike is not in database");
    } else {
      await Bike.deleteOne({ makeId: makeId });
      const allBikes = await Bike.find()
      res.status(201).json({
        message : "your bike is deleted",
        data : allBikes
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error("Failed to delete the bike details");
  }
});

const fetchBike = asyncHandler(async (req, res) => {
  try {
    const { size, page } = req.query;
    const bike = await Bike.find().sort({ name: 1 });
    const result = paginatedArray(bike, size, page);
    // console.log(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(400);
    throw new Error("Failed to find the bike details");
  }
});
const searchBike = asyncHandler(async (req, res) => {
  try {
    const { makeId } = req.body
    if (makeId) {
      const bikes = await Bike.findOne({ makeId });
      res.send(bikes);
    } else {
      const keyword = req.query.search
        ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
          ],
        }
        : {};
      const bikes = await Bike.find(keyword);
      res.send(bikes);
    }

  } catch (error) {
    res.status(400);
    throw new Error("Failed to find the bike details");
  }
});

const filterBike = asyncHandler(async (req, res) => {
  try {
    const { brand, bodyType } = req.body
    const bikes = await Bike.find();

    if (brand) {
      const result = bikes.filter((i) => brand.toLowerCase() === (i.brand).toLowerCase())
      if(result.length>0){
        res.status(201).json(result)
      }else{
        res.status(401).json("No Data Found")
      }

    } else if (bodyType) {
      const result = bikes.filter((i) => bodyType.toLowerCase() === (i.type).toLowerCase())
      if(result.length>0){
        res.status(201).json(result)
      }else{
        res.status(401).json("No Data Found")
      }
    } else {
      res.status(201).json(bikes)
    }
  } catch (error) {
    res.status(400);
    throw new Error("Failed to filter the bike details");
  }
})

module.exports = { addBike, editBike, deleteBike, fetchBike, searchBike, filterBike };
