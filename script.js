export const ACCESS_PASSWORD = "lifeos-demo";

const ACCESS_SESSION_KEY = "lifeos-access-granted";

export function validateAccessPassword(input, password = ACCESS_PASSWORD) {
  return String(input ?? "").trim() === String(password);
}

function getConfiguredAccessPassword() {
  if (typeof window !== "undefined" && typeof window.LIFEOS_ACCESS_PASSWORD === "string") {
    return window.LIFEOS_ACCESS_PASSWORD;
  }

  return ACCESS_PASSWORD;
}

function rememberAccessGranted() {
  try {
    window.sessionStorage.setItem(ACCESS_SESSION_KEY, "1");
  } catch {
    // Private browsing or restricted storage should not block entering after a correct password.
  }
}

function hasAccessGranted() {
  try {
    return window.sessionStorage.getItem(ACCESS_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function unlockApp() {
  document.body.classList.remove("auth-locked");
}

function bindAccessGate() {
  if (typeof document === "undefined") return;

  const form = document.querySelector("#accessForm");
  const input = document.querySelector("#accessPassword");
  const error = document.querySelector("#accessError");

  if (!form || !input) {
    unlockApp();
    return;
  }

  if (hasAccessGranted()) {
    unlockApp();
    return;
  }

  input.focus();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateAccessPassword(input.value, getConfiguredAccessPassword())) {
      rememberAccessGranted();
      unlockApp();
      return;
    }

    if (error) error.textContent = "密码不正确，请再试一次。";
    input.select();
  });
}

export const demoScenes = [
  {
    id: "car",
    type: "露营餐具",
    title: "我的露营餐具分享",
    creator: "亚杰",
    image: "./assets/做饭.png",
    immersiveVideo: "./assets/做饭视频.mp4",
    scenario: "亲子露营",
    tags: ["餐具", "做饭", "亲子露营"],
    products: ["便携餐具套装", "折叠锅具", "保温杯", "露营调料盒"],
    feedLabels: [
      { text: "儿童餐具套装", x: 31, y: 58 },
      { text: "折叠锅具", x: 58, y: 43 },
      { text: "调料收纳盒", x: 76, y: 63 },
    ],
    hotspots: [
      {
        x: 31,
        y: 61,
        product: "便携餐具套装",
        label: "儿童餐具套装",
        review: "轻量餐盘和小叉勺适合孩子自己取用，露营吃饭不用临时翻找。",
        productUrl: "#shop-%E4%BE%BF%E6%90%BA%E9%A4%90%E5%85%B7%E5%A5%97%E8%A3%85",
      },
      {
        x: 58,
        y: 46,
        product: "折叠锅具",
        label: "折叠锅具",
        review: "一锅解决加热和简单烹饪，收起来不占后备箱空间。",
        productUrl: "#shop-%E6%8A%98%E5%8F%A0%E9%94%85%E5%85%B7",
      },
      {
        x: 76,
        y: 66,
        product: "露营调料盒",
        label: "调料收纳盒",
        review: "盐、胡椒和小包酱料集中放，做亲子餐不用把桌面摊乱。",
        productUrl: "#shop-%E9%9C%B2%E8%90%A5%E8%B0%83%E6%96%99%E7%9B%92",
      },
    ],
  },
  {
    id: "desk",
    type: "桌搭",
    title: "下班后的高能量工作台",
    creator: "王策",
    image: "./assets/scene-desk.png",
    scenario: "居家办公",
    tags: ["升降桌", "键鼠", "氛围灯"],
    products: ["自动升降桌", "机械键盘", "屏幕灯", "桌面音响"],
    hotspots: [
      {
        x: 74,
        y: 21,
        product: "屏幕灯",
        label: "护眼屏幕灯",
        review: "覆盖整张桌面但不直射屏幕，晚上打游戏和办公都不刺眼。",
        productUrl: "#shop-%E5%B1%8F%E5%B9%95%E7%81%AF",
      },
      {
        x: 43,
        y: 70,
        product: "机械键盘",
        label: "磁轴键盘",
        review: "桌面核心输入设备，声音和手感都能直接决定这套桌搭的质感。",
        productUrl: "#shop-%E6%9C%BA%E6%A2%B0%E9%94%AE%E7%9B%98",
      },
      {
        x: 54,
        y: 61,
        product: "桌面音响",
        label: "桌面音响",
        review: "横向占位低，不挡屏幕，游戏和视频的沉浸感比小音箱更完整。",
        productUrl: "#shop-%E6%A1%8C%E9%9D%A2%E9%9F%B3%E5%93%8D",
      },
    ],
  },
  {
    id: "edc",
    type: "EDC",
    title: "通勤男士的口袋系统",
    creator: "邵琦",
    image: "./assets/scene-edc.png",
    scenario: "移动出行",
    tags: ["通勤", "数码", "轻量化"],
    products: ["手机", "手表", "电纸书", "耳机", "香水"],
    hotspots: [
      {
        x: 17,
        y: 26,
        product: "手机",
        label: "iPhone 15 Pro Max",
        review: "通勤主力设备，和手表、耳机一起构成最小数字出行套装。",
        productUrl: "#shop-%E6%89%8B%E6%9C%BA",
      },
      {
        x: 42,
        y: 36,
        product: "耳机",
        label: "骨传导耳机",
        review: "适合走路、骑行、地铁换乘时保持环境感知，比入耳式更轻松。",
        productUrl: "#shop-%E8%80%B3%E6%9C%BA",
      },
      {
        x: 32,
        y: 69,
        product: "电纸书",
        label: "电纸书",
        review: "通勤路上比手机更适合长时间阅读，也能让 EDC 不只停留在数码工具。",
        productUrl: "#shop-%E7%94%B5%E7%BA%B8%E4%B9%A6",
      },
    ],
  },
  {
    id: "room",
    type: "RoomTour",
    title: "客厅里的智能小宇宙",
    creator: "Gabi",
    image: "./assets/scene-room.png",
    scenario: "客厅观影",
    tags: ["智能家居", "电视", "灯光"],
    products: ["落地灯", "装饰画", "花瓶", "智能灯带"],
    hotspots: [
      {
        x: 81,
        y: 37,
        product: "装饰画",
        label: "悠然画材",
        review: "大面积留白墙面需要一个视觉锚点，这幅画把客厅气质压住了。",
        productUrl: "#shop-%E8%A3%85%E9%A5%B0%E7%94%BB",
      },
      {
        x: 67,
        y: 48,
        product: "花瓶",
        label: "ZARA HOME 花瓶",
        review: "花瓶和枝条把中轴拉高，让低矮边柜不显得空。",
        productUrl: "#shop-%E8%8A%B1%E7%93%B6",
      },
      {
        x: 14,
        y: 43,
        product: "落地灯",
        label: "旭呈落地灯",
        review: "弧形灯杆把阅读角和客厅主空间连起来，晚上会很有氛围。",
        productUrl: "#shop-%E8%90%BD%E5%9C%B0%E7%81%AF",
      },
    ],
  },
];

const creatorAvatars = {
  亚杰: "./assets/亚杰.png",
  王策: "./assets/策策1.jpeg",
  邵琦: "./assets/邵琦.png",
  Gabi: "./assets/Gabi.jpeg",
};

const shopCategories = [
  {
    name: "车载必备",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=900&q=80",
    products: [
      product("车内手机支架", "￥129", "中控视线内导航更安全，适合自驾和露营路线切换。"),
      product("应急电源", "￥399", "给手机、露营灯和车载设备临时补能。"),
      product("车载香氛", "￥79", "轻香型座舱氛围补充，长途乘坐不压迫。"),
      product("车把手挂钩", "￥39", "把零食袋、相机包和露营小物放在伸手可及的位置。"),
    ],
  },
  {
    name: "智能家居",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
    products: [
      product("屏幕灯", "￥269", "减少桌面阴影，不直射屏幕，夜间使用更舒服。"),
      product("桌面音响", "￥499", "横向声场更完整，适合游戏、电影和工作背景乐。"),
      product("落地灯", "￥899", "客厅阅读角氛围核心，兼顾装饰和局部照明。"),
      product("花瓶", "￥229", "提高空间垂直层次，让边柜和画面更完整。"),
      product("装饰画", "￥499", "大白墙视觉锚点，适合自然、侘寂、原木风客厅。"),
    ],
  },
  {
    name: "出行装备",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    products: [
      product("手机", "￥7999", "通勤主力设备，承担导航、支付、拍摄和内容发布。"),
      product("手表", "￥2999", "轻量提醒和运动记录，减少频繁掏手机。"),
      product("电纸书", "￥1899", "通勤阅读设备，比手机更专注，适合长时间碎片阅读。"),
      product("耳机", "￥699", "开放式听感适合通勤步行，保留环境感知。"),
      product("充电宝", "￥169", "覆盖一天外出的补能焦虑，适合 EDC 固定携带。"),
      product("香水", "￥399", "移动场景里的个人气味名片。"),
    ],
  },
  {
    name: "生活分享",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
    products: [
      product("机械键盘", "￥699", "桌搭核心触感设备，兼顾游戏和办公输入。"),
      product("自动升降桌", "￥1599", "久坐和站立切换，让桌搭不只好看也能长期使用。"),
      product("咖啡", "￥39", "内容分享里的低门槛生活方式入口。"),
      product("轻食", "￥59", "适合与桌搭、露营、周末生活内容组合推荐。"),
      product("便携餐具套装", "￥89", "亲子露营用的轻量餐盘、碗和叉勺组合，收纳方便，孩子也能独立取用。"),
      product("折叠锅具", "￥239", "适合营地简单加热、煮面和煎蛋，折叠后减少后备箱占位。"),
      product("保温杯", "￥129", "给孩子和大人都能备一杯热饮，清晨和夜间营地更实用。"),
      product("露营调料盒", "￥59", "把盐、胡椒、酱料和小包调味集中收纳，做饭桌面更清爽。"),
      product("蛋白沙拉", "￥49", "适合减脂记录里的晚餐搭配，高蛋白、低负担，拍照也有清爽色彩。"),
      product("居家运动垫", "￥159", "在家训练的基础装备，适合核心、拉伸和轻量燃脂内容。"),
      product("低糖气泡水", "￥12", "替代高糖饮料，适合减脂生活内容里的轻松补充。"),
    ],
  },
];

