// J.WoodStudio 專屬中文團隊：6 位可愛 AI 員工 (與本機 --demo 100% 同步引擎)
(function() {
  const TEAM = [
    ['antigravity', '麻糬 (總監)', '【麻糬】整理今天的靈感便籤與放鬆排程'],
    ['gemini', '大叔 (研究員)', '【大叔】尋找日常趣味話題與溫暖色調'],
    ['claude', '沐沐 (文案)', '【沐沐】隨筆撰寫療癒暖心小短句'],
    ['codex', '小雅 (設計)', '【小雅】手繪隨筆塗鴉與可愛角色草圖'],
    ['copilot', '咪咪 (影片)', '【咪咪】挑選舒服的背景音樂與剪輯短片'],
    ['antigravity', '椪柑 (審核)', '【椪柑】確認版面視覺舒適度與文字排版'],
  ];

  const TOOLS = {
    claude: [
      '構思一句溫柔的日常問候',
      '寫下今天的隨筆短句',
      '調整文字語氣，讓讀起來更暖心',
      '整理這週的生活靈感便籤'
    ],
    gemini: [
      '收集網路上有趣的日常話題',
      '挑選幾款柔和燕麥奶色調',
      '看看大家最近喜歡什麼可愛插畫',
      '把喜歡的照片存到靈感資料夾'
    ],
    codex: [
      '畫幾隻圓滾滾的動物草稿',
      '調整角色眼睛與微笑角度',
      '在草稿旁邊畫個小咖啡杯',
      '試著幫線條塗上柔柔的顏色'
    ],
    copilot: [
      '找幾首適合畫畫聽的 Lo-Fi 音樂',
      '把繪圖過程剪成短短的小片段',
      '加上可愛的轉場小音效',
      '排版乾淨舒服的封面縮圖'
    ],
    antigravity: [
      '整理桌面上滿滿的靈感便利貼',
      '看看字體行距舒不舒服',
      '伸個懶腰，準備喝杯熱咖啡',
      '確認整體畫面看起來溫馨自然'
    ],
  };

  const REPLIES = [
    '【麻糬 總監】今天大家看起來都很愜意，待會一起吃個點心吧！',
    '【大叔 研究員】找到了幾組很放鬆的配色，心情都變好了～',
    '【沐沐 文案】短短幾句話寫好囉，希望看的人能會心一笑！',
    '【小雅 設計】新塗鴉畫好啦，圓滾滾的好療癒！',
    '【咪咪 影片】背景音樂搭起來超舒服，很適合放空看！',
    '【椪柑 審核】畫面乾乾淨淨的，閱讀體驗很棒喔！'
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
        cwd: `/studio/${project}`,
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
          : status === 'waiting' ? '正在發呆想事情中...' : null;
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
