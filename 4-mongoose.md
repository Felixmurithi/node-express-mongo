Mongoose is an Object Data Modeling library which adds alot of features on top of mongoDB. Moongoose defines a model schema, a model, aggregation pipeline and hooks to handle new and updated documenets.

_The schema, model and objects are part of oop, the model, documents generated they are linked to schema object prototpe._

> Before using moongosse it has to be installed and connected.

# SCHEMA

Defines the fields and types which validate fields. mongoDB. Custom function, these functions will instances of the model.

1. **Field type**- declaration specifies the data type
   `Number`, `Date`, `Boolean`. Special fields data-types iclude array fields `allStaff: [String]`. Enum will only accepts specific string values `enum: ['all', 'food', 'groceries']`.

2. **Field type options** enforce validations by making fields unique, required, min and max for numbers & dates, minlength and maxlength for strings, trim to cut-oof any spacing, make field lowercase, default value and not selectable on queries. Errors message on validation fails are included in some field types options.

```js
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us ur name'],
    unique: [true, 'each name must be unique'],
  },
  email: {
    type: String,
    required: [true, 'please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  photo: {
    type: String,
  },
});
```

. Moongoose also converts dates into standard data strings. Fields values can be used in the error messages`message: 'Discount price {VALUE} is already registered'`.

3. **custom validator functions**- recieve the value of that field and needs to return a boolean that confirms validation success of fail which triggers the validation error

```js
passwordConfirm:
{type: String,required: [true, 'Please confirm ur password'],
select: false,
validate: {validator: function (el) { return el === this.password;},  message: 'passwords are no the same',} }
```

Validations libraries simplify the process of writing validation functions.

```js
email: {validate: [validator.isEmail, 'Please provide a valid email'],},
```

Validation message can be included for `enum` fields `enum: {values: ['all', 'food', 'groceries'], message: 'type is either all, food, groceries',}` .

## MODEL

The model performs crude operations documents. The model is created by passing the name and the schema`const Store = mongoose.model('Store', storeSchema);` points to the collection. The **name** of the collection is generated when creating the model, converted to lower case and pluralized(english). A documents is an instance of the model.

### saving new docs

Documents are saved using the `save()` and `create()` methods. Documents are only validated when using these two methods. The validators can be turned off by passing the option **Note** insertMany() native to mongoDB does not validate the documents. Only the fields in the schema can be saved and fields set to `undefined` are not saved.

1. Using `save()` create a document instance from the model `export const storeModel = new Store({name: 'mimi'}); save the document to the database

```js
storeModel
  .save()
  .then((db) => console.log(db))
  .catch((err) => console.log(err));
```

The method will store the document(s) in the collection and returns a promise which will resolve to the collection.

2. Using `create()` pass data directly to the model

```js
Store.create({ name: 'kiamumbi', manager: 'mary', rating: 4 });
```

### quering docs

To get all the documents in the collection

```js
const stores = await Store.find();
```

returns the docs in collection. Other query methods can be chained to before executing the query

```js
const storeQuery = Store.find().select("_id")sort("name" "-rating").
const stores = await storeQuery.find();
```

documents returned are instances of the model.

1. **Store.findById()**- moongoose abstracts over `Store.findOne({\_id: storeId}) to find a document with the specified Id,

2. **Store.findByIdAndUpdate()**- finds the document and updates it, the method receives an object as the third optional argument. The object can specify wether to run validators or returned the new saved document `Store.findByIdAndUpdate(storeId, req.body, {new: true,runValidators: true,});`.

### aggregation pipeline

schema fields cannot be used directly they must assigned a new field, the schema field can be used in the aggregation as an operator
`newname: '$name',` and assigned custom field to sort by

objects with diferent aggregation operators are passed into teh model aggregator

```js
const stores = await Store.aggregate([]);
```

. Arry fields can be used to duplicate documents using

```js
{
  $unwind: '$startDates';
}
```

Values can be filtered using

```js
{$match: {startDates: {
$gte: new Date(`${year}-01-01`), // mongo calculates date this way
$lte: new Date(`${year}-12-31`)}} }
```

The
group aggregator must start with the aggregator field `_id`. When set to `null` meaning that the grouping will not be done according to any field, setting to the schema `$id` will group each document idividually, set to a schema field will return a group that resembles a sort

```js
{
$group: {
_id: { $month: '$startDates' }, // gets the value of the month out of the dat uses it as group \_id
numTourStarts: { $sum: 1 },
tours: { $push: '$name' },
},
},
```

Other aggregation operators,

```js
{
$addFields: { month: '$_id' }, //adds an new aggregation field based on the a previously defined aggregate field
},
{
$project: { _id: 0 }, // remove an aggregate field
},
{
$sort: { numTourStarts: -1 },
},
{
$limit: 12, // get the first 12 results only
},
```

### query search params

express parses dynamic params and query params, all fields written after `?` are passed into the quey objects, fields and pages can be specified in the endpoint `?sort=-rating,type` parsed `{ sort: '-rating,type' }` , `?rating[lte]=3` parsed to `{ rating: { lte: '3' } }` and `?page=1&limit=10` parsed to `{ page: '1', limit: '10' }`. <br>
The parsed results have to be refined before being used to refined the model queryby chain them to the model query

```js
const stores = Store.find();
```

