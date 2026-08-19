(function createCatalog() {
  "use strict";

  const PROSETTINGS_GUIDE = "ProSettings · Best VALORANT Crosshair Codes（2026-03-12 核验）";
  const PROSETTINGS_PLAYER = "ProSettings · 选手设置页";

  const proEntries = [
    ["tenz", "TenZ", "国际赛区", "Sentinels / 内容创作者", "0;P;c;5;h;0;0l;4;0o;2;0a;1;1b;0", "十字", "青色", "经典 1-4-2-2 十字，辨识度高，适合多数步枪交战。"],
    ["zmjjkk", "ZmjjKK", "中国赛区", "Edward Gaming", "0;P;h;0;d;1;f;0;0l;2;0v;2;0g;1;0o;1;0f;0;1b;0", "十字", "白色", "EDG ZmjjKK 的公开记录配置，中心点与短线结合，画面遮挡较小。", "2026-07-20"],
    ["runi", "runi", "国际赛区", "VCT Americas", "0;s;1;P;h;0;f;0;0t;1;0l;4;0v;4;0o;0;0a;1;0f;0;1b;0;S;d;0", "十字", "白色", "紧凑白色十字，中心无间距，适合稳定定位。"],
    ["something", "something", "国际赛区", "Paper Rex", "0;P;o;0.619;d;1;f;0;s;0;0t;1;0l;0;0o;2;0a;1;0f;0;1b;0", "点状", "白色", "极简中心点配置，适合偏好清爽视野的玩家。"],
    ["aspas", "aspas", "国际赛区", "VCT Americas", "0;s;1;P;c;5;o;1;0l;4;0v;3;0g;1;0o;0;0a;1;0f;0;1b;0;S;c;0;s;1.2;o;1", "十字", "青色", "明亮青色紧凑十字，在复杂场景中保持较好可见度。"],
    ["cned", "cNed", "国际赛区", "VCT EMEA", "0;s;1;P;h;0;f;0;0l;5;0o;0;0a;1;0f;0;1b;0;S;c;6;s;0.949;o;1", "十字", "白色", "较长的白色十字，中心闭合，方向感清晰。"],
    ["nats", "nAts", "国际赛区", "VCT EMEA", "0;P;c;1;o;1.000;0a;1.000;0l;2;0t;1;0o;2;0f;0;1b;0", "十字", "绿色", "细小绿色十字，兼顾精确定位和目标可见度。"],
    ["leo", "Leo", "国际赛区", "VCT EMEA", "0;P;h;0;0l;3;0o;0;0a;1;0f;0;1b;0", "十字", "白色", "中心闭合的短十字，稳定而克制。"],
    ["forsaken", "f0rsakeN", "国际赛区", "Paper Rex", "0;s;1;P;c;8;u;000000FF;o;1;b;1;0t;3;0l;1;0v;0;0g;1;0o;0;0a;1;0f;0;1t;1;1l;4;1g;1;1o;0;1a;1;1m;0;1f;0;S;s;0.664;o;1", "外线", "自定义", "内外线组合的个性配置，轮廓非常鲜明。"],
    ["ethan", "Ethan", "国际赛区", "VCT Americas", "0;P;c;1;o;0.503;f;0;0t;1;0o;2;0a;1;0f;0;1b;0", "十字", "绿色", "低透明轮廓配短线，视觉干扰较少。"],
    ["crazyface", "Crazyface", "国际赛区", "VCT Pacific", "0;p;0;s;1;P;c;5;h;0;d;1;z;1;f;0;m;1;0t;1;0l;2;0o;1;0a;1;0e;0.847;1b;0;A;o;1;d;1;z;3;f;0;s;0;0b;0;1b;0;S;c;0;s;0.7;o;0.7", "动态", "青色", "带移动反馈的短线中心点组合。"],
    ["jakee", "jakee", "国际赛区", "VCT Americas", "0;p;0;s;1;P;c;4;u;420690FF;o;1;f;0;0t;1;0l;2;0v;3;0o;2;0a;1;0f;0;1b;0;A;o;1;d;1;0l;0;0o;2;0a;1;1b;0", "十字", "黄色", "黄色短十字，中心间距适中。"],
    ["shanks", "Shanks", "国际赛区", "主播 / 竞技选手", "0;p;0;c;1;s;1;P;c;5;u;00DD00FF;h;0;f;0;m;1;0l;4;0v;3;0o;1;0a;0.317;0f;0;1l;3;1o;1;1a;0.616;1m;0;1f;0;A;c;4;o;0.515;m;1;0t;1;0l;3;0v;3;0o;1;0a;1;0f;0;1b;0;S;c;1;o;1", "外线", "自定义", "内外线透明度不同，保留中心指向感。"],
    ["dgzin", "dgzin", "国际赛区", "VCT Americas", "0;s;1;P;u;000000FF;o;0;d;1;z;1;f;0;0t;1;0l;3;0v;2;0g;1;0o;0;0a;1;0f;0;1b;0;S;c;5;t;000000FF;s;2.204;o;1", "十字", "自定义", "小中心点搭配闭合短十字。"],
    ["khalil", "Khalil", "国际赛区", "VCT Americas", "0;P;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1t;0;1l;0;1o;0;1a;0;1m;0;1f;0", "十字", "白色", "无轮廓白色十字，视觉简洁。"],
    ["qck", "qck", "国际赛区", "VCT Americas", "0;s;1;P;c;8;u;000000FF;h;0;b;1;f;0;0l;3;0o;0;0a;1;0f;0;1b;0;S;s;0", "十字", "自定义", "黑色紧凑十字，在亮色区域具有较强辨识度。"],
    ["mwzera", "mwzera", "国际赛区", "VCT Americas", "0;P;c;4;h;0;f;0;0l;2;0o;2;0a;1;0f;0;1b;0", "十字", "黄色", "明亮黄色微型十字，快速定位中心。"],
    ["boaster", "Boaster", "国际赛区", "FNATIC", "0;s;1;P;c;1;o;1;d;1;0l;0;0o;2;0a;1;0f;0;1t;0;1l;0;1o;0;1a;0;S;c;1;o;1", "点状", "绿色", "绿色中心点，轮廓清晰且占用面积小。"],
    ["chronicle", "Chronicle", "国际赛区", "FNATIC", "0;P;c;7;o;1;f;0;0t;1;0l;3;0v;3;0g;1;0o;2;0a;1;0f;0;1b;0", "十字", "红色", "红色短十字，颜色醒目，中心留有间距。"],
    ["derke", "Derke", "国际赛区", "VCT EMEA", "0;P;c;8;b;1;t;1;o;1;z;2;a;1;0t;2;0l;6;0v;6;0o;3;0a;0.8;0s;1;0e;1;1t;2;1l;2;1v;2;1o;10;1a;0.35;1s;1;1e;1;u;FFFFFF;d;1;h;1;0g;0;1g;0;0f;0;1f;1;0m;0;1m;1;0b;0;1b;0;m;0", "动态", "白色", "复杂的动态内外线组合，可反馈射击误差。"],
    ["magnum", "Magnum", "国际赛区", "VCT EMEA", "0;s;1;P;u;000000FF;o;1;d;1;z;1;f;0;m;1;0t;1;0l;3;0v;3;0o;1;0a;1;0f;0;1b;0;S;c;5;t;000009FF;s;0.76;o;1", "十字", "自定义", "中心点加紧凑短十字。"],
    ["mistic", "Mistic", "国际赛区", "VCT EMEA", "0;P;o;1;0t;1;0l;2;0o;1;0a;1;0f;0;1b;0", "十字", "白色", "经典短十字，中心间距很小。"],
    ["demon1", "Demon1", "国际赛区", "VCT Americas", "0;s;1;P;o;1;d;1;m;1;0b;0;1b;0", "点状", "白色", "带轮廓的纯中心点配置。"],
    ["cauanzin", "cauanzin", "国际赛区", "VCT Americas", "0;P;h;0;0l;3;0o;2;0a;1;0f;0;1b;0", "十字", "白色", "无轮廓的 1-3-2 短十字。"],
    ["less", "Less", "国际赛区", "VCT Americas", "0;s;1;P;c;8;u;000000FF;h;0;b;1;f;0;0l;4;0o;0;0a;1;0f;0;1b;0", "十字", "自定义", "闭合黑色十字，适合明亮地图背景。"],
    ["tuyz", "tuyz", "国际赛区", "VCT Americas", "0;s;1;P;u;000000FF;h;0;f;0;m;1;0l;3;0v;3;0o;2;0a;1;0f;0;1b;0", "十字", "自定义", "黑色短十字，中心间距清晰。"],
    ["mako", "MaKo", "国际赛区", "VCT Pacific", "0;s;1;P;c;1;o;1;f;0;0l;4;0a;1;0f;0;1t;0;1l;0;1o;0;1a;0;1m;0;1f;0", "十字", "绿色", "绿色闭合十字，线条长度适中。"],
    ["tex", "tex", "国际赛区", "VCT Americas", "0;s;1;P;h;0;d;1;z;1;m;1;0t;1;0l;3;0v;2;0g;1;0o;2;0a;1;0e;0.319;1t;0;1l;0;1o;0;1a;0;1m;0;1e;3;S;s;0.677;o;1", "动态", "白色", "移动反馈较轻的中心点短十字。"],
    ["k1ng", "k1ng", "国际赛区", "VCT Pacific", "0;P;c;5;o;1;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", "十字", "青色", "青色微型短十字，带黑色轮廓。"],
    ["tarik", "tarik", "国际赛区", "主播 / 内容创作者", "0;s;1;P;o;1;d;1;f;0;0b;0;1b;0;S;d;0", "点状", "白色", "清晰白色中心点，简单直接。"],
    ["jinggg", "Jinggg", "国际赛区", "Paper Rex", "0;s;1;P;c;5;u;000000FF;h;0;0l;4;0v;4;0o;0;0a;1;0f;0;1b;0;S;c;5;t;000000FF;s;0;o;1", "十字", "青色", "闭合青色十字，线条饱满。"],
    ["kyedae", "Kyedae", "国际赛区", "内容创作者", "0;s;1;P;c;8;u;FFFFCCFF;h;0;b;1;f;0;0l;4;0o;0;0a;1;0f;0;1b;0", "十字", "自定义", "淡黄色自定义色十字，柔和醒目。"],
    ["scream", "ScreaM", "国际赛区", "职业选手 / 内容创作者", "0;s;1;P;c;5;o;1;d;1;z;3;f;0;0t;6;0l;0;0a;1;0f;0;1b;0;S;c;6;s;0.949;o;1", "点状", "青色", "标志性大中心点风格，视觉聚焦明确。"],
    ["superbuss", "SuperBusS", "国际赛区", "VCT Pacific", "0;P;c;5;h;0;0l;4;0o;0;0a;1;0f;0;1b;0", "十字", "青色", "无轮廓青色闭合十字。"],
    ["johnolsen", "JohnOlsen", "国际赛区", "VCT Pacific", "0;s;1;P;o;1;d;1;0b;0;1b;0;S;c;0;s;1.2;o;1", "点状", "白色", "白色轮廓中心点，稳定清楚。"],

    ["chichoo", "CHICHOO", "中国赛区", "Edward Gaming", "0;s;1;P;c;5;h;0;f;0;s;0;0l;3;0o;0;0a;1;0f;0;1b;0", "十字", "青色", "青色闭合短十字，结构简洁。", "2026-05-26"],
    ["nobody", "nobody", "中国赛区", "Edward Gaming", "0;s;1;P;o;1;m;1;0t;1;0l;2;0v;2;0g;1;0o;2;0a;1;0f;0;1b;0;S;c;5;o;1", "十字", "白色", "带轮廓的细小白色十字，中心留有间距。", "2026-07-20"],
    ["smoggy", "Smoggy", "中国赛区", "Edward Gaming", "0;p;0;s;1;P;o;0.3;f;0;0l;3;0o;2;0a;1;0f;0;1b;0;A;o;0.3;d;1;0b;0;1b;0", "十字", "白色", "低透明轮廓配 2-3-2 十字。", "2026-05-21"],
    ["ninebody", "ninebody", "中国赛区", "VCT CN", "0;s;1;P;c;5;h;0;f;0;0l;3;0o;1;0a;1;0f;0;1b;0;S;c;5;s;0.6;o;1", "十字", "青色", "青色短十字，中心间距较小。", "2026-01-01"],
    ["s1mon", "S1MON", "中国赛区", "Any Questions Gaming", "0;s;1;P;o;1;d;1;z;3;f;0;0t;6;0l;0;0a;1;0f;0;1b;0;S;c;6;s;0.949;o;1", "点状", "白色", "高可见度白色中心点配置。", "2026-01-06"],
    ["yosemite", "yosemite", "中国赛区", "Wolves Esports", "0;s;1;P;u;000000FF;o;0.6;f;0;0t;1;0l;2;0v;0;0o;2;0a;1;0f;0;1b;0", "十字", "自定义", "黑色微型十字，适合偏亮背景。", "2026-01-01"],
    ["whzy", "whzy", "中国赛区", "Bilibili Gaming", "0;P;h;0;d;1;z;1;0t;1;0l;2;0o;2;0a;1;0f;0;1b;0", "十字", "白色", "中心点与细小短线组合。", "2026-07-15"],
    ["nephh", "nephh", "中国赛区", "Bilibili Gaming", "0;s;1;P;c;5;h;0;0l;3;0o;0;0a;1;0f;0;1b;0;S;s;0.8;o;1", "十字", "青色", "青色闭合十字，横纵方向明确。", "2026-07-15"],
    ["lysoar", "Lysoar", "中国赛区", "XLG Esports", "0;P;c;5;h;0;0l;4;0o;2;0a;1;0f;0;1b;0", "十字", "青色", "经典青色 1-4-2-2 十字。", "2026-06-03"],
    ["spring", "Spring", "中国赛区", "Wolves Esports", "0;s;1;P;c;5;o;1;d;1;0b;0;1t;0;1l;0;1o;0;1a;1;1m;0;1f;0;S;c;0;o;1", "点状", "青色", "带轮廓的青色中心点。", "2026-07-15"],
    ["knight", "Knight", "中国赛区", "Bilibili Gaming", "0;P;o;1;d;1;z;1;0b;0;1b;0", "点状", "白色", "小尺寸白色中心点，目标遮挡极少。", "2026-02-26"],
    ["cb", "CB", "中国赛区", "NOVA Esports", "0;s;1;P;c;5;h;0;f;0;0l;3;0o;1;0a;1;0f;0;1b;0;S;c;5;s;0.6;o;1", "十字", "青色", "青色短十字，中心间距为 1。", "2026-07-20"],
    ["deryeon", "Deryeon", "中国赛区", "Wolves Esports", "0;P;c;5;h;0;0l;2;0o;2;0a;1;0f;0;1b;0", "十字", "青色", "非常紧凑的青色微型十字。", "2026-07-13"],
    ["happywei", "happywei", "中国赛区", "XLG Esports", "0;P;o;1;d;1;a;0.66;0b;0;1b;0", "点状", "白色", "半透明白色中心点，轮廓清晰。", "2026-07-22"],
    ["rarga", "Rarga", "中国赛区", "XLG Esports", "0;P;o;1;d;1;0b;0;1b;0", "点状", "白色", "干净的白色中心点配置。", "2026-07-27"],
    ["guang", "GuanG", "中国赛区", "NOVA Esports", "0;P;c;1;h;0;f;0;0l;4;0o;0;0a;1;0f;0;1b;0", "十字", "绿色", "绿色闭合十字，线条长度适中。", "2026-03-31"],
    ["monk", "monk", "中国赛区", "VCT CN", "0;p;0;s;1;P;c;5;h;0;f;0;0l;3;0o;1;0a;1;0f;0;1b;0;A;h;0;0l;4;0o;0;0a;1;0f;0;1b;0", "十字", "青色", "青色短十字，主瞄准与 ADS 配置分离。", "2026-06-26"]
  ];

  const entries = proEntries.map((item, index) => {
    const [id, name, region, team, code, style, color, description, verifiedAt] = item;
    return {
      id: `pro-${id}`,
      name,
      player: name,
      region,
      team,
      code,
      style,
      color,
      description,
      kind: "职业选手",
      featured: index < 12 || region === "中国赛区",
      verifiedAt: verifiedAt || "2026-03-12",
      source: region === "中国赛区" ? PROSETTINGS_PLAYER : PROSETTINGS_GUIDE,
      tags: [region, team, style, color, "公开配置"]
    };
  });

  const colors = [
    { index: 5, name: "青色", label: "霓虹青" },
    { index: 0, name: "白色", label: "纯净白" },
    { index: 1, name: "绿色", label: "荧光绿" },
    { index: 4, name: "黄色", label: "明亮黄" },
    { index: 7, name: "红色", label: "警示红" },
    { index: 6, name: "粉色", label: "樱花粉" }
  ];

  const addCurated = (name, style, color, code, description, featured = false) => {
    entries.push({
      id: `curated-${String(entries.length + 1).padStart(3, "0")}`,
      name,
      player: "",
      region: "常用样式",
      team: "社区常用参数",
      code,
      style,
      color,
      description,
      kind: "经典常用",
      featured,
      verifiedAt: "2026-07-31",
      source: "依据游戏准星代码格式整理，本地参数校验通过",
      tags: ["经典常用", style, color, "离线内置"]
    });
  };

  for (let i = 0; i < 24 && entries.length < 150; i += 1) {
    const color = colors[i % colors.length];
    const thickness = 1 + (Math.floor(i / colors.length) % 4);
    const outlined = Math.floor(i / 12) % 2 === 0;
    const code = `0;P;c;${color.index};${outlined ? "o;1;" : "h;0;"}d;1;z;${thickness};f;0;0b;0;1b;0`;
    addCurated(
      `${color.label} · ${["微点", "小点", "标准点", "大点"][thickness - 1]}`,
      "点状",
      color.name,
      code,
      `中心点厚度 ${thickness}，${outlined ? "带轮廓" : "无轮廓"}，适合专注首发定位。`,
      thickness <= 2 && (color.index === 5 || color.index === 0)
    );
  }

  let crossIndex = 0;
  while (entries.length < 126) {
    const color = colors[crossIndex % colors.length];
    const length = 2 + (Math.floor(crossIndex / colors.length) % 5);
    const thickness = 1 + (Math.floor(crossIndex / 12) % 2);
    const offset = Math.floor(crossIndex / 24) % 4;
    const outline = crossIndex % 3 !== 0;
    const code = `0;P;c;${color.index};${outline ? "o;1;" : "h;0;"}f;0;0t;${thickness};0l;${length};0o;${offset};0a;1;0f;0;1b;0`;
    addCurated(
      `${color.label} · ${thickness}-${length}-${offset} 十字`,
      "十字",
      color.name,
      code,
      `内线厚度 ${thickness}、长度 ${length}、偏移 ${offset}，${outline ? "轮廓增强可见度" : "无轮廓更清爽"}。`,
      thickness === 1 && length <= 4 && offset <= 2
    );
    crossIndex += 1;
  }

  let hollowIndex = 0;
  while (entries.length < 136) {
    const color = colors[hollowIndex % colors.length];
    const thickness = 3 + (hollowIndex % 3);
    const offset = 1 + (Math.floor(hollowIndex / 3) % 3);
    const code = `0;P;c;${color.index};h;0;0b;0;1t;${thickness};1l;1;1o;${offset};1a;1;1m;0;1f;0`;
    addCurated(
      `${color.label} · 空心环 ${hollowIndex + 1}`,
      "空心",
      color.name,
      code,
      `以短外线围成空心中心，厚度 ${thickness}、间距 ${offset}。`
    );
    hollowIndex += 1;
  }

  let outerIndex = 0;
  while (entries.length < 144) {
    const color = colors[outerIndex % colors.length];
    const innerLength = 2 + (outerIndex % 3);
    const outerOffset = 5 + (outerIndex % 4);
    const code = `0;P;c;${color.index};o;1;0t;1;0l;${innerLength};0o;1;0a;1;0f;0;1t;1;1l;2;1o;${outerOffset};1a;0.7;1m;0;1f;0`;
    addCurated(
      `${color.label} · 内外双线 ${outerIndex + 1}`,
      "外线",
      color.name,
      code,
      `内线负责精确定位，外线偏移 ${outerOffset} 提供方向参照。`
    );
    outerIndex += 1;
  }

  let dynamicIndex = 0;
  while (entries.length < 150) {
    const color = colors[dynamicIndex % colors.length];
    const length = 3 + (dynamicIndex % 3);
    const movement = dynamicIndex % 2;
    const firing = movement ? 0 : 1;
    const code = `0;P;c;${color.index};o;1;f;0;0t;1;0l;${length};0o;2;0a;1;0m;${movement};0f;${firing};1b;0`;
    addCurated(
      `${color.label} · ${movement ? "移动" : "射击"}反馈 ${dynamicIndex + 1}`,
      "动态",
      color.name,
      code,
      `${movement ? "移动" : "射击"}时准星会提供误差反馈，静止时保持紧凑。`
    );
    dynamicIndex += 1;
  }

  window.CROSSHAIR_CATALOG = Object.freeze(entries);
})();

