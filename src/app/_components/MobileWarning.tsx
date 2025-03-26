import React from "react";

const MobileWarning = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E131E] p-4 text-center text-lg text-white lg:hidden">
      <div className="space-y-2">
        <p className="mb-10 text-5xl font-bold">Sorry!</p>
        <p>This app is optimized for desktop viewing.</p>
        <p>Please use a PC/Desktop for the best experience.</p>
      </div>
    </div>
  );
};

export default MobileWarning;
