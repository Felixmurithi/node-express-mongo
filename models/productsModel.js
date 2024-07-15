import mongoose from 'mongoose';
import validator from 'validator';

//SCHEMA
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'each product must have a price '],
    unique: [true],
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
    image: [String],
    description: String,
  },
  image: [String],
  stock: Number,

  /// emebdiing a single doc
});

///EMBEEDING TOUR GUIDES
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

productSchema.pre('save', function (next) {
  this.price = Math.ceil(this.price);
  this.priceDiscount = Math.ceil(this.priceDiscount);
  this.stock = Math.ceil(this.stock);
  next();
});
//MODEL
const Product = mongoose.model('Product', productSchema);

export default Product;
