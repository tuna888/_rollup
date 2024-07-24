const Bundle = require("./bundle");

function rollup(entry, output) {
  // 打包入口文件，把结果输出到output
  const bundle = new Bundle({ entry });
  bundle.build(output);
}

module.exports = rollup;
