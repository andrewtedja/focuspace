import React from "react";
import { Instagram, Twitter, Facebook, Linkedin, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1E2A38] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-16">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">FocuSpace</span>
            </div>
            <p className="max-w-xs text-sm text-[#A7BBC7]">
              Creating perfect learning environments for neurodivergent minds.
              Focus, learn, and thrive in your personalized digital space.
            </p>
            <div className="flex space-x-4">
              <Twitter
                size={18}
                className="cursor-pointer text-[#86B3D1] transition-colors hover:text-white"
              />
              <Instagram
                size={18}
                className="cursor-pointer text-[#86B3D1] transition-colors hover:text-white"
              />
              <Facebook
                size={18}
                className="cursor-pointer text-[#86B3D1] transition-colors hover:text-white"
              />
              <Linkedin
                size={18}
                className="cursor-pointer text-[#86B3D1] transition-colors hover:text-white"
              />
              <Github
                size={18}
                className="cursor-pointer text-[#86B3D1] transition-colors hover:text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="space-y-2">
              <li>Spaces</li>
              <li>Features</li>
              <li>Pricing</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Accessibility</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#3D4A5C] pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-[#A7BBC7]">
              {currentYear} FocuSpace. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-[#A7BBC7]">
              <span className="cursor-pointer">Privacy</span>
              <span className="cursor-pointer">Terms</span>
              <span className="cursor-pointer">Cookies</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
