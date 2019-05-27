'use strict';

// Copyright 2006 The Closure Library Authors. All Rights Reserved.
/**
 * Base namespace for the Closure library.  Checks to see goog is already
 * defined in the current scope before assigning to prevent clobbering if
 * base.js is loaded more than once.
 *
 * @const
 */

var goog = goog || {};
/**
 * Reference to the global object.
 * https://www.ecma-international.org/ecma-262/9.0/index.html#sec-global-object
 *
 * More info on this implementation here:
 * https://docs.google.com/document/d/1NAeW4Wk7I7FV0Y2tcUFvQdGMc89k2vdgSXInw8_nvCI/edit
 *
 * @const
 * @suppress {undefinedVars} self won't be referenced unless `this` is falsy.
 * @type {!Global}
 */

goog.global = // Check `this` first for backwards compatibility.
// Valid unless running as an ES module or in a function wrapper called
//   without setting `this` properly.
// Note that base.js can't usefully be imported as an ES module, but it may
// be compiled into bundles that are loadable as ES modules.
// this ||
// https://developer.mozilla.org/en-US/docs/Web/API/Window/self
// For in-page browser environments and workers.
self;
/**
 * A hook for overriding the define values in uncompiled mode.
 *
 * In uncompiled mode, `CLOSURE_UNCOMPILED_DEFINES` may be defined before
 * loading base.js.  If a key is defined in `CLOSURE_UNCOMPILED_DEFINES`,
 * `goog.define` will use the value instead of the default value.  This
 * allows flags to be overwritten without compilation (this is normally
 * accomplished with the compiler's "define" flag).
 *
 * Example:
 * <pre>
 *   var CLOSURE_UNCOMPILED_DEFINES = {'goog.DEBUG': false};
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */

goog.global.CLOSURE_UNCOMPILED_DEFINES;
/**
 * A hook for overriding the define values in uncompiled or compiled mode,
 * like CLOSURE_UNCOMPILED_DEFINES but effective in compiled code.  In
 * uncompiled code CLOSURE_UNCOMPILED_DEFINES takes precedence.
 *
 * Also unlike CLOSURE_UNCOMPILED_DEFINES the values must be number, boolean or
 * string literals or the compiler will emit an error.
 *
 * While any @define value may be set, only those set with goog.define will be
 * effective for uncompiled code.
 *
 * Example:
 * <pre>
 *   var CLOSURE_DEFINES = {'goog.DEBUG': false} ;
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */

goog.global.CLOSURE_DEFINES;
/**
 * Returns true if the specified value is not undefined.
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */

goog.isDef = function (val) {
  // void 0 always evaluates to undefined and hence we do not need to depend on
  // the definition of the global variable named 'undefined'.
  return val !== void 0;
};
/**
 * Returns true if the specified value is a string.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */


goog.isString = function (val) {
  return typeof val == 'string';
};
/**
 * Returns true if the specified value is a boolean.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */


goog.isBoolean = function (val) {
  return typeof val == 'boolean';
};
/**
 * Returns true if the specified value is a number.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */


goog.isNumber = function (val) {
  return typeof val == 'number';
};
/**
 * Builds an object structure for the provided namespace path, ensuring that
 * names that already exist are not overwritten. For example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by goog.provide and goog.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is `goog.global`.
 * @private
 */


goog.exportPath_ = function (name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global; // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.

  if (!(parts[0] in cur) && typeof cur.execScript != 'undefined') {
    cur.execScript('var ' + parts[0]);
  }

  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part] && cur[part] !== Object.prototype[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};
/**
 * Defines a named value. In uncompiled mode, the value is retrieved from
 * CLOSURE_DEFINES or CLOSURE_UNCOMPILED_DEFINES if the object is defined and
 * has the property specified, and otherwise used the defined defaultValue.
 * When compiled the default can be overridden using the compiler options or the
 * value set in the CLOSURE_DEFINES object. Returns the defined value so that it
 * can be used safely in modules. Note that the value type MUST be either
 * boolean, number, or string.
 *
 * @param {string} name The distinguished name to provide.
 * @param {T} defaultValue
 * @return {T} The defined value.
 * @template T
 */


goog.define = function (name, defaultValue) {
  var value = defaultValue;
  return value;
};
/**
 * @define {number} Integer year indicating the set of browser features that are
 * guaranteed to be present.  This is defined to include exactly features that
 * work correctly on all "modern" browsers that are stable on January 1 of the
 * specified year.  For example,
 * ```js
 * if (goog.FEATURESET_YEAR >= 2019) {
 *   // use APIs known to be available on all major stable browsers Jan 1, 2019
 * } else {
 *   // polyfill for older browsers
 * }
 * ```
 * This is intended to be the primary define for removing
 * unnecessary browser compatibility code (such as ponyfills and workarounds),
 * and should inform the default value for most other defines:
 * ```js
 * const ASSUME_NATIVE_PROMISE =
 *     goog.define('ASSUME_NATIVE_PROMISE', goog.FEATURESET_YEAR >= 2016);
 * ```
 *
 * The default assumption is that IE9 is the lowest supported browser, which was
 * first available Jan 1, 2012.
 *
 * TODO(user): Reference more thorough documentation when it's available.
 */


goog.FEATURESET_YEAR = goog.define('goog.FEATURESET_YEAR', 2012);
/**
 * @define {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production. It can be easily stripped
 * by specifying --define goog.DEBUG=false to the Closure Compiler aka
 * JSCompiler. For example, most toString() methods should be declared inside an
 * "if (goog.DEBUG)" conditional because they are generally used for debugging
 * purposes and it is difficult for the JSCompiler to statically determine
 * whether they are used.
 */

goog.DEBUG = goog.define('goog.DEBUG', true);
/**
 * @define {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define goog.LOCALE=<locale_name>" as a compiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he).
 *
 */

goog.LOCALE = goog.define('goog.LOCALE', 'en'); // default to en

/**
 * @define {boolean} Whether this code is running on trusted sites.
 *
 * On untrusted sites, several native functions can be defined or overridden by
 * external libraries like Prototype, Datejs, and JQuery and setting this flag
 * to false forces closure to use its own implementations when possible.
 *
 * If your JavaScript can be loaded by a third party site and you are wary about
 * relying on non-standard implementations, specify
 * "--define goog.TRUSTED_SITE=false" to the compiler.
 */

goog.TRUSTED_SITE = goog.define('goog.TRUSTED_SITE', true);
/**
 * @define {boolean} Whether a project is expected to be running in strict mode.
 *
 * This define can be used to trigger alternate implementations compatible with
 * running in EcmaScript Strict mode or warn about unavailable functionality.
 * @see https://goo.gl/PudQ4y
 *
 */

goog.STRICT_MODE_COMPATIBLE = goog.define('goog.STRICT_MODE_COMPATIBLE', false);
/**
 * @define {boolean} Whether code that calls {@link goog.setTestOnly} should
 *     be disallowed in the compilation unit.
 */

goog.DISALLOW_TEST_ONLY_CODE = goog.define('goog.DISALLOW_TEST_ONLY_CODE', !goog.DEBUG);
/**
 * @define {boolean} Whether to use a Chrome app CSP-compliant method for
 *     loading scripts via goog.require. @see appendScriptSrcNode_.
 */

goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = goog.define('goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING', false);
/**
 * Defines a namespace in Closure.
 *
 * A namespace may only be defined once in a codebase. It may be defined using
 * goog.provide() or goog.module().
 *
 * The presence of one or more goog.provide() calls in a file indicates
 * that the file defines the given objects/namespaces.
 * Provided symbols must not be null or undefined.
 *
 * In addition, goog.provide() creates the object stubs for a namespace
 * (for example, goog.provide("goog.foo.bar") will create the object
 * goog.foo.bar if it does not already exist).
 *
 * Build tools also scan for provide/require/module statements
 * to discern dependencies, build dependency files (see deps.js), etc.
 *
 * @see goog.require
 * @see goog.module
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 */

goog.provide = function (name) {
  if (goog.isInModuleLoader_()) {
    throw new Error('goog.provide cannot be used within a module.');
  }

  goog.constructNamespace_(name);
};
/**
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 * @param {Object=} opt_obj The object to embed in the namespace.
 * @private
 */


goog.constructNamespace_ = function (name, opt_obj) {
  goog.exportPath_(name, opt_obj);
};
/**
 * Returns CSP nonce, if set for any script tag.
 * @param {?Window=} opt_window The window context used to retrieve the nonce.
 *     Defaults to global context.
 * @return {string} CSP nonce or empty string if no nonce is present.
 */


goog.getScriptNonce = function (opt_window) {
  if (opt_window && opt_window != goog.global) {
    return goog.getScriptNonce_(opt_window.document);
  }

  if (goog.cspNonce_ === null) {
    goog.cspNonce_ = goog.getScriptNonce_(goog.global.document);
  }

  return goog.cspNonce_;
};
/**
 * According to the CSP3 spec a nonce must be a valid base64 string.
 * @see https://www.w3.org/TR/CSP3/#grammardef-base64-value
 * @private @const
 */


goog.NONCE_PATTERN_ = /^[\w+/_-]+[=]{0,2}$/;
/**
 * @private {?string}
 */

goog.cspNonce_ = null;
/**
 * Returns CSP nonce, if set for any script tag.
 * @param {!Document} doc
 * @return {string} CSP nonce or empty string if no nonce is present.
 * @private
 */

goog.getScriptNonce_ = function (doc) {
  var script = doc.querySelector && doc.querySelector('script[nonce]');

  if (script) {
    // Try to get the nonce from the IDL property first, because browsers that
    // implement additional nonce protection features (currently only Chrome) to
    // prevent nonce stealing via CSS do not expose the nonce via attributes.
    // See https://github.com/whatwg/html/issues/2369
    var nonce = script['nonce'] || script.getAttribute('nonce');

    if (nonce && goog.NONCE_PATTERN_.test(nonce)) {
      return nonce;
    }
  }

  return '';
};
/**
 * Module identifier validation regexp.
 * Note: This is a conservative check, it is very possible to be more lenient,
 *   the primary exclusion here is "/" and "\" and a leading ".", these
 *   restrictions are intended to leave the door open for using goog.require
 *   with relative file paths rather than module identifiers.
 * @private
 */


goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
/**
 * Defines a module in Closure.
 *
 * Marks that this file must be loaded as a module and claims the namespace.
 *
 * A namespace may only be defined once in a codebase. It may be defined using
 * goog.provide() or goog.module().
 *
 * goog.module() has three requirements:
 * - goog.module may not be used in the same file as goog.provide.
 * - goog.module must be the first statement in the file.
 * - only one goog.module is allowed per file.
 *
 * When a goog.module annotated file is loaded, it is enclosed in
 * a strict function closure. This means that:
 * - any variables declared in a goog.module file are private to the file
 * (not global), though the compiler is expected to inline the module.
 * - The code must obey all the rules of "strict" JavaScript.
 * - the file will be marked as "use strict"
 *
 * NOTE: unlike goog.provide, goog.module does not declare any symbols by
 * itself. If declared symbols are desired, use
 * goog.module.declareLegacyNamespace().
 *
 *
 * See the public goog.module proposal: http://goo.gl/Va1hin
 *
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part", is expected but not required.
 * @return {void}
 */

goog.module = function (name) {
  if (!goog.isString(name) || !name || name.search(goog.VALID_MODULE_RE_) == -1) {
    throw new Error('Invalid module identifier');
  }

  if (!goog.isInGoogModuleLoader_()) {
    throw new Error('Module ' + name + ' has been loaded incorrectly. Note, ' + 'modules cannot be loaded as normal scripts. They require some kind of ' + 'pre-processing step. You\'re likely trying to load a module via a ' + 'script tag or as a part of a concatenated bundle without rewriting the ' + 'module. For more info see: ' + 'https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.');
  }

  if (goog.moduleLoaderState_.moduleName) {
    throw new Error('goog.module may only be called once per module.');
  } // Store the module name for the loader.


  goog.moduleLoaderState_.moduleName = name;
};
/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 *
 * Note: This is not an alternative to goog.require, it does not
 * indicate a hard dependency, instead it is used to indicate
 * an optional dependency or to access the exports of a module
 * that has already been loaded.
 * @suppress {missingProvide}
 */


goog.module.get = function (name) {
  return goog.module.getInternal_(name);
};
/**
 * @param {string} name The module identifier.
 * @return {?} The module exports for an already loaded module or null.
 * @private
 */


goog.module.getInternal_ = function (name) {
  return null;
};
/**
 * Types of modules the debug loader can load.
 * @enum {string}
 */


goog.ModuleType = {
  ES6: 'es6',
  GOOG: 'goog'
};
/**
 * @private {?{
 *   moduleName: (string|undefined),
 *   declareLegacyNamespace:boolean,
 *   type: ?goog.ModuleType
 * }}
 */

goog.moduleLoaderState_ = null;
/**
 * @private
 * @return {boolean} Whether a goog.module or an es6 module is currently being
 *     initialized.
 */

goog.isInModuleLoader_ = function () {
  return goog.isInGoogModuleLoader_() || goog.isInEs6ModuleLoader_();
};
/**
 * @private
 * @return {boolean} Whether a goog.module is currently being initialized.
 */


goog.isInGoogModuleLoader_ = function () {
  return !!goog.moduleLoaderState_ && goog.moduleLoaderState_.type == goog.ModuleType.GOOG;
};
/**
 * @private
 * @return {boolean} Whether an es6 module is currently being initialized.
 */


goog.isInEs6ModuleLoader_ = function () {
  var inLoader = !!goog.moduleLoaderState_ && goog.moduleLoaderState_.type == goog.ModuleType.ES6;

  if (inLoader) {
    return true;
  }

  var jscomp = goog.global['$jscomp'];

  if (jscomp) {
    // jscomp may not have getCurrentModulePath if this is a compiled bundle
    // that has some of the runtime, but not all of it. This can happen if
    // optimizations are turned on so the unused runtime is removed but renaming
    // and Closure pass are off (so $jscomp is still named $jscomp and the
    // goog.provide/require calls still exist).
    if (typeof jscomp.getCurrentModulePath != 'function') {
      return false;
    } // Bundled ES6 module.


    return !!jscomp.getCurrentModulePath();
  }

  return false;
};
/**
 * Provide the module's exports as a globally accessible object under the
 * module's declared name.  This is intended to ease migration to goog.module
 * for files that have existing usages.
 * @suppress {missingProvide}
 */


goog.module.declareLegacyNamespace = function () {
  goog.moduleLoaderState_.declareLegacyNamespace = true;
};
/**
 * Associates an ES6 module with a Closure module ID so that is available via
 * goog.require. The associated ID  acts like a goog.module ID - it does not
 * create any global names, it is merely available via goog.require /
 * goog.module.get / goog.forwardDeclare / goog.requireType. goog.require and
 * goog.module.get will return the entire module as if it was import *'d. This
 * allows Closure files to reference ES6 modules for the sake of migration.
 *
 * @param {string} namespace
 * @suppress {missingProvide}
 */


goog.declareModuleId = function (namespace) {
  if (goog.moduleLoaderState_) {
    // Not bundled - debug loading.
    goog.moduleLoaderState_.moduleName = namespace;
  } else {
    // Bundled - not debug loading, no module loader state.
    var jscomp = goog.global['$jscomp'];

    if (!jscomp || typeof jscomp.getCurrentModulePath != 'function') {
      throw new Error('Module with namespace "' + namespace + '" has been loaded incorrectly.');
    }

    var exports = jscomp.require(jscomp.getCurrentModulePath());

    goog.loadedModules_[namespace] = {
      exports: exports,
      type: goog.ModuleType.ES6,
      moduleId: namespace
    };
  }
};
/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 *
 * In the case of unit tests, the message may optionally be an exact namespace
 * for the test (e.g. 'goog.stringTest'). The linter will then ignore the extra
 * provide (if not explicitly defined in the code).
 *
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */


goog.setTestOnly = function (opt_message) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || '';
    throw new Error('Importing test-only code into non-debug environment' + (opt_message ? ': ' + opt_message : '.'));
  }
};
/**
 * Forward declares a symbol. This is an indication to the compiler that the
 * symbol may be used in the source yet is not required and may not be provided
 * in compilation.
 *
 * The most common usage of forward declaration is code that takes a type as a
 * function parameter but does not need to require it. By forward declaring
 * instead of requiring, no hard dependency is made, and (if not required
 * elsewhere) the namespace may never be required and thus, not be pulled
 * into the JavaScript binary. If it is required elsewhere, it will be type
 * checked as normal.
 *
 * Before using goog.forwardDeclare, please read the documentation at
 * https://github.com/google/closure-compiler/wiki/Bad-Type-Annotation to
 * understand the options and tradeoffs when working with forward declarations.
 *
 * @param {string} name The namespace to forward declare in the form of
 *     "goog.package.part".
 */


goog.forwardDeclare = function (name) {};
/**
 * Forward declare type information. Used to assign types to goog.global
 * referenced object that would otherwise result in unknown type references
 * and thus block property disambiguation.
 */


goog.forwardDeclare('Document');
goog.forwardDeclare('HTMLScriptElement');
goog.forwardDeclare('XMLHttpRequest');
/**
 * Returns an object based on its fully qualified external name.  The object
 * is not found if null or undefined.  If you are using a compilation pass that
 * renames property names beware that using this function will not find renamed
 * properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |goog.global|.
 * @return {?} The value (object or primitive) or, if not found, null.
 */

goog.getObjectByName = function (name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;

  for (var i = 0; i < parts.length; i++) {
    cur = cur[parts[i]];

    if (!goog.isDefAndNotNull(cur)) {
      return null;
    }
  }

  return cur;
};
/**
 * Globalizes a whole namespace, such as goog or goog.lang.
 *
 * @param {!Object} obj The namespace to globalize.
 * @param {Object=} opt_global The object to add the properties to.
 * @deprecated Properties may be explicitly exported to the global scope, but
 *     this should no longer be done in bulk.
 */


goog.globalize = function (obj, opt_global) {
  var global = opt_global || goog.global;

  for (var x in obj) {
    global[x] = obj[x];
  }
};
/**
 * Adds a dependency from a file to the files it requires.
 * @param {string} relPath The path to the js file.
 * @param {!Array<string>} provides An array of strings with
 *     the names of the objects this file provides.
 * @param {!Array<string>} requires An array of strings with
 *     the names of the objects this file requires.
 * @param {boolean|!Object<string>=} opt_loadFlags Parameters indicating
 *     how the file must be loaded.  The boolean 'true' is equivalent
 *     to {'module': 'goog'} for backwards-compatibility.  Valid properties
 *     and values include {'module': 'goog'} and {'lang': 'es6'}.
 */


goog.addDependency = function (relPath, provides, requires, opt_loadFlags) {}; // NOTE(nnaze): The debug DOM loader was included in base.js as an original way
// to do "debug-mode" development.  The dependency system can sometimes be
// confusing, as can the debug DOM loader's asynchronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the script
// will not load until some point after the current script.  If a namespace is
// needed at runtime, it needs to be defined in a previous script, or loaded via
// require() with its registered dependencies.
//
// User-defined namespaces may need their own deps file. For a reference on
// creating a deps file, see:
// Externally: https://developers.google.com/closure/library/docs/depswriter
//
// Because of legacy clients, the DOM loader can't be easily removed from
// base.js.  Work was done to make it disableable or replaceable for
// different environments (DOM-less JavaScript interpreters like Rhino or V8,
// for example). See bootstrap/ for more information.

/**
 * @define {boolean} Whether to enable the debug loader.
 *
 * If enabled, a call to goog.require() will attempt to load the namespace by
 * appending a script tag to the DOM (if the namespace has been registered).
 *
 * If disabled, goog.require() will simply assert that the namespace has been
 * provided (and depend on the fact that some outside tool correctly ordered
 * the script).
 */


goog.ENABLE_DEBUG_LOADER = goog.define('goog.ENABLE_DEBUG_LOADER', true);
/**
 * @param {string} msg
 * @private
 */

