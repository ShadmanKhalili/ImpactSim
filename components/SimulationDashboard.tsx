import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, ReferenceLine, Legend, ScatterChart, Scatter, ZAxis, LineChart, Line, LabelList } from 'recharts';
import { SimulationResult, PivotSuggestion } from '../types';

interface SimulationDashboardProps {
  result: SimulationResult;
  onApplyPivot: (pivot: PivotSuggestion) => void;
  isDarkMode: boolean;
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
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Printer: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md p-4 border border-slate-700 shadow-2xl rounded-xl z-50 min-w-[150px] ring-1 ring-white/10">
        {label && <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-2 font-bold">{label}</p>}
        {/* Risk Tooltip Logic */}
        {data.risk && (
           <div className="mb-2">
              <p className="font-bold text-white text-sm border-b border-slate-700 pb-2">{data.risk}</p>
              <div className="flex justify-between mt-2 text-xs">
                 <span className="text-slate-400">Criticality Score:</span>
                 <span className="text-rose-400 font-bold">{data.criticality}</span>
              </div>
           </div>
        )}
        {/* Stakeholder Tooltip Logic */}
        {data.group && (
           <p className="font-bold text-white text-sm mb-2 border-b border-slate-700 pb-2">{data.group}</p>
        )}
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                <span className="text-slate-300 text-xs font-medium">{entry.name}</span>
             </div>
             <span className="font-mono text-indigo-300 text-xs font-bold">{typeof entry.value === 'number' && entry.value % 1 !== 0 ? entry.value.toFixed(2) : entry.value}</span>
          </div>
        ))}
        {data.alignment && (
           <div className="mt-2 text-xs font-bold">
              <span className={data.alignment === 'Support' ? 'text-emerald-400' : data.alignment === 'Oppose' ? 'text-rose-400' : 'text-amber-400'}>
                {data.alignment}
              </span>
           </div>
        )}
      </div>
    );
  }
  return null;
};

