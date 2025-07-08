import React, { useContext, lazy, Suspense, useState } from 'react';
import { LocaleContext } from '../pages/_app';
import { GlobeAltIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Breadcrumb from './Breadcrumb';

// Lazy load ScrollToTop component for better performance
const ScrollToTop = lazy(() => import('./ScrollToTop'));

const Layout = React.memo(({ children }) => {
  const { locale, setLocale, messages } = useContext(LocaleContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLocale = () => {
    setLocale(locale === 'da' ? 'en' : 'da');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <GlobeAltIcon className="h-8 w-8 text-sage-600" />
              <span className="text-xl font-bold text-gray-800">{messages.layout.logo}</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="nav-link">
                {messages.nav.home}
              </Link>
              <Link href="/ai-teaching" className="nav-link">
                {messages.nav.aiTeaching}
              </Link>
              <Link href="/guide" className="nav-link">
                {messages.nav.guide}
              </Link>
              <Link href="/comparison" className="nav-link">
                {messages.nav.comparison}
              </Link>
              <Link href="/quiz-generator" className="nav-link">
                {messages.nav.quiz}
              </Link>
            </div>

            {/* Desktop Language Toggle */}
            <div className="hidden md:block">
              <button
                onClick={toggleLocale}
                className="bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-sage-200 transition-colors"
              >
                {messages.layout.languageToggle}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleLocale}
                className="bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-sage-200 transition-colors"
              >
                {messages.layout.languageToggle}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-sage-50 transition-colors"
                onClick={closeMobileMenu}
              >
                {messages.nav.home}
              </Link>
              <Link 
                href="/ai-teaching" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-sage-50 transition-colors"
                onClick={closeMobileMenu}
              >
                {messages.nav.aiTeaching}
              </Link>
              <Link 
                href="/guide" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-sage-50 transition-colors"
                onClick={closeMobileMenu}
              >
                {messages.nav.guide}
              </Link>
              <Link 
                href="/comparison" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-sage-50 transition-colors"
                onClick={closeMobileMenu}
              >
                {messages.nav.comparison}
              </Link>
              <Link 
                href="/quiz-generator" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-sage-50 transition-colors"
                onClick={closeMobileMenu}
              >
                {messages.nav.quiz}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb />
        {children}
      </main>

      {/* Scroll to Top Button - Lazy loaded */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>

      {/* Footer */}
      <footer className="footer mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{messages.layout.logo}</h3>
              <p className="text-gray-300">
                {messages.layout.footer.description}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {messages.layout.footer.resources}
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/ai-teaching" className="hover:text-white transition-colors">
                  {messages.nav.aiTeaching}
                </Link></li>
                <li><Link href="/guide" className="hover:text-white transition-colors">
                  {messages.nav.guide}
                </Link></li>
                <li><Link href="/comparison" className="hover:text-white transition-colors">
                  {messages.nav.comparison}
                </Link></li>
                <li><Link href="/quiz-generator" className="hover:text-white transition-colors">
                  {messages.nav.quiz}
                </Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {messages.layout.footer.contact}
              </h3>
              <p className="text-gray-300 mb-2">
                {messages.layout.footer.contactText}
              </p>
              <a 
                href={`mailto:${messages.layout.email}`}
                className="text-sage-600 hover:text-sage-700"
              >
                {messages.layout.email}
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {messages.layout.logo}. {messages.layout.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout; 