goog.logToConsole_ = function (msg) {
  if (goog.global.console) {
    goog.global.console['error'](msg);
  }
};
/**
 * Implements a system for the dynamic resolution of dependencies that works in
 * parallel with the BUILD system.
 *
 * Note that all calls to goog.require will be stripped by the compiler.
 *
 * @see goog.provide
 * @param {string} namespace Namespace (as was given in goog.provide,
 *     goog.module, or goog.declareModuleId) in the form
 *     "goog.package.part".
 * @return {?} If called within a goog.module or ES6 module file, the associated
 *     namespace or module otherwise null.
 */


goog.require = function (namespace) {};
/**
 * Requires a symbol for its type information. This is an indication to the
 * compiler that the symbol may appear in type annotations, yet it is not
 * referenced at runtime.
 *
 * When called within a goog.module or ES6 module file, the return value may be
 * assigned to or destructured into a variable, but it may not be otherwise used
 * in code outside of a type annotation.
 *
 * Note that all calls to goog.requireType will be stripped by the compiler.
 *
 * @param {string} namespace Namespace (as was given in goog.provide,
 *     goog.module, or goog.declareModuleId) in the form
 *     "goog.package.part".
 * @return {?}
 */


goog.requireType = function (namespace) {
  // Return an empty object so that single-level destructuring of the return
  // value doesn't crash at runtime when using the debug loader. Multi-level
  // destructuring isn't supported.
  return {};
};
/**
 * Path for included scripts.
 * @type {string}
 */


goog.basePath = '';
/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */

goog.global.CLOSURE_BASE_PATH;
/**
 * Whether to attempt to load Closure's deps file. By default, when uncompiled,
 * deps files will attempt to be loaded.
 * @type {boolean|undefined}
 */

goog.global.CLOSURE_NO_DEPS;
/**
 * A function to import a single script. This is meant to be overridden when
 * Closure is being run in non-HTML contexts, such as web workers. It's defined
 * in the global scope so that it can be set before base.js is loaded, which
 * allows deps.js to be imported properly.
 *
 * The first parameter the script source, which is a relative URI. The second,
 * optional parameter is the script contents, in the event the script needed
 * transformation. It should return true if the script was imported, false
 * otherwise.
 * @type {(function(string, string=): boolean)|undefined}
 */

goog.global.CLOSURE_IMPORT_SCRIPT;
/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */

goog.nullFunction = function () {};
/**
 * When defining a class Foo with an abstract method bar(), you can do:
 * Foo.prototype.bar = goog.abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error will be thrown
 * when bar() is invoked.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be overridden.
 */


goog.abstractMethod = function () {
  throw new Error('unimplemented abstract method');
};
/**
 * Adds a `getInstance` static method that always returns the same
 * instance object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 * @suppress {missingProperties} 'instance_' isn't a property on 'Function'
 *     but we don't have a better type to use here.
 */


goog.addSingletonGetter = function (ctor) {
  // instance_ is immediately set to prevent issues with sealed constructors
  // such as are encountered when a constructor is returned as the export object
  // of a goog.module in unoptimized code.
  // Delcare type to avoid conformance violations that ctor.instance_ is unknown

  /** @type {undefined|!Object} @suppress {underscore} */
  ctor.instance_ = undefined;

  ctor.getInstance = function () {
    if (ctor.instance_) {
      return ctor.instance_;
    }

    if (goog.DEBUG) {
      // NOTE: JSCompiler can't optimize away Array#push.
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    } // Cast to avoid conformance violations that ctor.instance_ is unknown


    return (
      /** @type {!Object|undefined} */
      ctor.instance_ = new ctor()
    );
  };
};
/**
 * All singleton classes that have been instantiated, for testing. Don't read
 * it directly, use the `goog.testing.singleton` module. The compiler
 * removes this variable if unused.
 * @type {!Array<!Function>}
 * @private
 */


goog.instantiatedSingletons_ = [];
/**
 * @define {boolean} Whether to load goog.modules using `eval` when using
 * the debug loader.  This provides a better debugging experience as the
 * source is unmodified and can be edited using Chrome Workspaces or similar.
 * However in some environments the use of `eval` is banned
 * so we provide an alternative.
 */

goog.LOAD_MODULE_USING_EVAL = goog.define('goog.LOAD_MODULE_USING_EVAL', true);
/**
 * @define {boolean} Whether the exports of goog.modules should be sealed when
 * possible.
 */

goog.SEAL_MODULE_EXPORTS = goog.define('goog.SEAL_MODULE_EXPORTS', goog.DEBUG);
/**
 * The registry of initialized modules:
 * The module identifier or path to module exports map.
 * @private @const {!Object<string, {exports:?,type:string,moduleId:string}>}
 */

goog.loadedModules_ = {};
/**
 * True if the debug loader enabled and used.
 * @const {boolean}
 */

goog.DEPENDENCIES_ENABLED = false;
/**
 * @define {string} How to decide whether to transpile.  Valid values
 * are 'always', 'never', and 'detect'.  The default ('detect') is to
 * use feature detection to determine which language levels need
 * transpilation.
 */
// NOTE(sdh): we could expand this to accept a language level to bypass
// detection: e.g. goog.TRANSPILE == 'es5' would transpile ES6 files but
// would leave ES3 and ES5 files alone.

goog.TRANSPILE = goog.define('goog.TRANSPILE', 'detect');
/**
 * @define {boolean} If true assume that ES modules have already been
 * transpiled by the jscompiler (in the same way that transpile.js would
 * transpile them - to jscomp modules). Useful only for servers that wish to use
 * the debug loader and transpile server side. Thus this is only respected if
 * goog.TRANSPILE is "never".
 */

goog.ASSUME_ES_MODULES_TRANSPILED = goog.define('goog.ASSUME_ES_MODULES_TRANSPILED', false);
/**
 * @define {string} If a file needs to be transpiled what the output language
 * should be. By default this is the highest language level this file detects
 * the current environment supports. Generally this flag should not be set, but
 * it could be useful to override. Example: If the current environment supports
 * ES6 then by default ES7+ files will be transpiled to ES6, unless this is
 * overridden.
 *
 * Valid values include: es3, es5, es6, es7, and es8. Anything not recognized
 * is treated as es3.
 *
 * Note that setting this value does not force transpilation. Just if
 * transpilation occurs this will be the output. So this is most useful when
 * goog.TRANSPILE is set to 'always' and then forcing the language level to be
 * something lower than what the environment detects.
 */

goog.TRANSPILE_TO_LANGUAGE = goog.define('goog.TRANSPILE_TO_LANGUAGE', '');
/**
 * @define {string} Path to the transpiler.  Executing the script at this
 * path (relative to base.js) should define a function $jscomp.transpile.
 */

goog.TRANSPILER = goog.define('goog.TRANSPILER', 'transpile.js');
/**
 * @package {?boolean}
 * Visible for testing.
 */

goog.hasBadLetScoping = null;
/**
 * @return {boolean}
 * @package Visible for testing.
 */

goog.useSafari10Workaround = function () {
  if (goog.hasBadLetScoping == null) {
    var hasBadLetScoping;

    try {
      hasBadLetScoping = !(0, eval)('"use strict";' + 'let x = 1; function f() { return typeof x; };' + 'f() == "number";');
    } catch (e) {
      // Assume that ES6 syntax isn't supported.
      hasBadLetScoping = false;
    }

    goog.hasBadLetScoping = hasBadLetScoping;
  }

  return goog.hasBadLetScoping;
};
/**
 * @param {string} moduleDef
 * @return {string}
 * @package Visible for testing.
 */


goog.workaroundSafari10EvalBug = function (moduleDef) {
  return '(function(){' + moduleDef + '\n' + // Terminate any trailing single line comment.
  ';' + // Terminate any trailing expression.
  '})();\n';
};
/**
 * @param {function(?):?|string} moduleDef The module definition.
 */


goog.loadModule = function (moduleDef) {
  // NOTE: we allow function definitions to be either in the from
  // of a string to eval (which keeps the original source intact) or
  // in a eval forbidden environment (CSP) we allow a function definition
  // which in its body must call `goog.module`, and return the exports
  // of the module.
  var previousState = goog.moduleLoaderState_;

  try {
    goog.moduleLoaderState_ = {
      moduleName: '',
      declareLegacyNamespace: false,
      type: goog.ModuleType.GOOG
    };
    var exports;

    if (goog.isFunction(moduleDef)) {
      exports = moduleDef.call(undefined, {});
    } else if (goog.isString(moduleDef)) {
      if (goog.useSafari10Workaround()) {
        moduleDef = goog.workaroundSafari10EvalBug(moduleDef);
      }

      exports = goog.loadModuleFromSource_.call(undefined, moduleDef);
    } else {
      throw new Error('Invalid module definition');
    }

    var moduleName = goog.moduleLoaderState_.moduleName;

    if (goog.isString(moduleName) && moduleName) {
      // Don't seal legacy namespaces as they may be used as a parent of
      // another namespace
      if (goog.moduleLoaderState_.declareLegacyNamespace) {
        goog.constructNamespace_(moduleName, exports);
      } else if (goog.SEAL_MODULE_EXPORTS && Object.seal && typeof exports == 'object' && exports != null) {
        Object.seal(exports);
      }

      var data = {
        exports: exports,
        type: goog.ModuleType.GOOG,
        moduleId: goog.moduleLoaderState_.moduleName
      };
      goog.loadedModules_[moduleName] = data;
    } else {
      throw new Error('Invalid module name \"' + moduleName + '\"');
    }
  } finally {
    goog.moduleLoaderState_ = previousState;
  }
};
/**
 * @private @const
 */


goog.loadModuleFromSource_ =
/** @type {function(string):?} */
function () {

  var exports = {};
  (0, eval)(arguments[0]);
  return exports;
};
/**
 * Normalize a file path by removing redundant ".." and extraneous "." file
 * path components.
 * @param {string} path
 * @return {string}
 * @private
 */


goog.normalizePath_ = function (path) {
  var components = path.split('/');
  var i = 0;

  while (i < components.length) {
    if (components[i] == '.') {
      components.splice(i, 1);
    } else if (i && components[i] == '..' && components[i - 1] && components[i - 1] != '..') {
      components.splice(--i, 2);
    } else {
      i++;
    }
  }

  return components.join('/');
};
/**
 * Provides a hook for loading a file when using Closure's goog.require() API
 * with goog.modules.  In particular this hook is provided to support Node.js.
 *
 * @type {(function(string):string)|undefined}
 */


goog.global.CLOSURE_LOAD_FILE_SYNC;
/**
 * Loads file by synchronous XHR. Should not be used in production environments.
 * @param {string} src Source URL.
 * @return {?string} File contents, or null if load failed.
 * @private
 */

goog.loadFileSync_ = function (src) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(src);
  } else {
    try {
      /** @type {XMLHttpRequest} */
      var xhr = new goog.global['XMLHttpRequest']();
      xhr.open('get', src, false);
      xhr.send(); // NOTE: Successful http: requests have a status of 200, but successful
      // file: requests may have a status of zero.  Any other status, or a
      // thrown exception (particularly in case of file: requests) indicates
      // some sort of error, which we treat as a missing or unavailable file.

      return xhr.status == 0 || xhr.status == 200 ? xhr.responseText : null;
    } catch (err) {
      // No need to rethrow or log, since errors should show up on their own.
      return null;
    }
  }
};
/**
 * Lazily retrieves the transpiler and applies it to the source.
 * @param {string} code JS code.
 * @param {string} path Path to the code.
 * @param {string} target Language level output.
 * @return {string} The transpiled code.
 * @private
 */


goog.transpile_ = function (code, path, target) {
  var jscomp = goog.global['$jscomp'];

  if (!jscomp) {
    goog.global['$jscomp'] = jscomp = {};
  }

  var transpile = jscomp.transpile;

  if (!transpile) {
    var transpilerPath = goog.basePath + goog.TRANSPILER;
    var transpilerCode = goog.loadFileSync_(transpilerPath);

    if (transpilerCode) {
      // This must be executed synchronously, since by the time we know we
      // need it, we're about to load and write the ES6 code synchronously,
      // so a normal script-tag load will be too slow. Wrapped in a function
      // so that code is eval'd in the global scope.
      (function () {
        (0, eval)(transpilerCode + '\n//# sourceURL=' + transpilerPath);
      }).call(goog.global); // Even though the transpiler is optional, if $gwtExport is found, it's
      // a sign the transpiler was loaded and the $jscomp.transpile *should*
      // be there.

      if (goog.global['$gwtExport'] && goog.global['$gwtExport']['$jscomp'] && !goog.global['$gwtExport']['$jscomp']['transpile']) {
        throw new Error('The transpiler did not properly export the "transpile" ' + 'method. $gwtExport: ' + JSON.stringify(goog.global['$gwtExport']));
      } // transpile.js only exports a single $jscomp function, transpile. We
      // grab just that and add it to the existing definition of $jscomp which
      // contains the polyfills.


      goog.global['$jscomp'].transpile = goog.global['$gwtExport']['$jscomp']['transpile'];
      jscomp = goog.global['$jscomp'];
      transpile = jscomp.transpile;
    }
  }

  if (!transpile) {
    // The transpiler is an optional component.  If it's not available then
    // replace it with a pass-through function that simply logs.
    var suffix = ' requires transpilation but no transpiler was found.';

    transpile = jscomp.transpile = function (code, path) {
      // TODO(sdh): figure out some way to get this error to show up
      // in test results, noting that the failure may occur in many
      // different ways, including in loadModule() before the test
      // runner even comes up.
      goog.logToConsole_(path + suffix);
      return code;
    };
  } // Note: any transpilation errors/warnings will be logged to the console.


  return transpile(code, path, target);
}; //==============================================================================
// Language Enhancements
//==============================================================================

/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {?} value The value to get the type of.
 * @return {string} The name of the type.
 */


goog.typeOf = function (value) {
  var s = typeof value;

  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals typeof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      } // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.


      var className = Object.prototype.toString.call(
      /** @type {!Object} */
      value); // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.

      if (className == '[object Window]') {
        return 'object';
      } // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.


      if (className == '[object Array]' || // In IE all non value types are wrapped as objects across window
      // boundaries (not iframe though) so we have to do object detection
      // for this edge case.
      typeof value.length == 'number' && typeof value.splice != 'undefined' && typeof value.propertyIsEnumerable != 'undefined' && !value.propertyIsEnumerable('splice')) {
        return 'array';
      } // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.
      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.


      if (className == '[object Function]' || typeof value.call != 'undefined' && typeof value.propertyIsEnumerable != 'undefined' && !value.propertyIsEnumerable('call')) {
        return 'function';
      }
    } else {
      return 'null';
    }
  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox typeof
    // behaves similarly for HTML{Applet,Embed,Object}, Elements and RegExps. We
    // would like to return object for those and we can detect an invalid
    // function by making sure that the function object has a call method.
    return 'object';
  }

  return s;
};
/**
 * Returns true if the specified value is null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is null.
 */


goog.isNull = function (val) {
  return val === null;
};
/**
 * Returns true if the specified value is defined and not null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */


goog.isDefAndNotNull = function (val) {
  // Note that undefined == null.
  return val != null;
};
/**
 * Returns true if the specified value is an array.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */


goog.isArray = function (val) {
  return goog.typeOf(val) == 'array';
};
/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property. Note that for this function neither strings nor functions are
 * considered "array-like".
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */


goog.isArrayLike = function (val) {
  var type = goog.typeOf(val); // We do not use goog.isObject here in order to exclude function values.

  return type == 'array' || type == 'object' && typeof val.length == 'number';
};
/**
 * Returns true if the object looks like a Date. To qualify as Date-like the
 * value needs to be an object and have a getFullYear() function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */


goog.isDateLike = function (val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};
/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */


goog.isFunction = function (val) {
  return goog.typeOf(val) == 'function';
};
/**
 * Returns true if the specified value is an object.  This includes arrays and
 * functions.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */


goog.isObject = function (val) {
  var type = typeof val;
  return type == 'object' && val != null || type == 'function'; // return Object(val) === val also works, but is slower, especially if val is
  // not an object.
};
/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. The unique ID is
 * guaranteed to be unique across the current session amongst objects that are
 * passed into `getUid`. There is no guarantee that the ID is unique or
 * consistent across sessions. It is unsafe to generate unique ID for function
 * prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */


goog.getUid = function (obj) {
  // TODO(arv): Make the type stricter, do not accept null.
  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
/**
 * Whether the given object is already assigned a unique ID.
 *
 * This does not modify the object.
 *
 * @param {!Object} obj The object to check.
 * @return {boolean} Whether there is an assigned unique id for the object.
 */


goog.hasUid = function (obj) {
  return !!obj[goog.UID_PROPERTY_];
};
/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using `goog.getUid` in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */


goog.removeUid = function (obj) {
  // TODO(arv): Make the type stricter, do not accept null.
  // In IE, DOM nodes are not instances of Object and throw an exception if we
  // try to delete.  Instead we try to use removeAttribute.
  if (obj !== null && 'removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }

  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {}
};
/**
 * Name for unique ID property. Initialized in a way to help avoid collisions
 * with other closure JavaScript on the same page.
 * @type {string}
 * @private
 */


goog.UID_PROPERTY_ = 'closure_uid_' + (Math.random() * 1e9 >>> 0);
/**
 * Counter for UID.
 * @type {number}
 * @private
 */

goog.uidCounter_ = 0;
/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for.
 * @return {number} The hash code for the object.
 * @deprecated Use goog.getUid instead.
 */

goog.getHashCode = goog.getUid;
/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 * @deprecated Use goog.removeUid instead.
 */

goog.removeHashCode = goog.removeUid;
/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */

goog.cloneObject = function (obj) {
  var type = goog.typeOf(obj);

  if (type == 'object' || type == 'array') {
    if (typeof obj.clone === 'function') {
      return obj.clone();
    }

    var clone = type == 'array' ? [] : {};

    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }

    return clone;
  }

  return obj;
};
/**
 * A native implementation of goog.bind.
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function goog.bind() was
 *     invoked as a method of.
 * @template T
 * @private
 */


goog.bindNative_ = function (fn, selfObj, var_args) {
  return (
    /** @type {!Function} */
    fn.call.apply(fn.bind, arguments)
  );
};
/**
 * A pure-JS implementation of goog.bind.
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function goog.bind() was
 *     invoked as a method of.
 * @template T
 * @private
 */


goog.bindJs_ = function (fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function () {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function () {
      return fn.apply(selfObj, arguments);
    };
  }
};
/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of this 'pre-specified'.
 *
 * Remaining arguments specified at call-time are appended to the pre-specified
 * ones.
 *
 * Also see: {@link #partial}.
 *
 * Usage:
 * <pre>var barMethBound = goog.bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function goog.bind() was
 *     invoked as a method of.
 * @template T
 * @suppress {deprecated} See above.
 */


goog.bind = function (fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind && // NOTE(nicksantos): Somebody pulled base.js into the default Chrome
  // extension environment. This means that for Chrome extensions, they get
  // the implementation of Function.prototype.bind that calls goog.bind
  // instead of the native one. Even worse, we don't want to introduce a
  // circular dependency between goog.bind and Function.prototype.bind, so
  // we have to hack this to make sure it works correctly.
  Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }

  return goog.bind.apply(null, arguments);
};
/**
 * Like goog.bind(), except that a 'this object' is not required. Useful when
 * the target function is already bound.
 *
 * Usage:
 * var g = goog.partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially applied to fn.
 * @return {!Function} A partially-applied form of the function goog.partial()
 *     was invoked as a method of.
 */


goog.partial = function (fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function () {
    // Clone the array (with slice()) and append additional arguments
    // to the existing arguments.
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(
    /** @type {?} */
    this, newArgs);
  };
};
/**
 * Copies all the members of a source object to a target object. This method
 * does not work on all browsers for all objects that contain keys such as
 * toString or hasOwnProperty. Use goog.object.extend for this purpose.
 * @param {Object} target Target.
 * @param {Object} source Source.
 */


goog.mixin = function (target, source) {
  for (var x in source) {
    target[x] = source[x];
  } // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).

};
/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */


goog.now = goog.TRUSTED_SITE && Date.now || function () {
  // Unary plus operator converts its operand to a number which in
  // the case of
  // a date is done by calling getTime().
  return +new Date();
};
/**
 * Evals JavaScript in the global scope.  In IE this uses execScript, other
 * browsers use goog.global.eval. If goog.global.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */


goog.globalEval = function (script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    // Test to see if eval works
    if (goog.evalWorksForGlobals_ == null) {
      try {
        goog.global.eval('var _evalTest_ = 1;');
      } catch (ignore) {}

      if (typeof goog.global['_evalTest_'] != 'undefined') {
        try {
          delete goog.global['_evalTest_'];
        } catch (ignore) {// Microsoft edge fails the deletion above in strict mode.
        }

        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }

    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      /** @type {!Document} */
      var doc = goog.global.document;
      var scriptElt =
      /** @type {!HTMLScriptElement} */
      doc.createElement('SCRIPT');
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false; // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.

      scriptElt.appendChild(doc.createTextNode(script));
      doc.head.appendChild(scriptElt);
      doc.head.removeChild(scriptElt);
    }
  } else {
    throw new Error('goog.globalEval not available');
  }
};
/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to goog.globalEval (which
 * empirically tests whether eval works for globals). @see goog.globalEval
 * @type {?boolean}
 * @private
 */


