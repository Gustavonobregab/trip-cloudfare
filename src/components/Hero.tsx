'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentWord, setCurrentWord] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const words = ['Plan', 'Pack', 'Book'];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsTransitioning(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-4 py-6 lg:py-18">
      <div className="max-w-screen-2xl mx-auto text-center px-4">
      <h1 className="!text-[8vw] sm:!text-[4vw] mb-6 font-extrabold text-black  sm:leading-tight">
      <span
            className="inline-flex items-baseline justify-center mr-4"
            style={{ width: '10vw' }}
          >
            <span
              key={currentWord}
              className={`block transition-all duration-300 ease-in-out ${
                isTransitioning
                  ? 'opacity-0 translate-y-2'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              {words[currentWord]}
            </span>
          </span>
          <span className="inline-block">your inTripnerary</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl sm:text-2xl text-gray-600">
          From routes to timing, make every part of your journey simple, smooth, and beautifully planned.
        </p>
      </div>
    </section>
  );
}
