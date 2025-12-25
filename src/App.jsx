import React, { useState } from 'react';
import {
  Database,
  Server,
  BarChart2,
  Leaf,
  CheckCircle,
  AlertTriangle,
  Loader,
  ArrowUpRight,
  ArrowDownRight,
  Cpu,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- Multi-language Dictionary ---

const TRANSLATIONS = {
  en: {
    appTitle: "Green ERP",
    appSubtitle: "Concept Verification",
    nav: {
      integration: "Integration",
      processing: "Processing",
      dashboard: "Dashboard"
    },
    integration: {
      card1Title: "SAP S/4HANA",
      card1Type: "Core ERP",
      card2Title: "IoT Energy Grid",
      card2Type: "Smart Metering",
      card3Title: "DHL Logistics",
      card3Type: "Supply Chain API",
      statusConnected: "Connected",
      statusSyncing: "Syncing",
      rawPreview: "Incoming Data Stream (Preview)",
      proceedBtn: "Proceed to ETL Engine"
    },
    processing: {
      idleTitle: "Ready to Process",
      idleDesc: "Transform raw ERP data into standardized Scope 1, 2, & 3 emission events using the emission factor database.",
      startBtn: "Start ETL Auto-Correction",
      processingTitle: "Processing Pipeline Active...",
      completeTitle: "Transformation Complete.",
      eventsGenerated: "events generated",
      tableHeader: {
        id: "Event ID",
        type: "Type",
        source: "Activity Source",
        carbon: "Carbon (kgCO2e)",
        status: "Status"
      },
      statusNormal: "Normal",
      viewDashboardBtn: "View Decision Dashboard"
    },
    dashboard: {
      kpi1: "Monthly Emission",
      kpi2: "Carbon Intensity",
      kpi3: "High Risk Suppliers",
      kpi4: "Automation Rate",
      trendSuffix: "vs last month",
      chartAreaTitle: "Emission Trend (6 Months)",
      chartPieTitle: "Scope Breakdown",
      aiTitle: "AI Optimization Insight",
      aiBadge: "New",
      aiDesc1: "Detection: High emission spike in ",
      aiDesc2: "Logistics (Air-Freight)",
      aiDesc3: ". Suggestion: Switching PO-2023-003 to ",
      aiDesc4: "Sea Freight",
      aiDesc5: " would reduce Scope 3 emissions by ",
      aiDesc6: " (Estimated saving: 12,400 kgCO2e)",
      btnSimulate: "Simulate Change",
      btnDismiss: "Dismiss"
    },
    logs: {
      l1: "Connecting to SAP ERP module...",
      l2: "Fetching Purchase Orders (PO-2023-00*) ... Done",
      l3: "Connecting to IoT Energy Meters ... Done",
      l4: " Retrieving Logistics Manifests ... Done",
      l5: "Applying Emission Factor 1.85 to Steel Sheet...",
      l6: "Applying Emission Factor 0.495 to Electricity...",
      l7: "WARNING: Air-Freight detected (High Emission Factor)",
      l8: "Calculating partial footprint...",
      l9: "Aggregating Scope 2 & 3 data...",
      l10: "Finalizing data warehouse sync..."
    }
  },
  zh: {
    appTitle: "Green ERP",
    appSubtitle: "概念驗證系統",
    nav: {
      integration: "資料整合",
      processing: "運算核心",
      dashboard: "決策看板"
    },
    integration: {
      card1Title: "SAP S/4HANA",
      card1Type: "企業核心 ERP",
      card2Title: "IoT 智慧電網",
      card2Type: "智慧電表讀取",
      card3Title: "DHL 物流系統",
      card3Type: "供應鏈 API",
      statusConnected: "已連線",
      statusSyncing: "同步中",
      rawPreview: "原始資料串流預覽 (JSON)",
      proceedBtn: "啟動 ETL 運算引擎"
    },
    processing: {
      idleTitle: "準備就緒",
      idleDesc: "系統將自動讀取 ERP 原始數據，並依據係數庫轉換為標準化 Scope 1, 2, 3 碳排事件。",
      startBtn: "啟動 ETL 自動轉換",
      processingTitle: "資料處理管線執行中...",
      completeTitle: "轉換作業完成",
      eventsGenerated: "筆事件已生成",
      tableHeader: {
        id: "事件 ID",
        type: "排放範疇",
        source: "活動來源",
        carbon: "碳排量 (kgCO2e)",
        status: "狀態"
      },
      statusNormal: "正常",
      viewDashboardBtn: "查看決策分析看板"
    },
    dashboard: {
      kpi1: "本月總碳排",
      kpi2: "碳排放強度",
      kpi3: "高風險供應商",
      kpi4: "自動化覆蓋率",
      trendSuffix: "與上月相比",
      chartAreaTitle: "碳排趨勢分析 (近6個月)",
      chartPieTitle: "範疇佔比分析 (Scope 1-3)",
      aiTitle: "AI 供應鏈優化建議",
      aiBadge: "新訊",
      aiDesc1: "異常偵測：在 ",
      aiDesc2: "物流 (空運)",
      aiDesc3: " 發現碳排峰值。建議方案：將 PO-2023-003 改為 ",
      aiDesc4: "海運",
      aiDesc5: " 可減少 Scope 3 碳排約 ",
      aiDesc6: " (預估節省：12,400 kgCO2e)",
      btnSimulate: "模擬變更效果",
      btnDismiss: "忽略"
    },
    logs: {
      l1: "正在連線至 SAP ERP 模組...",
      l2: "讀取採購訂單 (PO-2023-00*) ... 完成",
      l3: "連線至 IoT 智慧電表群 ... 完成",
      l4: "檢索物流運輸清單 ... 完成",
      l5: "正在套用係數 1.85 於 鋼材原料...",
      l6: "正在套用係數 0.495 於 電力消耗...",
      l7: "警告：偵測到空運項目 (高排放係數)",
      l8: "計算局部碳足跡中...",
      l9: "聚合 Scope 2 & 3 數據...",
      l10: "正在完成資料倉儲同步..."
    }
  }
};

// --- Stub Data & Constants ---

const MOCK_RAW_ERP_DATA = {
  purchases: [
    { po_id: 'PO-2023-001', item: 'Steel Sheet - Grade A', qty: 5000, unit: 'kg', supplier: 'MetalCorp' },
    { po_id: 'PO-2023-002', item: 'Corrugated Box', qty: 12000, unit: 'pcs', supplier: 'PackSol' },
    { po_id: 'PO-2023-003', item: 'IC Logic Unit', qty: 25000, unit: 'units', supplier: 'TechChip' },
  ],
  logistics: [
    { ship_id: 'SH-9921', type: 'Truck-15t', distance: 120, route: 'Warehouse -> Plant' },
    { ship_id: 'SH-9922', type: 'Air-Freight', distance: 8500, route: 'Shenzhen -> LA' },
  ],
  energy: [
    { meter_id: 'M-001', type: 'Electricity', reading: 4500.5, unit: 'kWh' },
    { meter_id: 'M-002', type: 'NaturalGas', reading: 120.0, unit: 'm3' },
  ]
};

const EMISSION_FACTORS = {
  'Steel Sheet - Grade A': 1.85,
  'Corrugated Box': 0.12,
  'IC Logic Unit': 0.55,
  'Truck-15t': 0.08,
  'Air-Freight': 15.0,
  'Electricity': 0.495,
  'NaturalGas': 2.2,
};

// --- Sub-Components ---

const LeafIcon = ({ className }) => (
  <Leaf className={`text-emerald-500 ${className}`} />
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${active
        ? 'bg-emerald-100 text-emerald-700 shadow-sm'
        : 'text-slate-500 hover:bg-slate-100'
      }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const SystemCard = ({ name, type, status, statusText, statusSyncingText }) => {
  const isConnected = status === 'Connected';
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isConnected ? 'bg-emerald-50' : 'bg-blue-50'}`}>
          <Database size={20} className={isConnected ? 'text-emerald-500' : 'text-blue-500'} />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800">{name}</h4>
          <p className="text-xs text-slate-400">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
        <span className="text-sm font-medium text-slate-600">
          {isConnected ? statusText : statusSyncingText}
        </span>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, trend, trendDir, icon: Icon, colorClass, suffix }) => (
  <div className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className={`flex items-center text-sm ${trendDir === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
      {trendDir === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      <span className="font-semibold ml-1">{trend}</span>
      <span className="text-slate-400 ml-1 font-normal">{suffix}</span>
    </div>
  </div>
);

// --- Main Application ---

function App() {
  const [activeTab, setActiveTab] = useState('integration');
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [logs, setLogs] = useState([]);
  const [processedEvents, setProcessedEvents] = useState([]);
  const [lang, setLang] = useState('zh'); // Default to Chinese as per request context implication, or toggleable

  const t = TRANSLATIONS[lang]; // Helper for current language

  // Mock Dashboard Data
  const areaData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ];

  const pieData = [
    { name: 'Scope 1', value: 400 },
    { name: 'Scope 2', value: 300 },
    { name: 'Scope 3', value: 300 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const processData = () => {
    setProcessingStatus('processing');
    setLogs([]);
    setProcessedEvents([]);

    const logMessages = [
      t.logs.l1, t.logs.l2, t.logs.l3, t.logs.l4, t.logs.l5,
      t.logs.l6, t.logs.l7, t.logs.l8, t.logs.l9, t.logs.l10
    ];

    let logIndex = 0;

    // Simulate Log streaming
    const logInterval = setInterval(() => {
      if (logIndex < logMessages.length) {
        setLogs(prev => [...prev, logMessages[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 150);

    setTimeout(() => {
      const results = [];
      let idCounter = 1;

      // Logic remains same, but we push results. 
      // Note: "activity" text typically comes from data, but we can wrap static parts if needed.
      // For this demo, we'll keep the dynamic data parts in English (from MOCK_RAW_ERP_DATA) 
      // but the prefixes can be localized if we wanted. 
      // However, to keep it simple, we will keep the activity string as constructed from data.

      // 1. Process Purchases
      MOCK_RAW_ERP_DATA.purchases.forEach(p => {
        const factor = EMISSION_FACTORS[p.item] || 0;
        const totalCarbon = p.qty * factor;
        results.push({
          id: `EV-${String(idCounter++).padStart(4, '0')}`,
          type: 'Scope 3',
          activity: `Procurement: ${p.item}`,
          carbon: totalCarbon.toFixed(1),
          status: totalCarbon > 5000 ? 'Warning' : 'Normal',
        });
      });

      // 2. Process Logistics
      MOCK_RAW_ERP_DATA.logistics.forEach(l => {
        const factor = EMISSION_FACTORS[l.type] || 0;
        const totalCarbon = l.distance * factor;
        results.push({
          id: `EV-${String(idCounter++).padStart(4, '0')}`,
          type: 'Scope 3',
          activity: `Logistics: ${l.type} (${l.route})`,
          carbon: totalCarbon.toFixed(1),
          status: totalCarbon > 10000 ? 'Critical' : 'Normal',
        });
      });

      // 3. Process Energy
      MOCK_RAW_ERP_DATA.energy.forEach(e => {
        const factor = EMISSION_FACTORS[e.type] || 0;
        const totalCarbon = e.reading * factor;
        results.push({
          id: `EV-${String(idCounter++).padStart(4, '0')}`,
          type: 'Scope 2',
          activity: `Energy: ${e.type}`,
          carbon: totalCarbon.toFixed(1),
          status: totalCarbon > 2000 ? 'Warning' : 'Normal',
        });
      });

      setProcessedEvents(results);
      setProcessingStatus('complete');
      clearInterval(logInterval);
      setLogs(logMessages);
    }, 1500);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <LeafIcon className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800">{t.appTitle}</h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{t.appSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <nav className="flex gap-2">
                <TabButton
                  active={activeTab === 'integration'}
                  onClick={() => setActiveTab('integration')}
                  icon={Database}
                  label={t.nav.integration}
                />
                <TabButton
                  active={activeTab === 'processing'}
                  onClick={() => setActiveTab('processing')}
                  icon={Server}
                  label={t.nav.processing}
                />
                <TabButton
                  active={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                  icon={BarChart2}
                  label={t.nav.dashboard}
                />
              </nav>

              <button
                onClick={toggleLang}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                title="Switch Language / 切換語言"
              >
                <Globe size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TAB 1: INTEGRATION */}
        {activeTab === 'integration' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SystemCard
                name={t.integration.card1Title}
                type={t.integration.card1Type}
                status="Connected"
                statusText={t.integration.statusConnected}
                statusSyncingText={t.integration.statusSyncing}
              />
              <SystemCard
                name={t.integration.card2Title}
                type={t.integration.card2Type}
                status="Syncing"
                statusText={t.integration.statusConnected}
                statusSyncingText={t.integration.statusSyncing}
              />
              <SystemCard
                name={t.integration.card3Title}
                type={t.integration.card3Type}
                status="Connected"
                statusText={t.integration.statusConnected}
                statusSyncingText={t.integration.statusSyncing}
              />
            </div>

            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700">
              <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                <span className="text-xs font-mono text-emerald-400">{t.integration.rawPreview}</span>
                <span className="text-[10px] font-mono text-slate-500">JSON</span>
              </div>
              <pre className="p-6 text-xs md:text-sm font-mono text-slate-300 overflow-x-auto">
                {JSON.stringify(MOCK_RAW_ERP_DATA, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('processing')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                {t.integration.proceedBtn} <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PROCESSING */}
        {activeTab === 'processing' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {processingStatus === 'idle' && (
              <div className="text-center py-20">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 inline-block">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Cpu size={48} className="text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.processing.idleTitle}</h2>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    {t.processing.idleDesc}
                  </p>
                  <button
                    onClick={processData}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4 rounded-xl font-bold shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    {t.processing.startBtn}
                  </button>
                </div>
              </div>
            )}

            {processingStatus === 'processing' && (
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 font-mono text-sm">
                <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
                  <Loader size={18} className="text-emerald-500 animate-spin" />
                  <span className="text-slate-200">{t.processing.processingTitle}</span>
                </div>
                <div className="p-6 h-96 overflow-y-auto space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className="text-emerald-500 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                      {log}
                    </div>
                  ))}
                  <div className="w-3 h-5 bg-emerald-500 animate-pulse inline-block align-middle ml-1" />
                </div>
              </div>
            )}

            {processingStatus === 'complete' && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800">
                  <CheckCircle size={24} className="text-emerald-500" />
                  <span className="font-semibold">{t.processing.completeTitle}</span>
                  <span className="ml-auto text-sm opacity-75">{processedEvents.length} {t.processing.eventsGenerated}</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 font-medium">{t.processing.tableHeader.id}</th>
                        <th className="px-6 py-3 font-medium">{t.processing.tableHeader.type}</th>
                        <th className="px-6 py-3 font-medium">{t.processing.tableHeader.source}</th>
                        <th className="px-6 py-3 font-medium text-right">{t.processing.tableHeader.carbon}</th>
                        <th className="px-6 py-3 font-medium">{t.processing.tableHeader.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {processedEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-slate-600">{event.id}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${event.type === 'Scope 2' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                              {event.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-800">{event.activity}</td>
                          <td className="px-6 py-4 text-right font-mono font-medium">{event.carbon}</td>
                          <td className="px-6 py-4">
                            {event.status === 'Normal' ? (
                              <span className="inline-flex items-center gap-1 text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded">
                                {t.processing.statusNormal}
                              </span>
                            ) : (
                              <span className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-1 rounded
                                ${event.status === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>
                                <AlertTriangle size={12} /> {event.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2"
                  >
                    {t.processing.viewDashboardBtn} <BarChart2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title={t.dashboard.kpi1}
                value="42.5t"
                trend="12%"
                trendDir="up"
                icon={Leaf}
                colorClass="bg-emerald-500"
                suffix={t.dashboard.trendSuffix}
              />
              <KPICard
                title={t.dashboard.kpi2}
                value="1.2 kg"
                trend="5%"
                trendDir="down"
                icon={BarChart2}
                colorClass="bg-blue-500"
                suffix={t.dashboard.trendSuffix}
              />
              <KPICard
                title={t.dashboard.kpi3}
                value="3"
                trend="1"
                trendDir="up"
                icon={AlertTriangle}
                colorClass="bg-rose-500"
                suffix={t.dashboard.trendSuffix}
              />
              <KPICard
                title={t.dashboard.kpi4}
                value="98%"
                trend="2%"
                trendDir="up"
                icon={Cpu}
                colorClass="bg-purple-500"
                suffix={t.dashboard.trendSuffix}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
                <h3 className="text-lg font-bold text-slate-800 mb-6">{t.dashboard.chartAreaTitle}</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96">
                <h3 className="text-lg font-bold text-slate-800 mb-6">{t.dashboard.chartPieTitle}</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl text-white flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Cpu size={24} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                  {t.dashboard.aiTitle}
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">{t.dashboard.aiBadge}</span>
                </h4>
                <p className="text-slate-300 leading-relaxed max-w-2xl">
                  {t.dashboard.aiDesc1}
                  <span className="text-white font-semibold">{t.dashboard.aiDesc2}</span>
                  {t.dashboard.aiDesc3}
                  <span className="text-emerald-300 font-semibold">{t.dashboard.aiDesc4}</span>
                  {t.dashboard.aiDesc5}
                  <span className="text-emerald-300 font-semibold">85%</span>
                  {t.dashboard.aiDesc6}
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    {t.dashboard.btnSimulate}
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    {t.dashboard.btnDismiss}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
