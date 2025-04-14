import React from "react";
import {
  Sparkles,
  Brain,
  Layers,
  Compass,
  PenTool,
  Target,
} from "lucide-react";

const features = [
  {
    icon: <Target size={28} />,
    title: "Focus Learning Spaces",
    desc: "Customize visuals, sounds, and interactive elements to create your ideal focus environment.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "AI Buddy",
    desc: "Study with your own AI assistant that adapts to your communication style and can generate flashcards.",
  },
  {
    icon: <Compass size={28} />,
    title: "Task Management",
    desc: "Get organized with customizable to-do lists and Pomodoro timers, all in one place.",
  },
  {
    icon: <PenTool size={28} />,
    title: "Cognitive Profiling",
    desc: "Enhanced readability with specialized fonts, spacing, and visual settings designed for dyslexic readers.",
  },
  {
    icon: <Layers size={28} />,
    title: "Multi-Sensory Design",
    desc: "Customize flexible visuals, sounds, and interactive elements to create your ideal focus environment.",
  },
  {
    icon: <Brain size={28} />,
    title: "Adaptive Learning",
    desc: "The more you use FocuSpace, the better it gets at optimizing for your specific needs.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative overflow-hidden py-32">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#E9EEF2] to-[#F2F5F8]"></div>
      <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-[#86B3D1]/0 via-[#86B3D1] to-[#86B3D1]/0"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-8">
        <div className="mb-24 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#86B3D1]/30 px-5 py-2 text-sm font-semibold text-[#4A6D8B] shadow-sm">
            FEATURES
          </span>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-[#2D3748]">
            Designed for Your{" "}
            <span className="bg-gradient-to-r from-[#7B9EA8] to-[#6183ac] bg-clip-text text-transparent">
              Unique Mind
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#4A5568]">
            Customize every aspect of your learning environment to match your
            cognitive preferences and sensory needs.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-100 bg-[#F5F7FA] p-8 shadow-xl shadow-gray-400/20 transition-transform duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-sky-200/30"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#e4f4ff] text-gray-950 shadow-sm transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#2D3748] transition-colors duration-300 group-hover:text-[#86B3D1]">
                {feature.title}
              </h3>
              <p className="text-[#718096]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
