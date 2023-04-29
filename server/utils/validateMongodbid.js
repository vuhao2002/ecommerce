const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
  isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("This id is not a valid or not found");
};

module.exports = validateMongoDbId;
