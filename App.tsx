
import React, { useState, useCallback } from 'react';
import { ProjectForm } from './components/ProjectForm';
import { SimulationDashboard } from './components/SimulationDashboard';
import { ProjectInput, SimulationResult, SimulationStatus, PivotSuggestion } from './types';
import { runSimulation } from './services/geminiService';

const DEFAULT_PROJECT: ProjectInput = {
  title: "Solar Community Kitchen",
  location: "Barisal, Bangladesh",
  targetAudience: "Rural Households",
  sector: "Energy / Livelihood",
  budget: "$50,000",
  duration: "1 Year",
  localPartner: "Local Women's Coop",
  technologyLevel: "Medium Tech",
  description: "A centralized solar-powered kitchen facility in the village center. The goal is to reduce household biomass fuel consumption. Families will bring their raw food to the center to cook on clean stoves for a small fee."
};

const App: React.FC = () => {
  const [input, setInput] = useState<ProjectInput>(DEFAULT_PROJECT);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = useCallback(async () => {
    setStatus(SimulationStatus.LOADING);
    setError(null);
    try {
      const data = await runSimulation(input);
      setResult(data);
      setStatus(SimulationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate simulation. Please check your API Key or try again.");
      setStatus(SimulationStatus.ERROR);
    }
  }, [input]);

  const handleApplyPivot = (pivot: PivotSuggestion) => {
    setInput(prev => ({
      ...prev,
      description: `${prev.description}\n\n[MODIFICATION]: ${pivot.modification}`,
    }));
    
    // Smooth scroll to top to show form changed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 font-inter">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0a9 9 0 0 1-5.12 8.43"/><path d="M14 2.93V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0a9 9 0 0 1-5.12 8.43"/></svg>
             </div>
             <div>
               <h1 className="text-2xl font-bold tracking-tight">ImpactSim</h1>
               <p className="text-slate-400 text-xs uppercase tracking-wider font-medium">NGO Project Feasibility Engine</p>
             </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-slate-800 text-slate-300 text-xs py-1 px-3 rounded-full border border-slate-700">Powered by Gemini 2.5</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-8 space-y-4">
               <ProjectForm 
                 input={input} 
                 setInput={setInput} 
                 onSimulate={handleSimulate} 
                 isLoading={status === SimulationStatus.LOADING}
               />
               <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-800">
                  <p className="font-bold mb-1">Tip:</p>
                  <p>Local Partners are critical in high-risk zones. Projects without them often face community pushback.</p>
               </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 xl:col-span-9">
            {status === SimulationStatus.IDLE && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
                <div className="bg-blue-50 p-6 rounded-full mb-6 animate-pulse">
                   <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M2 12h10"/><path d="M9 4v16"/><path d="m3 9 3 3-3 3"/><path d="M14 8V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-2"/><path d="m17 10 3 2-3 2"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Simulate</h3>
                <p className="text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed">
                  Enter your project details on the left or use the <strong>Random Scenario</strong> button to test different ideas. ImpactSim uses advanced AI to predict outcomes based on local culture, economics, and logistics.
                </p>
                <div className="flex gap-4 text-sm text-gray-400">
                   <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Global Context</span>
                   <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Economic Analysis</span>
                   <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Cultural Fit</span>
                </div>
              </div>
            )}

            {status === SimulationStatus.ERROR && (
              <div className="bg-red-50 text-red-700 p-8 rounded-xl border border-red-200 text-center flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="font-bold text-lg mb-2">Simulation Failed</p>
                <p className="max-w-md">{error}</p>
              </div>
            )}

            {status === SimulationStatus.LOADING && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 min-h-[500px] flex flex-col items-center justify-center">
                 <div className="relative">
                   <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
                   <div className="absolute top-0 left-0 h-20 w-20 flex items-center justify-center">
                     <div className="h-10 w-10 bg-blue-100 rounded-full animate-pulse"></div>
                   </div>
                 </div>
                 <h3 className="text-xl font-medium text-gray-800 animate-pulse">Running Simulation Model...</h3>
                 <div className="mt-4 space-y-2 text-center text-sm text-gray-500 max-w-xs">
                    <p className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>Analyzing cultural constraints...</p>
                    <p className="animate-fade-in-up" style={{animationDelay: '1.5s'}}>Calculating budget inefficiencies...</p>
                    <p className="animate-fade-in-up" style={{animationDelay: '2.5s'}}>Mapping stakeholder influence...</p>
                 </div>
              </div>
            )}

            {status === SimulationStatus.SUCCESS && result && (
              <SimulationDashboard 
                result={result} 
                onApplyPivot={handleApplyPivot}
              />
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
