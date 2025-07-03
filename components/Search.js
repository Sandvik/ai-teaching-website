import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useContext } from 'react';
import { LocaleContext } from '../pages/_app';

export default function Search() {
  const { locale } = useContext(LocaleContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);

  const searchData = [
    {
      title: locale === 'en' ? 'Complete Guide: AI in Education' : 'Komplet Guide: AI i Undervisning',
      description: locale === 'en' ? 'Learn how to use ChatGPT and AI tools in teaching' : 'Lær hvordan du bruger ChatGPT og AI-værktøjer i undervisning',
      url: '/ai-teaching',
      category: locale === 'en' ? 'Guide' : 'Guide'
    },
    {
      title: locale === 'en' ? 'AI Tools Comparison' : 'AI-værktøjssammenligning',
      description: locale === 'en' ? 'Compare different AI tools and find the best one' : 'Sammenlign forskellige AI-værktøjer og find det bedste',
      url: '/comparison',
      category: locale === 'en' ? 'Tools' : 'Værktøjer'
    },
    {
      title: locale === 'en' ? 'AI in Mathematics' : 'AI i Matematik',
      description: locale === 'en' ? 'AI tools for mathematics teaching and learning' : 'AI-værktøjer til matematikundervisning og læring',
      url: '/ai-matematik',
      category: locale === 'en' ? 'Subject' : 'Fag'
    },
    {
      title: locale === 'en' ? 'Inclusion & Differentiation' : 'Inklusion & Differentiering',
      description: locale === 'en' ? 'How AI can support students with different needs' : 'Hvordan AI kan støtte elever med forskellige behov',
      url: '/ai-inklusion',
      category: locale === 'en' ? 'Subject' : 'Fag'
    },
    {
      title: locale === 'en' ? 'Parent Collaboration' : 'Forældresamarbejde',
      description: locale === 'en' ? 'Improve communication between school and home' : 'Forbedr kommunikationen mellem skole og hjem',
      url: '/ai-foraeldremoede',
      category: locale === 'en' ? 'Subject' : 'Fag'
    },
    {
      title: locale === 'en' ? 'Quiz Generator' : 'Quiz-generator',
      description: locale === 'en' ? 'Create AI-generated quizzes and tests' : 'Lav AI-genererede quizzer og tests',
      url: '/quiz-generator',
      category: locale === 'en' ? 'Tool' : 'Værktøj'
    }
  ];

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      window.location.href = results[0].url;
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={locale === 'en' ? 'Search guides, tools, topics...' : 'Søg i guides, værktøjer, emner...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <Link
              key={index}
              href={result.url}
              className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{result.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                </div>
                <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                  {result.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 