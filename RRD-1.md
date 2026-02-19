產品需求文檔 (PRD) - Christian Wu Personal Portfolio & CV Architect
屬性	內容
產品名稱	Christian Wu - NeoCV Architect
版本	2.1 (Full Stack Integration)
狀態	已實作 / 優化中
核心目標	打造一個「所見即所得」的高階履歷系統，結合 Fintech 風格的後台數據管理與三大風格的前台展示，實現個人品牌的極致呈現。
1. 產品架構圖 (System Architecture)
本產品採用 單頁應用 (SPA) 架構，透過統一的數據狀態流 (State Flow) 驅動兩個不同的端點：
code
Mermaid
graph TD
    User[Christian Wu (Admin)] -->|編輯/優化| AdminView[後台: Data OS]
    AdminView -->|更新 State| ReactState[Global Content State]
    ReactState -->|持久化存儲| LocalStorage[Browser Storage / Future DB]
    
    ReactState -->|即時渲染| ViewEngine[視圖渲染引擎]
    
    ViewEngine -->|渲染| ClassicView[前台: Classic Mode]
    ViewEngine -->|渲染| GlassView[前台: Glass Mode]
    ViewEngine -->|渲染| CreativeView[前台: Dashboard Mode]
    
    Viewer[Recruiter / Visitor] -->|瀏覽| ClassicView & GlassView & CreativeView
2. 前台功能需求 (Frontend Requirements)
前台是招聘者與訪客看到的最終成果。系統支援 即時熱切換 (Hot-swapping) 三種完全不同的設計語言，但共用同一份數據源。
2.1 視圖模式 (View Modes)
模式名稱	風格特徵	適用場景	關鍵組件
Classic Mode (預設)	極簡主義、結構化。類似傳統紙本履歷的數位版，強調閱讀性與清晰度。	正式投遞、列印、保守型企業。	• 左側固定導航<br>• 時間軸經歷列表<br>• 條列式技能組
Glass Mode	玻璃擬態 (Glassmorphism)。背景模糊、浮動卡片、極光漸層。展現 UI/UX 設計能力。	設計類職位、展示視覺審美。	• 磨砂玻璃卡片 (backdrop-blur)<br>• 懸浮動態效果<br>• 網格佈局
Creative / Dashboard	Neo-Brutalist / Fintech。模仿 SaaS 儀表板，高對比色（Volt Yellow/Black），數據視覺化。	產品經理、技術總監、新創公司。	• 技能雷達圖<br>• 專案影響力圖表<br>• 模組化數據塊
2.2 核心互動功能
深色模式 (Dark Mode): 全站支援一鍵切換 Light/Dark 主題，所有組件（文字、背景、圖表）自動適配色票。
PDF 智能導出: 透過 PdfExportAssistant，利用 AI 針對 A4 紙張自動生成專用的 CSS (@media print)，確保網頁版轉 PDF 時排版不跑位。
動態導航 (Sticky Navigation): 隨著頁面滾動，導航列自動變形（收合/展開），確保關鍵資訊（姓名、職稱、聯繫方式）始終可見。
互動式作品預覽: 懸停在專案卡片上時，透過 Framer Motion 觸發微動畫（放大、位移、資訊揭露）。
3. 後台與數據連動機制 (Data Synchronization)
這部分描述 AdminView (Data OS) 如何修改數據，並如何影響前台。
3.1 數據結構 (Data Schema)
系統基於 TypeScript 定義的 JSON 結構 ContentData 運作：
code
TypeScript
interface ContentData {
  personalInfo: {
    name: string;
    title: string;
    summary: string; // 支援 Markdown
    avatar: string;
    // ...聯絡資訊
  };
  experience: Array<{
    company: string;
    achievements: string[]; // 條列式成就
    // ...
  }>;
  skills: Array<{
    title: string;
    skills: Array<string | { name: string, level: number }>;
  }>;
  // ... 其他模組
}
3.2 數據流動邏輯 (Data Flow Logic)
初始化 (Hydration):
App 啟動時，useEffect 檢查 localStorage 是否有 portfolio_content。
若有，載入該 JSON 至 React State；若無，載入 constants.ts 中的預設值。
編輯觸發 (Triggering Updates):
使用者在 Data OS (AdminView) 的輸入框修改內容（例如：修改 Summary）。
輸入框觸發 onChange 事件，呼叫 handleContentChange 函數。
狀態更新與持久化 (Update & Persist):
handleContentChange 更新 React 的 content State。
關鍵機制：同時將新的 JSON 字串化並寫入 localStorage。這確保了即使重新整理頁面，數據也不會丟失。
（可選）透過 API 將 JSON 同步至雲端資料庫（如 Firebase/PostgreSQL）。
反應式渲染 (Reactive Rendering):
由於前台組件 (GlassView, CreativeView) 透過 Props 接收 content State。
當 State 更新時，React 的 Virtual DOM 機制會立即重新渲染前台視圖。
結果：使用者在後台打字的同時，若開啟雙螢幕或預覽模式，能看到前台內容即時變化。
3.3 AI 輔助連動 (AI Integration)
情境：使用者在後台點擊 "AI Optimize"。
流程：
前端將當前欄位的文字發送給 Google Gemini API。
AI 返回優化後的文字。
前端接收回應，自動填入 ContentData 的對應欄位。
觸發上述 3.3 的狀態更新流程，前台即時顯示 AI 優化後的履歷。
4. 路由與權限 (Routing & Permissions)
由於是個人作品集網站，權限管理採用輕量化設計。
路徑/狀態	權限	描述
Public View	公開	訪客可瀏覽所有前台視圖。無法進入編輯模式。
Edit Mode	私有 (Admin)	透過 URL 參數、隱藏手勢或登入驗證（未來規劃）進入。
當前實作：透過 Header 上的 "Edit" 開關（可設為僅本地開發可見或密碼保護）切換 isEditing 狀態。
Admin View：當 viewMode === 'admin' 時，渲染後台介面。
5. 技術規格摘要 (Technical Stack)
Frontend Framework: React 18 + Vite
Language: TypeScript
Styling: Tailwind CSS (利用 CSS Variables 實現主題切換)
Animation: Framer Motion (負責頁面轉場、雷達圖動畫、懸浮效果)
AI Engine: Google Gemini API (gemini-3-flash-preview 用於文字, pro 用於深度分析)
Icons: Lucide React
State/Storage: React Context + LocalStorage (Client-side persistence)
6. 未來迭代規劃 (Roadmap)
Phase 1 (Done): 核心履歷數據結構、三大視圖實作、AI 文字優化。
Phase 2 (Done): Data OS 後台改版（Fintech 風格）、即時健康度分析。
Phase 3 (Next):
Backend Integration: 替換 LocalStorage 為 Vercel KV 或 Supabase，實現多裝置同步。
Auth System: 加入簡單的 Admin 登入機制，防止未授權修改。
Analytics: 在後台顯示訪客數據（有多少人看了履歷、點擊了哪些專案）。