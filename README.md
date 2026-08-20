# 准星匣：无畏契约 DIY 准星工具

<p align="center">
  <img src="assets/icon.png" width="96" height="96" alt="准星匣图标" />
</p>

<p align="center">
  面向 Windows 10/11 的独立、离线《无畏契约》准星图鉴与代码管理器。<br />
  An independent, offline VALORANT crosshair library and code manager for Windows.
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.1.0-ff4f5f" />
  <img alt="Platform" src="https://img.shields.io/badge/platform-Windows%2010%20%7C%2011-24e7dc" />
  <img alt="Runtime" src="https://img.shields.io/badge/runtime-offline-77e7a5" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-8c99aa" />
</p>

## 简介

准星匣将职业选手公开配置、常用准星、收藏和 DIY 工坊集中在一个本地桌面应用中。应用根据准星代码绘制像素级预览，复制后由用户自行进入游戏设置导入；程序不会连接、检测或修改游戏。

版本 1.1.0 提供完整的中文和英文界面，首次启动默认使用中文。图鉴卡片和详情预览支持 `1×`、`4×`、`8×`，方便查看线宽、间距、中心点和轮廓细节。

## 下载

安装版、便携版和校验文件请前往 [GitHub Releases](../../releases) 下载。发布新版本时，仓库内置的 GitHub Actions 会自动构建 Windows 安装包并添加到对应 Release。

## 主要功能

- 内置 150 枚职业选手公开配置与经典常用准星
- 中国赛区、职业选手、收藏、最近查看和形态分类
- 按名称、选手 ID、战队、颜色与形态搜索和筛选
- 中文 / English 双语界面，语言选择保存在本机
- 图鉴卡片与详情页提供 `1×`、`4×`、`8×` 像素预览
- DIY 准星工坊：基础造型、简单参数与高级参数
- 实时生成游戏原生准星代码，支持撤销、重做和本地保存
- 导入代码后仅在本地解析、预览和继续编辑
- 一键复制代码到 Windows 剪贴板
- 同时支持安装版与便携版

## 安全边界

准星匣不是游戏插件、外挂或覆盖工具：

- 不检测、启动或监听游戏进程
- 不读取游戏内存、文件、安装目录、配置或注册表
- 不注入 DLL，不创建游戏覆盖层或准星悬浮窗
- 不模拟键鼠输入，不自动导入准星
- 不访问网络；Electron 主进程会拦截 HTTP/HTTPS 请求
- 仅在用户点击复制按钮时写入 Windows 剪贴板

复制代码后，请自行进入游戏的准星设置页面，使用游戏官方导入功能粘贴。

## 开发与构建

需要 Node.js、pnpm 和 Windows 环境。

```powershell
pnpm install
pnpm start
```

常用命令：

```powershell
pnpm check        # 校验 150 枚准星目录与字段
pnpm test:smoke   # Electron 功能与像素绘制回归测试
pnpm dist         # 构建 NSIS 安装版与便携版
```

维护者发布版本时，在 GitHub 的 Releases 页面创建并发布对应标签（例如 `v1.1.0`）即可触发自动构建。发布说明模板见 [`RELEASE_NOTES_1.1.0.md`](RELEASE_NOTES_1.1.0.md)。

项目结构：

```text
assets/      应用图标
electron/    Electron 主进程与安全预加载脚本
scripts/     目录校验、回归测试和安全审计
src/         界面、双语文本、准星目录与绘制逻辑
```

## 本地数据

- 安装版：数据保存在当前 Windows 用户的应用数据目录。
- 便携版：数据保存在程序旁的 `准星匣-data` 文件夹。
- 收藏、最近查看、本地导入、DIY 准星和语言偏好均只保存在本机。

## 数据与免责声明

职业选手准星整理自公开设置资料并记录核验日期。选手可能随时更换配置，因此应用展示的是公开资料中曾核验的记录，不代表永久或实时设置。

本项目并非 Riot Games 或 VALORANT 官方产品。VALORANT 及相关商标归其各自权利人所有。

## English

Crosshair Vault is a fully offline Windows desktop app for browsing, previewing, editing, and copying VALORANT crosshair codes. Version 1.1.0 includes Chinese and English interfaces, 150 built-in presets, VCT China and pro-player collections, local favorites, a visual DIY studio, and pixel-accurate `1×` / `4×` / `8×` previews.

The app never accesses the game process, memory, files, registry, or anti-cheat components. It only writes text to the Windows clipboard when the user explicitly selects Copy.

## License

源代码使用 [MIT License](LICENSE) 发布。