const productCatalog = shopCategories.flatMap((category) =>
  category.products.map((item) => ({ ...item, category: category.name })),
);

const productMap = {
  车搭: ["车把手挂钩", "车内手机支架", "应急电源", "车载香氛"],
  露营餐具: ["便携餐具套装", "折叠锅具", "保温杯", "露营调料盒"],
  桌搭: ["自动升降桌", "机械键盘", "鼠标", "灯带", "屏幕灯"],
  EDC: ["手机", "手表", "电纸书", "耳机", "香水"],
  RoomTour: ["落地灯", "装饰画", "花瓶", "智能灯带"],
};

const inspirationFragments = [
  {
    id: "weight-text",
    type: "文本",
    title: "20260501 减重1kg",
    insight: "阶段变化明确，可以作为图文开头的成果钩子。",
    content: "20260501 减重1kg",
    products: ["低糖气泡水"],
  },
  {
    id: "salad-image",
    type: "图片",
    title: "轻食沙拉晚餐",
    insight: "晚餐画面提供饮食结构和生活方式质感。",
    content: "轻食沙拉：鸡胸、牛油果、小番茄和低脂酱汁。",
    products: ["蛋白沙拉"],
  },
  {
    id: "workout-video",
    type: "视频",
    title: "在家做运动视频",
    insight: "视频素材补足行动过程，让内容不只是结果打卡。",
    content: "在家运动：20 分钟核心训练、拉伸和出汗记录。",
    products: ["居家运动垫"],
  },
  {
    id: "voice-note",
    type: "语音",
    title: "语音：别太硬核",
    insight: "口语表达让内容更像真实分享，不像模板化打卡。",
    content: "这周不想太硬核，保持能坚持的节奏比极限燃脂重要。",
    products: ["低糖气泡水"],
  },
];

const sceneComments = {
  car: [
    {
      avatar: "越",
      name: "阿越",
      meta: "亲子露营",
      text: "餐具套装这种轻量组合最适合带娃，孩子自己拿碗勺也不怕摔。",
    },
    {
      avatar: "林",
      name: "林小满",
      meta: "露营玩家",
      text: "折叠锅具很实用，煮面、热汤、煎蛋都能解决，收纳起来也不占地方。",
    },
    {
      avatar: "N",
      name: "Nico",
      meta: "营地料理",
      text: "调料盒这个细节太真实了，每次露营最怕小包酱料散得到处都是。",
    },
  ],
  desk: [
    {
      avatar: "策",
      name: "王策",
      meta: "桌搭发烧友",
      text: "屏幕灯和磁轴键盘是高频刚需，晚上办公不刺眼，打游戏也更有沉浸感。",
    },
    {
      avatar: "舟",
      name: "沈舟",
      meta: "远程办公",
      text: "这套桌搭最打动我的是桌面音响，横向放不占空间，使用体验比小音箱完整。",
    },
    {
      avatar: "白",
      name: "白桃",
      meta: "收藏 12 件",
      text: "自动升降桌加屏幕灯可以直接抄作业，想看同款清单和预算版替代。",
    },
  ],
  edc: [
    {
      avatar: "琦",
      name: "邵琦",
      meta: "通勤党",
      text: "骨传导耳机适合走路换乘，能听播客又保留环境音，这个使用体验很实用。",
    },
    {
      avatar: "M",
      name: "Mira",
      meta: "数码控",
      text: "手机、手表、电纸书这个组合够轻，感觉就是我的日常包同款。",
    },
    {
      avatar: "冉",
      name: "冉冉",
      meta: "想买清单",
      text: "电纸书放进 EDC 之后内容气质变了，不只是数码工具，想要链接。",
    },
  ],
  room: [
    {
      avatar: "G",
      name: "Gabi",
      meta: "RoomTour 主理人",
      text: "花瓶和装饰画真的把客厅中轴撑起来了，低矮边柜一下不空了。",
    },
    {
      avatar: "青",
      name: "青柠",
      meta: "家居收藏",
      text: "落地灯这个弧线太适合阅读角，好像要一个同款，晚上应该很有氛围。",
    },
    {
      avatar: "予",
      name: "予安",
      meta: "原木风爱好者",
      text: "这套不是堆单品，是整体空间比例舒服。想看花瓶和地毯的替代推荐。",
    },
  ],
};

const semanticSearchScenes = [
  {
    id: "search-family-camping-car",
    type: "AI方案",
    title: "我的露营餐具分享",
    creator: "AI 搜索",
    image: "./assets/做饭.png",
    scenario: "亲子露营",
    tags: ["儿童安全", "露营补给", "车载收纳"],
    products: ["应急电源", "车内手机支架", "车载香氛", "车把手挂钩"],
    searchSummary:
      "大模型把需求理解为：孩子安全、长途舒适、露营补能和车内取放效率，优先推荐能降低照看成本的车载商品。",
    feedLabels: [
      { text: "儿童可视导航", x: 58, y: 44 },
      { text: "露营补能点", x: 63, y: 75 },
      { text: "轻香座舱", x: 82, y: 35 },
    ],
    hotspots: [
      {
        x: 58,
        y: 49,
        product: "车内手机支架",
        label: "儿童可视导航",
        review: "带孩子出行时，导航、营地路线和亲子音乐都能保持在中控视线内。",
        productUrl: "#shop-%E8%BD%A6%E5%86%85%E6%89%8B%E6%9C%BA%E6%94%AF%E6%9E%B6",
      },
      {
        x: 62,
        y: 78,
        product: "应急电源",
        label: "露营补能点",
        review: "孩子的夜灯、平板、风扇和手机都需要补电，应急电源是亲子露营的稳定底座。",
        productUrl: "#shop-%E5%BA%94%E6%80%A5%E7%94%B5%E6%BA%90",
      },
      {
        x: 82,
        y: 40,
        product: "车载香氛",
        label: "轻香座舱",
        review: "长途车内不能太浓，轻香型更适合孩子乘坐和午睡。",
        productUrl: "#shop-%E8%BD%A6%E8%BD%BD%E9%A6%99%E6%B0%9B",
      },
    ],
  },
  {
    id: "search-family-camping-edc",
    type: "AI方案",
    title: "亲子露营随身 EDC：孩子不离身的小物清单",
    creator: "AI 搜索",
    image: "./assets/玩具.png",
    scenario: "移动出行",
    tags: ["亲子", "轻量化", "随身补给"],
    products: ["手机", "耳机", "充电宝", "电纸书"],
    searchSummary:
      "适合把营地地图、孩子娱乐、紧急联系和轻量阅读放进一个随身包，降低临时翻找成本。",
    hotspots: [
      {
        x: 17,
        y: 26,
        product: "手机",
        label: "亲子路线手机",
        review: "负责导航、拍照和紧急联系，是带孩子露营时最关键的随身设备。",
        productUrl: "#shop-%E6%89%8B%E6%9C%BA",
      },
      {
        x: 42,
        y: 36,
        product: "耳机",
        label: "开放式耳机",
        review: "听导航或播客时仍然能听到孩子和周围环境，比入耳式更适合亲子户外。",
        productUrl: "#shop-%E8%80%B3%E6%9C%BA",
      },
      {
        x: 32,
        y: 69,
        product: "电纸书",
        label: "安静阅读",
        review: "孩子午睡或休息时，大人可以低刺激阅读，不打扰营地节奏。",
        productUrl: "#shop-%E7%94%B5%E7%BA%B8%E4%B9%A6",
      },
    ],
  },
  {
    id: "search-family-camping-room",
    type: "AI方案",
    title: "把营地搭成孩子能安静待住的小客厅",
    creator: "AI 搜索",
    image: "./assets/scene-family-camp-lounge.png",
    scenario: "营地布置",
    tags: ["亲子氛围", "灯光", "休息区"],
    products: ["落地灯", "花瓶", "装饰画", "智能灯带"],
    searchSummary:
      "语义匹配到孩子露营不只需要装备，也需要安全边界、柔和灯光和可停留的休息氛围。",
    hotspots: [
      {
        x: 14,
        y: 43,
        product: "落地灯",
        label: "柔和营地灯",
        review: "孩子晚上活动时需要可见但不刺眼的光，暖色局部照明更舒服。",
        productUrl: "#shop-%E8%90%BD%E5%9C%B0%E7%81%AF",
      },
      {
        x: 67,
        y: 48,
        product: "花瓶",
        label: "轻装饰",
        review: "露营休息区可以用轻量装饰形成边界感，让孩子知道哪里是固定活动区。",
        productUrl: "#shop-%E8%8A%B1%E7%93%B6",
      },
      {
        x: 81,
        y: 37,
        product: "装饰画",
        label: "主题布置",
        review: "如果做亲子内容分享，背景主题会让笔记更完整，也更容易被收藏。",
        productUrl: "#shop-%E8%A3%85%E9%A5%B0%E7%94%BB",
      },
    ],
  },
];

