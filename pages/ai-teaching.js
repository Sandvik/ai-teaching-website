import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { AcademicCapIcon, LightBulbIcon, UserGroupIcon, ChartBarIcon, SparklesIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useContext } from 'react';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function AITeaching({ content, daContent, enContent }) {
  const { messages, locale } = useContext(LocaleContext);
  
  // Vælg det korrekte indhold baseret på locale
  const currentContent = locale === 'en' ? enContent : daContent;
  
  const quickLinks = [
    {
      title: locale === 'en' ? 'Getting Started' : 'Kom i gang',
      icon: BookOpenIcon,
      href: '#introduktion-til-ai-i-undervisning',
      color: 'bg-sage-100 text-sage-700'
    },
    {
      title: locale === 'en' ? 'Subject Applications' : 'Faglige anvendelser',
      icon: AcademicCapIcon,
      href: '#praktiske-anvendelser-i-forskellige-fag',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: locale === 'en' ? 'Teaching Strategies' : 'Undervisningsstrategier',
      icon: LightBulbIcon,
      href: '#undervisningsstrategier-med-ai',
      color: 'bg-green-100 text-green-700'
    },
    {
      title: locale === 'en' ? 'Tools & Apps' : 'Værktøjer & Apps',
      icon: SparklesIcon,
      href: '#praktiske-værktøjer-og-apps',
      color: 'bg-purple-100 text-purple-700'
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

  return (
    <>
      <Head>
        <title>{messages.aiTeaching.pageTitle}</title>
        <meta name="description" content={messages.aiTeaching.pageDescription} />
      </Head>
      <Layout>
      {/* Hero Section */}
      <section className="hero-gradient rounded-2xl shadow-lg py-12 px-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-sage-100 p-4 rounded-full">
              <AcademicCapIcon className="h-12 w-12 text-sage-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {messages.aiTeaching.heroTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {messages.aiTeaching.heroDescription}
          </p>
          
          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={(e) => handleSmoothScroll(e, link.href.substring(1))}
                className={`${link.color} px-6 py-3 rounded-full font-medium hover:shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer`}
              >
                <link.icon className="h-5 w-5" />
                {link.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {locale === 'en' ? 'Table of Contents' : 'Indholdsfortegnelse'}
                </h3>
                <nav className="space-y-2">
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'introduktion-til-ai-i-undervisning')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Introduction' : 'Introduktion'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'grundlæggende-ai-koncepter-for-lærere')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Basic Concepts' : 'Grundlæggende koncepter'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'praktiske-anvendelser-i-forskellige-fag')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Subject Applications' : 'Faglige anvendelser'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'undervisningsstrategier-med-ai')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Teaching Strategies' : 'Undervisningsstrategier'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'praktiske-værktøjer-og-apps')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Tools & Apps' : 'Værktøjer & Apps'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'evaluering-og-feedback-med-ai')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Assessment & Feedback' : 'Evaluering & Feedback'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'lektiehjælp-og-hjemmestøtte')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Homework Help' : 'Lektiehjælp'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'etik-og-ansvar-i-ai-brug')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Ethics & Responsibility' : 'Etik & Ansvar'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'fremtidige-muligheder')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Future Possibilities' : 'Fremtidige muligheder'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'implementeringsplan')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Implementation Plan' : 'Implementeringsplan'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'success-stories')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Success Stories' : 'Success Stories'}
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <article className="card p-8 markdown-content">
              <MarkdownRenderer content={currentContent} />
            </article>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      <section className="max-w-4xl mx-auto mt-12">
        <div className="bg-sage-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {locale === 'en' ? 'Related Resources' : 'Relaterede ressourcer'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/guide" className="group">
              <div className="card p-6 group-hover:border-sage-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                  {locale === 'en' ? 'Complete Guide' : 'Komplet guide'}
                </h3>
                <p className="text-gray-600">
                  {messages.aiTeaching.callouts.learnMore}
                </p>
              </div>
            </Link>
            
            <Link href="/comparison" className="group">
              <div className="card p-6 group-hover:border-sage-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                  {messages.aiTeaching.callouts.comparison}
                </h3>
                <p className="text-gray-600">
                  {messages.aiTeaching.callouts.comparisonDescription}
                </p>
              </div>
            </Link>

            <Link href="/quiz-generator" className="group">
              <div className="card p-6 group-hover:border-sage-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                  {locale === 'en' ? 'Quiz Generator' : 'Quiz-generator'}
                </h3>
                <p className="text-gray-600">
                  {messages.aiTeaching.callouts.quizGenerator}
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
            {locale === 'en' ? 'Ready to Transform Your Teaching?' : 'Klar til at transformere din undervisning?'}
          </h2>
          <p className="text-gray-600 mb-6">
            {messages.aiTeaching.callouts.cta}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`mailto:${messages.layout.email}`} className="btn-primary">
              {messages.aiTeaching.callouts.getStartedButton}
            </a>
            <Link href="/guide" className="btn-secondary">
              {locale === 'en' ? 'View Complete Guide' : 'Se komplet guide'}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/ai-undervisning.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/ai-teaching.md'), 'utf8');
    return { 
      props: { 
        content: daContent,
        daContent,
        enContent
      } 
    };
  } catch (e) {
    return { 
      props: { 
        content: '# Fejl\n\nKunne ikke indlæse ai-undervisning.md',
        daContent: '# Fejl\n\nKunne ikke indlæse ai-undervisning.md',
        enContent: '# Error\n\nCould not load ai-teaching.md'
      } 
    };
  }
} 