1. **mongo operators**- to use mongo operators the query object is copied and the `page', 'sort', 'limit', 'fields'` elements removed from the copy. The copy object is passed into a string and the `$` added to the rest of the query params and used to query documents
2. **field projection** The documents results can be limited to some fields `stores = stores.select("name" "rating");` the field vales are split and separated with empty space and passed into the query.
3. **sort** The documents results can be sorted `stores = stores.sort("name" "-rating");`. The first field will sort the whole document and the second will sort the groups retuned by the first.
4. **pagination**- The documents can be split into pages with a limit on the number of results per page. The start of each page will be determined by the page number and the limit of results per page. The skip value calcuted as `page-1 * limit`, with query params `?page=1&limit=10` translating to `1-1*10= 0`, the query `store.skip(0).limit(10)` result will be equal to 0 documents skipped, returning the first 10 docs. `?page=2&limit=10` will translate to `store.skip(10).limit(10)` returning the 11th doc to the 20th

## VIRTUALS

Fields that can be transformed do not need to be defined in the schema, they can be obtained virtually.

```js
storeSchema.virtual('area').get(function () {
  return this.location;
});
```

`'area'` is the name of the virtual field `get()` tells schema to add that field every time the documents are queried, the schema recieves a second object with options to allow virtuals

```js
{toJSON: { virtuals: true },
toObject: { virtuals: true }, },
```

## MIDDLEWARE

Moongosse middleware hooks make it possible to make changes to documents before the query returns all middleware gets acess to teh next function, if not invoked while using more than 1 middleware the doc procesing will be not be completed.

1. **save middleware** runs before .save(), .create() but not when insertMany() and saving using `findAndUpdate*` methods. The pre save hook gets acess to the doc(s) before saving, can be used to alter fields before saving to db. Changing the value of the field in the shema is okay because fields are only required and validated as input to the schema/or doc

```js
storeSchema.pre('save', function (next) {
  console.log(this);
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  this.passwordConfirm = undefined;
  next();
});
```

The post save hook gets acess to the saved document.

```js
storeSchema.post('save', function (doc, next) {
  console.log(this);
  console.log(doc);
  next();
});
```

2. **query middleware** runs on model queries. The pre query hook gets acess to the query object which can be enhanced to alter or remove some fields. The post query hook gets acess to the docs returned from the query.

```js
storeSchema.pre(/^find/, function (next) {
  this.find({ operational: { $ne: false } });
  this.queryTime = Date.now();
  next();
});

storeSchema.post(/^find/, function (docs, next) {
  next();
});
```

3. ** aggregation middleware**- will intercept the aggregation pipeline

```js
storeSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { operational: { $ne: true } } });
  next();
});
```

## CUSTOM METHODS

customs methods an be added to the schema, they get acess to the current values of the fields and copntribute to removing some data functionality from the controllers.

## AGGREGATING DOC AND SAVING RESULTS OF THE AGGREGATION IN THE MODEL

This aggregation can be done in a controller however to keep the controller thin, implementing this on the model is the ideal way.

There are several challenages associated with implementing this on the model. The save hooks point to the doc, on saving the saved doc is only available in the post "save" hook. The aggregate method is not available on the docs but on the model and when querying and updating a doc the pre "findOneAnd", The updated query doc will; not be avaialble in this step.

1. Craete statics method which `this` keyword points to the model where `this.aggregate` can be used.

```js
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
```

2. The aggregation method needs to be called on the saved doc in the post save hook and not pre save doc because that would not get access to the doc being saved. `this` points to the current document, the aggregation method defined on the model is accesed using the document constructor (document is an instance) of the model and the returned doc field can be passed.

```js
reviewSchema.post('save', function () {
  // in this hook
  this.constructor.calcAverageRatings(this.tour);
});
```

3. To update aggregate stats after finding by id and updating the doc, the aggregation method has to be called after updating howe, //findOne and because that is the absraection behind the scenes

In this middleware `this` points to the query, calling findone on the query retrieves the one doc being saved whose constructor can be used in the post middleware,. however in this hook the data has yet to be updated.

```js
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
```

the aggregator is called in the post "findoneand" middleware

```js
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
```

## DB RELATIONSHIPS WITH MONGOOSE

1. **Embededing documents**- array of documents.

```js
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
```

2.  **Referencing collections**- the `_id` of another model is stored in the other model, the field can include a single id or an array. _The referenced model does not have to be imported_

```js
 store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
  },
```

> > The referenced field can be retrieved

```js
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'store',
    select: '-__v',
  });

  next();
});
```

> > populate runs a query and retrives the data documents referenced with the ID. The extra query does add up to the amount of time it takes to retrive queries. Each refrenced field populate has to be written on its own populate and chained.

```js
///POPuLATE BTC
productSchema.pre('save', async function (next) {
  const guidesPromises = this.store.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
```

3. **Back-Referencing**- the refrenced field can retrieve the doc(s) which references it using moongoose `virtuals`. This will query for the doc(s) that refrence the ID.

```js
storeSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'store',
  localField: '_id',
});
```

> > with this set-up storing the arrays of the child products can be avoided to avoid infinite array growth.

## INDEXING, UNIQUE FIELDS COMBINATION

1. **Index**- for faster retrieval of docs, document indexes can be set. Unique fields are index by default. Ote

```js
productSchema.index({ price: 1 });
//compound index
productSchema.index({ price: 1, brand: 1 });
```

> > indexes should not be sued for docs with high write to reading ratio, noticeable resources including memory will consumed by the ever expanding index. Each index has to be deleted from teh db manually after being set. 2. Fields combination can be set to unique in a document using indexes.

```js
productSchema.index({ _id: 1, store: 1 }, { unique: true });
```

> > this is especilaly useful when two or more models are referenced.
