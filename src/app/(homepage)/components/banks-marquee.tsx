import React from "react";

const banks = [
  "Bank of America",
  "Chase",
  "Wells Fargo",
  "Citibank",
  "US Bank",
  "PNC",
  "TD Bank",
  "Capital One",
  "HSBC",
  "Ally Bank",
];

export function BanksMarquee() {
  return (
    <div className="relative mx-auto my-8 w-full max-w-7xl overflow-hidden py-2">
      <div className="animate-marquee flex w-max">
        {[...banks, ...banks].map((bank, idx) => (
          <div
            key={idx}
            className="flex min-w-[160px] items-center justify-center px-8 text-base font-medium whitespace-nowrap text-gray-700 sm:min-w-[110px] sm:px-4 sm:text-sm md:min-w-[160px] md:px-8 md:text-base"
          >
            {bank}
          </div>
        ))}
      </div>
      {/* Fade out gradients on the edges */}
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent"></div>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}
      </style>
    </div>
  );
}