const immersiveCamera = {
  x: 0,
  z: 0,
  ry: 0,
};

let activeInspectorScene = null;
let shopRendered = false;
let activeShopSearchMode = "solution";

function product(name, price, detail) {
  return {
    name,
    price,
    detail,
    id: `shop-${encodeURIComponent(name)}`,
  };
}

export function getShopCategories() {
  return shopCategories;
}

export function getProductByName(name) {
  return productCatalog.find((item) => item.name === name);
}

export function semanticSearchNotes(query) {
  const normalized = query.trim();
  if (!normalized) return demoScenes;

  const intentTerms = inferSearchIntent(normalized);
  const scored = [...semanticSearchScenes, ...demoScenes].map((scene) => {
    const haystack = [
      scene.title,
      scene.type,
      scene.scenario,
      scene.searchSummary,
      ...scene.tags,
      ...scene.products,
    ]
      .filter(Boolean)
      .join(" ");
    const keywordScore = intentTerms.reduce(
      (score, term) => score + (haystack.includes(term) ? 3 : 0),
      0,
    );
    const exactScore = normalized
      .split(/\s+|，|。|、/)
      .filter(Boolean)
      .reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0);

    return {
      scene,
      score: keywordScore + exactScore + (scene.id.startsWith("search-") ? 2 : 0),
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, 4)
    .map((item) => item.scene);
}

export function semanticSearchProducts(query) {
  const normalized = query.trim();
  if (!normalized) return productCatalog;

  const intentTerms = inferSearchIntent(normalized);
  const scored = productCatalog.map((item) => {
    const haystack = [item.name, item.category, item.detail].filter(Boolean).join(" ");
    const keywordScore = intentTerms.reduce(
      (score, term) => score + (haystack.includes(term) ? 3 : 0),
      0,
    );
    const exactScore = normalized
      .split(/\s+|，|。|、/)
      .filter(Boolean)
      .reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0);

    return {
      item,
      score: keywordScore + exactScore + inferProductIntentBoost(normalized, item),
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .filter((entry) => entry.score > 0)
    .slice(0, 8)
    .map((entry) => entry.item);
}

export function buildShopSolution(query) {
  const normalized = query.trim() || "帮我寻找带5岁孩子去露营的商品方案";
  const isFamilyCamping = /孩子|儿童|亲子|5岁|五岁|宝宝|露营|营地|户外/.test(normalized);
  const isFitness = /减脂|减重|轻食|运动|健身/.test(normalized);
  const isDesk = /桌搭|办公|游戏|效率|电脑/.test(normalized);

  if (isFitness) {
    return {
      query: normalized,
      title: "一周减脂生活商品方案",
      sceneTags: ["减脂", "轻食", "居家运动", "低糖替代"],
      understanding:
        "AI 把需求理解为：降低饮食负担、保留饱腹感、让运动更容易坚持，同时让内容素材更适合发布。",
      essentials: [
        solutionEssential("蛋白沙拉", "解决晚餐高蛋白和低负担，适合直接作为图文主素材。"),
        solutionEssential("居家运动垫", "让核心训练、拉伸和低冲击运动有固定场景，降低开始成本。"),
        solutionEssential("低糖气泡水", "替代高糖饮料，保留轻松感，适合减脂期继续坚持。"),
      ],
      bundles: [
        solutionBundle("预算版", "先把饮食替换和基础运动跑起来", ["蛋白沙拉", "低糖气泡水"], "￥61"),
        solutionBundle("品质版", "饮食、训练、记录一起升级", ["蛋白沙拉", "居家运动垫", "低糖气泡水"], "￥220"),
        solutionBundle("轻量版", "适合只想先做轻负担改变的人", ["低糖气泡水", "蛋白沙拉"], "￥61"),
      ],
    };
  }

  if (isDesk) {
    return {
      query: normalized,
      title: "高能量桌搭工作方案",
      sceneTags: ["效率", "照明", "输入", "沉浸感"],
      understanding:
        "AI 把需求理解为：减少桌面疲劳、提升输入效率、补足夜间氛围，并让工作和娱乐都更稳定。",
      essentials: [
        solutionEssential("屏幕灯", "减少桌面阴影和屏幕反光，夜间办公更舒服。"),
        solutionEssential("机械键盘", "提升高频输入手感，是桌面效率的核心触点。"),
        solutionEssential("桌面音响", "补足视频、游戏和背景音乐的沉浸感。"),
        solutionEssential("自动升降桌", "久坐和站立切换，让桌搭更适合长期使用。"),
      ],
      bundles: [
        solutionBundle("预算版", "先解决照明和输入", ["屏幕灯", "机械键盘"], "￥968"),
        solutionBundle("品质版", "完整升级桌面工作半径", ["自动升降桌", "屏幕灯", "机械键盘", "桌面音响"], "￥3066"),
        solutionBundle("轻量版", "不大改桌面，只提升高频体验", ["屏幕灯", "桌面音响"], "￥768"),
      ],
    };
  }

  return {
    query: normalized,
    title: isFamilyCamping ? "亲子露营一站式购买方案" : "AI 生活场景购买方案",
    sceneTags: ["亲子", "安全", "收纳", "补能", "做饭"],
    understanding:
      "AI 把需求理解为：带孩子出门不只是买装备，而是要同时解决安全边界、车内取放、营地补能和吃饭这几个高频问题。",
    essentials: [
      solutionEssential("便携餐具套装", "孩子能独立取用，吃饭不用临时翻找，也减少一次性用品。"),
      solutionEssential("折叠锅具", "营地做饭和热食的核心装备，收纳后不占后备箱。"),
      solutionEssential("保温杯", "给孩子和大人准备热水，清晨、夜间和长途路上都更稳。"),
      solutionEssential("露营调料盒", "把盐、胡椒、小包酱料集中收纳，做饭桌面不混乱。"),
      solutionEssential("应急电源", "给手机、露营灯和小设备补能，降低户外焦虑。"),
    ],
    bundles: [
      solutionBundle("预算版", "优先覆盖吃饭和基础补能", ["便携餐具套装", "折叠锅具", "保温杯"], "￥457"),
      solutionBundle(
        "品质版",
        "一次配齐亲子露营的餐厨、补能和车内收纳",
        ["便携餐具套装", "折叠锅具", "保温杯", "露营调料盒", "应急电源", "车把手挂钩"],
        "￥954",
      ),
      solutionBundle("轻量版", "适合轻装短途，不增加太多负重", ["便携餐具套装", "露营调料盒", "车把手挂钩"], "￥187"),
    ],
  };
}

function solutionEssential(name, reason) {
  const productItem = getProductByName(name);
  return {
    name,
    reason,
    price: productItem?.price ?? "￥199",
    category: productItem?.category ?? "AI 推荐",
  };
}

function solutionBundle(name, strategy, products, total) {
  return {
    name,
    strategy,
    products: products.map((productName) => solutionEssential(productName, getProductByName(productName)?.detail ?? "适合当前场景的可购买单品。")),
    total,
  };
}

export function resolveSemanticQuery(value, fallback = "") {
  return (value || "").trim() || (fallback || "").trim();
}

function inferProductIntentBoost(query, item) {
  let score = 0;
  if (/孩子|儿童|亲子|5岁|五岁|宝宝/.test(query) && /露营|营地|户外|自驾/.test(query)) {
    if (["应急电源", "车内手机支架", "车把手挂钩", "车载香氛", "充电宝"].includes(item.name)) {
      score += 9;
    }
    if (["落地灯", "低糖气泡水"].includes(item.name)) score += 3;
  }
  if (/减脂|减重|轻食|运动|健身/.test(query)) {
    if (["蛋白沙拉", "居家运动垫", "低糖气泡水"].includes(item.name)) score += 9;
  }
  if (/桌搭|办公|游戏|效率|电脑/.test(query)) {
    if (["自动升降桌", "机械键盘", "屏幕灯", "桌面音响"].includes(item.name)) score += 8;
  }
  if (/通勤|出行|随身|EDC|包/.test(query)) {
    if (["手机", "手表", "电纸书", "耳机", "充电宝", "香水"].includes(item.name)) score += 8;
  }
  return score;
}

function inferSearchIntent(query) {
  const terms = [];
  if (/孩子|儿童|亲子|5岁|五岁|宝宝/.test(query)) terms.push("儿童", "孩子", "亲子");
  if (/露营|营地|户外|自驾/.test(query)) terms.push("露营", "营地", "自驾");
  if (/商品|方案|清单|买|同款|装备/.test(query)) terms.push("方案", "商品", "清单");
  if (/安全|舒服|舒适|休息/.test(query)) terms.push("安全", "舒适", "休息");
  return terms.length ? terms : query.split("").filter((char) => char.trim());
}

export function generateAiDraft({ sceneType, prompt }) {
  const products = productMap[sceneType] ?? productMap["车搭"];
  const matched = products.filter((product) => prompt.includes(product.slice(0, 2)));
  const selected = matched.length >= 3 ? matched : products.slice(0, 4);

  return {
    title: `${sceneType}灵感包：${inferScenario(sceneType, prompt)}`,
    scene: inferScenario(sceneType, prompt),
    hotspots: selected.map((product, index) => ({
      product,
      note: buildAnnotation(sceneType, product),
      productUrl: `#shop-${encodeURIComponent(product)}`,
      confidence: `${92 - index * 3}%`,
    })),
    storyboard: [
      "镜头 1：环境建立，展示生活方式全貌和主理人的使用场景。",
      "镜头 2：AI 热点逐个点亮，解释每件商品解决的问题。",
      "镜头 3：切入沉浸式空间，用户拖动浏览并替换商品。",
      "镜头 4：落到购买理由和分享文案，完成内容到交易闭环。",
    ],
    socialCopy: {
      dcar: `今天这套${sceneType}适合${inferScenario(sceneType, prompt)}，AI 已经把商品、理由和替代方案都标出来了，直接点热点就能逛。`,
      xiaohongshu: `${sceneType}不是堆东西，是把${inferScenario(sceneType, prompt)}变得更顺手。自驾、露营、通勤都可以一键生成同款清单。`,
    },
  };
}

export function generateContentFromFragments({ fragmentIds, theme, outputType }) {
  const selectedFragments = inspirationFragments.filter((fragment) =>
    fragmentIds.includes(fragment.id),
  );
  const usableFragments = selectedFragments.length ? selectedFragments : inspirationFragments.slice(0, 3);
  const cleanTheme = theme?.trim() || "我的一周减脂生活";
  const type = outputType === "视频" ? "视频" : "图文";
  const productNames = [...new Set(usableFragments.flatMap((fragment) => fragment.products))];
  const productHotspots = productNames.map((name, index) => ({
    product: name,
    label: buildFragmentProductLabel(name),
    reason: buildFragmentProductReason(name),
    x: [31, 62, 78, 47][index] ?? 54,
    y: [52, 44, 64, 72][index] ?? 58,
    productUrl: `#shop-${encodeURIComponent(name)}`,
  }));
  const fragmentCopy = usableFragments.map((fragment) => fragment.content).join("；");
  const generatedVideo =
    type === "视频"
      ? {
          src: "./assets/generated-fat-loss-video.mp4",
          poster: "./assets/fragment-workout-cover.svg",
          title: `${cleanTheme}｜AI 生成视频`,
        }
      : null;

  return {
    title: `${cleanTheme}｜AI ${type}草稿`,
    outputType: type,
    generatedVideo,
    selectedFragments: usableFragments,
    publishCopy: [
      `这周的主题是「${cleanTheme}」。`,
      `AI 读到的素材线索：${fragmentCopy}。`,
      "内容会把结果、饮食和运动过程放在同一条故事线里，让它像真实生活记录，而不是单点打卡。",
    ].join("\n"),
    storyboard:
      type === "视频"
        ? [
            "开场：体重记录和日期快速闪现，建立一周目标。",
            "中段：切轻食沙拉和居家运动片段，展示可坚持的节奏。",
            "结尾：商品热点浮出，挂上同款轻食、运动垫和低糖饮品。",
          ]
        : [
            "封面：我的一周减脂生活，突出减重 1kg。",
            "图 2：轻食沙拉晚餐，标注高蛋白和低负担。",
            "图 3：居家运动片段，补足行动过程。",
            "图 4：AI 同款清单，可点击商品绿点购买。",
          ],
    productHotspots,
    editableLinks: productHotspots.map((item) => ({
      product: item.product,
      label: item.label,
      url: item.productUrl,
    })),
    article: buildGeneratedArticle(cleanTheme, usableFragments),
    userDescription:
      "用户补充描述：这一周没有追求极限，只把晚餐、运动和饮料都换成更容易坚持的版本。",
  };
}

function buildGeneratedArticle(theme, fragments) {
  const hasVoice = fragments.some((fragment) => fragment.id === "voice-note");
  return {
    title: theme,
    subtitle: "一周没有硬扛，靠饮食、运动和小替换慢慢把状态找回来。",
    coverNote: "AI 已把体重记录、轻食图片和运动视频组合成可发布图文。",
    sections: [
      {
        title: "01 先记录一个小结果",
        text: "20260501 体重比上周轻了 1kg。这个变化不夸张，但它说明节奏是有效的：不用极限节食，也能看到身体开始回应。",
      },
      {
        title: "02 晚餐换成轻食沙拉",
        text: "这顿轻食沙拉负责把饱腹感和清爽感放在一起。鸡胸、蔬菜和低脂酱汁比单纯少吃更容易坚持，也更适合拍成生活方式图文。",
      },
      {
        title: "03 在家运动补上行动感",
        text: "居家运动视频让这篇内容不只是体重打卡。20 分钟核心训练和拉伸把过程补完整，看起来像真实的一周，而不是一张孤立截图。",
      },
      {
        title: "04 AI 顺手挂上同款",
        text: "文中出现的轻食沙拉、居家运动垫和低糖气泡水已经被 AI 匹配到商城同款，读者可以从绿点直接进入商品详情。",
      },
    ],
    closing: hasVoice
      ? "这周的关键词是：别太硬核，先做到能继续。"
      : "这周的关键词是：把每一步做轻一点，才更容易继续。",
    hashtags: ["#减脂生活", "#轻食晚餐", "#居家运动", "#AI生活记录"],
  };
}

function buildFragmentProductLabel(productName) {
  return {
    蛋白沙拉: "同款轻食沙拉",
    居家运动垫: "居家训练运动垫",
    低糖气泡水: "低糖气泡水",
  }[productName] ?? productName;
}

function buildFragmentProductReason(productName) {
  return {
    蛋白沙拉: "和晚餐图片里的轻食结构一致，适合直接挂同款套餐。",
    居家运动垫: "对应在家运动视频，用户可以从内容直接买到训练装备。",
    低糖气泡水: "减脂生活里替代高糖饮料，和轻松坚持的主题一致。",
  }[productName] ?? "AI 根据素材语义在商城里匹配出的相似商品。";
}

function inferScenario(sceneType, prompt) {
  if (/露营|自驾|周末/.test(prompt)) return "自驾露营";
  if (/办公|工作|桌/.test(prompt)) return "高效办公";
  if (/通勤|出差|背包/.test(prompt)) return "移动通勤";
  if (/客厅|观影|家/.test(prompt)) return "智能客厅";
  return {
    车搭: "自驾出游",
    桌搭: "居家办公",
    EDC: "移动出行",
    RoomTour: "客厅观影",
  }[sceneType];
}

function buildAnnotation(sceneType, product) {
  const reason = {
    车搭: "减少行车过程里的取放成本，长途场景更稳定。",
    桌搭: "把高频工具放进同一工作半径，提升桌面效率。",
    EDC: "轻量、可随身、能覆盖突发场景。",
    RoomTour: "让客厅从单点设备变成联动体验。",
  }[sceneType];
  return `${product}：${reason}`;
}

function getCommentCount(scene, index) {
  return 18 + scene.hotspots.length * 5 + index * 7;
}

function renderCreatorMark(creator) {
  const avatar = creatorAvatars[creator];
  if (!avatar) return `<span class="creator-dot"></span>`;
  return `<img class="creator-avatar" src="${avatar}" alt="${creator}头像" loading="lazy" decoding="async" />`;
}

function renderFeed(scenes = demoScenes, options = {}) {
  const feedGrid = document.querySelector("#feedGrid");
  if (!feedGrid) return;

  feedGrid.innerHTML = [
    options.query
      ? `
        <article class="search-result-summary">
          <p class="eyebrow">AI Semantic Search</p>
          <h3>已理解你的需求</h3>
          <p>“${options.query}” 被拆解为亲子安全、露营补给、车载收纳和舒适休息，下面是可直接参考的相关笔记。</p>
        </article>
      `
      : "",
    ...scenes.map(
      (scene, index) => `
        <article class="feed-card ${scene.searchSummary ? "search-note" : ""}" data-scene="${scene.id}">
          <img class="scene-image" src="${scene.image}" alt="${scene.type}生活方式图片" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" fetchpriority="${index === 0 ? "high" : "low"}" />
          <div class="creator-badge">
            ${renderCreatorMark(scene.creator)}
            <span>${scene.creator}</span>
          </div>
          ${(scene.feedLabels ?? [])
            .map(
              (label) => `
                <span class="feed-label" style="left:${label.x}%; top:${label.y}%;">${label.text}</span>
              `,
            )
            .join("")}
          <div class="feed-content">
            <p class="eyebrow">${scene.type} / ${scene.scenario}</p>
            <h2>${scene.title}</h2>
            ${scene.searchSummary ? `<p class="search-note-summary">${scene.searchSummary}</p>` : ""}
            <div class="tag-row">${scene.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
            <div class="actions">
              <button class="hard-button" type="button" aria-pressed="false" data-hard-button data-hard-count="${36 + scene.products.length * 8}">
                硬 <span class="hard-count">${36 + scene.products.length * 8}</span>${renderThumbIcon()}
              </button>
              <button type="button">评论 <span class="comment-count">${getCommentCount(scene, index)}</span><span class="comment-icon" aria-hidden="true"></span></button>
              <button type="button" data-immersive-button data-scene-id="${scene.id}">沉浸式浏览</button>
            </div>
          </div>
        </article>
      `,
    ),
  ]
    .join("");

  feedGrid.querySelectorAll(".feed-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button, a, .hotspot")) return;

      const scene = [...demoScenes, ...semanticSearchScenes].find(
        (item) => item.id === card.dataset.scene,
      );
      if (scene) renderInspector(scene);
    });
  });

  renderInspector(scenes[0] ?? demoScenes[0]);
}

