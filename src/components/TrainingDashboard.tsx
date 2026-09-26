import { useEffect, useRef, useState } from "react";
import { 
  Activity, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Terminal, 
  Clock, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Pause,
  Layers
} from "lucide-react";

interface TrainingDashboardProps {
  imageUrl: string;
  alt: string;
}

export default function TrainingDashboard({ imageUrl, alt }: TrainingDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(60); // in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [activeTab, setActiveTab] = useState<"visual" | "metrics" | "logs">("visual");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerRefresh();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, isPaused]);

  // Handle browser fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimestamp(Date.now());
    setImageLoaded(false);
    setImageError(false);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
    setCountdown(refreshInterval);
  };

  const handleManualRefresh = () => {
    triggerRefresh();
  };

  const src = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}_t=${timestamp}`;

  // Simulated log entries
  const [logs, setLogs] = useState<string[]>([
    "[2026-09-26 14:30:12] [INFO] Initializing distributed training cluster (H100 x8)...",
    "[2026-09-26 14:30:45] [INFO] Dataset loaded: SparksLyse-OpenCorpus-v3 (1.2 TB tokens)",
    "[2026-09-26 14:31:02] [SUCCESS] Model architecture compiled: LyseAI-7B-Instruct",
    "[2026-09-26 14:31:30] [INFO] Starting Epoch 42/100 - Batch size: 1024 - LR: 1.2e-4",
    "[2026-09-26 14:32:05] [METRIC] Step 4200/10000 - Loss: 0.0342 - Perplexity: 1.034 - GradNorm: 0.412",
    "[2026-09-26 14:33:10] [CHECKPOINT] Checkpoint saved successfully to s3://lyse-weights/v1.4/ep42"
  ]);

  // Simulate appending new log entries periodically
  useEffect(() => {
    const logInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const losses = (0.03 + Math.random() * 0.01).toFixed(4);
      const steps = Math.floor(4200 + Math.random() * 50);
      const newLog = `[${timeStr}] [METRIC] Step ${steps}/10000 - Loss: ${losses} - Token/s: 14,250`;
      setLogs(prev => [...prev.slice(-15), newLog]);
    }, 15000);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-6xl mx-auto transition-all duration-300 ${isFullscreen ? "bg-[#0a0a0a] p-4 sm:p-8 overflow-y-auto flex flex-col h-screen max-w-none" : ""}`}
    >
      {/* Dashboard Top Bar & Controls */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#141414] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8ff9c]/75 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e8ff9c]"></span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              LyseAI-v1.4 Live Cluster 
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e8ff9c]/10 text-[#e8ff9c] border border-[#e8ff9c]/20 font-mono">
                EN DIRECT
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Surveillance en temps réel des poids, de la loss et de la télémétrie GPU.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
          {/* Interval Selector */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Maj:</span>
            <select 
              value={refreshInterval}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRefreshInterval(val);
                setCountdown(val);
              }}
              className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
            >
              <option value={15} className="bg-zinc-900">15s</option>
              <option value={30} className="bg-zinc-900">30s</option>
              <option value={60} className="bg-zinc-900">1m</option>
              <option value={300} className="bg-zinc-900">5m</option>
            </select>
          </div>

          {/* Pause / Resume Auto-refresh */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Reprendre le rafraîchissement" : "Mettre en pause"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isPaused 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20" 
                : "bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPaused ? "En pause" : `${countdown}s`}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[#e8ff9c] text-[#0a0a0a] hover:bg-[#d4eb85] transition-all disabled:opacity-50 cursor-pointer font-semibold shadow-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
            className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3 relative z-10">
        <button
          onClick={() => setActiveTab("visual")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === "visual"
              ? "bg-white/10 text-white border border-white/20 shadow-md"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Activity className="w-4 h-4 text-[#e8ff9c]" />
          <span>Flux Visuel en Direct</span>
        </button>

        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === "metrics"
              ? "bg-white/10 text-white border border-white/20 shadow-md"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Cpu className="w-4 h-4 text-[#e8ff9c]" />
          <span>Métriques & Clusters</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            activeTab === "logs"
              ? "bg-white/10 text-white border border-white/20 shadow-md"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Terminal className="w-4 h-4 text-[#e8ff9c]" />
          <span>Logs de Télémétrie</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10">
        {/* Telemetry Daemon Header (No Apple dots) */}
        <div className="bg-[#1a1a1a] px-4 py-3 border-b border-white/10 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-[#e8ff9c]/10 border border-[#e8ff9c]/20 text-[#e8ff9c] font-bold">DAEMON</span>
            <span className="text-zinc-400">cluster-node-03.lyseai.internal:/var/log/training_monitor.png</span>
          </div>
          <div className="flex items-center gap-2 text-[#e8ff9c]">
            <span className="w-2 h-2 rounded-full bg-[#e8ff9c] animate-pulse"></span>
            <span>Sync: {new Date(timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Tab 1: Visual Feed */}
        {activeTab === "visual" && (
          <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[450px] relative">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#141414]/80 backdrop-blur-sm z-10 gap-3">
                <RefreshCw className="w-8 h-8 text-[#e8ff9c] animate-spin" />
                <p className="text-sm font-mono text-zinc-300">Chargement du flux télémétrique...</p>
              </div>
            )}

            {imageError ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-white font-medium">Impossible de charger le flux en direct</p>
                  <p className="text-xs text-zinc-400 mt-1">Le serveur distant est peut-être temporairement injoignable.</p>
                </div>
                <button
                  onClick={handleManualRefresh}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Réessayer la connexion
                </button>
              </div>
            ) : (
              <div className="relative group w-full flex justify-center items-center">
                <img
                  src={src}
                  alt={alt}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(true);
                    setImageError(true);
                  }}
                  className={`max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Metrics & Clusters */}
        {activeTab === "metrics" && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric Card 1 */}
            <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Perte d'entraînement (Loss)</span>
                <Activity className="w-4 h-4 text-[#e8ff9c]" />
              </div>
              <div className="text-3xl font-bold font-mono text-white mb-1">0.0342</div>
              <div className="flex items-center gap-1.5 text-xs text-[#e8ff9c]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>-12.4% vs epoch précédente</span>
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Charge GPU Cluster</span>
                <Cpu className="w-4 h-4 text-[#e8ff9c]" />
              </div>
              <div className="text-3xl font-bold font-mono text-white mb-1">98.4%</div>
              <div className="text-xs text-zinc-400">8x NVIDIA H100 (640 GB VRAM total)</div>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Vitesse d'Inférence</span>
                <Zap className="w-4 h-4 text-[#e8ff9c]" />
              </div>
              <div className="text-3xl font-bold font-mono text-white mb-1">14,250</div>
              <div className="text-xs text-zinc-400">Tokens traités par seconde</div>
            </div>

            {/* Detailed Cluster Specs */}
            <div className="md:col-span-3 bg-zinc-900/50 border border-white/10 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#e8ff9c]" />
                <span>Spécifications du pipeline d'entraînement Open-Source</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                  <span className="text-zinc-500 block mb-1">Architecture</span>
                  <span className="text-zinc-200 font-semibold">LyseAI-7B Transformer</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                  <span className="text-zinc-500 block mb-1">Dataset d'entraînement</span>
                  <span className="text-zinc-200 font-semibold">SparksLyse-OpenCorpus-v3</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                  <span className="text-zinc-500 block mb-1">Optimiseur</span>
                  <span className="text-zinc-200 font-semibold">AdamW (β1=0.9, β2=0.95)</span>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                  <span className="text-zinc-500 block mb-1">Époque Actuelle</span>
                  <span className="text-zinc-200 font-semibold">42 / 100 (Step 4,200)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Terminal Logs */}
        {activeTab === "logs" && (
          <div className="p-4 sm:p-6 bg-zinc-950 font-mono text-xs text-zinc-300 min-h-[400px] max-h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-zinc-500">
              <span>Flux de sortie standard (stdout) - Cluster Training Daemon</span>
              <span>UTF-8 · Live Stream</span>
            </div>
            <div className="space-y-2">
              {logs.map((log, index) => {
                const isSuccess = log.includes("SUCCESS") || log.includes("CHECKPOINT");
                const isMetric = log.includes("METRIC");
                return (
                  <div 
                    key={index} 
                    className={`p-2 rounded font-mono ${
                      isSuccess 
                        ? "bg-[#e8ff9c]/10 text-[#e8ff9c] border border-[#e8ff9c]/20" 
                        : isMetric 
                        ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                        : "bg-zinc-900/60 text-zinc-300"
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
