import React from 'react';
import { Activity } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface HistoryChartProps {
  data: any[];
  isDarkMode: boolean;
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data, isDarkMode }) => (
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
        <AreaChart data={data}>
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
);
