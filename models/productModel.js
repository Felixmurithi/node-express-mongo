import mongoose from 'mongoose';

//SCHEMA
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'each product must have a price '],
  },
  price: {
    type: Number,
    required: [true, 'each product must have a price '],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (discount) {
        return discount < this.price;
      },
      message: 'discount',
    },
  },
  brand: {
    type: String,
    required: [true, 'each product must include a brand '],
  },
  description: String,
  image: [String],
  stock: Number,
  //only 1 store
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
  },
  createdAt: {
    type: Date,
    default: Date.now(), //converted to todays date by moongoose
    select: false, //excluding fields from the query
  },
});

productSchema.index({ price: 1 });
//compound index
// productSchema.index({ price: 1, brand: 1 });
// index shoiuld not be sued for docs with higher write ratio because teh reading and writing consumeed by the index
//index has to be deleted from teh db manually

//enforcing a reference field to be unique
// productSchema.index({ _id: 1, store: 1 }, { unique: true });

///EMBEEDING TOUR GUIDES
// productSchema.pre('save', async function (next) {
//   const guidesPromises = this.store.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

productSchema.pre('save', function (next) {
  this.stock = Math.ceil(this.stock);
  next();
});

//this middleware points to the query object
//populate runs a query which might be more noticeably slower than direct doc query
//each field populate has to be written on itys own
// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'store',
//     select: '-__v',
//   });

//   next();
// });

//MODEL
const Product = mongoose.model('Product', productSchema);

export default Product;

//static method the theis key word ppoints to teh model. making it possible to agregate
