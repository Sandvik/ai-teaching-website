import React, { useContext } from 'react';
import { LocaleContext } from '../pages/_app';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ScrollToTop from './ScrollToTop';

export default function Layout({ children }) {
  const { locale, setLocale, messages } = useContext(LocaleContext);

  const toggleLocale = () => {
    setLocale(locale === 'da' ? 'en' : 'da');
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

            {/* Navigation Links */}
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

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-sage-200 transition-colors"
            >
              {messages.layout.languageToggle}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTop />

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
} 