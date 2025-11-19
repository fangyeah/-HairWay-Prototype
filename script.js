/* ---------- 共用：頁面切換 & Toast ---------- */

function showPage(name) {
  document.querySelectorAll(".page").forEach((p) => {
    p.classList.toggle("active", p.id === "page-" + name);
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === name);
  });

  // 捲到頁面頂端，感覺比較像換區塊
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- 問卷檢測 ---------- */

const surveyQuestions = [
  {
    title: "目前圓禿狀況大約多久？",
    options: [
      "三個月內剛發現",
      "約三個月～一年",
      "一年以上，反覆發作",
      "不太確定",
    ],
  },
  {
    title: "最近一個月，和圓禿相關的擔心程度？",
    options: [
      "幾乎每天都很擔心",
      "有時候會突然想很多",
      "偶爾想到，但還好",
      "幾乎不太會去想",
    ],
  },
  {
    title: "你目前最希望透過 HairWay 得到什麼幫助？",
    options: [
      "找到可以聊心事的病友",
      "了解更多治療選項和副作用",
      "學會跟家人／同事說明自己的狀況",
      "只是想先看看別人的經驗",
    ],
  },
  {
    title: "遇到壓力或低潮時，你通常怎麼面對？",
    options: [
      "會找朋友或家人說說",
      "喜歡自己查資料、找方法",
      "會先逃避，之後才處理",
      "目前還在摸索，不知道怎麼辦",
    ],
  },
  {
    title: "對即將進入病友社群，你現在的感受比較像是？",
    options: [
      "期待，有點緊張但想試試看",
      "怕被認出來，但想找人聊聊",
      "還好，想先觀察看看再決定",
      "不太確定適不適合自己",
    ],
  },
];

let surveyIndex = 0;
const surveyAnswers = new Array(surveyQuestions.length).fill(null);

function renderSurveyQuestion() {
  const box = document.getElementById("survey-question-box");
  const data = surveyQuestions[surveyIndex];

  document.getElementById("survey-step").textContent = surveyIndex + 1;
  document.getElementById("survey-progress-text").textContent =
    surveyIndex + 1 + " / " + surveyQuestions.length;

  const pct = ((surveyIndex + 1) / surveyQuestions.length) * 100;
  document.getElementById("survey-progress-bar").style.width = pct + "%";

  let html = '<div class="survey-question-title">' + data.title + "</div>";
  html += '<div class="survey-options">';
  data.options.forEach((opt, i) => {
    const selected = surveyAnswers[surveyIndex] === i ? " selected" : "";
    html +=
      '<button class="survey-option' +
      selected +
      '" data-index="' +
      i +
      '">' +
      opt +
      "</button>";
  });
  html += "</div>";
  box.innerHTML = html;

  box.querySelectorAll(".survey-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      surveyAnswers[surveyIndex] = idx;
      renderSurveyQuestion();
      updateSurveySummary();
    });
  });

  document.getElementById("survey-prev").disabled = surveyIndex === 0;
  document.getElementById("survey-next").textContent =
    surveyIndex === surveyQuestions.length - 1 ? "完成" : "下一題";
}

function updateSurveySummary() {
  const answered = surveyAnswers.filter((a) => a !== null).length;
  const el = document.getElementById("survey-summary");
  if (answered === 0) {
    el.textContent =
      "目前還在收集你的狀況與期待。回答越多，小輝就越能幫你找到適合的病友小天使。";
    return;
  }
  if (answered < 3) {
    el.textContent =
      "已經開始抓到一些線索囉！完成全部題目後，小輝會優先為你媒合「溫柔陪伴型」的小天使。";
  } else if (answered < surveyQuestions.length) {
    el.textContent =
      "快完成了！看起來你同時在意治療資訊與心理支持，小輝會幫你平衡兩種需求。";
  } else {
    el.textContent =
      "你已完成所有題目，之後在正式版中，小輝會依照你的回答，安排較穩定、願意分享經驗的小天使與你配對。";
  }
}

/* ---------- 病友社群：聊天室 & 任務 ---------- */

