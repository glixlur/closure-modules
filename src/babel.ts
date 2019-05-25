import * as t from "@babel/types";
import traverse from "@babel/traverse";

function reconstructMemberList({ object, property }: t.MemberExpression): string {
  const left = t.isMemberExpression(object) ? reconstructMemberList(object)
    : t.isIdentifier(object) ? object.name
    : t.isStringLiteral(object) ? object.value
    : '???'
  const right = t.isIdentifier(property) ? property.name
    : t.isStringLiteral(property) ? property.value
    : '???'
  return left + '.' + right;
}

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

      const _callee = t.isMemberExpression(callee) && reconstructMemberList(callee);
      if (_callee !== p.memberList) return;
      if (!p.filter(args[0])) return;

      values.push(p.map(args[0] as T));
    }
  });

  return values;
}