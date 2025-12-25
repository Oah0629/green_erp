# Green ERP 概念驗證系統 (Concept Verification System)

這是一個現代化的 B2B 碳排管理儀表板概念驗證 (PoC) 系統。本系統展示了如何透過自動化 ETL 流程，無縫接軌舊有 ERP 數據，並即時轉換為標準化的 Scope 1, 2, 3 碳排放資訊，協助企業在不增加人力的情況下實現淨零轉型。

## 🎯 系統核心目標
*   **自動化運算**：模擬從採購、物流、能源等異質系統抓取數據，自動套用碳排係數。
*   **即時可視化**：透過動態儀表板與圖表，提供決策者即時的碳排熱點分析。
*   **決策支援**：內建 AI 建議引擎，主動偵測異常並提供優化方案（如物流模式切換建議）。

## ✨ 主要功能

### 1. 資料整合中心 (Integration)
*   監控各子系統（SAP ERP、IoT 智慧電網、物流 API）的連線狀態。
*   提供原始資料 (Raw Data) 的 JSON 預覽，展現資料透明度。

### 2. 核心運算引擎 (Processing)
*   **ETL 模擬**：展示數據讀取、清洗、轉換的即時日誌 (Logs)。
*   **自動轉換**：將原始商業活動（因）轉換為碳排數據（果）。
*   **異常標記**：自動識別高碳排活動（如空運、高能耗設備）並標記為 Warning/Critical。

### 3. 決策支援看板 (Dashboard)
*   **KPI 指標**：本月碳排、強度、高風險供應商監控。
*   **趨勢分析**：互動式面積圖 (Area Chart) 與圓餅圖 (Pie Chart) 解析排放結構。
*   **AI 優化建議**：針對異常排放提供具體的減碳情境模擬（例如：空運轉海運的減碳效益試算）。


### 4. 雙語支援
*   內建**繁體中文**與**英文**介面切換功能，點擊右上角地球圖示即可一鍵切換。

## 🆚 系統優勢比較 (vs. 傳統碳盤查)

| 比較項目 | 傳統碳盤查方式 (Traditional) | Green ERP 概念驗證系統 (Our Solution) |
| :--- | :--- | :--- |
| **數據來源** | 人工收集電費單、物流單據、Excel 報表 | **自動串接** ERP、IoT、物流系統 API (ETL) |
| **人力成本** | 需專責人員定期手動整理，耗時費力 | **零人力增長**，系統自動抓取與運算 |
| **即時性** | 僅能產出年度或季度報告 (落後指標) | **即時 (Real-time)** 監控，隨時掌握碳排狀況 |
| **精確度** | 易有人為抄寫錯誤 | 系統直接讀取源頭數據，**精確度高** |
| **決策支援** | 僅呈現數據，缺乏優化建議 | 內建 **AI 建議引擎**，主動提供減碳策略 |

## 🛠 技術堆疊
*   **Frontend Framework**: React 19
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS v4 (Slate & Emerald Theme)
*   **Visualization**: Recharts
*   **Icons**: Lucide React

## 🚀 快速開始 (Installation & Usage)

請確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18 以上)。

### 1. 取得專案
```bash
git clone https://github.com/Oah0629/green_erp.git
cd green_erp
```

### 2. 安裝依賴套件
```bash
npm install
```

### 3. 啟動開發伺服器
```bash
npm run dev
```
啟動後，請在瀏覽器開啟 `http://localhost:5173` 即可體驗完整功能。

### 4. 建置生產版本
```bash
npm run build
```

## 📂 專案結構
*   `src/App.jsx`: 核心應用程式邏輯與 UI 組件 (Single File Architecture)。
*   `src/index.css`: Tailwind CSS 設定與全域樣式。
*   `mock_data`: (內建於 App.jsx) 模擬的採購、物流與能源數據。

---
Developed for Green ERP Concept Verification.
