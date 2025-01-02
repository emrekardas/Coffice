import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserCircleIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <img 
              src="/logo.svg" 
              alt="Coffice" 
              className={`h-8 w-auto transition-all duration-300 ${
                !isScrolled && 'brightness-0 invert'
              } group-hover:scale-105`} 
            />
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Coffice
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-all duration-200 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-primary hover:scale-105' 
                  : 'text-gray-300 hover:text-white hover:scale-105'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-all duration-200 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-primary hover:scale-105' 
                  : 'text-gray-300 hover:text-white hover:scale-105'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`font-medium transition-all duration-200 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-primary hover:scale-105' 
                  : 'text-gray-300 hover:text-white hover:scale-105'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-full transition-all duration-200 ${
                isScrolled
                  ? 'text-gray-600 hover:text-primary hover:bg-gray-100 hover:scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-105'
              }`}
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button
              className={`p-2 rounded-full transition-all duration-200 ${
                isScrolled
                  ? 'text-gray-600 hover:text-primary hover:bg-gray-100 hover:scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-105'
              }`}
              aria-label="Favorites"
            >
              <HeartIcon className="h-6 w-6" />
            </button>
            <button
              className={`p-2 rounded-full transition-all duration-200 ${
                isScrolled
                  ? 'text-gray-600 hover:text-primary hover:bg-gray-100 hover:scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-105'
              }`}
              aria-label="Profile"
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