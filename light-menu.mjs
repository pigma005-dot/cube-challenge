// client/guided-menu.mjs
function guidedMenu({ el, text, read, preview, game, resultEntry = false, resultOnly = false }) {
  let ranked = preview, selected = "daily", returnFocus = null, startButton;
  const names = { normal: text("\u30CE\u30FC\u30DE\u30EB", "Normal"), daily: text("\u304D\u3087\u3046\u306E\u30C1\u30E3\u30EC\u30F3\u30B8", "Daily Challenge"), endless: text("\u7121\u9650\u30E2\u30FC\u30C9", "Endless") };
  el.classList.add("guided");
  el.addEventListener("keydown", (e) => {
    if (e.target.closest("input,select,textarea,dialog")) e.stopPropagation();
  });
  el.innerHTML = `<div class="play-choice" role="group" aria-label="${text("\u904A\u3073\u65B9", "Play style")}">
    <button id="play-casual" aria-pressed="true">${text("\u6C17\u8EFD\u306B\u904A\u3076", "Just play")}<small>${text("\u767B\u9332\u306A\u3057", "No registration")}</small></button>
    <button id="play-ranked" aria-pressed="false">${text("\u30E9\u30F3\u30AD\u30F3\u30B0\u306B\u6311\u6226", "Play ranked")}<small>${text("\u540D\u524D\u3068\u30B9\u30B3\u30A2\u3092\u516C\u958B", "Share name & score")}</small></button></div>
    <p id="play-explain"></p><p id="rank-availability" role="status"></p>
    <button id="rank-status-refresh" class="quiet">${text("\u53D7\u4ED8\u72B6\u6CC1\u3092\u518D\u78BA\u8A8D", "Check availability")}</button>
    <div id="rank-recovery"><button id="trial-export" class="quiet">${text("\u30D7\u30EC\u30A4\u30C7\u30FC\u30BF\u3092\u4FDD\u5B58", "Export replay")}</button></div>
    <div id="play-modes"></div>
    <div id="extras-entry"></div>
    <button id="open-leaderboard" class="board-link">\u{1F3C6} ${text("\u307F\u3093\u306A\u306E\u30E9\u30F3\u30AD\u30F3\u30B0\u3092\u898B\u308B", "View leaderboard")} <span aria-hidden="true">\u2192</span></button>
    <p class="menu-small">${text("\u898B\u308B\u3060\u3051\u306A\u3089\u767B\u9332\u4E0D\u8981\u3067\u3059\u3002", "No registration needed to browse.")}</p>
    <dialog id="rank-entry" aria-labelledby="rank-entry-title"><div class="sheet">
      <button class="sheet-close" data-close aria-label="${text("\u9589\u3058\u308B", "Close")}">\xD7</button>
      <p class="eyebrow">${text("\u30E9\u30F3\u30AD\u30F3\u30B0\u306B\u6311\u6226", "RANKED PLAY")}</p><h2 id="rank-entry-title"></h2>
      <p id="rank-mode-rule"></p><p class="menu-small">${text("\u30E1\u30FC\u30EB\u30FB\u30D1\u30B9\u30EF\u30FC\u30C9\u4E0D\u8981\u3002\u7D42\u4E86\u5F8C\u306B\u8A18\u9332\u3092\u767B\u9332\u3057\u307E\u3059\u3002", "No email or password. Your result is registered after the game.")}</p>
      <label class="name-label" for="public-rank-name">${text("\u30E9\u30F3\u30AD\u30F3\u30B0\u306B\u8868\u793A\u3059\u308B\u540D\u524D", "Leaderboard name")}</label>
      <input id="public-rank-name" maxlength="12" autocomplete="nickname" placeholder="${text("\u4F8B\uFF1A\u3068\u3046\u3075\u8077\u4EBA", "e.g. Cube painter")}" aria-describedby="rank-name-help trial-summary">
      <p id="rank-name-help" class="menu-small">${text("12\u6587\u5B57\u307E\u3067\u3002\u672C\u540D\u3067\u306A\u304F\u3066\u5927\u4E08\u592B\u3067\u3059\u3002", "Up to 12 characters. A nickname is fine.")}</p>
      <label class="consent-row"><input type="checkbox" id="public-rank-consent"><span>${text("\u63CF\u3044\u305F\u7DDA\u30FB\u5F97\u70B9\u30FB\u533F\u540DID\u306E\u4FDD\u5B58\u3068\u3001\u540D\u524D\u30FB\u5F97\u70B9\u30FB\u5165\u529B\u65B9\u6CD5\u306E\u516C\u958B\u306B\u540C\u610F\u3057\u307E\u3059\u3002", "I agree to store drawings, scores and anonymous ID, and publish my name, score and input method.")}</span></label>
      <details class="data-details"><summary>${text("\u4FDD\u5B58\u5185\u5BB9\u3068\u53C2\u52A0\u56DE\u6570\u306B\u3064\u3044\u3066", "Data and attempts")}</summary><p>${text("\u7DDA\u306E\u5EA7\u6A19\u306F\u4FDD\u5B58\u304B\u30897\u65E5\u7D4C\u904E\u5F8C\u3001\u30D7\u30EC\u30A4\u306E\u53D7\u4ED8\u671F\u9650\u304C\u5207\u308C\u305F\u3082\u306E\u3092\u5B9A\u671F\u524A\u9664\u3057\u307E\u3059\u3002\u5F97\u70B9\u3068\u540D\u524D\u306A\u3069\u306F\u5225\u9014\u4FDD\u6301\u3057\u307E\u3059\u3002\u533F\u540DID\u306F\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u30FC\u306B\u4FDD\u5B58\u3057\u3001\u5225\u7AEF\u672B\u3078\u306E\u5F15\u304D\u7D99\u304E\u306F\u3067\u304D\u307E\u305B\u3093\u3002", "Stroke coordinates are periodically deleted after 7 days once the run expires. Scores, names and other records are kept separately. Your anonymous identity is stored in this browser and does not transfer to another device.")}</p><a href="./ranking-privacy.html" target="_blank" rel="noopener">${text("\u30C7\u30FC\u30BF\u53D6\u308A\u6271\u3044\u306E\u8A73\u7D30", "Full data policy")}</a></details>
      <p id="trial-summary" role="status"></p>
      <button id="rank-entry-start" data-trial="daily" class="primary">${text("\u540C\u610F\u3057\u3066\u306F\u3058\u3081\u308B", "Agree & start")}</button>
      <button id="rank-entry-casual" class="quiet">${text("\u767B\u9332\u305B\u305A\u306B\u904A\u3076", "Play without registration")}</button>
    </div></dialog>
    <dialog id="leaderboard-sheet" aria-labelledby="board-title"><div class="sheet">
      <button class="sheet-close" data-close aria-label="${text("\u9589\u3058\u308B", "Close")}">\xD7</button>
      <p class="eyebrow">DAILY LEADERBOARD</p><h2 id="board-title">${text("\u304D\u3087\u3046\u306E\u30C1\u30E3\u30EC\u30F3\u30B8", "Daily Challenge")}</h2>
      <p class="menu-small">${text("\u4E0A\u4F4D50\u4EF6\u30FB1\u4EBA\u306B\u3064\u304D\u81EA\u5DF1\u30D9\u30B9\u30C81\u4EF6\u3002", "Top 50 \xB7 one best result per identity.")}</p>
      <div class="board-actions"><select id="verified-kind" hidden aria-label="${text("\u30E2\u30FC\u30C9", "Mode")}"><option value="daily">${names.daily}</option></select><button id="verified-load">${text("\u66F4\u65B0", "Refresh")}</button></div>
      <div id="verified-board" aria-live="polite"></div>
    </div></dialog>`;
  const entry = el.querySelector("#rank-entry"), board = el.querySelector("#leaderboard-sheet");
  startButton = el.querySelector("#rank-entry-start");
  function close(d) {
    d.close();
    returnFocus?.focus();
  }
  for (const d of [entry, board]) {
    d.querySelector("[data-close]").onclick = () => close(d);
    d.addEventListener("click", (e) => {
      if (e.target === d) close(d);
    });
    d.addEventListener("cancel", () => queueMicrotask(() => returnFocus?.focus()));
  }
  function open(d) {
    returnFocus = document.activeElement;
    if (!d.open) d.showModal();
    d.scrollTop = 0;
  }
  const availability = el.querySelector("#rank-availability"), refresh = el.querySelector("#rank-status-refresh");
  let generation = 0;
  async function check() {
    if (preview) {
      availability.textContent = text("\u4F5C\u8005\u9650\u5B9A\u30C6\u30B9\u30C8\uFF1A\u8A18\u9332\u306F\u516C\u958B\u3055\u308C\u307E\u305B\u3093\u3002", "Private author test: results are not public.");
      refresh.hidden = true;
      return;
    }
    const gen = ++generation;
    refresh.disabled = true;
    availability.textContent = text("\u30E9\u30F3\u30AD\u30F3\u30B0\u306E\u53D7\u4ED8\u72B6\u6CC1\u3092\u78BA\u8A8D\u4E2D\u2026", "Checking ranked-play availability\u2026");
    try {
      const s = await read("status");
      if (gen !== generation) return;
      availability.textContent = s.enabled === true ? text("\u30E9\u30F3\u30AD\u30F3\u30B0\u53D7\u4ED8\u4E2D", "Ranked play is open") : text("\u30E9\u30F3\u30AD\u30F3\u30B0\u306F\u6E96\u5099\u4E2D\u3067\u3059\u3002\u300C\u6C17\u8EFD\u306B\u904A\u3076\u300D\u306F\u4ECA\u3059\u3050\u904A\u3079\u307E\u3059\u3002", "Ranked play is paused. Just play is available now.");
      availability.dataset.state = s.enabled === true ? "open" : "paused";
    } catch {
      availability.textContent = text("\u53D7\u4ED8\u72B6\u6CC1\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002\u767B\u9332\u306A\u3057\u3067\u3082\u904A\u3079\u307E\u3059\u3002", "Cannot check availability. You can still play without registration.");
      availability.dataset.state = "unknown";
    } finally {
      if (gen === generation) refresh.disabled = false;
    }
  }
  refresh.onclick = check;
  function choose(value) {
    ranked = value;
    el.dataset.ranked = String(value);
    el.querySelector("#play-casual").setAttribute("aria-pressed", String(!value));
    el.querySelector("#play-ranked").setAttribute("aria-pressed", String(value));
    el.querySelector("#play-explain").textContent = value ? resultEntry ? text("\u4ECA\u65E5\u306E\u304A\u984C\u3092\u904A\u3073\u3001\u6210\u7E3E\u3092\u898B\u3066\u304B\u3089\u63B2\u8F09\u3092\u9078\u3079\u307E\u3059\u3002\u30A2\u30AB\u30A6\u30F3\u30C8\u4F5C\u6210\u306F\u4E0D\u8981\u3067\u3059\u3002", "Play today\u2019s challenge, then choose whether to share your score. No account needed.") : text("\u30E9\u30F3\u30AD\u30F3\u30B0\u5BFE\u8C61\u306F\u300C\u304D\u3087\u3046\u306E\u30C1\u30E3\u30EC\u30F3\u30B8\u300D\u3060\u3051\u3002\u30CE\u30FC\u30DE\u30EB\u306F\u767B\u9332\u306A\u3057\u3067\u904A\u3079\u307E\u3059\u3002", "Only Daily Challenge is ranked. Normal remains unranked.") : text("\u540D\u524D\u306E\u5165\u529B\u306A\u3057\u3067\u3059\u3050\u904A\u3079\u307E\u3059\u3002\u8A18\u9332\u306F\u30E9\u30F3\u30AD\u30F3\u30B0\u306B\u306F\u8F09\u308A\u307E\u305B\u3093\u3002", "Start right away. These scores do not enter the leaderboard.");
    availability.hidden = !value && !preview;
    refresh.hidden = !value || preview;
    for (const b of el.querySelectorAll("[data-rank-kind]")) b.querySelector(".play-tag").textContent = value ? text("\u30E9\u30F3\u30AD\u30F3\u30B0\u306B\u6311\u6226 \u2192", "Play ranked \u2192") : text("\u904A\u3076 \u2192", "Play \u2192");
  }
  const grid = el.querySelector("#play-modes");
  const modes = [
    ["normal", document.querySelector('.modeBtn[data-mode="normal"]'), "\u{1F9CA}", text("\u306F\u3058\u3081\u3066\u306A\u3089\u3053\u308C", "START HERE"), text("\u7DF4\u7FD22\u554F\uFF0B\u672C\u756A6\u554F\u30021\u554F30\u79D2\u3002", "2 warm-ups + 6 scored rounds. 30 sec each.")],
    ["daily", document.querySelector("#btnDaily"), "\u{1F4C5}", text("\u307F\u3093\u306A\u3067\u540C\u3058\u304A\u984C", "SAME PUZZLES FOR EVERYONE"), text("\u6BCE\u65E5\u5909\u308F\u308B\u304A\u984C\u306B\u6311\u6226\u3002", "A new challenge every day.")],
    ["endless", document.querySelector('.modeBtn[data-mode="endless"]'), "\u267E\uFE0F", text("\u3069\u3053\u307E\u3067\u3044\u3051\u308B\uFF1F", "HOW FAR CAN YOU GO?"), text("\u5408\u683C\u3059\u308B\u3068\u6B21\u3078\u3002\u6700\u592726\u30E9\u30A6\u30F3\u30C9\u3002", "Pass to continue. Up to 26 rounds.")],
    ["study", document.querySelector('.modeBtn[data-mode="study"]'), "\u270F\uFE0F", text("\u3058\u3063\u304F\u308A\u7DF4\u7FD2", "TAKE YOUR TIME"), text("\u6642\u9593\u5236\u9650\u306A\u3057\u3002\u30E9\u30F3\u30AD\u30F3\u30B0\u5BFE\u8C61\u5916\u3002", "No timer. Always unranked.")]
  ];
  for (const [kind, b, icon, kicker, description] of modes) {
    if (!b) throw Error("Missing mode button: " + kind);
    const title = b.querySelector(".mn");
    title.textContent = icon + " " + (names[kind] || text("\u308C\u3093\u3057\u3085\u3046", "Practice"));
    let desc = b.querySelector(".md");
    if (!desc) {
      desc = document.createElement("span");
      desc.className = "md";
      title.after(desc);
    }
    desc.textContent = description;
    const kick = document.createElement("span");
    kick.className = "mode-kicker";
    kick.textContent = kicker;
    title.before(kick);
    const tag = document.createElement("span");
    tag.className = "play-tag";
    tag.textContent = kind === "study" ? text("\u7DF4\u7FD2\u3059\u308B \u2192", "Practice \u2192") : kind === "daily" ? "" : text("\u767B\u9332\u306A\u3057\u3067\u904A\u3076 \u2192", "Play unranked \u2192");
    b.append(tag);
    if (kind === "daily") b.dataset.rankKind = kind;
    b.addEventListener("click", (e) => {
      if (resultOnly) return;
      if (kind === "daily") game.rankIntent?.(ranked);
      if (kind !== "daily" || !ranked) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!preview && availability.dataset.state === "paused") {
        availability.tabIndex = -1;
        availability.focus();
        return;
      }
      if (resultEntry) {
        game.unranked(kind);
        return;
      }
      selected = kind;
      startButton.dataset.trial = kind;
      el.querySelector("#rank-entry-title").textContent = names[kind];
      el.querySelector("#rank-mode-rule").textContent = kind === "daily" ? text("1\u65E53\u56DE\u307E\u3067\u3002\u958B\u59CB\u6642\u306B1\u56DE\u6D88\u8CBB\u3057\u307E\u3059\u3002\u65E5\u672C\u6642\u95930\u6642\u306B\u30EA\u30BB\u30C3\u30C8\u3002", "3 starts per day. An attempt is used when you start. Resets at midnight Japan time.") : description;
      el.querySelector("#trial-summary").textContent = "";
      open(entry);
    }, true);
    if (kind === "daily" || kind === "normal") grid.append(b);
  }
  const extras = document.querySelector("#btnModes");
  extras.hidden = false;
  extras.querySelector(".mn").textContent = text("\u{1F3AE} \u304A\u307E\u3051\u30E2\u30FC\u30C9\u3092\u3048\u3089\u3076", "\u{1F3AE} Extra modes");
  el.querySelector("#extras-entry").append(extras);
  document.querySelector("#modePopTitle").textContent = text("\u{1F3AE} \u304A\u307E\u3051\u30E2\u30FC\u30C9", "\u{1F3AE} Extra modes");
  document.querySelector("#modePopup").classList.add("extra-modes");
  const maintenanceNote = document.querySelector("#rankMaintenanceNote");
  if (maintenanceNote) maintenanceNote.hidden = true;
  el.querySelector("#play-casual").onclick = () => choose(false);
  el.querySelector("#play-ranked").onclick = () => {
    choose(true);
    check();
  };
  el.querySelector("#rank-entry-casual").onclick = () => {
    close(entry);
    game.unranked(selected);
  };
  const openBoard = () => {
    el.querySelector("#verified-kind").value = "daily";
    open(board);
    el.querySelector("#verified-load").click();
  };
  el.querySelector("#open-leaderboard").onclick = () => openBoard();
  el.querySelector("#verified-kind").onchange = () => el.querySelector("#verified-load").click();
  try {
    el.querySelector("#public-rank-name").value = localStorage.getItem("cube-ranking-name-v2") || "";
  } catch {
  }
  choose(ranked);
  if (resultOnly) {
    for (const selector of [".play-choice", "#play-explain", "#rank-availability", "#rank-status-refresh"]) el.querySelector(selector).remove();
    el.querySelector(":scope > .menu-small").remove();
    for (const b of grid.querySelectorAll(".modeBtn")) b.querySelector(".play-tag").textContent = text("\u904A\u3076 \u2192", "Play \u2192");
    grid.querySelector("#btnDaily .md").textContent = text("\u6BCE\u65E5\u5909\u308F\u308B\u304A\u984C\u306B\u6311\u6226\u3002\u7D50\u679C\u3092\u898B\u3066\u304B\u3089\u30E9\u30F3\u30AD\u30F3\u30B0\u63B2\u8F09\u3092\u9078\u3079\u307E\u3059\u3002", "A new challenge every day. Choose whether to post after seeing your result.");
    for (const id of ["dailyResetLab", "dailyTwistLab"]) {
      const note = document.getElementById(id);
      if (note) el.insertBefore(note, el.querySelector("#extras-entry"));
    }
    for (const b of document.querySelectorAll("#modePopup .modeBtn")) if (b.dataset.mode === "endless") b.querySelector(".play-tag").textContent = text("\u904A\u3076 \u2192", "Play \u2192");
  } else check();
  return { onStart() {
    entry.close();
  }, openBoard, validationError(code) {
    const input = el.querySelector(code === "consent_required" ? "#public-rank-consent" : "#public-rank-name");
    input.focus();
  } };
}
var guidedStyles = `
#rank-play-panel.guided{background:none;border:0;padding:0;margin:12px 0;color:#54455a;font:14px/1.55 system-ui;overflow-wrap:anywhere}
#rank-play-panel.guided [hidden]{display:none!important}
.guided button{cursor:pointer;touch-action:manipulation;min-height:44px;white-space:normal}
.guided button:focus-visible,.guided input:focus-visible,.guided select:focus-visible,.guided summary:focus-visible{outline:3px solid #8263c7;outline-offset:3px}
#rank-play-panel.guided button{font:inherit;margin:0}
.guided .play-choice{display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#f2edf6;border-radius:18px;padding:5px}
.guided .play-choice button{padding:11px 6px;border:1px solid transparent;border-radius:14px;background:transparent;box-shadow:none;font-weight:800}
.guided .play-choice button[aria-pressed=true]{background:#fff;border-color:#b9a0d8;box-shadow:0 2px 8px #79599c17;color:#634897}
.guided small{display:block;font-size:11px;font-weight:500;margin-top:2px}
#play-explain{font-size:12px;color:#78677f;margin:10px 2px 14px}
#rank-availability{font-size:13px;padding:10px 12px;border-radius:12px;background:#fff3d8;margin:8px 0}
#rank-availability[data-state=open]{background:#eaf5ee;color:#366c48}
#play-modes{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#extras-entry{margin-top:12px}
#rank-play-panel.guided #btnModes{width:100%;padding:11px 14px!important;background:#faf7fc;border-color:#dfd2e8}
.extra-modes .modeBtn{white-space:normal;align-items:flex-start;flex-direction:column;gap:6px;text-align:left}
.extra-modes .modeBtn .md{display:block}.extra-modes .modeBtn br{display:none}
.extra-modes .mode-kicker{display:block;font-size:10px;letter-spacing:.06em;color:#87718d;margin-bottom:4px}
.extra-modes .play-tag{font-size:12px;color:#74539c;align-self:flex-end}
.extra-modes #twistSelBox{display:block}.extra-modes #twistSelBox[style*="display: none"]{display:none}
#rank-play-panel.guided .modeBtn{display:flex;align-items:flex-start;flex-direction:column;text-align:left;padding:14px!important;border-radius:18px;gap:6px;min-width:0;margin:0;background:#fffafc}
#rank-play-panel.guided .modeBtn .mn{font-size:17px;display:block}
#rank-play-panel.guided .modeBtn .md{display:block;font-size:12px;line-height:1.5;color:#78677f;margin-top:4px;font-weight:500}
.guided .mode-kicker{display:block;font-size:10px;letter-spacing:.06em;color:#87718d;font-weight:700;margin-bottom:4px}
#rank-play-panel.guided .modeBtn .best{white-space:normal;font-size:11px;margin:0;color:#78677f}
.guided[data-ranked=true] .modeBtn .best{display:none}
.guided .modeBtn br{display:none}
#rank-play-panel.guided .modeBtn>span{max-width:100%}
#rank-play-panel.guided #btnDaily>span:first-child{flex:0 0 auto}
.guided .play-tag{font-size:12px;font-weight:800;margin-top:auto;padding-top:4px;color:#74539c}
.guided .board-link{display:flex;align-items:center;justify-content:space-between;width:100%;padding:13px 16px!important;margin-top:16px!important;background:#f2edff;border:1px solid #cbb9eb;border-radius:14px;font-weight:800!important}
.guided .menu-small{font-size:12px;line-height:1.55;color:#78677f;margin:7px 0}
.guided> .menu-small{text-align:center}
.guided .quiet{background:none;border:0;box-shadow:none;text-decoration:underline;text-underline-offset:3px;color:#78618d;padding:8px!important}
#rank-recovery:has(>button:not([hidden])){border:1px solid #c9b6e3;border-radius:12px;padding:8px;margin:10px 0;background:#f7f2ff}
.guided dialog{color:#54455a;padding:0;border:1px solid #d7c7e2;border-radius:22px;width:min(510px,calc(100vw - 24px));max-height:calc(100dvh - 30px);box-sizing:border-box;box-shadow:0 20px 90px #49315633;overflow:auto;touch-action:pan-y}
.guided dialog::backdrop{background:#3f294b66;backdrop-filter:blur(3px)}
.guided .sheet{padding:26px 24px 20px;position:relative;background:#fffcfa;text-align:left}
.guided .sheet h2{font-size:23px!important;margin:0 30px 10px 0!important}
.guided .eyebrow{font-size:10px;letter-spacing:.12em;font-weight:800;color:#967ca9;margin:0 0 8px}
.guided .sheet-close{position:absolute;right:8px;top:8px;width:44px;background:none;border:0;box-shadow:none;font-size:24px!important}
.guided .name-label{font-size:14px;font-weight:750;display:block;margin:20px 0 6px}
.guided #public-rank-name{display:block;width:100%;padding:12px;border:1px solid #bca9cc;border-radius:10px;background:white;font-size:16px;box-sizing:border-box}
.guided .consent-row{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.6;margin:18px 0 12px;cursor:pointer}
.guided .consent-row input{flex:none;width:20px;height:20px;margin:2px 0;accent-color:#8f70be}
.guided .data-details{font-size:12px;line-height:1.7;color:#78677f;margin:12px 0}
.guided .data-details summary{min-height:32px;cursor:pointer}
.guided #trial-summary{color:#994461;font-size:13px;margin:12px 0}
.guided #trial-summary:empty{display:none}
.guided #rank-entry-start{width:100%;padding:13px;font-weight:800;background:#f88dbb;border-color:#f88dbb;color:#442b41}
.guided #rank-entry-casual{display:block;margin:8px auto 0!important}
.guided .board-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:16px 0}
.guided select{font:inherit;padding:10px;max-width:100%;min-width:0;flex:1;border:1px solid #cbb9df;border-radius:10px;background:white;color:inherit}
.guided table{width:100%;table-layout:fixed;border-collapse:collapse;font-size:13px}
.guided td,.guided th{text-align:left;padding:10px 4px;border-bottom:1px solid #e6dce9;overflow-wrap:anywhere}
.guided th:first-child{width:36px}.guided th:last-child{width:88px}
#menuOverlay .card:has(.guided){touch-action:pan-y}
#menuOverlay .card:has(.guided) #howtoBox img{max-height:145px}
@media(max-width:420px){#menuOverlay .card:has(.guided){padding:20px 16px;border-radius:24px}#menuOverlay .card:has(.guided) h1{font-size:24px}#rank-play-panel.guided .modeBtn{padding:11px!important}.guided .play-choice button{font-size:13px!important}#rank-play-panel.guided .modeBtn .mn{font-size:15px}.guided .sheet{padding:24px 18px 18px}}
@media(max-width:340px){#play-modes{grid-template-columns:1fr}.guided .play-choice button{font-size:12px!important}}
`;

