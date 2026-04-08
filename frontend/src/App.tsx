/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Lightbulb,
  Wind,
  Zap,
  Radio
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SensorCard } from './components/SensorCard';
import { DeviceControl } from './components/DeviceControl';
import { HistoryChart } from './components/HistoryChart';
import { AiAssistant } from './components/AiAssistant';
import { Sensors, Devices, HistoryEntry } from './types';
import { apiService } from './services/apiService';

// Mock data for the chart
const generateMockHistory = (): HistoryEntry[] => {
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
  const [sensors, setSensors] = useState<Sensors>({
    temp: 27.5,
    humi: 62,
    light: 420,
    motion: false
  });

  // State for devices
  const [devices, setDevices] = useState<Devices>({
    led: false,
    fan: false,
    relay: false
  });

  // State for AI
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiResult, setAiResult] = useState("Sẵn sàng nhận lệnh...");
  const [isListening, setIsListening] = useState(false);

  // State for chart data
  const [historyData, setHistoryData] = useState<HistoryEntry[]>(generateMockHistory());

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
    const interval = setInterval(async () => {
      // Try to get real data from backend
      const data = await apiService.getSensors();
      if (data) {
        setSensors(prev => ({
          ...prev,
          temp: parseFloat(data.temperature.toFixed(1)),
          humi: Math.floor(data.humidity),
          light: Math.floor(data.light)
        }));
      } else {
        // Fallback to simulation
        setSensors(prev => ({
          ...prev,
          temp: parseFloat((prev.temp + (Math.random() - 0.5) * 0.2).toFixed(1)),
          humi: Math.min(100, Math.max(0, prev.humi + Math.floor((Math.random() - 0.5) * 2))),
          light: Math.max(0, prev.light + Math.floor((Math.random() - 0.5) * 10))
        }));
      }
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

  const toggleDevice = (device: keyof Devices) => {
    const newState = !devices[device];
    setDevices(prev => ({ ...prev, [device]: newState }));
    apiService.toggleDevice(device, newState);
  };

  const handleVoiceCommand = () => {
    if (isListening) return;
    
    setIsListening(true);
    setIsAiProcessing(true);
    setAiResult("Đang lắng nghe...");
    
    // Simulate voice recognition delay
    setTimeout(() => {
      const commands = [
        { text: "Bật đèn phòng khách", action: () => toggleDevice('led') },
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

  const chartData = useMemo(() => 
    historyData.map(d => ({ ...d, temp: displayTemp(d.temp) })), 
  [historyData, tempUnit]);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-blue-100 ${isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

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
              <SensorCard 
                title="Nhiệt độ"
                value={displayTemp(sensors.temp)}
                unit={`°${tempUnit}`}
                icon={Thermometer}
                colorClass="text-orange-500"
                bgClass={isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'}
                progress={(sensors.temp / 50) * 100}
                isDarkMode={isDarkMode}
              >
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
              </SensorCard>

              <SensorCard 
                title="Độ ẩm"
                value={sensors.humi}
                unit="%"
                icon={Droplets}
                colorClass="text-blue-500"
                bgClass={isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}
                progress={sensors.humi}
                isDarkMode={isDarkMode}
              />

              <SensorCard 
                title="Ánh sáng"
                value={sensors.light}
                unit="lx"
                icon={Sun}
                colorClass="text-yellow-500"
                bgClass={isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'}
                progress={Math.min(100, (sensors.light / 1000) * 100)}
                isDarkMode={isDarkMode}
              />
            </div>

            <HistoryChart data={chartData} isDarkMode={isDarkMode} />
          </div>

          {/* Right Column: Controls & AI */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 rounded-3xl shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Zap size={20} className="text-yellow-500" /> Điều khiển thiết bị
              </h3>
              <div className="space-y-4">
                <DeviceControl 
                  id="led" name="Đèn Thông Minh" icon={Lightbulb} color="text-yellow-500" 
                  bg={isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50'} isActive={devices.led} 
                  onToggle={() => toggleDevice('led')} isDarkMode={isDarkMode} 
                />
                <DeviceControl 
                  id="fan" name="Quạt Máy" icon={Wind} color="text-blue-500" 
                  bg={isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} isActive={devices.fan} 
                  onToggle={() => toggleDevice('fan')} isDarkMode={isDarkMode} 
                />
                <DeviceControl 
                  id="relay" name="Hệ Thống Tưới" icon={Radio} color="text-emerald-500" 
                  bg={isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} isActive={devices.relay} 
                  onToggle={() => toggleDevice('relay')} isDarkMode={isDarkMode} 
                />
              </div>
            </div>

            <AiAssistant 
              isListening={isListening} isAiProcessing={isAiProcessing} 
              aiResult={aiResult} onVoiceCommand={handleVoiceCommand} 
            />

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
