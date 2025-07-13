'use client';

export default function Footer() {
  return (
    <footer className="bg-white rounded-lg shadow-lg px-3 sm:px-6 py-6 mt-12">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <span className="text-sm text-black sm:text-center">
          © {new Date().getFullYear()}{' '}
          <span className="font-semibold">inTripenary</span>. All rights reserved.
        </span>
        <ul className="flex flex-wrap items-center text-sm font-medium text-black gap-4 sm:gap-6">
          <li>
            <a href="#" className="text-black">
              About
            </a>
          </li>
          <li>
            <a href="#" className="text-black">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="text-black">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" className="text-black">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
