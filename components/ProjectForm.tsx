import React, { useState, useEffect } from 'react';
import { ProjectInput } from '../types';

interface ProjectFormProps {
  input: ProjectInput;
  setInput: React.Dispatch<React.SetStateAction<ProjectInput>>;
  onSimulate: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

const STORAGE_KEY = 'impactSim_savedScenario';

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
    teamExperience: "Expert International Consortium",
    description: "Using autonomous drones to deliver blood and vaccines to hard-to-reach rural clinics to reduce spoilage and transit time.",
    strategyHistory: []
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
    teamExperience: "Experienced (3-5 years)",
    description: "A centralized solar-powered kitchen facility in the village center. Families will bring their raw food to the center to cook on clean stoves for a small fee.",
    strategyHistory: []
  },
  {
    title: "AI Crop Disease App",
    location: "Northern Nigeria",
    targetAudience: "Smallholder Farmers",
    sector: "Agriculture",
    budget: "$150,000",
    fundingSource: "Venture Philanthropy",
    duration: "2 Years",
    localPartner: "None (Direct Implementation)",
    technologyLevel: "High Tech",
    teamExperience: "New / Volunteer Team",
    description: "A smartphone app using AI to diagnose cassava diseases. Farmers take a photo of the leaf, and the app suggests treatment. Requires internet and smartphones.",
    strategyHistory: []
  },
  {
    title: "Water ATMs",
    location: "Nairobi Slums, Kenya",
    targetAudience: "Urban Poor",
    sector: "WASH",
    budget: "$100,000",
    fundingSource: "Impact Investment",
    duration: "18 Months",
    localPartner: "Private Sector",
    technologyLevel: "Medium Tech",
    teamExperience: "New / Volunteer Team",
    description: "Installing automated water dispensing kiosks (ATMs) where residents use prepaid smart cards to buy clean water at a low cost.",
    strategyHistory: []
  },
  {
    title: "Blockchain Land Registry",
    location: "Accra, Ghana",
    targetAudience: "Small Landowners",
    sector: "Governance / Tech",
    budget: "$500,000",
    fundingSource: "Government Grant",
    duration: "2 Years",
    localPartner: "Ministry of Lands",
    technologyLevel: "High Tech",
    teamExperience: "Expert International Consortium",
    description: "Creating an immutable digital ledger for land titles on a public blockchain to reduce land disputes and corruption in property registration.",
    strategyHistory: []
  },
  {
    title: "Eco-Pad Micro-factories",
    location: "Rural Bihar, India",
    targetAudience: "Adolescent Girls",
    sector: "Health / Livelihood",
    budget: "$35,000",
    fundingSource: "Crowdfunding Donation",
    duration: "1 Year",
    localPartner: "Local NGO",
    technologyLevel: "Low Tech",
    teamExperience: "Mixed Experience",
    description: "Setting up small-scale manufacturing units for biodegradable sanitary pads using banana fiber, operated by local women's self-help groups.",
    strategyHistory: []
  },
  {
    title: "Floating Climate Schools",
    location: "Ganges Delta, Bangladesh",
    targetAudience: "Flood-prone Children",
    sector: "Education / Climate",
    budget: "$85,000",
    fundingSource: "Climate Adaptation Fund",
    duration: "3 Years",
    localPartner: "Local NGO",
    technologyLevel: "Low Tech",
    teamExperience: "Experienced (3-5 years)",
    description: "Solar-powered boats acting as mobile classrooms and libraries to ensure education continuity during monsoon floods.",
    strategyHistory: []
  },
  {
    title: "Refugee Coding Bootcamp",
    location: "Kakuma Camp, Kenya",
    targetAudience: "Refugee Youth",
    sector: "Education / Tech",
    budget: "$120,000",
    fundingSource: "Corporate CSR",
    duration: "18 Months",
    localPartner: "International NGO",
    technologyLevel: "Medium Tech",
    teamExperience: "Experienced (3-5 years)",
    description: "Intensive 6-month full-stack web development training for refugees, coupled with a freelancing platform to access remote work opportunities.",
    strategyHistory: []
  },
  {
    title: "Community Biogas Plants",
    location: "Mekong Delta, Vietnam",
    targetAudience: "Livestock Farmers",
    sector: "Energy / Agriculture",
    budget: "$60,000",
    fundingSource: "Government Subsidy",
    duration: "2 Years",
    localPartner: "Farmers Coop",
    technologyLevel: "Medium Tech",
    teamExperience: "New / Volunteer Team",
    description: "Constructing biodigesters to convert pig waste into cooking gas and organic fertilizer, reducing pollution and household energy costs.",
    strategyHistory: []
  },
  {
    title: "Telehealth Container Clinics",
    location: "Andes Mountains, Peru",
    targetAudience: "Indigenous Communities",
    sector: "Healthcare",
    budget: "$200,000",
    fundingSource: "Multilateral Grant",
    duration: "2 Years",
    localPartner: "Ministry of Health",
    technologyLevel: "High Tech",
    teamExperience: "Expert International Consortium",
    description: "Refurbished shipping containers equipped with satellite internet and diagnostic tools, connecting remote patients with doctors in Lima via video.",
    strategyHistory: []
  },
  {
    title: "Urban E-Waste Mining Hub",
    location: "Lagos, Nigeria",
    targetAudience: "Informal Scrappers",
    sector: "Environment / Economy",
    budget: "$150,000",
    fundingSource: "Green Fund",
    duration: "1 Year",
    localPartner: "Private Sector Recycling Firm",
    technologyLevel: "Medium Tech",
    teamExperience: "Mixed Experience",
    description: "Establishing a formal, safe processing facility for electronic waste, buying scrap from informal collectors and ensuring toxic materials are handled correctly.",
    strategyHistory: []
  },
  {
    title: "Crypto Basic Income (UBI)",
    location: "El Zonte, El Salvador",
    targetAudience: "Unbanked Villagers",
    sector: "Fintech",
    budget: "$1,000,000",
    fundingSource: "Crypto DAO",
    duration: "1 Year",
    localPartner: "None (Direct Implementation)",
    technologyLevel: "High Tech",
    teamExperience: "New / Volunteer Team",
    description: "Direct unconditional cash transfers distributed via a cryptocurrency wallet to every resident to stimulate local economic growth.",
    strategyHistory: []
  }
];

