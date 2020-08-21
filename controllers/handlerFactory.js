const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    // PRODUCTS ////////////////////////////////////
    // Filtered by search text & category
    if (req.query.name && req.params.categoryId) {
      filter = {
        name: { $regex: req.query.name, $options: 'i' },
        category: req.params.categoryId
      };
    }
    // Filtered by search text
    else if (req.query.name) {
      filter = { name: { $regex: req.query.name, $options: 'i' } };
    }
    // Filtered by category
    else if (req.params.categoryId)
      filter = { category: req.params.categoryId };
    // PRODUCT ////////////////////////////////////

    // POSTS ////////////////////////////////////
    // Filtered by search text & section
    if (req.query.title && req.params.sectionId) {
      filter = {
        title: { $regex: req.query.title, $options: 'i' },
        section: req.params.sectionId
      };
    }
    // Filtered by search text
    else if (req.query.title) {
      filter = { title: { $regex: req.query.title, $options: 'i' } };
    }
    // Filtered by section
    else if (req.params.sectionId) filter = { section: req.params.sectionId };
    // POSTS ////////////////////////////////////

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // TODO: render twice..
    // TODO: how to get total size of filtered items wisely?
    let total;
    // IF filter is not empty, fetch 'total' of filtered items
    if (Object.keys(filter).length !== 0 && filter.constructor === Object)
      total = await Model.find(filter).countDocuments();
    // IF filter is empty, fetch 'total' of all items
    else total = await Model.find().countDocuments();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      total: total, // total size of filterd items for 'paginator'
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
