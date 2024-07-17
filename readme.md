This project documents the back end development with node, express and mongoDb using moongoose ODM. Most of the documentation is based on the Jonas Schemmdtman node course. The project is broken down into a a node basics and a fully functional api. The code is explained extensively in **numbered markdown files**, to make it easiers to amalgamate the steps and concepts needed to put together the application, and follow patterns required to achieve a production ready app.

## SETUP

### installation

1. `npm install`
2. `npm install ndb -g`

### set up config.env

1. Set mongoDB connection string, either local or cloud(set passowrd), local is also connection was used by defualt
2. set 32+ random characters for `jwt`, set jwt expiry time.
3. signup for mailtrap and set the variables

### startup

1. start development enviroment server `npm start`.
2. start production enviroment server `npm run start:prod `.
3. debug using google's ndb debugger `npm run debugger`

## MVC project architecture

The model-viewer-controller project setup, separates the database models, the controller/ code used to setup the applications request and responses and the viewing templates . **Note** its almost impossible to separate the model and the controller. because they have to interact with each other to deal with the requests and responses. A fat model and thin application is encouraged to reduce the amount of aplication validation needed. The **Views** are not implemented in this project.

## MISCLEANOUS

### eslint - prettier setup

1. paste the .eslint.json config file <br>
2. install these packages `npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-jsx eslint-plugin-jsx-a11y eslint-plugin-react --save-dev`
3. `package.json` add `"engines": { "node": ">=20.0.0"}` or the preferred node version to stop linting errors

### bruno for testing,

https://dev.to/vikas1712/introduction-to-bruno-scripting-5a1n

test script to set the token to enviroment varaiables, this varaiables should not be set manually before using it

```js
let body = res.getBody();

bru.setEnvVar('jwt', body.token);
``;
```

### Rest API

Exposing
methods that returns values when invoked to the public creates an API.

The rest API defines a structure on how to implementing an API. The API needs to expose logical separated resources that can be accesed at urls endpoints. Endpoints only name the resource and HTTP methods describe the actions and the resources exposed by those actions. Resources and reponses should be well formatted. The resources should be stateless, the client should query based on their state but the state should not be stored on the database.

### jsend

j Jsend formats json object response, including a success or failure message and the data if any, in delete requests data is set to `null`.

### http codes

401-authorized