goog.evalWorksForGlobals_ = null;
/**
 * A hook for modifying the default behavior goog.getCssName. The function
 * if present, will receive the standard output of the goog.getCssName as
 * its input.
 *
 * @type {(function(string):string)|undefined}
 */

goog.global.CLOSURE_CSS_NAME_MAP_FN;
/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see goog.setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a hyphen and
 * passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which these
 * mappings are used. In the BY_PART style, each part (i.e. in between hyphens)
 * of the passed in css name is rewritten according to the map. In the BY_WHOLE
 * style, the full css name is looked up in the map directly. If a rewrite is
 * not specified by the map, the compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls to
 * goog.getCssName with the strings from the mapping, e.g.
 *     var x = goog.getCssName('foo');
 *     var y = goog.getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x = 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed only the
 * modifier will be processed, as it is assumed the first argument was generated
 * as a result of calling goog.getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */

goog.getCssName = function (className, opt_modifier) {
  // String() is used for compatibility with compiled soy where the passed
  // className can be non-string objects.
  if (String(className).charAt(0) == '.') {
    throw new Error('className passed in goog.getCssName must not start with ".".' + ' You passed: ' + className);
  }

  var getMapping = function (cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };

  var renameByParts = function (cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];

    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }

    return mapped.join('-');
  };

  var rename;

  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == 'BY_WHOLE' ? getMapping : renameByParts;
  } else {
    rename = function (a) {
      return a;
    };
  }

  var result = opt_modifier ? className + '-' + rename(opt_modifier) : rename(className); // The special CLOSURE_CSS_NAME_MAP_FN allows users to specify further
  // processing of the class name.

  if (goog.global.CLOSURE_CSS_NAME_MAP_FN) {
    return goog.global.CLOSURE_CSS_NAME_MAP_FN(result);
  }

  return result;
};
/**
 * Sets the map to check when returning a value from goog.getCssName(). Example:
 * <pre>
 * goog.setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = goog.getCssName('goog');
 * // The following evaluates to: "a a-b".
 * goog.getCssName('goog') + ' ' + goog.getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to goog.getCssName() using the supplied map if the
 * --process_closure_primitives flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to goog.getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} opt_style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see goog.getCssName for a description.
 */


goog.setCssNameMapping = function (mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
/**
 * To use CSS renaming in compiled mode, one of the input files should have a
 * call to goog.setCssNameMapping() with an object literal that the JSCompiler
 * can extract and use to replace all calls to goog.getCssName(). In uncompiled
 * mode, JavaScript code should be loaded before this base.js file that declares
 * a global variable, CLOSURE_CSS_NAME_MAPPING, which is used below. This is
 * to ensure that the mapping is loaded before any calls to goog.getCssName()
 * are made in uncompiled mode.
 *
 * A hook for overriding the CSS name mapping.
 * @type {!Object<string, string>|undefined}
 */


goog.global.CLOSURE_CSS_NAME_MAPPING;
/**
 * Gets a localized message.
 *
 * This function is a compiler primitive. If you give the compiler a localized
 * message bundle, it will replace the string at compile-time with a localized
 * version, and expand goog.getMsg call to a concatenated string.
 *
 * Messages must be initialized in the form:
 * <code>
 * var MSG_NAME = goog.getMsg('Hello {$placeholder}', {'placeholder': 'world'});
 * </code>
 *
 * This function produces a string which should be treated as plain text. Use
 * {@link goog.html.SafeHtmlFormatter} in conjunction with goog.getMsg to
 * produce SafeHtml.
 *
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object<string, string>=} opt_values Maps place holder name to value.
 * @return {string} message with placeholders filled.
 */

goog.getMsg = function (str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function (match, key) {
      return opt_values != null && key in opt_values ? opt_values[key] : match;
    });
  }

  return str;
};
/**
 * Gets a localized message. If the message does not have a translation, gives a
 * fallback message.
 *
 * This is useful when introducing a new message that has not yet been
 * translated into all languages.
 *
 * This function is a compiler primitive. Must be used in the form:
 * <code>var x = goog.getMsgWithFallback(MSG_A, MSG_B);</code>
 * where MSG_A and MSG_B were initialized with goog.getMsg.
 *
 * @param {string} a The preferred message.
 * @param {string} b The fallback message.
 * @return {string} The best translated message.
 */


goog.getMsgWithFallback = function (a, b) {
  return a;
};
/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated, unless they are
 * exported in turn via this function or goog.exportProperty.
 *
 * Also handy for making public items that are defined in anonymous closures.
 *
 * ex. goog.exportSymbol('public.path.Foo', Foo);
 *
 * ex. goog.exportSymbol('public.path.Foo.staticFunction', Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is goog.global.
 */


goog.exportSymbol = function (publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. goog.exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. goog.exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */


goog.exportProperty = function (object, publicName, symbol) {
  object[publicName] = symbol;
};
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * @param {!Function} childCtor Child class.
 * @param {!Function} parentCtor Parent class.
 * @suppress {strictMissingProperties} superClass_ and base is not defined on
 *    Function.
 */


goog.inherits = function (childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {}

  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */

  childCtor.prototype.constructor = childCtor;
  /**
   * Calls superclass constructor/method.
   *
   * This function is only available if you use goog.inherits to
   * express inheritance relationships between classes.
   *
   * NOTE: This is a replacement for goog.base and for superClass_
   * property defined in childCtor.
   *
   * @param {!Object} me Should always be "this".
   * @param {string} methodName The method name to call. Calling
   *     superclass constructor can be done with the special string
   *     'constructor'.
   * @param {...*} var_args The arguments to pass to superclass
   *     method/constructor.
   * @return {*} The return value of the superclass method/constructor.
   */

  childCtor.base = function (me, methodName, var_args) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var args = new Array(arguments.length - 2);

    for (var i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i];
    }

    return parentCtor.prototype[methodName].apply(me, args);
  };
};
/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * constructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass the name of the
 * method as the second argument to this function. If you do not, you will get a
 * runtime error. This calls the superclass' method with arguments 2-N.
 *
 * This function only works if you use goog.inherits to express inheritance
 * relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the compiler will do
 * macro expansion to remove a lot of the extra overhead that this function
 * introduces. The compiler will also enforce a lot of the assumptions that this
 * function makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 * @suppress {es5Strict} This method can not be used in strict mode, but
 *     all Closure Library consumers must depend on this file.
 * @deprecated goog.base is not strict mode compatible.  Prefer the static
 *     "base" method added to the constructor by goog.inherits
 *     or ES6 classes and the "super" keyword.
 */


goog.base = function (me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;

  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw new Error('arguments.caller not defined.  goog.base() cannot be used ' + 'with strict mode code. See ' + 'http://www.ecma-international.org/ecma-262/5.1/#sec-C');
  }

  if (typeof caller.superClass_ !== 'undefined') {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var ctorArgs = new Array(arguments.length - 1);

    for (var i = 1; i < arguments.length; i++) {
      ctorArgs[i - 1] = arguments[i];
    } // This is a constructor. Call the superclass constructor.


    return (
      /** @type {!Function} */
      caller.superClass_.constructor.apply(me, ctorArgs)
    );
  }

  if (typeof opt_methodName != 'string' && typeof opt_methodName != 'symbol') {
    throw new Error('method names provided to goog.base must be a string or a symbol');
  } // Copying using loop to avoid deop due to passing arguments object to
  // function. This is faster in many JS engines as of late 2014.


  var args = new Array(arguments.length - 2);

  for (var i = 2; i < arguments.length; i++) {
    args[i - 2] = arguments[i];
  }

  var foundCaller = false;

  for (var proto = me.constructor.prototype; proto; proto = Object.getPrototypeOf(proto)) {
    if (proto[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return proto[opt_methodName].apply(me, args);
    }
  } // If we did not find the caller in the prototype chain, then one of two
  // things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.


  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw new Error('goog.base called from a method of one name ' + 'to a method of a different name');
  }
};
/**
 * Allow for aliasing within scope functions.  This function exists for
 * uncompiled code - in compiled code the calls will be inlined and the aliases
 * applied.  In uncompiled code the function is simply run since the aliases as
 * written are valid JavaScript.
 *
 *
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *     (e.g. "var Timer = goog.Timer").
 */


goog.scope = function (fn) {
  if (goog.isInModuleLoader_()) {
    throw new Error('goog.scope is not supported within a module.');
  }

  fn.call(goog.global);
}; //==============================================================================
// goog.defineClass implementation
//==============================================================================

/**
 * Creates a restricted form of a Closure "class":
 *   - from the compiler's perspective, the instance returned from the
 *     constructor is sealed (no new properties may be added).  This enables
 *     better checks.
 *   - the compiler will rewrite this definition to a form that is optimal
 *     for type checking and optimization (initially this will be a more
 *     traditional form).
 *
 * @param {Function} superClass The superclass, Object or null.
 * @param {goog.defineClass.ClassDescriptor} def
 *     An object literal describing
 *     the class.  It may have the following properties:
 *     "constructor": the constructor function
 *     "statics": an object literal containing methods to add to the constructor
 *        as "static" methods or a function that will receive the constructor
 *        function as its only parameter to which static properties can
 *        be added.
 *     all other properties are added to the prototype.
 * @return {!Function} The class constructor.
 */


goog.defineClass = function (superClass, def) {
  // TODO(johnlenz): consider making the superClass an optional parameter.
  var constructor = def.constructor;
  var statics = def.statics; // Wrap the constructor prior to setting up the prototype and static methods.

  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function () {
      throw new Error('cannot instantiate an interface (no constructor defined).');
    };
  }

  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);

  if (superClass) {
    goog.inherits(cls, superClass);
  } // Remove all the properties that should not be copied to the prototype.


  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);

  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }

  return cls;
};
/**
 * @typedef {{
 *   constructor: (!Function|undefined),
 *   statics: (Object|undefined|function(Function):void)
 * }}
 */


goog.defineClass.ClassDescriptor;
/**
 * @define {boolean} Whether the instances returned by goog.defineClass should
 *     be sealed when possible.
 *
 * When sealing is disabled the constructor function will not be wrapped by
 * goog.defineClass, making it incompatible with ES6 class methods.
 */

goog.defineClass.SEAL_CLASS_INSTANCES = goog.define('goog.defineClass.SEAL_CLASS_INSTANCES', goog.DEBUG);
/**
 * If goog.defineClass.SEAL_CLASS_INSTANCES is enabled and Object.seal is
 * defined, this function will wrap the constructor in a function that seals the
 * results of the provided constructor function.
 *
 * @param {!Function} ctr The constructor whose results maybe be sealed.
 * @param {Function} superClass The superclass constructor.
 * @return {!Function} The replacement constructor.
 * @private
 */

goog.defineClass.createSealingConstructor_ = function (ctr, superClass) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    // Do now wrap the constructor when sealing is disabled. Angular code
    // depends on this for injection to work properly.
    return ctr;
  } // Compute whether the constructor is sealable at definition time, rather
  // than when the instance is being constructed.


  var superclassSealable = !goog.defineClass.isUnsealable_(superClass);
  /**
   * @this {Object}
   * @return {?}
   */

  var wrappedCtr = function () {
    // Don't seal an instance of a subclass when it calls the constructor of
    // its super class as there is most likely still setup to do.
    var instance = ctr.apply(this, arguments) || this;
    instance[goog.UID_PROPERTY_] = instance[goog.UID_PROPERTY_];

    if (this.constructor === wrappedCtr && superclassSealable && Object.seal instanceof Function) {
      Object.seal(instance);
    }

    return instance;
  };

  return wrappedCtr;
};
/**
 * @param {Function} ctr The constructor to test.
 * @return {boolean} Whether the constructor has been tagged as unsealable
 *     using goog.tagUnsealableClass.
 * @private
 */


goog.defineClass.isUnsealable_ = function (ctr) {
  return ctr && ctr.prototype && ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
}; // TODO(johnlenz): share these values with the goog.object

/**
 * The names of the fields that are defined on Object.prototype.
 * @type {!Array<string>}
 * @private
 * @const
 */


goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf']; // TODO(johnlenz): share this function with the goog.object

/**
 * @param {!Object} target The object to add properties to.
 * @param {!Object} source The object to copy properties from.
 * @private
 */

goog.defineClass.applyProperties_ = function (target, source) {
  // TODO(johnlenz): update this to support ES5 getters/setters
  var key;

  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  } // For IE the for-in-loop does not contain any properties that are not
  // enumerable on the prototype object (for example isPrototypeOf from
  // Object.prototype) and it will also not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).


  for (var i = 0; i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};
/**
 * Sealing classes breaks the older idiom of assigning properties on the
 * prototype rather than in the constructor. As such, goog.defineClass
 * must not seal subclasses of these old-style classes until they are fixed.
 * Until then, this marks a class as "broken", instructing defineClass
 * not to seal subclasses.
 * @param {!Function} ctr The legacy constructor to tag as unsealable.
 */


goog.tagUnsealableClass = function (ctr) {};
/**
 * Name for unsealable tag property.
 * @const @private {string}
 */


goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = 'goog_defineClass_legacy_unsealable';
/**
 * @define {string} Trusted Types policy name. If non-empty then Closure will
 * use Trusted Types.
 */

goog.TRUSTED_TYPES_POLICY_NAME = goog.define('goog.TRUSTED_TYPES_POLICY_NAME', '');
/**
 * Returns the parameter.
 * @param {string} s
 * @return {string}
 * @private
 */

goog.identity_ = function (s) {
  return s;
};
/**
 * Creates Trusted Types policy if Trusted Types are supported by the browser.
 * The policy just blesses any string as a Trusted Type. It is not visibility
 * restricted because anyone can also call TrustedTypes.createPolicy directly.
 * However, the allowed names should be restricted by a HTTP header and the
 * reference to the created policy should be visibility restricted.
 * @param {string} name
 * @return {?TrustedTypePolicy}
 */


goog.createTrustedTypesPolicy = function (name) {
  var policy = null;

  if (typeof TrustedTypes === 'undefined' || !TrustedTypes.createPolicy) {
    return policy;
  } // TrustedTypes.createPolicy throws if called with a name that is already
  // registered, even in report-only mode. Until the API changes, catch the
  // error not to break the applications functionally. In such case, the code
  // will fall back to using regular Safe Types.
  // TODO(koto): Remove catching once createPolicy API stops throwing.


  try {
    policy = TrustedTypes.createPolicy(name, {
      createHTML: goog.identity_,
      createScript: goog.identity_,
      createScriptURL: goog.identity_,
      createURL: goog.identity_
    });
  } catch (e) {
    goog.logToConsole_(e.message);
  }

  return policy;
};
/** @private @const {?TrustedTypePolicy} */


goog.TRUSTED_TYPES_POLICY_ = goog.TRUSTED_TYPES_POLICY_NAME ? goog.createTrustedTypesPolicy(goog.TRUSTED_TYPES_POLICY_NAME + '#base') : null;

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Provides a base class for custom Error objects such that the
 * stack is correctly maintained.
 *
 * You should never need to throw goog.debug.Error(msg) directly, Error(msg) is
 * sufficient.
 *
 */

goog.provide('goog.debug.Error');
/**
 * Base class for custom error objects.
 * @param {*=} opt_msg The message associated with the error.
 * @constructor
 * @extends {Error}
 */

goog.debug.Error = function (opt_msg) {
  // Attempt to ensure there is a stack trace.
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = new Error().stack;

    if (stack) {
      /** @override */
      this.stack = stack;
    }
  }

  if (opt_msg) {
    /** @override */
    this.message = String(opt_msg);
  }
  /**
   * Whether to report this error to the server. Setting this to false will
   * cause the error reporter to not report the error back to the server,
   * which can be useful if the client knows that the error has already been
   * logged on the server.
   * @type {boolean}
   */


  this.reportErrorToServer = true;
};

goog.inherits(goog.debug.Error, Error);
/** @override */

goog.debug.Error.prototype.name = 'CustomError';
goog.debug.Error;

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Definition of goog.dom.NodeType.
 */

goog.provide('goog.dom.NodeType');
/**
 * Constants for the nodeType attribute in the Node interface.
 *
 * These constants match those specified in the Node interface. These are
 * usually present on the Node object in recent browsers, but not in older
 * browsers (specifically, early IEs) and thus are given here.
 *
 * In some browsers (early IEs), these are not defined on the Node object,
 * so they are provided here.
 *
 * See http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1950641247
 * @enum {number}
 */

goog.dom.NodeType = {
  ELEMENT: 1,
  ATTRIBUTE: 2,
  TEXT: 3,
  CDATA_SECTION: 4,
  ENTITY_REFERENCE: 5,
  ENTITY: 6,
  PROCESSING_INSTRUCTION: 7,
  COMMENT: 8,
  DOCUMENT: 9,
  DOCUMENT_TYPE: 10,
  DOCUMENT_FRAGMENT: 11,
  NOTATION: 12
};
goog.dom.NodeType;

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utilities to check the preconditions, postconditions and
 * invariants runtime.
 *
 * Methods in this package are given special treatment by the compiler
 * for type-inference. For example, <code>goog.asserts.assert(foo)</code>
 * will make the compiler treat <code>foo</code> as non-nullable. Similarly,
 * <code>goog.asserts.assertNumber(foo)</code> informs the compiler about the
 * type of <code>foo</code>. Where applicable, such assertions are preferable to
 * casts by jsdoc with <code>@type</code>.
 *
 * The compiler has an option to disable asserts. So code like:
 * <code>
 * var x = goog.asserts.assert(foo());
 * goog.asserts.assert(bar());
 * </code>
 * will be transformed into:
 * <code>
 * var x = foo();
 * </code>
 * The compiler will leave in foo() (because its return value is used),
 * but it will remove bar() because it assumes it does not have side-effects.
 *
 * Additionally, note the compiler will consider the type to be "tightened" for
 * all statements <em>after</em> the assertion. For example:
 * <code>
 * const /** ?Object &#ast;/ value = foo();
 * goog.asserts.assert(value);
 * // "value" is of type {!Object} at this point.
 * </code>
 *
 * @author agrieve@google.com (Andrew Grieve)
 */

goog.provide('goog.asserts');
goog.provide('goog.asserts.AssertionError');

goog.require('goog.debug.Error');

goog.require('goog.dom.NodeType');
/**
 * @define {boolean} Whether to strip out asserts or to leave them in.
 */


goog.asserts.ENABLE_ASSERTS = goog.define('goog.asserts.ENABLE_ASSERTS', goog.DEBUG);
/**
 * Error object for failed assertions.
 * @param {string} messagePattern The pattern that was used to form message.
 * @param {!Array<*>} messageArgs The items to substitute into the pattern.
 * @constructor
 * @extends {goog.debug.Error}
 * @final
 */

