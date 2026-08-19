(function createI18n() {
  "use strict";

  const EN = {
    "准星匣": "Crosshair Vault",
    "离线准星图鉴": "Offline crosshair library",
    "主导航": "Main navigation",
    "探索准星": "Explore",
    "DIY 准星": "DIY Crosshair",
    "中国赛区": "VCT China",
    "职业选手": "Pro Players",
    "我的收藏": "Favorites",
    "最近查看": "Recently Viewed",
    "按形态浏览": "Browse by style",
    "准星形态": "Crosshair styles",
    "点状准星": "Dot",
    "十字准星": "Cross",
    "空心准星": "Hollow",
    "外线准星": "Outer Lines",
    "动态准星": "Dynamic",
    "独立离线运行": "Fully offline",
    "不连接、检测或修改游戏": "Never connects to or modifies the game",
    "关于与安全说明": "About & Safety",
    "搜索准星名称、选手 ID 或战队…": "Search crosshair, player ID, or team…",
    "随机一个": "Surprise me",
    "导入代码预览": "Import code",
    "积木式准星工坊": "Visual Crosshair Studio",
    "用直观选项生成游戏原生代码": "Build a native game code with visual controls",
    "仅在本机生成文本，不接触游戏": "Generated locally; the game is never accessed",
    "探索你的下一枚准星": "Find your next crosshair",
    "从职业选手配置到经典常用样式，点击卡片即可预览和复制。": "Browse pro settings and classic presets. Select a card to preview and copy.",
    "枚可选准星": "crosshairs",
    "筛选工具": "Filters",
    "全部": "All",
    "热门推荐": "Popular",
    "点状": "Dot",
    "十字": "Cross",
    "空心": "Hollow",
    "外线": "Outer Lines",
    "动态": "Dynamic",
    "颜色": "Color",
    "全部颜色": "All colors",
    "青色": "Cyan",
    "白色": "White",
    "绿色": "Green",
    "红色": "Red",
    "黄色": "Yellow",
    "粉色": "Pink",
    "自定义": "Custom",
    "自定义色": "Custom color",
    "排序": "Sort",
    "推荐优先": "Recommended",
    "名称排序": "Name",
    "最近核验": "Recently verified",
    "没有找到匹配的准星": "No matching crosshairs",
    "换一个关键词，或者清除筛选条件再试试。": "Try another search or clear the filters.",
    "清除筛选": "Clear filters",
    "像搭积木一样制作准星": "Build a crosshair visually",
    "先选造型，再调整大小、空隙和粗细；所有参数都会自动对齐游戏支持的数值。": "Choose a shape, then tune its size, gap, and thickness. Values stay within the game's supported range.",
    "撤销": "Undo",
    "重做": "Redo",
    "恢复造型默认值": "Reset shape",
    "实时预览": "Live preview",
    "放大 8× · 便于编辑": "8× zoom · easier editing",
    "预览倍率": "Preview zoom",
    "DIY 准星实时预览": "DIY crosshair live preview",
    "实时生成的游戏代码": "Live game code",
    "准星名称": "Crosshair name",
    "新建": "New",
    "复制代码": "Copy code",
    "保存到我的 DIY": "Save to My DIY",
    "1. 选择基础造型": "1. Choose a base shape",
    "随时可以切换": "Switch anytime",
    "2. 调整外观": "2. Adjust appearance",
    "简单模式": "Simple mode",
    "整体大小": "Overall size",
    "线条向外延伸的长度": "How far the lines extend",
    "中心空隙": "Center gap",
    "四条线离中心的距离": "Distance from the center",
    "线条粗细": "Line thickness",
    "主准星的像素宽度": "Pixel width of the main lines",
    "中心标记": "Center mark",
    "关闭": "Off",
    "小点": "Small dot",
    "中点": "Medium dot",
    "大点": "Large dot",
    "清晰边框": "Outline",
    "轻微": "Subtle",
    "明显": "Strong",
    "准星颜色": "Crosshair color",
    "黄绿色": "Yellow green",
    "自定义颜色": "Custom color",
    "辅助线": "Outer lines",
    "在主准星外增加第二层线条": "Add a second set outside the main lines",
    "高级模式": "Advanced mode",
    "分别调整主线、辅助线、边框和动态误差": "Fine-tune lines, outlines, and error feedback",
    "展开": "Expand",
    "收起": "Collapse",
    "主线": "Inner lines",
    "显示主线": "Show inner lines",
    "水平长度": "Horizontal length",
    "垂直长度": "Vertical length",
    "粗细": "Thickness",
    "间距": "Offset",
    "透明度": "Opacity",
    "移动误差": "Movement error",
    "射击误差": "Firing error",
    "显示辅助线": "Show outer lines",
    "中心点与边框": "Center dot & outline",
    "显示中心点": "Show center dot",
    "中心点大小": "Center dot size",
    "中心点透明度": "Center dot opacity",
    "显示边框": "Show outline",
    "边框粗细": "Outline thickness",
    "边框透明度": "Outline opacity",
    "我的 DIY": "My DIY",
    "只保存在此设备": "Stored on this device only",
    "还没有保存的 DIY 准星。完成调整后点击“保存到我的 DIY”。": "No saved DIY crosshairs yet. Finish your design, then select “Save to My DIY.”",
    "关闭详情": "Close details",
    "静止主准星 · 游戏原始像素 1:1": "Static primary crosshair · original pixels 1:1",
    "训练场": "Practice",
    "浅色": "Light",
    "深色": "Dark",
    "职业选手 · 中国赛区": "Pro player · VCT China",
    "收藏": "Favorite",
    "取消收藏": "Remove favorite",
    "准星导入代码": "Crosshair import code",
    "复制准星代码": "Copy crosshair code",
    "复制后请自行在游戏设置中导入": "Paste it manually in the game settings",
    "在 DIY 工坊中继续调整": "Continue editing in DIY Studio",
    "只写入 Windows 剪贴板": "Windows clipboard only",
    "不会访问游戏进程、文件、内存或反作弊组件。": "Never accesses game processes, files, memory, or anti-cheat components.",
    "关闭": "Close",
    "粘贴准星代码": "Paste a crosshair code",
    "仅在本地解析并预览，不会自动导入游戏。": "Parsed and previewed locally; nothing is imported automatically.",
    "例如：0;P;c;5;h;0;0l;4;0o;2;0a;1;1b;0": "Example: 0;P;c;5;h;0;0l;4;0o;2;0a;1;1b;0",
    "取消": "Cancel",
    "立即预览": "Preview now",
    "独立、离线、不接触游戏": "Independent, offline, and game-safe",
    "准星匣是一个本地准星图鉴和文本代码管理器，不是游戏插件或覆盖工具。": "Crosshair Vault is a local library and text-code manager—not a game plugin or overlay.",
    "不会检测游戏": "Does not detect the game",
    "不查找或监听游戏进程": "Never searches for or monitors game processes",
    "不会读取游戏": "Does not read the game",
    "不访问内存、目录或配置": "Never accesses memory, folders, or settings",
    "不会注入覆盖层": "No injected overlay",
    "不挂载 DLL，不显示准星悬浮窗": "No DLL injection or floating crosshair",
    "仅使用剪贴板": "Clipboard only",
    "复制后由你手动粘贴导入": "You paste the copied code manually",
    "版本": "Version",
    "正在读取版本信息…": "Loading version information…",
    "查看本地数据位置": "Open local data folder",
    "我知道了": "Got it",
    "连续十字": "Continuous cross",
    "分离十字": "Separated cross",
    "小型十字": "Small cross",
    "长十字": "Long cross",
    "细十字": "Thin cross",
    "粗十字": "Thick cross",
    "十字＋点": "Cross + dot",
    "双层十字": "Double cross",
    "仅横线": "Horizontal only",
    "仅竖线": "Vertical only",
    "国际赛区": "International",
    "常用样式": "Common presets",
    "社区常用参数": "Community preset",
    "经典常用": "Classic preset",
    "公开配置": "Public setting",
    "离线内置": "Built in offline",
    "我的导入": "My import",
    "本地导入": "Local import",
    "仅保存在此设备": "Stored on this device only",
    "中国赛区选手准星": "VCT China crosshairs",
    "集中浏览 EDG、BLG、XLG、Wolves 等中国赛区相关选手的公开配置。": "Browse publicly recorded settings from VCT China players across EDG, BLG, XLG, Wolves, and more.",
    "职业选手公开配置": "Pro player settings",
    "选手会经常更换准星；这里展示的是公开资料中曾核验的配置。": "Players change crosshairs often. These settings were previously verified from public sources.",
    "你喜欢的准星都会保存在本机，不会上传到任何服务器。": "Your favorites stay on this device and are never uploaded.",
    "快速找回刚刚比较过的准星。": "Quickly return to crosshairs you recently compared.",
    "更新这枚 DIY": "Update this DIY",
    "点击查看与复制 →": "View & copy →",
    "继续编辑": "Continue editing",
    "删除": "Delete",
    "复制失败，请稍后重试": "Copy failed. Please try again.",
    "请先给这枚准星起一个名称": "Name this crosshair first.",
    "DIY 准星已更新": "DIY crosshair updated.",
    "已保存到我的 DIY": "Saved to My DIY.",
    "已载入，可以继续调整": "Loaded and ready to edit.",
    "已载入 DIY 工坊，原准星不会被修改": "Loaded in DIY Studio. The original crosshair is unchanged.",
    "已删除这枚 DIY 准星": "DIY crosshair deleted.",
    "已收藏这枚 DIY 准星": "DIY crosshair added to favorites.",
    "已取消 DIY 收藏": "DIY crosshair removed from favorites.",
    "DIY 准星代码已复制": "DIY crosshair code copied.",
    "DIY 准星代码已复制到 Windows 剪贴板": "DIY crosshair code copied to the Windows clipboard.",
    "已取消收藏": "Removed from favorites.",
    "已加入我的收藏": "Added to Favorites.",
    "准星代码已复制到 Windows 剪贴板": "Crosshair code copied to the Windows clipboard.",
    "复制成功": "Copied",
    "请先粘贴准星代码。": "Paste a crosshair code first.",
    "代码长度异常，请检查后重试。": "The code length looks invalid. Check it and try again.",
    "格式无法识别：准星代码通常以“0;”开头。": "Unrecognized format: crosshair codes usually begin with “0;”.",
    "代码中缺少主准星（P）配置。": "The code is missing the primary crosshair (P) section.",
    "该代码没有可显示的中心点或线条。": "This code has no visible center dot or lines.",
    "当前筛选下没有可选准星": "No crosshairs match the current filters.",
    "游戏原始像素 1:1": "Original game pixels 1:1",
    "浏览器预览模式": "Browser preview mode",
    "便携版 · 数据随程序保存": "Portable edition · data stays with the app",
    "安装版 · 数据保存在用户目录": "Installed edition · data is stored in your user folder",
    "离线桌面版": "Offline desktop edition",
    "本地保存": "Saved locally"
  };

  const originals = new WeakMap();
  const attributeOriginals = new WeakMap();
  const stored = (() => {
    try {
      return localStorage.getItem("crosshair-vault-language");
    } catch {
      return null;
    }
  })();
  let language = stored === "en" ? "en" : "zh-CN";

  function t(value) {
    const text = String(value ?? "");
    return language === "en" ? (EN[text] || text) : text;
  }

  function translateTextNode(node) {
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    const original = originals.get(node);
    const trimmed = original.trim();
    if (!trimmed) return;
    const translated = language === "en"
      ? (node.parentElement?.dataset.i18nEn || EN[trimmed] || trimmed)
      : trimmed;
    const start = original.match(/^\s*/)[0];
    const end = original.match(/\s*$/)[0];
    node.nodeValue = `${start}${translated}${end}`;
  }

  function translateAttributes(element) {
    const names = ["placeholder", "aria-label", "title"];
    if (!attributeOriginals.has(element)) attributeOriginals.set(element, {});
    const record = attributeOriginals.get(element);
    names.forEach((name) => {
      if (!element.hasAttribute(name)) return;
      if (!(name in record)) record[name] = element.getAttribute(name);
      const original = record[name];
      element.setAttribute(name, language === "en" ? (EN[original] || original) : original);
    });
  }

  function translateDom(root = document) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return /^(SCRIPT|STYLE|CODE)$/.test(node.parentElement?.tagName || "")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) translateTextNode(walker.currentNode);
    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
    root.querySelectorAll?.("[placeholder], [aria-label], [title]").forEach(translateAttributes);
  }

  function setLanguage(next) {
    language = next === "en" ? "en" : "zh-CN";
    try {
      localStorage.setItem("crosshair-vault-language", language);
    } catch {
      // The app remains usable even when local storage is unavailable.
    }
  }

  window.CrosshairI18n = {
    get language() { return language; },
    setLanguage,
    t,
    translateDom
  };
})();

