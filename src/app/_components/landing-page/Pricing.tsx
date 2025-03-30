import React from "react";
import { Check } from "lucide-react";
const Pricing = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 py-24">
      <span className="mb-4 inline-block rounded-full bg-[#89AB9E]/30 px-5 py-2 text-sm font-semibold text-[#426d5d] shadow-sm">
        Pricing
      </span>
      <div className="max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Upgrade your Plan</h1>
          <p className="text-xl font-light text-gray-800">
            Simple, flexible pricing for you
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-8">
        <div className="rounded-2xl border-2 bg-white p-6">
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Free</h2>
            <div className="mb-6 flex">
              <span className="text-4xl font-bold">$0</span>
              <span className="ml-1 text-gray-500">/month</span>
            </div>
            <p className="text-gray-600">Get started with basic focus tools</p>
          </div>
          <button className="mb-8 w-full rounded-lg border-2 border-gray-900/20 px-4 py-3 font-medium text-gray-900/20">
            Current Plan
          </button>

          <div className="mb-8 space-y-4">
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">Basic focus environment</span>
            </div>
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">1 customizable focus space</span>
            </div>
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">Limited distraction blocking</span>
            </div>
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">Basic timers and tracking</span>
            </div>
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">Basic accessibility features</span>
            </div>
          </div>
        </div>
        {/* plus plan */}
        <div className="relative rounded-2xl border-2 border-[#89AB9E] bg-white p-6 shadow-lg shadow-[#89AB9E]">
          <div className="absolute -top-4 right-8 rounded-full bg-[#89AB9E] px-4 py-1 text-sm font-medium text-white">
            Most Popular
          </div>
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Plus</h2>
            <div className="mb-6 flex items-baseline">
              <span className="text-4xl font-bold">$19.99</span>
              <span className="ml-1 text-gray-500">/month</span>
            </div>
            <p className="text-gray-600">
              Everything you need to excel and focus
            </p>
          </div>
          <div className="mb-4">
            <button className="] w-full transform rounded-lg bg-[#89AB9E] px-4 py-3 font-medium text-white transition duration-100 ease-in-out hover:bg-[#6F9281]">
              Subscribe Now
            </button>
            <p className="mt-2 text-center text-xs text-gray-500">
              Cancel anytime, no hidden fees.
            </p>
          </div>

          <div className="mb-4 space-y-4">
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">Everything in Free</span>
            </div>
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">
                Unlimited customizable focus spaces
              </span>
            </div>
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">
                Advanced distraction blocking system
              </span>
            </div>
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">Focus analytics and insights</span>
            </div>
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">
                Neurodivergent-friendly customizations
              </span>
            </div>
            <div className="flex items-start">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
              <span className="text-sm">
                Priority support for neurodivergent learners
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Have questions?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </section>
  );
};

export default Pricing;
