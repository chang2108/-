(function runApp() {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const i18n = window.CrosshairI18n;
  const t = (value) => i18n.t(value);

  const COLOR_MAP = {
    0: { name: "白色", hex: "#ffffff" },
    1: { name: "绿色", hex: "#00ff63" },
    2: { name: "黄色", hex: "#dfff00" },
    3: { name: "绿色", hex: "#7fff00" },
    4: { name: "黄色", hex: "#fff12b" },
    5: { name: "青色", hex: "#00ffff" },
    6: { name: "粉色", hex: "#ff4fc3" },
    7: { name: "红色", hex: "#ff4655" },
    8: { name: "自定义", hex: "#ffffff" }
  };

  const DIY_TEMPLATES = [
    { id: "dot", name: "点状", shape: { centerDot: true, dotThickness: 2, showInner: false, showOuter: false } },
    { id: "continuous", name: "连续十字", shape: { showInner: true, innerLength: 4, innerVerticalLength: 4, innerOffset: 0, innerThickness: 2, centerDot: false, showOuter: false } },
    { id: "split", name: "分离十字", shape: { showInner: true, innerLength: 4, innerVerticalLength: 4, innerOffset: 2, innerThickness: 2, centerDot: false, showOuter: false } },
    { id: "small", name: "小型十字", shape: { showInner: true, innerLength: 3, innerVerticalLength: 3, innerOffset: 1, innerThickness: 1, centerDot: false, showOuter: false } },
    { id: "long", name: "长十字", shape: { showInner: true, innerLength: 8, innerVerticalLength: 8, innerOffset: 3, innerThickness: 1, centerDot: false, showOuter: false } },
    { id: "thin", name: "细十字", shape: { showInner: true, innerLength: 5, innerVerticalLength: 5, innerOffset: 2, innerThickness: 1, centerDot: false, showOuter: false } },
    { id: "thick", name: "粗十字", shape: { showInner: true, innerLength: 4, innerVerticalLength: 4, innerOffset: 2, innerThickness: 3, centerDot: false, showOuter: false } },
    { id: "cross-dot", name: "十字＋点", shape: { showInner: true, innerLength: 4, innerVerticalLength: 4, innerOffset: 3, innerThickness: 2, centerDot: true, dotThickness: 2, showOuter: false } },
    { id: "double", name: "双层十字", shape: { showInner: true, innerLength: 4, innerVerticalLength: 4, innerOffset: 2, innerThickness: 2, centerDot: false, showOuter: true, outerLength: 2, outerVerticalLength: 2, outerThickness: 1, outerOffset: 8 } },
    { id: "horizontal", name: "仅横线", shape: { showInner: true, innerLength: 5, innerVerticalLength: 0, innerOffset: 2, innerThickness: 2, centerDot: false, showOuter: false } },
    { id: "vertical", name: "仅竖线", shape: { showInner: true, innerLength: 0, innerVerticalLength: 5, innerOffset: 2, innerThickness: 2, centerDot: false, showOuter: false } }
  ];

  const storage = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // 本地存储不可用时，应用仍可继续浏览和复制。
      }
    }
  };

  function defaultDiyConfig() {
    return {
      colorIndex: 5,
      colorHex: "#00ffff",
      outline: false,
      outlineOpacity: 0.5,
      outlineThickness: 1,
      centerDot: false,
      dotOpacity: 1,
      dotThickness: 2,
      showInner: true,
      innerOpacity: 1,
      innerLength: 4,
      innerVerticalLength: 4,
      innerThickness: 2,
      innerOffset: 2,
      innerMovement: false,
      innerFiring: false,
      showOuter: false,
      outerOpacity: 0.5,
      outerLength: 2,
      outerVerticalLength: 2,
      outerThickness: 1,
      outerOffset: 8,
      outerMovement: false,
      outerFiring: false
    };
  }

  const customEntries = storage.get("crosshair-vault-custom", []);
  const savedDiyItems = storage.get("crosshair-vault-diy", []);
  const state = {
    catalog: [...window.CROSSHAIR_CATALOG, ...customEntries],
    view: "all",
    filter: "全部",
    color: "全部",
    sort: "recommended",
    query: "",
    favorites: new Set(storage.get("crosshair-vault-favorites", [])),
    recent: storage.get("crosshair-vault-recent", []),
    selected: null,
    detailZoom: 1,
    diyItems: Array.isArray(savedDiyItems) ? savedDiyItems.slice(0, 100) : [],
    diy: {
      config: defaultDiyConfig(),
      template: "split",
      zoom: 8,
      name: "",
      editingId: null,
      undo: [],
      redo: []
    }
  };

  function primaryValues(code) {
    const tokens = String(code).trim().split(";").filter((token) => token !== "");
    const primaryIndex = tokens.indexOf("P");
    const start = primaryIndex >= 0 ? primaryIndex + 1 : 1;
    const values = {};

    for (let i = start; i < tokens.length - 1; i += 2) {
      const key = tokens[i];
      if (key === "A" || key === "S" || key === "P") break;
      const value = tokens[i + 1];
      if (value === "A" || value === "S" || value === "P") break;
      values[key] = value;
    }
    return values;
  }

  function parseCode(code) {
    const values = primaryValues(code);

    const number = (key, fallback) => {
      const parsed = Number.parseFloat(values[key]);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const range = (key, fallback, min, max) =>
      Math.max(min, Math.min(max, number(key, fallback)));
    const enabled = (key, fallback) => {
      if (!(key in values)) return fallback;
      return values[key] !== "0";
    };

    const colorIndex = Math.round(range("c", 0, 0, 8));
    let color = COLOR_MAP[colorIndex] || COLOR_MAP[0];
    if (colorIndex === 8 && values.u) {
      const hex = values.u.replace(/[^0-9a-f]/gi, "").slice(0, 6);
      if (hex.length === 6) color = { name: "自定义", hex: `#${hex}` };
    } else if (values.u && !("c" in values)) {
      const hex = values.u.replace(/[^0-9a-f]/gi, "").slice(0, 6);
      if (hex.length === 6) color = { name: "自定义", hex: `#${hex}` };
    }

    const innerLength = range("0l", 6, 0, 20);
    const outerLength = range("1l", 2, 0, 20);
    const independentInnerLength = enabled("0g", false);
    const independentOuterLength = enabled("1g", false);

    return {
      color,
      outline: enabled("h", true),
      outlineOpacity: range("o", 0.5, 0, 1),
      outlineThickness: range("t", 1, 1, 6),
      centerDot: enabled("d", false),
      dotOpacity: range("a", 1, 0, 1),
      dotThickness: range("z", 2, 1, 6),
      showInner: enabled("0b", true),
      innerOpacity: range("0a", 0.8, 0, 1),
      innerThickness: range("0t", 2, 0, 10),
      innerLength,
      innerVerticalLength: independentInnerLength ? range("0v", 6, 0, 20) : innerLength,
      innerOffset: range("0o", 3, 0, 20),
      showOuter: enabled("1b", true),
      outerOpacity: range("1a", 0.35, 0, 1),
      outerThickness: range("1t", 2, 0, 10),
      outerLength,
      outerVerticalLength: independentOuterLength ? range("1v", 2, 0, 20) : outerLength,
      outerOffset: range("1o", 10, 0, 40),
      movementError: enabled("0m", false) || enabled("1m", false),
      firingError: enabled("0f", false) || enabled("1f", false)
    };
  }

  function drawCrosshair(canvas, code, zoom = 1) {
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const deviceScale = Math.max(1, window.devicePixelRatio || 1);
    const targetWidth = Math.max(1, Math.round(bounds.width * deviceScale));
    const targetHeight = Math.max(1, Math.round(bounds.height * deviceScale));
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    const ctx = canvas.getContext("2d");
    const config = parseCode(code);
    const width = canvas.width;
    const height = canvas.height;
    const shapes = [];

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;

    // VALORANT 的长度、粗细和间距均是游戏画面中的原始像素值。
    // deviceScale 只用于提高 Canvas 清晰度，不能参与准星参数换算。
    const safeZoom = Math.max(1, Math.min(8, Math.round(zoom)));
    const pixelSize = (value) => {
      if (value <= 0) return 0;
      return Math.max(1, Math.round(value * safeZoom));
    };

    const rectangle = (x, y, w, h, alpha) => {
      const shape = {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.max(1, Math.round(w)),
        height: Math.max(1, Math.round(h)),
        alpha
      };
      shapes.push(shape);
    };

    const visibleDot = config.centerDot && config.dotOpacity > 0;
    const visibleInner =
      config.showInner &&
      config.innerOpacity > 0 &&
      config.innerThickness > 0 &&
      (config.innerLength > 0 || config.innerVerticalLength > 0);
    const visibleOuter =
      config.showOuter &&
      config.outerOpacity > 0 &&
      config.outerThickness > 0 &&
      (config.outerLength > 0 || config.outerVerticalLength > 0);
    // 只选择共同的中心相位；绝不为了对称而改写游戏中的线条粗细。
    const thicknesses = [
      visibleDot ? pixelSize(config.dotThickness) : 0,
      visibleInner ? pixelSize(config.innerThickness) : 0,
      visibleOuter ? pixelSize(config.outerThickness) : 0
    ];
    const centerParity = thicknesses.some((thickness) => thickness % 2 === 1) ? 1 : 0;

    const centeredAxis = (extent) =>
      centerParity === 0
        ? Math.floor(extent / 2)
        : Math.floor((extent - 1) / 2) + 0.5;
    const axisX = centeredAxis(width);
    const axisY = centeredAxis(height);
    const dotSize = pixelSize(config.dotThickness);
    const dotX = axisX - dotSize / 2;
    const dotY = axisY - dotSize / 2;

    const drawLines = (lengthX, lengthY, thickness, offset, opacity) => {
      if (thickness <= 0 || (lengthX <= 0 && lengthY <= 0) || opacity <= 0) return;

      const thicknessPixels = pixelSize(thickness);
      const lengthXPixels = pixelSize(lengthX);
      const lengthYPixels = pixelSize(lengthY);
      const horizontalY = axisY - thicknessPixels / 2;
      const verticalX = axisX - thicknessPixels / 2;
      const offsetPixels = Math.round(offset * safeZoom);
      const positiveX = Math.round(axisX + offsetPixels);
      const negativeX = axisX * 2 - positiveX;
      const positiveY = Math.round(axisY + offsetPixels);
      const negativeY = axisY * 2 - positiveY;

      if (lengthXPixels > 0) {
        rectangle(
          negativeX - lengthXPixels,
          horizontalY,
          lengthXPixels,
          thicknessPixels,
          opacity
        );
        rectangle(positiveX, horizontalY, lengthXPixels, thicknessPixels, opacity);
      }
      if (lengthYPixels > 0) {
        rectangle(
          verticalX,
          negativeY - lengthYPixels,
          thicknessPixels,
          lengthYPixels,
          opacity
        );
        rectangle(verticalX, positiveY, thicknessPixels, lengthYPixels, opacity);
      }
      if (offset === 0) {
        rectangle(verticalX, horizontalY, thicknessPixels, thicknessPixels, opacity);
      }
    };

    if (config.showOuter) {
      drawLines(
        config.outerLength,
        config.outerVerticalLength,
        config.outerThickness,
        config.outerOffset,
        config.outerOpacity
      );
    }

    if (config.showInner) {
      drawLines(
        config.innerLength,
        config.innerVerticalLength,
        config.innerThickness,
        config.innerOffset,
        config.innerOpacity
      );
    }

    if (visibleDot) {
      rectangle(dotX, dotY, dotSize, dotSize, config.dotOpacity);
    }

    if (config.outline && config.outlineOpacity > 0 && shapes.length > 0) {
      const border = pixelSize(config.outlineThickness);
      ctx.globalAlpha = config.outlineOpacity;
      ctx.fillStyle = "#050709";
      shapes.forEach((shape) => {
        ctx.fillRect(
          shape.x - border,
          shape.y - border,
          shape.width + border * 2,
          shape.height + border * 2
        );
      });
    }

    ctx.fillStyle = config.color.hex;
    shapes.forEach((shape) => {
      ctx.globalAlpha = shape.alpha;
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    });
    ctx.globalAlpha = 1;
  }

  function clampNumber(value, min, max, fallback = min, integer = false) {
    const parsed = Number.parseFloat(value);
    const safe = Number.isFinite(parsed) ? parsed : fallback;
    const clamped = Math.max(min, Math.min(max, safe));
    return integer ? Math.round(clamped) : Math.round(clamped * 10) / 10;
  }

  function sanitizeDiyConfig(raw) {
    const config = { ...defaultDiyConfig(), ...(raw || {}) };
    const hex = String(config.colorHex || "#ffffff").replace(/[^0-9a-f]/gi, "").slice(0, 6);
    return {
      colorIndex: clampNumber(config.colorIndex, 0, 8, 5, true),
      colorHex: `#${hex.length === 6 ? hex : "ffffff"}`,
      outline: Boolean(config.outline),
      outlineOpacity: clampNumber(config.outlineOpacity, 0, 1, 0.5),
      outlineThickness: clampNumber(config.outlineThickness, 1, 6, 1, true),
      centerDot: Boolean(config.centerDot),
      dotOpacity: clampNumber(config.dotOpacity, 0, 1, 1),
      dotThickness: clampNumber(config.dotThickness, 1, 6, 2, true),
      showInner: Boolean(config.showInner),
      innerOpacity: clampNumber(config.innerOpacity, 0, 1, 1),
      innerLength: clampNumber(config.innerLength, 0, 20, 4, true),
      innerVerticalLength: clampNumber(config.innerVerticalLength, 0, 20, 4, true),
      innerThickness: clampNumber(config.innerThickness, 1, 10, 2, true),
      innerOffset: clampNumber(config.innerOffset, 0, 20, 2, true),
      innerMovement: Boolean(config.innerMovement),
      innerFiring: Boolean(config.innerFiring),
      showOuter: Boolean(config.showOuter),
      outerOpacity: clampNumber(config.outerOpacity, 0, 1, 0.5),
      outerLength: clampNumber(config.outerLength, 0, 20, 2, true),
      outerVerticalLength: clampNumber(config.outerVerticalLength, 0, 20, 2, true),
      outerThickness: clampNumber(config.outerThickness, 1, 10, 1, true),
      outerOffset: clampNumber(config.outerOffset, 0, 40, 8, true),
      outerMovement: Boolean(config.outerMovement),
      outerFiring: Boolean(config.outerFiring)
    };
  }

  function configFromCode(code) {
    const parsed = parseCode(code);
    const values = primaryValues(code);
    const enabled = (key, fallback = false) => key in values ? values[key] !== "0" : fallback;
    const colorIndex = clampNumber(values.c, 0, 8, parsed.color.name === "自定义" ? 8 : 0, true);
    return sanitizeDiyConfig({
      colorIndex,
      colorHex: parsed.color.hex,
      outline: parsed.outline,
      outlineOpacity: parsed.outlineOpacity,
      outlineThickness: parsed.outlineThickness,
      centerDot: parsed.centerDot,
      dotOpacity: parsed.dotOpacity,
      dotThickness: parsed.dotThickness,
      showInner: parsed.showInner,
      innerOpacity: parsed.innerOpacity,
      innerLength: parsed.innerLength,
      innerVerticalLength: parsed.innerVerticalLength,
      innerThickness: parsed.innerThickness,
      innerOffset: parsed.innerOffset,
      innerMovement: enabled("0m"),
      innerFiring: enabled("0f"),
      showOuter: parsed.showOuter,
      outerOpacity: parsed.outerOpacity,
      outerLength: parsed.outerLength,
      outerVerticalLength: parsed.outerVerticalLength,
      outerThickness: parsed.outerThickness,
      outerOffset: parsed.outerOffset,
      outerMovement: enabled("1m"),
      outerFiring: enabled("1f")
    });
  }

  function formatDiyNumber(value) {
    return String(Math.round(Number(value) * 10) / 10);
  }

  function codeFromDiyConfig(raw) {
    const config = sanitizeDiyConfig(raw);
    const customColor = config.colorIndex === 8
      ? ["u", config.colorHex.slice(1).toUpperCase()]
      : [];
    const innerIndependent = config.innerLength !== config.innerVerticalLength;
    const outerIndependent = config.outerLength !== config.outerVerticalLength;
    const pairs = [
      "0", "P",
      "c", String(config.colorIndex),
      ...customColor,
      "h", config.outline ? "1" : "0",
      "o", formatDiyNumber(config.outlineOpacity),
      "t", String(config.outlineThickness),
      "d", config.centerDot ? "1" : "0",
      "a", formatDiyNumber(config.dotOpacity),
      "z", String(config.dotThickness),
      "0b", config.showInner ? "1" : "0",
      "0a", formatDiyNumber(config.innerOpacity),
      "0l", String(config.innerLength),
      "0v", String(config.innerVerticalLength),
      "0g", innerIndependent ? "1" : "0",
      "0t", String(config.innerThickness),
      "0o", String(config.innerOffset),
      "0m", config.innerMovement ? "1" : "0",
      "0f", config.innerFiring ? "1" : "0",
      "1b", config.showOuter ? "1" : "0",
      "1a", formatDiyNumber(config.outerOpacity),
      "1l", String(config.outerLength),
      "1v", String(config.outerVerticalLength),
      "1g", outerIndependent ? "1" : "0",
      "1t", String(config.outerThickness),
      "1o", String(config.outerOffset),
      "1m", config.outerMovement ? "1" : "0",
      "1f", config.outerFiring ? "1" : "0"
    ];
    return pairs.join(";");
  }

  function diySnapshot() {
    return {
      config: { ...state.diy.config },
      template: state.diy.template
    };
  }

  function commitDiy(mutator, template = state.diy.template) {
    const before = diySnapshot();
    const next = sanitizeDiyConfig(mutator({ ...state.diy.config }) || state.diy.config);
    if (JSON.stringify(next) === JSON.stringify(state.diy.config) && template === state.diy.template) return;
    state.diy.undo.push(before);
    state.diy.undo = state.diy.undo.slice(-60);
    state.diy.redo = [];
    state.diy.config = next;
    state.diy.template = template;
    renderDiyEditor();
  }

  function templateConfig(templateId, current = state.diy.config) {
    const template = DIY_TEMPLATES.find((item) => item.id === templateId) || DIY_TEMPLATES[2];
    const appearance = {
      colorIndex: current.colorIndex,
      colorHex: current.colorHex,
      outline: current.outline,
      outlineOpacity: current.outlineOpacity,
      outlineThickness: current.outlineThickness
    };
    const shapeDefaults = {
      centerDot: false,
      dotOpacity: 1,
      dotThickness: 2,
      showInner: true,
      innerOpacity: 1,
      innerLength: 4,
      innerVerticalLength: 4,
      innerThickness: 2,
      innerOffset: 2,
      innerMovement: false,
      innerFiring: false,
      showOuter: false,
      outerOpacity: 0.5,
      outerLength: 2,
      outerVerticalLength: 2,
      outerThickness: 1,
      outerOffset: 8,
      outerMovement: false,
      outerFiring: false
    };
    return sanitizeDiyConfig({ ...current, ...appearance, ...shapeDefaults, ...template.shape });
  }

  function applyDiyTemplate(templateId) {
    commitDiy(() => templateConfig(templateId), templateId);
  }

  function simpleSize(config) {
    if (!config.showInner && config.centerDot) return config.dotThickness;
    if (config.innerLength === 0 && config.innerVerticalLength > 0) return config.innerVerticalLength;
    return config.innerLength;
  }

  function dotMode(config) {
    if (!config.centerDot) return "0";
    if (config.dotThickness <= 1) return "1";
    if (config.dotThickness <= 3) return "2";
    return "3";
  }

  function outlineMode(config) {
    if (!config.outline) return "0";
    return config.outlineThickness >= 2 || config.outlineOpacity > 0.6 ? "2" : "1";
  }

  function setInputValue(id, value, checked = false) {
    const element = $(id);
    if (!element) return;
    if (checked) element.checked = Boolean(value);
    else element.value = String(value);
  }

  function renderDiyEditor() {
    const config = state.diy.config;
    const code = codeFromDiyConfig(config);
    const dotOnly = !config.showInner && config.centerDot;
    $("#diySize").min = dotOnly ? "1" : "0";
    $("#diySize").max = dotOnly ? "6" : "20";
    setInputValue("#diySize", simpleSize(config));
    setInputValue("#diyGap", config.innerOffset);
    setInputValue("#diyThickness", config.innerThickness);
    $("#diySizeValue").textContent = String(simpleSize(config));
    $("#diyGapValue").textContent = String(config.innerOffset);
    $("#diyThicknessValue").textContent = String(config.innerThickness);
    setInputValue("#diyDotMode", dotMode(config));
    setInputValue("#diyOutlineMode", outlineMode(config));
    setInputValue("#diyColor", config.colorIndex);
    setInputValue("#diyCustomColor", config.colorHex);
    setInputValue("#diyOuterEnabled", config.showOuter, true);
    $("#diyCustomColorWrap").classList.toggle("hidden", config.colorIndex !== 8);
    $("#diyCode").textContent = code;
    $("#diyName").value = state.diy.name;

    const advanced = {
      advInnerEnabled: [config.showInner, true],
      advInnerLength: [config.innerLength],
      advInnerVertical: [config.innerVerticalLength],
      advInnerThickness: [config.innerThickness],
      advInnerOffset: [config.innerOffset],
      advInnerOpacity: [config.innerOpacity],
      advInnerMovement: [config.innerMovement, true],
      advInnerFiring: [config.innerFiring, true],
      advOuterEnabled: [config.showOuter, true],
      advOuterLength: [config.outerLength],
      advOuterVertical: [config.outerVerticalLength],
      advOuterThickness: [config.outerThickness],
      advOuterOffset: [config.outerOffset],
      advOuterOpacity: [config.outerOpacity],
      advOuterMovement: [config.outerMovement, true],
      advOuterFiring: [config.outerFiring, true],
      advDotEnabled: [config.centerDot, true],
      advDotThickness: [config.dotThickness],
      advDotOpacity: [config.dotOpacity],
      advOutlineEnabled: [config.outline, true],
      advOutlineThickness: [config.outlineThickness],
      advOutlineOpacity: [config.outlineOpacity]
    };
    Object.entries(advanced).forEach(([id, [value, checked]]) => setInputValue(`#${id}`, value, checked));
    $$(".diy-template-button").forEach((button) =>
      button.classList.toggle("active", button.dataset.template === state.diy.template)
    );
    $("#diyUndo").disabled = state.diy.undo.length === 0;
    $("#diyRedo").disabled = state.diy.redo.length === 0;
    $("#diySave").textContent = t(state.diy.editingId ? "更新这枚 DIY" : "保存到我的 DIY");
    window.requestAnimationFrame(() => drawCrosshair($("#diyCanvas"), code, state.diy.zoom));
  }

  function renderDiyTemplates() {
    const container = $("#diyTemplates");
    const fragment = document.createDocumentFragment();
    DIY_TEMPLATES.forEach((template) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "diy-template-button";
      button.dataset.template = template.id;
      button.textContent = t(template.name);
      button.addEventListener("click", () => applyDiyTemplate(template.id));
      fragment.appendChild(button);
    });
    container.replaceChildren(fragment);
  }

  function nextDiyName() {
    const prefix = i18n.language === "en" ? "My DIY" : "我的 DIY";
    return `${prefix} ${String(state.diyItems.length + 1).padStart(2, "0")}`;
  }

  function saveDiyItems() {
    storage.set("crosshair-vault-diy", state.diyItems.slice(0, 100));
    $("#diyCount").textContent = String(state.diyItems.length);
  }

  async function copyText(value, successMessage) {
    try {
      if (window.crosshairDesktop) await window.crosshairDesktop.copyText(value);
      else await navigator.clipboard.writeText(value);
      showToast(successMessage);
      return true;
    } catch {
      showToast("复制失败，请稍后重试");
      return false;
    }
  }

  function saveCurrentDiy() {
    const name = state.diy.name.trim();
    if (!name) {
      showToast("请先给这枚准星起一个名称");
      $("#diyName").focus();
      return;
    }
    const now = new Date().toISOString();
    const existingIndex = state.diyItems.findIndex((entry) => entry.id === state.diy.editingId);
    const item = {
      id: state.diy.editingId || `diy-${Date.now()}-${hashCode(name)}`,
      name: name.slice(0, 32),
      code: codeFromDiyConfig(state.diy.config),
      config: sanitizeDiyConfig(state.diy.config),
      favorite: existingIndex >= 0 ? Boolean(state.diyItems[existingIndex].favorite) : false,
      updatedAt: now
    };
    if (existingIndex >= 0) state.diyItems.splice(existingIndex, 1, item);
    else state.diyItems.unshift(item);
    state.diy.editingId = item.id;
    state.diy.name = item.name;
    saveDiyItems();
    renderSavedDiy();
    renderDiyEditor();
    showToast(existingIndex >= 0 ? "DIY 准星已更新" : "已保存到我的 DIY");
  }

  function loadDiyItem(item) {
    state.diy.config = sanitizeDiyConfig(item.config || configFromCode(item.code));
    state.diy.template = "custom";
    state.diy.name = item.name;
    state.diy.editingId = item.id;
    state.diy.undo = [];
    state.diy.redo = [];
    renderDiyEditor();
    $("#diyWorkspace").scrollIntoView({ block: "start" });
    showToast("已载入，可以继续调整");
  }

  function newDiy() {
    state.diy.config = defaultDiyConfig();
    state.diy.template = "split";
    state.diy.name = nextDiyName();
    state.diy.editingId = null;
    state.diy.undo = [];
    state.diy.redo = [];
    renderDiyEditor();
  }

  function loadCodeIntoDiy(code, sourceName = "导入准星") {
    state.diy.config = configFromCode(code);
    state.diy.template = "custom";
    state.diy.name = `${sourceName} DIY`.slice(0, 32);
    state.diy.editingId = null;
    state.diy.undo = [];
    state.diy.redo = [];
    closeDetail();
    setView("diy");
    showToast("已载入 DIY 工坊，原准星不会被修改");
  }

  function deleteDiyItem(item) {
    const prompt = i18n.language === "en"
      ? `Delete “${item.name}”?`
      : `确定删除“${item.name}”吗？`;
    if (!window.confirm(prompt)) return;
    state.diyItems = state.diyItems.filter((entry) => entry.id !== item.id);
    if (state.diy.editingId === item.id) newDiy();
    saveDiyItems();
    renderSavedDiy();
    showToast("已删除这枚 DIY 准星");
  }

  function toggleDiyFavorite(item) {
    const stored = state.diyItems.find((entry) => entry.id === item.id);
    if (!stored) return;
    stored.favorite = !stored.favorite;
    saveDiyItems();
    renderSavedDiy();
    showToast(stored.favorite ? "已收藏这枚 DIY 准星" : "已取消 DIY 收藏");
  }

  function renderSavedDiy() {
    const grid = $("#diySavedGrid");
    const fragment = document.createDocumentFragment();
    [...state.diyItems]
      .sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)))
      .forEach((item) => {
      const card = document.createElement("article");
      card.className = "diy-saved-card";
      const preview = document.createElement("div");
      preview.className = "diy-saved-preview";
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-label", i18n.language === "en" ? `${item.name} crosshair preview` : `${item.name} 准星预览`);
      preview.appendChild(canvas);

      const body = document.createElement("div");
      body.className = "diy-saved-body";
      const title = document.createElement("strong");
      title.textContent = item.name;
      const meta = document.createElement("small");
      const updated = String(item.updatedAt || "").slice(0, 10);
      meta.textContent = i18n.language === "en"
        ? `Updated ${updated || "locally saved"}`
        : `更新 ${updated || "本机保存"}`;
      const actions = document.createElement("div");
      actions.className = "diy-saved-actions";
      const edit = document.createElement("button");
      edit.textContent = t("继续编辑");
      edit.addEventListener("click", () => loadDiyItem(item));
      const copy = document.createElement("button");
      copy.textContent = t("复制代码");
      copy.addEventListener("click", () => copyText(item.code, "DIY 准星代码已复制"));
      const remove = document.createElement("button");
      remove.className = "danger";
      remove.textContent = t("删除");
      remove.addEventListener("click", () => deleteDiyItem(item));
      const favorite = document.createElement("button");
      favorite.className = item.favorite ? "favorite active" : "favorite";
      favorite.textContent = item.favorite ? "♥" : "♡";
      favorite.setAttribute("aria-label", t(item.favorite ? "取消收藏" : "收藏"));
      favorite.addEventListener("click", () => toggleDiyFavorite(item));
      actions.append(edit, copy, favorite, remove);
      body.append(title, meta, actions);
      card.append(preview, body);
      fragment.appendChild(card);
      window.requestAnimationFrame(() => drawCrosshair(canvas, item.code));
      });
    grid.replaceChildren(fragment);
    $("#diySavedEmpty").classList.toggle("hidden", state.diyItems.length > 0);
    $("#diyCount").textContent = String(state.diyItems.length);
  }

  function undoDiy() {
    const previous = state.diy.undo.pop();
    if (!previous) return;
    state.diy.redo.push(diySnapshot());
    state.diy.config = sanitizeDiyConfig(previous.config);
    state.diy.template = previous.template;
    renderDiyEditor();
  }

  function redoDiy() {
    const next = state.diy.redo.pop();
    if (!next) return;
    state.diy.undo.push(diySnapshot());
    state.diy.config = sanitizeDiyConfig(next.config);
    state.diy.template = next.template;
    renderDiyEditor();
  }

  function hexForEntry(entry) {
    return parseCode(entry.code).color.hex;
  }

  const EN_NAME_PARTS = [
    ["霓虹青", "Neon Cyan"], ["纯净白", "Pure White"], ["荧光绿", "Neon Green"],
    ["明亮黄", "Bright Yellow"], ["警示红", "Alert Red"], ["樱花粉", "Sakura Pink"],
    ["标准点", "Standard Dot"], ["微点", "Micro Dot"], ["小点", "Small Dot"],
    ["大点", "Large Dot"], ["空心环", "Hollow Ring"], ["内外双线", "Dual Lines"],
    ["移动反馈", "Movement Feedback"], ["射击反馈", "Firing Feedback"], ["十字", "Cross"]
  ];

  function localizedEntryName(entry) {
    if (i18n.language !== "en" || entry.kind !== "经典常用") return entry.name;
    return EN_NAME_PARTS.reduce((name, [zh, en]) => name.replaceAll(zh, en), entry.name);
  }

  function localizedEntryDescription(entry) {
    if (i18n.language !== "en") return entry.description;
    if (entry.kind === "职业选手") {
      return `A publicly recorded crosshair configuration for ${entry.name}. Professional players may change their settings at any time.`;
    }
    if (entry.kind === "我的导入") {
      return "A crosshair code you pasted and saved locally. The app only parses text parameters and never connects to the game.";
    }
    return `A built-in ${t(entry.style).toLowerCase()} preset validated locally against the game's crosshair code format.`;
  }

  function localizedTeam(entry) {
    if (i18n.language !== "en") return entry.team;
    return String(entry.team)
      .replaceAll("主播", "Streamer")
      .replaceAll("内容创作者", "Content creator")
      .replaceAll("职业选手", "Pro player")
      .replaceAll("仅保存在此设备", "Stored on this device only")
      .replaceAll("社区常用参数", "Community preset");
  }

  function localizedTag(tag) {
    return t(tag);
  }

  function filteredEntries() {
    const query = state.query.trim().toLocaleLowerCase(i18n.language === "en" ? "en" : "zh-CN");
    let result = state.catalog.filter((entry) => {
      if (state.view === "china" && entry.region !== "中国赛区") return false;
      if (state.view === "pro" && entry.kind !== "职业选手") return false;
      if (state.view === "favorites" && !state.favorites.has(entry.id)) return false;
      if (state.view === "recent" && !state.recent.includes(entry.id)) return false;
      if (state.filter === "热门" && !entry.featured) return false;
      if (!["全部", "热门"].includes(state.filter) && entry.style !== state.filter) return false;
      if (state.color !== "全部" && entry.color !== state.color) return false;
      if (query) {
        const haystack = [
          entry.name,
          entry.player,
          entry.team,
          entry.region,
          entry.style,
          entry.color,
          ...(entry.tags || [])
          , localizedEntryName(entry), localizedTeam(entry), t(entry.region), t(entry.style), t(entry.color)
        ]
          .join(" ")
          .toLocaleLowerCase("zh-CN");
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    if (state.view === "recent") {
      result.sort((a, b) => state.recent.indexOf(a.id) - state.recent.indexOf(b.id));
    } else if (state.sort === "name") {
      result.sort((a, b) => localizedEntryName(a).localeCompare(localizedEntryName(b), i18n.language));
    } else if (state.sort === "latest") {
      result.sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt));
    } else {
      result.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.region !== b.region && (a.region === "中国赛区" || b.region === "中国赛区")) {
          return a.region === "中国赛区" ? -1 : 1;
        }
        return 0;
      });
    }

    return result;
  }

  function createCard(entry) {
    const card = document.createElement("article");
    card.className = "crosshair-card";
    card.tabIndex = 0;
    const displayName = localizedEntryName(entry);
    card.setAttribute("aria-label", i18n.language === "en" ? `View ${displayName} crosshair` : `查看 ${displayName} 准星`);
    const isFavorite = state.favorites.has(entry.id);
    const badge = entry.region === "中国赛区" ? "VCT CN" : entry.kind === "职业选手" ? "PRO" : "COMMON";

    card.innerHTML = `
      <div class="card-preview">
        <canvas width="520" height="300" data-zoom="1" aria-label="${i18n.language === "en" ? `${displayName} crosshair preview` : `${displayName} 准星预览`}"></canvas>
        <span class="card-badge ${entry.region === "中国赛区" ? "china" : ""}">${badge}</span>
        <button class="card-favorite ${isFavorite ? "active" : ""}" aria-label="${t(isFavorite ? "取消收藏" : "收藏")}">
          ${isFavorite ? "♥" : "♡"}
        </button>
        <div class="card-zoom" aria-label="${t("预览倍率")}">
          <button class="active" data-zoom="1">1×</button>
          <button data-zoom="4">4×</button>
          <button data-zoom="8">8×</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title-row">
          <div class="card-title">
            <h3>${displayName}</h3>
            <p>${localizedTeam(entry)}</p>
          </div>
          <span class="style-pill">${t(entry.style)}</span>
        </div>
        <div class="card-footer">
          <span class="color-chip"><i></i>${t(entry.color)}</span>
          <span class="card-copy-hint">${t("点击查看与复制 →")}</span>
        </div>
      </div>
    `;

    $(".color-chip", card).style.setProperty("--chip-color", hexForEntry(entry));
    $("canvas", card).dataset.crosshairCode = entry.code;
    card.addEventListener("click", () => openDetail(entry));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetail(entry);
      }
    });
    $(".card-favorite", card).addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(entry.id);
    });
    $$(".card-zoom button", card).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const zoom = Number(button.dataset.zoom);
        const canvas = $("canvas", card);
        canvas.dataset.zoom = String(zoom);
        $$(".card-zoom button", card).forEach((item) => item.classList.toggle("active", item === button));
        drawCrosshair(canvas, entry.code, zoom);
      });
    });
    return card;
  }

  function render() {
    const entries = filteredEntries();
    const grid = $("#crosshairGrid");
    const fragment = document.createDocumentFragment();
    entries.forEach((entry) => fragment.appendChild(createCard(entry)));
    grid.replaceChildren(fragment);
    $$(".card-preview canvas", grid).forEach((canvas) => {
      drawCrosshair(canvas, canvas.dataset.crosshairCode, Number(canvas.dataset.zoom || 1));
    });

    $("#resultCount").textContent = String(entries.length);
    $("#emptyState").classList.toggle("hidden", entries.length > 0);
    $("#allCount").textContent = String(state.catalog.length);
    $("#chinaCount").textContent = String(state.catalog.filter((entry) => entry.region === "中国赛区").length);
    $("#proCount").textContent = String(state.catalog.filter((entry) => entry.kind === "职业选手").length);
    $("#favoriteCount").textContent = String(state.favorites.size);
    $("#recentCount").textContent = String(state.recent.length);
    $("#diyCount").textContent = String(state.diyItems.length);
  }

  function redrawVisibleCrosshairs() {
    $$(".card-preview canvas").forEach((canvas) => {
      drawCrosshair(canvas, canvas.dataset.crosshairCode, Number(canvas.dataset.zoom || 1));
    });
    if (state.selected) {
      const detailCanvas = $("#detailCanvas");
      detailCanvas.dataset.crosshairCode = state.selected.code;
      drawCrosshair(detailCanvas, state.selected.code, state.detailZoom);
    }
    if (!$("#diyWorkspace").classList.contains("hidden")) {
      drawCrosshair($("#diyCanvas"), codeFromDiyConfig(state.diy.config), state.diy.zoom);
    }
  }

  const viewCopy = {
    all: ["CROSSHAIR LIBRARY", "探索你的下一枚准星", "从职业选手配置到经典常用样式，点击卡片即可预览和复制。"],
    china: ["VCT CHINA", "中国赛区选手准星", "集中浏览 EDG、BLG、XLG、Wolves 等中国赛区相关选手的公开配置。"],
    pro: ["PRO PLAYERS", "职业选手公开配置", "选手会经常更换准星；这里展示的是公开资料中曾核验的配置。"],
    favorites: ["YOUR COLLECTION", "我的收藏", "你喜欢的准星都会保存在本机，不会上传到任何服务器。"],
    recent: ["RECENTLY VIEWED", "最近查看", "快速找回刚刚比较过的准星。"]
  };

  function setView(view) {
    state.view = view;
    $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
    const diyActive = view === "diy";
    $$(".style-nav button").forEach((button) =>
      button.classList.toggle("active", view === "all" && button.dataset.style === state.filter)
    );
    $("#libraryWorkspace").classList.toggle("hidden", diyActive);
    $("#libraryTopbar").classList.toggle("hidden", diyActive);
    $("#diyWorkspace").classList.toggle("hidden", !diyActive);
    $("#diyTopbar").classList.toggle("hidden", !diyActive);
    if (diyActive) {
      renderDiyEditor();
      renderSavedDiy();
      $(".main-content").scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const [eyebrow, title, subtitle] = viewCopy[view] || viewCopy.all;
    $("#eyebrow").textContent = eyebrow;
    $("#pageTitle").textContent = t(title);
    $("#pageSubtitle").textContent = t(subtitle);
    render();
  }

  function setFilter(filter) {
    state.filter = filter;
    $$("#filterTabs button").forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
    $$(".style-nav button").forEach((button) =>
      button.classList.toggle("active", state.view === "all" && button.dataset.style === filter)
    );
    render();
  }

  function saveFavorites() {
    storage.set("crosshair-vault-favorites", [...state.favorites]);
  }

  function toggleFavorite(id) {
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast("已取消收藏");
    } else {
      state.favorites.add(id);
      showToast("已加入我的收藏");
    }
    saveFavorites();
    if (state.selected?.id === id) updateDetailFavorite();
    render();
  }

  function addRecent(id) {
    state.recent = [id, ...state.recent.filter((item) => item !== id)].slice(0, 12);
    storage.set("crosshair-vault-recent", state.recent);
    $("#recentCount").textContent = String(state.recent.length);
  }

  function updateDetailFavorite() {
    const active = Boolean(state.selected && state.favorites.has(state.selected.id));
    $("#detailFavorite").classList.toggle("active", active);
    $("#detailFavorite").textContent = active ? "♥" : "♡";
    $("#detailFavorite").setAttribute("aria-label", t(active ? "取消收藏" : "收藏"));
  }

  function renderDetailContent(entry) {
    const kind = t(entry.kind);
    const region = t(entry.region);
    $("#detailKicker").textContent =
      `${kind} · ${region}`;
    $("#detailTitle").textContent = localizedEntryName(entry);
    $("#detailMeta").textContent = `${localizedTeam(entry)} · ${t(entry.style)}`;
    $("#detailDescription").textContent = localizedEntryDescription(entry);
    $("#detailCode").textContent = entry.code;
    $("#verifiedDate").textContent = i18n.language === "en" ? `Verified ${entry.verifiedAt}` : `核验 ${entry.verifiedAt}`;
    if (i18n.language === "en") {
      $("#sourceNote").textContent = entry.kind === "职业选手"
        ? "Source: public player and configuration references. Professional players may change settings at any time; this app preserves a previously verified record."
        : entry.kind === "我的导入"
          ? "Source: imported and stored locally on this device."
          : "Source: built-in preset validated against the game's crosshair code format.";
    } else {
      $("#sourceNote").textContent =
        `资料说明：${entry.source}。职业选手可能随时更换配置，本应用仅记录公开资料中曾核验的准星。`;
    }
    $("#detailTags").replaceChildren(
      ...(entry.tags || []).map((tag) => {
        const span = document.createElement("span");
        span.textContent = localizedTag(tag);
        return span;
      })
    );
    const detailCanvas = $("#detailCanvas");
    detailCanvas.dataset.crosshairCode = entry.code;
    updateDetailFavorite();
    $(".preview-pixel-note").textContent = state.detailZoom === 1
      ? t("静止主准星 · 游戏原始像素 1:1")
      : (i18n.language === "en" ? `Static primary crosshair · ${state.detailZoom}× zoom` : `静止主准星 · 放大 ${state.detailZoom}×`);
    $$("#detailZoomControls button").forEach((button) =>
      button.classList.toggle("active", Number(button.dataset.zoom) === state.detailZoom)
    );
    window.requestAnimationFrame(() => drawCrosshair(detailCanvas, entry.code, state.detailZoom));
  }

  function openDetail(entry) {
    state.selected = entry;
    state.detailZoom = 1;
    addRecent(entry.id);
    renderDetailContent(entry);

    $("#drawerBackdrop").classList.remove("hidden");
    $("#detailDrawer").classList.add("open");
    $("#detailDrawer").setAttribute("aria-hidden", "false");
  }

  function closeDetail() {
    $("#detailDrawer").classList.remove("open");
    $("#detailDrawer").setAttribute("aria-hidden", "true");
    window.setTimeout(() => $("#drawerBackdrop").classList.add("hidden"), 240);
  }

  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = t(message);
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  async function copySelected() {
    if (!state.selected) return;
    if (await copyText(state.selected.code, "准星代码已复制到 Windows 剪贴板")) {
      const button = $("#copyButton strong");
      const previous = button.textContent;
      button.textContent = t("复制成功");
      window.setTimeout(() => {
        button.textContent = previous;
      }, 1600);
    }
  }

  function validateImport(value) {
    const code = value.trim();
    if (!code) return "请先粘贴准星代码。";
    if (code.length > 2500) return "代码长度异常，请检查后重试。";
    if (!/^0(?:;[A-Za-z0-9.-]+)+$/.test(code)) return "格式无法识别：准星代码通常以“0;”开头。";
    if (!code.includes(";P;") && !code.startsWith("0;P;")) return "代码中缺少主准星（P）配置。";
    const parsed = parseCode(code);
    if (!parsed.centerDot && !parsed.showInner && !parsed.showOuter) return "该代码没有可显示的中心点或线条。";
    return "";
  }

  function hashCode(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function previewImported() {
    const code = $("#importCode").value.trim();
    const error = validateImport(code);
    $("#importError").textContent = t(error);
    if (error) return;

    const parsed = parseCode(code);
    const id = `custom-${hashCode(code)}`;
    let entry = state.catalog.find((item) => item.id === id);
    if (!entry) {
      const importedNumber = state.catalog.filter((item) => item.kind === "我的导入").length + 1;
      entry = {
        id,
        name: `我的导入 ${String(importedNumber).padStart(2, "0")}`,
        player: "",
        region: "本地导入",
        team: "仅保存在此设备",
        code,
        style: parsed.centerDot && !parsed.showInner && !parsed.showOuter ? "点状" : parsed.showOuter ? "外线" : "十字",
        color: parsed.color.name,
        description: "你粘贴并在本地保存的准星代码。应用只解析文本参数，不会连接或操作游戏。",
        kind: "我的导入",
        featured: false,
        verifiedAt: new Date().toISOString().slice(0, 10),
        source: "用户本地导入",
        tags: ["我的导入", "本地保存", parsed.color.name]
      };
      state.catalog.push(entry);
      const customs = state.catalog.filter((item) => item.kind === "我的导入").slice(-30);
      storage.set("crosshair-vault-custom", customs);
    }
    $("#importDialog").close();
    $("#importCode").value = "";
    render();
    openDetail(entry);
  }

  function resetFilters() {
    state.view = "all";
    state.query = "";
    state.filter = "全部";
    state.color = "全部";
    state.sort = "recommended";
    $("#searchInput").value = "";
    $("#colorSelect").value = "全部";
    $("#sortSelect").value = "recommended";
    setView("all");
    setFilter("全部");
  }

  function bindDiyEvents() {
    $("#diySize").addEventListener("input", (event) => {
      const value = Number(event.target.value);
      commitDiy((config) => {
        if (!config.showInner && config.centerDot) {
          config.dotThickness = Math.max(1, Math.min(6, value));
        } else if (config.innerLength === 0 && config.innerVerticalLength > 0) {
          config.innerVerticalLength = value;
        } else if (config.innerVerticalLength === 0 && config.innerLength > 0) {
          config.innerLength = value;
        } else {
          config.innerLength = value;
          config.innerVerticalLength = value;
        }
        return config;
      });
    });
    $("#diyGap").addEventListener("input", (event) => {
      commitDiy((config) => ({ ...config, innerOffset: Number(event.target.value) }));
    });
    $("#diyThickness").addEventListener("input", (event) => {
      commitDiy((config) => {
        const value = Number(event.target.value);
        if (!config.showInner && config.centerDot) config.dotThickness = Math.min(6, value);
        else config.innerThickness = value;
        return config;
      });
    });
    $("#diyDotMode").addEventListener("change", (event) => {
      const mode = Number(event.target.value);
      const sizes = { 1: 1, 2: 2, 3: 4 };
      commitDiy((config) => ({
        ...config,
        centerDot: mode > 0,
        dotThickness: sizes[mode] || config.dotThickness
      }));
    });
    $("#diyOutlineMode").addEventListener("change", (event) => {
      const mode = Number(event.target.value);
      commitDiy((config) => ({
        ...config,
        outline: mode > 0,
        outlineOpacity: mode === 2 ? 1 : 0.5,
        outlineThickness: mode === 2 ? 2 : 1
      }));
    });
    $("#diyColor").addEventListener("change", (event) => {
      const colorIndex = Number(event.target.value);
      commitDiy((config) => ({
        ...config,
        colorIndex,
        colorHex: colorIndex === 8 ? config.colorHex : COLOR_MAP[colorIndex].hex
      }));
    });
    $("#diyCustomColor").addEventListener("input", (event) => {
      commitDiy((config) => ({ ...config, colorIndex: 8, colorHex: event.target.value }));
    });
    $("#diyOuterEnabled").addEventListener("change", (event) => {
      commitDiy((config) => ({ ...config, showOuter: event.target.checked }));
    });
    $("#diyName").addEventListener("input", (event) => {
      state.diy.name = event.target.value.slice(0, 32);
    });

    const advancedBindings = [
      ["advInnerEnabled", "showInner", "checkbox"],
      ["advInnerLength", "innerLength", "number"],
      ["advInnerVertical", "innerVerticalLength", "number"],
      ["advInnerThickness", "innerThickness", "number"],
      ["advInnerOffset", "innerOffset", "number"],
      ["advInnerOpacity", "innerOpacity", "number"],
      ["advInnerMovement", "innerMovement", "checkbox"],
      ["advInnerFiring", "innerFiring", "checkbox"],
      ["advOuterEnabled", "showOuter", "checkbox"],
      ["advOuterLength", "outerLength", "number"],
      ["advOuterVertical", "outerVerticalLength", "number"],
      ["advOuterThickness", "outerThickness", "number"],
      ["advOuterOffset", "outerOffset", "number"],
      ["advOuterOpacity", "outerOpacity", "number"],
      ["advOuterMovement", "outerMovement", "checkbox"],
      ["advOuterFiring", "outerFiring", "checkbox"],
      ["advDotEnabled", "centerDot", "checkbox"],
      ["advDotThickness", "dotThickness", "number"],
      ["advDotOpacity", "dotOpacity", "number"],
      ["advOutlineEnabled", "outline", "checkbox"],
      ["advOutlineThickness", "outlineThickness", "number"],
      ["advOutlineOpacity", "outlineOpacity", "number"]
    ];
    advancedBindings.forEach(([id, key, type]) => {
      $("#" + id).addEventListener("change", (event) => {
        const value = type === "checkbox" ? event.target.checked : Number(event.target.value);
        commitDiy((config) => ({ ...config, [key]: value }), "custom");
      });
    });

    $$("#diyZoomControls button").forEach((button) => {
      button.addEventListener("click", () => {
        state.diy.zoom = Number(button.dataset.zoom);
        $$("#diyZoomControls button").forEach((item) => item.classList.toggle("active", item === button));
        $("#diyPreviewNote").textContent = state.diy.zoom === 1
          ? t("游戏原始像素 1:1")
          : (i18n.language === "en" ? `${state.diy.zoom}× zoom · easier editing` : `放大 ${state.diy.zoom}× · 便于编辑`);
        renderDiyEditor();
      });
    });
    $("#diyUndo").addEventListener("click", undoDiy);
    $("#diyRedo").addEventListener("click", redoDiy);
    $("#diyReset").addEventListener("click", () => {
      applyDiyTemplate(state.diy.template === "custom" ? "split" : state.diy.template);
    });
    $("#diyNew").addEventListener("click", newDiy);
    $("#diyCopy").addEventListener("click", () =>
      copyText(codeFromDiyConfig(state.diy.config), "DIY 准星代码已复制到 Windows 剪贴板")
    );
    $("#diySave").addEventListener("click", saveCurrentDiy);
    $("#editInDiyButton").addEventListener("click", () => {
      if (state.selected) loadCodeIntoDiy(state.selected.code, state.selected.name);
    });
  }

  function bindEvents() {
    $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
    $$(".style-nav button").forEach((button) => {
      button.addEventListener("click", () => {
        setView("all");
        setFilter(button.dataset.style);
      });
    });
    $$("#filterTabs button").forEach((button) =>
      button.addEventListener("click", () => setFilter(button.dataset.filter))
    );

    $("#searchInput").addEventListener("input", (event) => {
      state.query = event.target.value;
      render();
    });
    $("#colorSelect").addEventListener("change", (event) => {
      state.color = event.target.value;
      render();
    });
    $("#sortSelect").addEventListener("change", (event) => {
      state.sort = event.target.value;
      render();
    });

    $("#randomButton").addEventListener("click", () => {
      const entries = filteredEntries();
      if (!entries.length) return showToast("当前筛选下没有可选准星");
      openDetail(entries[Math.floor(Math.random() * entries.length)]);
    });

    $("#importButton").addEventListener("click", () => {
      $("#importError").textContent = "";
      $("#importDialog").showModal();
      window.setTimeout(() => $("#importCode").focus(), 50);
    });
    $("#previewImport").addEventListener("click", previewImported);
    $("#importCode").addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") previewImported();
    });

    $("#drawerClose").addEventListener("click", closeDetail);
    $("#drawerBackdrop").addEventListener("click", closeDetail);
    $("#copyButton").addEventListener("click", copySelected);
    $("#detailFavorite").addEventListener("click", () => {
      if (state.selected) toggleFavorite(state.selected.id);
    });

    $$("#sceneControls button").forEach((button) => {
      button.addEventListener("click", () => {
        const preview = $("#detailPreview");
        preview.className = `detail-preview scene-${button.dataset.scene}`;
        $$("#sceneControls button").forEach((item) => item.classList.toggle("active", item === button));
        if (state.selected) drawCrosshair($("#detailCanvas"), state.selected.code, state.detailZoom);
      });
    });

    $$("#detailZoomControls button").forEach((button) => {
      button.addEventListener("click", () => {
        state.detailZoom = Number(button.dataset.zoom);
        if (state.selected) renderDetailContent(state.selected);
      });
    });

    $("#languageSelect").addEventListener("change", (event) => {
      applyLanguage(event.target.value);
    });

    $("#clearFilters").addEventListener("click", resetFilters);
    $("#aboutButton").addEventListener("click", () => $("#aboutDialog").showModal());
    $("#showDataButton").addEventListener("click", async () => {
      if (window.crosshairDesktop) await window.crosshairDesktop.showDataFolder();
    });

    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        if (state.view === "diy") setView("all");
        $("#searchInput").focus();
      }
      if (event.key === "Escape" && $("#detailDrawer").classList.contains("open")) closeDetail();
    });

    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(redrawVisibleCrosshairs);
    });
  }

  async function loadAppInfo() {
    if (!window.crosshairDesktop) {
      $("#editionLabel").textContent = t("浏览器预览模式");
      return;
    }
    try {
      const info = await window.crosshairDesktop.getAppInfo();
      $("#appVersion").textContent = info.version;
      $("#editionLabel").textContent = t(info.portable ? "便携版 · 数据随程序保存" : "安装版 · 数据保存在用户目录");
    } catch {
      $("#editionLabel").textContent = t("离线桌面版");
    }
  }

  function applyLanguage(language) {
    i18n.setLanguage(language);
    document.documentElement.lang = i18n.language;
    document.title = t("准星匣");
    $("#languageSelect").value = i18n.language;
    i18n.translateDom(document);
    renderDiyTemplates();
    setView(state.view);
    renderSavedDiy();
    renderDiyEditor();
    if (state.selected) renderDetailContent(state.selected);
    loadAppInfo();
  }

  document.documentElement.lang = i18n.language;
  $("#languageSelect").value = i18n.language;
  i18n.translateDom(document);
  renderDiyTemplates();
  state.diy.name = nextDiyName();
  bindDiyEvents();
  bindEvents();
  loadAppInfo();
  render();
  renderDiyEditor();
  renderSavedDiy();
})();

