// src/pages/Terms.jsx
import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#09090b] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8 relative z-10">Terms of Service</h1>
        
        <div className="space-y-6 text-zinc-400 leading-relaxed relative z-10">
          <p>
            By accessing or using the EventOps AI platform, you agree to be bound by these Terms of Service.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            If you disagree with any part of the terms, then you may not access the service. These terms apply to all visitors, users, and others who access or use the platform.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily use the EventOps AI platform for personal or business event management. This is the grant of a license, not a transfer of title.
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Disclaimer</h2>
          <p>
            The materials on EventOps AI are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. AI Agent Autonomy</h2>
          <p>
            Our platform uses AI agents to automate tasks. While we strive for accuracy, it is your responsibility to review and approve critical actions taken by the AI on your behalf.
          </p>

          <p className="mt-8 text-sm text-zinc-500 italic">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
