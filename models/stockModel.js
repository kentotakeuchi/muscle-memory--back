const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    if: {
      type: String,
      required: [true, 'Stock must have a if'],
      unique: true,
      trim: true,
      maxlength: [5000, 'If must have less or equal than 5000 characters']
      // validate: [validator.isAlpha, 'post title must only contain characters']
    },
    then: {
      type: String,
      required: [true, 'Stock must have a then'],
      unique: true,
      trim: true,
      maxlength: [5000, 'Then must have less or equal than 5000 characters']
    },
    color: {
      type: String,
      required: [true, 'Stock must have a color']
    },
    createdAt: {
      type: Date,
      default: Date.now
      // select: false
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Stock must belong to an user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// QUERY MIDDLEWARE
// TODO: adjust later..
stockSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'creator',
    select:
      '-__v -createdAt -updatedAt -firstName -lastName -email -passwordChangedAt'
  });

  next();
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
