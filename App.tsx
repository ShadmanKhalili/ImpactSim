import React, { useState, useCallback, useEffect } from 'react';
import { ProjectForm } from './components/ProjectForm';
import { SimulationDashboard } from './components/SimulationDashboard';
import { ProjectInput, SimulationResult, SimulationStatus, PivotSuggestion } from './types';
import { runSimulationStage1, runSimulationStage2, runSimulationStage3, checkApiKeyStatus } from './services/geminiService';

// Initialize with empty strings for a clean "Blank State"
const DEFAULT_PROJECT: ProjectInput = {
  title: "",
  location: "",
  targetAudience: "",
  sector: "",
  budget: "",
  duration: "",
  localPartner: "",
  technologyLevel: "",
  fundingSource: "",
  teamExperience: "",
  description: "",
  strategyHistory: []
};

// Auditor-style loading phrases mapped to progress percentage
const LOADING_PHRASES = [
  { threshold: 0, text: "Initializing critical audit protocols..." },
  { threshold: 15, text: "Parsing project constraints & location context..." },
  { threshold: 35, text: "Stress-testing budget against local economic factors..." },
  { threshold: 55, text: "Simulating stakeholder resistance & cultural friction..." },
  { threshold: 75, text: "Identifying fatal flaws and logic gaps..." },
  { threshold: 90, text: "Synthesizing Executive Summary..." }
];

