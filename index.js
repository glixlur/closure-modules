#!/usr/local/bin/node
Object.preventExtensions(Object.prototype);

require("ts-node").register({ transpileOnly: true });
module.exports = require("./src/index").main(process.argv.slice(2)).catch(console.error);
