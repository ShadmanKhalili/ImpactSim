
import React from 'react';
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
    duration: "18 Months",
    localPartner: "Ministry of Health",
    technologyLevel: "High Tech",
    description: "Using autonomous drones to deliver blood and vaccines to hard-to-reach rural clinics to reduce spoilage and transit time."
  },
  {
    title: "Plastic Waste Roads",
    location: "Mumbai, India",
    targetAudience: "Urban Commuters",
    sector: "Infrastructure",
    budget: "$500,000",
    duration: "2 Years",
    localPartner: "Municipal Corporation",
    technologyLevel: "Medium Tech",
    description: "Collecting plastic waste from slums and melting it down to create durable, water-resistant road surfaces."
  },
  {
    title: "Digital Tablets for Education",
    location: "Northern Kenya",
    targetAudience: "Primary School Students",
    sector: "Education",
    budget: "$150,000",
    duration: "1 Year",
    localPartner: "None (Direct Implementation)",
    technologyLevel: "High Tech",
    description: "Distributing low-cost tablets pre-loaded with educational software to nomadic communities where school attendance is irregular."
  },
  {
    title: "Fog Catcher Water Systems",
    location: "Lima, Peru",
    targetAudience: "Hillside Communities",
    sector: "WASH",
    budget: "$75,000",
    duration: "9 Months",
    localPartner: "Community Leaders",
    technologyLevel: "Low Tech",
    description: "Installing large mesh nets to capture moisture from coastal fog, converting it into potable water for communities without plumbing."
  },
  {
    title: "Solar Community Kitchen",
    location: "Barisal, Bangladesh",
    targetAudience: "Rural Households",
    sector: "Energy / Livelihood",
    budget: "$50,000",
    duration: "1 Year",
    localPartner: "Local Women's Coop",
    technologyLevel: "Medium Tech",
    description: "A centralized solar-powered kitchen facility in the village center. Families will bring their raw food to the center to cook on clean stoves for a small fee."
  },
  {
    title: "AI Crop Diagnosis App",
    location: "Rural Ethiopia",
    targetAudience: "Smallholder Farmers",
    sector: "Agriculture",
    budget: "$120,000",
    duration: "2 Years",
    localPartner: "University Extension",
    technologyLevel: "High Tech",
    description: "A mobile app that uses image recognition to diagnose crop diseases. Requires farmers to have smartphones and data connectivity."
  },
  {
    title: "Micro-Insurance for Flood Victims",
    location: "Sindh, Pakistan",
    targetAudience: "Riverine Communities",
    sector: "Finance",
    budget: "$200,000",
    duration: "3 Years",
    localPartner: "Local NGO",
    technologyLevel: "Medium Tech",
    description: "Parametric insurance that pays out automatically via mobile money when satellite data detects flooding, bypassing claims adjusters."
  },
  {
    title: "Biogas Digesters from Livestock",
    location: "Sichuan, China",
    targetAudience: "Pig Farmers",
    sector: "Energy",
    budget: "$300,000",
    duration: "18 Months",
    localPartner: "Government Bureau",
    technologyLevel: "Medium Tech",
    description: "Installing underground tanks to convert pig manure into methane gas for cooking and heating, reducing coal usage."
  },
  {
    title: "Menstrual Hygiene Vending Machines",
    location: "Rural Rajasthan, India",
    targetAudience: "Adolescent Girls",
    sector: "Health / Gender",
    budget: "$40,000",
    duration: "1 Year",
    localPartner: "School Boards",
    technologyLevel: "Low Tech",
    description: "Installing coin-operated sanitary pad vending machines in school bathrooms to improve attendance among girls."
  },
  {
    title: "Reforestation via Seed Bombing",
    location: "Amazon Rainforest, Brazil",
    targetAudience: "Global Climate",
    sector: "Environment",
    budget: "$1,000,000",
    duration: "5 Years",
    localPartner: "None (International Team)",
    technologyLevel: "High Tech",
    description: "Using light aircraft to drop thousands of seed 'bombs' (encased in clay/compost) over deforested areas to accelerate regrowth."
  },
  {
    title: "Cash Transfers for Girls' Education",
    location: "Kandahar, Afghanistan",
    targetAudience: "Families of girls aged 10-15",
    sector: "Education / Cash",
    budget: "$500,000",
    duration: "2 Years",
    localPartner: "Religious Elders",
    technologyLevel: "Low Tech",
    description: "Providing unconditional cash grants to families who allow their daughters to attend home-based schooling."
  },
  {
    title: "Urban Vertical Farming",
    location: "Detroit, USA",
    targetAudience: "Food Deserts",
    sector: "Agriculture",
    budget: "$800,000",
    duration: "3 Years",
    localPartner: "Community Center",
    technologyLevel: "High Tech",
    description: "Repurposing abandoned warehouses into high-tech hydroponic vertical farms to provide fresh greens to local neighborhoods."
  }
];

export const ProjectForm: React.FC<ProjectFormProps> = ({ input, setInput, onSimulate, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleRandomize = () => {
    const randomProject = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setInput(randomProject);
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
          Random Scenario
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
