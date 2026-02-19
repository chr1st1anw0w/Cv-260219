
# 產品需求文檔 (PRD) - Christian Wu - NeoCV Architect

| 屬性 | 內容 |
| :--- | :--- |
| **產品名稱** | Christian Wu - NeoCV Architect |
| **版本** | **2.2 (Enhanced Editing & Mobile Experience)** |
| **狀態** | 已實作 / 優化中 |
| **最後更新** | 2025-05-21 |
| **核心目標** | 打造一個「所見即所得」的高階履歷系統，結合 Fintech 風格的後台數據管理與三大風格的前台展示，並提供企業級的編輯體驗（Undo/Redo, AI Templates）。 |

---

## 1. 產品架構圖 (System Architecture)

本產品採用 **單頁應用 (SPA)** 架構，透過統一的數據狀態流 (State Flow) 與 歷史堆疊 (History Stack) 驅動應用：

```mermaid
graph TD
    User[Christian Wu (Admin)] -->|編輯/優化| AdminView[後台: Data OS]
    AdminView -->|更新 State| HistoryStack[History Manager (Undo/Redo)]
    HistoryStack -->|更新 Current State| ReactState[Global Content State]
    ReactState -->|持久化存儲| LocalStorage[Browser Storage]
    
    ReactState -->|即時渲染| ViewEngine[視圖渲染引擎]
    
    ViewEngine -->|渲染| ClassicView[前台: Classic Mode]
    ViewEngine -->|渲染| GlassView[前台: Glass Mode]
    ViewEngine -->|渲染| CreativeView[前台: Dashboard Mode]
    
    Viewer[Recruiter / Visitor] -->|瀏覽| ClassicView & GlassView & CreativeView
```

---

## 2. 前台功能需求 (Frontend Requirements)

前台是招聘者與訪客看到的最終成果。系統支援 **即時熱切換 (Hot-swapping)** 三種完全不同的設計語言。

### 2.1 視圖模式 (View Modes)

| 模式名稱 | 風格特徵 | 適用場景 | 關鍵組件 |
| :--- | :--- | :--- | :--- |
| **Classic Mode** (預設) | 極簡主義、結構化。類似傳統紙本履歷的數位版，強調閱讀性與清晰度。 | 正式投遞、列印、保守型企業。 | • 左側固定導航<br>• 時間軸經歷列表<br>• 條列式技能組 |
| **Glass Mode** | 玻璃擬態 (Glassmorphism)。背景模糊、浮動卡片、極光漸層。展現 UI/UX 設計能力。 | 設計類職位、展示視覺審美。 | • 磨砂玻璃卡片 (backdrop-blur)<br>• 懸浮動態效果<br>• 網格佈局 |
| **Creative / Dashboard** | Neo-Brutalist / Fintech。模仿 SaaS 儀表板，高對比色，數據視覺化。 | 產品經理、技術總監、新創公司。 | • 技能雷達圖<br>• 專案影響力圖表<br>• 模組化數據塊 |

### 2.2 核心互動功能

1.  **Mobile Experience Optimization (v2.2 NEW)**:
    *   針對手機端 (Mobile) 實作 **Bottom Navigation Bar**。
    *   將內容拆分為 "Profile" (個人資訊) 與 "Resume" (經歷/專案) 兩個 Tabs，解決手機長滾動問題。
2.  **深色模式 (Dark Mode)**: 全站支援一鍵切換 Light/Dark 主題。
3.  **PDF 智能導出**: 針對 A4 紙張自動生成專用的 CSS (@media print)。
4.  **互動式專案卡片**: 支援詳細資訊展開/收合，包含 Tech Stack、連結與長篇描述。

---

## 3. 後台與編輯功能 (Admin & Editing)

### 3.1 Data OS (Admin Dashboard)
基於 Fintech 風格的模組化數據管理中心。

*   **功能模組化**: 分為 Personal, Experience, Skills, Layout, Design, Strategy, Export 七大模組。
*   **細粒度編輯 (Granular Editing)**:
    *   **Skills**: 支援編輯單一技能的「名稱」與「描述」(Description)，用於解釋熟練度或應用場景。
    *   **Projects**: 支援完整的專案 CRUD，包含圖片上傳、Tech Stack 標籤管理、專案類型設定。
*   **Markdown 支援**: 所有長文本欄位支援 Markdown 語法輸入與即時預覽。

### 3.2 歷史記錄管理 (History Management) - v2.2 NEW
為了防止編輯失誤，系統實作了完整的狀態回溯機制。

*   **Undo / Redo**: 
    *   在 `App.tsx` 維護一個 `history` 陣列與 `historyIndex` 指針。
    *   每次內容 (`content`) 或佈局 (`layout`) 變更時，自動 Snapshot 當前狀態推入堆疊。
    *   支援鍵盤快捷鍵 (Ctrl+Z / Ctrl+Shift+Z)。
    *   最大歷史記錄限制為 50 步，避免記憶體溢出。

### 3.3 AI 智能助手 (AI Copilot) - v2.2 Enhanced

*   **AI Prompt Templates**:
    *   在文字編輯器 (`EditableText`) 中內建 AI 下拉選單。
    *   預設模版：
        *   *Resume Summary*: 撰寫高階主管風格摘要。
        *   *Experience Bullet (Impact)*: 強調動詞與量化數據。
        *   *Skill Description*: 補充技能應用場景。
        *   *Professional Polish*: 提升專業度與語氣。
*   **Resume Expert**: 針對特定 JD (Job Description) 進行關鍵字分析與 Summary 改寫。
*   **Style Generator**: 根據文字描述 (e.g., "Cyberpunk Fintech") 自動生成配色方案與圓角設定。

---

## 4. 數據結構 (Data Schema)

系統基於 TypeScript 定義的 JSON 結構 `ContentData` 運作：

```typescript
interface ContentData {
  personalInfo: {
    name: string;
    title: string;
    summary: string;
    customFields?: Array<{ label: string, value: string }>; // 彈性欄位
    // ...
  };
  experience: Array<{
    id: string;
    company: string;
    title: string;
    period: string;
    summary: string;
    achievements: string[];
    isHighlight?: boolean;
  }>;
  projects: Array<{ // v2.2 Updated
    id: string;
    title: string;
    subtitle: string;
    type: string;
    description?: string;
    techStack?: string[];
    image: string;
    link?: string;
  }>;
  skills: Array<{
    title: string;
    skills: Array<string | { name: string, description?: string }>; // v2.2 Updated
  }>;
  // ... 其他模組
}
```

---

## 5. 技術規格 (Technical Stack)

*   **Frontend**: React 18 + Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS (CSS Variables for Theming)
*   **Animation**: Framer Motion (Reorder, Transitions)
*   **AI Engine**: Google Gemini API (`gemini-3-flash-preview` for text, `gemini-3-pro` for analysis)
*   **State Persistence**: LocalStorage

---

## 6. 未來迭代規劃 (Roadmap)

*   **Phase 3 (Next)**:
    *   **Backend Integration**: 替換 LocalStorage 為 Vercel KV 或 Supabase，實現多裝置同步。
    *   **Auth System**: 加入簡單的 Admin 登入機制。
    *   **Analytics Dashboard**: 追蹤訪客來源與點擊熱點。
