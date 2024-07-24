/**
 * 核心功能：依靠ast的语句遍历，【找到每个语句对应的源代码】，将其作为_source属性。【改变了每条ast语句的属性】
 * @param {*} ast 语法树
 * @param {*} code 源代码
 * @param {*} module 模块实例
 */
function analyse(ast, code, module) {
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _included: { value: false, writable: true }, // 表示这条语句默认不包含在输出结果里
      _module: { value: module }, // 指向自己的模块
      _source: { value: code.snip(statement.start, statement.end) }, // 这条语句自己的源代码
    });
  });
}

module.exports = analyse;