goog.asserts.AssertionError = function (messagePattern, messageArgs) {
  goog.debug.Error.call(this, goog.asserts.subs_(messagePattern, messageArgs));
  /**
   * The message pattern used to format the error message. Error handlers can
   * use this to uniquely identify the assertion.
   * @type {string}
   */

  this.messagePattern = messagePattern;
};

goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
/** @override */

goog.asserts.AssertionError.prototype.name = 'AssertionError';
/**
 * The default error handler.
 * @param {!goog.asserts.AssertionError} e The exception to be handled.
 */

goog.asserts.DEFAULT_ERROR_HANDLER = function (e) {
  throw e;
};
/**
 * The handler responsible for throwing or logging assertion errors.
 * @private {function(!goog.asserts.AssertionError)}
 */


goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
/**
 * Does simple python-style string substitution.
 * subs("foo%s hot%s", "bar", "dog") becomes "foobar hotdog".
 * @param {string} pattern The string containing the pattern.
 * @param {!Array<*>} subs The items to substitute into the pattern.
 * @return {string} A copy of `str` in which each occurrence of
 *     {@code %s} has been replaced an argument from `var_args`.
 * @private
 */

goog.asserts.subs_ = function (pattern, subs) {
  var splitParts = pattern.split('%s');
  var returnString = ''; // Replace up to the last split part. We are inserting in the
  // positions between split parts.

  var subLast = splitParts.length - 1;

  for (var i = 0; i < subLast; i++) {
    // keep unsupplied as '%s'
    var sub = i < subs.length ? subs[i] : '%s';
    returnString += splitParts[i] + sub;
  }

  return returnString + splitParts[subLast];
};
/**
 * Throws an exception with the given message and "Assertion failed" prefixed
 * onto it.
 * @param {string} defaultMessage The message to use if givenMessage is empty.
 * @param {Array<*>} defaultArgs The substitution arguments for defaultMessage.
 * @param {string|undefined} givenMessage Message supplied by the caller.
 * @param {Array<*>} givenArgs The substitution arguments for givenMessage.
 * @throws {goog.asserts.AssertionError} When the value is not a number.
 * @private
 */


goog.asserts.doAssertFailure_ = function (defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = 'Assertion failed';

  if (givenMessage) {
    message += ': ' + givenMessage;
    var args = givenArgs;
  } else if (defaultMessage) {
    message += ': ' + defaultMessage;
    args = defaultArgs;
  } // The '' + works around an Opera 10 bug in the unit tests. Without it,
  // a stack trace is added to var message above. With this, a stack trace is
  // not added until this line (it causes the extra garbage to be added after
  // the assertion message instead of in the middle of it).


  var e = new goog.asserts.AssertionError('' + message, args || []);
  goog.asserts.errorHandler_(e);
};
/**
 * Sets a custom error handler that can be used to customize the behavior of
 * assertion failures, for example by turning all assertion failures into log
 * messages.
 * @param {function(!goog.asserts.AssertionError)} errorHandler
 */


goog.asserts.setErrorHandler = function (errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler;
  }
};
/**
 * Checks if the condition evaluates to true if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @template T
 * @param {T} condition The condition to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {T} The value of the condition.
 * @throws {goog.asserts.AssertionError} When the condition evaluates to false.
 * @closurePrimitive {asserts.truthy}
 */


goog.asserts.assert = function (condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_('', null, opt_message, Array.prototype.slice.call(arguments, 2));
  }

  return condition;
};
/**
 * Fails if goog.asserts.ENABLE_ASSERTS is true. This function is useful in case
 * when we want to add a check in the unreachable area like switch-case
 * statement:
 *
 * <pre>
 *  switch(type) {
 *    case FOO: doSomething(); break;
 *    case BAR: doSomethingElse(); break;
 *    default: goog.asserts.fail('Unrecognized type: ' + type);
 *      // We have only 2 types - "default:" section is unreachable code.
 *  }
 * </pre>
 *
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @throws {goog.asserts.AssertionError} Failure.
 * @closurePrimitive {asserts.fail}
 */


goog.asserts.fail = function (opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(new goog.asserts.AssertionError('Failure' + (opt_message ? ': ' + opt_message : ''), Array.prototype.slice.call(arguments, 1)));
  }
};
/**
 * Checks if the value is a number if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {number} The value, guaranteed to be a number when asserts enabled.
 * @throws {goog.asserts.AssertionError} When the value is not a number.
 * @closurePrimitive {asserts.matchesReturn}
 */


goog.asserts.assertNumber = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_('Expected number but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }

  return (
    /** @type {number} */
    value
  );
};
/**
 * Checks if the value is a string if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {string} The value, guaranteed to be a string when asserts enabled.
 * @throws {goog.asserts.AssertionError} When the value is not a string.
 * @closurePrimitive {asserts.matchesReturn}
 */


goog.asserts.assertString = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_('Expected string but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }

  return (
    /** @type {string} */
    value
  );
};
/**
 * Checks if the value is a function if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Function} The value, guaranteed to be a function when asserts
 *     enabled.
 * @throws {goog.asserts.AssertionError} When the value is not a function.
 * @closurePrimitive {asserts.matchesReturn}
 */


goog.asserts.assertFunction = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_('Expected function but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }

  return (
    /** @type {!Function} */
    value
  );
};
/**
 * Checks if the value is an Object if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Object} The value, guaranteed to be a non-null object.
 * @throws {goog.asserts.AssertionError} When the value is not an object.
 * @closurePrimitive {asserts.matchesReturn}
 */


goog.asserts.assertObject = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_('Expected object but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }

  return (
    /** @type {!Object} */
    value
  );
};
/**
 * Checks if the value is an Array if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Array<?>} The value, guaranteed to be a non-null array.
 * @throws {goog.asserts.AssertionError} When the value is not an array.
 * @closurePrimitive {asserts.matchesReturn}
 */


goog.asserts.assertArray = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_('Expected array but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }

  return (
    /** @type {!Array<?>} */
    value
  );
};
/**
 * Checks if the value is a boolean if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {boolean} The value, guaranteed to be a boolean when asserts are
 *     enabled.
 * @throws {goog.asserts.AssertionError} When the value is not a boolean.
 * @closurePrimitive {asserts.matchesReturn}
 */


goog.asserts.assertBoolean = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_('Expected boolean but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }

  return (
    /** @type {boolean} */
    value
  );
};
/**
 * Checks if the value is a DOM Element if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Element} The value, likely to be a DOM Element when asserts are
 *     enabled.
 * @throws {goog.asserts.AssertionError} When the value is not an Element.
 * @closurePrimitive {asserts.matchesReturn}
 */


goog.asserts.assertElement = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_('Expected Element but got %s: %s.', [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }

  return (
    /** @type {!Element} */
    value
  );
};
/**
 * Checks if the value is an instance of the user-defined type if
 * goog.asserts.ENABLE_ASSERTS is true.
 *
 * The compiler may tighten the type returned by this function.
 *
 * @param {?} value The value to check.
 * @param {function(new: T, ...)} type A user-defined constructor.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @throws {goog.asserts.AssertionError} When the value is not an instance of
 *     type.
 * @return {T}
 * @template T
 * @closurePrimitive {asserts.matchesReturn}
 */


goog.asserts.assertInstanceof = function (value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_('Expected instanceof %s but got %s.', [goog.asserts.getType_(type), goog.asserts.getType_(value)], opt_message, Array.prototype.slice.call(arguments, 3));
  }

  return value;
};
/**
 * Checks whether the value is a finite number, if goog.asserts.ENABLE_ASSERTS
 * is true.
 *
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @throws {goog.asserts.AssertionError} When the value is not a number, or is
 *     a non-finite number such as NaN, Infinity or -Infinity.
 * @return {number} The value initially passed in.
 */


goog.asserts.assertFinite = function (value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (typeof value != 'number' || !isFinite(value))) {
    goog.asserts.doAssertFailure_('Expected %s to be a finite number but it is not.', [value], opt_message, Array.prototype.slice.call(arguments, 2));
  }

  return (
    /** @type {number} */
    value
  );
};
/**
 * Checks that no enumerable keys are present in Object.prototype. Such keys
 * would break most code that use {@code for (var ... in ...)} loops.
 */


goog.asserts.assertObjectPrototypeIsIntact = function () {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + ' should not be enumerable in Object.prototype.');
  }
};
/**
 * Returns the type of a value. If a constructor is passed, and a suitable
 * string cannot be found, 'unknown type name' will be returned.
 * @param {*} value A constructor, object, or primitive.
 * @return {string} The best display name for the value, or 'unknown type name'.
 * @private
 */


goog.asserts.getType_ = function (value) {
  if (value instanceof Function) {
    return value.displayName || value.name || 'unknown type name';
  } else if (value instanceof Object) {
    return (
      /** @type {string} */
      value.constructor.displayName || value.constructor.name || Object.prototype.toString.call(value)
    );
  } else {
    return value === null ? 'null' : typeof value;
  }
};

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utilities for manipulating arrays.
 *
 * @author arv@google.com (Erik Arvidsson)
 */

goog.provide('goog.array');

goog.require('goog.asserts');
/**
 * @define {boolean} NATIVE_ARRAY_PROTOTYPES indicates whether the code should
 * rely on Array.prototype functions, if available.
 *
 * The Array.prototype functions can be defined by external libraries like
 * Prototype and setting this flag to false forces closure to use its own
 * goog.array implementation.
 *
 * If your javascript can be loaded by a third party site and you are wary about
 * relying on the prototype functions, specify
 * "--define goog.NATIVE_ARRAY_PROTOTYPES=false" to the JSCompiler.
 *
 * Setting goog.TRUSTED_SITE to false will automatically set
 * NATIVE_ARRAY_PROTOTYPES to false.
 */


goog.NATIVE_ARRAY_PROTOTYPES = goog.define('goog.NATIVE_ARRAY_PROTOTYPES', goog.TRUSTED_SITE);
/**
 * @define {boolean} If true, JSCompiler will use the native implementation of
 * array functions where appropriate (e.g., `Array#filter`) and remove the
 * unused pure JS implementation.
 */

goog.array.ASSUME_NATIVE_FUNCTIONS = goog.define('goog.array.ASSUME_NATIVE_FUNCTIONS', false);
/**
 * Returns the last element in an array without removing it.
 * Same as goog.array.last.
 * @param {IArrayLike<T>|string} array The array.
 * @return {T} Last item in array.
 * @template T
 */

goog.array.peek = function (array) {
  return array[array.length - 1];
};
/**
 * Returns the last element in an array without removing it.
 * Same as goog.array.peek.
 * @param {IArrayLike<T>|string} array The array.
 * @return {T} Last item in array.
 * @template T
 */


goog.array.last = goog.array.peek; // NOTE(arv): Since most of the array functions are generic it allows you to
// pass an array-like object. Strings have a length and are considered array-
// like. However, the 'in' operator does not work on strings so we cannot just
// use the array path even if the browser supports indexing into strings. We
// therefore end up splitting the string.

/**
 * Returns the index of the first element of an array with a specified value, or
 * -1 if the element is not present in the array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-indexof}
 *
 * @param {IArrayLike<T>|string} arr The array to be searched.
 * @param {T} obj The object for which we are searching.
 * @param {number=} opt_fromIndex The index at which to start the search. If
 *     omitted the search starts at index 0.
 * @return {number} The index of the first matching array element.
 * @template T
 */

goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function (arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.indexOf.call(arr, obj, opt_fromIndex);
} : function (arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;

  if (goog.isString(arr)) {
    // Array.prototype.indexOf uses === so only strings should be found.
    if (!goog.isString(obj) || obj.length != 1) {
      return -1;
    }

    return arr.indexOf(obj, fromIndex);
  }

  for (var i = fromIndex; i < arr.length; i++) {
    if (i in arr && arr[i] === obj) return i;
  }

  return -1;
};
/**
 * Returns the index of the last element of an array with a specified value, or
 * -1 if the element is not present in the array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-lastindexof}
 *
 * @param {!IArrayLike<T>|string} arr The array to be searched.
 * @param {T} obj The object for which we are searching.
 * @param {?number=} opt_fromIndex The index at which to start the search. If
 *     omitted the search starts at the end of the array.
 * @return {number} The index of the last matching array element.
 * @template T
 */

goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function (arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null); // Firefox treats undefined and null as 0 in the fromIndex argument which
  // leads it to always return -1

  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return Array.prototype.lastIndexOf.call(arr, obj, fromIndex);
} : function (arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;

  if (fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex);
  }

  if (goog.isString(arr)) {
    // Array.prototype.lastIndexOf uses === so only strings should be found.
    if (!goog.isString(obj) || obj.length != 1) {
      return -1;
    }

    return arr.lastIndexOf(obj, fromIndex);
  }

  for (var i = fromIndex; i >= 0; i--) {
    if (i in arr && arr[i] === obj) return i;
  }

  return -1;
};
/**
 * Calls a function for each element in an array. Skips holes in the array.
 * See {@link http://tinyurl.com/developer-mozilla-org-array-foreach}
 *
 * @param {IArrayLike<T>|string} arr Array or array like object over
 *     which to iterate.
 * @param {?function(this: S, T, number, ?): ?} f The function to call for every
 *     element. This function takes 3 arguments (the element, the index and the
 *     array). The return value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @template T,S
 */

goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  Array.prototype.forEach.call(arr, f, opt_obj);
} : function (arr, f, opt_obj) {
  var l = arr.length; // must be fixed during loop... see docs

  var arr2 = goog.isString(arr) ? arr.split('') : arr;

  for (var i = 0; i < l; i++) {
    if (i in arr2) {
      f.call(
      /** @type {?} */
      opt_obj, arr2[i], i, arr);
    }
  }
};
/**
 * Calls a function for each element in an array, starting from the last
 * element rather than the first.
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this: S, T, number, ?): ?} f The function to call for every
 *     element. This function
 *     takes 3 arguments (the element, the index and the array). The return
 *     value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @template T,S
 */

goog.array.forEachRight = function (arr, f, opt_obj) {
  var l = arr.length; // must be fixed during loop... see docs

  var arr2 = goog.isString(arr) ? arr.split('') : arr;

  for (var i = l - 1; i >= 0; --i) {
    if (i in arr2) {
      f.call(
      /** @type {?} */
      opt_obj, arr2[i], i, arr);
    }
  }
};
/**
 * Calls a function for each element in an array, and if the function returns
 * true adds the element to a new array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?):boolean} f The function to call for
 *     every element. This function
 *     takes 3 arguments (the element, the index and the array) and must
 *     return a Boolean. If the return value is true the element is added to the
 *     result array. If it is false the element is not included.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {!Array<T>} a new array in which only elements that passed the test
 *     are present.
 * @template T,S
 */


goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.filter.call(arr, f, opt_obj);
} : function (arr, f, opt_obj) {
  var l = arr.length; // must be fixed during loop... see docs

  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split('') : arr;

  for (var i = 0; i < l; i++) {
    if (i in arr2) {
      var val = arr2[i]; // in case f mutates arr2

      if (f.call(
      /** @type {?} */
      opt_obj, val, i, arr)) {
        res[resLength++] = val;
      }
    }
  }

  return res;
};
/**
 * Calls a function for each element in an array and inserts the result into a
 * new array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-map}
 *
 * @param {IArrayLike<VALUE>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this:THIS, VALUE, number, ?): RESULT} f The function to call
 *     for every element. This function takes 3 arguments (the element,
 *     the index and the array) and should return something. The result will be
 *     inserted into a new array.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within f.
 * @return {!Array<RESULT>} a new array with the results from f.
 * @template THIS, VALUE, RESULT
 */

goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.map.call(arr, f, opt_obj);
} : function (arr, f, opt_obj) {
  var l = arr.length; // must be fixed during loop... see docs

  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split('') : arr;

  for (var i = 0; i < l; i++) {
    if (i in arr2) {
      res[i] = f.call(
      /** @type {?} */
      opt_obj, arr2[i], i, arr);
    }
  }

  return res;
};
/**
 * Passes every element of an array into a function and accumulates the result.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-reduce}
 *
 * For example:
 * var a = [1, 2, 3, 4];
 * goog.array.reduce(a, function(r, v, i, arr) {return r + v;}, 0);
 * returns 10
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {function(this:S, R, T, number, ?) : R} f The function to call for
 *     every element. This function
 *     takes 4 arguments (the function's previous result or the initial value,
 *     the value of the current array element, the current array index, and the
 *     array itself)
 *     function(previousValue, currentValue, index, array).
 * @param {?} val The initial value to pass into the function on the first call.
 * @param {S=} opt_obj  The object to be used as the value of 'this'
 *     within f.
 * @return {R} Result of evaluating f repeatedly across the values of the array.
 * @template T,S,R
 */

goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function (arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);

  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }

  return Array.prototype.reduce.call(arr, f, val);
} : function (arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEach(arr, function (val, index) {
    rval = f.call(
    /** @type {?} */
    opt_obj, rval, val, index, arr);
  });
  return rval;
};
/**
 * Passes every element of an array into a function and accumulates the result,
 * starting from the last element and working towards the first.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-reduceright}
 *
 * For example:
 * var a = ['a', 'b', 'c'];
 * goog.array.reduceRight(a, function(r, v, i, arr) {return r + v;}, '');
 * returns 'cba'
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, R, T, number, ?) : R} f The function to call for
 *     every element. This function
 *     takes 4 arguments (the function's previous result or the initial value,
 *     the value of the current array element, the current array index, and the
 *     array itself)
 *     function(previousValue, currentValue, index, array).
 * @param {?} val The initial value to pass into the function on the first call.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {R} Object returned as a result of evaluating f repeatedly across the
 *     values of the array.
 * @template T,S,R
 */

goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function (arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.asserts.assert(f != null);

  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }

  return Array.prototype.reduceRight.call(arr, f, val);
} : function (arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEachRight(arr, function (val, index) {
    rval = f.call(
    /** @type {?} */
    opt_obj, rval, val, index, arr);
  });
  return rval;
};
/**
 * Calls f for each element of an array. If any call returns true, some()
 * returns true (without checking the remaining elements). If all calls
 * return false, some() returns false.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-some}
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj  The object to be used as the value of 'this'
 *     within f.
 * @return {boolean} true if any element passes the test.
 * @template T,S
 */

goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.some.call(arr, f, opt_obj);
} : function (arr, f, opt_obj) {
  var l = arr.length; // must be fixed during loop... see docs

  var arr2 = goog.isString(arr) ? arr.split('') : arr;

  for (var i = 0; i < l; i++) {
    if (i in arr2 && f.call(
    /** @type {?} */
    opt_obj, arr2[i], i, arr)) {
      return true;
    }
  }

  return false;
};
/**
 * Call f for each element of an array. If all calls return true, every()
 * returns true. If any call returns false, every() returns false and
 * does not continue to check the remaining elements.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-every}
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {boolean} false if any element fails the test.
 * @template T,S
 */

goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function (arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.every.call(arr, f, opt_obj);
} : function (arr, f, opt_obj) {
  var l = arr.length; // must be fixed during loop... see docs

  var arr2 = goog.isString(arr) ? arr.split('') : arr;

  for (var i = 0; i < l; i++) {
    if (i in arr2 && !f.call(
    /** @type {?} */
    opt_obj, arr2[i], i, arr)) {
      return false;
    }
  }

  return true;
};
/**
 * Counts the array elements that fulfill the predicate, i.e. for which the
 * callback function returns true. Skips holes in the array.
 *
 * @param {!IArrayLike<T>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this: S, T, number, ?): boolean} f The function to call for
 *     every element. Takes 3 arguments (the element, the index and the array).
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @return {number} The number of the matching elements.
 * @template T,S
 */

