import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { LightBulbIcon, BookOpenIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useContext } from 'react';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function Guide({ content, daContent, enContent }) {
  const { messages, locale } = useContext(LocaleContext);
  
  // Vælg det korrekte indhold baseret på locale
  const currentContent = locale === 'en' ? enContent : daContent;
  
  const quickLinks = [
    {
      title: locale === 'en' ? 'Getting Started' : 'Kom i gang',
      icon: BookOpenIcon,
      href: '#sådan-bruger-du-chatgpt-og-ai-i-undervisningen',
      color: 'bg-sage-100 text-sage-700'
    },
    {
      title: locale === 'en' ? 'For Teachers' : 'For lærere',
      icon: AcademicCapIcon,
      href: '#generér-quizzer-og-opgaver',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: locale === 'en' ? 'For Parents' : 'For forældre',
      icon: UserGroupIcon,
      href: '#forældre-støt-lektielæsning',
      color: 'bg-green-100 text-green-700'
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
        <title>{messages.guide.pageTitle}</title>
        <meta name="description" content={messages.guide.pageDescription} />
      </Head>
      <Layout>
      {/* Hero Section */}
      <section className="hero-gradient rounded-2xl shadow-lg py-12 px-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-sage-100 p-4 rounded-full">
              <LightBulbIcon className="h-12 w-12 text-sage-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {messages.guide.heroTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {messages.guide.heroDescription}
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
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {locale === 'en' ? 'Table of Contents' : 'Indholdsfortegnelse'}
                </h3>
                <nav className="space-y-2">
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'sådan-bruger-du-chatgpt-og-ai-i-undervisningen')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Introduction' : 'Introduktion'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'generér-quizzer-og-opgaver')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Generate Quizzes' : 'Generér quizzer'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'få-inspiration-til-undervisningsforløb')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Get Inspiration' : 'Få inspiration'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'forberedelse-af-undervisningsmateriale')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Prepare Materials' : 'Forbered materiale'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'forældre-støt-lektielæsning')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Parent Support' : 'Forældrestøtte'}
                  </button>
                  <button 
                    onClick={(e) => handleSmoothScroll(e, 'etik-og-ansvarlig-brug')}
                    className="block text-sage-700 hover:text-sage-800 hover:bg-sage-50 px-3 py-2 rounded-lg transition-colors text-left w-full"
                  >
                    {locale === 'en' ? 'Ethics & Responsible Use' : 'Etik og ansvarlig brug'}
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
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
            {messages.guide.callouts.relatedResources}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/comparison" className="group">
              <div className="card p-6 group-hover:border-sage-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                  {messages.guide.callouts.comparison}
                </h3>
                <p className="text-gray-600">
                  {messages.guide.callouts.comparisonDescription}
                </p>
              </div>
            </Link>
            
            <Link href="/quiz-generator" className="group">
              <div className="card p-6 group-hover:border-sage-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                  {messages.guide.callouts.quizGenerator}
                </h3>
                <p className="text-gray-600">
                  {messages.guide.callouts.quizGeneratorDescription}
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
            {messages.guide.callouts.needHelp}
          </h2>
          <p className="text-gray-600 mb-6">
            {messages.guide.callouts.needHelpDescription}
          </p>
          <a href={`mailto:${messages.layout.email}`} className="btn-primary">
            {messages.guide.callouts.contactUs}
          </a>
        </div>
      </section>
    </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/guide.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/guide.md'), 'utf8');
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
        content: '# Fejl\n\nKunne ikke indlæse guide.md',
        daContent: '# Fejl\n\nKunne ikke indlæse guide.md',
        enContent: '# Error\n\nCould not load guide.md'
      } 
    };
  }
} 