const Stock = require('../models/stockModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const suffleArray = require('../utils/suffleArray');

exports.getAllStock = factory.getAll(Stock);
exports.getStock = factory.getOne(Stock);
exports.createStock = factory.createOne(Stock);
exports.updateStock = factory.updateOne(Stock);
exports.deleteStock = factory.deleteOne(Stock);

// TODO: improve time complexity
// https://stackoverflow.com/questions/24806721/mongodb-how-to-find-10-random-document-in-a-collection-of-100 --> might be helpful
exports.getRandomMultipleStock = catchAsync(async (req, res, next) => {
  // Get an ID of the current user
  const userId = req.user._id;

  // Get all stocks of the current user
  const userStocks = await Stock.find({ creator: { $in: userId } }).select(
    '-createdAt -__v'
  );

  // Shuffle the all stocks at random
  const randomStocks = suffleArray(userStocks);

  if (!randomStocks) {
    return next(new AppError('No random stocks found with that user ID', 404));
  }

  // Get 12 stocks out of the shuffled stocks
  const slicedStocks = randomStocks.slice(0, 12);

  res.status(200).json({
    status: 'success',
    data: slicedStocks,
    total: slicedStocks.length
  });
});
