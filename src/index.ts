import * as fs from "fs-extra";
import { resolve, relative, dirname, basename } from "path";
import _ from "lodash";
import glob from "glob-promise";
import { parse } from "@babel/parser";
import * as t from "@babel/types";
import { findFirstArgs } from "./babel";

const DUMMY_FILE = '\0empty'

interface File {
  filename: string;
  content: string;
  provides: string[];
  requires: string[];
}

function asyncMap<T, R>(list: T[], fn: (value: T) => Promise<R>) {
  return Promise.all(list.map(fn));
}

/**
 * Returns a Map of file name → file contents.
 */
async function loadProject(...pattern: string[]) {
  const filenames = (await asyncMap(pattern, glob)).flat();
  const files = await asyncMap(filenames, filename => fs.readFile(filename, "utf8"))
  return _.zipObject(filenames, files);
}

function matchGroup2(ast: t.File, memberList: string) {
  return findFirstArgs({ ast, memberList, filter: t.isStringLiteral, map: t => t.value })
}

export async function main(args: string[]) {
  const src = resolve(__dirname, "../closure-library/closure/goog");
  const dest = resolve(__dirname, "../lib/goog");

  const project = await loadProject(src + "/**/*.js");

  let files = _.map(project, (content, filename): File => {
    let ast: t.File;
    try {
      ast = parse(content, { sourceType: /export /.test(content) ? "module" : "script" })
    } catch (e) {
      e.filename = filename;
      throw e;
    }
    return {
      filename,
      content,
      provides: (
        matchGroup2(ast, 'goog.provide') ||
        matchGroup2(ast, 'goog.module') || []
      ),
      requires: (
        matchGroup2(ast, 'goog.require') || []
      ),
    }
  })

  const baseJs = resolve(src, 'base.js');

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
  
  files = _.filter(files, _.negate(({ filename, requires, provides }) =>
    basename(filename) === "/base.js" ||
    basename(filename) === "/goog.js" ||
    requires.some(item => item.includes("..")) ||
    provides.some(item => item.includes(".."))
  ));

  files = _.filter(files, ({ provides }) => provides.length > 0)

  for (const f of files) {
    if (f.filename === DUMMY_FILE) continue;

    const path = f.filename.replace(src, dest);
    const require = _([baseJs]).concat(f.requires).flatMap(require =>
      _.filter(files, ({ provides }) => provides.includes(require))!
    ).map(({ filename }) =>
      relative(dirname(f.filename), filename)
    ).filter(filename =>
      filename != basename(f.filename)
    ).map(filename =>
      filename.replace(/\.js$/, "")
    ).map(filename =>
      filename.startsWith(".") ? filename : `./${filename}`
    ).uniq()
     .value()

    const importStatements = require.map(f => `import ${JSON.stringify(f)}`)
    // First one is always base.js file
    importStatements[0] = `import { goog } from ${require[0]}`

    await fs.ensureDir(dirname(path));
    await fs.writeFile(path,
      importStatements.join('\n') + '\n\n' + f.content +
      (f.filename === baseJs ? "\nexport { goog } " : "")
    );
  }
}