function renderThumbIcon() {
  return `
    <span class="thumb-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path class="thumb-outline" d="M7.2 10.2h-3v10h3m0-10 4.7-7.2c.4-.6 1.4-.4 1.5.3l.4 3.2c.1.9-.1 1.8-.6 2.6h4.5c1.5 0 2.6 1.4 2.3 2.8l-1.2 5.9c-.3 1.4-1.5 2.4-2.9 2.4H7.2v-10Z" />
        <path class="thumb-fill" d="M7.2 20.2h8.7c1.4 0 2.6-1 2.9-2.4l1.2-5.9c.3-1.4-.8-2.8-2.3-2.8h-4.5c.5-.8.7-1.7.6-2.6l-.4-3.2c-.1-.7-1.1-.9-1.5-.3l-4.7 7.2v10Zm-3-10h3v10h-3v-10Z" />
      </svg>
    </span>
  `;
}

function renderInspector(scene) {
  const inspector = document.querySelector("#inspector");
  if (!inspector) return;

  activeInspectorScene = scene;

  inspector.innerHTML = `
    <p class="eyebrow">Immersive Explorer</p>
    <h2>${scene.title}</h2>
    <p class="muted">${scene.scenario}内容已被 AI 转成可浏览空间，商品热点可挂链、评论和替换。</p>
    <div class="immersive">
      <img src="${scene.image}" alt="${scene.type}沉浸式空间" loading="lazy" decoding="async" />
      <div class="scan-badge inspector-scan-badge">AI 商品雷达扫描中</div>
      ${scene.hotspots
        .map(
          (hotspot) =>
            renderHotspot(hotspot),
        )
        .join("")}
    </div>
    ${renderSceneProductLinks(scene)}
    ${renderSceneComments(scene)}
  `;
}

