const fs = require("fs");
const path = require("path");
const { _electron: electron } = require("playwright");

async function canvasMetrics(locator) {
  return locator.evaluate((canvas) => {
    const context = canvas.getContext("2d");
    const { width, height } = canvas;
    const pixels = context.getImageData(0, 0, width, height).data;
    const points = [];
    const occupied = (x, y) => pixels[(y * width + x) * 4 + 3] > 0;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (occupied(x, y)) points.push([x, y]);
      }
    }

    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const rowXs = Array.from({ length: width }, (_, x) => x).filter((x) => occupied(x, centerY));
    const columnYs = Array.from({ length: height }, (_, y) => y).filter((y) => occupied(centerX, y));
    const continuous = (values) =>
      values.length > 0 && values.every((value, index) => index === 0 || value === values[index - 1] + 1);
    const runLengths = (values) => {
      const runs = [];
      values.forEach((value, index) => {
        if (index === 0 || value !== values[index - 1] + 1) runs.push(1);
        else runs[runs.length - 1] += 1;
      });
      return runs;
    };
    const bounds = canvas.getBoundingClientRect();
    const geometryMatches = (transform) => {
      for (let y = minY; y <= maxY; y += 1) {
        for (let x = minX; x <= maxX; x += 1) {
          const [targetX, targetY] = transform(x, y);
          if (occupied(x, y) !== occupied(targetX, targetY)) return false;
        }
      }
      return true;
    };

    return {
      pointCount: points.length,
      boundingWidth: maxX - minX + 1,
      boundingHeight: maxY - minY + 1,
      centerRowContinuous: continuous(rowXs),
      centerColumnContinuous: continuous(columnYs),
      centerRowRuns: runLengths(rowXs),
      centerColumnRuns: runLengths(columnYs),
      mirrorHorizontal: geometryMatches((x, y) => [maxX - (x - minX), y]),
      mirrorVertical: geometryMatches((x, y) => [x, maxY - (y - minY)]),
      mirrorDiagonal:
        maxX - minX === maxY - minY &&
        geometryMatches((x, y) => [minX + (y - minY), minY + (x - minX)]),
      boundingCenterOccupied: occupied(
        Math.floor((minX + maxX) / 2),
        Math.floor((minY + maxY) / 2)
      ),
      scaleX: width / bounds.width,
      scaleY: height / bounds.height
    };
  });
}

async function findAxisAsymmetricCards(window) {
  return window.locator(".crosshair-card").evaluateAll((cards) =>
    cards.flatMap((card) => {
      const canvas = card.querySelector("canvas");
      const context = canvas.getContext("2d");
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

      let mirrorHorizontal = maxX >= minX;
      let mirrorVertical = maxY >= minY;
      for (let y = minY; y <= maxY && (mirrorHorizontal || mirrorVertical); y += 1) {
        for (let x = minX; x <= maxX && (mirrorHorizontal || mirrorVertical); x += 1) {
          const current = occupied(x, y);
          if (current !== occupied(maxX - (x - minX), y)) mirrorHorizontal = false;
          if (current !== occupied(x, maxY - (y - minY))) mirrorVertical = false;
        }
      }

      if (mirrorHorizontal && mirrorVertical) return [];
      return [{
        name: card.getAttribute("aria-label"),
        mirrorHorizontal,
        mirrorVertical
      }];
    })
  );
}

