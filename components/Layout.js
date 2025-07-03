import React, { useContext } from 'react';
import { LocaleContext } from '../pages/_app';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdPlaceholder from './AdPlaceholder';
import ScrollToTop from './ScrollToTop';

export default function Layout({ children }) {
  const { locale, setLocale, messages } = useContext(LocaleContext);
  const router = useRouter();

  const toggleLocale = () => {
    setLocale(locale === 'da' ? 'en' : 'da');
  };

  const isActive = (path) => {
    return router.pathname === path;
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
              <span className="text-xl font-bold text-gray-800">AI i Undervisning</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                {messages.nav.home}
              </Link>
              <Link 
                href="/ai-teaching" 
                className={`nav-link ${isActive('/ai-teaching') ? 'active' : ''}`}
              >
                {messages.nav.aiTeaching}
              </Link>
              <Link 
                href="/guide" 
                className={`nav-link ${isActive('/guide') ? 'active' : ''}`}
              >
                {messages.nav.guide}
              </Link>
              <Link 
                href="/comparison" 
                className={`nav-link ${isActive('/comparison') ? 'active' : ''}`}
              >
                {messages.nav.comparison}
              </Link>
              <Link 
                href="/quiz-generator" 
                className={`nav-link ${isActive('/quiz-generator') ? 'active' : ''}`}
              >
                {messages.nav.quiz}
              </Link>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="bg-sage-100 text-sage-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-sage-200 transition-colors"
            >
              {locale === 'da' ? 'EN' : 'DA'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdPlaceholder />
        {children}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Footer */}
      <footer className="footer mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AI i Undervisning</h3>
              <p className="text-gray-300">
                {locale === 'da' 
                  ? 'Praktiske guides og værktøjer til brug af AI i undervisning og læring.'
                  : 'Practical guides and tools for using AI in education and learning.'
                }
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {locale === 'da' ? 'Ressourcer' : 'Resources'}
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
                {locale === 'da' ? 'Om' : 'About'}
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-white transition-colors">
                  {locale === 'da' ? 'Om os' : 'About us'}
                </Link></li>
                <li><Link href="/guide" className="hover:text-white transition-colors">
                  {locale === 'da' ? 'Vores mission' : 'Our mission'}
                </Link></li>
                <li><Link href="/comparison" className="hover:text-white transition-colors">
                  {locale === 'da' ? 'Teknologi' : 'Technology'}
                </Link></li>
                <li><Link href="/quiz-generator" className="hover:text-white transition-colors">
                  {locale === 'da' ? 'Fremtidige planer' : 'Future plans'}
                </Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {locale === 'da' ? 'Kontakt' : 'Contact'}
              </h3>
              <p className="text-gray-300 mb-2">
                {locale === 'da' ? 'Har du spørgsmål eller tips?' : 'Have questions or tips?'}
              </p>
              <a 
                href="mailto:kontakt@ai-undervisning.dk" 
                className="text-sage-300 hover:text-white transition-colors"
              >
                kontakt@ai-undervisning.dk
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI i Undervisning. {locale === 'da' ? 'Alle rettigheder forbeholdes.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 