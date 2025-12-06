
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, ReferenceLine, Legend, ScatterChart, Scatter, ZAxis, LineChart, Line } from 'recharts';
import { SimulationResult, PivotSuggestion } from '../types';

interface SimulationDashboardProps {
  result: SimulationResult;
  onApplyPivot: (pivot: PivotSuggestion) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Icons = {
  Chart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="8" y1="12" y2="16"/><line x1="16" x2="16" y1="6" y2="16"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Money: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Trending: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md p-3 border border-white/10 shadow-2xl rounded-xl">
        {label && <p className="text-slate-300 text-xs mb-1 font-medium">{label}</p>}
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="font-bold text-white text-sm" style={{ color: entry.color || '#fff' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const GanttChart = ({ schedule }: { schedule: any[] }) => {
  if (!schedule || schedule.length === 0) {
    const dummy = [
      { task: "Context Analysis", startMonth: 0, durationMonths: 2, type: 'planning' },
      { task: "Team Recruitment", startMonth: 1, durationMonths: 2, type: 'planning' },
      { task: "Pilot Launch", startMonth: 3, durationMonths: 3, type: 'execution' },
      { task: "Mid-term Review", startMonth: 5, durationMonths: 1, type: 'milestone' },
      { task: "Scale Operations", startMonth: 6, durationMonths: 4, type: 'execution' },
      { task: "Impact Eval", startMonth: 9, durationMonths: 2, type: 'planning' }
    ];
    schedule = dummy;
  }
  const totalMonths = Math.max(...schedule.map(s => s.startMonth + s.durationMonths)) + 1;
  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-2">
      <div className="min-w-[500px] relative mt-6">
        <div className="flex border-b border-gray-100 pb-2 mb-4">
          <div className="w-1/4 font-bold text-xs text-gray-400 uppercase tracking-wider">Task Phase</div>
          <div className="w-3/4 flex relative">
            {Array.from({ length: totalMonths }).map((_, i) => (
              <div key={i} className="flex-1 text-[10px] text-center text-gray-300 border-l border-gray-50 h-full">M{i+1}</div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {schedule.map((item, idx) => (
            <div key={idx} className="flex items-center group">
              <div className="w-1/4 pr-4">
                <div className="text-xs font-bold text-slate-700 truncate" title={item.task}>{item.task}</div>
                <div className="text-[10px] text-gray-400 uppercase">{item.type}</div>
              </div>
              <div className="w-3/4 h-8 bg-gray-50 rounded-lg relative overflow-hidden">
                 <div className="absolute inset-0 flex w-full h-full pointer-events-none">
                    {Array.from({ length: totalMonths }).map((_, i) => (
                       <div key={i} className="flex-1 border-r border-gray-100 h-full"></div>
                    ))}
                 </div>
                 <div 
                   className={`absolute h-4 top-2 rounded-full shadow-sm transition-all duration-500 hover:scale-y-110 cursor-pointer
                     ${item.type === 'planning' ? 'bg-blue-400' : item.type === 'execution' ? 'bg-emerald-400' : 'bg-amber-400 rotate-45 w-4! h-4! top-2 rounded-sm'}`}
                   style={{
                     left: `${(item.startMonth / totalMonths) * 100}%`,
                     width: item.type === 'milestone' ? '16px' : `${(item.durationMonths / totalMonths) * 100}%`
                   }}
                 >
                    {item.type !== 'milestone' && (
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-0 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded transition-opacity whitespace-nowrap z-10">
                            {item.durationMonths} Mo
                        </div>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ result, onApplyPivot }) => {
  if (!result) return null;

  const scoreColor = result.overallScore >= 80 ? 'text-emerald-500' : result.overallScore >= 50 ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up">
        <div className="glass-panel p-6 rounded-2xl border border-white/60 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Feasibility Index</p>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-6xl font-extrabold ${scoreColor} tracking-tighter`}>{result.overallScore}</h2>
            <span className="text-sm font-bold text-slate-400">/100</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className={`h-2 w-full bg-gray-100 rounded-full overflow-hidden`}>
              <div className={`h-full rounded-full ${scoreColor.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${result.overallScore}%` }}></div>
            </div>
          </div>
          <p className="text-sm mt-3 text-slate-600 font-medium">{result.overallScore > 65 ? 'Project viable with minor risks.' : 'Major restructuring recommended.'}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/60 shadow-lg hover:translate-y-[-2px] transition-transform duration-300">
           <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Community Buy-in</p>
                <h2 className="text-4xl font-extrabold text-slate-800">{result.communitySentiment}%</h2>
              </div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Icons.Users /></div>
           </div>
           <p className="text-sm text-slate-500">Predicted acceptance rate based on cultural alignment.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/60 shadow-lg hover:translate-y-[-2px] transition-transform duration-300">
           <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Sustainability</p>
                <h2 className="text-4xl font-extrabold text-slate-800">{result.sustainabilityScore}%</h2>
              </div>
              <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><Icons.Trending /></div>
           </div>
           <p className="text-sm text-slate-500">Long-term viability post-funding analysis.</p>
        </div>
      </div>

      {/* 2. Narrative & Wins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl shadow-lg border border-white/60">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600"><Icons.Target /></span>
             Executive AI Summary
          </h3>
          <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed bg-white/50 p-6 rounded-xl border border-white shadow-inner">
            {result.narrative}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/60 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"><Icons.Shield /></span>
            Key Wins
          </h3>
          <div className="flex-grow space-y-3 overflow-y-auto custom-scrollbar pr-2 max-h-[250px]">
            {result.successFactors?.map((factor, idx) => (
              <div key={idx} className="flex gap-3 text-sm text-slate-600 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                <div className="mt-0.5 text-emerald-500 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Gantt Chart */}
      <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/60 animate-fade-in-up delay-200">
         <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600"><Icons.Calendar /></span>
            Project Implementation Schedule
         </h3>
         <GanttChart schedule={result.schedule} />
      </div>

      {/* 4. Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-300">
        <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/60 h-[380px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Icons.Trending /> Sentiment Forecast</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.timeline}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 100]} tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sentimentScore" stroke="#3b82f6" strokeWidth={3} fill="url(#colorSentiment)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/60 h-[380px] flex flex-col">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Icons.Users /> Stakeholder Map</h3>
           <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={result.stakeholderAnalysis} margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[-100, 100]} hide />
                <YAxis dataKey="group" type="category" width={100} tick={{fontSize: 10, fontWeight: 600, fill: '#475569'}} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={0} stroke="#cbd5e1" strokeDasharray="3 3" />
                <Bar dataKey="sentiment" barSize={20} radius={[4, 4, 4, 4]}>
                  {result.stakeholderAnalysis?.map((entry, index) => {
                    let color = '#94a3b8';
                    if (entry.sentiment > 25) color = '#10b981';
                    if (entry.sentiment < -25) color = '#ef4444';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Metrics & Critical Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-400">
        <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/60 h-[400px] flex flex-col">
           <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Icons.Target /> Feasibility Metrics</h3>
           <div className="flex-grow -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.metrics}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="Score" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Scatter */}
            <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/60 h-[400px] flex flex-col">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Icons.Alert /> Risk Matrix</h3>
              <div className="flex-grow">
                 <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" dataKey="likelihood" name="Likelihood" domain={[0, 10]} tick={{fontSize: 10}} label={{ value: 'Likelihood', position: 'bottom', offset: 0, fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis type="number" dataKey="severity" name="Severity" domain={[0, 10]} tick={{fontSize: 10}} label={{ value: 'Severity', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
                      <ZAxis range={[60, 200]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                      <Scatter name="Risks" data={result.riskAnalysis} fill="#ef4444">
                         {result.riskAnalysis?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.severity > 7 ? '#ef4444' : entry.severity > 4 ? '#f59e0b' : '#3b82f6'} />
                         ))}
                      </Scatter>
                    </ScatterChart>
                 </ResponsiveContainer>
              </div>
            </div>

            {/* NEW: Critical Risks List */}
            <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/60 h-[400px] flex flex-col">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Icons.Alert /> Critical Risks & Mitigation</h3>
               <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-3">
                 {result.risks?.map((risk, idx) => (
                   <div key={idx} className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                      <div className="flex gap-2">
                        <span className="text-rose-500 mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                        <p className="text-sm text-slate-700 leading-snug">{risk}</p>
                      </div>
                   </div>
                 ))}
                 {(!result.risks || result.risks.length === 0) && (
                    <p className="text-sm text-slate-400 italic">No critical risks identified.</p>
                 )}
               </div>
            </div>
        </div>
      </div>

      {/* 6. Pivots */}
      <div className="glass-panel p-8 rounded-2xl border border-white/60 animate-fade-in-up delay-500 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2"><Icons.Zap /> AI Recommended Pivots</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.pivots?.map((pivot, idx) => (
            <button key={idx} onClick={() => onApplyPivot(pivot)} className="relative text-left bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-transparent hover:border-indigo-200 overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
              <div className="mb-3"><span className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{pivot.title}</span></div>
              <p className="text-sm text-slate-600 mb-4 flex-grow leading-relaxed">{pivot.modification}</p>
              {pivot.changes && Object.keys(pivot.changes).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {Object.keys(pivot.changes).filter(key => key !== 'description').slice(0, 3).map(key => (
                    <span key={key} className="px-2 py-0.5 rounded-md bg-indigo-50 text-[10px] font-bold text-indigo-500 uppercase tracking-wider border border-indigo-100">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  ))}
                  {Object.keys(pivot.changes).length > 3 && <span className="px-2 py-0.5 rounded-md bg-slate-50 text-[10px] text-slate-400 font-bold border border-slate-100">+{Object.keys(pivot.changes).length - 3}</span>}
                </div>
              )}
              <div className="w-full pt-4 border-t border-slate-50 mt-auto flex justify-between items-center">
                 <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">Apply & Rerun</span>
                 <svg className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
