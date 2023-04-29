const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const { cloudinaryUploadImg } = require("../utils/cloudinary");
const fs = require("fs");
const validateMongoDbId = require("../utils/validateMongodbid");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const createProduct = await Product.create(req.body);
    res.json(createProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getProduct = await Product.findById(id).populate("ratings.postedBy");
    res.json(getProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const checkUserBuyProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req?.user._id;
  validateMongoDbId(userId);

  try {
    const getProduct = await Order.findOne({
      "products.product": id,
      orderby: userId,
    });
    res.json(getProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Filtering
    // const queryObj = { ...req.query };
    console.log(req.query);
    const keyword = req.query.title
      ? {
          title: {
            $regex: req.query.title,
            $options: "i",
          },
        }
      : {};
    const products = await Product.find({ ...keyword });
    // loại trừ các trường hợp đặc biệt
    // const excludeFields = ["page", "sort", "limit", "fields"];
    // excludeFields.forEach((el) => delete queryObj[el]);

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    // let query = Product.find(JSON.parse(queryStr));

    // Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }

    // Limiting the fields
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // pagination (phân trang)
    // const { page } = req.query;
    // const limit = req.query.limit ? req.query.limit : 36;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // console.log(page, limit, skip);
    // if (req.query.page) {
    //   const productCount = await Product.countDocuments();
    //   if (skip >= productCount) throw new Error("This Page does not exists");
    // }
    // const products = await query;
    res.json(products);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongoDbId(_id);

  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = await user.wishlist.find(
      (id) => id.toString() === prodId.toString()
    );
    if (alreadyAdded) {
      const updateUser = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(updateUser);
    } else {
      const updateUser = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(updateUser);
    }
  } catch (error) {
    throw new Error(error);
  }
});
const rating = asyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongoDbId(_id);

  const { star, comment, prodId } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = await product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getAllRatings = await Product.findById(prodId);
    const totalRatings = getAllRatings.ratings.length;
    const ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    const actualRating = Math.round((ratingSum / totalRatings) * 10) / 10;
    const finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  addToWishList,
  rating,
  uploadImages,
  checkUserBuyProduct,
};
