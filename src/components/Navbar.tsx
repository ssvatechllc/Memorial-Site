
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Biography', href: '/biography' },
    { name: 'Academic Legacy', href: '/academic-legacy' },
    { name: 'Mentorship', href: '/mentorship' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Tribute Wall', href: '/tribute-wall' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <nav className="bg-slate-800/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-serif text-stone-100">In Memory of Dr. R. Pavanaguru</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-stone-300 hover:text-amber-200 px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-stone-300 hover:text-amber-200 block px-3 py-4 text-base font-medium border-b border-slate-700/50 last:border-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
