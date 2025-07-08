import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ChartBarIcon, StarIcon, CheckIcon, XMarkIcon, CurrencyDollarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';

function parseTable(md) {
  // Simpel parser til markdown-tabel (kun til denne side)
  const match = md.match(/\|(.|\n)*?\|\n\|(.|\n)*?\|/g);
  if (!match) return null;
  const lines = match[0].trim().split('\n');
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));
  return { headers, rows };
}

export default function Comparison({ content, table, daContent, enContent }) {
  const { messages, locale } = useContext(LocaleContext);
  
  // Vælg det korrekte indhold baseret på locale
  const currentContent = locale === 'en' ? enContent : daContent;
  
  // State for active filter
  const [activeFilter, setActiveFilter] = React.useState('all');
  
  const quickFilters = [
    {
      id: 'free',
      title: messages.comparison.filters.free,
      icon: SparklesIcon,
      color: 'bg-green-100 text-green-700',
      activeColor: 'bg-green-500 text-white'
    },
    {
      id: 'paid',
      title: messages.comparison.filters.paid,
      icon: CurrencyDollarIcon,
      color: 'bg-blue-100 text-blue-700',
      activeColor: 'bg-blue-500 text-white'
    },
    {
      id: 'topRated',
      title: messages.comparison.filters.topRated,
      icon: StarIcon,
      color: 'bg-yellow-100 text-yellow-700',
      activeColor: 'bg-yellow-500 text-white'
    }
  ];

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const getFilteredContent = () => {
    if (activeFilter === 'all') {
      return currentContent;
    }
    
    // For now, we'll just scroll to relevant sections based on filter
    // In a more advanced implementation, you could parse and filter the markdown content
    let targetSection = '';
    switch (activeFilter) {
      case 'free':
        targetSection = 'pris-sammenligning';
        break;
      case 'paid':
        targetSection = 'pris-sammenligning';
        break;
      case 'topRated':
        targetSection = 'detaljerede-anmeldelser';
        break;
      default:
        return currentContent;
    }
    
    // Scroll to the relevant section
    setTimeout(() => {
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
    
    return currentContent;
  };

  // Handle filter changes
  useEffect(() => {
    if (activeFilter !== 'all') {
      let targetSection = '';
      switch (activeFilter) {
        case 'free':
          targetSection = 'pris-sammenligning';
          break;
        case 'paid':
          targetSection = 'pris-sammenligning';
          break;
        case 'topRated':
          targetSection = 'detaljerede-anmeldelser';
          break;
        default:
          return;
      }
      
      // Scroll to the relevant section
      setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [activeFilter]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <>
      <Head>
            <title>{messages.comparison.pageTitle}</title>
    <meta name="description" content={messages.comparison.pageDescription} />
      </Head>
      <Layout>
      {/* Header Image */}
      <div className="max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden">
        <Image src="/images/comparison-card.jpg" alt="Comparison" width={1200} height={320} className="object-cover w-full h-48 md:h-64" priority />
      </div>
      {/* Hero Section */}
      <section className="hero-gradient rounded-2xl shadow-lg py-12 px-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-sage-100 p-4 rounded-full">
              <ChartBarIcon className="h-12 w-12 text-sage-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {messages.comparison.heroTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {messages.comparison.heroDescription}
          </p>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`${activeFilter === 'all' ? 'bg-sage-500 text-white' : 'bg-gray-100 text-gray-700'} px-6 py-3 rounded-full font-medium hover:shadow-md transition-all duration-200 flex items-center gap-2`}
            >
              <ChartBarIcon className="h-5 w-5" />
              {locale === 'en' ? 'All Tools' : 'Alle værktøjer'}
            </button>
            {quickFilters.map((filter, index) => (
              <button
                key={index}
                onClick={() => setActiveFilter(filter.id)}
                className={`${activeFilter === filter.id ? filter.activeColor : filter.color} px-6 py-3 rounded-full font-medium hover:shadow-md transition-all duration-200 flex items-center gap-2`}
              >
                <filter.icon className="h-5 w-5" />
                {filter.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {locale === 'en' ? 'Categories' : 'Kategorier'}
                </h3>
                <nav className="space-y-2">
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'sammenligning-ai-værktøjer-til-undervisning')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Overview' : 'Oversigt'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'top-10-ai-værktøjer-til-undervisning')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Top Tools' : 'Top værktøjer'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'fag-specifikke-ai-værktøjer')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Subject Specific' : 'Fag-specifikke'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'anvendelsesområder')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Applications' : 'Anvendelser'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'pris-sammenligning')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Pricing' : 'Priser'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'anbefalinger-efter-behov')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Recommendations' : 'Anbefalinger'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'detaljerede-anmeldelser')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Reviews' : 'Anmeldelser'}
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card p-8">
              <MarkdownRenderer content={getFilteredContent()} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      <section className="max-w-4xl mx-auto mt-12">
        <div className="bg-sage-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {locale === 'en' ? 'Related Resources' : 'Relaterede ressourcer'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/guide" className="group">
              <div className="card p-6 group-hover:border-sage-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                  {locale === 'en' ? 'Complete Guide' : 'Komplet guide'}
                </h3>
                <p className="text-gray-600">
                  {messages.comparison.callouts.learnMore}
                </p>
              </div>
            </Link>
            
            <Link href="/quiz-generator" className="group">
              <div className="card p-6 group-hover:border-sage-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                  {locale === 'en' ? 'Quiz Generator' : 'Quiz-generator'}
                </h3>
                <p className="text-gray-600">
                  {messages.comparison.callouts.quizGenerator}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto mt-12 text-center">
        <div className="bg-gradient-to-r from-sage-50 to-green-50 rounded-xl p-8 border border-sage-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {messages.comparison.callouts.needHelp}
          </h2>
          <p className="text-gray-600 mb-6">
            {messages.comparison.callouts.getAdvice}
          </p>
                      <a href={`mailto:${messages.layout.email}`} className="btn-primary">
              {messages.comparison.callouts.getAdviceButton}
            </a>
        </div>
      </section>
    </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/comparison.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/comparison.md'), 'utf8');
    const table = parseTable(daContent);
    return { 
      props: { 
        content: daContent,
        table,
        daContent,
        enContent
      } 
    };
  } catch (e) {
    return { 
      props: { 
        content: '# Fejl\n\nKunne ikke indlæse comparison.md',
        table: null,
        daContent: '# Fejl\n\nKunne ikke indlæse comparison.md',
        enContent: '# Error\n\nCould not load comparison.md'
      } 
    };
  }
} 