export const ProjectForm: React.FC<ProjectFormProps> = ({ input, setInput, onSimulate, isLoading, isDarkMode }) => {
  const [hasSavedScenario, setHasSavedScenario] = useState(false);
  const [manualPivot, setManualPivot] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHasSavedScenario(true);
      }
    } catch (e) {
      console.warn("LocalStorage unavailable");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleRandomize = () => {
    const randomProject = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setInput(randomProject);
  };

  const handleSaveScenario = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
      setHasSavedScenario(true);
    } catch (e) {
      // ignore
    }
  };

  const handleLoadScenario = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setInput(JSON.parse(saved));
      }
    } catch (e) {
      // ignore
    }
  };

  const handleAddManualPivot = () => {
    if (!manualPivot.trim()) return;
    const newEntry = `[Manual Strategy] ${manualPivot}`;
    setInput(prev => ({
      ...prev,
      strategyHistory: prev.strategyHistory ? [...prev.strategyHistory, newEntry] : [newEntry]
    }));
    setManualPivot("");
  };

  const inputClass = `w-full px-4 py-3 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm ${
    isDarkMode 
      ? 'bg-slate-900/50 border-slate-700/50 text-white focus:bg-slate-900 focus:border-indigo-500/50 placeholder-slate-600' 
      : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500/50 placeholder-slate-400'
  }`;

  const labelClass = `block text-[10px] font-bold uppercase tracking-widest mb-1.5 transition-colors ${
    isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
  }`;

  const InputGroup = ({ label, name, value, placeholder, icon }: any) => (
    <div className="relative group w-full">
      <label className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`}>
          {icon}
        </div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`pl-10 pr-4 ${inputClass}`}
        />
      </div>
    </div>
  );

  return (
    <div className="glass-panel rounded-2xl p-8 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-75"></div>
      
      {/* Header */}
      <div className={`flex flex-col gap-4 mb-8 pb-6 border-b ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            Design Project
          </h2>
        </div>
        
        <button 
          onClick={handleRandomize}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wide transition-all shadow-sm border flex items-center justify-center gap-2 group ${
            isDarkMode 
              ? 'bg-slate-800/80 hover:bg-slate-800 text-indigo-300 border-slate-700 hover:border-indigo-500/30' 
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'
          }`}
        >
          <svg className={`transition-colors ${isDarkMode ? 'group-hover:text-indigo-400' : 'text-indigo-600'}`} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-5.5 5.5"/><path d="m21 3-9 9"/><path d="m12.6 12.6-9.9 9.9"/><path d="M5 3a2 2 0 0 0-2 2v2"/><path d="M3 13v2a2 2 0 0 0 2 2h2"/><path d="M13 3h2a2 2 0 0 1 2 2v2"/><path d="M21 13v2a2 2 0 0 1-2 2h-2"/></svg>
          ✨ Create Random Scenario
        </button>
      </div>

      <div className="space-y-5">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <InputGroup 
            label="Project Name" 
            name="title" 
            value={input.title} 
            placeholder="e.g. Solar Community Kitchen"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>}
          />
           <InputGroup 
              label="Funding Source" 
              name="fundingSource" 
              value={input.fundingSource} 
              placeholder="e.g. Micro-finance"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup 
            label="Location" 
            name="location" 
            value={input.location} 
            placeholder="e.g. Barisal, Bangladesh"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
          />
          <InputGroup 
            label="Target Beneficiaries" 
            name="targetAudience" 
            value={input.targetAudience} 
            placeholder="e.g. Rural Households"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <InputGroup 
             label="Budget" 
             name="budget" 
             value={input.budget} 
             placeholder="e.g. $50,000"
             icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
           />
           <InputGroup 
             label="Duration" 
             name="duration" 
             value={input.duration} 
             placeholder="e.g. 1 Year"
             icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
           />
           <InputGroup 
            label="Sector" 
            name="sector" 
            value={input.sector} 
            placeholder="e.g. Energy"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
          />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Local Partner</label>
            <select
              name="localPartner"
              value={input.localPartner}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" className={isDarkMode ? "bg-slate-800" : ""}>Select...</option>
              <option value="None (Direct Implementation)" className={isDarkMode ? "bg-slate-800" : ""}>None (Direct)</option>
              <option value="Community Leaders" className={isDarkMode ? "bg-slate-800" : ""}>Community Leaders</option>
              <option value="Local NGO" className={isDarkMode ? "bg-slate-800" : ""}>Local NGO</option>
              <option value="Government Body" className={isDarkMode ? "bg-slate-800" : ""}>Government Body</option>
              <option value="Religious Institution" className={isDarkMode ? "bg-slate-800" : ""}>Religious Institution</option>
              <option value="Private Sector" className={isDarkMode ? "bg-slate-800" : ""}>Private Sector</option>
            </select>
          </div>
          <div>
             <label className={labelClass}>Tech Level</label>
             <select
              name="technologyLevel"
              value={input.technologyLevel}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" className={isDarkMode ? "bg-slate-800" : ""}>Select...</option>
              <option value="Low Tech" className={isDarkMode ? "bg-slate-800" : ""}>Low Tech</option>
              <option value="Medium Tech" className={isDarkMode ? "bg-slate-800" : ""}>Medium Tech</option>
              <option value="High Tech" className={isDarkMode ? "bg-slate-800" : ""}>High Tech</option>
            </select>
          </div>
          <div>
             <label className={labelClass}>Team Experience</label>
             <select
              name="teamExperience"
              value={input.teamExperience}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" className={isDarkMode ? "bg-slate-800" : ""}>Select...</option>
              <option value="New / Volunteer Team" className={isDarkMode ? "bg-slate-800" : ""}>New / Volunteer Team</option>
              <option value="Mixed Experience" className={isDarkMode ? "bg-slate-800" : ""}>Mixed Experience</option>
              <option value="Experienced (3-5 years)" className={isDarkMode ? "bg-slate-800" : ""}>Experienced (3-5 years)</option>
              <option value="Expert International Consortium" className={isDarkMode ? "bg-slate-800" : ""}>Expert International Consortium</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Methodology</label>
          <textarea
            name="description"
            value={input.description}
            onChange={handleChange}
            rows={5}
            placeholder="e.g. A centralized solar-powered kitchen facility in the village center..."
            className={inputClass}
          />
        </div>

        {/* Strategy Evolution Section */}
        <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'}`}>
           <label className={`block text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
             Strategy Evolution
           </label>
           
           {input.strategyHistory && input.strategyHistory.length > 0 ? (
             <div className="space-y-2 mb-4">
               {input.strategyHistory.map((pivot, idx) => (
                 <div key={idx} className={`text-xs font-medium p-2 rounded-lg shadow-sm border flex items-start gap-2 ${isDarkMode ? 'text-slate-300 bg-slate-800/80 border-indigo-500/20' : 'text-slate-700 bg-white border-indigo-100'}`}>
                   <span className="text-indigo-500 mt-0.5">•</span>
                   {pivot}
                 </div>
               ))}
             </div>
           ) : (
             <p className={`text-xs italic mb-3 ml-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No strategies applied yet.</p>
           )}

           {/* Manual Strategy Input */}
           <div className="flex gap-2">
              <input 
                type="text"
                value={manualPivot}
                onChange={(e) => setManualPivot(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddManualPivot()}
                placeholder="Add manual strategy..."
                className={`flex-grow px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 ${isDarkMode ? 'bg-slate-900/50 border-indigo-500/30 focus:border-indigo-400 focus:ring-indigo-400/50 text-white placeholder-slate-500' : 'bg-white border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500/50 text-slate-800 placeholder-slate-400'}`}
              />
              <button 
                onClick={handleAddManualPivot}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center border ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-indigo-500/20' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 border-indigo-200'}`}
                title="Add Strategy"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
           </div>
        </div>

        <div className={`flex gap-3 pt-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
           <button
             onClick={handleSaveScenario}
             className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-wide rounded-xl transition-all border shadow-sm active:scale-[0.98] ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'}`}
           >
             Save
           </button>
           {hasSavedScenario && (
             <button
               onClick={handleLoadScenario}
               className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-wide rounded-xl transition-all border shadow-sm active:scale-[0.98] ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'}`}
             >
               Load
             </button>
           )}
        </div>

        <button
          onClick={onSimulate}
          disabled={isLoading || !input.title}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3 group relative overflow-hidden text-sm uppercase tracking-wider
            ${isLoading || !input.title 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700' 
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/20 active:scale-[0.99] border border-transparent'}`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Running...</span>
            </div>
          ) : (
            <>
              <span>Run Simulation</span>
              <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};