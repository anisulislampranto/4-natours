const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour Must Have A Name'],
      unique: true,
      maxlength: [40, 'A Tour Must Have Less or Equal then 40 characters'],
      minlength: [10, 'A Tour Must Have More or Equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour Name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 1.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour Must Have A Price'],
    },
    priceDicount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW Document Creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) Should be below regular price',
      },
    },
    summary: {
      type: String,
      // to remove white space from start and end - "  hello  "
      trim: true,
      required: [true, 'Tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have a cover image'],
    },
    // as we have multiple images so well save it as array
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startLocation: {
      // GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  // when we have a virtual property // a feild that is not stored in the database but calculated
  //  using some other values so we want want this to also show up whenever there is an output
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// setting single feild index
// tourSchema.index({ price: 1 });
// compound index
tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// document middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// this code is responsible for performing embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('will save doc');
//   next();
// });

// // // runs after .save() and .create()
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// query middleware: runs before/ after query
// tourSchema.pre('find', function (next)
// by using regEx we can use one middleware to specify all the qe
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query Took ${Date.now() - this.start} miliseconds!`);
  console.log(doc);
  next();
});

// findOne
// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// aggregation middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline);
//   next();
// });

tourSchema.pre('aggregate', function (next) {
  // Hide secret tours if geoNear is NOT used
  if (!(this.pipeline().length > 0 && '$geoNear' in this.pipeline()[0])) {
    this.pipeline().unshift({
      $match: { secretTour: { $ne: true } },
    });
  }
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