goog.array.count = function (arr, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr, function (element, index, arr) {
    if (f.call(
    /** @type {?} */
    opt_obj, element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
};
/**
 * Search an array for the first element that satisfies a given condition and
 * return that element.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {T|null} The first array element that passes the test, or null if no
 *     element is found.
 * @template T,S
 */


goog.array.find = function (arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
/**
 * Search an array for the first element that satisfies a given condition and
 * return its index.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The index of the first array element that passes the test,
 *     or -1 if no element is found.
 * @template T,S
 */


goog.array.findIndex = function (arr, f, opt_obj) {
  var l = arr.length; // must be fixed during loop... see docs

  var arr2 = goog.isString(arr) ? arr.split('') : arr;

  for (var i = 0; i < l; i++) {
    if (i in arr2 && f.call(
    /** @type {?} */
    opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }

  return -1;
};
/**
 * Search an array (in reverse order) for the last element that satisfies a
 * given condition and return that element.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {T|null} The last array element that passes the test, or null if no
 *     element is found.
 * @template T,S
 */


goog.array.findRight = function (arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
/**
 * Search an array (in reverse order) for the last element that satisfies a
 * given condition and return its index.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The index of the last array element that passes the test,
 *     or -1 if no element is found.
 * @template T,S
 */


goog.array.findIndexRight = function (arr, f, opt_obj) {
  var l = arr.length; // must be fixed during loop... see docs

  var arr2 = goog.isString(arr) ? arr.split('') : arr;

  for (var i = l - 1; i >= 0; i--) {
    if (i in arr2 && f.call(
    /** @type {?} */
    opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }

  return -1;
};
/**
 * Whether the array contains the given object.
 * @param {IArrayLike<?>|string} arr The array to test for the presence of the
 *     element.
 * @param {*} obj The object for which to test.
 * @return {boolean} true if obj is present.
 */


goog.array.contains = function (arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
};
/**
 * Whether the array is empty.
 * @param {IArrayLike<?>|string} arr The array to test.
 * @return {boolean} true if empty.
 */


goog.array.isEmpty = function (arr) {
  return arr.length == 0;
};
/**
 * Clears the array.
 * @param {IArrayLike<?>} arr Array or array like object to clear.
 */


goog.array.clear = function (arr) {
  // For non real arrays we don't have the magic length so we delete the
  // indices.
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1; i >= 0; i--) {
      delete arr[i];
    }
  }

  arr.length = 0;
};
/**
 * Pushes an item into an array, if it's not already in the array.
 * @param {Array<T>} arr Array into which to insert the item.
 * @param {T} obj Value to add.
 * @template T
 */


goog.array.insert = function (arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};
/**
 * Inserts an object at the given index of the array.
 * @param {IArrayLike<?>} arr The array to modify.
 * @param {*} obj The object to insert.
 * @param {number=} opt_i The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */


goog.array.insertAt = function (arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
/**
 * Inserts at the given index of the array, all elements of another array.
 * @param {IArrayLike<?>} arr The array to modify.
 * @param {IArrayLike<?>} elementsToAdd The array of elements to add.
 * @param {number=} opt_i The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */


goog.array.insertArrayAt = function (arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
/**
 * Inserts an object into an array before a specified object.
 * @param {Array<T>} arr The array to modify.
 * @param {T} obj The object to insert.
 * @param {T=} opt_obj2 The object before which obj should be inserted. If obj2
 *     is omitted or not found, obj is inserted at the end of the array.
 * @template T
 */


goog.array.insertBefore = function (arr, obj, opt_obj2) {
  var i;

  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};
/**
 * Removes the first occurrence of a particular value from an array.
 * @param {IArrayLike<T>} arr Array from which to remove
 *     value.
 * @param {T} obj Object to remove.
 * @return {boolean} True if an element was removed.
 * @template T
 */


goog.array.remove = function (arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;

  if (rv = i >= 0) {
    goog.array.removeAt(arr, i);
  }

  return rv;
};
/**
 * Removes the last occurrence of a particular value from an array.
 * @param {!IArrayLike<T>} arr Array from which to remove value.
 * @param {T} obj Object to remove.
 * @return {boolean} True if an element was removed.
 * @template T
 */


goog.array.removeLast = function (arr, obj) {
  var i = goog.array.lastIndexOf(arr, obj);

  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }

  return false;
};
/**
 * Removes from an array the element at index i
 * @param {IArrayLike<?>} arr Array or array like object from which to
 *     remove value.
 * @param {number} i The index to remove.
 * @return {boolean} True if an element was removed.
 */


goog.array.removeAt = function (arr, i) {
  goog.asserts.assert(arr.length != null); // use generic form of splice
  // splice returns the removed items and if successful the length of that
  // will be 1

  return Array.prototype.splice.call(arr, i, 1).length == 1;
};
/**
 * Removes the first value that satisfies the given condition.
 * @param {IArrayLike<T>} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {boolean} True if an element was removed.
 * @template T,S
 */


goog.array.removeIf = function (arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);

  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }

  return false;
};
/**
 * Removes all values that satisfy the given condition.
 * @param {IArrayLike<T>} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The number of items removed
 * @template T,S
 */


goog.array.removeAllIf = function (arr, f, opt_obj) {
  var removedCount = 0;
  goog.array.forEachRight(arr, function (val, index) {
    if (f.call(
    /** @type {?} */
    opt_obj, val, index, arr)) {
      if (goog.array.removeAt(arr, index)) {
        removedCount++;
      }
    }
  });
  return removedCount;
};
/**
 * Returns a new array that is the result of joining the arguments.  If arrays
 * are passed then their items are added, however, if non-arrays are passed they
 * will be added to the return array as is.
 *
 * Note that ArrayLike objects will be added as is, rather than having their
 * items added.
 *
 * goog.array.concat([1, 2], [3, 4]) -> [1, 2, 3, 4]
 * goog.array.concat(0, [1, 2]) -> [0, 1, 2]
 * goog.array.concat([1, 2], null) -> [1, 2, null]
 *
 * There is bug in all current versions of IE (6, 7 and 8) where arrays created
 * in an iframe become corrupted soon (not immediately) after the iframe is
 * destroyed. This is common if loading data via goog.net.IframeIo, for example.
 * This corruption only affects the concat method which will start throwing
 * Catastrophic Errors (#-2147418113).
 *
 * See http://endoflow.com/scratch/corrupted-arrays.html for a test case.
 *
 * Internally goog.array should use this, so that all methods will continue to
 * work on these broken array objects.
 *
 * @param {...*} var_args Items to concatenate.  Arrays will have each item
 *     added, while primitives and objects will be added as is.
 * @return {!Array<?>} The new resultant array.
 */


goog.array.concat = function (var_args) {
  return Array.prototype.concat.apply([], arguments);
};
/**
 * Returns a new array that contains the contents of all the arrays passed.
 * @param {...!Array<T>} var_args
 * @return {!Array<T>}
 * @template T
 */


goog.array.join = function (var_args) {
  return Array.prototype.concat.apply([], arguments);
};
/**
 * Converts an object to an array.
 * @param {IArrayLike<T>|string} object  The object to convert to an
 *     array.
 * @return {!Array<T>} The object converted into an array. If object has a
 *     length property, every property indexed with a non-negative number
 *     less than length will be included in the result. If object does not
 *     have a length property, an empty array will be returned.
 * @template T
 */


goog.array.toArray = function (object) {
  var length = object.length; // If length is not a number the following is false. This case is kept for
  // backwards compatibility since there are callers that pass objects that are
  // not array like.

  if (length > 0) {
    var rv = new Array(length);

    for (var i = 0; i < length; i++) {
      rv[i] = object[i];
    }

    return rv;
  }

  return [];
};
/**
 * Does a shallow copy of an array.
 * @param {IArrayLike<T>|string} arr  Array or array-like object to
 *     clone.
 * @return {!Array<T>} Clone of the input array.
 * @template T
 */


goog.array.clone = goog.array.toArray;
/**
 * Extends an array with another array, element, or "array like" object.
 * This function operates 'in-place', it does not create a new Array.
 *
 * Example:
 * var a = [];
 * goog.array.extend(a, [0, 1]);
 * a; // [0, 1]
 * goog.array.extend(a, 2);
 * a; // [0, 1, 2]
 *
 * @param {Array<VALUE>} arr1  The array to modify.
 * @param {...(IArrayLike<VALUE>|VALUE)} var_args The elements or arrays of
 *     elements to add to arr1.
 * @template VALUE
 */

goog.array.extend = function (arr1, var_args) {
  for (var i = 1; i < arguments.length; i++) {
    var arr2 = arguments[i];

    if (goog.isArrayLike(arr2)) {
      var len1 = arr1.length || 0;
      var len2 = arr2.length || 0;
      arr1.length = len1 + len2;

      for (var j = 0; j < len2; j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
};
/**
 * Adds or removes elements from an array. This is a generic version of Array
 * splice. This means that it might work on other objects similar to arrays,
 * such as the arguments object.
 *
 * @param {IArrayLike<T>} arr The array to modify.
 * @param {number|undefined} index The index at which to start changing the
 *     array. If not defined, treated as 0.
 * @param {number} howMany How many elements to remove (0 means no removal. A
 *     value below 0 is treated as zero and so is any other non number. Numbers
 *     are floored).
 * @param {...T} var_args Optional, additional elements to insert into the
 *     array.
 * @return {!Array<T>} the removed elements.
 * @template T
 */


goog.array.splice = function (arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return Array.prototype.splice.apply(arr, goog.array.slice(arguments, 1));
};
/**
 * Returns a new array from a segment of an array. This is a generic version of
 * Array slice. This means that it might work on other objects similar to
 * arrays, such as the arguments object.
 *
 * @param {IArrayLike<T>|string} arr The array from
 * which to copy a segment.
 * @param {number} start The index of the first element to copy.
 * @param {number=} opt_end The index after the last element to copy.
 * @return {!Array<T>} A new array containing the specified segment of the
 *     original array.
 * @template T
 */


goog.array.slice = function (arr, start, opt_end) {
  goog.asserts.assert(arr.length != null); // passing 1 arg to slice is not the same as passing 2 where the second is
  // null or undefined (in that case the second argument is treated as 0).
  // we could use slice on the arguments object and then use apply instead of
  // testing the length

  if (arguments.length <= 2) {
    return Array.prototype.slice.call(arr, start);
  } else {
    return Array.prototype.slice.call(arr, start, opt_end);
  }
};
/**
 * Removes all duplicates from an array (retaining only the first
 * occurrence of each array element).  This function modifies the
 * array in place and doesn't change the order of the non-duplicate items.
 *
 * For objects, duplicates are identified as having the same unique ID as
 * defined by {@link goog.getUid}.
 *
 * Alternatively you can specify a custom hash function that returns a unique
 * value for each item in the array it should consider unique.
 *
 * Runtime: N,
 * Worstcase space: 2N (no dupes)
 *
 * @param {IArrayLike<T>} arr The array from which to remove
 *     duplicates.
 * @param {Array=} opt_rv An optional array in which to return the results,
 *     instead of performing the removal inplace.  If specified, the original
 *     array will remain unchanged.
 * @param {function(T):string=} opt_hashFn An optional function to use to
 *     apply to every item in the array. This function should return a unique
 *     value for each item in the array it should consider unique.
 * @template T
 */


goog.array.removeDuplicates = function (arr, opt_rv, opt_hashFn) {
  var returnArray = opt_rv || arr;

  var defaultHashFn = function (item) {
    // Prefix each type with a single character representing the type to
    // prevent conflicting keys (e.g. true and 'true').
    return goog.isObject(item) ? 'o' + goog.getUid(item) : (typeof item).charAt(0) + item;
  };

  var hashFn = opt_hashFn || defaultHashFn;
  var seen = {},
      cursorInsert = 0,
      cursorRead = 0;

  while (cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = hashFn(current);

    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }

  returnArray.length = cursorInsert;
};
/**
 * Searches the specified array for the specified target using the binary
 * search algorithm.  If no opt_compareFn is specified, elements are compared
 * using <code>goog.array.defaultCompare</code>, which compares the elements
 * using the built in < and > operators.  This will produce the expected
 * behavior for homogeneous arrays of String(s) and Number(s). The array
 * specified <b>must</b> be sorted in ascending order (as defined by the
 * comparison function).  If the array is not sorted, results are undefined.
 * If the array contains multiple instances of the specified target value, any
 * of these instances may be found.
 *
 * Runtime: O(log n)
 *
 * @param {IArrayLike<VALUE>} arr The array to be searched.
 * @param {TARGET} target The sought value.
 * @param {function(TARGET, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is ordered. Should take 2 arguments to
 *     compare, the target value and an element from your array, and return a
 *     negative number, zero, or a positive number depending on whether the
 *     first argument is less than, equal to, or greater than the second.
 * @return {number} Lowest index of the target value if found, otherwise
 *     (-(insertion point) - 1). The insertion point is where the value should
 *     be inserted into arr to preserve the sorted property.  Return value >= 0
 *     iff target is found.
 * @template TARGET, VALUE
 */


goog.array.binarySearch = function (arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false
  /* isEvaluator */
  , target);
};
/**
 * Selects an index in the specified array using the binary search algorithm.
 * The evaluator receives an element and determines whether the desired index
 * is before, at, or after it.  The evaluator must be consistent (formally,
 * goog.array.map(goog.array.map(arr, evaluator, opt_obj), goog.math.sign)
 * must be monotonically non-increasing).
 *
 * Runtime: O(log n)
 *
 * @param {IArrayLike<VALUE>} arr The array to be searched.
 * @param {function(this:THIS, VALUE, number, ?): number} evaluator
 *     Evaluator function that receives 3 arguments (the element, the index and
 *     the array). Should return a negative number, zero, or a positive number
 *     depending on whether the desired index is before, at, or after the
 *     element passed to it.
 * @param {THIS=} opt_obj The object to be used as the value of 'this'
 *     within evaluator.
 * @return {number} Index of the leftmost element matched by the evaluator, if
 *     such exists; otherwise (-(insertion point) - 1). The insertion point is
 *     the index of the first element for which the evaluator returns negative,
 *     or arr.length if no such element exists. The return value is non-negative
 *     iff a match is found.
 * @template THIS, VALUE
 */


goog.array.binarySelect = function (arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true
  /* isEvaluator */
  , undefined
  /* opt_target */
  , opt_obj);
};
/**
 * Implementation of a binary search algorithm which knows how to use both
 * comparison functions and evaluators. If an evaluator is provided, will call
 * the evaluator with the given optional data object, conforming to the
 * interface defined in binarySelect. Otherwise, if a comparison function is
 * provided, will call the comparison function against the given data object.
 *
 * This implementation purposefully does not use goog.bind or goog.partial for
 * performance reasons.
 *
 * Runtime: O(log n)
 *
 * @param {IArrayLike<?>} arr The array to be searched.
 * @param {function(?, ?, ?): number | function(?, ?): number} compareFn
 *     Either an evaluator or a comparison function, as defined by binarySearch
 *     and binarySelect above.
 * @param {boolean} isEvaluator Whether the function is an evaluator or a
 *     comparison function.
 * @param {?=} opt_target If the function is a comparison function, then
 *     this is the target to binary search for.
 * @param {Object=} opt_selfObj If the function is an evaluator, this is an
 *     optional this object for the evaluator.
 * @return {number} Lowest index of the target value if found, otherwise
 *     (-(insertion point) - 1). The insertion point is where the value should
 *     be inserted into arr to preserve the sorted property.  Return value >= 0
 *     iff target is found.
 * @private
 */


goog.array.binarySearch_ = function (arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0; // inclusive

  var right = arr.length; // exclusive

  var found;

  while (left < right) {
    var middle = left + right >> 1;
    var compareResult;

    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      // NOTE(dimvar): To avoid this cast, we'd have to use function overloading
      // for the type of binarySearch_, which the type system can't express yet.
      compareResult =
      /** @type {function(?, ?): number} */
      compareFn(opt_target, arr[middle]);
    }

    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle; // We are looking for the lowest index so we can't return immediately.

      found = !compareResult;
    }
  } // left is the index if found, or the insertion point otherwise.
  // ~left is a shorthand for -left - 1.


  return found ? left : ~left;
};
/**
 * Sorts the specified array into ascending order.  If no opt_compareFn is
 * specified, elements are compared using
 * <code>goog.array.defaultCompare</code>, which compares the elements using
 * the built in < and > operators.  This will produce the expected behavior
 * for homogeneous arrays of String(s) and Number(s), unlike the native sort,
 * but will give unpredictable results for heterogeneous lists of strings and
 * numbers with different numbers of digits.
 *
 * This sort is not guaranteed to be stable.
 *
 * Runtime: Same as <code>Array.prototype.sort</code>
 *
 * @param {Array<T>} arr The array to be sorted.
 * @param {?function(T,T):number=} opt_compareFn Optional comparison
 *     function by which the
 *     array is to be ordered. Should take 2 arguments to compare, and return a
 *     negative number, zero, or a positive number depending on whether the
 *     first argument is less than, equal to, or greater than the second.
 * @template T
 */


goog.array.sort = function (arr, opt_compareFn) {
  // TODO(arv): Update type annotation since null is not accepted.
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
/**
 * Sorts the specified array into ascending order in a stable way.  If no
 * opt_compareFn is specified, elements are compared using
 * <code>goog.array.defaultCompare</code>, which compares the elements using
 * the built in < and > operators.  This will produce the expected behavior
 * for homogeneous arrays of String(s) and Number(s).
 *
 * Runtime: Same as <code>Array.prototype.sort</code>, plus an additional
 * O(n) overhead of copying the array twice.
 *
 * @param {Array<T>} arr The array to be sorted.
 * @param {?function(T, T): number=} opt_compareFn Optional comparison function
 *     by which the array is to be ordered. Should take 2 arguments to compare,
 *     and return a negative number, zero, or a positive number depending on
 *     whether the first argument is less than, equal to, or greater than the
 *     second.
 * @template T
 */


goog.array.stableSort = function (arr, opt_compareFn) {
  var compArr = new Array(arr.length);

  for (var i = 0; i < arr.length; i++) {
    compArr[i] = {
      index: i,
      value: arr[i]
    };
  }

  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;

  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }

  goog.array.sort(compArr, stableCompareFn);

  for (var i = 0; i < arr.length; i++) {
    arr[i] = compArr[i].value;
  }
};
/**
 * Sort the specified array into ascending order based on item keys
 * returned by the specified key function.
 * If no opt_compareFn is specified, the keys are compared in ascending order
 * using <code>goog.array.defaultCompare</code>.
 *
 * Runtime: O(S(f(n)), where S is runtime of <code>goog.array.sort</code>
 * and f(n) is runtime of the key function.
 *
 * @param {Array<T>} arr The array to be sorted.
 * @param {function(T): K} keyFn Function taking array element and returning
 *     a key used for sorting this element.
 * @param {?function(K, K): number=} opt_compareFn Optional comparison function
 *     by which the keys are to be ordered. Should take 2 arguments to compare,
 *     and return a negative number, zero, or a positive number depending on
 *     whether the first argument is less than, equal to, or greater than the
 *     second.
 * @template T,K
 */


goog.array.sortByKey = function (arr, keyFn, opt_compareFn) {
  var keyCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function (a, b) {
    return keyCompareFn(keyFn(a), keyFn(b));
  });
};
/**
 * Sorts an array of objects by the specified object key and compare
 * function. If no compare function is provided, the key values are
 * compared in ascending order using <code>goog.array.defaultCompare</code>.
 * This won't work for keys that get renamed by the compiler. So use
 * {'foo': 1, 'bar': 2} rather than {foo: 1, bar: 2}.
 * @param {Array<Object>} arr An array of objects to sort.
 * @param {string} key The object key to sort by.
 * @param {Function=} opt_compareFn The function to use to compare key
 *     values.
 */


goog.array.sortObjectsByKey = function (arr, key, opt_compareFn) {
  goog.array.sortByKey(arr, function (obj) {
    return obj[key];
  }, opt_compareFn);
};
/**
 * Tells if the array is sorted.
 * @param {!IArrayLike<T>} arr The array.
 * @param {?function(T,T):number=} opt_compareFn Function to compare the
 *     array elements.
 *     Should take 2 arguments to compare, and return a negative number, zero,
 *     or a positive number depending on whether the first argument is less
 *     than, equal to, or greater than the second.
 * @param {boolean=} opt_strict If true no equal elements are allowed.
 * @return {boolean} Whether the array is sorted.
 * @template T
 */


goog.array.isSorted = function (arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;

  for (var i = 1; i < arr.length; i++) {
    var compareResult = compare(arr[i - 1], arr[i]);

    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }

  return true;
};
/**
 * Compares two arrays for equality. Two arrays are considered equal if they
 * have the same length and their corresponding elements are equal according to
 * the comparison function.
 *
 * @param {IArrayLike<?>} arr1 The first array to compare.
 * @param {IArrayLike<?>} arr2 The second array to compare.
 * @param {Function=} opt_equalsFn Optional comparison function.
 *     Should take 2 arguments to compare, and return true if the arguments
 *     are equal. Defaults to {@link goog.array.defaultCompareEquality} which
 *     compares the elements using the built-in '===' operator.
 * @return {boolean} Whether the two arrays are equal.
 */


goog.array.equals = function (arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false;
  }

  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;

  for (var i = 0; i < l; i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
};
/**
 * 3-way array compare function.
 * @param {!IArrayLike<VALUE>} arr1 The first array to
 *     compare.
 * @param {!IArrayLike<VALUE>} arr2 The second array to
 *     compare.
 * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is to be ordered. Should take 2 arguments to
 *     compare, and return a negative number, zero, or a positive number
 *     depending on whether the first argument is less than, equal to, or
 *     greater than the second.
 * @return {number} Negative number, zero, or a positive number depending on
 *     whether the first argument is less than, equal to, or greater than the
 *     second.
 * @template VALUE
 */


goog.array.compare3 = function (arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);

  for (var i = 0; i < l; i++) {
    var result = compare(arr1[i], arr2[i]);

    if (result != 0) {
      return result;
    }
  }

  return goog.array.defaultCompare(arr1.length, arr2.length);
};
/**
 * Compares its two arguments for order, using the built in < and >
 * operators.
 * @param {VALUE} a The first object to be compared.
 * @param {VALUE} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is less than, equal to, or greater than the second,
 *     respectively.
 * @template VALUE
 */


goog.array.defaultCompare = function (a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
/**
 * Compares its two arguments for inverse order, using the built in < and >
 * operators.
 * @param {VALUE} a The first object to be compared.
 * @param {VALUE} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is greater than, equal to, or less than the second,
 *     respectively.
 * @template VALUE
 */


goog.array.inverseDefaultCompare = function (a, b) {
  return -goog.array.defaultCompare(a, b);
};
/**
 * Compares its two arguments for equality, using the built in === operator.
 * @param {*} a The first object to compare.
 * @param {*} b The second object to compare.
 * @return {boolean} True if the two arguments are equal, false otherwise.
 */


goog.array.defaultCompareEquality = function (a, b) {
  return a === b;
};
/**
 * Inserts a value into a sorted array. The array is not modified if the
 * value is already present.
 * @param {IArrayLike<VALUE>} array The array to modify.
 * @param {VALUE} value The object to insert.
 * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is ordered. Should take 2 arguments to
 *     compare, and return a negative number, zero, or a positive number
 *     depending on whether the first argument is less than, equal to, or
 *     greater than the second.
 * @return {boolean} True if an element was inserted.
 * @template VALUE
 */


goog.array.binaryInsert = function (array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);

  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true;
  }

  return false;
};
/**
 * Removes a value from a sorted array.
 * @param {!IArrayLike<VALUE>} array The array to modify.
 * @param {VALUE} value The object to remove.
 * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is ordered. Should take 2 arguments to
 *     compare, and return a negative number, zero, or a positive number
 *     depending on whether the first argument is less than, equal to, or
 *     greater than the second.
 * @return {boolean} True if an element was removed.
 * @template VALUE
 */


goog.array.binaryRemove = function (array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false;
};
/**
 * Splits an array into disjoint buckets according to a splitting function.
 * @param {IArrayLike<T>} array The array.
 * @param {function(this:S, T, number, !IArrayLike<T>):?} sorter Function to
 *     call for every element.  This takes 3 arguments (the element, the index
 *     and the array) and must return a valid object key (a string, number,
 *     etc), or undefined, if that object should not be placed in a bucket.
 * @param {S=} opt_obj The object to be used as the value of 'this' within
 *     sorter.
 * @return {!Object<!Array<T>>} An object, with keys being all of the unique
 *     return values of sorter, and values being arrays containing the items for
 *     which the splitter returned that key.
 * @template T,S
 */


goog.array.bucket = function (array, sorter, opt_obj) {
  var buckets = {};

  for (var i = 0; i < array.length; i++) {
    var value = array[i];
    var key = sorter.call(
    /** @type {?} */
    opt_obj, value, i, array);

    if (goog.isDef(key)) {
      // Push the value to the right bucket, creating it if necessary.
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }

  return buckets;
};
/**
 * Creates a new object built from the provided array and the key-generation
 * function.
 * @param {IArrayLike<T>} arr Array or array like object over
 *     which to iterate whose elements will be the values in the new object.
 * @param {?function(this:S, T, number, ?) : string} keyFunc The function to
 *     call for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a string that will be used as the
 *     key for the element in the new object. If the function returns the same
 *     key for more than one element, the value for that key is
 *     implementation-defined.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within keyFunc.
 * @return {!Object<T>} The new object.
 * @template T,S
 */


goog.array.toObject = function (arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function (element, index) {
    ret[keyFunc.call(
    /** @type {?} */
    opt_obj, element, index, arr)] = element;
  });
  return ret;
};
/**
 * Creates a range of numbers in an arithmetic progression.
 *
 * Range takes 1, 2, or 3 arguments:
 * <pre>
 * range(5) is the same as range(0, 5, 1) and produces [0, 1, 2, 3, 4]
 * range(2, 5) is the same as range(2, 5, 1) and produces [2, 3, 4]
 * range(-2, -5, -1) produces [-2, -3, -4]
 * range(-2, -5, 1) produces [], since stepping by 1 wouldn't ever reach -5.
 * </pre>
 *
 * @param {number} startOrEnd The starting value of the range if an end argument
 *     is provided. Otherwise, the start value is 0, and this is the end value.
 * @param {number=} opt_end The optional end value of the range.
 * @param {number=} opt_step The step size between range values. Defaults to 1
 *     if opt_step is undefined or 0.
 * @return {!Array<number>} An array of numbers for the requested range. May be
 *     an empty array if adding the step would not converge toward the end
 *     value.
 */


goog.array.range = function (startOrEnd, opt_end, opt_step) {
  var array = [];
  var start = 0;
  var end = startOrEnd;
  var step = opt_step || 1;

  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }

  if (step * (end - start) < 0) {
    // Sign mismatch: start + step will never reach the end value.
    return [];
  }

  if (step > 0) {
    for (var i = start; i < end; i += step) {
      array.push(i);
    }
  } else {
    for (var i = start; i > end; i += step) {
      array.push(i);
    }
  }

  return array;
};
/**
 * Returns an array consisting of the given value repeated N times.
 *
 * @param {VALUE} value The value to repeat.
 * @param {number} n The repeat count.
 * @return {!Array<VALUE>} An array with the repeated value.
 * @template VALUE
 */


goog.array.repeat = function (value, n) {
  var array = [];

  for (var i = 0; i < n; i++) {
    array[i] = value;
  }

  return array;
};
/**
 * Returns an array consisting of every argument with all arrays
 * expanded in-place recursively.
 *
 * @param {...*} var_args The values to flatten.
 * @return {!Array<?>} An array containing the flattened values.
 */


goog.array.flatten = function (var_args) {
  var CHUNK_SIZE = 8192;
  var result = [];

  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];

    if (goog.isArray(element)) {
      for (var c = 0; c < element.length; c += CHUNK_SIZE) {
        var chunk = goog.array.slice(element, c, c + CHUNK_SIZE);
        var recurseResult = goog.array.flatten.apply(null, chunk);

        for (var r = 0; r < recurseResult.length; r++) {
          result.push(recurseResult[r]);
        }
      }
    } else {
      result.push(element);
    }
  }

  return result;
};
/**
 * Rotates an array in-place. After calling this method, the element at
 * index i will be the element previously at index (i - n) %
 * array.length, for all values of i between 0 and array.length - 1,
 * inclusive.
 *
 * For example, suppose list comprises [t, a, n, k, s]. After invoking
 * rotate(array, 1) (or rotate(array, -4)), array will comprise [s, t, a, n, k].
 *
 * @param {!Array<T>} array The array to rotate.
 * @param {number} n The amount to rotate.
 * @return {!Array<T>} The array.
 * @template T
 */


