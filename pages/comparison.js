import React from 'react';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { ChartBarIcon, StarIcon, CheckIcon, XMarkIcon, CurrencyDollarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useContext } from 'react';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';
import SEO from '../components/SEO';

function parseTable(md) {
  // Simpel parser til markdown-tabel (kun til denne side)
  const match = md.match(/\|(.|\n)*?\|\n\|(.|\n)*?\|/g);
  if (!match) return null;
  const lines = match[0].trim().split('\n');
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));
  return { headers, rows };
}

export default function Comparison({ content }) {
  const { locale } = useContext(LocaleContext);
  const [activeFilter, setActiveFilter] = React.useState('all');
  
  // Vælg det korrekte indhold baseret på locale
  const currentContent = content[locale] || content.da;

  const quickFilters = [
    {
      id: 'all',
      title: locale === 'en' ? 'All Tools' : 'Alle værktøjer',
      icon: ChartBarIcon,
      color: 'bg-gray-100 text-gray-700',
      activeColor: 'bg-gray-200 text-gray-800'
    },
    {
      id: 'free',
      title: locale === 'en' ? 'Free Tools' : 'Gratis værktøjer',
      icon: SparklesIcon,
      color: 'bg-green-100 text-green-700',
      activeColor: 'bg-green-200 text-green-800'
    },
    {
      id: 'paid',
      title: locale === 'en' ? 'Paid Tools' : 'Betalte værktøjer',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-100 text-blue-700',
      activeColor: 'bg-blue-200 text-blue-800'
    },
    {
      id: 'top',
      title: locale === 'en' ? 'Top Rated' : 'Højest vurderet',
      icon: StarIcon,
      color: 'bg-yellow-100 text-yellow-700',
      activeColor: 'bg-yellow-200 text-yellow-800'
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

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    
    // Scroll til relevant sektion baseret på filter
    let targetId = '';
    switch (filterId) {
      case 'free':
        targetId = 'pris-sammenligning';
        break;
      case 'paid':
        targetId = 'pris-sammenligning';
        break;
      case 'top':
        targetId = 'top-10-ai-værktøjer-til-undervisning';
        break;
      default:
        targetId = 'sammenligning-ai-værktøjer-til-undervisning';
    }
    
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

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
      <SEO
        title={locale === 'en' ? 'AI Tools Comparison | ai-skole.dk' : 'AI-værktøjssammenligning | ai-skole.dk'}
        description={locale === 'en'
          ? 'Compare the best AI tools for education. Find the right AI tool for your teaching, learning, and school needs. Detailed reviews, pros and cons, and recommendations.'
          : 'Sammenlign de bedste AI-værktøjer til undervisning. Find det rette AI-værktøj til dine undervisnings- og læringsbehov. Detaljerede anmeldelser, fordele og ulemper, og anbefalinger.'}
        keywords={locale === 'en'
          ? 'AI tools comparison, AI for teachers, AI for schools, best AI tools, AI reviews, AI education, AI learning, AI Denmark'
          : 'AI værktøjer sammenligning, AI for lærere, AI for skoler, bedste AI værktøjer, AI anmeldelser, AI undervisning, AI læring, AI Danmark'}
        url={locale === 'en' ? 'https://ai-skole.dk/comparison' : 'https://ai-skole.dk/comparison'}
        image="https://ai-skole.dk/og-image.png"
        canonical={locale === 'en' ? 'https://ai-skole.dk/comparison' : 'https://ai-skole.dk/comparison'}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': locale === 'en' ? 'AI Tools Comparison' : 'AI-værktøjssammenligning',
          'description': locale === 'en'
            ? 'Compare the best AI tools for education. Find the right AI tool for your teaching, learning, and school needs. Detailed reviews, pros and cons, and recommendations.'
            : 'Sammenlign de bedste AI-værktøjer til undervisning. Find det rette AI-værktøj til dine undervisnings- og læringsbehov. Detaljerede anmeldelser, fordele og ulemper, og anbefalinger.',
          'inLanguage': locale,
          'author': {
            '@type': 'Person',
            'name': 'Thomas Henry Oz Sandvik'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'ai-skole.dk',
            'url': 'https://ai-skole.dk'
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': locale === 'en' ? 'https://ai-skole.dk/comparison' : 'https://ai-skole.dk/comparison'
          }
        }}
      />
      <Layout>
        {/* Hero Section */}
        <section className="hero-gradient rounded-2xl shadow-lg py-12 px-8 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-sage-100 p-4 rounded-full">
                <ChartBarIcon className="h-12 w-12 text-sage-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {locale === 'en' ? 'AI Tools Comparison' : 'AI-værktøjssammenligning'}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {locale === 'en' 
                ? 'Find the perfect AI tool for your teaching and learning needs.'
                : 'Find det perfekte AI-værktøj til dine undervisnings- og læringsbehov.'
              }
            </p>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-4">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`${
                    activeFilter === filter.id ? filter.activeColor : filter.color
                  } px-6 py-3 rounded-full font-medium hover:shadow-md transition-all duration-200 flex items-center gap-2`}
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <MarkdownRenderer content={currentContent} />
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
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group-hover:border-sage-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                    {locale === 'en' ? 'Complete Guide' : 'Komplet guide'}
                  </h3>
                  <p className="text-gray-600">
                    {locale === 'en' 
                      ? 'Learn how to use AI tools effectively in education.'
                      : 'Lær hvordan du bruger AI-værktøjer effektivt i undervisning.'
                    }
                  </p>
                </div>
              </Link>
              
              <Link href="/quiz-generator" className="group">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group-hover:border-sage-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                    {locale === 'en' ? 'Quiz Generator' : 'Quiz-generator'}
                  </h3>
                  <p className="text-gray-600">
                    {locale === 'en' 
                      ? 'Create engaging quizzes and tests with AI assistance.'
                      : 'Lav engagerende quizzer og tests med AI-hjælp.'
                    }
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
              {locale === 'en' ? 'Need Help Choosing?' : 'Har du brug for hjælp til at vælge?'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'en' 
                ? 'Get personalized recommendations based on your specific needs and budget.'
                : 'Få personlige anbefalinger baseret på dine specifikke behov og budget.'
              }
            </p>
            <a href="mailto:kontakt@ai-undervisning.dk" className="btn-primary">
              {locale === 'en' ? 'Get Advice' : 'Få rådgivning'}
            </a>
          </div>
        </section>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    // Indlæs både dansk og engelsk indhold
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/comparison.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/comparison.md'), 'utf8');
    
    return {
      props: {
        content: {
          da: daContent,
          en: enContent
        }
      }
    };
  } catch (error) {
    console.error('Error loading comparison content:', error);
    return {
      props: {
        content: {
          da: '# Fejl\nKunne ikke indlæse indhold.',
          en: '# Error\nCould not load content.'
        }
      }
    };
  }
} 