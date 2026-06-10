import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  demoScenes,
  generateAiDraft,
  generateContentFromFragments,
  getProductByName,
  getShopCategories,
  buildShopSolution,
  resolveSemanticQuery,
  semanticSearchNotes,
  semanticSearchProducts,
  validateAccessPassword,
} from "./script.js";

const here = dirname(fileURLToPath(import.meta.url));

test("demo covers the four required lifestyle scenes", () => {
  assert.deepEqual(
    demoScenes.map((scene) => scene.type),
    ["露营餐具", "桌搭", "EDC", "车空间"],
  );
});

test("legacy creator name is replaced with 亚杰", () => {
  assert.equal(demoScenes.some((scene) => scene.creator === "巫嘉 Gabi"), false);
  assert.ok(demoScenes.some((scene) => scene.creator === "亚杰"));
});

test("feed uses the uploaded 亚杰 avatar image", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.equal(existsSync(resolve(here, "assets/亚杰.png")), true);
  assert.match(script, /亚杰: "\.\/assets\/亚杰\.png"/);
  assert.match(script, /class="creator-avatar"/);
  assert.match(styles, /\.creator-avatar/);
});

test("feed uses the uploaded 邵琦 avatar image", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.equal(existsSync(resolve(here, "assets/邵琦.png")), true);
  assert.match(script, /邵琦: "\.\/assets\/邵琦\.png"/);
});

test("feed uses the uploaded Gabi avatar image", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.equal(existsSync(resolve(here, "assets/Gabi.jpeg")), true);
  assert.match(script, /Gabi: "\.\/assets\/Gabi\.jpeg"/);
});

test("feed uses the uploaded 王策 avatar image", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.equal(existsSync(resolve(here, "assets/策策1.jpeg")), true);
  assert.match(script, /王策: "\.\/assets\/策策1\.jpeg"/);
});

test("homepage scene images use local Feishu document assets", () => {
  for (const scene of demoScenes) {
    assert.match(scene.image, /^\.\/assets\/(?:scene-(desk|edc)|做饭)\.png$|^\.\/assets\/社区页面车图片\.jpeg$/);
    assert.equal(existsSync(resolve(here, scene.image)), true);
  }
});

test("fourth community card uses the local car interior image and matching copy", () => {
  const carInteriorScene = demoScenes[3];
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.equal(carInteriorScene.image, "./assets/社区页面车图片.jpeg");
  assert.equal(existsSync(resolve(here, "assets/社区页面车图片.jpeg")), true);
  assert.equal(carInteriorScene.type, "车空间");
  assert.equal(carInteriorScene.scenario, "日常通勤");
  assert.equal(carInteriorScene.title, "我的通勤车内小宇宙");
  assert.deepEqual(carInteriorScene.tags, ["车内收纳", "通勤舒适", "氛围感"]);
  assert.deepEqual(carInteriorScene.products, ["车内手机支架", "车载香氛", "车载纸巾盒", "车载水杯"]);
  assert.match(script, /方向盘套让驾驶触感更稳定/);
  assert.match(script, /手机支架、香薰和纸巾盒这些高频物件/);
});

test("first feed scene uses the requested camping tableware note image", () => {
  const carScene = demoScenes.find((scene) => scene.id === "car");

  assert.equal(existsSync(resolve(here, "assets/做饭.png")), true);
  assert.equal(carScene.image, "./assets/做饭.png");
});

test("first feed scene uses the requested camping tableware note title", () => {
  const carScene = demoScenes.find((scene) => scene.id === "car");

  assert.equal(carScene.title, "我的露营餐具分享");
});

test("html cache-busts the app module script", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  assert.match(html, /src="\.\/script\.js\?v=\d+"/);
});

test("left navigation does not include an orphan AI task metric panel", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.doesNotMatch(html, /class="signal-panel"/);
  assert.doesNotMatch(html, /今日 AI 任务/);
  assert.doesNotMatch(html, />128</);
  assert.doesNotMatch(styles, /\.signal-panel/);
});