const partnerNames = [
  "匿名雲朵-17",
  "匿名暖陽-26",
  "匿名海草-39",
  "匿名星辰-45",
];

let currentDay = 1;
let msgCount = 0;

function initChat() {
  const partner =
    partnerNames[Math.floor(Math.random() * partnerNames.length)];
  document.getElementById("chat-partner-name").textContent = partner;

  const box = document.getElementById("chat-messages");
  box.innerHTML = "";
  addBubble(
    "partner",
    "嗨，我是 " + partner + "。很高興在這裡遇到你，我們可以一起慢慢面對圓禿帶來的心情。"
  );
  addBubble(
    "partner",
    "今天的 Day 1 任務是：「用一兩句話形容你現在的感受」。如果不想打字，也可以只打一個表情符號。"
  );

  msgCount = 0;
  updateMissionUI();
}

function addBubble(from, text) {
  const box = document.getElementById("chat-messages");
  const div = document.createElement("div");
  div.className =
    "bubble " + (from === "partner" ? "bubble-partner" : "bubble-me");
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function updateMissionUI() {
  document.getElementById("mission-day").textContent = currentDay;
  document.getElementById("chat-day-chip").textContent =
    "Day " + currentDay + " / 14";
  const pct = Math.min(100, Math.round((currentDay / 14) * 100));
  document.getElementById("mission-progress").style.width = pct + "%";
}

/* ---------- 衛教文章 ---------- */

const articleData = [
  {
    title: "看診前要準備什麼？帶著這份小清單就夠了",
    stage: "治療前",
    highlight: "門診 check-list",
  },
  {
    title: "怎麼跟家人開口？三句話說出你的需要",
    stage: "治療前",
    highlight: "溝通小腳本",
  },
  {
    title: "醫師開給我的藥好可怕？如何理解副作用說明",
    stage: "治療中",
    highlight: "用白話看仿單",
  },
  {
    title: "每天都在掉髮，心情好像也一起掉下去",
    stage: "治療中",
    highlight: "心理師觀點",
  },
  {
    title: "頭髮長回來之後，還是會怕再掉光嗎？",
    stage: "治療後",
    highlight: "復發焦慮",
  },
  {
    title: "如何在社群媒體上保護自己？分享照片前先想的三件事",
    stage: "其他",
    highlight: "數位安全",
  },
];

function renderArticles() {
  const list = document.getElementById("article-list");
  list.innerHTML = "";
  articleData.forEach((a) => {
    const card = document.createElement("section");
    card.className = "card";
    card.innerHTML =
      '<div class="text-xs">階段：' +
      a.stage +
      "</div>" +
      '<h2 class="card-title" style="margin-top:4px;">' +
      a.title +
      "</h2>" +
      '<p class="text-sm">重點標籤：' +
      a.highlight +
      "</p>" +
      '<button class="btn btn-outline" style="margin-top:8px;">閱讀摘要（Demo）</button>';
    list.appendChild(card);
  });
}

/* ---------- 合作夥伴資訊：台北 / 台中 / 高雄 各 6 家 ---------- */

const partnerData = [
  // 台北 6 家
  {
    city: "台北",
    name: "北星皮膚科診所",
    type: "皮膚科診所｜台北市中山區",
    rating: "4.8 / 5.0",
    distance: "距離約 0.8 km",
    tags: ["圓禿專門門診", "晚間看診", "健保＋自費混合"],
  },
  {
    city: "台北",
    name: "安心皮膚專科",
    type: "皮膚科診所｜台北市大安區",
    rating: "4.7 / 5.0",
    distance: "距離約 1.2 km",
    tags: ["溫柔衛教", "頭皮鏡檢查", "女醫師友善"],
  },
  {
    city: "台北",
    name: "HairCare 微造型沙龍",
    type: "美髮設計｜台北市信義區",
    rating: "4.6 / 5.0",
    distance: "距離約 1.0 km",
    tags: ["假髮造型諮詢", "頭皮護理", "包廂服務"],
  },
  {
    city: "台北",
    name: "柔光心理諮商所",
    type: "心理諮商所｜台北市松山區",
    rating: "4.9 / 5.0",
    distance: "距離約 2.0 km",
    tags: ["慢性疾病調適", "線上諮商", "學生優惠"],
  },
  {
    city: "台北",
    name: "林禾綜合門診中心",
    type: "醫院門診｜台北市內湖區",
    rating: "4.4 / 5.0",
    distance: "距離約 3.1 km",
    tags: ["皮膚科＋身心科", "一站式服務", "交通方便"],
  },
  {
    city: "台北",
    name: "晴光頭皮照護館",
    type: "頭皮管理｜台北市士林區",
    rating: "4.5 / 5.0",
    distance: "距離約 2.4 km",
    tags: ["頭皮 spa", "客製化療程", "隱私空間"],
  },

  // 台中 6 家
  {
    city: "台中",
    name: "陽光皮膚科診所",
    type: "皮膚科診所｜台中市西屯區",
    rating: "4.7 / 5.0",
    distance: "距離約 0.9 km",
    tags: ["圓禿治療經驗多", "門診解說清楚", "貼心衛教單張"],
  },
  {
    city: "台中",
    name: "HairWay 護髮設計",
    type: "美髮設計｜台中市北區",
    rating: "4.6 / 5.0",
    distance: "距離約 1.4 km",
    tags: ["假髮調整剪裁", "敏感頭皮友善染劑", "包廂洗髮"],
  },
  {
    city: "台中",
    name: "心岸心理諮商所",
    type: "心理諮商所｜台中市南區",
    rating: "4.9 / 5.0",
    distance: "距離約 1.8 km",
    tags: ["壓力與自我價值", "長期陪伴方案", "夜間時段"],
  },
  {
    city: "台中",
    name: "家禾醫院門診部",
    type: "醫院門診｜台中市西區",
    rating: "4.3 / 5.0",
    distance: "距離約 2.5 km",
    tags: ["多科別整合", "轉介方便", "醫院端資源多"],
  },
  {
    city: "台中",
    name: "霧峰頭皮養護中心",
    type: "頭皮管理｜台中市霧峰區",
    rating: "4.5 / 5.0",
    distance: "距離約 4.2 km",
    tags: ["居家保養教學", "溫和產品", "定期追蹤"],
  },
  {
    city: "台中",
    name: "青芽身心診所",
    type: "身心診所｜台中市東區",
    rating: "4.8 / 5.0",
    distance: "距離約 3.0 km",
    tags: ["焦慮憂鬱共病", "藥物＋心理合作", "團體支持"],
  },

  // 高雄 6 家
  {
    city: "高雄",
    name: "港灣皮膚專科",
    type: "皮膚科診所｜高雄市鼓山區",
    rating: "4.6 / 5.0",
    distance: "距離約 1.1 km",
    tags: ["圓禿兒童門診", "衛教圖卡", "親子友善"],
  },
  {
    city: "高雄",
    name: "南風造型沙龍",
    type: "美髮設計｜高雄市新興區",
    rating: "4.7 / 5.0",
    distance: "距離約 0.7 km",
    tags: ["局部稀疏遮蓋", "設計師諮詢時間長", "安靜包廂"],
  },
  {
    city: "高雄",
    name: "海岸線心理諮商所",
    type: "心理諮商所｜高雄市苓雅區",
    rating: "4.9 / 5.0",
    distance: "距離約 2.3 km",
    tags: ["慢性疾病調適", "線上諮商", "夜間時段"],
  },
  {
    city: "高雄",
    name: "信心綜合醫院門診",
    type: "醫院門診｜高雄市三民區",
    rating: "4.2 / 5.0",
    distance: "距離約 3.4 km",
    tags: ["皮膚科＋精神科轉介", "醫院資源多", "交通便利"],
  },
  {
    city: "高雄",
    name: "暖光頭皮養護館",
    type: "頭皮管理｜高雄市左營區",
    rating: "4.5 / 5.0",
    distance: "距離約 2.6 km",
    tags: ["頭皮 spa", "舒壓療程", "安靜空間"],
  },
  {
    city: "高雄",
    name: "晴海心理成長中心",
    type: "心理中心｜高雄市前鎮區",
    rating: "4.8 / 5.0",
    distance: "距離約 3.1 km",
    tags: ["自我形象議題", "團體工作坊", "學生方案"],
  },
];

let currentCity = "台北";

function renderPartners() {
  const list = document.getElementById("partner-list");
  list.innerHTML = "";
  partnerData
    .filter((p) => p.city === currentCity)
    .forEach((p) => {
      const card = document.createElement("section");
      card.className = "partner-card";
      let tagsHtml = "";
      p.tags.forEach((t) => {
        tagsHtml += '<span class="partner-tag">' + t + "</span>";
      });
      card.innerHTML =
        '<div class="partner-name">' +
        p.name +
        "</div>" +
        '<div class="partner-meta">' +
        p.type +
        "</div>" +
        '<div class="partner-rating">⭐ ' +
        p.rating +
        "</div>" +
        '<div class="partner-meta">' +
        p.distance +
        "</div>" +
        '<div class="partner-tags">' +
        tagsHtml +
        "</div>";
      list.appendChild(card);
    });
}

function setCity(city) {
  currentCity = city;
  document.querySelectorAll(".chip-chip").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.city === city);
  });
  renderPartners();
}

