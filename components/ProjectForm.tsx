
import React, { useState, useEffect } from 'react';
import { ProjectInput } from '../types';

interface ProjectFormProps {
  input: ProjectInput;
  setInput: React.Dispatch<React.SetStateAction<ProjectInput>>;
  onSimulate: () => void;
  isLoading: boolean;
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
    title: "Plastic Waste Roads",
    location: "Mumbai, India",
    targetAudience: "Urban Commuters",
    sector: "Infrastructure",
    budget: "$500,000",
    fundingSource: "Public-Private Partnership",
    duration: "2 Years",
    localPartner: "Municipal Corporation",
    technologyLevel: "Medium Tech",
    teamExperience: "Experienced (3-5 years)",
    description: "Collecting plastic waste from slums and melting it down to create durable, water-resistant road surfaces.",
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
    title: "Blockchain Land Registry",
    location: "Honduras",
    targetAudience: "Indigenous Communities",
    sector: "Governance / Tech",
    budget: "$1,200,000",
    fundingSource: "Government Funding",
    duration: "3 Years",
    localPartner: "Government Body",
    technologyLevel: "High Tech",
    teamExperience: "Expert International Consortium",
    description: "Digitizing land titles on an immutable blockchain ledger to prevent land grabbing and corruption. Involves complex legal reform and tech infrastructure.",
    strategyHistory: []
  },
  {
    title: "Biogas from Human Waste",
    location: "Peri-urban Kathmandu",
    targetAudience: "Low-income households",
    sector: "Sanitation / Energy",
    budget: "$75,000",
    fundingSource: "Donation",
    duration: "1 Year",
    localPartner: "Local NGO",
    technologyLevel: "Medium Tech",
    teamExperience: "Experienced (3-5 years)",
    description: "Constructing community biogas digesters connected to public toilets. The gas produced is piped to nearby homes for cooking. Faces potential cultural taboos.",
    strategyHistory: []
  },
  {
    title: "Coding Bootcamp for Refugees",
    location: "Za'atari Camp, Jordan",
    targetAudience: "Syrian Youth",
    sector: "Education / Livelihood",
    budget: "$300,000",
    fundingSource: "Corporate CSR",
    duration: "12 Months",
    localPartner: "International NGO",
    technologyLevel: "Medium Tech",
    teamExperience: "Mixed Experience",
    description: "Intensive 6-month full-stack web development course for refugees, aiming to get them remote freelance work in Europe.",
    strategyHistory: []
  },
  {
    title: "Water ATMs",
    location: "Nairobi Slums",
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
    title: "Tele-Health Kiosks",
    location: "Amazonas, Brazil",
    targetAudience: "River Communities",
    sector: "Healthcare",
    budget: "$800,000",
    fundingSource: "Government Funding",
    duration: "4 Years",
    localPartner: "Ministry of Health",
    technologyLevel: "High Tech",
    teamExperience: "Expert International Consortium",
    description: "Solar-powered kiosks with satellite internet providing video consultations with doctors in Sao Paulo for remote river villages.",
    strategyHistory: []
  }
];