test("page requires a configurable password before showing the app", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.match(html, /<body class="auth-locked">/);
  assert.match(html, /id="accessGate"/);
  assert.match(html, /id="accessPassword"/);
  assert.match(html, /type="password"/);
  assert.match(styles, /body\.auth-locked \.app-shell/);
  assert.match(styles, /\.access-gate/);
  assert.match(script, /const ACCESS_PASSWORD = "lifeos-demo"/);
  assert.match(script, /function bindAccessGate/);
  assert.equal(validateAccessPassword("lifeos-demo"), true);
  assert.equal(validateAccessPassword("wrong"), false);
});

test("ai draft creates shoppable annotations and share-ready content", () => {
  const draft = generateAiDraft({
    sceneType: "车搭",
    prompt: "周末自驾去露营，车里有手机支架、车把手挂钩和应急电源。",
  });

  assert.ok(draft.hotspots.length >= 3);
  assert.ok(draft.hotspots.every((item) => item.productUrl.startsWith("#shop-")));
  assert.equal(draft.storyboard.length, 4);
  assert.match(draft.socialCopy.xiaohongshu, /车搭|自驾|露营/);
});

test("each scene hotspot exposes review copy and a shoppable product target", () => {
  for (const scene of demoScenes) {
    for (const hotspot of scene.hotspots) {
      assert.ok(hotspot.product);
      assert.ok(hotspot.review.length >= 12);
      assert.equal(hotspot.productUrl, `#shop-${encodeURIComponent(hotspot.product)}`);
      assert.equal(getProductByName(hotspot.product).name, hotspot.product);
    }
  }
});

test("feed cards rely on hotspots instead of green product word strips", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  assert.doesNotMatch(script, /product-strip/);
});

test("feed cards do not render product hotspots, inspector still does", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  assert.doesNotMatch(script, /function renderFeed\(\)[\s\S]*scene\.hotspots[\s\S]*function renderThumbIcon/);
  assert.match(script, /function renderInspector\(scene\)[\s\S]*scene\.hotspots/);
});

test("feed cards do not show the AI radar scanning badge", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  assert.doesNotMatch(
    script,
    /function renderFeed\(\)[\s\S]*AI 商品雷达扫描中[\s\S]*function renderThumbIcon/,
  );
});

test("car feed card adds three white product labels without hotspots", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  const carScene = demoScenes.find((scene) => scene.id === "car");

  assert.equal(carScene.feedLabels.length, 3);
  assert.deepEqual(
    carScene.feedLabels.map((label) => label.text),
    ["儿童餐具套装", "折叠锅具", "调料收纳盒"],
  );
  assert.match(script, /class="feed-label"/);
  assert.match(styles, /\.feed-label/);
  assert.doesNotMatch(script, /class="feed-label hotspot"/);
});

test("inspector preview includes the AI radar scanning badge", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  assert.match(script, /class="scan-badge inspector-scan-badge"/);
  assert.match(styles, /\.inspector-scan-badge/);
});

test("inspector product links open an in-panel detail page with back control", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(script, /function renderProductDetail\(productName\)/);
  assert.match(script, /data-inspector-back/);
  assert.match(script, /renderProductDetail\(link\.dataset\.productLink\)/);
  assert.doesNotMatch(script, /activateView\("shop"\)[\s\S]*target\.scrollIntoView/);
  assert.match(styles, /\.product-detail-shell/);
  assert.match(styles, /\.detail-cta/);
});

test("product detail highlights an AI whole-web review summary", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(script, /function buildAiReviewSummary\(productItem, scene, review\)/);
  assert.match(script, /AI 汇总 \$\{relatedCount\}\+ 条全网评价/);
  assert.match(script, /class="ai-review-summary"/);
  assert.match(script, /口碑偏正向/);
  assert.match(styles, /\.ai-review-summary/);
  assert.match(styles, /radial-gradient\(circle at 88% 8%/);
});

test("inspector renders shoppable links for scene products", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  const carScene = demoScenes.find((scene) => scene.id === "car");

  assert.deepEqual(carScene.products, ["便携餐具套装", "折叠锅具", "保温杯", "露营调料盒"]);
  assert.match(script, /function renderSceneProductLinks\(scene\)/);
  assert.match(script, /class="scene-product-link"/);
  assert.match(script, /data-product-link="\$\{name\}"/);
  assert.match(styles, /\.scene-product-links/);
  assert.match(styles, /\.scene-product-link/);
});

