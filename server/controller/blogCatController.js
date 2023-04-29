const BlogCategory = require("../models/blogCatModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newBlogCategory = await BlogCategory.create(req.body);
    res.json({ newBlogCategory });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlogCategory = await BlogCategory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.json({ updateBlogCategory });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBlogCategory = await BlogCategory.findByIdAndDelete(id);
    res.json({ deleteBlogCategory });
  } catch (error) {
    throw new Error(error);
  }
});

const getBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBlogCategory = await BlogCategory.findById(id);
    res.json({ getBlogCategory });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogCategory = asyncHandler(async (req, res) => {
  try {
    const getAllBlogCategory = await BlogCategory.find();
    res.json({ getAllBlogCategory });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogCategory,
  getAllBlogCategory,
};
