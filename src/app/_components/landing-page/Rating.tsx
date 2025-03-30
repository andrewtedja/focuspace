import Image from "next/image";
import React from "react";

const Rating = () => {
  return (
    <section className="bg-gradient-to-r from-[##BCD0D7] to-[#D7DCD8] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-white p-10 shadow-sm">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 inline-flex">
              {"★★★★★".split("").map((star, i) => (
                <span key={i} className="text-2xl text-[#eec447]">
                  {star}
                </span>
              ))}
            </div>
            <p className="mb-3 max-w-3xl text-2xl font-light text-[#4A5568]">
              &quot;As someone with ADHD, finding the right environment to study
              has always been challenging. FocuSpace has been a game-changer for
              my productivity and focus.&quot;
            </p>
            <Image
              src="/images/landing/avatar.png"
              alt="avatar"
              width={120}
              height={120}
              className="mb-3 rounded-full border-[1.5px] border-black bg-black"
            />
            <div>
              <div className="font-semibold text-[#2D3748]">Theo Kurniady</div>
              <div className="text-sm text-[#718096]">
                Graduate Student • Using FocuSpace for 8 months
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rating;
