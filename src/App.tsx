/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Moon,
  Power, 
  Mic, 
  LayoutDashboard, 
  Radio, 
  Settings, 
  Bell, 
  User,
  Activity,
  Lightbulb,
  Wind,
  Zap,
  MicOff,
  History
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// Mock data for the chart
const generateMockHistory = () => {
  const data = [];
  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000 * 60 * 5);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.floor(25 + Math.random() * 5),
      humi: Math.floor(60 + Math.random() * 10),
    });
  }
  return data;
};

export default function App() {
  // State for sensors
  const [sensors, setSensors] = useState({
    temp: 27.5,
    humi: 62,
    light: 420,
    motion: false
  });

  // State for devices
  const [devices, setDevices] = useState({
    led: false,
    fan: false,
    relay: false
  });

  // State for AI
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiResult, setAiResult] = useState("Sẵn sàng nhận lệnh...");
  const [isListening, setIsListening] = useState(false);

  // State for chart data
  const [historyData, setHistoryData] = useState(generateMockHistory());

  // State for temperature unit
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Helper to convert temperature
  const displayTemp = (c: number) => {
    if (tempUnit === 'C') return c;
    return parseFloat((c * 1.8 + 32).toFixed(1));
  };

  // Simulation: Update sensor data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => ({
        ...prev,
        temp: parseFloat((prev.temp + (Math.random() - 0.5) * 0.2).toFixed(1)),
        humi: Math.min(100, Math.max(0, prev.humi + Math.floor((Math.random() - 0.5) * 2))),
        light: Math.max(0, prev.light + Math.floor((Math.random() - 0.5) * 10))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulation: Update history data
  useEffect(() => {
    const interval = setInterval(() => {
      const newEntry = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: sensors.temp,
        humi: sensors.humi,
      };
      setHistoryData(prev => [...prev.slice(1), newEntry]);
    }, 10000);
    return () => clearInterval(interval);
  }, [sensors.temp, sensors.humi]);

  const toggleDevice = (device: keyof typeof devices) => {
    setDevices(prev => ({ ...prev, [device]: !prev[device] }));
  };

  const handleVoiceCommand = () => {
    if (isListening) return;
    
    setIsListening(true);
    setIsAiProcessing(true);
    setAiResult("Đang lắng nghe...");
    
    // Simulate voice recognition delay
    setTimeout(() => {
      const commands = [
        { text: "Bật đèn phòng khách", action: () => setDevices(d => ({ ...d, led: true })) },
        { text: "Tắt quạt đi", action: () => setDevices(d => ({ ...d, fan: false })) },
        { text: "Nhiệt độ hiện tại là bao nhiêu?", action: () => setAiResult(`Nhiệt độ hiện tại là ${displayTemp(sensors.temp)}°${tempUnit}`) },
        { text: "Bật tất cả thiết bị", action: () => setDevices({ led: true, fan: true, relay: true }) }
      ];
      
      const randomCmd = commands[Math.floor(Math.random() * commands.length)];
      setAiResult(`Đã nhận lệnh: "${randomCmd.text}"`);
      randomCmd.action();
      
      setTimeout(() => {
        setIsListening(false);
        setIsAiProcessing(false);
      }, 1500);
    }, 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-blue-100 ${isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar / Navigation (Mobile Friendly) */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t px-6 py-3 flex justify-between items-center md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl hidden sm:block">YoloHome</span>
        </div>
        <div className="flex gap-8">
          <button className="text-blue-600 flex flex-col items-center md:flex-row md:gap-2">
            <Activity size={20} />
            <span className="text-[10px] md:text-sm font-medium">Dashboard</span>
          </button>
          <button className="text-slate-400 hover:text-slate-600 flex flex-col items-center md:flex-row md:gap-2">
            <History size={20} />
            <span className="text-[10px] md:text-sm font-medium">Lịch sử</span>
          </button>
          <button className="text-slate-400 hover:text-slate-600 flex flex-col items-center md:flex-row md:gap-2">
            <Settings size={20} />
            <span className="text-[10px] md:text-sm font-medium">Cài đặt</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="relative text-slate-400 hover:text-slate-600">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
            <User size={18} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-6 pb-24 md:pt-24 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Chào buổi sáng, Nam!</h2>
            <p className="text-slate-500 mt-1">Hệ thống Yolo:Bit của bạn đang hoạt động ổn định.</p>
          </div>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border shadow-sm transition-colors ${isDarkMode ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-sm font-semibold">Đã kết nối OhStem Server</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Sensor Stats */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Temperature Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                className={`p-6 rounded-3xl shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
                    <Thermometer size={24} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${isDarkMode ? 'text-orange-400 bg-orange-500/10' : 'text-orange-500 bg-orange-50'}`}>LIVE</span>
                    <div className={`flex rounded-lg p-0.5 border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                      <button 
                        onClick={() => setTempUnit('C')}
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition-all ${tempUnit === 'C' ? (isDarkMode ? 'bg-slate-700 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        °C
                      </button>
                      <button 
                        onClick={() => setTempUnit('F')}
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition-all ${tempUnit === 'F' ? (isDarkMode ? 'bg-slate-700 text-blue-400 shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        °F
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium">Nhiệt độ</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{displayTemp(sensors.temp)}</h3>
                  <span className="text-slate-400 font-semibold">°{tempUnit}</span>
                </div>
                <div className={`mt-4 h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(sensors.temp / 50) * 100}%` }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </motion.div>

              {/* Humidity Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                className={`p-6 rounded-3xl shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-500'}`}>
                    <Droplets size={24} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${isDarkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-500 bg-blue-50'}`}>LIVE</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">Độ ẩm</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{sensors.humi}</h3>
                  <span className="text-slate-400 font-semibold">%</span>
                </div>
                <div className={`mt-4 h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${sensors.humi}%` }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </motion.div>

              {/* Light Card */}
              <motion.div 
                whileHover={{ y: -4 }}
                className={`p-6 rounded-3xl shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-500'}`}>
                    <Sun size={24} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${isDarkMode ? 'text-yellow-400 bg-yellow-500/10' : 'text-yellow-500 bg-yellow-50'}`}>LIVE</span>
                </div>
                <p className="text-slate-500 text-sm font-medium">Ánh sáng</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{sensors.light}</h3>
                  <span className="text-slate-400 font-semibold">lx</span>
                </div>
                <div className={`mt-4 h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (sensors.light / 1000) * 100)}%` }}
                    className="h-full bg-yellow-500"
                  />
                </div>
              </motion.div>
            </div>

            {/* History Chart */}
            <div className={`p-6 rounded-3xl shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <Activity size={20} className="text-blue-600" /> Biểu đồ lịch sử
                </h3>
                <div className={`flex gap-2 p-1 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <button className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${isDarkMode ? 'bg-slate-700 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>Nhiệt độ</button>
                  <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 rounded-lg">Độ ẩm</button>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData.map(d => ({ ...d, temp: displayTemp(d.temp) }))}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: isDarkMode ? '#64748b' : '#94a3b8' }}
                      minTickGap={30}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: isDarkMode ? '#64748b' : '#94a3b8' }}
                      domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                        color: isDarkMode ? '#ffffff' : '#000000'
                      }}
                      itemStyle={{ color: '#f97316' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorTemp)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Controls & AI */}
          <div className="lg:col-span-4 space-y-6">
            {/* Device Controls */}
            <div className={`p-6 rounded-3xl shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Zap size={20} className="text-yellow-500" /> Điều khiển thiết bị
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'led', name: 'Đèn Thông Minh', icon: Lightbulb, color: 'text-yellow-500', bg: isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50' },
                  { id: 'fan', name: 'Quạt Máy', icon: Wind, color: 'text-blue-500', bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50' },
                  { id: 'relay', name: 'Hệ Thống Tưới', icon: Radio, color: 'text-emerald-500', bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50' }
                ].map((device) => (
                  <div 
                    key={device.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${isDarkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-50 hover:border-slate-100'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${devices[device.id as keyof typeof devices] ? device.bg + ' ' + device.color : (isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-400')}`}>
                        <device.icon size={22} />
                      </div>
                      <div>
                        <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{device.name}</p>
                        <p className="text-xs text-slate-500">{devices[device.id as keyof typeof devices] ? 'Đang bật' : 'Đã tắt'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleDevice(device.id as keyof typeof devices)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        devices[device.id as keyof typeof devices] ? 'bg-blue-600' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-200')
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          devices[device.id as keyof typeof devices] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Voice Assistant */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl shadow-xl text-white overflow-hidden relative">
              {/* Decorative background circles */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Mic size={18} />
                  </div>
                  <h3 className="font-bold">Trợ lý AI Yolo</h3>
                </div>
                
                <div className="flex flex-col items-center py-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVoiceCommand}
                    className={`relative p-8 rounded-full transition-all ${
                      isListening 
                        ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' 
                        : 'bg-white/20 hover:bg-white/30 border border-white/30'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isListening ? (
                        <motion.div
                          key="listening"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                          <Mic size={32} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <Mic size={32} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  
                  <div className="mt-6 text-center min-h-[48px] flex items-center justify-center px-4">
                    <p className={`text-sm font-medium transition-opacity duration-300 ${isAiProcessing ? 'opacity-100' : 'opacity-80'}`}>
                      {aiResult}
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-2">Lệnh phổ biến</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md border border-white/5">"Bật đèn"</span>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md border border-white/5">"Tắt quạt"</span>
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md border border-white/5">"Nhiệt độ?"</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Security */}
            <div className={`p-6 rounded-3xl shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>An ninh & Cảnh báo</h3>
              <div className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className={`p-3 rounded-xl ${sensors.motion ? 'bg-red-100 text-red-500' : (isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400')}`}>
                  <Radio size={20} />
                </div>
                <div>
                  <p className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Cảm biến chuyển động</p>
                  <p className="text-xs text-slate-500">{sensors.motion ? 'Phát hiện chuyển động!' : 'Không có chuyển động'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
