# J. Wood Studio - AI 員工辦公室 專案進度與時空交接指南 (STATUS.md) 🐾

> **「歡迎來到 J. Wood Studio 創作團隊的虛擬 3D/2D 辦公室日常！」**  
> 專案版本：`v1.0 正式上線版 (Live)`  
> 最後更新時間：`2026-11-01`  
> 當前狀態：`🚀 已上線運維 (Live) / 核心模擬互動全數就緒`

---

## 📌 專案關鍵情報索引 (Quick Links)

* **官方正式網址**：[https://jwoodstudio-ai-office.vercel.app/](https://jwoodstudio-ai-office.vercel.app/)
* **GitHub 代碼庫**：[https://github.com/water819-png/J.WoodStudio-ai-office.git](https://github.com/water819-png/J.WoodStudio-ai-office.git) (分支: `main`)
* **託管部署平台**：[Vercel Dashboard](https://vercel.com/)（推送到 main 自動觸發 CI/CD 發布）
* **品牌總部關聯**：[J. Wood Studio 官方旗艦站](https://jwood-studio-web.vercel.app/)

---

## 🧭 給「幾個月後的自己」的 30 秒喚醒筆記

如果你隔了幾個月才重新打開這個專案，請先讀這三句話：
1. **這個專案是什麼？**  
   這是 J. Wood Studio 旗下 6 位專屬 AI 員工的「虛擬辦公室（Virtual Office）」，支援 2D / 3D 視角切換、即時思考狀態模擬、多國語言切換（繁中/簡中/英文/日文）與獨立浮動小窗。
2. **怎麼在本地打開測試？**  
   在專案資料夾點擊 `點我安裝測試.bat`，或在終端機輸入 `npx serve .`，瀏覽器開啟提示的本機網址。
3. **怎麼更新並發布？**  
   修改代碼後，在 `jwood-ai-office` 目錄執行：  
   `git add .` ➔ `git commit -m "update: ..."` ➔ `git push origin main`，Vercel 幾秒內會自動同步正式站。

---

## 👥 辦公室 6 位核心成員名冊與角色定位

| 成員名稱 | 角色定位 | 特徵與責任 |
| :--- | :--- | :--- |
| 👔 **麻糬 (Mochi)** | 總監 / CEO | 黑白賓士貓 🐾，靈感統籌、放鬆排程與全域決策 |
| 🔍 **大叔 (Uncle)** | 主力研究員 | 沉穩大叔 🍵，日常話題挖掘、社群流行語與療癒色調搜集 |
| ✍️ **沐沐 (Mumu)** | 暖心文案 | 文藝少女 🌸，社群生活隨筆、貼圖文案與暖心短句撰寫 |
| 🎨 **小雅 (Anya)** | 首席設計師 | 創作者本尊 🎨，可愛角色繪製、手繪塗鴉與視覺主創 |
| 🎬 **咪咪 (Mimi)** | 影音剪輯師 | 活潑貓娘 🎬，日常氛圍短片、卡點剪輯與放鬆音樂製作 |
| 🛡️ **椪柑 (Ponkan)** | 總審核官 | 元氣大橘貓 🍊，視覺排版、短腿除錯與舒適度把關 |

---

## 🏆 目前已完成之核心架構 (Completed Architecture)

1. **核心技術堆疊**：
   - 原生 HTML5 / CSS3 / JavaScript (ES6+)，零肥大依賴，超輕量極速載入。
   - `office3d.js`：純前端 WebGL / Canvas 3D 視角渲染與動態鏡頭巡航。
   - `office.js`：經典 2D 像素 / 插畫風格俯瞰辦公室工作狀態。
   - `jwood-sim.js`：J. Wood Studio 專屬 6 角色日常事件、對話氣泡與思考狀態模擬機。
   - `i18n.js`：全方位多語言系統（繁體中文、簡體中文、English、日本語）。
   - `popout.js`：支援獨立彈出迷你桌面小窗（Picture-in-Picture 氛圍副螢幕）。
2. **雲端自動化部署**：
   - 配置 `vercel.json`，支援單頁面快顯與靜態路由轉發。
   - 綁定專屬域名 `jwoodstudio-ai-office.vercel.app`。

---

## 📋 下次重啟時的優先待辦事項 (Backlog & Future Tasks)

當您重新回來維護這個專案時，建議優先考慮以下事項：

1. [ ] **與主官網進行雙向深度聯動**：
   - 在 J. Wood Studio 官網（`jwood-studio-web`）的「Web 互動開發」或「導覽列」中加入「進入 AI 虛擬辦公室 🏢」直通入口按鈕。
   - 在本辦公室右上角加入「返回 J. Wood Studio 官方旗艦店 🐾」快捷回連按鈕。
2. [ ] **角色真實對話串接（可選）**：
   - 目前 `jwood-sim.js` 採用預設趣味腳本模擬。未來可串接 Gemini API，讓訪客點擊辦公桌時能與麻糬或小雅真實展開即時 AI 聊天對話。
3. [ ] **季節性或節慶主題裝飾**：
   - 配合聖誕節、跨年、新年或中秋，在 3D/2D 辦公室地板加入南瓜、聖誕樹或柚子帽子等小彩蛋裝飾。

---

## 🛠️ 開發與常用維護指令

```bash
# 1. 本地啟動預覽 (使用 npx serve)
npx serve .

# 2. 檢查修改內容
git status
git diff

# 3. 提交並同步發布至正式站
git add .
git commit -m "feat/fix: 更新辦公室功能"
git push origin main
```

---

*本文件由 Antigravity 整理維護，作為 J. Wood Studio AI 員工辦公室專案之長期保存時空膠囊。*
