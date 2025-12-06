
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, ReferenceLine, Legend, ScatterChart, Scatter, ZAxis, LineChart, Line } from 'recharts';
import { SimulationResult, PivotSuggestion } from '../types';

interface SimulationDashboardProps {
  result: SimulationResult;
  onApplyPivot: (pivot: PivotSuggestion) => void;
}

const Icons = {
  Chart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="8" y1="12" y2="16"/><line x1="16" x2="16" y1="6" y2="16"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Trending: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-4 border border-slate-700 shadow-2xl rounded-xl z-50">
        {label && <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-2 font-bold">{label}</p>}
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
             <p className="font-bold text-white text-sm">
               {entry.name}: <span className="font-mono text-indigo-300">{entry.value}</span>
             </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const GanttChart = ({ schedule }: { schedule: any[] }) => {
  const totalMonths = Math.max(...schedule.map(s => s.startMonth + s.durationMonths)) + 1;
  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-2">
      <div className="min-w-[500px] relative mt-6 px-1">
        <div className="flex border-b border-gray-100 pb-4 mb-4">
          <div className="w-1/4 font-bold text-[10px] text-gray-400 uppercase tracking-wider pl-2">Task / Phase</div>
          <div className="w-3/4 flex relative">
            {Array.from({ length: totalMonths }).map((_, i) => (
              <div key={i} className="flex-1 text-[10px] text-center font-bold text-gray-300 border-l border-dashed border-gray-100 h-full">M{i+1}</div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {schedule.map((item, idx) => (
            <div key={idx} className="flex items-center group hover:bg-slate-50 rounded-lg py-1 transition-colors">
              <div className="w-1/4 pr-4 pl-2">
                <div className="text-xs font-bold text-slate-800 truncate" title={item.task}>{item.task}</div>
                <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">{item.type}</div>
              </div>
              <div className="w-3/4 h-8 relative">
                 <div className="absolute inset-0 flex w-full h-full pointer-events-none">
                    {Array.from({ length: totalMonths }).map((_, i) => (
                       <div key={i} className="flex-1 border-r border-dashed border-gray-100 h-full"></div>
                    ))}
                 </div>
                 <div 
                   className={`absolute h-6 top-1 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5
                     ${item.type === 'planning' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 
                       item.type === 'execution' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 
                       'bg-gradient-to-r from-amber-500 to-orange-500 rotate-45 w-4! h-4! top-2 rounded-sm'}`}
                   style={{
                     left: `${(item.startMonth / totalMonths) * 100}%`,
                     width: item.type === 'milestone' ? '16px' : `${(item.durationMonths / totalMonths) * 100}%`,
                     opacity: 1
                   }}
                 >
                    {item.type !== 'milestone' && (
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-lg whitespace-nowrap z-20 pointer-events-none">
                            {item.durationMonths} Months
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
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

const LoadingSkeleton = ({ height = "h-[400px]", text = "Generating analytics..." }: { height?: string, text?: string }) => (
  <div className={`glass-panel p-8 rounded-3xl border border-white bg-white/60 ${height} flex flex-col items-center justify-center`}>
    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
    <p className="text-slate-500 text-sm font-medium animate-pulse">{text}</p>
  </div>
);

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ result, onApplyPivot }) => {
  if (!result) return null;

  const scoreColor = result.overallScore >= 80 ? 'text-emerald-600' : result.overallScore >= 50 ? 'text-amber-600' : 'text-rose-600';
  const scoreBg = result.overallScore >= 80 ? 'bg-emerald-500' : result.overallScore >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="space-y-8 pb-12">
      
      {/* SECTION 1: Summary & High-Level Scores (Always Available First) */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Main Feasibility Score */}
          <div className="glass-panel p-8 rounded-3xl border border-white shadow-lg shadow-indigo-900/5 relative overflow-hidden group bg-gradient-to-br from-white to-indigo-50/30">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="flex justify-between items-start relative z-10">
               <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Feasibility Index</p>
                  <div className="flex items-baseline gap-3">
                    <h2 className={`text-7xl font-black ${scoreColor} tracking-tighter drop-shadow-sm`}>{result.overallScore}</h2>
                    <span className="text-lg font-bold text-slate-400">/100</span>
                  </div>
               </div>
               <div className="p-4 bg-white shadow-sm rounded-2xl text-indigo-600 border border-indigo-50">
                 <Icons.Chart />
               </div>
            </div>
            <div className="mt-8">
               <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>Critical</span>
                  <span>Viable</span>
                  <span>Optimal</span>
               </div>
               <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div className={`h-full rounded-full ${scoreBg} shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out relative overflow-hidden`} style={{ width: `${result.overallScore}%` }}>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
            <p className="text-sm mt-4 text-slate-600 font-semibold leading-relaxed">{result.overallScore > 65 ? 'Project shows viability. Focus on mitigating listed risks.' : 'Significant restructuring required for grant success.'}</p>
          </div>

          {/* Sentiment Card */}
          <div className="glass-panel p-8 rounded-3xl border border-white shadow-lg shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 mb-2">Community Buy-in</p>
                  <h2 className="text-5xl font-black text-slate-800 tracking-tight">{result.communitySentiment}%</h2>
                </div>
                <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl"><Icons.Users /></div>
             </div>
             <div className="mt-4 pt-4 border-t border-blue-50">
               <p className="text-sm text-slate-600 font-semibold">Predicted acceptance rate based on cultural alignment.</p>
             </div>
          </div>

          {/* Sustainability Card */}
          <div className="glass-panel p-8 rounded-3xl border border-white shadow-lg shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/30 flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Sustainability</p>
                  <h2 className="text-5xl font-black text-slate-800 tracking-tight">{result.sustainabilityScore}%</h2>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl"><Icons.Trending /></div>
             </div>
             <div className="mt-4 pt-4 border-t border-emerald-50">
               <p className="text-sm text-slate-600 font-semibold">Long-term viability post-funding analysis.</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          <div className="xl:col-span-2 glass-panel p-8 rounded-3xl shadow-sm border border-white bg-white">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
               <span className="p-2 bg-indigo-50 rounded-xl text-indigo-700 shadow-sm"><Icons.Target /></span>
               Executive AI Summary
            </h3>
            <div className="prose prose-sm prose-slate max-w-none text-slate-700 font-medium leading-7 bg-slate-50 p-8 rounded-2xl border border-slate-100">
              {result.narrative}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl shadow-sm border border-white bg-gradient-to-b from-white to-emerald-50/30 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="p-2 bg-emerald-50 rounded-xl text-emerald-700 shadow-sm"><Icons.Shield /></span>
              Key Wins
            </h3>
            <div className="flex-grow space-y-3 overflow-y-auto custom-scrollbar pr-2 max-h-[300px]">
              {result.successFactors?.map((factor, idx) => (
                <div key={idx} className="flex gap-3 text-sm text-slate-800 p-4 bg-white rounded-xl border border-emerald-100 shadow-sm transition-transform hover:translate-x-1">
                  <div className="mt-0.5 text-emerald-600 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="font-semibold">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Charts & Risks (Progressive Load) */}
      <section className="space-y-6">
        {!result.timeline ? (
           <LoadingSkeleton text="Generating Charts & Risk Analysis..." />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
              <div className="glass-panel p-8 rounded-3xl shadow-sm border border-white h-[420px] flex flex-col bg-white">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> Sentiment Forecast
                </h3>
                <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.timeline}>
                      <defs>
                        <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{fontSize: 11, fill: '#64748b', fontWeight: 700}} axisLine={false} tickLine={false} dy={10} />
                      <YAxis domain={[0, 100]} tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="sentimentScore" stroke="#3b82f6" strokeWidth={4} fill="url(#colorSentiment)" animationDuration={1000} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl shadow-sm border border-white h-[420px] flex flex-col bg-white">
                 <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Stakeholder Map
                 </h3>
                 <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={result.stakeholderAnalysis} margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" domain={[-100, 100]} hide />
                      <YAxis dataKey="group" type="category" width={110} tick={{fontSize: 11, fontWeight: 700, fill: '#475569'}} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8, radius: 4 }} />
                      <ReferenceLine x={0} stroke="#cbd5e1" strokeDasharray="3 3" />
                      <Bar dataKey="sentiment" barSize={24} radius={[6, 6, 6, 6]} animationDuration={1000}>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
              <div className="glass-panel p-8 rounded-3xl shadow-sm border border-white h-[450px] flex flex-col bg-white">
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                   <span className="w-2 h-2 rounded-full bg-violet-600"></span> Feasibility Metrics
                 </h3>
                 <div className="flex-grow -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.metrics}>
                      <PolarGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                      <Radar name="Score" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.2} animationDuration={1000} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-8 rounded-3xl shadow-sm border border-white h-[450px] flex flex-col bg-white">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-sm uppercase tracking-wide">
                       <span className="w-2 h-2 rounded-full bg-rose-500"></span> Risk Matrix
                    </h3>
                    <div className="flex-grow">
                       <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" dataKey="likelihood" name="Likelihood" domain={[0, 10]} tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} label={{ value: 'Likelihood', position: 'bottom', offset: 0, fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis type="number" dataKey="severity" name="Severity" domain={[0, 10]} tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} label={{ value: 'Severity', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8' }} />
                            <ZAxis range={[100, 300]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#94a3b8' }} content={<CustomTooltip />} />
                            <Scatter name="Risks" data={result.riskAnalysis} fill="#ef4444" animationDuration={1000}>
                               {result.riskAnalysis?.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.severity > 7 ? '#ef4444' : entry.severity > 4 ? '#f59e0b' : '#3b82f6'} fillOpacity={0.7} stroke="white" strokeWidth={2} />
                               ))}
                            </Scatter>
                          </ScatterChart>
                       </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-panel p-8 rounded-3xl shadow-sm border border-white h-[450px] flex flex-col bg-gradient-to-br from-rose-50 to-white">
                     <h3 className="font-bold text-rose-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                       <span className="p-1.5 bg-rose-100 rounded-lg"><Icons.Alert /></span>
                       Critical Flaws
                     </h3>
                     <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-3">
                       {result.risks?.map((risk, idx) => (
                         <div key={idx} className="p-4 bg-white border border-rose-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex gap-3">
                              <span className="text-rose-600 mt-0.5 group-hover:scale-110 transition-transform">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                              </span>
                              <p className="text-sm text-slate-800 font-medium leading-relaxed">{risk}</p>
                            </div>
                         </div>
                       ))}
                     </div>
                  </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* SECTION 3: Schedule & Pivots (Progressive Load) */}
      <section className="space-y-6">
         {!result.schedule ? (
            <LoadingSkeleton text="Drafting Implementation Schedule & Pivots..." height="h-[300px]" />
         ) : (
           <>
              <div className="glass-panel p-8 rounded-3xl shadow-sm border border-white animate-fade-in-up bg-white">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                        <span className="p-2 bg-blue-50 rounded-xl text-blue-700 shadow-sm"><Icons.Calendar /></span>
                        Implementation Schedule
                    </h3>
                    <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Timeline Forecast</span>
                 </div>
                 <GanttChart schedule={result.schedule} />
              </div>

              <div className="glass-panel p-10 rounded-[2.5rem] border border-white animate-fade-in-up bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <span className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30"><Icons.Zap /></span>
                    Strategic Pivots
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {result.pivots?.map((pivot, idx) => (
                    <button key={idx} onClick={() => onApplyPivot(pivot)} className="relative text-left bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-slate-100 flex flex-col h-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500"></div>
                      
                      <div className="mb-4 flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{pivot.title}</span>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                              <Icons.ChevronRight />
                          </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-6 flex-grow leading-relaxed font-semibold">{pivot.modification}</p>
                      
                      {pivot.changes && Object.keys(pivot.changes).length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                          {Object.keys(pivot.changes).filter(key => key !== 'description').slice(0, 3).map(key => (
                            <span key={key} className="px-2.5 py-1 rounded-lg bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-100 group-hover:border-indigo-100 group-hover:text-indigo-500 group-hover:bg-indigo-50/50 transition-colors">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                          {Object.keys(pivot.changes).length > 3 && <span className="px-2 py-1 rounded-lg bg-slate-50 text-[10px] text-slate-400 font-bold border border-slate-100">+{Object.keys(pivot.changes).length - 3}</span>}
                        </div>
                      )}
                      
                      <div className="w-full pt-4 border-t border-slate-50 mt-auto flex justify-between items-center group-hover:border-indigo-100 transition-colors">
                         <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">Apply Strategy</span>
                         <div className="w-2 h-2 rounded-full bg-slate-100 group-hover:bg-indigo-500 transition-colors"></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
           </>
         )}
      </section>
    </div>
  );
};
