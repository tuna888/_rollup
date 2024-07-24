// 作用：通过源代码一个对象，像操作字符串一样操作源代码
const MagicString = require("magic-string");
// 作用：将源代码转换为抽象语法树AST
const { parse } = require("acorn");

const analyse = require("./ast/analyse");

class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code);
    this.path = path;
    this.bundle = bundle;
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: "module",
    });

    // 分析语法树
    analyse(this.ast, this.code, this);
  }

  /**
   * 展开所有语句
   */
  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach((statement) => {
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });

    return allStatements;
  }

  /**
   * 展开单个语句
   */
  expandStatement(statement) {
    statement._included = true;
    let result = [];
    result.push(statement);
    return result;
  }
}

module.exports = Module;