test("inspector replaces product notes with multi-user comments", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(script, /const sceneComments = {/);
  assert.match(script, /function renderSceneComments\(scene\)/);
  assert.match(script, /class="comment-stream"/);
  assert.match(script, /class="user-avatar"/);
  assert.match(script, /同款|使用体验/);
  assert.doesNotMatch(script, /class="inspector-list"/);
  assert.doesNotMatch(script, /AI 替代推荐/);
  assert.match(styles, /\.comment-stream/);
  assert.match(styles, /\.user-avatar/);
});

test("inspector comments include a pencil comment box", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(script, /class="comment-compose"/);
  assert.match(script, /class="pencil-icon" aria-hidden="true"/);
  assert.match(script, /留下你的看法吧～/);
  assert.match(styles, /\.comment-compose/);
  assert.match(styles, /\.pencil-icon/);
});

test("inspector expands left when focused by hover", () => {
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  assert.match(styles, /\.inspector\s*{[\s\S]*transition:/);
  assert.match(styles, /\.inspector:hover,\s*\.inspector:focus-within/);
  assert.match(styles, /opacity:\s*0\.68/);
  assert.match(styles, /margin-left:\s*-112px/);
  assert.match(styles, /width:\s*calc\(100% \+ 112px\)/);
  assert.match(styles, /\.inspector:hover,[\s\S]*opacity:\s*1/);
});

test("community has text and voice semantic search controls", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(html, /id="semanticSearchForm"/);
  assert.match(html, /id="semanticSearchInput"/);
  assert.match(html, /data-voice-search/);
  assert.match(script, /function bindSemanticSearch/);
  assert.match(script, /SpeechRecognition|webkitSpeechRecognition/);
  assert.match(styles, /\.semantic-search/);
});

test("initial page avoids eager shop rendering and decodes feed media asynchronously", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.doesNotMatch(script, /function init\(\) \{[\s\S]*renderShop\(\);[\s\S]*bindNavigation/);
  assert.match(script, /if \(viewId === "shop" && !shopRendered\) renderShop\(\)/);
  assert.match(script, /loading="\$\{index === 0 \? "eager" : "lazy"\}"/);
  assert.match(script, /decoding="async"/);
  assert.match(script, /fetchpriority="\$\{index === 0 \? "high" : "low"\}"/);
});

test("semantic search supports direct URL entry for browser verification", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.match(script, /function openSemanticSearchFromUrl/);
  assert.match(script, /new URLSearchParams\(window\.location\.search\)\.get\("search"\)/);
});

test("semantic search uses the visible placeholder query when the input is empty", () => {
  assert.equal(
    resolveSemanticQuery("", "帮我寻找带5岁孩子去露营的商品方案"),
    "帮我寻找带5岁孩子去露营的商品方案",
  );
  assert.equal(resolveSemanticQuery("   桌搭屏幕灯   ", "默认词"), "桌搭屏幕灯");
});

test("semantic search understands family camping product intent", () => {
  const results = semanticSearchNotes("帮我寻找带5岁孩子去露营的商品方案");

  assert.ok(results.length >= 3);
  assert.match(results[0].title, /孩子|亲子|露营/);
  assert.ok(results[0].tags.some((tag) => /儿童|亲子|露营/.test(tag)));
  assert.ok(results[0].products.some((product) => /应急|收纳|手机支架|香氛/.test(product)));
});

test("family camping car search note uses the requested camping tableware title", () => {
  const results = semanticSearchNotes("帮我寻找带5岁孩子去露营的商品方案");

  assert.equal(results[0].id, "search-family-camping-car");
  assert.equal(results[0].title, "我的露营餐具分享");
});

test("family camping car search note uses the cooking image", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const imagePath = "assets/做饭.png";

  assert.equal(existsSync(resolve(here, imagePath)), true);
  assert.match(script, /id: "search-family-camping-car"[\s\S]*image: "\.\/assets\/做饭\.png"/);
});

test("family camping room search note uses a dedicated matching image", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const imagePath = "assets/scene-family-camp-lounge.png";

  assert.equal(existsSync(resolve(here, imagePath)), true);
  assert.match(script, /id: "search-family-camping-room"[\s\S]*image: "\.\/assets\/scene-family-camp-lounge\.png"/);
});

