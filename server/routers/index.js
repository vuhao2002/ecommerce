const authRouter = require("./authRoute");
const productRouter = require("./productRoute");
const blogRouter = require("./blogRoute");
const categoryRouter = require("./prodCategoryRoute");
const blogCategoryRouter = require("./blogCatRoute");
const brandRouter = require("./brandRoute");
const couponRouter = require("./couponRoute");
const uploadRouter = require("./uploadRoute");

function route(app) {
  app.use("/api/user", authRouter);
  app.use("/api/product", productRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/blogcategory", blogCategoryRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/coupon", couponRouter);
  app.use("/api/upload", uploadRouter);
}

module.exports = route;
