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

productSchema.index({ _id: 1, store: 1 }, { unique: true });

productSchema.pre('save', function (next) {
  this.stock = Math.ceil(this.stock);
  next();
});

//MODEL
const Product = mongoose.model('Product', productSchema);

export default Product;
