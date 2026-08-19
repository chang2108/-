const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const main = fs.readFileSync(path.join(root, "electron", "main.cjs"), "utf8");
const preload = fs.readFileSync(path.join(root, "electron", "preload.cjs"), "utf8");
const renderer = fs.readFileSync(path.join(root, "src", "renderer.js"), "utf8");
const html = fs.readFileSync(path.join(root, "src", "index.html"), "utf8");
const combined = [main, preload, renderer].join("\n");

const forbiddenPatterns = [
  ["子进程执行", /require\(["']child_process["']\)|\bexecFile?\s*\(|\bspawn\s*\(/],
  ["原生 FFI", /require\(["'](?:ffi|ffi-napi|ref-napi)["']\)/],
  ["注册表访问", /require\(["'](?:winreg|registry-js)["']\)|HKEY_(?:LOCAL_MACHINE|CURRENT_USER)/],
  ["进程枚举", /tasklist|Get-Process|Win32_Process|CreateToolhelp32Snapshot/i],
  ["网络客户端", /\bfetch\s*\(|new\s+WebSocket|XMLHttpRequest|EventSource|require\(["'](?:http|https|net|dgram)["']\)/],
  ["游戏注入或覆盖", /SetWindowsHookEx|WriteProcessMemory|OpenProcess|DirectXHook|DLLInject/i]
];

const errors = [];
for (const [label, pattern] of forbiddenPatterns) {
  if (pattern.test(combined)) errors.push(`检测到不允许的能力：${label}`);
}

const requiredPatterns = [
  ["上下文隔离", /contextIsolation:\s*true/, main],
  ["禁用 Node 集成", /nodeIntegration:\s*false/, main],
  ["渲染器沙箱", /sandbox:\s*true/, main],
  ["阻断运行时网络", /onBeforeRequest[\s\S]*cancel:\s*!allowed/, main],
  ["CSP 禁止连接", /connect-src\s+'none'/, html],
  ["仅提供剪贴板写入", /clipboard\.writeText/, main]
];

for (const [label, pattern, source] of requiredPatterns) {
  if (!pattern.test(source)) errors.push(`缺少安全约束：${label}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("安全边界审计通过：未发现游戏进程、内存、注入、覆盖层、注册表或网络访问能力");

