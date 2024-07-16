# mongo

mongo is document based perfortmant, scalable, flexible.
data store in document collection, each document with unique IDs and capable or storing mutiple data formats using the bson-typed json
format.
max size 16 mb
documents can be embedded in other documents.
mongo is nore relational

## installing.

install mongo -version 7.00
download commu nity version mongo and install, find location in program files as `C:\Program Files\MongoDB\Server\7.0\bin\` to system varaiablles path to use mmongo in any diretory.
check mongo version to confirm if path was added using `mongod.exe --version`
to start mongo enter `mongod.exe`
dont the powershell window but dont end the process

install mongo shelll
download shell. extract shell and install
enter `mongosh.exe` in another power shell
enter `help` to see list of helpful commands.

install mongo compass for GUI database access.

## startup

1. Start as a service `net start MongoDB`.
2. Start the shell `mongosh.exe`.
3. to atop shell
4. To stop the service when required `net start MongoDB`.

## database

1. show all the current database`show dbs`
2. Create or switch to an existing databsdse `use natours-test` `natour-test db`.
3. show the collection in a db `show collections`.
4. with mongo data is brecords are inserted or referenced as functions which are converted into bson,
5. to insert once document into the tours collection `db.tours.insertOne({name: "The Forest Hiker", price:297, rating: 4.7})`

6. insert more than one document into the two tours to tours`db.tours.insertMany([{name: "The Sea Explorer", price: 497, rating :4.8},{name: "The Snow Adventurer", price:997, rating: 4.9, difficulty: "easy"}])`

7. show all documents in a collection ` db.tours.find()` find the data in the `tours`
8. to find all records with that property value pair pass an object taht represenst that record `db.tours.find({difficulty:"easy"})`
9. less than or equal to `db.tours.find({price:{$lte:500}}` `$` represents a mongoDb keyword word.
10. `and` query `db.tours.find({price:{$lte:500},rating:{$gte:4.8}})`
11. `or` query combination. `db.tours.find( { $or: [ {price:{$lte:500}}, {rating:{$gte:4.8}} ] } )`

12. To only return a specific record from the query us`db.tours.find({ $or: [{ price: { $lt: 500 } }, { rating: { $gte: 4.8 } }] }, { name: 1 })`
13. create a new record or update one document record that matches that condition, if more than one record meets teh criteria only teh first one is updated`db.tours.updateMany({price:{$gt:500},rating:{$gte:4.8}}, { $set: {premium:true} } )`.
14. create a new record or update the document records that match the condition`db.tours.updateMany({price:{$gt:500}, rating:{$gte:4.8}}, { $set: {premium:true} } )`.

15. replace a record that matches that condition, if more than one record meets the criteria only teh first oen will be replaced `db.tours.replaceOne({price:{$gt:500},rating:{$gte:4.8}}, { $set: {premium:true} } )`
16. replace records that matches that condition

```
db.tours.replaceMany({price:{$gt:500},rating:{$gte:4.8}}, { $set: {premium:true} } )
```

17. replace a record that matches that condition, if more than one record meets the criteria only teh first oen will be deleted `db.tours.deleteOne( {rating: {$lt: 4.8} } )`
18. replace a record that matches that condition, if more than one record meets the criteria only teh first oen will be deleted `db.tours.deleteMany( {rating: {$lt: 4.8} } )`
19. delete the db and its collections `db.tours.deleteMany( {}  )`
20. aggregation

## Mongo DB atlas

1. create a free cluster on after singing up mongodb atlas.
2. edit the database access to change users and password or the network access to whitewlist ip adresses and make the cluster accesible from anywhere.
3. craete different connections using to the db(node, shell, compass).
4. the name of the collection to be used is added to the connection string.

## DATA MODELLING

The relationship between different data documents can be summarised into
`one to one`, `one to few`, `one to many`, `one to ton`, `many to many`, `many to a ton`. Thinking of this relationship is important in conceptualising how to model the database.

The are two main ways of referencing documents collections, onbe involves emebedding the id of child collections in the parent collection this is similar the practice of normalization in sql databases. The otehr type involves embedding the data that is supposed to be an individaul collection in another collection, efefctively denormalizing the data. Normalized data is especilly important when data needs to be quereied separately and updated alot.Updating each query individually is much less expensive than doing so for a denormaslied one. De normalized is especially important when data is closely related, few records kept and usually read and not updated.

Refeencing ids can be further broken down to child ids embedding, parent id emebedding and both ways. child embedding should only be used for `1 to few` . Parent id refrrencing used tor `1 to many`, `1 to ton` and both way emmebding sued for `many to many`. Importnat to node refrencing many child ids because that array might be too big

## STORE, USER , PRODUCT-Template, Store products, MODEL

normal uses not related to any store or products, general admin parent of all stores and store admin -one to one with store, each store has a one to to with store products. The products template has no direct relationship with the store proucts but used queried to generate their templates, store products adds other definitions includ

## GROM SPATatial data

radius= distance / erath radius in units of distance

query with {location: $geoWithin : {$centerSphere: [[lng. lat], radians]}}

index field set to type of query needed
storeSchema.index({location: "2dsphere })

aggregation- needs to be the first within the pipleine, geo fields with index and teh used field indiacetd with keys- resulots in meters
