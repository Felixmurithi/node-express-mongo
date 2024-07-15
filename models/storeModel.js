import mongoose from 'mongoose';
import validator from 'validator';

//SCHEMA
const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'each store must have a name'],
      unique: true,
    },
    manager: {
      type: String,
      required: [true, 'each store must have a name'],
      trim: true,
    },

    type: {
      type: String,
      enum: {
        values: ['all', 'food', 'groceries'], // only for strings
        message: 'type is either all, food, groceries',
      },
    },
    rating: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be above 1 or higher'], //works for dates too, minLength for strings,
      max: [5, 'Rating must be above 5 or lower'],
    },

    createdAt: {
      type: Date,
      default: Date.now(), //converted to todays date by moongoose
      select: false, //excluding fields from the query
    },
    operational: {
      type: Boolean,
      default: true,
    },
    location: String,
    /// emebdiing many fields i  anotehr field, more than types has to be put in object
    locationCoordinates: [
      {
        //GeoJson {
        //type field set to Point and coordinates property defined
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        adress: String,
      },
    ],
    imageCover: String,
    staff: [
      {
        name: {
          type: String,
          required: [true, 'each staff member must have a name'],
        },
      },
      {
        role: {
          type: String,
          required: [true, 'each staff member must have a role'],
        },
      },
      {
        hours: {
          type: String,
          required: [true, 'each staff member must have work hours'],
        },
      },
      {
        startDate: {
          type: [Number],
          required: [true, "each staff member's start date must be indicated "],
        },
      },
      {
        endDate: {
          type: Date,
        },
      },
      {
        active: {
          type: Boolean,
          required: [true, 'each staff member work status must be provide'],
        },
      },
    ], //array of strings
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//VIRTUALS
storeSchema.virtual('area').get(function () {
  return this.location;
});

//QUERY MIDDLEWARE
//runs when there query object is craeted by the model
storeSchema.pre(/^find/, function (next) {
  this.find({ operational: { $ne: false } });
  this.start = Date.now();
  next();
});

// gets acess to the docs returned from the query
storeSchema.post(/^find/, function (docs, next) {
  this.find({ operational: { $ne: false } });
  // console.log(docs);
  this.start = Date.now();
  next();
});

// AGGREGATION MIDDLEWARE
storeSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { operational: { $ne: true } } });
  next();
});

//MODEL
const Store = mongoose.model('Store', storeSchema);

export default Store;
