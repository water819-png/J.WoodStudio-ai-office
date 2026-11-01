// J.WoodStudio 專屬中文團隊：6 位可愛 AI 員工 (與本機 --demo 100% 同步引擎)
(function() {
  const TEAM = [
    ['antigravity', '麻糬 (總監)', '【麻糬】拆解 J.Wood 冬天賴床系列專案與統籌排程'],
    ['gemini', '大叔 (研究員)', '【大叔】調研 Threads 棉被封印梗與冬眠流行色票'],
    ['claude', '沐沐 (文案)', '【沐沐】撰寫官網 Hero Banner 標語與 IG 廢萌文案'],
    ['codex', '小雅 (設計)', '【小雅】繪製 8 款貼圖表情分鏡與 Midjourney 提示詞'],
    ['copilot', '咪咪 (影片)', '【咪咪】剪輯 18 秒 Procreate 繪圖縮時與辦公室畫面'],
    ['antigravity', '椪柑 (審核)', '【椪柑】檢查品牌溫暖語氣、過濾中國用語與色票合規'],
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
    ['thinking', 3], ['tool', 4], ['thinking', 2], ['tool', 3], ['typing', 3], ['done', 14],
  ];

  function dayKey(ms) {
    const d = new Date(ms);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  class JWoodSim {
    constructor(onData) {
      this.onData = onData;
      const now = Date.now();
      this.list = TEAM.map(([agent, project, prompt], i) => ({
        agent,
        id: `jwood-${i}`,
        file: null,
        project: project,
        cwd: `/jwoodstudio/${project}`,
        title: prompt,
        model: {
          claude: 'Claude 3.7 Sonnet',
          codex: 'Codex / GPT-4o',
          gemini: 'Gemini 3.1 Pro',
          copilot: 'GitHub Copilot',
          antigravity: 'Antigravity (Gemini 3.8 Flash)'
        }[agent] || 'Gemini Pro',
        subagent: false,
        parentId: null,
        status: 'idle',
        activity: null,
        prompt,
        reply: null,
        error: null,
        turnStartedAt: null,
        lastEventAt: now,
        startedAt: now - (i + 1) * 600000,
        offset: (i * 5) % 25,
        asks: i === 0,
        stepKey: '',
        history: [
          { role: 'user', text: prompt, at: now - 900000 },
          { role: 'tool', text: (TOOLS[agent] || TOOLS.claude)[0], at: now - 860000 },
          { role: 'assistant', text: REPLIES[i % REPLIES.length], at: now - 780000 },
        ],
        daily: { day: dayKey(now), turns: 8, tokens: 68000 },
        context: 45000,
        contextWindow: 200000,
      }));
    }

    start() {
      setTimeout(() => {
        this.tick(true);
        this.timer = setInterval(() => this.tick(false), 500);
      }, 0);
      return this;
    }

    tick(force) {
      const t = Date.now() / 1000;
      const total = SCRIPT.reduce((a, [, d]) => a + d, 0);
      let changed = !!force;
      for (const s of this.list) {
        const cycle = Math.floor((t + s.offset) / total);
        let k = (t + s.offset) % total;
        let step = 0;
        while (k >= SCRIPT[step][1]) { k -= SCRIPT[step][1]; step++; }
        let status = SCRIPT[step][0];
        if (s.asks && cycle % 2 === 1 && status === 'typing') status = 'waiting';
        const stepKey = `${cycle}:${step}:${status}`;
        if (stepKey === s.stepKey) continue;
        s.stepKey = stepKey;
        changed = true;
        const now = Date.now();
        if (step === 0) { s.turnStartedAt = now - k * 1000; s.reply = null; }
        s.status = status;
        s.lastEventAt = now;
        const tools = TOOLS[s.agent] || TOOLS.claude;
        s.activity = status === 'tool' ? tools[(cycle * 3 + step + s.offset | 0) % tools.length]
          : status === 'waiting' ? '向 Hans 提請確認（冬眠主題定案）' : null;
        if (status === 'done') s.reply = REPLIES[(cycle + (s.offset | 0)) % REPLIES.length];
        const say = (role, text) => { s.history.push({ role, text, at: now }); if (s.history.length > 30) s.history.shift(); };
        if (step === 0) say('user', s.prompt);
        if (status === 'tool') say('tool', s.activity);
        if (status === 'done') say('assistant', s.reply);
      }
      if (changed) this.push();
    }

    push() {
      const now = Date.now();
      const sessions = this.list.map((s) => ({
        key: `${s.agent}:${s.id}`,
        agent: s.agent,
        id: s.id,
        sessionId: null,
        parentId: s.parentId,
        subagent: s.subagent,
        cwd: s.cwd,
        project: s.project,
        title: s.title,
        model: s.model,
        status: s.status,
        stuck: 0,
        context: s.context ? { used: s.context, window: s.contextWindow || null } : null,
        today: { turns: s.daily.turns, tokens: s.daily.tokens },
        activity: s.status === 'tool' || s.status === 'waiting' ? s.activity : null,
        prompt: s.prompt,
        reply: s.reply,
        error: s.error,
        turnStartedAt: s.turnStartedAt,
        lastEventAt: s.lastEventAt,
        startedAt: s.startedAt,
      }));
      sessions.sort((a, b) => (b.lastEventAt || 0) - (a.lastEventAt || 0));

      const out = { day: dayKey(now), turns: 0, tokens: 0, agents: 0, byAgent: Object.create(null), projects: Object.create(null) };
      for (const s of sessions) {
        if (!s.today) continue;
        out.agents += 1;
        out.turns += s.today.turns;
        out.tokens += s.today.tokens;
        const a = (out.byAgent[s.agent] || (out.byAgent[s.agent] = { sessions: 0, turns: 0, tokens: 0 }));
        a.sessions += 1; a.turns += s.today.turns; a.tokens += s.today.tokens;
        if (s.project) out.projects[s.project] = (out.projects[s.project] || 0) + s.today.turns;
      }

      this.onData({
        now,
        lang: 'zh-TW',
        sessions,
        summary: out
      });
    }

    getTranscript(key) {
      const s = this.list.find((x) => `${x.agent}:${x.id}` === key);
      return s ? s.history.slice() : [];
    }
  }

  window.JWoodSimulator = JWoodSim;
})();