function renderSceneProductLinks(scene) {
  return `
    <div class="scene-product-links" aria-label="${scene.title}商品链接">
      <div class="scene-product-links-head">
        <strong>同款商品链接</strong>
        <span>${scene.products.length} 个可购买单品</span>
      </div>
      <div class="scene-product-link-grid">
        ${scene.products
          .map((name) => {
            const item = getProductByName(name) ?? {
              name,
              price: "￥199",
              detail: "AI 根据当前内容识别出的同款商品。",
            };
            return `
              <a class="scene-product-link" href="#shop-${encodeURIComponent(name)}" data-product-link="${name}">
                <span>${item.name}</span>
                <strong>${item.price}</strong>
                <em>${item.detail}</em>
              </a>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderSceneComments(scene) {
  const comments = sceneComments[scene.id] ?? [];

  return `
    <div class="comment-stream" aria-label="${scene.title}用户评论">
      <div class="comment-stream-head">
        <strong>用户正在讨论</strong>
        <span>${comments.length} 条高相关评论</span>
      </div>
      ${comments
        .map(
          (comment) => `
            <article class="user-comment">
              <div class="user-avatar" aria-hidden="true">${comment.avatar}</div>
              <div>
                <div class="comment-meta">
                  <strong>${comment.name}</strong>
                  <span>${comment.meta}</span>
                </div>
                <p>${comment.text}</p>
              </div>
            </article>
          `,
        )
        .join("")}
      <label class="comment-compose">
        <span class="pencil-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M4 17.5V21h3.5L18.1 10.4l-3.5-3.5L4 17.5Z" />
            <path d="m16 5.5 1.4-1.4c.8-.8 2-.8 2.8 0s.8 2 0 2.8l-1.4 1.4L16 5.5Z" />
          </svg>
        </span>
        <input type="text" placeholder="留下你的看法吧～" aria-label="留下你的看法吧～" />
      </label>
    </div>
  `;
}

function getSceneByProduct(productName) {
  return demoScenes.find((scene) => scene.products.includes(productName)) ?? demoScenes[0];
}

function getProductDetailMeta(productName) {
  const scene = getSceneByProduct(productName);
  const hotspot = scene.hotspots.find((item) => item.product === productName);
  return {
    scene,
    label: hotspot?.label ?? productName,
    review: hotspot?.review ?? buildAnnotation(scene.type, productName),
  };
}

function buildAiReviewSummary(productItem, scene, review) {
  const relatedCount = Math.max(280, scene.products.length * 146);
  const categoryTone =
    productItem.category === "生活分享"
      ? "适合真实生活方式内容里的可复制清单"
      : "适合当前场景下的高频使用需求";

  return {
    source: `AI 汇总 ${relatedCount}+ 条全网评价`,
    title: "网友集中认可：好用点不在参数，而在真实场景里省心",
    body: `${productItem.name}的高频正向反馈集中在“${review}”。${categoryTone}，用户更在意它能不能减少临时翻找、提升收纳效率和降低决策成本。`,
    chips: ["口碑偏正向", "场景匹配高", "同款需求强"],
  };
}

function renderProductDetail(productName) {
  const inspector = document.querySelector("#inspector");
  if (!inspector) return;

  const productItem = getProductByName(productName) ?? {
    name: productName,
    price: "￥199",
    detail: "AI 根据当前生活方式场景识别出的可购买单品。",
    category: "AI 推荐",
  };
  const { scene, label, review } = getProductDetailMeta(productName);
  activeInspectorScene = scene;
  const related = scene.products.filter((item) => item !== productName).slice(0, 4);
  const aiSummary = buildAiReviewSummary(productItem, scene, review);

  inspector.innerHTML = `
    <section class="product-detail-shell" aria-label="${productItem.name}商品详情">
      <button class="detail-back" type="button" data-inspector-back>返回</button>
      <div class="product-detail-hero">
        <img src="${scene.image}" alt="${productItem.name}商品场景图" loading="lazy" decoding="async" />
        <div class="detail-hero-shade"></div>
        <span class="detail-brand">LifeOS Mall</span>
        <strong>${label}</strong>
        <em>1/5</em>
      </div>
      <div class="detail-variant-row">
        <span class="detail-thumb active">
          <img src="${scene.image}" alt="${productItem.name}款式" loading="lazy" decoding="async" />
        </span>
        ${related.map((item) => `<span>${item}</span>`).join("")}
      </div>
      <div class="product-detail-body">
        <div class="product-detail-price">
          <strong>${productItem.price}</strong>
          <span>起</span>
          <em>已售 ${scene.hotspots.length * 18}</em>
        </div>
        <h3>${productItem.name} ${productItem.detail}</h3>
        <section class="ai-review-summary" aria-label="${productItem.name}AI 全网口碑总结">
          <p>${aiSummary.source}</p>
          <strong>${aiSummary.title}</strong>
          <span>${aiSummary.body}</span>
          <div>
            ${aiSummary.chips.map((chip) => `<em>${chip}</em>`).join("")}
          </div>
        </section>
        <div class="product-detail-tags">
          <span>AI 推荐</span>
          <span>假一赔四</span>
          <span>7 天无理由</span>
        </div>
        <article class="product-detail-row">
          <strong>闪购</strong>
          <span>预计明天 11:00 送达，当前场景匹配度 ${92 - related.length}%</span>
        </article>
        <article class="product-detail-row">
          <strong>评价</strong>
          <span>${review}</span>
        </article>
        <article class="product-detail-row">
          <strong>规格</strong>
          <span>${productItem.category}｜同场景可替换｜支持 AI 搭配推荐</span>
        </article>
      </div>
      <div class="product-detail-actions">
        <div class="detail-mini-actions">
          <button type="button">店铺</button>
          <button type="button">客服</button>
          <button type="button">收藏</button>
        </div>
        <button class="detail-cta secondary" type="button">加入购物车</button>
        <button class="detail-cta" type="button">立即购买</button>
      </div>
    </section>
  `;
}

function renderShop() {
  const shopGrid = document.querySelector("#shopGrid");
  if (!shopGrid) return;
  shopRendered = true;

  shopGrid.innerHTML = shopCategories
    .map(
      (category) => `
        <article class="shop-card">
          <img src="${category.image}" alt="${category.name}" loading="lazy" decoding="async" />
          <div>
            <p class="eyebrow" id="shop-${encodeURIComponent(category.name)}">Shop</p>
            <h3>${category.name}</h3>
            <div class="shop-products">${category.products
              .map(
                (item) => `
                  <article class="shop-product" id="${item.id}" data-shop-product="${item.name}" tabindex="0" role="button" aria-label="查看${item.name}商品详情">
                    <div>
                      <strong>${item.name}</strong>
                      <span>${item.detail}</span>
                    </div>
                    <em>${item.price}</em>
                  </article>
                `,
              )
              .join("")}</div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderShopProductResults(results, query) {
  const shopGrid = document.querySelector("#shopGrid");
  if (!shopGrid) return;
  shopRendered = true;

  shopGrid.innerHTML = `
    <article class="shop-search-summary">
      <p class="eyebrow">AI Product Search</p>
      <h3>已理解为「${query}」</h3>
      <p>大模型把需求拆成场景、人群、使用痛点和可购买商品，优先返回能降低实际出行或使用成本的同款方案。</p>
    </article>
    <div class="shop-result-grid">
      ${results
        .map(
          (item) => `
            <article class="shop-product shop-search-result" id="${item.id}" data-shop-product="${item.name}" tabindex="0" role="button" aria-label="查看${item.name}商品详情">
              <div>
                <span class="shop-result-category">${item.category}</span>
                <strong>${item.name}</strong>
                <span>${item.detail}</span>
                <small>AI 匹配理由：适合「${query}」里的真实使用场景，可直接挂到内容或加入方案清单。</small>
              </div>
              <em>${item.price}</em>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderShopSolutionResults(solution) {
  const shopGrid = document.querySelector("#shopGrid");
  if (!shopGrid) return;
  shopRendered = true;

  shopGrid.innerHTML = `
    <article class="shop-search-summary shop-solution-summary">
      <p class="eyebrow">AI Solution Search</p>
      <h3>${solution.title}</h3>
      <p>「${solution.query}」已被拆解为可购买的场景方案，先解释为什么需要，再给出不同预算和偏好的成套组合。</p>
      <div class="solution-chip-row">
        ${solution.sceneTags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
    </article>
    <section class="shop-solution-panel scene-understanding">
      <p class="eyebrow">01 场景理解</p>
      <h3>${solution.sceneTags.join(" / ")}</h3>
      <p>${solution.understanding}</p>
    </section>
    <section class="shop-solution-panel essentials-panel">
      <p class="eyebrow">02 必备清单</p>
      <div class="essential-list">
        ${solution.essentials
          .map(
            (item) => `
              <article class="essential-item" data-shop-product="${item.name}" tabindex="0" role="button" aria-label="查看${item.name}商品详情">
                <div>
                  <strong>${item.name}</strong>
                  <span>${item.reason}</span>
                </div>
                <em>${item.price}</em>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
    <section class="shop-solution-panel bundle-panel">
      <p class="eyebrow">03 成套购买方案</p>
      <div class="solution-bundles">
        ${solution.bundles
          .map(
            (bundle) => `
              <article class="solution-bundle-card">
                <div class="bundle-head">
                  <strong>${bundle.name}</strong>
                  <em>${bundle.total}</em>
                </div>
                <p>${bundle.strategy}</p>
                <div class="bundle-products">
                  ${bundle.products
                    .map(
                      (item) => `
                        <button type="button" data-shop-product="${item.name}" aria-label="查看${item.name}商品详情">
                          <span>${item.name}</span>
                          <em>${item.price}</em>
                        </button>
                      `,
                    )
                    .join("")}
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderHotspot(hotspot) {
  const edgeClass =
    hotspot.x < 25 ? "edge-left" : hotspot.x > 75 ? "edge-right" : "edge-center";

  return `
    <span class="hotspot ${edgeClass}" style="left:${hotspot.x}%; top:${hotspot.y}%;" tabindex="0" role="button" aria-label="${hotspot.label}">
      <span class="hotspot-dot"></span>
      <span class="hotspot-card">
        <strong>${hotspot.label}</strong>
        <span>${hotspot.review}</span>
        <a href="${hotspot.productUrl}" data-product-link="${hotspot.product}">查看商品详情</a>
      </span>
    </span>
  `;
}

function renderAiOutput(draft) {
  const output = document.querySelector("#aiOutput");
  if (!output) return;

  if (draft.productHotspots) {
    output.innerHTML = `
      <div class="ai-package fragment-package">
        <p class="eyebrow">Generated Package</p>
        <h2>${draft.title}</h2>
        <div class="publish-preview">
          <div class="publish-media ${draft.outputType === "视频" ? "video-mode" : "image-mode"}">
            ${
              draft.generatedVideo
                ? `<video class="generated-video-preview" src="${draft.generatedVideo.src}" poster="${draft.generatedVideo.poster}" controls playsinline muted aria-label="${draft.generatedVideo.title}"></video>`
                : ""
            }
            <span class="media-mode">${draft.outputType}</span>
            <strong>${draft.outputType === "视频" ? "一周减脂生活片段" : "一周减脂生活封面"}</strong>
            <p>减重 1kg / 轻食晚餐 / 居家运动</p>
            ${renderPublishHotspots(draft)}
          </div>
          <div class="publish-copy-card">
            <strong>AI 已组合的发布文案</strong>
            <textarea aria-label="AI 已组合的发布文案">${draft.publishCopy}</textarea>
          </div>
        </div>
        <div class="package-row">
          <strong>已选碎片</strong>
          <div class="chips">
            ${draft.selectedFragments
              .map((fragment) => `<span class="chip">${fragment.type} · ${fragment.title}</span>`)
              .join("")}
          </div>
        </div>
        <div class="package-row">
          <strong>${draft.outputType === "视频" ? "视频分镜" : "图文结构"}</strong>
          <div>${draft.storyboard.map((shot) => `<p>${shot}</p>`).join("")}</div>
        </div>
        <div class="package-row">
          <strong>AI 主动匹配同款</strong>
          <div class="link-editor">
            ${draft.editableLinks
              .map(
                (item) => `
                  <label>
                    <span>${item.label}</span>
                    <input value="${item.url}" aria-label="${item.label}商品链接" />
                  </label>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="package-row">
          <strong>用户补充描述</strong>
          <textarea class="user-description-editor" aria-label="用户补充描述">${draft.userDescription}</textarea>
        </div>
      </div>
    `;
    return;
  }

  output.innerHTML = `
    <div class="ai-package">
      <p class="eyebrow">Generated Package</p>
      <h2>${draft.title}</h2>
      <div class="package-row">
        <strong>商品热点</strong>
        <div class="chips">
          ${draft.hotspots
            .map((item) => `<span class="chip">${item.product} ${item.confidence}</span>`)
            .join("")}
        </div>
      </div>
      <div class="package-row">
        <strong>点评注释</strong>
        <div>${draft.hotspots.map((item) => `<p>${item.note}</p>`).join("")}</div>
      </div>
      <div class="package-row">
        <strong>视频故事板</strong>
        <div>${draft.storyboard.map((shot) => `<p>${shot}</p>`).join("")}</div>
      </div>
      <div class="package-row">
        <strong>社交文案</strong>
        <div>
          <p>${draft.socialCopy.dcar}</p>
          <p>${draft.socialCopy.xiaohongshu}</p>
        </div>
      </div>
    </div>
  `;
}

function renderPublishHotspots(draft) {
  if (draft.generatedVideo) return "";

  return draft.productHotspots
    .map(
      (item) => `
        <span class="publish-hotspot" style="left:${item.x}%; top:${item.y}%;" tabindex="0">
          <span class="hotspot-dot"></span>
          <span class="hotspot-card">
            <strong>${item.label}</strong>
            <span>${item.reason}</span>
            <a href="${item.productUrl}" data-product-link="${item.product}">查看商品详情</a>
          </span>
        </span>
      `,
    )
    .join("");
}

function renderGeneratedArticleHotspots(draft) {
  if (draft.generatedVideo) return "";

  return draft.productHotspots
    .map(
      (item) => `
        <span class="generated-post-hotspot" style="left:${item.x}%; top:${item.y}%;" tabindex="0">
          <span class="hotspot-dot"></span>
          <span class="hotspot-card">
            <strong>${item.label}</strong>
            <span>${item.reason}</span>
            <a href="${item.productUrl}" data-product-link="${item.product}">查看商品详情</a>
          </span>
        </span>
      `,
    )
    .join("");
}

function renderGeneratedArticleCover(draft) {
  const coverCopy = `
    <div class="generated-cover-copy">
      <span>20260501</span>
      <strong>减重 1kg</strong>
      <em>${draft.article.coverNote}</em>
    </div>
  `;

  if (draft.generatedVideo) {
    return `
      <div class="generated-article-cover generated-video-cover">
        <video class="generated-video-player" src="${draft.generatedVideo.src}" poster="${draft.generatedVideo.poster}" controls playsinline aria-label="${draft.generatedVideo.title}"></video>
        ${coverCopy}
        ${renderGeneratedArticleHotspots(draft)}
      </div>
    `;
  }

  return `
    <div class="generated-article-cover">
      <img src="./assets/fragment-salad.svg" alt="轻食沙拉图文封面" />
      <img src="./assets/fragment-workout-cover.svg" alt="居家运动图文封面" />
      ${coverCopy}
      ${renderGeneratedArticleHotspots(draft)}
    </div>
  `;
}

function renderGeneratedArticleInspector(draft) {
  const inspector = document.querySelector("#inspector");
  if (!inspector || !draft.article) return;

  inspector.innerHTML = `
    <article class="generated-article" aria-label="${draft.article.title}生成图文内容">
      <p class="eyebrow">AI Generated Post</p>
      <h2>${draft.article.title}</h2>
      <p class="generated-article-lead">${draft.article.subtitle}</p>
      ${renderGeneratedArticleCover(draft)}
      <div class="generated-post-body">
        ${draft.article.sections
          .map(
            (section) => `
              <section class="generated-post-section">
                <h3>${section.title}</h3>
                <p>${section.text}</p>
              </section>
            `,
          )
          .join("")}
      </div>
      <div class="generated-shop-links" aria-label="AI 匹配商品">
        ${draft.productHotspots
          .map(
            (item) => `
              <a href="${item.productUrl}" data-product-link="${item.product}">
                <span>${item.label}</span>
                <strong>查看商品详情</strong>
              </a>
            `,
          )
          .join("")}
      </div>
      <p class="generated-closing">${draft.article.closing}</p>
      <div class="generated-hashtags">
        ${draft.article.hashtags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
      <label class="generated-edit-copy">
        <span>可编辑发布文案</span>
        <textarea aria-label="可编辑发布文案">${draft.publishCopy}</textarea>
      </label>
      <div class="generated-publish-actions" aria-label="发布操作">
        <button class="publish-primary" type="button">发布</button>
        <button class="publish-secondary" type="button">存草稿</button>
        <button class="publish-tertiary" type="button">分享到其他平台</button>
      </div>
    </article>
  `;
}

function openImmersiveScene(scene) {
  const overlay = document.querySelector("#immersiveOverlay");
  const world = document.querySelector("#immersiveWorld");
  const title = document.querySelector("#immersiveTitle");
  const meta = document.querySelector("#immersiveMeta");
  const controls = document.querySelector("#immersiveControls");
  const viewport = document.querySelector("#immersiveViewport");
  if (!overlay || !world || !title || !meta || !controls) return;

  immersiveCamera.x = 0;
  immersiveCamera.z = 0;
  immersiveCamera.ry = 0;

  title.textContent = scene.title;
  meta.textContent = `${scene.type} / ${scene.scenario} / 3D SPACE`;
  world.innerHTML = `
    <div class="space-atmosphere" style="background-image:url('${scene.image}')"></div>
    <div class="space-floor"></div>
    <div class="space-ceiling"></div>
    ${renderImmersiveVisual(scene)}
    <div class="space-products">
      ${scene.hotspots
        .map(
          (hotspot, index) => `
            <a class="space-product" href="${hotspot.productUrl}" data-product-link="${hotspot.product}" style="--space-left:${hotspot.x}%; --space-top:${hotspot.y}%; --space-depth:${index * -90}px; --space-turn:${(index - 1) * 7}deg;">
              <strong>${hotspot.product}</strong>
              <span>${hotspot.review}</span>
            </a>
          `,
        )
        .join("")}
    </div>
    <div class="space-reticle"></div>
    <div class="space-near-vignette"></div>
  `;
  controls.innerHTML = renderImmersiveControls();
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("immersive-active");
  world.querySelector("[data-immersive-video]")?.play().catch(() => {});
  updateImmersiveCamera();
  viewport?.focus();
}

function renderImmersiveVisual(scene) {
  if (scene.immersiveVideo) {
    return `
      <div class="immersive-video-stage">
        <video
          class="immersive-video-player"
          src="${scene.immersiveVideo}"
          poster="${scene.image}"
          controls
          autoplay
          muted
          playsinline
          data-immersive-video
          aria-label="${scene.title}沉浸式视频"
        ></video>
        <div class="immersive-video-caption">
          <strong>沉浸式视频回放</strong>
          <span>播放真实露营餐具场景，暂停后仍可进入商品链接查看同款。</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="space-panorama">
      <div class="space-panel space-panel-left">
        <img src="${scene.image}" alt="${scene.type}空间左侧视野" />
      </div>
      <div class="space-panel space-panel-center">
        <img src="${scene.image}" alt="${scene.type}空间主视觉" />
      </div>
      <div class="space-panel space-panel-right">
        <img src="${scene.image}" alt="${scene.type}空间右侧视野" />
      </div>
    </div>
  `;
}

function closeImmersiveScene() {
  const overlay = document.querySelector("#immersiveOverlay");
  if (!overlay) return;

  overlay.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("immersive-active");
}

function renderImmersiveControls() {
  return `
    <button type="button" data-turn="left">左转</button>
    <button type="button" data-move="forward">前进</button>
    <button type="button" data-turn="right">右转</button>
    <button type="button" data-move="left">左移</button>
    <button type="button" data-move="back">后退</button>
    <button type="button" data-move="right">右移</button>
  `;
}

function moveImmersiveCamera(action) {
  const step = 46;
  const turn = 10;

  if (action === "forward") immersiveCamera.z += step;
  if (action === "back") immersiveCamera.z -= step;
  if (action === "left") immersiveCamera.x += step;
  if (action === "right") immersiveCamera.x -= step;
  if (action === "turn-left") immersiveCamera.ry -= turn;
  if (action === "turn-right") immersiveCamera.ry += turn;

  immersiveCamera.x = Math.max(-160, Math.min(160, immersiveCamera.x));
  immersiveCamera.z = Math.max(-180, Math.min(180, immersiveCamera.z));
  updateImmersiveCamera();
}

function updateImmersiveCamera() {
  const world = document.querySelector("#immersiveWorld");
  const position = document.querySelector("#immersivePosition");
  if (!world) return;

  world.style.setProperty("--camera-x", `${immersiveCamera.x}px`);
  world.style.setProperty("--camera-z", `${immersiveCamera.z}px`);
  world.style.setProperty("--camera-ry", `${immersiveCamera.ry}deg`);
  if (position) {
    position.textContent = `位置 ${immersiveCamera.z} / 视角 ${immersiveCamera.ry}`;
  }
}

function bindNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  const views = document.querySelectorAll(".view");

  function activate(viewId) {
    if (viewId === "shop" && !shopRendered) renderShop();
    tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewId));
    views.forEach((view) => view.classList.toggle("active", view.id === viewId));
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.view));
  });
}

function activateView(viewId) {
  if (viewId === "shop" && !shopRendered) renderShop();
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewId));
  document
    .querySelectorAll(".view")
    .forEach((view) => view.classList.toggle("active", view.id === viewId));
}

function bindProductLinks() {
  document.addEventListener("click", (event) => {
    const backButton = event.target.closest("[data-inspector-back]");
    if (backButton) {
      event.preventDefault();
      renderInspector(activeInspectorScene ?? demoScenes[0]);
      return;
    }

    const link = event.target.closest("[data-product-link]");
    if (!link) return;

    event.preventDefault();
    event.stopPropagation();
    closeImmersiveScene();
    renderProductDetail(link.dataset.productLink);
  });
}

function bindShopProducts() {
  document.addEventListener("click", (event) => {
    const productCard = event.target.closest("[data-shop-product]");
    if (!productCard) return;

    event.preventDefault();
    renderProductDetail(productCard.dataset.shopProduct);
  });

  document.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;

    const productCard = event.target.closest("[data-shop-product]");
    if (!productCard) return;

    event.preventDefault();
    renderProductDetail(productCard.dataset.shopProduct);
  });
}

function bindImmersiveBrowse() {
  document.addEventListener("click", (event) => {
    const browseButton = event.target.closest("[data-immersive-button]");
    if (!browseButton) return;

    event.stopPropagation();
    const scene = demoScenes.find((item) => item.id === browseButton.dataset.sceneId);
    if (scene) openImmersiveScene(scene);
  });

  document.querySelector("[data-immersive-close]")?.addEventListener("click", closeImmersiveScene);
  document.querySelector("#immersiveControls")?.addEventListener("click", (event) => {
    const moveButton = event.target.closest("[data-move], [data-turn]");
    if (!moveButton) return;

    if (moveButton.dataset.move) moveImmersiveCamera(moveButton.dataset.move);
    if (moveButton.dataset.turn) moveImmersiveCamera(`turn-${moveButton.dataset.turn}`);
  });

  document.querySelector("#immersiveViewport")?.addEventListener("keydown", (event) => {
    const keyMap = {
      ArrowUp: "forward",
      ArrowDown: "back",
      ArrowLeft: "turn-left",
      ArrowRight: "turn-right",
      a: "left",
      d: "right",
      Escape: "close",
    };
    const action = keyMap[event.key];
    if (!action) return;

    event.preventDefault();
    if (action === "close") closeImmersiveScene();
    else moveImmersiveCamera(action);
  });
}

function bindHardButtons() {
  document.addEventListener("click", (event) => {
    const hardButton = event.target.closest("[data-hard-button]");
    if (!hardButton) return;

    event.stopPropagation();
    const liked = hardButton.getAttribute("aria-pressed") !== "true";
    const baseCount = Number(hardButton.dataset.hardCount);
    const hardCount = hardButton.querySelector(".hard-count");

    hardButton.setAttribute("aria-pressed", String(liked));
    hardButton.classList.toggle("liked", liked);
    if (hardCount) {
      hardCount.textContent = String(baseCount + (liked ? 1 : 0));
    }
  });
}

function bindCreator() {
  const form = document.querySelector("#creatorForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const draft = generateContentFromFragments({
      fragmentIds: getSelectedFragmentIds(),
      theme: document.querySelector("#promptText")?.value,
      outputType: document.querySelector('input[name="outputType"]:checked')?.value,
    });
    renderAiOutput(draft);
    renderGeneratedArticleInspector(draft);
  });
}

function bindInspirationFragments() {
  document.querySelectorAll("[data-fragment-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const selected = !card.classList.contains("selected");
      card.classList.toggle("selected", selected);
      card.setAttribute("aria-pressed", String(selected));
    });
  });
}

function getSelectedFragmentIds() {
  return [...document.querySelectorAll("[data-fragment-id].selected")].map(
    (card) => card.dataset.fragmentId,
  );
}

function bindSemanticSearch() {
  const form = document.querySelector("#semanticSearchForm");
  const input = document.querySelector("#semanticSearchInput");
  const status = document.querySelector("#semanticSearchStatus");
  const voiceButton = document.querySelector("[data-voice-search]");
  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = resolveSemanticQuery(input.value, input.placeholder);
    if (!query) {
      renderFeed();
      if (status) status.textContent = "";
      return;
    }

    input.value = query;
    const results = semanticSearchNotes(query);
    renderFeed(results, { query });
    if (status) status.textContent = `AI 已找到 ${results.length} 篇相关笔记`;
  });

  voiceButton?.addEventListener("click", () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      if (status) status.textContent = "当前浏览器暂不支持语音输入，可以直接输入文字搜索。";
      input.focus();
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    if (status) status.textContent = "正在聆听语音搜索...";
    recognition.onresult = (event) => {
      input.value = event.results[0][0].transcript;
      form.requestSubmit();
    };
    recognition.onerror = () => {
      if (status) status.textContent = "语音识别失败，请换成文字搜索。";
    };
    recognition.start();
  });
}

function bindShopSearch() {
  const form = document.querySelector("#shopSearchForm");
  const input = document.querySelector("#shopSearchInput");
  const status = document.querySelector("#shopSearchStatus");
  const voiceButton = document.querySelector("[data-shop-voice-search]");
  const modeButtons = document.querySelectorAll("[data-shop-search-mode]");
  if (!form || !input) return;

  const setMode = (mode) => {
    activeShopSearchMode = mode === "item" ? "item" : "solution";
    modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.shopSearchMode === activeShopSearchMode);
    });
    if (status) {
      status.textContent =
        activeShopSearchMode === "item"
          ? "当前模式：搜单品，会展示不同品牌和 SKU。"
          : "当前模式：搜方案，会生成结构化购买方案。";
    }
  };

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setMode(button.dataset.shopSearchMode);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = resolveSemanticQuery(input.value, input.placeholder);
    if (!query) {
      renderShop();
      if (status) status.textContent = "";
      return;
    }

    input.value = query;
    if (activeShopSearchMode === "item") {
      const results = semanticSearchProducts(query);
      renderShopProductResults(results, query);
      if (status) status.textContent = `AI 已找到 ${results.length} 个相关单品 SKU`;
      return;
    }

    renderShopSolutionResults(buildShopSolution(query));
    if (status) status.textContent = "AI 已生成 1 套结构化商品方案";
  });

  voiceButton?.addEventListener("click", () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      if (status) status.textContent = "当前浏览器暂不支持语音输入，可以直接输入文字搜索。";
      input.focus();
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    if (status) status.textContent = "正在聆听商品搜索...";
    recognition.onresult = (event) => {
      input.value = event.results[0][0].transcript;
      form.requestSubmit();
    };
    recognition.onerror = () => {
      if (status) status.textContent = "语音识别失败，请换成文字搜索。";
    };
    recognition.start();
  });
}

const circleChats = {
  camping: {
    title: "北京周末露营局",
    messages: [
      ["小满", "周六怀柔营地还有两个车位，适合带小朋友。"],
      ["策策", "我想带餐具和小锅，顺便拍一篇露营做饭笔记。"],
      ["Nico", "求餐具链接，轻一点最好。"],
    ],
  },
  tesla: {
    title: "Model Y 车主生活",
    messages: [
      ["阿越", "后备箱露营收纳箱有没有不异响的推荐？"],
      ["策策", "我最近在看车内香氛和扶手箱补能方案。"],
      ["林小满", "车载小物最好能一手拿到，带娃很关键。"],
    ],
  },
  fitness: {
    title: "低压减脂搭子群",
    messages: [
      ["橙子", "今天先散步 30 分钟，不卷强度。"],
      ["策策", "我用轻食晚餐和居家运动拼了一篇图文。"],
      ["Mira", "想看低糖饮料和运动垫同款。"],
    ],
  },
};

function bindProfileDashboard() {
  document.querySelectorAll("[data-profile-subtab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.profileSubtab;
      document
        .querySelectorAll("[data-profile-subtab]")
        .forEach((item) => item.classList.toggle("active", item === button));
      document
        .querySelectorAll("[data-profile-panel]")
        .forEach((panel) => panel.classList.toggle("active", panel.dataset.profilePanel === target));
    });
  });

  document.querySelectorAll("[data-space-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.spaceTab;
      document
        .querySelectorAll("[data-space-tab]")
        .forEach((item) => item.classList.toggle("active", item === button));
      document
        .querySelectorAll("[data-space-panel]")
        .forEach((panel) => panel.classList.toggle("active", panel.dataset.spacePanel === target));
    });
  });

  document.querySelectorAll("[data-circle-room]").forEach((button) => {
    button.addEventListener("click", () => {
      const chat = circleChats[button.dataset.circleRoom];
      const container = document.querySelector("#circleChat");
      if (!chat || !container) return;

      document
        .querySelectorAll("[data-circle-room]")
        .forEach((item) => item.classList.toggle("active", item === button));
      container.innerHTML = `
        <div class="chat-title">${chat.title}</div>
        ${chat.messages.map(([name, text]) => `<p><strong>${name}：</strong>${text}</p>`).join("")}
      `;
    });
  });
}

function openImmersiveSceneFromUrl() {
  if (typeof window === "undefined") return;

  const sceneId = new URLSearchParams(window.location.search).get("immersive");
  if (!sceneId) return;

  const scene = demoScenes.find((item) => item.id === sceneId);
  if (scene) openImmersiveScene(scene);
}

function openSemanticSearchFromUrl() {
  if (typeof window === "undefined") return;

  const query = new URLSearchParams(window.location.search).get("search");
  if (!query) return;

  const input = document.querySelector("#semanticSearchInput");
  const status = document.querySelector("#semanticSearchStatus");
  const results = semanticSearchNotes(query);
  if (input) input.value = query;
  renderFeed(results, { query });
  if (status) status.textContent = `AI 已找到 ${results.length} 篇相关笔记`;
}

function openShopSearchFromUrl() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const query = params.get("shopSearch");
  if (!query) return;

  activateView("shop");
  activeShopSearchMode = params.get("shopSearchMode") === "item" ? "item" : "solution";
  document.querySelectorAll("[data-shop-search-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.shopSearchMode === activeShopSearchMode);
  });
  const input = document.querySelector("#shopSearchInput");
  const status = document.querySelector("#shopSearchStatus");
  if (input) input.value = query;
  if (activeShopSearchMode === "item") {
    const results = semanticSearchProducts(query);
    renderShopProductResults(results, query);
    if (status) status.textContent = `AI 已找到 ${results.length} 个相关单品 SKU`;
    return;
  }

  renderShopSolutionResults(buildShopSolution(query));
  if (status) status.textContent = "AI 已生成 1 套结构化商品方案";
}

function init() {
  bindAccessGate();
  renderFeed();
  bindNavigation();
  bindProductLinks();
  bindShopProducts();
  bindImmersiveBrowse();
  bindHardButtons();
  bindInspirationFragments();
  bindCreator();
  bindSemanticSearch();
  bindShopSearch();
  bindProfileDashboard();
  openSemanticSearchFromUrl();
  openShopSearchFromUrl();
  openImmersiveSceneFromUrl();
}

if (typeof document !== "undefined") {
  init();
}
