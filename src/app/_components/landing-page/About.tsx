import Image from "next/image";
import React from "react";
import { Brain, Sparkles, BrainCircuit, Headphones } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="bg-gradient-to-b from-[#E9EEF2] to-[#BCD0D7]/50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full border border-[#86B3D1]/30 bg-[#f2f4f6] px-5 py-2 text-sm font-medium text-[#527680] shadow-sm">
            Our Story
          </div>
          <h2 className="mb-6 text-5xl font-bold text-[#2D3748]">
            Creating{" "}
            <span className="bg-gradient-to-r from-[#5A8CA3] to-[#4d6b90] bg-clip-text text-transparent">
              FOCUS
            </span>{" "}
            in a distracted world
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-[#4A5568]/80">
            FocuSpace was born from personal experiences with the challenges of
            focus and attention.
          </p>
        </div>

        {/* Main  */}
        <div className="grid grid-cols-2 items-center gap-12">
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#86B3D1]/20 to-[#7EB6A4]/20"></div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-2/3 w-2/3 rounded-2xl bg-[#E9EEF2]"></div>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/spaces/adhd-3.png"
                    alt="FocuSpace environment"
                    className="rounded-2xl object-cover"
                    width={500}
                    height={375}
                  />
                </div>
                <div className="absolute left-0 top-0 z-10 h-full w-full rounded-2xl bg-gradient-to-b from-transparent to-black/60"></div>
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    FocuSpace
                  </div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">
                    Workspace Environment
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-[#2D3748]">
                Our Mission
              </h3>
              <p className="leading-relaxed text-[#4A5568]">
                At FocuSpace, we&apos;re dedicated to to help you work and learn
                better, by creating digital environments that help
                neurodivergent learners thrive by minimizing distractions and
                maximizing focus potential. We believe everyone deserves a space
                that works with their unique cognitive style, not against it.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-2xl font-bold text-[#2D3748]">
                Research-Based Approach
              </h3>
              <p className="leading-relaxed text-[#4A5568]">
                Our virtual environments are designed based on extensive
                research on neurodiversity, sensory processing, and attention
                management. We focus on understanding the unique needs in ADHD,
                Dyslexia, and their learning differences to create spaces that
                address specific cognitive needs.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-start">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#86B3D1]/20">
                  <Brain className="text-[#5A8CA3]" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-[#2D3748]">
                    Sensory Calibration
                  </h4>
                  <p className="mt-1 text-sm text-[#4A5568]">
                    Personalized audio environments tuned to individual sensory
                    profiles
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#95BAAA]/20">
                  <Sparkles className="text-[#7EB6A4]" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-[#2D3748]">
                    Flow Optimization
                  </h4>
                  <p className="mt-1 text-sm text-[#4A5568]">
                    Environments designed to trigger and maintain flow states
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#9ebb89]/20">
                  <BrainCircuit className="text-[#9ebb89]" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-[#2D3748]">
                    Cognitive Flexibility
                  </h4>
                  <p className="mt-1 text-sm text-[#4A5568]">
                    Customizable settings for various cognitive styles and
                    preferences
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#86B3D1]/20">
                  <Headphones className="text-[#5A8CA3]" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-[#2D3748]">
                    Auditory Processing
                  </h4>
                  <p className="mt-1 text-sm text-[#4A5568]">
                    Designed from the bottom up to affect your brain and
                    optimize your performance.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="rounded-xl border border-[#E9EEF2] bg-white/70 p-5 backdrop-blur-sm">
                <p className="italic text-[#4A5568]">
                  &quot;While designed with neurodivergent minds as our
                  priority, FocuSpace welcomes anyone seeking a better
                  relationship with focus and productivity in our increasingly
                  distracted digital world.&quot;
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#86B3D1] to-[#7EB6A4] font-bold text-white">
                    K
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-[#2D3748]">
                      Koichan
                    </p>
                    <p className="text-xs text-[#7B9EA8]">
                      Creators of FocuSpace
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
