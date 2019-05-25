import * as fs from "fs-extra"
import _ from "lodash"
import glob from "glob-promise"
import { parse } from "@babel/parser"
import * as t from "@babel/types"
import { findFirstArgs } from "./babel"
import { resolve, relative, dirname, basename } from "path"

const DUMMY_FILE = '\0empty'

interface File {
  filename: string
  content: string
  provides: string[]
  requires: string[]
}

/**
 * @example
 * asyncFlatMap :: (a -> Promise (Either b List b)) -> List a -> Promise List b
 */
function asyncFlatMap<T, R>(fn: (value: T) => Promise<R[] | R>, list: T[]) {
  return Promise.all(list.map(fn)).then(arr => arr.flat() as R[])
}

/**
 * Returns a Dict of file name → file contents.
 */
async function loadProject(...pattern: string[]) {
  const filenames = await asyncFlatMap(glob, pattern)
  const files = await asyncFlatMap(filename => fs.readFile(filename, "utf8"), filenames)
  return _.zipObject(filenames, files)
}

/**
 * Returns the first StringLiteral in all functions calls to `memberList`.
 * @example goog.require("module") → 'google.require' → ["module"]
 */
function matchCallExpression(ast: t.File, memberList: string) {
  return findFirstArgs({ ast, memberList, filter: t.isStringLiteral, map: t => t.value })
}

/**
 * Parse a JavaScript file to AST and provide useful error messages if failed.
 */
function toAST(content: string, filename: string) {
  try {
    return parse(content, { sourceType: /export /.test(content) ? "module" : "script" })
  } catch (e) {
    e.filename = filename
    throw e
  }
}

export async function main(args: string[]) {
  const src = resolve(__dirname, "../closure-library/closure/goog")
  const dest = resolve(__dirname, "../lib/goog")

  const project = await loadProject(src + "/**/*.js")

  let files = _.map(project, (content, filename): File => {
    const ast = toAST(content, filename)
    return {
      filename,
      content,
      provides: (
        matchCallExpression(ast, 'goog.provide') ||
        matchCallExpression(ast, 'goog.module') || []
      ),
      requires: (
        matchCallExpression(ast, 'goog.require') || []
      ),
    }
  })
  
  files = _.filter(files, _.negate(({ filename, requires, provides }) =>
    basename(filename) === "base.js" ||
    basename(filename) === "goog.js" ||
    requires.some(item => item.includes("..")) ||
    provides.some(item => item.includes(".."))
  ))

  const baseJs = resolve(src, 'base.js')

  files.push({
    filename: DUMMY_FILE,
    content: '',
    provides: ['goog.async.Deferred'],
    requires: [],
  }, {
    filename: baseJs,
    content: await fs.readFile(baseJs, 'utf8'),
    provides: [baseJs],
    requires: [],
  })

  files = _.filter(files, ({ provides }) => provides.length > 0)

  for (const f of files) {
    if (f.filename === DUMMY_FILE) continue

    const path = f.filename.replace(src, dest)
    const require = _([baseJs]).concat(f.requires).flatMap(require =>
      _.filter(files, ({ provides }) => provides.includes(require))!
    ).map(
      'filename'
    ).without(
      f.filename
    ).map(filename =>
      relative(dirname(f.filename), filename)
    ).map(filename =>
      filename.replace(/\.js$/, "")
    ).map(filename =>
      filename.startsWith(".") ? filename : `./${filename}`
    ).uniq()
     .filter(n => !n.endsWith(DUMMY_FILE))
     .value()

    const importStatements = require.map(f => `import ${JSON.stringify(f)}`)
    // First one is always base.js file
    importStatements[0] = `import { goog } from ${JSON.stringify(require[0])}`

    await fs.ensureDir(dirname(path))
    await fs.writeFile(path,
      importStatements.join('\n') + '\n\n' + f.content +
      (f.filename === baseJs ? "\nexport { goog } " : "")
    )
  }
}
