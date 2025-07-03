import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useContext } from 'react';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function MinisterietAnbefalinger({ content }) {
  const { locale } = useContext(LocaleContext);
  
  // Vælg det korrekte indhold baseret på locale
  const currentContent = content[locale] || content.da;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-sage-600 to-slate-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                  🏛️ {locale === 'da' ? 'Officielle Retningslinjer' : 'Official Guidelines'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {locale === 'da' 
                  ? 'Ministeriets Anbefalinger' 
                  : 'Ministry Recommendations'
                }
              </h1>
              <p className="text-xl md:text-2xl text-sage-100 mb-8 leading-relaxed">
                {locale === 'da'
                  ? 'De officielle retningslinjer for brug af generativ AI i danske folkeskoler'
                  : 'Official guidelines for the use of generative AI in Danish primary schools'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  {locale === 'da' ? '7 Anbefalinger' : '7 Recommendations'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  {locale === 'da' ? 'GDPR Overholdelse' : 'GDPR Compliance'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  {locale === 'da' ? 'Praktiske Eksempler' : 'Practical Examples'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8 md:p-12">
                <MarkdownRenderer content={currentContent} />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-slate-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                {locale === 'da' 
                  ? 'Klar til at implementere?' 
                  : 'Ready to implement?'
                }
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                {locale === 'da'
                  ? 'Brug disse anbefalinger som udgangspunkt for din skoles AI-strategi'
                  : 'Use these recommendations as a starting point for your school\'s AI strategy'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push(locale === 'da' ? '/guide' : '/guide')}
                  className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  {locale === 'da' ? 'Se Vores Guide' : 'View Our Guide'}
                </button>
                <button 
                  onClick={() => router.push(locale === 'da' ? '/ai-undervisning' : '/ai-teaching')}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  {locale === 'da' ? 'AI i Undervisning' : 'AI in Teaching'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Indlæs både dansk og engelsk indhold
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/ministeriet-anbefalinger.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/ministeriet-anbefalinger.md'), 'utf8');
    
    return {
      props: {
        content: {
          da: daContent,
          en: enContent
        }
      }
    };
  } catch (error) {
    console.error('Error loading ministeriet-anbefalinger content:', error);
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