// J.WoodStudio 6 位員工線上即時模擬引擎 (專供 Vercel / GitHub Pages 純靜態部署)
(function() {
  const TEAM = [
    ['antigravity', '麻糬 (總監)', '【麻糬】拆解 J.Wood 冬天賴床系列專案與統籌排程', 'Antigravity (Gemini 3.8 Flash)'],
    ['gemini', '大叔 (研究員)', '【大叔】調研 Threads 棉被封印梗與冬眠流行色票', 'Gemini 3.1 Pro'],
    ['claude', '沐沐 (文案)', '【沐沐】撰寫官網 Hero Banner 標語與 IG 廢萌文案', 'Claude 3.7 Sonnet'],
    ['codex', '小雅 (設計)', '【小雅】繪製 8 款貼圖表情分鏡與 Midjourney 提示詞', 'Codex / GPT-4o'],
    ['copilot', '咪咪 (影片)', '【咪咪】剪輯 18 秒 Procreate 繪圖縮時與辦公室畫面', 'GitHub Copilot'],
    ['antigravity', '椪柑 (審核)', '【椪柑】檢查品牌溫暖語氣、過濾中國用語與色票合規', 'Antigravity (Gemini 3.8 Flash)'],
  ];

  const TOOLS = {
    claude: [
      '產出官網 Banner 主標語與 CTA',
      '撰寫 Threads「棉被封印解除失敗」文案',
      '產出 IG 肉桂捲被窩文案 (3個版本)',
      '撰寫官網法蘭絨保暖毯與陶瓷杯商品文案'
    ],
    gemini: [
      '搜集 Threads #棉被封印 熱門數據',
      '比對 LINE 貼圖冬季排行榜 Top 10',
      '提取冬日燕麥奶色票 #E8DCCA 與 #A8B8C8',
      '分析 20-35 歲女生療癒插畫偏好'
    ],
    codex: [
      '繪製 8+1 貼圖表情分鏡草圖 (棉被壽司)',
      '生成 Midjourney 英文算圖 Prompt',
      '標註手繪修改重點 (深咖啡灰線稿+噴槍腮紅)',
      '製作官網 1920x800 Banner 視覺規格'
    ],
    copilot: [
      '搭配 cozy winter lo-fi 背景音樂',
      '製作 18 秒 9:16 直式 Reels 腳本',
      '合成 3D 小辦公室子母畫面錄製點',
      '設計「冬天賴床圖鑑」封面圖文字'
    ],
    antigravity: [
      '產出 00_專案總覽.md 與排程規劃',
      '建立 06_官網素材擴充包.md',
      '檢查台灣繁中口吻，過濾中國用語',
      '確認燕麥奶低飽和色票不螢光'
    ],
  };

  const REPLIES = [
    '【麻糬 總監】全案拆解完畢，大家一起加油開工！',
    '【大叔 研究員】趨勢調研完成，#棉被封印 熱門度飆升！',
    '【沐沐 文案】官網 Banner 標語與 Threads 廢萌文案寫好囉！',
    '【小雅 設計】8 款貼圖表情與 AI Prompt 已經畫好囉！',
    '【咪咪 影片】18 秒短影音剪好啦，搭配辦公室畫面超萌！',
    '【椪柑 審核】審核通過！無中國用語，完全符合 J.Wood 療癒手繪感！'
  ];

  const SCRIPT = [
    ['thinking', 3], ['tool', 4], ['thinking', 2], ['tool', 3], ['typing', 3], ['done', 14]
  ];

  class StandaloneSimulator {
    constructor(onDataCallback) {
      this.onData = onDataCallback;
      const now = Date.now();
      this.list = TEAM.map(([agent, project, prompt, model], i) => ({
        agent,
        id: `jwood-${i}`,
        key: `${agent}:jwood-${i}`,
        project,
        title: prompt,
        model,
        cwd: `/jwoodstudio/${project}`,
        subagent: false,
        parentId: null,
        status: 'idle',
        activity: null,
        prompt,
        reply: null,
        error: null,
        turnStartedAt: null,
        lastEventAt: now,
        startedAt: now - (i + 1) * 600_000,
        offset: (i * 5) % 25,
        asks: i === 0,
        history: [
          { role: 'user', text: prompt, at: now - 900_000 },
          { role: 'tool', text: (TOOLS[agent] || TOOLS['claude'])[0], at: now - 860_000 },
          { role: 'assistant', text: REPLIES[i % REPLIES.length], at: now - 780_000 },
        ],
        context: { used: 45000, window: 200000 },
        today: { turns: 8, tokens: 68000 }
      }));
    }

    start() {
      this.tick();
      this.timer = setInterval(() => this.tick(), 600);
    }

    stop() {
      if (this.timer) clearInterval(this.timer);
    }

    tick() {
      const now = Date.now();
      const t = now / 1000;
      const total = SCRIPT.reduce((a, [, d]) => a + d, 0);

      for (const s of this.list) {
        const cycle = Math.floor((t + s.offset) / total);
        let k = (t + s.offset) % total;
        let step = 0;
        while (k >= SCRIPT[step][1]) { k -= SCRIPT[step][1]; step++; }
        let [status] = SCRIPT[step];
        if (s.asks && cycle % 2 === 1 && status === 'typing') status = 'waiting';

        const key = `${cycle}:${step}:${status}`;
        if (key === s.keyStep) continue;
        s.keyStep = key;

        if (step === 0) { s.turnStartedAt = now - k * 1000; s.reply = null; }
        s.status = status;
        s.lastEventAt = now;
        const tools = TOOLS[s.agent] || TOOLS['claude'];
        s.activity = status === 'tool' ? tools[(cycle * 3 + step + s.offset | 0) % tools.length]
          : status === 'waiting' ? '向 Hans 提請確認（冬眠主題定案）' : null;
        if (status === 'done') s.reply = REPLIES[(cycle + (s.offset | 0)) % REPLIES.length];

        const say = (role, text) => { s.history.push({ role, text, at: now }); if (s.history.length > 30) s.history.shift(); };
        if (step === 0) say('user', s.prompt);
        if (status === 'tool') say('tool', s.activity);
        if (status === 'done') say('assistant', s.reply);
      }

      this.onData({
        now,
        lang: 'zh-TW',
        sessions: this.list,
        summary: { today: { turns: 48, tokens: 408000 } }
      });
    }

    getTranscript(key) {
      const s = this.list.find((x) => x.key === key);
      return s ? s.history : [];
    }
  }

  window.JWoodSimulator = StandaloneSimulator;
})();
