
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

const App: React.FC = () => {
  const [input, setInput] = useState<ProjectInput>(DEFAULT_PROJECT);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

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
          // Fast progress for Stage 1 since it's the blocking UI part
          const jump = Math.max(1, (100 - prev) * 0.1); 
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
      // We cast to full result for local state, knowing some fields are missing (handled by optional types)
      const partialResult = stage1Data as SimulationResult;
      setResult(partialResult);
      setStatus(SimulationStatus.SUCCESS); // Show Dashboard immediately

      // --- STAGE 2: Charts & Risks ---
      // Fetch in background, update state when ready
      try {
        const stage2Data = await runSimulationStage2(input, stage1Data);
        setResult(prev => prev ? ({ ...prev, ...stage2Data }) : null);

        // --- STAGE 3: Schedule & Pivots ---
        const stage3Data = await runSimulationStage3(input, stage1Data, stage2Data);
        setResult(prev => prev ? ({ ...prev, ...stage3Data }) : null);
      } catch (innerErr) {
        console.error("Background loading failed", innerErr);
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

  const getLoadingText = (p: number) => {
    if (p < 30) return "Connecting to Impact Engine (Gemini 2.5)...";
    if (p < 60) return "Analyzing feasibility parameters...";
    return "Generating Executive Summary...";
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-float"></div>
         <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] animate-float delay-500"></div>
      </div>

      <header className="glass-header sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500 blur opacity-40 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5 3"/></svg>
                </div>
             </div>
             <div>
               <h1 className="text-2xl font-extrabold text-white tracking-tight">ImpactSim <span className="text-indigo-400">AI</span></h1>
               <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Predictive NGO Project Engine</p>
             </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
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
               />
               <div className="mt-6 text-center text-xs text-slate-500/60 font-medium">
                  Powered by Google Gemini 2.5 Flash
               </div>
            </div>
          </div>

          <div className="xl:col-span-7 lg:col-span-7">
            {status === SimulationStatus.IDLE && (
              <div className="glass-panel rounded-3xl border border-white p-16 text-center flex flex-col items-center justify-center min-h-[600px] animate-fade-in delay-100 bg-white/95">
                <div className="relative mb-8 group">
                   <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700"></div>
                   <div className="relative bg-white p-6 rounded-2xl shadow-xl shadow-indigo-500/20 animate-float">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M2 12h10"/><path d="M9 4v16"/><path d="m3 9 3 3-3 3"/><path d="M14 8V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-2"/><path d="m17 10 3 2-3 2"/></svg>
                   </div>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">Design. Simulate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Impact.</span></h2>
                <p className="text-slate-600 max-w-lg mx-auto mb-10 text-lg leading-relaxed font-medium">
                  Test your international development projects against real-world constraints using AI.
                </p>
                <div className="flex gap-4">
                   <div className="h-1 w-16 rounded-full bg-slate-200"></div>
                   <div className="h-1 w-16 rounded-full bg-slate-200"></div>
                   <div className="h-1 w-16 rounded-full bg-slate-200"></div>
                </div>
              </div>
            )}

            {status === SimulationStatus.ERROR && (
              <div className="glass-panel bg-rose-50/90 p-8 rounded-2xl border border-rose-200 text-center animate-fade-in-up">
                <div className="inline-flex p-3 bg-rose-100 text-rose-600 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Simulation Failed</h3>
                <p className="text-slate-600 max-w-md mx-auto mb-6">{error}</p>
                <button onClick={() => setStatus(SimulationStatus.IDLE)} className="px-6 py-2 bg-white border border-rose-200 text-rose-600 font-bold rounded-lg hover:bg-rose-50 transition-colors">Try Again</button>
              </div>
            )}

            {status === SimulationStatus.LOADING && (
              <div className="glass-panel rounded-3xl border border-white p-12 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden bg-white/95">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"></div>
                 <div className="relative z-10 w-full max-w-lg text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Generating Initial Assessment...</h3>
                    <p className="text-slate-500 mb-8 h-6">{getLoadingText(progress)}</p>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-full animate-[shimmer_2s_infinite]"
                         style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
                       ></div>
                    </div>
                 </div>
              </div>
            )}

            {status === SimulationStatus.SUCCESS && result && (
              <div className="animate-fade-in">
                <SimulationDashboard result={result} onApplyPivot={handleApplyPivot} />
              </div>
            )}
          </div>
        </div>
      </main>
      
       <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-md py-6 mt-auto">
         <div className="container mx-auto px-6 flex justify-between items-center text-xs text-slate-400">
           <div className="font-medium">
             &copy; 2025 ImpactSim. Created by Shadman Khalili.
           </div>
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsFeedbackOpen(true)}
                className="hover:text-white transition-colors flex items-center gap-2 group"
              >
                Send Feedback
              </button>
           </div>
         </div>
      </footer>
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFeedbackOpen(false)}></div>
          <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl relative z-10 animate-fade-in-up overflow-hidden border border-white/40 bg-white">
            <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-slate-800">Your Feedback</h3>
                 <button onClick={() => setIsFeedbackOpen(false)} className="text-slate-400 hover:text-slate-600">X</button>
               </div>
               <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm mb-4"
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
