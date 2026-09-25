# ⚡ PhrasalFlow · 每日10句英文動詞片語練習網頁

> **18天精通 180 個真實語料庫高頻動詞片語（Phrasal Verbs）**  
> 每日精練 10 句 · 生活與職場雙例句 · 克漏字填空 · 3D單字卡 · 句子重組 · 真人語音朗讀 · GitHub Pages 即開即用！

---

## 🌟 專案特色

本專案將英文學習寶典《**Phrasal Verbs 大全**》完整數位化與互動化，精選出英語母語者日常生活中使用頻率最高、最急需的 **180 個核心動詞片語**，並依整體頻率由高至低精心編排為 **18 天的每日練習計畫**（每天 10 個核心片語與例句）。

### 🎯 六大互動學習模組

1. 📝 **每日 10 句挑戰（Daily Cloze Quiz）**：
   - 智慧克漏字填空測驗，語法時態自動對應。
   - 即時正誤判斷、音效反饋與詳細解析（包含語料庫使用佔比 %、中文釋義）。
   - 附生活（Everyday）與職場（Workplace）情境例句。

2. 🗂️ **3D 智慧翻轉單字卡（Smart Flashcards）**：
   - 正面顯示片語名稱、頻率排名與中文核心意思。
   - 翻轉背面展示多重義項、文法搭配（如 `(+ with)`、`(+ to)`）及所有情境例句。
   - 支援 Web Speech API 原生英語朗讀，隨點隨聽。

3. 🧩 **句子重組積木（Sentence Scramble Builder）**：
   - 點擊互動單字積木，重組為結構正確的英文完整句子。
   - 加強片語在句子中的正確語序、時態與介系詞搭配直覺。

4. 🎧 **聽力與跟讀測驗（Listening & Dictation）**：
   - 點擊播放原生英文例句語音，練習盲聽並選出句中所使用的動詞片語。

5. 📖 **180 片語百科字典（Full Directory）**：
   - 完整收錄 180 個動詞片語（150 個核心高頻 + 30 個實用補充）。
   - 支援即時關鍵字模糊搜尋、天數篩選、核心/補充分類篩選。
   - 每個片語均可一鍵發音朗讀與星號收藏。

6. ⭐️ **收藏與錯題複習庫（Review Notebook）**：
   - 自動記錄練習中的答錯題目。
   - 提供星號收藏夾，集中加強個人弱點片語。

---

## 🚀 發佈到 GitHub Pages（只需 3 分鐘）

本專案為**純前端靜態網頁（Vanilla HTML5 + Modern CSS + ES6 JavaScript）**，無需安裝 Node.js、不需要構建打包指令，也不需要任何後端伺服器！直接推送到 GitHub 即可免費啟用 GitHub Pages 上線！

### 步驟說明：

#### 步驟 1：建立 GitHub 倉庫
1. 登入您的 [GitHub](https://github.com/) 帳號。
2. 點擊右上角的 **「+」** ➔ 選擇 **「New repository」**。
3. 填寫倉庫名稱（例如：`phrasal-verbs-daily`）。
4. 設定為 **Public**（公開），其餘選項保持預設，點擊 **「Create repository」**。

#### 步驟 2：推送到 GitHub
在您本機的專案資料夾開啟 PowerShell 或終端機，執行以下指令：

```powershell
# 1. 初始化 Git 倉庫
git init

# 2. 加入所有檔案並提交
git add .
git commit -m "Initial commit: 180 Phrasal Verbs Daily Practice App"

# 3. 關聯到您的 GitHub 倉庫（請將 YOUR_USERNAME 和 YOUR_REPO 換成您的）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main

# 4. 推送到 GitHub
git push -u origin main
```

> 💡 **小秘訣**：本專案已附贈 `deploy.ps1` 自動化部署腳本，您也可以直接在 PowerShell 執行 `.\deploy.ps1`，依照提示輸入 GitHub 倉庫網址即可一鍵完成！

#### 步驟 3：啟用 GitHub Pages 免費網站
1. 進入您剛建立的 GitHub 倉庫頁面。
2. 點擊上方的 **「Settings」**（設定）標籤頁。
3. 在左側側邊欄點擊 **「Pages」**。
4. 在 **「Build and deployment」** ➔ **「Source」** 下拉選單中選擇 **「Deploy from a branch」**。
5. 在 **「Branch」** 選擇 `main`，資料夾選擇 `/ (root)`，點擊 **「Save」**。
6. 等待約 1~2 分鐘重新整理頁面，上方就會顯示您的專屬網址：  
   `https://<你的GitHub帳號>.github.io/<倉庫名稱>/`
7. 手機、平板或電腦直接點開即可開始練習！

---

## 💻 本地直接開啟與執行

無需任何安裝，以下任一方式皆可立即在電腦上開啟練習：

- **方式一（最快）**：直接在檔案總管中雙擊 [`index.html`](file:///c:/Users/User/OneDrive/中榮/教學/Antigravity IDE AI/2026.09.24/index.html)，即可在 Chrome / Edge / Safari 中直接離線練習！
- **方式二（本地伺服器）**：
  ```bash
  python -m http.server 8080
  ```
  打開瀏覽器訪問 `http://localhost:8080` 即可。

---

## 📁 檔案結構

```text
├── index.html               # 現代化主網頁（HTML5 語意化結構與無障礙設計）
├── style.css                # 現代高質感 CSS 設計系統（深色/淺色主題、玻璃擬態）
├── app.js                   # 完整互動核心邏輯（測驗、單字卡、句子重組、語音合成）
├── phrasal_verbs_data.js    # 180 個動詞片語結構化資料庫（含完整例句與預設題庫）
├── phrasal_verbs_final.json # JSON 格式原始數據集
├── deploy.ps1               # 一鍵推送 GitHub 部署腳本
├── README.md                # 完整專案介紹與發佈教學文件
└── 20260924 Phrasal Verbs 大全.pdf # 原始教材 PDF
```

---

## 📖 內容來源與編排原則

- **收錄範圍**：全書 180 個高頻片語動詞（條目 1~150 為核心頻率排序，條目 151~180 為常用補充）。
- **頻率數據**：每個義項標註真實語料庫中佔該片語所有使用的百分比（Corpus Share %）。
- **雙例句配置**：每個核心義項均配備「生活」與「職場」情境例句，兼顧生活溝通與商務專業應用。