const GanttChart = ({ schedule, isDarkMode }: { schedule: any[], isDarkMode: boolean }) => {
  const totalMonths = Math.max(...schedule.map(s => s.startMonth + s.durationMonths)) + 1;
  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-2">
      <div className="min-w-[500px] relative mt-6 px-1">
        <div className={`flex border-b pb-4 mb-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className={`w-1/4 font-bold text-[10px] uppercase tracking-wider pl-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Task / Phase</div>
          <div className="w-3/4 flex relative">
            {Array.from({ length: totalMonths }).map((_, i) => (
              <div key={i} className={`flex-1 text-[10px] text-center font-bold border-l border-dashed h-full ${isDarkMode ? 'text-slate-500 border-slate-700' : 'text-slate-400 border-slate-200'}`}>M{i+1}</div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {schedule.map((item, idx) => (
            <div key={idx} className={`flex items-center group rounded-lg py-1 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
              <div className="w-1/4 pr-4 pl-2">
                <div className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} title={item.task}>{item.task}</div>
                <div className={`text-[9px] font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.type}</div>
              </div>
              <div className="w-3/4 h-8 relative">
                 <div className="absolute inset-0 flex w-full h-full pointer-events-none">
                    {Array.from({ length: totalMonths }).map((_, i) => (
                       <div key={i} className={`flex-1 border-r border-dashed h-full ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
                    ))}
                 </div>
                 <div 
                   className={`absolute h-6 top-1 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5
                     ${item.type === 'planning' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 
                       item.type === 'execution' ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 
                       'bg-gradient-to-r from-amber-600 to-orange-600 rotate-45 w-4! h-4! top-2 rounded-sm'}`}
                   style={{
                     left: `${(item.startMonth / totalMonths) * 100}%`,
                     width: item.type === 'milestone' ? '16px' : `${(item.durationMonths / totalMonths) * 100}%`,
                     opacity: 0.9
                   }}
                 >
                    {item.type !== 'milestone' && (
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-lg whitespace-nowrap z-20 pointer-events-none border border-slate-700">
                            {item.durationMonths} Months
                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
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

const LoadingSkeleton = ({ height = "h-[400px]", text = "Generating analytics...", isDarkMode = true }: { height?: string, text?: string, isDarkMode?: boolean }) => (
  <div className={`glass-panel p-8 rounded-3xl border ${height} flex flex-col items-center justify-center ${isDarkMode ? 'border-slate-700/50 bg-slate-900/40' : 'border-slate-200 bg-white/60'}`}>
    <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
    <p className={`text-sm font-medium animate-pulse ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{text}</p>
  </div>
);

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ result, onApplyPivot, isDarkMode }) => {
  if (!result) return null;

  const scoreColor = result.overallScore >= 80 ? 'text-emerald-500' : result.overallScore >= 50 ? 'text-amber-500' : 'text-rose-500';
  const scoreBg = result.overallScore >= 80 ? 'bg-emerald-500' : result.overallScore >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  
  const cardBg = isDarkMode ? 'bg-slate-900/40' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-white/10' : 'border-white/50';
  const textColorMain = isDarkMode ? 'text-white' : 'text-slate-800';
  const textColorMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const chartGridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const chartAxisColor = isDarkMode ? '#94a3b8' : '#64748b';

  // Calculate Risk Ranking Data
  const sortedRisks = React.useMemo(() => {
    if (!result.riskAnalysis) return [];
    return [...result.riskAnalysis]
      .map(r => ({ ...r, criticality: r.likelihood * r.severity }))
      .sort((a, b) => b.criticality - a.criticality);
  }, [result.riskAnalysis]);

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Section,Category/Item,Value/Score,Details\n";

    // Summary
    csvContent += `Summary,Overall Score,${result.overallScore},\n`;
    csvContent += `Summary,Sentiment,${result.communitySentiment},\n`;
    csvContent += `Summary,Sustainability,${result.sustainabilityScore},\n`;
    csvContent += `Summary,Narrative,"${result.narrative.replace(/"/g, '""')}",\n`;

    // Metrics
    result.metrics?.forEach(m => {
      csvContent += `Feasibility Metric,${m.category},${m.score},"${m.reasoning.replace(/"/g, '""')}"\n`;
    });

    // Risks
    result.riskAnalysis?.forEach(r => {
      csvContent += `Risk,${r.risk},Likelihood: ${r.likelihood} | Severity: ${r.severity},Criticality: ${r.likelihood * r.severity}\n`;
    });

    // Schedule
    result.schedule?.forEach(s => {
      csvContent += `Schedule,${s.task},Month ${s.startMonth},Duration: ${s.durationMonths} months (${s.type})\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "impact_sim_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Export Controls (Visible only in App, Hidden in Print) */}
      <div className="flex justify-end gap-3 mb-2 no-print">
        <button 
          onClick={() => window.print()}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <Icons.Printer />
          Export PDF
        </button>
        <button 
          onClick={downloadCSV}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm ${isDarkMode ? 'bg-indigo-900/30 border-indigo-500/30 text-indigo-400 hover:bg-indigo-900/50' : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'}`}
        >
          <Icons.Download />
          Export CSV
        </button>
      </div>

      {/* SECTION 1: Summary & High-Level Scores (Always Available First) */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Main Feasibility Score */}
          <div className={`glass-panel p-8 rounded-3xl border ${cardBorder} shadow-lg shadow-indigo-900/20 relative overflow-hidden group bg-gradient-to-br ${isDarkMode ? 'from-slate-800/50 to-indigo-900/20' : 'from-white to-indigo-50'}`}>
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="flex justify-between items-start relative z-10">
               <div>
                  <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${textColorMuted}`}>Feasibility Index</p>
                  <div className="flex items-baseline gap-3">
                    <h2 className={`text-7xl font-black ${scoreColor} tracking-tighter drop-shadow-sm`}>{result.overallScore}</h2>
                    <span className={`text-lg font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>/100</span>
                  </div>
               </div>
               <div className={`p-4 shadow-sm rounded-2xl border ${isDarkMode ? 'bg-slate-800 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                 <Icons.Chart />
               </div>
            </div>
            <div className="mt-8">
               <div className={`flex justify-between text-xs font-bold mb-2 ${textColorMuted}`}>
                  <span>Critical</span>
                  <span>Viable</span>
                  <span>Optimal</span>
               </div>
               <div className={`h-3 w-full rounded-full overflow-hidden p-0.5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className={`h-full rounded-full ${scoreBg} shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-all duration-1000 ease-out relative overflow-hidden`} style={{ width: `${result.overallScore}%` }}>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
            <p className={`text-sm mt-4 font-semibold leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{result.overallScore > 65 ? 'Project shows viability. Focus on mitigating listed risks.' : 'Significant restructuring required for grant success.'}</p>
          </div>

          {/* Sentiment Card */}
          <div className={`glass-panel p-8 rounded-3xl border ${cardBorder} shadow-lg shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${isDarkMode ? 'from-slate-800/50 to-blue-900/10' : 'from-white to-blue-50'}`}>
             <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-2">Community Buy-in</p>
                  <div className="flex items-baseline gap-2">
                     <h2 className={`text-5xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{result.communitySentiment?.toFixed(2)}</h2>
                     <span className={`text-lg font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>/ 1.0</span>
                  </div>
                </div>
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}><Icons.Users /></div>
             </div>
             <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-blue-500/20' : 'border-blue-100'}`}>
               <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Predicted acceptance rate based on cultural alignment.</p>
             </div>
          </div>

          {/* Sustainability Card */}
          <div className={`glass-panel p-8 rounded-3xl border ${cardBorder} shadow-lg shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${isDarkMode ? 'from-slate-800/50 to-emerald-900/10' : 'from-white to-emerald-50'}`}>
             <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Sustainability</p>
                  <h2 className={`text-5xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{result.sustainabilityScore}%</h2>
                </div>
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}><Icons.Trending /></div>
             </div>
             <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-emerald-500/20' : 'border-emerald-100'}`}>
               <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Long-term viability post-funding analysis.</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          <div className={`xl:col-span-2 glass-panel p-8 rounded-3xl shadow-sm border ${cardBorder} ${cardBg}`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-3 ${textColorMain}`}>
               <span className={`p-2 rounded-xl shadow-sm ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}><Icons.Target /></span>
               Executive AI Summary
            </h3>
            <div className={`prose prose-sm max-w-none font-medium leading-7 p-8 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
              {result.narrative}
            </div>
          </div>

          <div className={`glass-panel p-8 rounded-3xl shadow-sm border ${cardBorder} bg-gradient-to-b ${isDarkMode ? 'from-slate-900/40 to-emerald-900/10' : 'from-white to-emerald-50/50'} flex flex-col`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-3 ${textColorMain}`}>
              <span className={`p-2 rounded-xl shadow-sm ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}><Icons.Shield /></span>
              Key Wins
            </h3>
            <div className="flex-grow space-y-3 overflow-y-auto custom-scrollbar pr-2 max-h-[300px]">
              {result.successFactors?.map((factor, idx) => (
                <div key={idx} className={`flex gap-3 text-sm p-4 rounded-xl border shadow-sm transition-transform hover:translate-x-1 ${isDarkMode ? 'bg-slate-800/50 border-emerald-500/20 text-slate-300' : 'bg-white border-emerald-100 text-slate-800'}`}>
                  <div className="mt-0.5 text-emerald-500 shrink-0">
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
           <LoadingSkeleton text="Generating Charts & Risk Analysis..." isDarkMode={isDarkMode} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
              <div className={`glass-panel p-8 rounded-3xl shadow-sm border ${cardBorder} h-[420px] flex flex-col ${cardBg}`}>
                <h3 className={`font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wide ${textColorMain}`}>
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Sentiment Forecast
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
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                      <XAxis dataKey="month" tick={{fontSize: 11, fill: chartAxisColor, fontWeight: 700}} axisLine={false} tickLine={false} dy={10} />
                      <YAxis domain={[0, 1]} tick={{fontSize: 11, fill: chartAxisColor, fontWeight: 600}} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="sentimentScore" stroke="#3b82f6" strokeWidth={4} fill="url(#colorSentiment)" animationDuration={1000} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`glass-panel p-8 rounded-3xl shadow-sm border ${cardBorder} h-[420px] flex flex-col ${cardBg}`}>
                 <h3 className={`font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wide ${textColorMain}`}>
                   <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Stakeholder Power-Interest Grid
                 </h3>
                 <div className="flex-grow">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                      <XAxis type="number" dataKey="interest" name="Interest" domain={[0, 10]} label={{ value: 'Interest', position: 'bottom', offset: 0, fontSize: 10, fill: chartAxisColor }} tick={{fontSize: 11, fill: chartAxisColor, fontWeight: 600}} />
                      <YAxis type="number" dataKey="power" name="Power" domain={[0, 10]} label={{ value: 'Power', angle: -90, position: 'insideLeft', fontSize: 10, fill: chartAxisColor }} tick={{fontSize: 11, fill: chartAxisColor, fontWeight: 600}} />
                      <ZAxis range={[150, 400]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                      {/* Quadrants */}
                      <ReferenceLine x={5} stroke={chartAxisColor} strokeDasharray="3 3" />
                      <ReferenceLine y={5} stroke={chartAxisColor} strokeDasharray="3 3" />
                      <Scatter name="Stakeholders" data={result.stakeholderAnalysis} animationDuration={1000}>
                         {result.stakeholderAnalysis?.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.alignment === 'Support' ? '#10b981' : entry.alignment === 'Oppose' ? '#ef4444' : '#f59e0b'} 
                              fillOpacity={0.8} 
                              stroke="transparent" 
                              strokeWidth={0} 
                            />
                         ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
              <div className={`glass-panel p-8 rounded-3xl shadow-sm border ${cardBorder} h-[450px] flex flex-col ${cardBg}`}>
                 <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide ${textColorMain}`}>
                   <span className="w-2 h-2 rounded-full bg-violet-500"></span> Feasibility Metrics
                 </h3>
                 <div className="flex-grow -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.metrics}>
                      <PolarGrid stroke={chartGridColor} strokeDasharray="4 4" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: chartAxisColor, fontSize: 10, fontWeight: 800 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                      <Radar name="Score" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.3} animationDuration={1000} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* UNIFIED RISK COMMAND CENTER */}
              <div className={`xl:col-span-2 glass-panel p-8 rounded-3xl shadow-sm border ${cardBorder} h-[450px] flex flex-col relative overflow-hidden ${cardBg}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500"></div>
                <div className="flex items-center gap-3 mb-6">
                   <h3 className={`font-bold flex items-center gap-2 text-sm uppercase tracking-wide ${textColorMain}`}>
                       <span className={`p-1.5 rounded-lg text-rose-500 ${isDarkMode ? 'bg-rose-500/20' : 'bg-rose-100'}`}><Icons.Alert /></span>
                       Risk Assessment Command Center
                   </h3>
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                     {result.risks?.length || 0} Critical Flags
                   </span>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-6">
                  {/* High Level Critical Flaws */}
                  {result.risks && result.risks.length > 0 && (
                    <div className="space-y-2">
                       <h4 className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${textColorMuted}`}>Strategic Critical Flaws</h4>
                       <div className="grid grid-cols-1 gap-2">
                         {result.risks.map((risk, idx) => (
                           <div key={idx} className={`flex items-start gap-3 p-3 border-l-4 border-l-rose-500 border-y border-r rounded-r-lg shadow-sm ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                              <p className={`text-sm font-medium leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{risk}</p>
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

                  <div className={`w-full h-px my-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

                  {/* Granular Risk Grid */}
                  <div className="space-y-2">
                    <h4 className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${textColorMuted}`}>Operational Threat Matrix</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sortedRisks.map((risk, idx) => {
                           const isCritical = risk.criticality > 60;
                           const isHigh = risk.criticality > 30;
                           const borderColor = isCritical ? (isDarkMode ? 'border-rose-500/50' : 'border-rose-300') : isHigh ? (isDarkMode ? 'border-orange-500/50' : 'border-orange-300') : (isDarkMode ? 'border-amber-500/50' : 'border-amber-300');
                           const bgColor = isCritical ? (isDarkMode ? 'bg-rose-900/20' : 'bg-rose-50') : isHigh ? (isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50') : (isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50');
                           const textColor = isCritical ? (isDarkMode ? 'text-rose-400' : 'text-rose-700') : isHigh ? (isDarkMode ? 'text-orange-400' : 'text-orange-700') : (isDarkMode ? 'text-amber-400' : 'text-amber-700');
                           const badgeBg = isCritical ? 'bg-rose-600' : isHigh ? 'bg-orange-600' : 'bg-amber-600';

                           return (
                             <div key={idx} className={`p-3 rounded-xl border ${borderColor} ${bgColor} shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow`}>
                                <div className="flex justify-between items-start mb-2">
                                   <h4 className={`text-xs font-bold ${textColor} leading-tight pr-2`}>{risk.risk}</h4>
                                   <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${badgeBg}`}>
                                     {risk.criticality}
                                   </span>
                                </div>
                                <div className="space-y-1.5">
                                   {/* Likelihood Bar */}
                                   <div className="flex items-center gap-2">
                                      <span className={`text-[9px] font-semibold w-8 ${textColorMuted}`}>Prob.</span>
                                      <div className={`flex-grow h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                         <div className={`h-full rounded-full ${isDarkMode ? 'bg-slate-400' : 'bg-slate-400'}`} style={{ width: `${risk.likelihood * 10}%` }}></div>
                                      </div>
                                   </div>
                                   {/* Severity Bar */}
                                   <div className="flex items-center gap-2">
                                      <span className={`text-[9px] font-semibold w-8 ${textColorMuted}`}>Impact</span>
                                      <div className={`flex-grow h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                         <div className={`h-full rounded-full ${badgeBg}`} style={{ width: `${risk.severity * 10}%` }}></div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                           );
                        })}
                    </div>
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
            <LoadingSkeleton text="Drafting Implementation Schedule & Pivots..." height="h-[300px]" isDarkMode={isDarkMode} />
         ) : (
           <>
              <div className={`glass-panel p-8 rounded-3xl shadow-sm border ${cardBorder} animate-fade-in-up ${cardBg}`}>
                 <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-bold flex items-center gap-3 ${textColorMain}`}>
                        <span className={`p-2 rounded-xl shadow-sm ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}><Icons.Calendar /></span>
                        Implementation Schedule
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>Timeline Forecast</span>
                 </div>
                 <GanttChart schedule={result.schedule} isDarkMode={isDarkMode} />
              </div>

              <div className={`glass-panel p-10 rounded-[2.5rem] border ${cardBorder} animate-fade-in-up bg-gradient-to-br shadow-lg relative overflow-hidden ${isDarkMode ? 'from-indigo-900/30 via-slate-900/50 to-purple-900/30' : 'from-indigo-50/50 via-white to-purple-50/50'}`}>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <h3 className={`text-2xl font-black mb-8 flex items-center gap-3 ${textColorMain}`}>
                    <span className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30"><Icons.Zap /></span>
                    Strategic Pivots
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {result.pivots?.map((pivot, idx) => (
                    <button key={idx} onClick={() => onApplyPivot(pivot)} className={`relative text-left p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border flex flex-col h-full overflow-hidden ${isDarkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white border-slate-100'}`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                      
                      <div className="mb-4 flex items-center justify-between">
                          <span className={`font-bold text-lg leading-tight transition-colors ${isDarkMode ? 'text-slate-100 group-hover:text-indigo-400' : 'text-slate-800 group-hover:text-indigo-600'}`}>{pivot.title}</span>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-700 group-hover:bg-indigo-500/20 group-hover:text-indigo-400' : 'bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                              <Icons.ChevronRight />
                          </div>
                      </div>
                      
                      <p className={`text-sm mb-6 flex-grow leading-relaxed font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{pivot.modification}</p>
                      
                      {pivot.changes && Object.keys(pivot.changes).length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                          {Object.keys(pivot.changes).filter(key => key !== 'description').slice(0, 3).map(key => (
                            <span key={key} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${isDarkMode ? 'bg-slate-900 text-slate-400 border-slate-700 group-hover:border-indigo-500/30 group-hover:text-indigo-300' : 'bg-slate-50 text-slate-500 border-slate-200 group-hover:border-indigo-100 group-hover:text-indigo-500'}`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                          {Object.keys(pivot.changes).length > 3 && <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${isDarkMode ? 'bg-slate-900 text-slate-500 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>+{Object.keys(pivot.changes).length - 3}</span>}
                        </div>
                      )}
                      
                      <div className={`w-full pt-4 border-t mt-auto flex justify-between items-center transition-colors ${isDarkMode ? 'border-slate-700/50 group-hover:border-indigo-500/30' : 'border-slate-100 group-hover:border-indigo-100'}`}>
                         <span className={`text-[10px] uppercase font-bold transition-colors ${isDarkMode ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'}`}>Apply Strategy</span>
                         <div className={`w-2 h-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700 group-hover:bg-indigo-500' : 'bg-slate-200 group-hover:bg-indigo-500'}`}></div>
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