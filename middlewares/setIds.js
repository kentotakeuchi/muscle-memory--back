exports.setStockCreatorIds = (req, res, next) => {
  if (!req.body.creator) req.body.creator = req.user.id;
  next();
};
