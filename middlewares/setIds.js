exports.setStockCreatorIds = (req, res, next) => {
  if (!req.body.creator) req.body.creator = req.user.id;
  next();
};

// exports.setTourUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };
