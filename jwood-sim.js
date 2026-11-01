// J.Wood Studio 6 位可愛員工模擬核心
(function() {
  const TEAM = [
    { id: 'jwood-0', agent: 'antigravity', name: '麻糬 (總監)', role: 'director', task: '【麻糬】拆解 J.Wood 專案與跨部門統籌排程', model: 'Antigravity (Gemini 3.8 Flash)' },
    { id: 'jwood-1', agent: 'gemini', name: '大叔 (研究員)', role: 'researcher', task: '【大叔】調研 Threads 棉被封印梗與冬眠流行色票', model: 'Gemini 3.1 Pro' },
    { id: 'jwood-2', agent: 'claude', name: '沐沐 (文案)', role: 'copywriter', task: '【沐沐】撰寫官網 Hero Banner 標語與 IG 廢萌文案', model: 'Claude 3.7 Sonnet' },
    { id: 'jwood-3', agent: 'codex', name: '小雅 (設計)', role: 'designer', task: '【小雅】繪製 8 款貼圖表情分鏡與 Midjourney 提示詞', model: 'Codex / GPT-4o' },
    { id: 'jwood-4', agent: 'copilot', name: '咪咪 (影片)', role: 'video', task: '【咪咪】剪輯 18 秒 Procreate 繪圖縮時與辦公室畫面', model: 'GitHub Copilot' },
    { id: 'jwood-5', agent: 'antigravity', name: '椪柑 (審核)', role: 'reviewer', task: '【椪柑】檢查品牌溫暖語氣、過濾中國用語與色票合規', model: 'Antigravity (Gemini 3.8 Flash)' },
  ];

  const ACTIVITIES = {
    director: ['規劃 00_專案總覽.md', '指派任務給沐沐與小雅', '檢查各部門進度', '確認產品上架排程'],
    researcher: ['搜集 Threads #棉被封印 熱門數據', '比對 LINE 貼圖排行榜 Top 10', '整理冬日燕麥奶色票 #E8DCCA', '分析受眾留言互動率'],
    copywriter: ['產出官網 Banner 主標語與 CTA', '撰寫 Threads 3 種版本文案', '產出 IG 肉桂捲被窩文案', '撰寫保暖毯與陶瓷杯商品文案'],
    designer: ['繪製 8+1 貼圖表情分鏡草圖', '輸出 Midjourney 英文算圖 Prompt', '標註深咖啡灰手繪修改線條', '製作官網 1920x800 Banner 規格'],
    video: ['搭配 cozy winter lo-fi 背景音樂', '製作 18 秒直式 Reels 腳本', '合成辦公室小人子母畫面', '產出封面圖與發布時間建議'],
    reviewer: ['檢查台灣繁中口吻，過濾中國用語', '確認燕麥奶低飽和色票不螢光', '審核版權與原創完整性', '批准官網與社群上架發布'],
  };

  const REPLIES = {
    director: '【麻糬 總監】全案拆解完畢，大家一起加油開工！',
    researcher: '【大叔 研究員】趨勢調研完成，#棉被封印 熱門度飆升！',
    copywriter: '【沐沐 文案】官網 Banner 標語與 Threads 廢萌文案寫好囉！',
    designer: '【小雅 設計】8 款貼圖表情與 AI Prompt 已經畫好囉！',
    video: '【咪咪 影片】18 秒短影音剪好啦，搭配辦公室畫面超萌！',
    reviewer: '【椪柑 審核】審核通過！無中國用語，完全符合 J.Wood 療癒手繪感！'
  };

  // 永遠保持在辦公室內的循環狀態 (絕不下班走人)
  const CYCLE_STATES = ['thinking', 'tool', 'tool', 'typing', 'thinking', 'tool'];

  class JWoodSim {
    constructor(onData) {
      this.onData = onData;
      const now = Date.now();
      this.sessions = TEAM.map((m, i) => ({
        key: m.agent + ':' + m.id,
        id: m.id,
        agent: m.agent,
        project: m.name,
        cwd: '/jwoodstudio/' + m.name,
        title: m.task,
        model: m.model,
        status: CYCLE_STATES[i % CYCLE_STATES.length],
        activity: ACTIVITIES[m.role][0],
        prompt: m.task,
        reply: REPLIES[m.role],
        turnStartedAt: now - 30000,
        lastEventAt: now,
        startedAt: now - (i + 1) * 3600000,
        subagent: false,
        offset: i * 7,
        history: [
          { role: 'user', text: m.task, at: now - 60000 },
          { role: 'tool', text: ACTIVITIES[m.role][0], at: now - 30000 },
          { role: 'assistant', text: REPLIES[m.role], at: now - 5000 },
        ]
      }));
    }

    start() {
      this.tick();
      this.timer = setInterval(() => this.tick(), 1000);
    }

    tick() {
      const now = Date.now();
      const sec = Math.floor(now / 1000);

      this.sessions.forEach((s, i) => {
        const member = TEAM[i];
        const step = Math.floor((sec + s.offset) / 4) % CYCLE_STATES.length;
        const status = CYCLE_STATES[step];
        s.status = status;
        s.lastEventAt = now;
        const acts = ACTIVITIES[member.role];
        s.activity = acts[(sec + i) % acts.length];
      });

      this.onData({
        now: now,
        lang: 'zh-TW',
        sessions: this.sessions,
        summary: { today: { turns: 36, tokens: 188000 } }
      });
    }

    getTranscript(key) {
      const s = this.sessions.find(x => x.key === key);
      return s ? s.history : [];
    }
  }

  window.JWoodSimulator = JWoodSim;
})();