// client/light-menu.mjs
function mount({ url, publicKey, ja, game, resultOnly = false, readRpc = "ranking_light_read" }) {
  const text = (a, b) => ja ? a : b, panel = document.createElement("section");
  panel.id = "rank-play-panel";
  document.querySelector("#challengeSlot").append(panel);
  const read = async (view) => {
    const r = await fetch(url + "/rest/v1/rpc/" + readRpc, { method: "POST", headers: { apikey: publicKey, Authorization: "Bearer " + publicKey, "Content-Type": "application/json" }, body: JSON.stringify({ p_view: view }), signal: AbortSignal.timeout(8e3) });
    if (!r.ok) throw Error("unavailable");
    return r.json();
  };
  const menu = guidedMenu({ el: panel, text, read, preview: false, game, resultEntry: true, resultOnly });
  panel.querySelector("#rank-entry").remove();
  panel.querySelector("#rank-recovery").hidden = true;
  const style = document.createElement("style");
  style.textContent = guidedStyles;
  document.head.append(style);
  let sequence = 0;
  panel.querySelector("#verified-load").onclick = async () => {
    const seq = ++sequence, box = panel.querySelector("#verified-board");
    box.textContent = text("\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026", "Loading\u2026");
    try {
      const data = await read("leaderboard");
      if (seq !== sequence) return;
      box.replaceChildren();
      const note = document.createElement("p");
      note.textContent = text("\u4ECA\u65E5\u306E\u8A18\u9332\uFF08\u65E5\u672C\u6642\u9593\uFF09: ", "Today (Japan time): ") + data.day;
      box.append(note);
      const policy = document.createElement("p");
      policy.className = "menu-small";
      policy.textContent = text("\u7C21\u6613\u5BFE\u7B56\u4ED8\u304D\u30E9\u30F3\u30AD\u30F3\u30B0\u3002\u30B5\u30FC\u30D0\u30FC\u3067\u306E\u518D\u63A1\u70B9\u306F\u884C\u3063\u3066\u3044\u307E\u305B\u3093\u3002", "Basic abuse filtering; scores are not server-rescored.");
      box.append(policy);
      if (!data.entries.length) {
        const p = document.createElement("p");
        p.textContent = text("\u307E\u3060\u516C\u958B\u8A18\u9332\u306F\u3042\u308A\u307E\u305B\u3093\u3002", "No public scores yet.");
        box.append(p);
        return;
      }
      const table = document.createElement("table");
      const head = table.createTHead().insertRow();
      for (const title of [text("\u9806\u4F4D", "Rank"), text("\u540D\u524D", "Name"), text("\u5F97\u70B9", "Score")]) {
        const th = document.createElement("th");
        th.textContent = title;
        head.append(th);
      }
      for (const e of data.entries) {
        const row = table.insertRow();
        for (const v of [e.rank, e.name, Number(e.score).toFixed(2)]) row.insertCell().textContent = String(v);
      }
      box.append(table);
    } catch {
      if (seq === sequence) box.textContent = text("\u30E9\u30F3\u30AD\u30F3\u30B0\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3002\u66F4\u65B0\u3067\u518D\u8A66\u884C\u3067\u304D\u307E\u3059\u3002", "Could not load scores. Refresh to retry.");
    }
  };
  const button = document.createElement("button");
  button.textContent = text("\u{1F3C6} \u4ECA\u65E5\u306E\u30E9\u30F3\u30AD\u30F3\u30B0\u3092\u898B\u308B", "\u{1F3C6} View today\u2019s leaderboard");
  button.onclick = () => {
    game.menu();
    menu.openBoard();
  };
  document.querySelector("#rankBox").append(button);
}
export {
  mount
};
