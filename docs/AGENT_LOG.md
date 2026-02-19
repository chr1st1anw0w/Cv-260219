
# 🧠 Agent Reasoning Log (開發者思維日誌)

## [2025-05-22] - 升級互動協議 (POP)
**執行代理**: NeoCV Architect
**關聯 Skill**: `router`, `ui-ux-pro-max`, `stitch`

### 📥 思考過程 (Reasoning)
> "使用者希望我不只是一個被動的代碼生成器，而是一個能主動提出更好方案的「架構師」。
> 
> **策略**：
> 1.  **定義協議 (POP - Proactive Optimization Protocol)**：在 `SKILL_ROUTER.md` 中明確定義何時該「直接執行」，何時該「停下來建議」。
> 2.  **整合技能**：將 `UI/UX Pro Max` (設計標準) 和 `Stitch` (代碼標準) 作為建議的依據。
> 3.  **輸出指令**：提供一段清晰的 System Prompt，讓使用者可以設定到他們的 AI 工具中，使未來的對話都遵循此模式。"

### 🚀 執行變更
1.  更新 `docs/skills/SKILL_ROUTER.md`：加入詳細的互動協議。

## [2025-05-22] - 安裝 Stitch Skill 與建立自動化路由
**執行代理**: AI Studio (Model: Gemini 3 Pro)
**關聯 Skill**: `ui-ux-pro-max`, `stitch`

### 📥 思考過程 (Reasoning)
> "使用者希望自動化調用技能。目前我們有強大的設計數據庫 (`UI/UX Pro Max`)，但缺發一個強力的工程規範來將設計完美轉化為 React 組件 (`Stitch`)。
>
> **架構分析**：
> 1.  **UI/UX Pro Max**: 負責 *What* (要看起來像什麼？顏色、間距、陰影)。
> 2.  **Stitch**: 負責 *How* (代碼如何組織？Props 定義、clsx 合併、錯誤邊界)。
>
> **自動化策略 (The Router)**：
> 我不需要使用者每次都說「用 Stitch 寫代碼」。我將建立一個 `SKILL_ROUTER` 協議。
> - 當意圖涉及「視覺風格」、「配色」-> 自動調用 `Pro Max`。
> - 當意圖涉及「組件實作」、「重構」、「效能」-> 自動調用 `Stitch`。
> - 當兩者皆有（例如：「幫我做一個漂亮的 Dashboard 卡片」）-> 串聯工作流：先設計 (Pro Max) -> 後縫合 (Stitch)。"

### 🚀 執行變更
1.  新增 `docs/skills/skill-stitch.md` (工程規範庫)。
2.  新增 `docs/skills/SKILL_ROUTER.md` (自動化判斷邏輯)。
3.  更新 `services/aiService.ts` (注入 Stitch 邏輯到生成函數，新增 `codeArchitectAgent`)。

### 📊 狀態
- **Pro Max**: Active (Design Intelligence)
- **Stitch**: Active (Code Intelligence)
- **Router**: Active (Orchestration)
