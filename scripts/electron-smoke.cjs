const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, clipboard, ipcMain } = require("electron");

const root = path.join(__dirname, "..");
const artifacts = path.join(root, "test-artifacts", `native-smoke-${Date.now()}`);
const reportSuffix = (process.env.SCALE_FACTOR || "system").replace(".", "-");
fs.mkdirSync(artifacts, { recursive: true });
app.setPath("userData", path.join(artifacts, "user-data"));
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-gpu");
if (process.env.SCALE_FACTOR) {
  app.commandLine.appendSwitch("force-device-scale-factor", process.env.SCALE_FACTOR);
}

ipcMain.handle("clipboard:write", (_event, value) => {
  clipboard.writeText(value);
  return true;
});
ipcMain.handle("app:info", () => ({ version: app.getVersion(), portable: false }));
ipcMain.handle("shell:show-data", () => true);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function evaluate(window, source) {
  return window.webContents.executeJavaScript(`Promise.resolve().then(async () => { ${source} })`);
}

async function run() {
  await app.whenReady();
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    show: false,
    webPreferences: {
      preload: path.join(root, "electron", "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  window.webContents.on("console-message", (_event, level, message) => {
    if (level >= 2) console.error(`[renderer:${level}] ${message}`);
  });
  await window.loadFile(path.join(root, "src", "index.html"));

  const results = await evaluate(window, `
    const waitFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const fire = (element, type) => element.dispatchEvent(new Event(type, { bubbles: true }));
    const geometry = (canvas) => {
      const context = canvas.getContext('2d');
      const { width, height } = canvas;
      const pixels = context.getImageData(0, 0, width, height).data;
      const occupied = (x, y) => pixels[(y * width + x) * 4 + 3] > 0;
      let minX = width;
      let maxX = -1;
      let minY = height;
      let maxY = -1;
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (!occupied(x, y)) continue;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
      let horizontal = maxX >= minX;
      let vertical = maxY >= minY;
      for (let y = minY; y <= maxY && (horizontal || vertical); y += 1) {
        for (let x = minX; x <= maxX && (horizontal || vertical); x += 1) {
          const current = occupied(x, y);
          if (current !== occupied(maxX - (x - minX), y)) horizontal = false;
          if (current !== occupied(x, maxY - (y - minY))) vertical = false;
        }
      }
      return { horizontal, vertical, width: maxX - minX + 1, height: maxY - minY + 1 };
    };
    const initialCards = document.querySelectorAll('.crosshair-card').length;
    const asymmetricCards = Array.from(document.querySelectorAll('.crosshair-card canvas'))
      .map((canvas) => geometry(canvas))
      .filter((item) => !item.horizontal || !item.vertical).length;
    const defaultLanguage = document.querySelector('#languageSelect').value;
    const firstCardCanvas = document.querySelector('.crosshair-card canvas');
    const cardGeometry1x = geometry(firstCardCanvas);
    document.querySelector('.crosshair-card .card-zoom [data-zoom="8"]').click();
    await waitFrame();
    const cardGeometry8x = geometry(firstCardCanvas);
    const zoomKeptCardClosed = !document.querySelector('#detailDrawer').classList.contains('open');
    const language = document.querySelector('#languageSelect');
    language.value = 'en';
    fire(language, 'change');
    await waitFrame();
    const englishNav = document.querySelector('[data-view="china"] span:nth-child(2)').textContent.trim();
    const englishTitle = document.querySelector('#pageTitle').textContent.trim();
    const englishCardHint = document.querySelector('.card-copy-hint').textContent.trim();
    const brandRect = document.querySelector('.brand-mark').getBoundingClientRect();
    const englishBrandMarkSize = { width: brandRect.width, height: brandRect.height };
    language.value = 'zh-CN';
    fire(language, 'change');
    await waitFrame();
    const restoredChineseNav = document.querySelector('[data-view="china"] span:nth-child(2)').textContent.trim();
    document.querySelector('.style-nav [data-style="十字"]').click();
    await waitFrame();
    const styleNavHighlighted = document.querySelector('.style-nav [data-style="十字"]').classList.contains('active');
    document.querySelector('#filterTabs [data-filter="全部"]').click();
    document.querySelector('[data-view="diy"]').click();
    await waitFrame();
    const diyVisible = !document.querySelector('#diyWorkspace').classList.contains('hidden');
    const libraryHidden = document.querySelector('#libraryWorkspace').classList.contains('hidden');
    const templateCount = document.querySelectorAll('.diy-template-button').length;
    const initialCode = document.querySelector('#diyCode').textContent;
    document.querySelector('[data-template="dot"]').click();
    const dotSize = document.querySelector('#diySize');
    const dotSizeMax = dotSize.max;
    dotSize.value = '6';
    fire(dotSize, 'input');
    const dotMaxCode = document.querySelector('#diyCode').textContent;

    document.querySelector('[data-template="continuous"]').click();
    const size = document.querySelector('#diySize');
    size.value = '7';
    fire(size, 'input');
    const gap = document.querySelector('#diyGap');
    gap.value = '0';
    fire(gap, 'input');
    await waitFrame();
    const editedCode = document.querySelector('#diyCode').textContent;
    document.querySelector('#diyUndo').click();
    const undoCode = document.querySelector('#diyCode').textContent;
    document.querySelector('#diyRedo').click();
    const redoCode = document.querySelector('#diyCode').textContent;

    document.querySelector('#diyAdvanced').open = true;
    const horizontal = document.querySelector('#advInnerLength');
    horizontal.value = '0';
    fire(horizontal, 'change');
    const vertical = document.querySelector('#advInnerVertical');
    vertical.value = '6';
    fire(vertical, 'change');
    const advancedCode = document.querySelector('#diyCode').textContent;

    document.querySelector('[data-template="continuous"]').click();
    size.value = '7';
    fire(size, 'input');
    gap.value = '0';
    fire(gap, 'input');

    const name = document.querySelector('#diyName');
    name.value = '自动测试准星';
    fire(name, 'input');
    document.querySelector('#diySave').click();
    await waitFrame();
    const savedCards = document.querySelectorAll('.diy-saved-card').length;
    const stored = JSON.parse(localStorage.getItem('crosshair-vault-diy') || '[]');
    document.querySelector('.diy-saved-actions .favorite').click();
    await waitFrame();
    const favoriteStored = JSON.parse(localStorage.getItem('crosshair-vault-diy') || '[]');

    document.querySelector('#diyCopy').click();
    await new Promise((resolve) => setTimeout(resolve, 30));

    document.querySelector('[data-view="all"]').click();
    document.querySelector('#searchInput').value = 'ZmjjKK';
    fire(document.querySelector('#searchInput'), 'input');
    await waitFrame();
    document.querySelector('.crosshair-card').click();
    await waitFrame();
    const zmjjkkGeometry = geometry(document.querySelector('#detailCanvas'));
    document.querySelector('#editInDiyButton').click();
    await waitFrame();
    await new Promise((resolve) => setTimeout(resolve, 320));
    const loadedFromDetail = !document.querySelector('#diyWorkspace').classList.contains('hidden') &&
      document.querySelector('#diyName').value.includes('ZmjjKK');

    const canvas = document.querySelector('#diyCanvas');
    const context = canvas.getContext('2d');
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let occupiedPixels = 0;
    for (let index = 3; index < pixels.length; index += 4) if (pixels[index] > 0) occupiedPixels += 1;

    return {
      initialCards,
      devicePixelRatio,
      asymmetricCards,
      defaultLanguage,
      cardGeometry1x,
      cardGeometry8x,
      zoomKeptCardClosed,
      englishNav,
      englishTitle,
      englishCardHint,
      englishBrandMarkSize,
      restoredChineseNav,
      styleNavHighlighted,
      diyVisible,
      libraryHidden,
      templateCount,
      initialCode,
      dotSizeMax,
      dotMaxCode,
      editedCode,
      undoCode,
      redoCode,
      advancedCode,
      savedCards,
      storedCount: stored.length,
      storedName: stored[0]?.name,
      diyFavorite: favoriteStored[0]?.favorite,
      loadedFromDetail,
      zmjjkkGeometry,
      backdropClass: document.querySelector('#drawerBackdrop').className,
      drawerClass: document.querySelector('#detailDrawer').className,
      occupiedPixels
    };
  `);

  const copied = clipboard.readText();
  assert(results.initialCards === 150, "初始目录数量异常");
  assert(results.asymmetricCards === 0, "目录中存在轴向不对称的准星");
  assert(results.defaultLanguage === "zh-CN", "首次启动没有默认使用中文");
  assert(results.cardGeometry8x.width === results.cardGeometry1x.width * 8, "卡片 8x 放大比例异常");
  assert(results.cardGeometry8x.height === results.cardGeometry1x.height * 8, "卡片 8x 放大比例异常");
  assert(results.zoomKeptCardClosed, "点击卡片倍率时错误地打开了详情");
  assert(results.englishNav === "VCT China" && results.englishTitle === "Find your next crosshair", "英文界面切换失败");
  assert(results.englishCardHint === "View & copy →", "英文卡片动态文字未更新");
  assert(results.englishBrandMarkSize.width === 39 && results.englishBrandMarkSize.height === 39, "英文标题挤压了品牌图标");
  assert(results.restoredChineseNav === "中国赛区", "切回中文失败");
  assert(results.styleNavHighlighted, "按形态浏览没有显示左侧选中状态");
  assert(results.diyVisible && results.libraryHidden, "DIY 页面切换失败");
  assert(results.templateCount === 11, "基础造型数量异常");
  assert(results.initialCode.startsWith("0;P;"), "初始 DIY 代码无效");
  assert(results.dotSizeMax === "6" && results.dotMaxCode.includes(";z;6;"), "点状准星大小滑杆范围异常");
  assert(results.editedCode.includes(";0l;7;") && results.editedCode.includes(";0o;0;"), "简单参数没有写入代码");
  assert(results.undoCode !== results.editedCode && results.redoCode === results.editedCode, "撤销或重做失败");
  assert(results.advancedCode.includes(";0l;0;") && results.advancedCode.includes(";0v;6;") && results.advancedCode.includes(";0g;1;"), "高级模式独立长度失败");
  assert(results.savedCards === 1 && results.storedCount === 1, "DIY 保存失败");
  assert(results.storedName === "自动测试准星", "DIY 名称保存失败");
  assert(results.diyFavorite === true, "DIY 收藏失败");
  assert(copied.startsWith("0;P;"), "DIY 剪贴板复制失败");
  assert(results.loadedFromDetail, "详情页载入 DIY 失败");
  assert(results.zmjjkkGeometry.horizontal && results.zmjjkkGeometry.vertical, "ZmjjKK 预览不对称");
  assert(results.zmjjkkGeometry.width === 6 && results.zmjjkkGeometry.height === 6, "ZmjjKK 游戏原始像素尺寸异常");
  assert(results.occupiedPixels > 0, "DIY Canvas 没有绘制准星");

  if (process.env.VISUAL_QA === "1") {
    const reloaded = new Promise((resolve) => window.webContents.once("did-finish-load", resolve));
    window.webContents.reload();
    await reloaded;
    window.show();
    window.focus();
    await new Promise((resolve) => setTimeout(resolve, 350));
    let screenshot = await window.webContents.capturePage();
    fs.writeFileSync(path.join(root, "test-artifacts", "library-zh.png"), screenshot.toPNG());
    await evaluate(window, `
      const language = document.querySelector('#languageSelect');
      language.value = 'en';
      language.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    `);
    await new Promise((resolve) => setTimeout(resolve, 250));
    screenshot = await window.webContents.capturePage();
    fs.writeFileSync(path.join(root, "test-artifacts", "library-en.png"), screenshot.toPNG());
    await evaluate(window, `
      const language = document.querySelector('#languageSelect');
      language.value = 'zh-CN';
      language.dispatchEvent(new Event('change', { bubbles: true }));
      document.querySelector('[data-view="diy"]').click();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    `);
    screenshot = await window.webContents.capturePage();
    fs.writeFileSync(path.join(root, "test-artifacts", "diy-workspace.png"), screenshot.toPNG());
  }

  fs.writeFileSync(
    path.join(root, "test-artifacts", `electron-smoke-result-${reportSuffix}.json`),
    JSON.stringify({ scaleFactor: process.env.SCALE_FACTOR || "system", results, copied }, null, 2),
    "utf8"
  );
  const previousError = path.join(root, "test-artifacts", `electron-smoke-error-${reportSuffix}.txt`);
  if (fs.existsSync(previousError)) fs.unlinkSync(previousError);
  console.log(JSON.stringify({ scaleFactor: process.env.SCALE_FACTOR || "system", results, copied }, null, 2));
  await window.close();
  await app.quit();
}

run().catch((error) => {
  fs.writeFileSync(
    path.join(root, "test-artifacts", `electron-smoke-error-${reportSuffix}.txt`),
    error.stack || String(error),
    "utf8"
  );
  console.error(error);
  app.exit(1);
});