export const ProjectForm: React.FC<ProjectFormProps> = ({ input, setInput, onSimulate, isLoading }) => {
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

  const InputGroup = ({ label, name, value, placeholder, icon }: any) => (
    <div className="relative group w-full">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-indigo-600 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base text-gray-900 font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 shadow-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="glass-panel rounded-2xl p-8 shadow-xl border border-white h-fit">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          Design Project
        </h2>
        <button 
          onClick={handleRandomize}
          className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 hover:scale-110 active:scale-95 transition-all shadow-sm"
          title="Auto-fill Random Scenario"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Row 1: Title & Funding Source (Swapped) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
           <InputGroup 
            label="Project Name" 
            name="title" 
            value={input.title} 
            placeholder="e.g. Solar Community Kitchen"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>}
          />
           <InputGroup 
              label="Funding Source" 
              name="fundingSource" 
              value={input.fundingSource} 
              placeholder="Grants"
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>}
          />
        </div>

        {/* Row 2: Location & Beneficiaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputGroup 
            label="Location" 
            name="location" 
            value={input.location} 
            placeholder="Kenya"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
          />
          <InputGroup 
            label="Target Beneficiaries" 
            name="targetAudience" 
            value={input.targetAudience} 
            placeholder="Rural Farmers"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        </div>

        {/* Row 3: Budget, Duration, Sector (Swapped) (3 cols on larger screens) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
           <InputGroup 
             label="Budget" 
             name="budget" 
             value={input.budget} 
             placeholder="$50k"
             icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
           />
           <InputGroup 
             label="Duration" 
             name="duration" 
             value={input.duration} 
             placeholder="12 Mo"
             icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
           />
           <InputGroup 
            label="Sector" 
            name="sector" 
            value={input.sector} 
            placeholder="Healthcare"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
          />
        </div>

        {/* Row 4: Partners, Tech, Team (3 cols on larger screens) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Local Partner</label>
            <select
              name="localPartner"
              value={input.localPartner}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base text-gray-900 font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all hover:bg-white shadow-sm"
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
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tech Level</label>
             <select
              name="technologyLevel"
              value={input.technologyLevel}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base text-gray-900 font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all hover:bg-white shadow-sm"
            >
              <option value="">Select...</option>
              <option value="Low Tech">Low Tech</option>
              <option value="Medium Tech">Medium Tech</option>
              <option value="High Tech">High Tech</option>
            </select>
          </div>
          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Team Experience</label>
             <select
              name="teamExperience"
              value={input.teamExperience}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base text-gray-900 font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all hover:bg-white shadow-sm"
            >
              <option value="">Select...</option>
              <option value="New / Volunteer Team">New / Volunteer Team</option>
              <option value="Mixed Experience">Mixed Experience</option>
              <option value="Experienced (3-5 years)">Experienced (3-5 years)</option>
              <option value="Expert International Consortium">Expert International Consortium</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Methodology</label>
          <textarea
            name="description"
            value={input.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the project approach..."
            className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none text-sm text-gray-800 font-medium leading-relaxed hover:bg-white shadow-sm"
          />
        </div>

        {/* Strategy Evolution Section */}
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
           <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
             Strategy Evolution
           </label>
           
           {input.strategyHistory && input.strategyHistory.length > 0 ? (
             <div className="space-y-2 mb-4">
               {input.strategyHistory.map((pivot, idx) => (
                 <div key={idx} className="text-xs text-slate-700 font-medium bg-white p-2 rounded-lg shadow-sm border border-indigo-100 flex items-start gap-2">
                   <span className="text-indigo-500 mt-0.5">•</span>
                   {pivot}
                 </div>
               ))}
             </div>
           ) : (
             <p className="text-xs text-slate-400 italic mb-3 ml-1">No strategies applied yet.</p>
           )}

           {/* Manual Strategy Input */}
           <div className="flex gap-2">
              <input 
                type="text"
                value={manualPivot}
                onChange={(e) => setManualPivot(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddManualPivot()}
                placeholder="Add manual strategy (e.g. 'Partner with local university')..."
                className="flex-grow px-3 py-2 text-xs border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700"
              />
              <button 
                onClick={handleAddManualPivot}
                className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center"
                title="Add Strategy"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
           </div>
        </div>

        <div className="flex gap-3 pt-4">
           <button
             onClick={handleSaveScenario}
             className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 text-slate-700 text-xs font-bold uppercase tracking-wide rounded-xl transition-all border border-gray-200 shadow-sm hover:shadow active:scale-[0.98]"
           >
             Save
           </button>
           {hasSavedScenario && (
             <button
               onClick={handleLoadScenario}
               className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 text-slate-700 text-xs font-bold uppercase tracking-wide rounded-xl transition-all border border-gray-200 shadow-sm hover:shadow active:scale-[0.98]"
             >
               Load
             </button>
           )}
        </div>

        <button
          onClick={onSimulate}
          disabled={isLoading || !input.title}
          className={`w-full py-5 rounded-xl font-bold text-white shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 group relative overflow-hidden text-lg
            ${isLoading || !input.title 
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.99]'}`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-6 w-6 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="tracking-wide">Running Simulation...</span>
            </div>
          ) : (
            <>
              <span className="tracking-wide">Run Simulation</span>
              <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