goog.array.rotate = function (array, n) {
  goog.asserts.assert(array.length != null);

  if (array.length) {
    n %= array.length;

    if (n > 0) {
      Array.prototype.unshift.apply(array, array.splice(-n, n));
    } else if (n < 0) {
      Array.prototype.push.apply(array, array.splice(0, -n));
    }
  }

  return array;
};
/**
 * Moves one item of an array to a new position keeping the order of the rest
 * of the items. Example use case: keeping a list of JavaScript objects
 * synchronized with the corresponding list of DOM elements after one of the
 * elements has been dragged to a new position.
 * @param {!IArrayLike<?>} arr The array to modify.
 * @param {number} fromIndex Index of the item to move between 0 and
 *     {@code arr.length - 1}.
 * @param {number} toIndex Target index between 0 and {@code arr.length - 1}.
 */


goog.array.moveItem = function (arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length); // Remove 1 item at fromIndex.

  var removedItems = Array.prototype.splice.call(arr, fromIndex, 1); // Insert the removed item at toIndex.

  Array.prototype.splice.call(arr, toIndex, 0, removedItems[0]); // We don't use goog.array.insertAt and goog.array.removeAt, because they're
  // significantly slower than splice.
};
/**
 * Creates a new array for which the element at position i is an array of the
 * ith element of the provided arrays.  The returned array will only be as long
 * as the shortest array provided; additional values are ignored.  For example,
 * the result of zipping [1, 2] and [3, 4, 5] is [[1,3], [2, 4]].
 *
 * This is similar to the zip() function in Python.  See {@link
 * http://docs.python.org/library/functions.html#zip}
 *
 * @param {...!IArrayLike<?>} var_args Arrays to be combined.
 * @return {!Array<!Array<?>>} A new array of arrays created from
 *     provided arrays.
 */


goog.array.zip = function (var_args) {
  if (!arguments.length) {
    return [];
  }

  var result = [];
  var minLen = arguments[0].length;

  for (var i = 1; i < arguments.length; i++) {
    if (arguments[i].length < minLen) {
      minLen = arguments[i].length;
    }
  }

  for (var i = 0; i < minLen; i++) {
    var value = [];

    for (var j = 0; j < arguments.length; j++) {
      value.push(arguments[j][i]);
    }

    result.push(value);
  }

  return result;
};
/**
 * Shuffles the values in the specified array using the Fisher-Yates in-place
 * shuffle (also known as the Knuth Shuffle). By default, calls Math.random()
 * and so resets the state of that random number generator. Similarly, may reset
 * the state of any other specified random number generator.
 *
 * Runtime: O(n)
 *
 * @param {!Array<?>} arr The array to be shuffled.
 * @param {function():number=} opt_randFn Optional random function to use for
 *     shuffling.
 *     Takes no arguments, and returns a random number on the interval [0, 1).
 *     Defaults to Math.random() using JavaScript's built-in Math library.
 */


goog.array.shuffle = function (arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;

  for (var i = arr.length - 1; i > 0; i--) {
    // Choose a random array index in [0, i] (inclusive with i).
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
/**
 * Returns a new array of elements from arr, based on the indexes of elements
 * provided by index_arr. For example, the result of index copying
 * ['a', 'b', 'c'] with index_arr [1,0,0,2] is ['b', 'a', 'a', 'c'].
 *
 * @param {!IArrayLike<T>} arr The array to get a indexed copy from.
 * @param {!IArrayLike<number>} index_arr An array of indexes to get from arr.
 * @return {!Array<T>} A new array of elements from arr in index_arr order.
 * @template T
 */


goog.array.copyByIndex = function (arr, index_arr) {
  var result = [];
  goog.array.forEach(index_arr, function (index) {
    result.push(arr[index]);
  });
  return result;
};
/**
 * Maps each element of the input array into zero or more elements of the output
 * array.
 *
 * @param {!IArrayLike<VALUE>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this:THIS, VALUE, number, ?): !Array<RESULT>} f The function
 *     to call for every element. This function takes 3 arguments (the element,
 *     the index and the array) and should return an array. The result will be
 *     used to extend a new array.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within f.
 * @return {!Array<RESULT>} a new array with the concatenation of all arrays
 *     returned from f.
 * @template THIS, VALUE, RESULT
 */


goog.array.concatMap = function (arr, f, opt_obj) {
  return goog.array.concat.apply([], goog.array.map(arr, f, opt_obj));
};

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Additional mathematical functions.
 */

goog.provide('goog.math');

goog.require('goog.array');

goog.require('goog.asserts');
/**
 * Returns a random integer greater than or equal to 0 and less than `a`.
 * @param {number} a  The upper bound for the random integer (exclusive).
 * @return {number} A random integer N such that 0 <= N < a.
 */


goog.math.randomInt = function (a) {
  return Math.floor(Math.random() * a);
};
/**
 * Returns a random number greater than or equal to `a` and less than
 * `b`.
 * @param {number} a  The lower bound for the random number (inclusive).
 * @param {number} b  The upper bound for the random number (exclusive).
 * @return {number} A random number N such that a <= N < b.
 */


goog.math.uniformRandom = function (a, b) {
  return a + Math.random() * (b - a);
};
/**
 * Takes a number and clamps it to within the provided bounds.
 * @param {number} value The input number.
 * @param {number} min The minimum value to return.
 * @param {number} max The maximum value to return.
 * @return {number} The input number if it is within bounds, or the nearest
 *     number within the bounds.
 */


goog.math.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};
/**
 * The % operator in JavaScript returns the remainder of a / b, but differs from
 * some other languages in that the result will have the same sign as the
 * dividend. For example, -1 % 8 == -1, whereas in some other languages
 * (such as Python) the result would be 7. This function emulates the more
 * correct modulo behavior, which is useful for certain applications such as
 * calculating an offset index in a circular list.
 *
 * @param {number} a The dividend.
 * @param {number} b The divisor.
 * @return {number} a % b where the result is between 0 and b (either 0 <= x < b
 *     or b < x <= 0, depending on the sign of b).
 */


goog.math.modulo = function (a, b) {
  var r = a % b; // If r and b differ in sign, add b to wrap the result to the correct sign.

  return r * b < 0 ? r + b : r;
};
/**
 * Performs linear interpolation between values a and b. Returns the value
 * between a and b proportional to x (when x is between 0 and 1. When x is
 * outside this range, the return value is a linear extrapolation).
 * @param {number} a A number.
 * @param {number} b A number.
 * @param {number} x The proportion between a and b.
 * @return {number} The interpolated value between a and b.
 */


goog.math.lerp = function (a, b, x) {
  return a + x * (b - a);
};
/**
 * Tests whether the two values are equal to each other, within a certain
 * tolerance to adjust for floating point errors.
 * @param {number} a A number.
 * @param {number} b A number.
 * @param {number=} opt_tolerance Optional tolerance range. Defaults
 *     to 0.000001. If specified, should be greater than 0.
 * @return {boolean} Whether `a` and `b` are nearly equal.
 */


goog.math.nearlyEquals = function (a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 0.000001);
}; // TODO(user): Rename to normalizeAngle, retaining old name as deprecated
// alias.

/**
 * Normalizes an angle to be in range [0-360). Angles outside this range will
 * be normalized to be the equivalent angle with that range.
 * @param {number} angle Angle in degrees.
 * @return {number} Standardized angle.
 */


goog.math.standardAngle = function (angle) {
  return goog.math.modulo(angle, 360);
};
/**
 * Normalizes an angle to be in range [0-2*PI). Angles outside this range will
 * be normalized to be the equivalent angle with that range.
 * @param {number} angle Angle in radians.
 * @return {number} Standardized angle.
 */


goog.math.standardAngleInRadians = function (angle) {
  return goog.math.modulo(angle, 2 * Math.PI);
};
/**
 * Converts degrees to radians.
 * @param {number} angleDegrees Angle in degrees.
 * @return {number} Angle in radians.
 */


goog.math.toRadians = function (angleDegrees) {
  return angleDegrees * Math.PI / 180;
};
/**
 * Converts radians to degrees.
 * @param {number} angleRadians Angle in radians.
 * @return {number} Angle in degrees.
 */


goog.math.toDegrees = function (angleRadians) {
  return angleRadians * 180 / Math.PI;
};
/**
 * For a given angle and radius, finds the X portion of the offset.
 * @param {number} degrees Angle in degrees (zero points in +X direction).
 * @param {number} radius Radius.
 * @return {number} The x-distance for the angle and radius.
 */


goog.math.angleDx = function (degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees));
};
/**
 * For a given angle and radius, finds the Y portion of the offset.
 * @param {number} degrees Angle in degrees (zero points in +X direction).
 * @param {number} radius Radius.
 * @return {number} The y-distance for the angle and radius.
 */


goog.math.angleDy = function (degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees));
};
/**
 * Computes the angle between two points (x1,y1) and (x2,y2).
 * Angle zero points in the +X direction, 90 degrees points in the +Y
 * direction (down) and from there we grow clockwise towards 360 degrees.
 * @param {number} x1 x of first point.
 * @param {number} y1 y of first point.
 * @param {number} x2 x of second point.
 * @param {number} y2 y of second point.
 * @return {number} Standardized angle in degrees of the vector from
 *     x1,y1 to x2,y2.
 */


goog.math.angle = function (x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};
/**
 * Computes the difference between startAngle and endAngle (angles in degrees).
 * @param {number} startAngle  Start angle in degrees.
 * @param {number} endAngle  End angle in degrees.
 * @return {number} The number of degrees that when added to
 *     startAngle will result in endAngle. Positive numbers mean that the
 *     direction is clockwise. Negative numbers indicate a counter-clockwise
 *     direction.
 *     The shortest route (clockwise vs counter-clockwise) between the angles
 *     is used.
 *     When the difference is 180 degrees, the function returns 180 (not -180)
 *     angleDifference(30, 40) is 10, and angleDifference(40, 30) is -10.
 *     angleDifference(350, 10) is 20, and angleDifference(10, 350) is -20.
 */


goog.math.angleDifference = function (startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);

  if (d > 180) {
    d = d - 360;
  } else if (d <= -180) {
    d = 360 + d;
  }

  return d;
};
/**
 * Returns the sign of a number as per the "sign" or "signum" function.
 * @param {number} x The number to take the sign of.
 * @return {number} -1 when negative, 1 when positive, 0 when 0. Preserves
 *     signed zeros and NaN.
 */


goog.math.sign = function (x) {
  if (x > 0) {
    return 1;
  }

  if (x < 0) {
    return -1;
  }

  return x; // Preserves signed zeros and NaN.
};
/**
 * JavaScript implementation of Longest Common Subsequence problem.
 * http://en.wikipedia.org/wiki/Longest_common_subsequence
 *
 * Returns the longest possible array that is subarray of both of given arrays.
 *
 * @param {IArrayLike<S>} array1 First array of objects.
 * @param {IArrayLike<T>} array2 Second array of objects.
 * @param {Function=} opt_compareFn Function that acts as a custom comparator
 *     for the array ojects. Function should return true if objects are equal,
 *     otherwise false.
 * @param {Function=} opt_collectorFn Function used to decide what to return
 *     as a result subsequence. It accepts 2 arguments: index of common element
 *     in the first array and index in the second. The default function returns
 *     element from the first array.
 * @return {!Array<S|T>} A list of objects that are common to both arrays
 *     such that there is no common subsequence with size greater than the
 *     length of the list.
 * @template S,T
 */


