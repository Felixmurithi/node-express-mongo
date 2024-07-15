Mongoose is an Object Data Modeling library which adds alot of features on top of mongoDB. Moongoose defines a model schema, a model, aggregation pipeline and hooks to handle newly saved documents before they are saved, get acess to the saved document, receive queries before they are executed, get acess to the documents resulting from queries and receive the operators used in aggregation pipelines.

_The schema, model and objects are part of oop, the model, documents generated they are linked to schema object prototpe._

> Before using moongosse it has to be installed and connected.

# SCHEMA

Defines the fields and types which validate fields. mongoDB. Custom function, these functions will instances of the model.

1. **Field type**- declaration specifies the data type
   ``Number`, `Date`, `Boolean`. Special fields data-types iclude array fields `allStaff: [String]``

. Enum will only accepts specific string values `enum: ['all', 'food', 'groceries']`.

2. **Field type options** enforce validations by making fields unique, required, min and max for numbers & dates, minlength and maxlength for strings, trim to cut-oof any spacing, make field lowercase, default value and not selectable on queries. Errors message on validation fails are included in some field types options.

```
email: {type: String,
required: [true, 'please provide an email'],
 unique: true,
 trim: true,
 lowercase: true,}
```

. Moongoose also converts dates into standard data strings. Fields values can be used in the error messages`message: 'Discount price {VALUE} is already registered'`.

3. **custom validator functions**- recieve the value of that field and needs to return a boolean that confirms validation success of fail which triggers the validation error `passwordConfirm: {type: String,required: [true, 'Please confirm ur password'],select: false,validate: {validator: function (el) { return el === this.password;},  message: 'passwords are no the same',} }`. Validations libraries simplify the process of writing validation functions `email: {validate: [validator.isEmail, 'Please provide a valid email'],},`. Validation message can be included for `enum` fields `enum: {values: ['all', 'food', 'groceries'], message: 'type is either all, food, groceries',}` .

## MODEL

The model performs crude operations documents. The model is created by passing the name and the schema`const Store = mongoose.model('Store', storeSchema);` points to the collection. The **name** of the collection is generated when creating the model, converted to lower case and pluralized(english). A documents is an instance of the model.

### saving new docs

Documents are saved using the `save()` and `create()` methods. Documents are only validated when using these two methods. The validators can be turned off by passing the option **Note** insertMany() native to mongoDB does not validate the documents. Only the fields in the schema can be saved and fields set to `undefined` are not saved.

1. Using `save()` create a document instance from the model `export const storeModel = new Store({name: 'mimi'}); save the document to the database `storeModel.save().then((db) => console.log(db)).catch((err) => console.log(err));`. The method will store the document(s) in the collection and returns a promise which will resolve to the collection.

2. Using `create()` pass data directly to the model `Store.create({name: 'kiamumbi',manager: 'mary',rating: 4,});`.

### quering docs

The model query using `.find()` returns the docs in collection. B Query methods linked to the model prototypes and can be chained to the documents returned(instances) to refine the query.

1. **Store.findById()**- moongoose abstracts over `Store.findOne({\_id: storeId}) to find a document with the specified Id,

2. **Store.findByIdAndUpdate()**- finds the document and updates it, the method receives an object as the third optional argument. The object can specify wether to run validators or returned the new saved document `Store.findByIdAndUpdate(storeId, req.body, {new: true,runValidators: true,});`.

### aggregation pipeline

schema fields cannot be used directly they must assigned a new field, the schema field can be used in the aggregation as an operator
`name: '$name',`. The schema fields cannot be returned directly as is, they must be used in an aggregation.
sorts needs a custom field to sort by

objects with diferent aggregation operators are passed into `model.aggregate([])`. Arry fields can be used to duplicate documents using

`{$unwind: '$startDates'}`

Values can be filtered using

```
{$match: {startDates: {
$gte: new Date(`${year}-01-01`), // mongo calculates date this way
$lte: new Date(`${year}-12-31`)}} }
```

The
group aggregator must start with the aggregator field `_id`. When set to `null` meaning that the grouping will not be done according to any field, setting to the schema `$id` will group each document idividually, set to a schema field will return a group that resembles a sort

```
{
$group: {
_id: { $month: '$startDates' }, // gets the value of the month out of the dat uses it as group \_id
numTourStarts: { $sum: 1 },
tours: { $push: '$name' },
},
},
```

Other aggregation operators,

```
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
The parsed results have to be refined before being used in the model query.

1. **mongo operators**- to use mongo operators the query object is copied and the `page', 'sort', 'limit', 'fields'` elements removed from the copy. The copy object is passed into a string and the `$` added to the rest of the query params and used to query documents
2. **field projection** The documents results can be limited to some fields `stores = stores.select("name" "rating");` the field vales are split and separated with empty space and passed into the query.
3. **sort** The documents results can be sorted `stores = stores.sort("name" "-rating");`. The first field will sort the whole document and the second will sort the groups retuned by the first.
4. **pagination**- The documents can be split into pages with a limit on the number of results per page. The start of each page will be determined by the page number and the limit of results per page. The skip value calcuted as `page-1 * limit`, with query params `?page=1&limit=10` translating to `1-1*10= 0`, the query `store.skip(0).limit(10)` result will be equal to 0 documents skipped, returning the first 10 docs. `?page=2&limit=10` will translate to `store.skip(10).limit(10)` returning the 11th doc to the 20th

## VIRTUALS

Fields that can be transformed do not need to be defined in the schema, they can be obtained virtually.

```
storeSchema.virtual('area').get(function () {
return this.location;})
```

`'area'` is the name of the virtual field `get()` tells schema to add that field every time the documents are queried, the schema recieves a second object with options to allow virtuals

```
{toJSON: { virtuals: true },
toObject: { virtuals: true }, },
```

## MIDDLEWARE

Moongosse middleware hooks make it possible to make changes to documents before the query returns all middleware gets acess to teh next function, if not invoked while using more than 1 middleware the doc procesing will be not be completed.

1. **save middleware** runs before .save(), .create() but not when insertMany() and saving using `findAndUpdate*` methods.

```
storeSchema.pre('save', function ( next) {console.log(this);
next()});
```

gets acess to the doc(s) before saving. `storeSchema.post('save', function (doc, next) {console.log(this); console.log(doc); next();});` gets access to the saved document. The `pre` hook can be used to later fields before saving `userSchema.pre('save', async function (next) {if (!this.isModified('password')) return next(); this.password = await bcrypt.hash(this.password, 8); this.passwordConfirm = undefined;
next();
});`. Changing the value of the field in the shema is okay because fields are only required and validated as input to the schema/or doc.

2. **query middleware** runs on model queries. `storeSchema.pre(/^find/, function (next) {this.find({ operational: { $ne: false } });
this.queryTime = Date.now(); next(); });` will get acess to the query object which can be enhanced to alter or remove some fields.
   `storeSchema.post(/^find/, function (docs, next) {next();});` gets acess to the docs returned from the query.
3. ** aggregation middleware**- `storeSchema.pre('aggregate', function (next) {this.pipeline().unshift({ $match: { operational: { $ne: true } } }); next(); });` will intercept the aggregation pipeline

## CUSTOM METHODS

customs methods an be added to the schema, they get acess to the current values of the fields and copntribute to removing some data functionality from the controllers.