test("family camping EDC search note uses the toy image", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const imagePath = "assets/玩具.png";

  assert.equal(existsSync(resolve(here, imagePath)), true);
  assert.match(script, /id: "search-family-camping-edc"[\s\S]*image: "\.\/assets\/玩具\.png"/);
});

test("main stage does not render the removed hero topbar", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  assert.doesNotMatch(html, /class="topbar"/);
  assert.doesNotMatch(html, /开始 AI 创作/);
});

test("feed comment buttons include a trailing comment icon", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  assert.match(script, /评论 <span class="comment-count">/);
  assert.match(script, /class="comment-icon" aria-hidden="true"/);
  assert.match(script, /function getCommentCount\(scene, index\)/);
});

test("feed hard buttons include a toggleable thumb icon", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  assert.match(script, /class="hard-button"/);
  assert.match(script, /aria-pressed="false"/);
  assert.match(script, /class="thumb-icon" aria-hidden="true"/);
  assert.match(script, /hardButton\.classList\.toggle\("liked", liked\)/);
  assert.match(styles, /\.hard-button\.liked \.thumb-icon/);
});

test("profile renders the five requested personal modules", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(html, /我的内容/);
  assert.match(html, /我的发布/);
  assert.match(html, /我的收藏/);
  assert.match(html, /我的带货/);
  assert.match(html, /我的圈子/);
  assert.match(html, /我的订单/);
  assert.match(html, /我的空间/);
  assert.match(html, /带货成功/);
  assert.match(html, /现金收益/);
  assert.match(html, /data-circle-room="camping"/);
  assert.match(html, /id="circleChat"/);
  assert.match(html, /data-space-tab="home"/);
  assert.match(html, /data-space-tab="car"/);
  assert.match(html, /data-space-tab="desk"/);
  assert.match(script, /function bindProfileDashboard\(\)/);
  assert.match(script, /const circleChats = {/);
  assert.match(styles, /\.profile-dashboard/);
  assert.match(styles, /\.circle-chat/);
  assert.match(styles, /\.space-board/);
  assert.match(styles, /\.profile-space-panel \.space-board/);
  assert.match(styles, /aspect-ratio:\s*3 \/ 2/);
  assert.match(styles, /background-size:\s*cover,\s*cover/);
  assert.doesNotMatch(html, /id="profileDetail"/);
  assert.doesNotMatch(html, /AI CONTENT MEMORY/i);
  assert.doesNotMatch(html, /生成下一篇内容脚本/);
});

test("car space acts as an AI travel scenario decision board", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(html, /data-car-space-scenario="camping"/);
  assert.match(html, /data-car-space-scenario="commute"/);
  assert.match(html, /data-car-space-scenario="roadtrip"/);
  assert.match(html, /data-car-space-output/);
  assert.match(script, /const carSpaceScenarios = {/);
  assert.match(script, /亲子露营车空间诊断/);
  assert.match(script, /补齐这个场景/);
  assert.match(script, /换成更便宜的/);
  assert.match(script, /生成同款内容/);
  assert.match(script, /function renderCarSpaceScenario\(scenarioId\)/);
  assert.match(script, /data-car-hotspot/);
  assert.match(script, /data-car-action/);
  assert.match(styles, /\.car-scenario-switch/);
  assert.match(styles, /\.car-ai-diagnosis/);
  assert.match(styles, /\.car-decision-actions/);
});

test("car space supports direct URL entry into a scenario", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.match(script, /function openProfileSpaceFromUrl\(\)/);
  assert.match(script, /params\.get\("space"\)/);
  assert.match(script, /params\.get\("carScenario"\)/);
  assert.match(script, /renderCarSpaceScenario\(carScenario\)/);
  assert.match(script, /openProfileSpaceFromUrl\(\)/);
});