async function run() {
  const root = path.join(__dirname, "..");
  const artifacts = path.join(root, "test-artifacts");
  const userData = path.join(artifacts, `user-data-${Date.now()}`);
  const packagedExecutable = process.env.PACKAGED_EXE || "";
  const scaleArgs = process.env.SCALE_FACTOR
    ? [`--force-device-scale-factor=${process.env.SCALE_FACTOR}`]
    : [];
  fs.mkdirSync(artifacts, { recursive: true });

  const app = await electron.launch({
    executablePath: packagedExecutable || path.join(root, "node_modules", "electron", "dist", "electron.exe"),
    args: packagedExecutable
      ? [`--user-data-dir=${userData}`, "--disable-gpu", ...scaleArgs]
      : [root, `--user-data-dir=${userData}`, "--disable-gpu", ...scaleArgs],
    cwd: root
  });

  try {
    const window = await app.firstWindow();
    window.on("console", (message) => console.log(`[renderer:${message.type()}] ${message.text()}`));
    window.on("pageerror", (error) => console.error(`[renderer:error] ${error.message}`));
    window.on("crash", () => console.error("[renderer:crash] 页面进程崩溃"));
    await window.waitForLoadState("domcontentloaded");
    await window.locator(".crosshair-card").first().waitFor();

    const results = {};
    results.title = await window.title();
    results.appInfo = await window.evaluate(() => window.crosshairDesktop.getAppInfo());
    results.initialCards = await window.locator(".crosshair-card").count();
    results.initialResultCount = await window.locator("#resultCount").textContent();

    await window.locator('[data-view="china"]').click();
    results.chinaCards = await window.locator(".crosshair-card").count();

    await window.locator("#searchInput").fill("ZmjjKK");
    results.searchCards = await window.locator(".crosshair-card").count();
    await window.locator(".crosshair-card").first().click();
    await window.locator("#detailDrawer.open").waitFor();
    await window.waitForTimeout(50);
    results.detailTitle = await window.locator("#detailTitle").textContent();
    results.zmjjkkCanvas = await canvasMetrics(window.locator("#detailCanvas"));
    await window.locator("#detailDrawer").screenshot({ path: path.join(artifacts, "detail.png") });

    await window.locator("#copyButton").click();
    await window.locator("#toast.show").waitFor();
    results.clipboard = await app.evaluate(({ clipboard }) => clipboard.readText());

    await window.locator("#detailFavorite").click();
    results.favoriteCount = await window.locator("#favoriteCount").textContent();
    await window.locator("#drawerClose").click();

    await window.locator("#importButton").click();
    await window.locator("#importCode").fill("0;s;1;P;c;5;o;0;f;0;0l;3;0v;3;0o;2;0a;1;0f;0;1b;0;S;o;0");
    await window.locator("#previewImport").click();
    await window.locator("#detailDrawer.open").waitFor();
    await window.waitForTimeout(50);
    results.importedTitle = await window.locator("#detailTitle").textContent();
    results.importedCanvas = await canvasMetrics(window.locator("#detailCanvas"));
    await window.locator("#detailDrawer").screenshot({ path: path.join(artifacts, "import-detail.png") });

    await window.locator("#drawerClose").click();
    await window.locator("#importButton").click();
    await window.locator("#importCode").fill("0;P;h;0;0b;0");
    await window.locator("#previewImport").click();
    await window.locator("#detailDrawer.open").waitFor();
    await window.waitForTimeout(50);
    results.defaultOuterCanvas = await canvasMetrics(window.locator("#detailCanvas"));
    await window.locator("#drawerClose").click();

    await window.locator('[data-view="all"]').click();
    await window.locator("#searchInput").fill("我的导入 01");
    await window.locator(".crosshair-card").first().waitFor();
    results.importedCardCanvas = await canvasMetrics(window.locator(".crosshair-card canvas").first());
    await window.locator("#searchInput").fill("ninebody");
    await window.locator(".crosshair-card").first().waitFor();
    results.ninebodyCardCanvas = await canvasMetrics(window.locator(".crosshair-card canvas").first());
    await window.locator("#searchInput").fill("CHICHOO");
    await window.locator(".crosshair-card").first().waitFor();
    results.chichooCardCanvas = await canvasMetrics(window.locator(".crosshair-card canvas").first());
    await window.locator("#searchInput").fill("");
    await window.locator('[data-filter="全部"]').click();
    results.axisAsymmetricCards = await findAxisAsymmetricCards(window);
    await window.locator(".main-content").evaluate((element) => element.scrollTo({ top: 0, behavior: "instant" }));
    await window.locator("#crosshairGrid").screenshot({ path: path.join(artifacts, "grid.png") });
    await window.screenshot({ path: path.join(artifacts, "app-home.png"), fullPage: true });

    const expected = {
      title: results.title === "准星匣",
      portableMode: process.env.EXPECT_PORTABLE ? results.appInfo.portable === true : true,
      initialCards: results.initialCards === 150,
      initialResultCount: results.initialResultCount === "150",
      chinaCards: results.chinaCards === 18,
      searchCards: results.searchCards === 1,
      detailTitle: results.detailTitle === "ZmjjKK",
      clipboard: results.clipboard.startsWith("0;"),
      favoriteCount: Number(results.favoriteCount) >= 1,
      importedTitle: results.importedTitle.startsWith("我的导入"),
      zmjjkkConnected:
        results.zmjjkkCanvas.centerRowContinuous &&
        results.zmjjkkCanvas.centerColumnContinuous,
      zmjjkkUndistorted:
        Math.abs(results.zmjjkkCanvas.scaleX - results.zmjjkkCanvas.scaleY) < 0.01 &&
        results.zmjjkkCanvas.boundingWidth === results.zmjjkkCanvas.boundingHeight,
      importedUndistorted:
        Math.abs(results.importedCanvas.scaleX - results.importedCanvas.scaleY) < 0.01 &&
        results.importedCanvas.boundingWidth === results.importedCanvas.boundingHeight,
      gamePixelSizing:
        results.zmjjkkCanvas.boundingWidth === 6 &&
        results.zmjjkkCanvas.boundingHeight === 6 &&
        results.importedCanvas.boundingWidth === 10 &&
        results.importedCanvas.boundingHeight === 10,
      currentOuterDefaults:
        results.defaultOuterCanvas.boundingWidth === 24 &&
        results.defaultOuterCanvas.boundingHeight === 24,
      importedCardSymmetric:
        results.importedCardCanvas.mirrorHorizontal &&
        results.importedCardCanvas.mirrorVertical &&
        results.importedCardCanvas.mirrorDiagonal,
      ninebodyCardSymmetric:
        results.ninebodyCardCanvas.mirrorHorizontal &&
        results.ninebodyCardCanvas.mirrorVertical &&
        results.ninebodyCardCanvas.mirrorDiagonal,
      chichooCardSymmetric:
        results.chichooCardCanvas.mirrorHorizontal &&
        results.chichooCardCanvas.mirrorVertical &&
        results.chichooCardCanvas.mirrorDiagonal &&
        results.chichooCardCanvas.boundingCenterOccupied,
      allCardsAxisSymmetric: results.axisAsymmetricCards.length === 0
    };

    const failures = Object.entries(expected).filter(([, value]) => !value);
    console.log(JSON.stringify({ results, expected }, null, 2));
    if (failures.length) {
      throw new Error(`冒烟测试失败：${failures.map(([key]) => key).join(", ")}`);
    }
  } finally {
    await app.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

