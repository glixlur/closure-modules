#!/usr/local/bin/node
Object.preventExtensions(Object.prototype);

require("ts-node").register({ transpileOnly: true });

module.exports = require("./scripts/index")
  .main(process.argv.slice(2))
  .catch(console.error);