const App: React.FC = () => {
  const [input, setInput] = useState<ProjectInput>(DEFAULT_PROJECT);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Theme State (Default to Dark)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('impactSim_theme');
      return saved ? saved === 'dark' : true; 
    } catch {
      return true;
    }
  });

  // Apply Theme Class
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('impactSim_theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('impactSim_theme', 'light');
    }
  }, [isDarkMode]);

  // Feedback State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === SimulationStatus.LOADING) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) return 98;
          // Non-linear progress: Fast at start, slower at "thinking" spots
          const jump = prev < 50 ? 1.5 : 0.8; 
          return prev + jump;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleSimulate = useCallback(async () => {
    setStatus(SimulationStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      // --- STAGE 1: Summary & Scores ---
      const stage1Data = await runSimulationStage1(input);
      const partialResult = stage1Data as SimulationResult;
      setResult(partialResult);
      setStatus(SimulationStatus.SUCCESS); // Show Dashboard immediately

      // --- STAGE 2: Charts & Risks ---
      try {
        const stage2Data = await runSimulationStage2(input, stage1Data);
        setResult(prev => prev ? ({ ...prev, ...stage2Data }) : null);

        // --- STAGE 3: Schedule & Pivots ---
        const stage3Data = await runSimulationStage3(input, stage1Data, stage2Data);
        setResult(prev => prev ? ({ ...prev, ...stage3Data }) : null);
      } catch (innerErr) {
        console.error("Background loading failed", innerErr);
        // Fallback: If background loading fails, we just keep what we have.
        // We could also set empty arrays to stop spinners if we wanted.
        setResult(prev => {
           if(!prev) return null;
           return {
             ...prev,
             timeline: prev.timeline || [],
             stakeholderAnalysis: prev.stakeholderAnalysis || [],
             metrics: prev.metrics || [],
             riskAnalysis: prev.riskAnalysis || [],
             risks: prev.risks || [],
             schedule: prev.schedule || [],
             pivots: prev.pivots || []
           }
        });
      }

    } catch (err: any) {
      console.error(err);
      const msg = err.message || "";
      if (msg.includes("Missing API Key")) {
        setError("API Key Error: " + msg);
      } else {
        setError("Simulation failed: " + msg);
      }
      setStatus(SimulationStatus.ERROR);
    }
  }, [input]);

  const handleApplyPivot = (pivot: PivotSuggestion) => {
    setInput(prev => {
      const newHistoryEntry = `[${pivot.title}] ${pivot.modification}`;
      const updatedHistory = prev.strategyHistory ? [...prev.strategyHistory, newHistoryEntry] : [newHistoryEntry];
      const newChanges = pivot.changes || {};

      return {
        ...prev,
        ...newChanges,
        strategyHistory: updatedHistory,
        description: newChanges.description || prev.description 
      };
    });
  };

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      console.log("User Feedback:", feedbackText);
      setIsFeedbackOpen(false);
      setFeedbackText("");
    }
  };

  const currentLoadingPhase = LOADING_PHRASES.slice().reverse().find(p => progress >= p.threshold) || LOADING_PHRASES[0];

  return (
    <div className={`min-h-screen font-sans flex flex-col relative transition-colors duration-300 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] animate-float transition-colors duration-500 ${isDarkMode ? 'bg-purple-600/30' : 'bg-purple-400/20'}`}></div>
         <div className={`absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[120px] animate-float delay-500 transition-colors duration-500 ${isDarkMode ? 'bg-blue-600/30' : 'bg-blue-400/20'}`}></div>
      </div>

      <header className="glass-header sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative group">
                <div className={`absolute inset-0 bg-indigo-500 blur opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5 3"/></svg>
                </div>
             </div>
             <div>
               <h1 className={`text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ImpactSim <span className="text-indigo-500">AI</span></h1>
               <p className={`text-[10px] uppercase tracking-widest font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Predictive NGO Project Engine</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-white'}`}
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <span className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               System Operational
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-8 flex-grow pb-12 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          <div className="xl:col-span-5 lg:col-span-5">
            <div className="sticky top-24 animate-fade-in-up">
               <ProjectForm 
                 input={input} 
                 setInput={setInput} 
                 onSimulate={handleSimulate} 
                 isLoading={status === SimulationStatus.LOADING}
                 isDarkMode={isDarkMode}
               />
               <div className={`mt-6 text-center text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Powered by Google Gemini 2.5 Flash
               </div>
            </div>
          </div>

          <div className="xl:col-span-7 lg:col-span-7">
            {status === SimulationStatus.IDLE && (
              <div className={`glass-panel rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[600px] animate-fade-in delay-100 ${isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white/60 border-white/60'}`}>
                <div className="relative mb-8 group">
                   <div className="absolute inset-0 bg-indigo-500/40 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                   <div className={`relative p-6 rounded-2xl shadow-2xl animate-float border ${isDarkMode ? 'bg-slate-800 shadow-indigo-900/50 border-white/10' : 'bg-white shadow-indigo-200/50 border-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M2 12h10"/><path d="M9 4v16"/><path d="m3 9 3 3-3 3"/><path d="M14 8V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-2"/><path d="m17 10 3 2-3 2"/></svg>
                   </div>
                </div>
                <h2 className={`text-4xl font-extrabold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Design. Simulate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Impact.</span></h2>
                <p className={`max-w-lg mx-auto mb-10 text-lg leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Test your international development projects against real-world constraints using AI.
                </p>
                <div className="flex gap-4">
                   <div className={`h-1 w-16 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                   <div className={`h-1 w-16 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                   <div className={`h-1 w-16 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                </div>
              </div>
            )}

            {status === SimulationStatus.ERROR && (
              <div className={`glass-panel p-8 rounded-2xl text-center animate-fade-in-up border ${isDarkMode ? 'bg-rose-900/20 border-rose-500/30' : 'bg-rose-50 border-rose-200'}`}>
                <div className={`inline-flex p-3 rounded-full mb-4 ${isDarkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Simulation Failed</h3>
                <p className={`max-w-md mx-auto mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{error}</p>
                <button onClick={() => setStatus(SimulationStatus.IDLE)} className={`px-6 py-2 font-bold rounded-lg transition-colors shadow-lg ${isDarkMode ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50' : 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50'}`}>Try Again</button>
              </div>
            )}

            {status === SimulationStatus.LOADING && (
              <div className={`glass-panel rounded-3xl p-12 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/80 border-white/60'}`}>
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] animate-pulse ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-500/10'}`}></div>
                 <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
                    <h3 className={`text-2xl font-bold mb-4 animate-pulse ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Running Simulation...</h3>
                    
                    {/* Animated Context Text */}
                    <div className="h-8 mb-8 flex items-center justify-center w-full">
                       <p 
                         key={currentLoadingPhase.text} 
                         className="text-indigo-500 font-medium animate-fade-in text-base"
                       >
                         {currentLoadingPhase.text}
                       </p>
                    </div>

                    <div className={`relative h-2 rounded-full overflow-hidden w-full max-w-md shadow-inner ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                       <div 
                         className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-full animate-[shimmer_2s_infinite]"
                         style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
                       ></div>
                    </div>
                    
                    <div className={`mt-4 flex justify-between w-full max-w-md text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                       <span>Initiation</span>
                       <span>Analysis</span>
                       <span>Strategy</span>
                    </div>
                 </div>
              </div>
            )}

            {status === SimulationStatus.SUCCESS && result && (
              <div className="animate-fade-in">
                <SimulationDashboard result={result} onApplyPivot={handleApplyPivot} isDarkMode={isDarkMode} />
              </div>
            )}
          </div>
        </div>
      </main>
      
       <footer className={`border-t backdrop-blur-md py-6 mt-auto ${isDarkMode ? 'border-white/5 bg-slate-900/50' : 'border-slate-200 bg-white/50'}`}>
         <div className={`container mx-auto px-6 flex justify-between items-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
           <div className="font-medium">
             &copy; 2025 ImpactSim. Created by Shadman Khalili.
           </div>
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsFeedbackOpen(true)}
                className={`transition-colors flex items-center gap-2 group font-medium ${isDarkMode ? 'hover:text-indigo-400' : 'hover:text-indigo-600'}`}
              >
                Send Feedback
              </button>
           </div>
         </div>
      </footer>
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFeedbackOpen(false)}></div>
          <div className={`glass-panel w-full max-w-md rounded-2xl shadow-2xl relative z-10 animate-fade-in-up overflow-hidden border ${isDarkMode ? 'border-white/10 bg-slate-800' : 'border-white/40 bg-white'}`}>
            <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Your Feedback</h3>
                 <button onClick={() => setIsFeedbackOpen(false)} className={`${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>X</button>
               </div>
               <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts..."
                className={`w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm mb-4 ${isDarkMode ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'}`}
               />
               <button
                onClick={handleFeedbackSubmit}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 active:scale-[0.98]"
               >
                Submit Feedback
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;