test("car space image hotspots do not show persistent text over the image", () => {
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(styles, /\.car-hotspot\s*{[\s\S]*width:\s*34px[\s\S]*height:\s*34px/);
  assert.match(styles, /\.car-hotspot span\s*{[\s\S]*clip:\s*rect\(0 0 0 0\)/);
  assert.match(styles, /\.car-hotspot::after\s*{[\s\S]*content:\s*"AI"/);
});

test("car space board is constrained away from the diagnosis panel", () => {
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(styles, /\.car-space-workbench\s*{[\s\S]*overflow:\s*hidden/);
  assert.match(styles, /\.car-space-board\s*{[\s\S]*width:\s*100%[\s\S]*max-width:\s*100%[\s\S]*aspect-ratio:\s*auto/);
  assert.match(styles, /\.car-ai-diagnosis\s*{[\s\S]*position:\s*relative[\s\S]*z-index:\s*3/);
});

test("profile hero uses 策策 as the creator name", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  assert.match(html, /策策的智能生活方式档案/);
  assert.doesNotMatch(html, /Gabi的智能生活方式档案/);
});

test("profile hero includes AI summarized Gabi persona memory", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(html, /class="persona-memory"/);
  assert.match(html, /90 后大厂产品经理/);
  assert.match(html, /特斯拉 Model Y/);
  assert.match(html, /露营 Vlog/);
  assert.match(html, /低度果酒/);
  assert.match(html, /闺蜜结伴出行/);
  assert.match(html, /🏕️|🚗|🍹|💬/);
  assert.match(styles, /\.persona-memory/);
  assert.match(styles, /\.persona-chip/);
});

test("profile hero uses the Gabi avatar image", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  assert.equal(existsSync(resolve(here, "assets/Gabi.jpeg")), true);
  assert.match(html, /<img src="\.\/assets\/Gabi\.jpeg" alt="策策头像" \/>/);
  assert.match(styles, /\.avatar img/);
  assert.doesNotMatch(html, /<div class="avatar">G<\/div>/);
});

test("studio page has selectable multimodal inspiration fragments", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(html, /id="inspirationGrid"/);
  assert.match(html, /data-fragment-id="weight-text"/);
  assert.match(html, /data-fragment-id="salad-image"/);
  assert.match(html, /data-fragment-id="workout-video"/);
  assert.match(html, /data-fragment-id="voice-note"/);
  assert.match(html, /name="outputType"[\s\S]*value="图文"/);
  assert.match(html, /name="outputType"[\s\S]*value="视频"/);
  assert.match(html, /我的一周减脂生活/);
  assert.match(styles, /\.inspiration-grid/);
  assert.match(styles, /\.fragment-card\.selected/);
});

test("studio inspiration media fragments use concrete salad, workout and voice visuals", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.equal(existsSync(resolve(here, "assets/fragment-salad.svg")), true);
  assert.equal(existsSync(resolve(here, "assets/fragment-workout-cover.svg")), true);
  assert.match(html, /src="\.\/assets\/fragment-salad\.svg"/);
  assert.match(html, /alt="轻食沙拉晚餐图片"/);
  assert.match(html, /src="\.\/assets\/fragment-workout-cover\.svg"/);
  assert.match(html, /alt="女生居家运动视频封面"/);
  assert.match(html, /class="video-play-icon" aria-hidden="true"/);
  assert.match(html, /class="voice-icon" aria-hidden="true"/);
  assert.match(styles, /\.fragment-cover/);
  assert.match(styles, /\.video-play-icon::before/);
  assert.match(styles, /\.voice-icon span/);
});

test("studio AI combines selected fragments into publishable content with shoppable links", () => {
  const draft = generateContentFromFragments({
    fragmentIds: ["weight-text", "salad-image", "workout-video"],
    theme: "我的一周减脂生活",
    outputType: "图文",
  });

  assert.equal(draft.outputType, "图文");
  assert.match(draft.title, /我的一周减脂生活/);
  assert.equal(draft.selectedFragments.length, 3);
  assert.match(draft.publishCopy, /20260501|减重1kg|轻食沙拉|在家运动/);
  assert.ok(draft.productHotspots.length >= 3);
  assert.ok(draft.productHotspots.every((item) => item.productUrl.startsWith("#shop-")));
  assert.ok(draft.productHotspots.every((item) => getProductByName(item.product)));
  assert.ok(draft.editableLinks.every((item) => item.url.startsWith("#shop-")));
});

test("studio generated draft includes a real publishable image-text article", () => {
  const draft = generateContentFromFragments({
    fragmentIds: ["weight-text", "salad-image", "workout-video"],
    theme: "我的一周减脂生活",
    outputType: "图文",
  });

  assert.match(draft.article.title, /我的一周减脂生活/);
  assert.ok(draft.article.sections.length >= 3);
  assert.match(
    draft.article.sections.map((section) => `${section.title} ${section.text}`).join(" "),
    /减重1kg|轻食沙拉|居家运动/,
  );
  assert.ok(draft.article.hashtags.includes("#减脂生活"));
});

test("studio video generation uses the supplied generated video asset", () => {
  const draft = generateContentFromFragments({
    fragmentIds: ["weight-text", "salad-image", "workout-video"],
    theme: "我的一周减脂生活",
    outputType: "视频",
  });

  assert.equal(existsSync(resolve(here, "assets/generated-fat-loss-video.mp4")), true);
  assert.equal(draft.outputType, "视频");
  assert.equal(draft.generatedVideo.src, "./assets/generated-fat-loss-video.mp4");
  assert.match(draft.generatedVideo.title, /我的一周减脂生活/);
});

test("studio output renders hotspots, editable link fields and user copy editor", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(script, /class="publish-preview"/);
  assert.match(script, /class="publish-hotspot"/);
  assert.match(script, /class="link-editor"/);
  assert.match(script, /用户补充描述/);
  assert.match(styles, /\.publish-preview/);
  assert.match(styles, /\.publish-hotspot/);
  assert.match(styles, /\.link-editor/);
});

