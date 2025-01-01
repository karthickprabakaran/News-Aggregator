import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
  <div className="container mx-auto flex justify-between items-center py-4 px-6">
    {/* Logo */}
    <a href="#" className="text-2xl font-bold text-blue-600">
      KYN
    </a>

    {/* Navigation - Desktop */}
    <nav className="hidden md:flex space-x-8">
      <a
        href="#home"
        className="text-gray-600 hover:text-blue-600 font-bold transition-colors"
      >
        Home
      </a>
      <a
        href="#about"
        className="text-gray-600 hover:text-blue-600 font-bold transition-colors"
      >
        About
      </a>
      <a
        href="#contact"
        className="text-gray-600 hover:text-blue-600 font-bold transition-colors"
      >
        Contact
      </a>
    </nav>

    {/* Mobile Menu Button */}
    <button
      className="md:hidden text-gray-600 hover:text-blue-600"
      id="menu-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 7.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
        />
      </svg>
    </button>

    {/* Mobile Menu */}
    <div
      className="absolute top-full left-0 w-full bg-white shadow-md p-4 space-y-4 hidden md:hidden"
      id="mobile-menu"
    >
      <a
        href="#home"
        className="block text-gray-600 hover:text-blue-600 font-medium transition-colors"
      >
        Home
      </a>
      <a
        href="#about"
        className="block text-gray-600 hover:text-blue-600 font-medium transition-colors"
      >
        About
      </a>
      <a
        href="#contact"
        className="block text-gray-600 hover:text-blue-600 font-medium transition-colors"
      >
        Contact
      </a>
    </div>
  </div>

  <style>
    {`
      const menuButton = document.getElementById('menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      
      menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    `}
  </style>
</header>

  );
};

export default Header;
