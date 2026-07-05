"use client";

import { useEffect, useState } from "react";
import Chat from "@/components/Chat";

interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  async function fetchServices() {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.docs || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoadingServices(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  // Fallback demo services to display if DB is empty, making the UI gorgeous
  const displayServices = services.length > 0 ? services : [
    {
      id: "1",
      name: "Teeth Whitening",
      description: "Professional laser teeth whitening for a bright, confident smile. Complete session.",
      price: 299,
    },
    {
      id: "2",
      name: "Dental Consultation",
      description: "Comprehensive oral exam, dental x-rays, and personalized treatment planning.",
      price: 49,
    },
    {
      id: "3",
      name: "Invisalign® Aligners",
      description: "Clear, removable aligners to straighten teeth comfortably without metal braces.",
      price: 3999,
    },
    {
      id: "4",
      name: "Hygiene & Deep Cleaning",
      description: "Plaque removal, tartar scaling, polishing, and expert gum care advice.",
      price: 120,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Premium Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <span className="font-extrabold text-xl text-slate-950 font-mono">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
              AI Clinic
            </h1>
            <p className="text-xs text-slate-400 font-medium">AI Smart Appointment Booking</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            AI Doctor Active
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Services list only (Privacy first) */}
        <section className="lg:col-span-5 flex flex-col">
          {/* Services List Panel */}
          <div className="bg-slate-950/50 border border-slate-850 p-6 rounded-2xl flex flex-col gap-4 shadow-xl h-[620px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold tracking-wide text-slate-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9m3 0H9m1.01-2.01h.01M9 16h.01" />
                </svg>
                Our Dental Services
              </h2>
              {services.length === 0 && (
                <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                  Using fallback
                </span>
              )}
            </div>
            
            {services.length === 0 && (
              <p className="text-xs text-slate-400 bg-slate-900/50 border border-slate-800 p-3 rounded-xl">
                💡 <span className="font-semibold text-slate-300">No customized services:</span> Standard clinic services are loaded.
              </p>
            )}

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {displayServices.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 p-4 rounded-xl flex justify-between items-start gap-4 transition group hover:shadow-md"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-teal-300 transition">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>
                  {service.price !== undefined && (
                    <span className="text-xs font-extrabold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20 whitespace-nowrap">
                      ${service.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: AI Chat Panel */}
        <section className="lg:col-span-7 flex flex-col">
          <Chat />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-4 border-t border-slate-800 text-center text-[10px] text-slate-500 mt-auto bg-slate-950">
        &copy; {new Date().getFullYear()} AI Clinic. All Rights Reserved. Built with Next.js, MongoDB, & Groq AI.
      </footer>
    </div>
  );
}