goog.math.longestCommonSubsequence = function (array1, array2, opt_compareFn, opt_collectorFn) {
  var compare = opt_compareFn || function (a, b) {
    return a == b;
  };

  var collect = opt_collectorFn || function (i1, i2) {
    return array1[i1];
  };

  var length1 = array1.length;
  var length2 = array2.length;
  var arr = [];

  for (var i = 0; i < length1 + 1; i++) {
    arr[i] = [];
    arr[i][0] = 0;
  }

  for (var j = 0; j < length2 + 1; j++) {
    arr[0][j] = 0;
  }

  for (i = 1; i <= length1; i++) {
    for (j = 1; j <= length2; j++) {
      if (compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
      }
    }
  } // Backtracking


  var result = [];
  var i = length1,
      j = length2;

  while (i > 0 && j > 0) {
    if (compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--;
    } else {
      if (arr[i - 1][j] > arr[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
  }

  return result;
};
/**
 * Returns the sum of the arguments.
 * @param {...number} var_args Numbers to add.
 * @return {number} The sum of the arguments (0 if no arguments were provided,
 *     `NaN` if any of the arguments is not a valid number).
 */


goog.math.sum = function (var_args) {
  return (
    /** @type {number} */
    goog.array.reduce(arguments, function (sum, value) {
      return sum + value;
    }, 0)
  );
};
/**
 * Returns the arithmetic mean of the arguments.
 * @param {...number} var_args Numbers to average.
 * @return {number} The average of the arguments (`NaN` if no arguments
 *     were provided or any of the arguments is not a valid number).
 */


goog.math.average = function (var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
/**
 * Returns the unbiased sample variance of the arguments. For a definition,
 * see e.g. http://en.wikipedia.org/wiki/Variance
 * @param {...number} var_args Number samples to analyze.
 * @return {number} The unbiased sample variance of the arguments (0 if fewer
 *     than two samples were provided, or `NaN` if any of the samples is
 *     not a valid number).
 */


goog.math.sampleVariance = function (var_args) {
  var sampleSize = arguments.length;

  if (sampleSize < 2) {
    return 0;
  }

  var mean = goog.math.average.apply(null, arguments);
  var variance = goog.math.sum.apply(null, goog.array.map(arguments, function (val) {
    return Math.pow(val - mean, 2);
  })) / (sampleSize - 1);
  return variance;
};
/**
 * Returns the sample standard deviation of the arguments.  For a definition of
 * sample standard deviation, see e.g.
 * http://en.wikipedia.org/wiki/Standard_deviation
 * @param {...number} var_args Number samples to analyze.
 * @return {number} The sample standard deviation of the arguments (0 if fewer
 *     than two samples were provided, or `NaN` if any of the samples is
 *     not a valid number).
 */


goog.math.standardDeviation = function (var_args) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
/**
 * Returns whether the supplied number represents an integer, i.e. that is has
 * no fractional component.  No range-checking is performed on the number.
 * @param {number} num The number to test.
 * @return {boolean} Whether `num` is an integer.
 */


goog.math.isInt = function (num) {
  return isFinite(num) && num % 1 == 0;
};
/**
 * Returns whether the supplied number is finite and not NaN.
 * @param {number} num The number to test.
 * @return {boolean} Whether `num` is a finite number.
 * @deprecated Use {@link isFinite} instead.
 */


goog.math.isFiniteNumber = function (num) {
  return isFinite(num);
};
/**
 * @param {number} num The number to test.
 * @return {boolean} Whether it is negative zero.
 */


goog.math.isNegativeZero = function (num) {
  return num == 0 && 1 / num < 0;
};
/**
 * Returns the precise value of floor(log10(num)).
 * Simpler implementations didn't work because of floating point rounding
 * errors. For example
 * <ul>
 * <li>Math.floor(Math.log(num) / Math.LN10) is off by one for num == 1e+3.
 * <li>Math.floor(Math.log(num) * Math.LOG10E) is off by one for num == 1e+15.
 * <li>Math.floor(Math.log10(num)) is off by one for num == 1e+15 - 1.
 * </ul>
 * @param {number} num A floating point number.
 * @return {number} Its logarithm to base 10 rounded down to the nearest
 *     integer if num > 0. -Infinity if num == 0. NaN if num < 0.
 */


goog.math.log10Floor = function (num) {
  if (num > 0) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (parseFloat('1e' + x) > num ? 1 : 0);
  }

  return num == 0 ? -Infinity : NaN;
};
/**
 * A tweaked variant of `Math.floor` which tolerates if the passed number
 * is infinitesimally smaller than the closest integer. It often happens with
 * the results of floating point calculations because of the finite precision
 * of the intermediate results. For example {@code Math.floor(Math.log(1000) /
 * Math.LN10) == 2}, not 3 as one would expect.
 * @param {number} num A number.
 * @param {number=} opt_epsilon An infinitesimally small positive number, the
 *     rounding error to tolerate.
 * @return {number} The largest integer less than or equal to `num`.
 */


goog.math.safeFloor = function (num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.floor(num + (opt_epsilon || 2e-15));
};
/**
 * A tweaked variant of `Math.ceil`. See `goog.math.safeFloor` for
 * details.
 * @param {number} num A number.
 * @param {number=} opt_epsilon An infinitesimally small positive number, the
 *     rounding error to tolerate.
 * @return {number} The smallest integer greater than or equal to `num`.
 */


goog.math.safeCeil = function (num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
  return Math.ceil(num - (opt_epsilon || 2e-15));
};

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A utility class for representing two-dimensional positions.
 */

goog.provide('goog.math.Coordinate');

goog.require('goog.math');
/**
 * Class for representing coordinates and positions.
 * @param {number=} opt_x Left, defaults to 0.
 * @param {number=} opt_y Top, defaults to 0.
 * @struct
 * @constructor
 */


goog.math.Coordinate = function (opt_x, opt_y) {
  /**
   * X-value
   * @type {number}
   */
  this.x = goog.isDef(opt_x) ? opt_x : 0;
  /**
   * Y-value
   * @type {number}
   */

  this.y = goog.isDef(opt_y) ? opt_y : 0;
};
/**
 * Returns a new copy of the coordinate.
 * @return {!goog.math.Coordinate} A clone of this coordinate.
 */


goog.math.Coordinate.prototype.clone = function () {
  return new goog.math.Coordinate(this.x, this.y);
};

if (goog.DEBUG) {
  /**
   * Returns a nice string representing the coordinate.
   * @return {string} In the form (50, 73).
   * @override
   */
  goog.math.Coordinate.prototype.toString = function () {
    return '(' + this.x + ', ' + this.y + ')';
  };
}
/**
 * Returns whether the specified value is equal to this coordinate.
 * @param {*} other Some other value.
 * @return {boolean} Whether the specified value is equal to this coordinate.
 */


goog.math.Coordinate.prototype.equals = function (other) {
  return other instanceof goog.math.Coordinate && goog.math.Coordinate.equals(this, other);
};
/**
 * Compares coordinates for equality.
 * @param {goog.math.Coordinate} a A Coordinate.
 * @param {goog.math.Coordinate} b A Coordinate.
 * @return {boolean} True iff the coordinates are equal, or if both are null.
 */


goog.math.Coordinate.equals = function (a, b) {
  if (a == b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return a.x == b.x && a.y == b.y;
};
/**
 * Returns the distance between two coordinates.
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @param {!goog.math.Coordinate} b A Coordinate.
 * @return {number} The distance between `a` and `b`.
 */


goog.math.Coordinate.distance = function (a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
/**
 * Returns the magnitude of a coordinate.
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @return {number} The distance between the origin and `a`.
 */


goog.math.Coordinate.magnitude = function (a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};
/**
 * Returns the angle from the origin to a coordinate.
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @return {number} The angle, in degrees, clockwise from the positive X
 *     axis to `a`.
 */


goog.math.Coordinate.azimuth = function (a) {
  return goog.math.angle(0, 0, a.x, a.y);
};
/**
 * Returns the squared distance between two coordinates. Squared distances can
 * be used for comparisons when the actual value is not required.
 *
 * Performance note: eliminating the square root is an optimization often used
 * in lower-level languages, but the speed difference is not nearly as
 * pronounced in JavaScript (only a few percent.)
 *
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @param {!goog.math.Coordinate} b A Coordinate.
 * @return {number} The squared distance between `a` and `b`.
 */


goog.math.Coordinate.squaredDistance = function (a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx * dx + dy * dy;
};
/**
 * Returns the difference between two coordinates as a new
 * goog.math.Coordinate.
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @param {!goog.math.Coordinate} b A Coordinate.
 * @return {!goog.math.Coordinate} A Coordinate representing the difference
 *     between `a` and `b`.
 */


goog.math.Coordinate.difference = function (a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
/**
 * Returns the sum of two coordinates as a new goog.math.Coordinate.
 * @param {!goog.math.Coordinate} a A Coordinate.
 * @param {!goog.math.Coordinate} b A Coordinate.
 * @return {!goog.math.Coordinate} A Coordinate representing the sum of the two
 *     coordinates.
 */


goog.math.Coordinate.sum = function (a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
};
/**
 * Rounds the x and y fields to the next larger integer values.
 * @return {!goog.math.Coordinate} This coordinate with ceil'd fields.
 */


goog.math.Coordinate.prototype.ceil = function () {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};
/**
 * Rounds the x and y fields to the next smaller integer values.
 * @return {!goog.math.Coordinate} This coordinate with floored fields.
 */


goog.math.Coordinate.prototype.floor = function () {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};
/**
 * Rounds the x and y fields to the nearest integer values.
 * @return {!goog.math.Coordinate} This coordinate with rounded fields.
 */


goog.math.Coordinate.prototype.round = function () {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};
/**
 * Translates this box by the given offsets. If a `goog.math.Coordinate`
 * is given, then the x and y values are translated by the coordinate's x and y.
 * Otherwise, x and y are translated by `tx` and `opt_ty`
 * respectively.
 * @param {number|goog.math.Coordinate} tx The value to translate x by or the
 *     the coordinate to translate this coordinate by.
 * @param {number=} opt_ty The value to translate y by.
 * @return {!goog.math.Coordinate} This coordinate after translating.
 */


goog.math.Coordinate.prototype.translate = function (tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.x += tx.x;
    this.y += tx.y;
  } else {
    this.x += Number(tx);

    if (goog.isNumber(opt_ty)) {
      this.y += opt_ty;
    }
  }

  return this;
};
/**
 * Scales this coordinate by the given scale factors. The x and y values are
 * scaled by `sx` and `opt_sy` respectively.  If `opt_sy`
 * is not given, then `sx` is used for both x and y.
 * @param {number} sx The scale factor to use for the x dimension.
 * @param {number=} opt_sy The scale factor to use for the y dimension.
 * @return {!goog.math.Coordinate} This coordinate after scaling.
 */


goog.math.Coordinate.prototype.scale = function (sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.x *= sx;
  this.y *= sy;
  return this;
};
/**
 * Rotates this coordinate clockwise about the origin (or, optionally, the given
 * center) by the given angle, in radians.
 * @param {number} radians The angle by which to rotate this coordinate
 *     clockwise about the given center, in radians.
 * @param {!goog.math.Coordinate=} opt_center The center of rotation. Defaults
 *     to (0, 0) if not given.
 */


goog.math.Coordinate.prototype.rotateRadians = function (radians, opt_center) {
  var center = opt_center || new goog.math.Coordinate(0, 0);
  var x = this.x;
  var y = this.y;
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);
  this.x = (x - center.x) * cos - (y - center.y) * sin + center.x;
  this.y = (x - center.x) * sin + (y - center.y) * cos + center.y;
};
/**
 * Rotates this coordinate clockwise about the origin (or, optionally, the given
 * center) by the given angle, in degrees.
 * @param {number} degrees The angle by which to rotate this coordinate
 *     clockwise about the given center, in degrees.
 * @param {!goog.math.Coordinate=} opt_center The center of rotation. Defaults
 *     to (0, 0) if not given.
 */


goog.math.Coordinate.prototype.rotateDegrees = function (degrees, opt_center) {
  this.rotateRadians(goog.math.toRadians(degrees), opt_center);
};

goog.math.Coordinate;

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A utility class for representing a numeric box.
 */

goog.provide('goog.math.Box');

goog.require('goog.asserts');

goog.require('goog.math.Coordinate');
/**
 * Class for representing a box. A box is specified as a top, right, bottom,
 * and left. A box is useful for representing margins and padding.
 *
 * This class assumes 'screen coordinates': larger Y coordinates are further
 * from the top of the screen.
 *
 * @param {number} top Top.
 * @param {number} right Right.
 * @param {number} bottom Bottom.
 * @param {number} left Left.
 * @struct
 * @constructor
 */


goog.math.Box = function (top, right, bottom, left) {
  /**
   * Top
   * @type {number}
   */
  this.top = top;
  /**
   * Right
   * @type {number}
   */

  this.right = right;
  /**
   * Bottom
   * @type {number}
   */

  this.bottom = bottom;
  /**
   * Left
   * @type {number}
   */

  this.left = left;
};
/**
 * Creates a Box by bounding a collection of goog.math.Coordinate objects
 * @param {...goog.math.Coordinate} var_args Coordinates to be included inside
 *     the box.
 * @return {!goog.math.Box} A Box containing all the specified Coordinates.
 */


goog.math.Box.boundingBox = function (var_args) {
  var box = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x);

  for (var i = 1; i < arguments.length; i++) {
    box.expandToIncludeCoordinate(arguments[i]);
  }

  return box;
};
/**
 * @return {number} width The width of this Box.
 */


goog.math.Box.prototype.getWidth = function () {
  return this.right - this.left;
};
/**
 * @return {number} height The height of this Box.
 */


goog.math.Box.prototype.getHeight = function () {
  return this.bottom - this.top;
};
/**
 * Creates a copy of the box with the same dimensions.
 * @return {!goog.math.Box} A clone of this Box.
 */


goog.math.Box.prototype.clone = function () {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left);
};

if (goog.DEBUG) {
  /**
   * Returns a nice string representing the box.
   * @return {string} In the form (50t, 73r, 24b, 13l).
   * @override
   */
  goog.math.Box.prototype.toString = function () {
    return '(' + this.top + 't, ' + this.right + 'r, ' + this.bottom + 'b, ' + this.left + 'l)';
  };
}
/**
 * Returns whether the box contains a coordinate or another box.
 *
 * @param {goog.math.Coordinate|goog.math.Box} other A Coordinate or a Box.
 * @return {boolean} Whether the box contains the coordinate or other box.
 */


goog.math.Box.prototype.contains = function (other) {
  return goog.math.Box.contains(this, other);
};
/**
 * Expands box with the given margins.
 *
 * @param {number|goog.math.Box} top Top margin or box with all margins.
 * @param {number=} opt_right Right margin.
 * @param {number=} opt_bottom Bottom margin.
 * @param {number=} opt_left Left margin.
 * @return {!goog.math.Box} A reference to this Box.
 */


goog.math.Box.prototype.expand = function (top, opt_right, opt_bottom, opt_left) {
  if (goog.isObject(top)) {
    this.top -= top.top;
    this.right += top.right;
    this.bottom += top.bottom;
    this.left -= top.left;
  } else {
    this.top -=
    /** @type {number} */
    top;
    this.right += Number(opt_right);
    this.bottom += Number(opt_bottom);
    this.left -= Number(opt_left);
  }

  return this;
};
/**
 * Expand this box to include another box.
 * NOTE(user): This is used in code that needs to be very fast, please don't
 * add functionality to this function at the expense of speed (variable
 * arguments, accepting multiple argument types, etc).
 * @param {goog.math.Box} box The box to include in this one.
 */


goog.math.Box.prototype.expandToInclude = function (box) {
  this.left = Math.min(this.left, box.left);
  this.top = Math.min(this.top, box.top);
  this.right = Math.max(this.right, box.right);
  this.bottom = Math.max(this.bottom, box.bottom);
};
/**
 * Expand this box to include the coordinate.
 * @param {!goog.math.Coordinate} coord The coordinate to be included
 *     inside the box.
 */


goog.math.Box.prototype.expandToIncludeCoordinate = function (coord) {
  this.top = Math.min(this.top, coord.y);
  this.right = Math.max(this.right, coord.x);
  this.bottom = Math.max(this.bottom, coord.y);
  this.left = Math.min(this.left, coord.x);
};
/**
 * Compares boxes for equality.
 * @param {goog.math.Box} a A Box.
 * @param {goog.math.Box} b A Box.
 * @return {boolean} True iff the boxes are equal, or if both are null.
 */


goog.math.Box.equals = function (a, b) {
  if (a == b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left;
};
/**
 * Returns whether a box contains a coordinate or another box.
 *
 * @param {goog.math.Box} box A Box.
 * @param {goog.math.Coordinate|goog.math.Box} other A Coordinate or a Box.
 * @return {boolean} Whether the box contains the coordinate or other box.
 */


goog.math.Box.contains = function (box, other) {
  if (!box || !other) {
    return false;
  }

  if (other instanceof goog.math.Box) {
    return other.left >= box.left && other.right <= box.right && other.top >= box.top && other.bottom <= box.bottom;
  } // other is a Coordinate.


  return other.x >= box.left && other.x <= box.right && other.y >= box.top && other.y <= box.bottom;
};
/**
 * Returns the relative x position of a coordinate compared to a box.  Returns
 * zero if the coordinate is inside the box.
 *
 * @param {goog.math.Box} box A Box.
 * @param {goog.math.Coordinate} coord A Coordinate.
 * @return {number} The x position of `coord` relative to the nearest
 *     side of `box`, or zero if `coord` is inside `box`.
 */


goog.math.Box.relativePositionX = function (box, coord) {
  if (coord.x < box.left) {
    return coord.x - box.left;
  } else if (coord.x > box.right) {
    return coord.x - box.right;
  }

  return 0;
};
/**
 * Returns the relative y position of a coordinate compared to a box.  Returns
 * zero if the coordinate is inside the box.
 *
 * @param {goog.math.Box} box A Box.
 * @param {goog.math.Coordinate} coord A Coordinate.
 * @return {number} The y position of `coord` relative to the nearest
 *     side of `box`, or zero if `coord` is inside `box`.
 */


goog.math.Box.relativePositionY = function (box, coord) {
  if (coord.y < box.top) {
    return coord.y - box.top;
  } else if (coord.y > box.bottom) {
    return coord.y - box.bottom;
  }

  return 0;
};
/**
 * Returns the distance between a coordinate and the nearest corner/side of a
 * box. Returns zero if the coordinate is inside the box.
 *
 * @param {goog.math.Box} box A Box.
 * @param {goog.math.Coordinate} coord A Coordinate.
 * @return {number} The distance between `coord` and the nearest
 *     corner/side of `box`, or zero if `coord` is inside
 *     `box`.
 */


goog.math.Box.distance = function (box, coord) {
  var x = goog.math.Box.relativePositionX(box, coord);
  var y = goog.math.Box.relativePositionY(box, coord);
  return Math.sqrt(x * x + y * y);
};
/**
 * Returns whether two boxes intersect.
 *
 * @param {goog.math.Box} a A Box.
 * @param {goog.math.Box} b A second Box.
 * @return {boolean} Whether the boxes intersect.
 */


goog.math.Box.intersects = function (a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
};
/**
 * Returns whether two boxes would intersect with additional padding.
 *
 * @param {goog.math.Box} a A Box.
 * @param {goog.math.Box} b A second Box.
 * @param {number} padding The additional padding.
 * @return {boolean} Whether the boxes intersect.
 */


goog.math.Box.intersectsWithPadding = function (a, b, padding) {
  return a.left <= b.right + padding && b.left <= a.right + padding && a.top <= b.bottom + padding && b.top <= a.bottom + padding;
};
/**
 * Rounds the fields to the next larger integer values.
 *
 * @return {!goog.math.Box} This box with ceil'd fields.
 */


goog.math.Box.prototype.ceil = function () {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this;
};
/**
 * Rounds the fields to the next smaller integer values.
 *
 * @return {!goog.math.Box} This box with floored fields.
 */


goog.math.Box.prototype.floor = function () {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this;
};
/**
 * Rounds the fields to nearest integer values.
 *
 * @return {!goog.math.Box} This box with rounded fields.
 */


goog.math.Box.prototype.round = function () {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this;
};
/**
 * Translates this box by the given offsets. If a `goog.math.Coordinate`
 * is given, then the left and right values are translated by the coordinate's
 * x value and the top and bottom values are translated by the coordinate's y
 * value.  Otherwise, `tx` and `opt_ty` are used to translate the x
 * and y dimension values.
 *
 * @param {number|goog.math.Coordinate} tx The value to translate the x
 *     dimension values by or the the coordinate to translate this box by.
 * @param {number=} opt_ty The value to translate y dimension values by.
 * @return {!goog.math.Box} This box after translating.
 */


goog.math.Box.prototype.translate = function (tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.left += tx.x;
    this.right += tx.x;
    this.top += tx.y;
    this.bottom += tx.y;
  } else {
    goog.asserts.assertNumber(tx);
    this.left += tx;
    this.right += tx;

    if (goog.isNumber(opt_ty)) {
      this.top += opt_ty;
      this.bottom += opt_ty;
    }
  }

  return this;
};
/**
 * Scales this coordinate by the given scale factors. The x and y dimension
 * values are scaled by `sx` and `opt_sy` respectively.
 * If `opt_sy` is not given, then `sx` is used for both x and y.
 *
 * @param {number} sx The scale factor to use for the x dimension.
 * @param {number=} opt_sy The scale factor to use for the y dimension.
 * @return {!goog.math.Box} This box after scaling.
 */


goog.math.Box.prototype.scale = function (sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left *= sx;
  this.right *= sx;
  this.top *= sy;
  this.bottom *= sy;
  return this;
};

goog.math.Box;

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A record declaration to allow ClientRect and other rectangle
 * like objects to be used with goog.math.Rect.
 */

goog.provide('goog.math.IRect');
/**
 * Record for representing rectangular regions, allows compatibility between
 * things like ClientRect and goog.math.Rect.
 *
 * @record
 */

goog.math.IRect = function () {};
/** @type {number} */


goog.math.IRect.prototype.left;
/** @type {number} */

goog.math.IRect.prototype.top;
/** @type {number} */

goog.math.IRect.prototype.width;
/** @type {number} */

goog.math.IRect.prototype.height;
goog.math.IRect;

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A utility class for representing two-dimensional sizes.
 * @author brenneman@google.com (Shawn Brenneman)
 */

goog.provide('goog.math.Size');
/**
 * Class for representing sizes consisting of a width and height. Undefined
 * width and height support is deprecated and results in compiler warning.
 * @param {number} width Width.
 * @param {number} height Height.
 * @struct
 * @constructor
 */

goog.math.Size = function (width, height) {
  /**
   * Width
   * @type {number}
   */
  this.width = width;
  /**
   * Height
   * @type {number}
   */

  this.height = height;
};
/**
 * Compares sizes for equality.
 * @param {goog.math.Size} a A Size.
 * @param {goog.math.Size} b A Size.
 * @return {boolean} True iff the sizes have equal widths and equal
 *     heights, or if both are null.
 */


goog.math.Size.equals = function (a, b) {
  if (a == b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return a.width == b.width && a.height == b.height;
};
/**
 * @return {!goog.math.Size} A new copy of the Size.
 */


goog.math.Size.prototype.clone = function () {
  return new goog.math.Size(this.width, this.height);
};

if (goog.DEBUG) {
  /**
   * Returns a nice string representing size.
   * @return {string} In the form (50 x 73).
   * @override
   */
  goog.math.Size.prototype.toString = function () {
    return '(' + this.width + ' x ' + this.height + ')';
  };
}
/**
 * @return {number} The longer of the two dimensions in the size.
 */


goog.math.Size.prototype.getLongest = function () {
  return Math.max(this.width, this.height);
};
/**
 * @return {number} The shorter of the two dimensions in the size.
 */


goog.math.Size.prototype.getShortest = function () {
  return Math.min(this.width, this.height);
};
/**
 * @return {number} The area of the size (width * height).
 */


goog.math.Size.prototype.area = function () {
  return this.width * this.height;
};
/**
 * @return {number} The perimeter of the size (width + height) * 2.
 */


goog.math.Size.prototype.perimeter = function () {
  return (this.width + this.height) * 2;
};
/**
 * @return {number} The ratio of the size's width to its height.
 */


goog.math.Size.prototype.aspectRatio = function () {
  return this.width / this.height;
};
/**
 * @return {boolean} True if the size has zero area, false if both dimensions
 *     are non-zero numbers.
 */


goog.math.Size.prototype.isEmpty = function () {
  return !this.area();
};
/**
 * Clamps the width and height parameters upward to integer values.
 * @return {!goog.math.Size} This size with ceil'd components.
 */


goog.math.Size.prototype.ceil = function () {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
/**
 * @param {!goog.math.Size} target The target size.
 * @return {boolean} True if this Size is the same size or smaller than the
 *     target size in both dimensions.
 */


goog.math.Size.prototype.fitsInside = function (target) {
  return this.width <= target.width && this.height <= target.height;
};
/**
 * Clamps the width and height parameters downward to integer values.
 * @return {!goog.math.Size} This size with floored components.
 */


goog.math.Size.prototype.floor = function () {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
/**
 * Rounds the width and height parameters to integer values.
 * @return {!goog.math.Size} This size with rounded components.
 */


goog.math.Size.prototype.round = function () {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
/**
 * Scales this size by the given scale factors. The width and height are scaled
 * by `sx` and `opt_sy` respectively.  If `opt_sy` is not
 * given, then `sx` is used for both the width and height.
 * @param {number} sx The scale factor to use for the width.
 * @param {number=} opt_sy The scale factor to use for the height.
 * @return {!goog.math.Size} This Size object after scaling.
 */


goog.math.Size.prototype.scale = function (sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.width *= sx;
  this.height *= sy;
  return this;
};
/**
 * Uniformly scales the size to perfectly cover the dimensions of a given size.
 * If the size is already larger than the target, it will be scaled down to the
 * minimum size at which it still covers the entire target. The original aspect
 * ratio will be preserved.
 *
 * This function assumes that both Sizes contain strictly positive dimensions.
 * @param {!goog.math.Size} target The target size.
 * @return {!goog.math.Size} This Size object, after optional scaling.
 */


goog.math.Size.prototype.scaleToCover = function (target) {
  var s = this.aspectRatio() <= target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s);
};
/**
 * Uniformly scales the size to fit inside the dimensions of a given size. The
 * original aspect ratio will be preserved.
 *
 * This function assumes that both Sizes contain strictly positive dimensions.
 * @param {!goog.math.Size} target The target size.
 * @return {!goog.math.Size} This Size object, after optional scaling.
 */


goog.math.Size.prototype.scaleToFit = function (target) {
  var s = this.aspectRatio() > target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s);
};

goog.math.Size;

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A utility class for representing rectangles. Some of these
 * functions should be migrated over to non-nullable params.
 */

goog.provide('goog.math.Rect');

goog.require('goog.asserts');

goog.require('goog.math.Box');

goog.require('goog.math.Coordinate');

goog.require('goog.math.IRect');

goog.require('goog.math.Size');
/**
 * Class for representing rectangular regions.
 * @param {number} x Left.
 * @param {number} y Top.
 * @param {number} w Width.
 * @param {number} h Height.
 * @struct
 * @constructor
 * @implements {goog.math.IRect}
 */


goog.math.Rect = function (x, y, w, h) {
  /** @type {number} */
  this.left = x;
  /** @type {number} */

  this.top = y;
  /** @type {number} */

  this.width = w;
  /** @type {number} */

  this.height = h;
};
/**
 * @return {!goog.math.Rect} A new copy of this Rectangle.
 */


goog.math.Rect.prototype.clone = function () {
  return new goog.math.Rect(this.left, this.top, this.width, this.height);
};
/**
 * Returns a new Box object with the same position and dimensions as this
 * rectangle.
 * @return {!goog.math.Box} A new Box representation of this Rectangle.
 */


goog.math.Rect.prototype.toBox = function () {
  var right = this.left + this.width;
  var bottom = this.top + this.height;
  return new goog.math.Box(this.top, right, bottom, this.left);
};
/**
 * Creates a new Rect object with the position and size given.
 * @param {!goog.math.Coordinate} position The top-left coordinate of the Rect
 * @param {!goog.math.Size} size The size of the Rect
 * @return {!goog.math.Rect} A new Rect initialized with the given position and
 *     size.
 */


goog.math.Rect.createFromPositionAndSize = function (position, size) {
  return new goog.math.Rect(position.x, position.y, size.width, size.height);
};
/**
 * Creates a new Rect object with the same position and dimensions as a given
 * Box.  Note that this is only the inverse of toBox if left/top are defined.
 * @param {goog.math.Box} box A box.
 * @return {!goog.math.Rect} A new Rect initialized with the box's position
 *     and size.
 */


goog.math.Rect.createFromBox = function (box) {
  return new goog.math.Rect(box.left, box.top, box.right - box.left, box.bottom - box.top);
};

if (goog.DEBUG) {
  /**
   * Returns a nice string representing size and dimensions of rectangle.
   * @return {string} In the form (50, 73 - 75w x 25h).
   * @override
   */
  goog.math.Rect.prototype.toString = function () {
    return '(' + this.left + ', ' + this.top + ' - ' + this.width + 'w x ' + this.height + 'h)';
  };
}
/**
 * Compares rectangles for equality.
 * @param {goog.math.IRect} a A Rectangle.
 * @param {goog.math.IRect} b A Rectangle.
 * @return {boolean} True iff the rectangles have the same left, top, width,
 *     and height, or if both are null.
 */


goog.math.Rect.equals = function (a, b) {
  if (a == b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height;
};
/**
 * Computes the intersection of this rectangle and the rectangle parameter.  If
 * there is no intersection, returns false and leaves this rectangle as is.
 * @param {goog.math.IRect} rect A Rectangle.
 * @return {boolean} True iff this rectangle intersects with the parameter.
 */


goog.math.Rect.prototype.intersection = function (rect) {
  var x0 = Math.max(this.left, rect.left);
  var x1 = Math.min(this.left + this.width, rect.left + rect.width);

  if (x0 <= x1) {
    var y0 = Math.max(this.top, rect.top);
    var y1 = Math.min(this.top + this.height, rect.top + rect.height);

    if (y0 <= y1) {
      this.left = x0;
      this.top = y0;
      this.width = x1 - x0;
      this.height = y1 - y0;
      return true;
    }
  }

  return false;
};
/**
 * Returns the intersection of two rectangles. Two rectangles intersect if they
 * touch at all, for example, two zero width and height rectangles would
 * intersect if they had the same top and left.
 * @param {goog.math.IRect} a A Rectangle.
 * @param {goog.math.IRect} b A Rectangle.
 * @return {goog.math.Rect} A new intersection rect (even if width and height
 *     are 0), or null if there is no intersection.
 */


goog.math.Rect.intersection = function (a, b) {
  // There is no nice way to do intersection via a clone, because any such
  // clone might be unnecessary if this function returns null.  So, we duplicate
  // code from above.
  var x0 = Math.max(a.left, b.left);
  var x1 = Math.min(a.left + a.width, b.left + b.width);

  if (x0 <= x1) {
    var y0 = Math.max(a.top, b.top);
    var y1 = Math.min(a.top + a.height, b.top + b.height);

    if (y0 <= y1) {
      return new goog.math.Rect(x0, y0, x1 - x0, y1 - y0);
    }
  }

  return null;
};
/**
 * Returns whether two rectangles intersect. Two rectangles intersect if they
 * touch at all, for example, two zero width and height rectangles would
 * intersect if they had the same top and left.
 * @param {goog.math.IRect} a A Rectangle.
 * @param {goog.math.IRect} b A Rectangle.
 * @return {boolean} Whether a and b intersect.
 */


goog.math.Rect.intersects = function (a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height;
};
/**
 * Returns whether a rectangle intersects this rectangle.
 * @param {goog.math.IRect} rect A rectangle.
 * @return {boolean} Whether rect intersects this rectangle.
 */


goog.math.Rect.prototype.intersects = function (rect) {
  return goog.math.Rect.intersects(this, rect);
};
/**
 * Computes the difference regions between two rectangles. The return value is
 * an array of 0 to 4 rectangles defining the remaining regions of the first
 * rectangle after the second has been subtracted.
 * @param {goog.math.Rect} a A Rectangle.
 * @param {goog.math.IRect} b A Rectangle.
 * @return {!Array<!goog.math.Rect>} An array with 0 to 4 rectangles which
 *     together define the difference area of rectangle a minus rectangle b.
 */


goog.math.Rect.difference = function (a, b) {
  var intersection = goog.math.Rect.intersection(a, b);

  if (!intersection || !intersection.height || !intersection.width) {
    return [a.clone()];
  }

  var result = [];
  var top = a.top;
  var height = a.height;
  var ar = a.left + a.width;
  var ab = a.top + a.height;
  var br = b.left + b.width;
  var bb = b.top + b.height; // Subtract off any area on top where A extends past B

  if (b.top > a.top) {
    result.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top));
    top = b.top; // If we're moving the top down, we also need to subtract the height diff.

    height -= b.top - a.top;
  } // Subtract off any area on bottom where A extends past B


  if (bb < ab) {
    result.push(new goog.math.Rect(a.left, bb, a.width, ab - bb));
    height = bb - top;
  } // Subtract any area on left where A extends past B


  if (b.left > a.left) {
    result.push(new goog.math.Rect(a.left, top, b.left - a.left, height));
  } // Subtract any area on right where A extends past B


  if (br < ar) {
    result.push(new goog.math.Rect(br, top, ar - br, height));
  }

  return result;
};
/**
 * Computes the difference regions between this rectangle and `rect`. The
 * return value is an array of 0 to 4 rectangles defining the remaining regions
 * of this rectangle after the other has been subtracted.
 * @param {goog.math.IRect} rect A Rectangle.
 * @return {!Array<!goog.math.Rect>} An array with 0 to 4 rectangles which
 *     together define the difference area of rectangle a minus rectangle b.
 */


goog.math.Rect.prototype.difference = function (rect) {
  return goog.math.Rect.difference(this, rect);
};
/**
 * Expand this rectangle to also include the area of the given rectangle.
 * @param {goog.math.IRect} rect The other rectangle.
 */


goog.math.Rect.prototype.boundingRect = function (rect) {
  // We compute right and bottom before we change left and top below.
  var right = Math.max(this.left + this.width, rect.left + rect.width);
  var bottom = Math.max(this.top + this.height, rect.top + rect.height);
  this.left = Math.min(this.left, rect.left);
  this.top = Math.min(this.top, rect.top);
  this.width = right - this.left;
  this.height = bottom - this.top;
};
/**
 * Returns a new rectangle which completely contains both input rectangles.
 * @param {goog.math.IRect} a A rectangle.
 * @param {goog.math.IRect} b A rectangle.
 * @return {goog.math.Rect} A new bounding rect, or null if either rect is
 *     null.
 */


goog.math.Rect.boundingRect = function (a, b) {
  if (!a || !b) {
    return null;
  }

  var newRect = new goog.math.Rect(a.left, a.top, a.width, a.height);
  newRect.boundingRect(b);
  return newRect;
};
/**
 * Tests whether this rectangle entirely contains another rectangle or
 * coordinate.
 *
 * @param {goog.math.IRect|goog.math.Coordinate} another The rectangle or
 *     coordinate to test for containment.
 * @return {boolean} Whether this rectangle contains given rectangle or
 *     coordinate.
 */


goog.math.Rect.prototype.contains = function (another) {
  if (another instanceof goog.math.Coordinate) {
    return another.x >= this.left && another.x <= this.left + this.width && another.y >= this.top && another.y <= this.top + this.height;
  } else {
    // (another instanceof goog.math.IRect)
    return this.left <= another.left && this.left + this.width >= another.left + another.width && this.top <= another.top && this.top + this.height >= another.top + another.height;
  }
};
/**
 * @param {!goog.math.Coordinate} point A coordinate.
 * @return {number} The squared distance between the point and the closest
 *     point inside the rectangle. Returns 0 if the point is inside the
 *     rectangle.
 */


goog.math.Rect.prototype.squaredDistance = function (point) {
  var dx = point.x < this.left ? this.left - point.x : Math.max(point.x - (this.left + this.width), 0);
  var dy = point.y < this.top ? this.top - point.y : Math.max(point.y - (this.top + this.height), 0);
  return dx * dx + dy * dy;
};
/**
 * @param {!goog.math.Coordinate} point A coordinate.
 * @return {number} The distance between the point and the closest point
 *     inside the rectangle. Returns 0 if the point is inside the rectangle.
 */


goog.math.Rect.prototype.distance = function (point) {
  return Math.sqrt(this.squaredDistance(point));
};
/**
 * @return {!goog.math.Size} The size of this rectangle.
 */


goog.math.Rect.prototype.getSize = function () {
  return new goog.math.Size(this.width, this.height);
};
/**
 * @return {!goog.math.Coordinate} A new coordinate for the top-left corner of
 *     the rectangle.
 */


goog.math.Rect.prototype.getTopLeft = function () {
  return new goog.math.Coordinate(this.left, this.top);
};
/**
 * @return {!goog.math.Coordinate} A new coordinate for the center of the
 *     rectangle.
 */


goog.math.Rect.prototype.getCenter = function () {
  return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2);
};
/**
 * @return {!goog.math.Coordinate} A new coordinate for the bottom-right corner
 *     of the rectangle.
 */


goog.math.Rect.prototype.getBottomRight = function () {
  return new goog.math.Coordinate(this.left + this.width, this.top + this.height);
};
/**
 * Rounds the fields to the next larger integer values.
 * @return {!goog.math.Rect} This rectangle with ceil'd fields.
 */


goog.math.Rect.prototype.ceil = function () {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
/**
 * Rounds the fields to the next smaller integer values.
 * @return {!goog.math.Rect} This rectangle with floored fields.
 */


goog.math.Rect.prototype.floor = function () {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
/**
 * Rounds the fields to nearest integer values.
 * @return {!goog.math.Rect} This rectangle with rounded fields.
 */


goog.math.Rect.prototype.round = function () {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
/**
 * Translates this rectangle by the given offsets. If a
 * `goog.math.Coordinate` is given, then the left and top values are
 * translated by the coordinate's x and y values. Otherwise, left and top are
 * translated by `tx` and `opt_ty` respectively.
 * @param {number|goog.math.Coordinate} tx The value to translate left by or the
 *     the coordinate to translate this rect by.
 * @param {number=} opt_ty The value to translate top by.
 * @return {!goog.math.Rect} This rectangle after translating.
 */


goog.math.Rect.prototype.translate = function (tx, opt_ty) {
  if (tx instanceof goog.math.Coordinate) {
    this.left += tx.x;
    this.top += tx.y;
  } else {
    this.left += goog.asserts.assertNumber(tx);

    if (goog.isNumber(opt_ty)) {
      this.top += opt_ty;
    }
  }

  return this;
};
/**
 * Scales this rectangle by the given scale factors. The left and width values
 * are scaled by `sx` and the top and height values are scaled by
 * `opt_sy`.  If `opt_sy` is not given, then all fields are scaled
 * by `sx`.
 * @param {number} sx The scale factor to use for the x dimension.
 * @param {number=} opt_sy The scale factor to use for the y dimension.
 * @return {!goog.math.Rect} This rectangle after scaling.
 */


goog.math.Rect.prototype.scale = function (sx, opt_sy) {
  var sy = goog.isNumber(opt_sy) ? opt_sy : sx;
  this.left *= sx;
  this.width *= sx;
  this.top *= sy;
  this.height *= sy;
  return this;
};

var Rect = goog.math.Rect;

console.log(new Rect(NaN, NaN, NaN, NaN));
