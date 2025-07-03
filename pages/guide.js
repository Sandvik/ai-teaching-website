import React from 'react';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { LightBulbIcon, BookOpenIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useContext } from 'react';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';
import SEO from '../components/SEO';

export default function Guide({ content }) {
  const { locale } = useContext(LocaleContext);
  
  // Vælg det korrekte indhold baseret på locale
  const currentContent = content[locale] || content.da;
  
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
      <SEO
        title={locale === 'en' ? 'Complete Guide: AI in Education | ai-skole.dk' : 'Komplet Guide: AI i Undervisning | ai-skole.dk'}
        description={locale === 'en'
          ? 'Learn how to use ChatGPT and AI tools in your teaching and home support. Step-by-step guide, practical examples, and tips for teachers and parents.'
          : 'Lær hvordan du bruger ChatGPT og AI-værktøjer i din undervisning og hjemmestøtte. Trin-for-trin guide, praktiske eksempler og tips til lærere og forældre.'}
        keywords={locale === 'en'
          ? 'AI in education, AI guide, ChatGPT in school, AI tools for teachers, AI for parents, AI learning, AI teaching, AI resources, AI Denmark'
          : 'AI i undervisning, AI guide, ChatGPT i skolen, AI værktøjer til lærere, AI forældre, AI læring, AI undervisning, AI ressourcer, AI Danmark'}
        url={locale === 'en' ? 'https://ai-skole.dk/guide' : 'https://ai-skole.dk/guide'}
        image="https://ai-skole.dk/og-image.png"
        canonical={locale === 'en' ? 'https://ai-skole.dk/guide' : 'https://ai-skole.dk/guide'}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': locale === 'en' ? 'Complete Guide: AI in Education' : 'Komplet Guide: AI i Undervisning',
          'description': locale === 'en'
            ? 'Learn how to use ChatGPT and AI tools in your teaching and home support. Step-by-step guide, practical examples, and tips for teachers and parents.'
            : 'Lær hvordan du bruger ChatGPT og AI-værktøjer i din undervisning og hjemmestøtte. Trin-for-trin guide, praktiske eksempler og tips til lærere og forældre.',
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
            '@id': locale === 'en' ? 'https://ai-skole.dk/guide' : 'https://ai-skole.dk/guide'
          }
        }}
      />
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
              {locale === 'en' ? 'Complete Guide: AI in Education' : 'Komplet Guide: AI i Undervisning'}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {locale === 'en' 
                ? 'Learn how to use ChatGPT and AI tools effectively in your teaching and home support.'
                : 'Lær hvordan du bruger ChatGPT og AI-værktøjer effektivt i din undervisning og hjemmestøtte.'
              }
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 markdown-content">
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
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/comparison" className="group">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group-hover:border-sage-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                    {locale === 'en' ? 'AI Tools Comparison' : 'AI-værktøjssammenligning'}
                  </h3>
                  <p className="text-gray-600">
                    {locale === 'en' 
                      ? 'Compare different AI tools and find the best one for your needs.'
                      : 'Sammenlign forskellige AI-værktøjer og find det bedste til dine behov.'
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
              {locale === 'en' ? 'Need Help or Have Questions?' : 'Har du brug for hjælp eller spørgsmål?'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'en' 
                ? 'Share your experiences or get personalized advice from our community.'
                : 'Del dine erfaringer eller få personlig rådgivning fra vores fællesskab.'
              }
            </p>
            <a href="mailto:kontakt@ai-undervisning.dk" className="btn-primary">
              {locale === 'en' ? 'Contact Us' : 'Kontakt os'}
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
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/guide.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/guide.md'), 'utf8');
    
    return {
      props: {
        content: {
          da: daContent,
          en: enContent
        }
      }
    };
  } catch (error) {
    console.error('Error loading guide content:', error);
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