/* ---------- 小輝 FAB ---------- */

function openHuiMenu() {
  document.getElementById("huiModal").classList.add("show");
}

function closeHuiMenu() {
  document.getElementById("huiModal").classList.remove("show");
}

/* ---------- 初始化 ---------- */

function initNavAndButtons() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showPage(btn.dataset.page);
    });
  });

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.go;
      showPage(target);
      closeHuiMenu();
    });
  });
}

function initSurvey() {
  document
    .getElementById("survey-prev")
    .addEventListener("click", () => {
      if (surveyIndex > 0) {
        surveyIndex--;
        renderSurveyQuestion();
      }
    });

  document
    .getElementById("survey-next")
    .addEventListener("click", () => {
      if (surveyIndex < surveyQuestions.length - 1) {
        surveyIndex++;
        renderSurveyQuestion();
      } else {
        toast("Demo：已完成問卷，將用於病友小天使配對。");
      }
    });

  renderSurveyQuestion();
  updateSurveySummary();
}

function initChatEvents() {
  document.getElementById("chat-send").addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    const banned =
      /(IG|Instagram|Line|賴|私訊|私信|電話|手機|gmail|住址|見面|加好友)/i;
    if (banned.test(text)) {
      toast("請勿交換聯絡方式或透露個資喔！");
      return;
    }

    addBubble("me", text);
    msgCount += 1;
    input.value = "";

    if (msgCount === 1) {
      setTimeout(() => {
        addBubble(
          "partner",
          "謝謝你願意分享。之後如果有任何不舒服或難過的時候，也可以在這裡跟我說。"
        );
      }, 600);
    }
  });

  document
    .getElementById("mission-finish-today")
    .addEventListener("click", () => {
      if (currentDay < 14) {
        currentDay += 1;
        updateMissionUI();
        toast("Demo：已完成今日任務，進度 Day " + currentDay);
      } else {
        toast("14 天任務已完成，交流版發文＆留言已解鎖！");
      }
    });

  document
    .getElementById("board-reply-btn")
    .addEventListener("click", () => {
      if (currentDay < 14) {
        toast("完成 14 天任務後，才可以在交流版留言喔！");
      } else {
        toast("Demo：已送出一則留言。");
      }
    });
}

function initPartners() {
  document.querySelectorAll(".chip-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      setCity(btn.dataset.city);
    });
  });
  setCity(currentCity);
}

function initHui() {
  document.getElementById("huiFab").addEventListener("click", openHuiMenu);
  document
    .getElementById("huiCloseBtn")
    .addEventListener("click", closeHuiMenu);
  document.getElementById("huiModal").addEventListener("click", (e) => {
    if (e.target.id === "huiModal") closeHuiMenu();
  });
}

/* 啟動所有功能 */

initNavAndButtons();
initSurvey();
initChat();
initChatEvents();
renderArticles();
initPartners();
initHui();
showPage("home");