test("studio generation renders the article in the right inspector", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(script, /function renderGeneratedArticleInspector\(draft\)/);
  assert.match(script, /renderGeneratedArticleInspector\(draft\)/);
  assert.match(script, /class="generated-article"/);
  assert.match(script, /class="generated-article-cover"/);
  assert.match(script, /class="generated-post-hotspot"/);
  assert.match(script, /class="generated-publish-actions"/);
  assert.match(script, />发布</);
  assert.match(script, />存草稿</);
  assert.match(script, />分享到其他平台</);
  assert.match(script, /我的一周减脂生活/);
  assert.match(styles, /\.generated-article/);
  assert.match(styles, /\.generated-article-cover/);
  assert.match(styles, /\.generated-post-section/);
  assert.match(styles, /\.generated-publish-actions/);
});

test("studio video generation renders real video players in preview and inspector", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(script, /class="generated-video-preview"/);
  assert.match(script, /class="generated-video-player"/);
  assert.match(script, /controls/);
  assert.match(script, /generatedVideo\.src/);
  assert.match(styles, /\.generated-video-preview/);
  assert.match(styles, /\.generated-video-player/);
});

test("studio video generation does not overlay product hotspots on the video", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.match(script, /function renderPublishHotspots\(draft\)/);
  assert.match(script, /function renderGeneratedArticleHotspots\(draft\)/);
  assert.match(script, /if \(draft\.generatedVideo\) return "";/);
});

test("immersive browse opens a movable 3D scene space", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  assert.match(html, /id="immersiveOverlay"/);
  assert.match(script, /data-immersive-button/);
  assert.match(script, /function openImmersiveScene/);
  assert.match(script, /function moveImmersiveCamera/);
  assert.match(script, /data-move="forward"/);
  assert.match(script, /data-turn="left"/);
  assert.match(styles, /\.immersive-overlay\.active/);
  assert.match(styles, /transform-style: preserve-3d/);
});

test("immersive scene uses a first-person wraparound space", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  assert.match(script, /class="space-panorama"/);
  assert.match(script, /class="space-panel space-panel-left"/);
  assert.match(script, /class="space-reticle"/);
  assert.match(script, /class="space-near-vignette"/);
  assert.match(styles, /\.space-panel-left/);
  assert.match(styles, /\.space-reticle/);
  assert.match(styles, /min-height: min\(760px, calc\(100vh - 156px\)\)/);
});

test("immersive scene supports direct entry for browser verification", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  assert.match(script, /function openImmersiveSceneFromUrl/);
  assert.match(script, /new URLSearchParams\(window\.location\.search\)\.get\("immersive"\)/);
});

