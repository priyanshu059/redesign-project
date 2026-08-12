// src/pages/Privacy.jsx
import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#09090b] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8 relative z-10">Privacy Policy</h1>
        
        <div className="space-y-6 text-zinc-400 leading-relaxed relative z-10">
          <p>
            Welcome to EventOps AI's Privacy Policy. Your privacy is critically important to us.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect in various ways, including to:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide, operate, and maintain our platform</li>
              <li>Improve, personalize, and expand our services</li>
              <li>Understand and analyze how you use our platform</li>
              <li>Develop new features, interfaces, and AI models</li>
            </ul>
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. AI and Data Processing</h2>
          <p>
            EventOps AI utilizes autonomous agents. Data submitted to the platform may be processed by these agents to optimize event management, schedule speakers, and handle incidents efficiently.
          </p>

          <p className="mt-8 text-sm text-zinc-500 italic">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
