const path = require("path");

global.window = {};
require(path.join(__dirname, "..", "src", "catalog.js"));

const catalog = global.window.CROSSHAIR_CATALOG;
const errors = [];

if (!Array.isArray(catalog)) errors.push("catalog 不是数组");
if (catalog.length !== 150) errors.push(`内置准星数量应为 150，实际为 ${catalog.length}`);

const ids = new Set();
for (const [index, item] of catalog.entries()) {
  if (!item.id || ids.has(item.id)) errors.push(`第 ${index + 1} 条 ID 缺失或重复：${item.id}`);
  ids.add(item.id);
  if (!item.name) errors.push(`第 ${index + 1} 条缺少名称`);
  if (!item.code || !/^0(?:;[A-Za-z0-9.-]+)+$/.test(item.code)) {
    errors.push(`第 ${index + 1} 条代码格式异常：${item.name}`);
  }
  if (!["点状", "十字", "空心", "外线", "动态"].includes(item.style)) {
    errors.push(`第 ${index + 1} 条形态未知：${item.style}`);
  }
}

const stats = {
  total: catalog.length,
  pro: catalog.filter((item) => item.kind === "职业选手").length,
  china: catalog.filter((item) => item.region === "中国赛区").length,
  dot: catalog.filter((item) => item.style === "点状").length,
  cross: catalog.filter((item) => item.style === "十字").length,
  hollow: catalog.filter((item) => item.style === "空心").length,
  outer: catalog.filter((item) => item.style === "外线").length,
  dynamic: catalog.filter((item) => item.style === "动态").length
};

if (stats.china < 15) errors.push(`中国赛区条目过少：${stats.china}`);
if (stats.pro < 40) errors.push(`职业选手条目过少：${stats.pro}`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("准星目录校验通过");
console.table(stats);

