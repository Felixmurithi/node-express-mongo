// console.log(arguments);
// console.log(require("module").wrapper);\

// the common js modlues sytem implement modules importaion using the require function which is available in the node js runtime. custom modules strat with ./ or ../ . Require will first check if the name required is a core module (part of node), if not check if its a custom file, if not check if its a folder and load index.js under that folder, fnally check its part of the downloaded nodemodules, if not found there will be a nb errror

// require wraps each module code in a function (function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here});

// this ensures that the model top level declarations are sepaated  from the global files and provides very usefui arguments such as exports, module refrence to module, require,  __filename, __dirname- which is the directory/folder of where the file is located

// the default export is assigned module.exports and named exports asiigned exports

const Calculator = require("./test-module-1");

const calculator1 = new Calculator();

console.log(calculator1.add(4, 6));

//exports
// const calculator2 = require("./test-module-2");

const { multiply } = require("./test-module-2");
// console.log(calculator2.multiply(2, 3));
console.log(multiply(2, 3));

//caching
// modules are only executed once and cached
// invoking the module again only returns the functions part
// To avoid this behavior, you can use the delete require.cache[moduleName]
//  statement to delete the cached version of the module before invoking
//  it again 2. This will force Node.js to reload the module from disk
//   and return the entire module 2
////example
// delete require.cache[require.resolve('./myModule')];
// const myModule = require('./myModule');

require("./test-module-3")();
require("./test-module-3");
require("./test-module-3")();
// the module code is indeeed wrapped in a function which can be invoked directly, the top level code is cached, only the export gets regenetrated

// FILE NAMES
// in a file ("./") refers to the directory where node is running from. in the require function it means the current directory.
