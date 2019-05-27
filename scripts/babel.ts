import * as _ from "lodash";
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { dropExt } from "./util";

/**
 * Returns the first StringLiteral in all functions calls to `memberList`.
 * @example goog.require("module") → 'google.require' → ["module"]
 */
export function matchCallExpression(ast: t.File, memberList: string) {
  return findFirstArgs({ ast, memberList, filter: t.isStringLiteral, map: t => t.value })
}

/**
 * Returns the first argument in all functions calls to `memberList`.
 */
export function findFirstArgs<T extends t.Node, R>(p: {
  ast: t.File,
  memberList: string
  filter: (n: t.Node) => n is T,
  map: (n: T) => R
}) {
  const values: R[] = [];

  traverse(p.ast, {
    CallExpression({ node }) {
      const { callee, arguments: args } = node;
      if (args.length !== 1) return;

      const _callee = t.isMemberExpression(callee) && generate(callee).code;
      if (_callee !== p.memberList) return;
      if (!p.filter(args[0])) return;

      values.push(p.map(args[0] as T));
    }
  });

  return values;
}

export function assignExport(provides: string[], filename: string) {
  if (provides.length === 1) {
    return `export default ${provides[0]}`;
  }

  const candidate = provides.find(f =>
    _.last(f.split("."))!.toLowerCase() === dropExt(filename).toLowerCase()
  )
  if (candidate) {
    return `export default ${candidate}`;
  } else {
    // console.warn(`Impossible de trouver \`export default\` pour ${filename}`);
    return "";
  }
}
