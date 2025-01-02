import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserCircleIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll event listener
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Coffice" className="h-8 w-auto" />
            <span className={`text-xl font-bold ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Coffice
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${
                isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-gray-200'
              } transition-colors duration-200`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${
                isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-gray-200'
              } transition-colors duration-200`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`${
                isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-gray-200'
              } transition-colors duration-200`}
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              className={`p-2 rounded-full ${
                isScrolled
                  ? 'text-gray-600 hover:text-primary hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              } transition-colors duration-200`}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className={`p-2 rounded-full ${
                isScrolled
                  ? 'text-gray-600 hover:text-primary hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              } transition-colors duration-200`}
            >
              <HeartIcon className="h-6 w-6" />
            </button>
            <button
              className={`p-2 rounded-full ${
                isScrolled
                  ? 'text-gray-600 hover:text-primary hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              } transition-colors duration-200`}
            >
              <UserCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 