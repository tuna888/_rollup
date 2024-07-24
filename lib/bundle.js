const path = require("path");
const fs = require("fs");
const Module = require("./module");
const MagicString = require("magic-string");

class Bundle {
  constructor(options) {
    const { entry } = options;
    // 确保entryPath是绝对路径
    this.entryPath = path.resolve(__dirname, entry);
  }

  build(output) {
    // 获取入口文件的模块
    const entryModule = this.fetchModule(this.entryPath);
    console.log("entryModule", entryModule);

    // 将所有语句展开：如果文件有引用其他文件的变量，将变量的声明和定义拿到本文件中
    this.statements = entryModule.expandAllStatements();

    const { code } = this.generate();

    fs.writeFileSync(output, code);
  }

  /**
   * 根据文件路径获取模块
   */
  fetchModule(path) {
    let route = path;
    if (route) {
      // 读取源代码
      const code = fs.readFileSync(route, "utf-8");
      // 创建一个模块实例
      const module = new Module({
        code, // 模块的源代码
        path: route, // 模块的路径
        bundle: this, // Bundle实例
      });

      return module;
    }
  }

  /**
   * 把每个语句对应的源代码都拿出来，拼接起来，返回新的代码
   * @returns 
   */
  generate() {
    let magicStringBundle = new MagicString.Bundle();

    this.statements.forEach((statement) => {
      const source = statement._source.clone();
      magicStringBundle.addSource({
        content: source,
        separator: "\n",
      });
    });

    return { code: magicStringBundle.toString() };
  }
}

module.exports = Bundle;
