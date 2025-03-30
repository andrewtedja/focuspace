import { ChevronRight } from "lucide-react";
import React from "react";

const CTA = () => {
  return (
    <section className="bg-white] relative flex min-h-screen items-center justify-center bg-[#f6f9fa] bg-cover bg-no-repeat">
      <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-[#86B3D1]/0 via-[#86B3D1] to-[#86B3D1]/0"></div>
      {/* <div className="absolute inset-0 z-0 bg-black/50"></div> */}
      <div className="z-10 mx-auto max-w-4xl px-6 text-center">
        {/* <p>&lt;MASKOT HERE&gt;</p> */}
        <h2 className="mb-6 text-4xl font-bold text-[#2D3748]">
          Ready to transform how you learn?
        </h2>
        <p className="mb-8 text-[#4A5568]">
          Join thousands of neurodivergent learners who have found their perfect
          focus environment.
        </p>
        <div className="flex flex-row justify-center space-x-4 space-y-0">
          <button className="group flex items-center justify-center rounded-full bg-[#86B3D1] px-24 py-8 text-5xl font-semibold text-white transition-all hover:bg-[#8fbecb] hover:shadow-lg hover:shadow-[#86B3D1]/30 active:bg-[#86B3D1]">
            <span className="transition-transform group-hover:-translate-x-2">
              Get Started
            </span>
            <ChevronRight
              size={42}
              className="ml-3 transition-transform group-hover:translate-x-2"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
