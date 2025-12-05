
import React, { useState, useEffect } from 'react';
import { ProjectInput } from '../types';

interface ProjectFormProps {
  input: ProjectInput;
  setInput: React.Dispatch<React.SetStateAction<ProjectInput>>;
  onSimulate: () => void;
  isLoading: boolean;
}

const PRESETS: ProjectInput[] = [
  {
    title: "Drone Medical Delivery",
    location: "Rural Rwanda",
    targetAudience: "Remote Clinics",
    sector: "Healthcare / Tech",
    budget: "$250,000",
    fundingSource: "International Grant",
    duration: "18 Months",
    localPartner: "Ministry of Health",
    technologyLevel: "High Tech",
    initialRiskLevel: 6,
    description: "Using autonomous drones to deliver blood and vaccines to hard-to-reach rural clinics to reduce spoilage and transit time."
  },
  {
    title: "Plastic Waste Roads",
    location: "Mumbai, India",
    targetAudience: "Urban Commuters",
    sector: "Infrastructure",
    budget: "$500,000",
    fundingSource: "Public-Private Partnership",
    duration: "2 Years",
    localPartner: "Municipal Corporation",
    technologyLevel: "Medium Tech",
    initialRiskLevel: 4,
    description: "Collecting plastic waste from slums and melting it down to create durable, water-resistant road surfaces."
  },
  {
    title: "Digital Tablets for Education",
    location: "Northern Kenya",
    targetAudience: "Primary School Students",
    sector: "Education",
    budget: "$150,000",
    fundingSource: "Donation",
    duration: "1 Year",
    localPartner: "None (Direct Implementation)",
    technologyLevel: "High Tech",
    initialRiskLevel: 8,
    description: "Distributing low-cost tablets pre-loaded with educational software to nomadic communities where school attendance is irregular."
  },
  {
    title: "Fog Catcher Water Systems",
    location: "Lima, Peru",
    targetAudience: "Hillside Communities",
    sector: "WASH",
    budget: "$75,000",
    fundingSource: "NGO Funds",
    duration: "9 Months",
    localPartner: "Community Leaders",
    technologyLevel: "Low Tech",
    initialRiskLevel: 3,
    description: "Installing large mesh nets to capture moisture from coastal fog, converting it into potable water for communities without plumbing."
  },
  {
    title: "Solar Community Kitchen",
    location: "Barisal, Bangladesh",
    targetAudience: "Rural Households",
    sector: "Energy / Livelihood",
    budget: "$50,000",
    fundingSource: "Micro-finance",
    duration: "1 Year",
    localPartner: "Local Women's Coop",
    technologyLevel: "Medium Tech",
    initialRiskLevel: 5,
    description: "A centralized solar-powered kitchen facility in the village center. Families will bring their raw food to the center to cook on clean stoves for a small fee."
  }
];

const STORAGE_KEY = 'impactSim_savedScenario';

export const ProjectForm: React.FC<ProjectFormProps> = ({ input, setInput, onSimulate, isLoading }) => {
  const [hasSavedScenario, setHasSavedScenario] = useState(false);

  useEffect(() => {
    // Check if there is a saved scenario on mount
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHasSavedScenario(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleRandomize = () => {
    const randomProject = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setInput(randomProject);
  };

  const handleSaveScenario = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
    setHasSavedScenario(true);
    alert("Scenario saved successfully!");
  };

  const handleLoadScenario = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInput(parsed);
      } catch (e) {
        console.error("Failed to parse saved scenario", e);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M2 12h10"/><path d="M9 4v16"/><path d="m3 9 3 3-3 3"/><path d="M14 8V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-2"/><path d="m17 10 3 2-3 2"/></svg>
          Design Project
        </h2>
        <button 
          onClick={handleRandomize}
          className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1"
          title="Auto-fill with a random scenario"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
          Random
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Project Name</label>
          <input
            type="text"
            name="title"
            value={input.title}
            onChange={handleChange}
            placeholder="e.g., Solar Community Kitchen"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sector</label>
            <input
              type="text"
              name="sector"
              value={input.sector}
              onChange={handleChange}
              placeholder="e.g. Healthcare"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={input.location}
              onChange={handleChange}
              placeholder="e.g. Bangladesh"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Beneficiaries</label>
          <input
            type="text"
            name="targetAudience"
            value={input.targetAudience}
            onChange={handleChange}
            placeholder="e.g., Low-income households"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Budget</label>
            <input
              type="text"
              name="budget"
              value={input.budget}
              onChange={handleChange}
              placeholder="e.g. $50,000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
           </div>
           <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={input.duration}
              onChange={handleChange}
              placeholder="e.g. 12 Months"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
           </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Funding Source</label>
          <input
            type="text"
            name="fundingSource"
            value={input.fundingSource}
            onChange={handleChange}
            placeholder="e.g., Grant, Gov Funding, Donation"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Local Partner</label>
            <select
              name="localPartner"
              value={input.localPartner}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
            >
              <option value="">Select...</option>
              <option value="None (Direct Implementation)">None (Direct)</option>
              <option value="Community Leaders">Community Leaders</option>
              <option value="Local NGO">Local NGO</option>
              <option value="Government Body">Government Body</option>
              <option value="Religious Institution">Religious Institution</option>
              <option value="Private Sector">Private Sector</option>
            </select>
          </div>
          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tech Level</label>
             <select
              name="technologyLevel"
              value={input.technologyLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
            >
              <option value="">Select...</option>
              <option value="Low Tech">Low Tech (Manual)</option>
              <option value="Medium Tech">Medium Tech</option>
              <option value="High Tech">High Tech (Digital/AI)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-1">
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Likelihood</label>
             <span className={`text-xs font-bold px-2 py-0.5 rounded ${input.initialRiskLevel >= 7 ? 'bg-red-100 text-red-600' : input.initialRiskLevel >= 4 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
               {input.initialRiskLevel}/10
             </span>
          </div>
          <input 
            type="range" 
            name="initialRiskLevel"
            min="1" 
            max="10" 
            step="1"
            value={input.initialRiskLevel} 
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>Safe</span>
            <span>Risky</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description & Methodology</label>
          <textarea
            name="description"
            value={input.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe how the project works..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-sm leading-relaxed"
          />
        </div>

        <div className="flex gap-2 mb-2">
           <button
             onClick={handleSaveScenario}
             className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors border border-gray-300"
           >
             Save Scenario
           </button>
           {hasSavedScenario && (
             <button
               onClick={handleLoadScenario}
               className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors border border-gray-300"
             >
               Load Saved
             </button>
           )}
        </div>

        <button
          onClick={onSimulate}
          disabled={isLoading || !input.title || !input.description}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2
            ${isLoading || !input.title || !input.description 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Simulation...
            </>
          ) : (
            <>
              Run Simulation
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v18"/><path d="m5 18 6-3 6 3V6l-6 3-6-3"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
