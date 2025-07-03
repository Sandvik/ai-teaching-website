import React from 'react';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { HeartIcon, UsersIcon, LightBulbIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useContext } from 'react';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function About({ content }) {
  const { locale } = useContext(LocaleContext);
  
  // Vælg det korrekte indhold baseret på locale
  const currentContent = content[locale] || content.da;

  const stats = [
    {
      number: '20+',
      label: locale === 'en' ? 'Years Experience' : 'Års Erfaring',
      icon: UsersIcon,
      color: 'text-blue-600'
    },
    {
      number: '100%',
      label: locale === 'en' ? 'Open Source' : 'Åben Kildekode',
      icon: HeartIcon,
      color: 'text-green-600'
    },
    {
      number: '2',
      label: locale === 'en' ? 'Languages' : 'Sprog',
      icon: LightBulbIcon,
      color: 'text-yellow-600'
    },
    {
      number: '24/7',
      label: locale === 'en' ? 'Available' : 'Tilgængelig',
      icon: ShieldCheckIcon,
      color: 'text-purple-600'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient rounded-2xl shadow-lg py-16 px-8 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            {locale === 'en' ? 'About AI in Education' : 'Om AI i Undervisning'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {locale === 'en' 
              ? 'I am passionate about helping educators and parents harness the power of AI to create better learning experiences for children and young people.'
              : 'Jeg er passioneret om at hjælpe undervisere og forældre med at udnytte AI\'s kraft til at skabe bedre læringserfaringer for børn og unge.'
            }
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`${stat.color} mb-2 flex justify-center`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 markdown-content">
          <MarkdownRenderer content={currentContent} />
        </article>
      </div>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto mt-12 text-center">
        <div className="bg-gradient-to-r from-sage-50 to-green-50 rounded-xl p-8 border border-sage-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {locale === 'en' ? 'Join My Mission' : 'Bliv en del af min mission'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'en' 
              ? 'Help me shape the future of education with AI. Share your experiences, provide feedback, or collaborate with me.'
              : 'Hjælp mig med at forme fremtidens undervisning med AI. Del dine erfaringer, giv feedback eller samarbejd med mig.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:info@thomassandvik.dk" 
              className="btn-primary"
            >
              {locale === 'en' ? 'Contact Us' : 'Kontakt os'}
            </a>
            <Link href="/guide" className="btn-secondary">
              {locale === 'en' ? 'Explore Guides' : 'Udforsk guides'}
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-4xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {locale === 'en' ? 'My Values' : 'Mine værdier'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="bg-sage-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <HeartIcon className="h-8 w-8 text-sage-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {locale === 'en' ? 'Passion for Education' : 'Passion for undervisning'}
              </h3>
              <p className="text-gray-600">
                {locale === 'en' 
                  ? 'I believe every child deserves the best possible education and learning experience.'
                  : 'Jeg tror på at hvert barn fortjener den bedste mulige uddannelse og læringserfaring.'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <LightBulbIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {locale === 'en' ? 'Innovation' : 'Innovation'}
              </h3>
              <p className="text-gray-600">
                {locale === 'en' 
                  ? 'I constantly explore new ways to improve teaching and learning with technology.'
                  : 'Jeg udforsker konstant nye måder at forbedre undervisning og læring med teknologi.'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {locale === 'en' ? 'Ethics & Safety' : 'Etik & sikkerhed'}
              </h3>
              <p className="text-gray-600">
                {locale === 'en' 
                  ? 'I prioritize responsible and ethical use of AI in educational settings.'
                  : 'Jeg prioriterer ansvarlig og etisk brug af AI i uddannelsessammenhænge.'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UsersIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {locale === 'en' ? 'Community' : 'Fællesskab'}
              </h3>
              <p className="text-gray-600">
                {locale === 'en' 
                  ? 'I build strong partnerships with educators, parents, and institutions.'
                  : 'Jeg bygger stærke partnerskaber med undervisere, forældre og institutioner.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Indlæs både dansk og engelsk indhold
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/about.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/about.md'), 'utf8');
    
    return {
      props: {
        content: {
          da: daContent,
          en: enContent
        }
      }
    };
  } catch (error) {
    console.error('Error loading about content:', error);
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