const validateMongoID = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id.toString())) {
    throw new Error("Invalid ID!");
  }
};

module.exports = {
  validateMongoID,
};
