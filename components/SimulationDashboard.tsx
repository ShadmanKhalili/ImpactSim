
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, ReferenceLine, Legend, ScatterChart, Scatter, ZAxis, LineChart, Line } from 'recharts';
import { SimulationResult, PivotSuggestion } from '../types';

interface SimulationDashboardProps {
  result: SimulationResult;
  onApplyPivot: (pivot: PivotSuggestion) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Custom Icon Components
const Icons = {
  Chart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Money: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Trending: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
};

export const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ result, onApplyPivot }) => {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-100">
        <div className={`p-6 rounded-2xl border ${getScoreBg(result.overallScore)} shadow-sm transition-transform hover:scale-[1.01]`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Feasibility Score</p>
              <h2 className={`text-5xl font-extrabold ${getScoreColor(result.overallScore)}`}>{result.overallScore}</h2>
            </div>
            <div className={`p-3 rounded-xl bg-white/60 backdrop-blur-sm`}>
               <Icons.Chart />
            </div>
          </div>
          <p className="text-sm mt-3 font-medium opacity-80">{result.overallScore > 60 ? 'High probability of success.' : 'Significant adjustments recommended.'}</p>
        </div>

        <div className="p-6 rounded-2xl border border-blue-100 bg-white shadow-sm hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Sentiment</p>
              <h2 className="text-5xl font-extrabold text-blue-600">{result.communitySentiment}%</h2>
            </div>
             <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
               <Icons.Users />
             </div>
          </div>
          <p className="text-sm mt-3 text-gray-500 font-medium">Community Acceptance Index</p>
        </div>

        <div className="p-6 rounded-2xl border border-purple-100 bg-white shadow-sm hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Sustainability</p>
              <h2 className="text-5xl font-extrabold text-purple-600">{result.sustainabilityScore}%</h2>
            </div>
             <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
               <Icons.Trending />
             </div>
          </div>
          <p className="text-sm mt-3 text-gray-500 font-medium">Long-term Viability Projection</p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in-up delay-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           <Icons.Target />
           Executive Summary
        </h3>
        <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed text-base bg-slate-50 p-6 rounded-xl border border-slate-100">
          {result.narrative}
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-300">
        {/* Timeline Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-gray-800 font-bold flex items-center gap-2"><Icons.Trending /> Sentiment Timeline</h3>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="sentimentScore" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSentiment)" name="Sentiment" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stakeholder Analysis */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[420px]">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-gray-800 font-bold flex items-center gap-2"><Icons.Users /> Stakeholder Alignment</h3>
           </div>
           <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={result.stakeholderAnalysis}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[-100, 100]} hide />
                <YAxis dataKey="group" type="category" width={110} tick={{fontSize: 11, fontWeight: 600, fill: '#475569'}} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={2} />
                <Bar dataKey="sentiment" name="Support Level" barSize={24} radius={[4, 4, 4, 4]}>
                  {result.stakeholderAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.sentiment > 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-400">
        
        {/* Risk Matrix Chart (New) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-gray-800 font-bold flex items-center gap-2"><Icons.Alert /> Risk Matrix</h3>
             <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Likelihood vs. Severity</span>
          </div>
          <div className="flex-grow">
             <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="likelihood" name="Likelihood" domain={[0, 10]} label={{ value: 'Likelihood', position: 'bottom', offset: 0, fontSize: 12, fill: '#94a3b8' }} tick={{fontSize: 11}} tickCount={5} />
                  <YAxis type="number" dataKey="severity" name="Severity" domain={[0, 10]} label={{ value: 'Severity', angle: -90, position: 'left', offset: 0, fontSize: 12, fill: '#94a3b8' }} tick={{fontSize: 11}} tickCount={5}/>
                  <ZAxis range={[100, 400]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg max-w-[200px]">
                            <p className="font-bold text-gray-800 text-sm mb-1">{data.risk}</p>
                            <div className="flex gap-2 text-xs">
                               <span className="text-blue-600 font-medium">Likelihood: {data.likelihood}</span>
                               <span className="text-red-600 font-medium">Severity: {data.severity}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Risks" data={result.riskAnalysis} fill="#ef4444">
                     {result.riskAnalysis.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.severity > 7 ? '#ef4444' : entry.severity > 4 ? '#f59e0b' : '#3b82f6'} />
                     ))}
                  </Scatter>
                </ScatterChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* 5-Year Impact Projection (New) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[420px]">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-gray-800 font-bold flex items-center gap-2"><Icons.Trending /> 5-Year Impact Projection</h3>
           </div>
           <div className="flex-grow">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.longTermImpact} margin={{ top: 20, right: 30, left: -10, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="year" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                   <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                   <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   />
                   <Legend wrapperStyle={{paddingTop: '20px'}} />
                   <Line type="monotone" dataKey="social" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Social Impact" />
                   <Line type="monotone" dataKey="economic" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Economic Growth" />
                   <Line type="monotone" dataKey="environmental" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Env. Sustainability" />
                </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>

      {/* Metrics & Budget Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-500">
        
        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
           <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2"><Icons.Target /> Feasibility Metrics</h3>
           <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.metrics}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col h-[400px]">
          <h3 className="text-gray-800 font-bold mb-2 flex items-center gap-2"><Icons.Money /> Projected Budget Breakdown</h3>
          <div className="flex flex-row h-full">
            <div className="flex-grow relative h-full w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={result.budgetBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="percentage"
                    cornerRadius={6}
                  >
                    {result.budgetBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 overflow-y-auto max-h-[300px] custom-scrollbar pr-2 flex flex-col justify-center">
              {result.budgetBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm text-gray-600 mb-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                     <span className="font-medium">{item.category}</span>
                  </div>
                  <span className="font-bold text-gray-800">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risks & Success Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-600">
          <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-l-rose-500 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="p-1 bg-rose-100 rounded text-rose-600"><Icons.Alert /></span>
              Critical Risks
            </h3>
            <ul className="space-y-4">
              {result.risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-l-emerald-500 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="p-1 bg-emerald-100 rounded text-emerald-600"><Icons.Shield /></span>
              Success Factors
            </h3>
            <ul className="space-y-4">
              {result.successFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
      </div>

      {/* Pivots / Recommendations */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100 animate-fade-in-up delay-700">
        <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
          <Icons.Zap />
          Strategic Pivots
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.pivots.map((pivot, idx) => (
            <button
              key={idx}
              onClick={() => onApplyPivot(pivot)}
              className="flex flex-col text-left bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-transparent hover:border-indigo-200"
            >
              <div className="flex justify-between w-full mb-3 items-start gap-2">
                 <span className="font-bold text-indigo-900 text-base leading-tight">{pivot.title}</span>
                 <span className="shrink-0 text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors uppercase tracking-wide">Apply</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed">{pivot.modification}</p>
              <div className="w-full pt-4 border-t border-gray-100 mt-auto">
                 <p className="text-xs text-gray-400 italic">Rationale: {pivot.rationale}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
