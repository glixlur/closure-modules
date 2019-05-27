import * as fs from "fs-extra"
import _ from "lodash"
import glob from "glob-promise"
import { parse } from "@babel/parser"
import { asyncFlatMap } from "./util"
import { matchCallExpression, assignExport } from "./babel"
import { resolve, relative, dirname, basename } from "path"

const DUMMY_FILE = '\0empty'

interface File {
  filename: string
  content: string
  provides: string[]
  requires: string[]
}

const { log } = console

/**
 * Returns a Dict of file name → file contents.
 */
async function loadProject(...pattern: string[]) {
  const filenames = await asyncFlatMap(glob, pattern)
  const files = await asyncFlatMap(filename => fs.readFile(filename, "utf8"), filenames)
  return _.zipObject(filenames, files)
}

/**
 * Parse a JavaScript file to AST and provide useful error messages if failed.
 */
function toAST(content: string, filename: string) {
  try {
    return parse(content)
  } catch (e) {
    e.filename = filename
    throw e
  }
}

export async function main(args: string[]) {
  const src = resolve(__dirname, "../node_modules/google-closure-library/closure/goog")
  const dest = resolve(__dirname, "../lib/goog")

  await fs.remove(dest)

  log(`Loading project at "${src}".`)
  let project = await loadProject(src + "/**/*.js")

  project = _.omitBy(project, (_, filename) =>
    ["base.js", "goog.js"].includes(basename(filename))
  )

  log(`Building AST trees.`)
  let files = _.map(project, (content, filename): File => {
    const ast = toAST(content, filename)
    const provides = 
      matchCallExpression(ast, 'goog.provide').concat(
      matchCallExpression(ast, 'goog.module')
    )
    const appendum = assignExport(content, provides, filename)
    return {
      filename,
      content: appendum.join('\n' + content + '\n'),
      provides,
      requires: matchCallExpression(ast, 'goog.require'),
    }
  })
  
  files = _.filter(files, _.negate(({ requires, provides }) =>
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
    content: await fs.readFile(resolve(__dirname, 'base.js'), 'utf8'),
    provides: [baseJs],
    requires: [],
  })

  files = _.filter(files, ({ provides }) => provides.length > 0)

  log(`Building files.`)
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
    if (f.filename !== baseJs) {
      importStatements[0] = `import { goog } from ${JSON.stringify(require[0])}`
    }

    await fs.ensureDir(dirname(path))
    await fs.writeFile(path,
      importStatements.join('\n') + '\n\n' + f.content
      // + (f.filename === baseJs ? "\nexport { goog } " : "")
    )
  }
}
