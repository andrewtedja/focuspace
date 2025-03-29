import { ChevronRight } from "lucide-react";
import React from "react";

const CTA = () => {
  return (
    <div>
      <div className="bg-white py-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p>&lt;MASKOT HERE&gt;</p>
          <h2 className="mb-6 text-4xl font-bold text-[#2D3748]">
            Ready to transform how you learn?
          </h2>
          <p className="mb-8 text-[#4A5568]">
            Join thousands of neurodivergent learners who have found their
            perfect focus environment.
          </p>
          <div className="flex flex-row justify-center space-x-4 space-y-0">
            <button className="group flex items-center justify-center rounded-full bg-[#86B3D1] px-10 py-4 font-medium text-white transition-all hover:scale-105 hover:bg-[#8fbecb] hover:shadow-lg hover:shadow-[#86B3D1]/30 active:bg-[#86B3D1]">
              <span>Get Started</span>
              <ChevronRight
                size={18}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