test("desk immersive browse uses the lightweight image space instead of desk glb", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const deskScene = demoScenes.find((scene) => scene.id === "desk");

  assert.equal(deskScene?.model, undefined);
  assert.doesNotMatch(html, /model-viewer/);
  assert.doesNotMatch(script, /<model-viewer/);
  assert.doesNotMatch(script, /scene\.model/);
});

test("cooking immersive browse plays the uploaded cooking video", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");
  const carScene = demoScenes.find((scene) => scene.id === "car");

  assert.equal(existsSync(resolve(here, "assets/做饭视频.mp4")), true);
  assert.equal(carScene?.immersiveVideo, "./assets/做饭视频.mp4");
  assert.match(script, /class="immersive-video-player"/);
  assert.match(script, /data-immersive-video/);
  assert.match(script, /world\.querySelector\("\[data-immersive-video\]"\)\?\.play\(\)\.catch/);
  assert.match(styles, /\.immersive-video-stage/);
  assert.match(styles, /\.immersive-video-player/);
});

test("shop categories align with the product loop", () => {
  assert.deepEqual(
    getShopCategories().map((category) => category.name),
    ["车载必备", "智能家居", "出行装备", "生活分享"],
  );
});

test("shop supports text and voice semantic product search", () => {
  const html = readFileSync(resolve(here, "index.html"), "utf8");
  const script = readFileSync(resolve(here, "script.js"), "utf8");
  const styles = readFileSync(resolve(here, "styles.css"), "utf8");

  assert.match(html, /id="shopSearchForm"/);
  assert.match(html, /id="shopSearchInput"/);
  assert.match(html, /data-shop-search-mode="solution"/);
  assert.match(html, /data-shop-search-mode="item"/);
  assert.match(html, /data-shop-voice-search/);
  assert.match(script, /function bindShopSearch\(\)/);
  assert.match(script, /activeShopSearchMode === "item"/);
  assert.match(script, /semanticSearchProducts\(query\)/);
  assert.match(script, /buildShopSolution\(query\)/);
  assert.match(script, /function renderShopSolutionResults\(solution\)/);
  assert.match(script, /function openShopSearchFromUrl\(\)/);
  assert.match(script, /const params = new URLSearchParams\(window\.location\.search\)/);
  assert.match(script, /params\.get\("shopSearch"\)/);
  assert.match(script, /params\.get\("shopSearchMode"\) === "item"/);
  assert.match(styles, /\.shop-search-mode/);
  assert.match(styles, /\.shop-search-summary/);
  assert.match(styles, /\.shop-solution-panel/);
  assert.match(styles, /\.shop-result-grid/);
});

test("shop semantic search returns relevant products for family camping", () => {
  const results = semanticSearchProducts("帮我寻找带5岁孩子去露营的商品方案");
  const names = results.map((item) => item.name);

  assert.ok(results.length >= 4);
  assert.ok(names.includes("应急电源"));
  assert.ok(names.includes("车内手机支架"));
  assert.ok(names.includes("车把手挂钩"));
  assert.ok(results.every((item) => item.category));
});

test("shop solution search builds structured family camping purchase plans", () => {
  const solution = buildShopSolution("帮我寻找带5岁孩子去露营的商品方案");

  assert.equal(solution.title, "亲子露营一站式购买方案");
  assert.deepEqual(solution.sceneTags, ["亲子", "安全", "收纳", "补能", "做饭"]);
  assert.ok(solution.understanding.includes("安全边界"));
  assert.ok(solution.essentials.some((item) => item.name === "便携餐具套装"));
  assert.ok(solution.essentials.some((item) => item.name === "折叠锅具"));
  assert.deepEqual(
    solution.bundles.map((bundle) => bundle.name),
    ["预算版", "品质版", "轻量版"],
  );
  assert.ok(solution.bundles.every((bundle) => bundle.products.length >= 2));
});

test("shop product cards open product detail in the right inspector", () => {
  const script = readFileSync(resolve(here, "script.js"), "utf8");

  assert.match(script, /data-shop-product="\$\{item\.name\}"/);
  assert.match(script, /function bindShopProducts\(\)/);
  assert.match(script, /renderProductDetail\(productCard\.dataset\.shopProduct\)/);
  assert.match(script, /bindShopProducts\(\)/);
});
