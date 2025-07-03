import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedContent from '../components/RelatedContent';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function FAQ({ content }) {
  const { locale } = useContext(LocaleContext);
  
  const currentContent = content[locale] || content.da;

  const pageContent = {
    da: {
      title: "FAQ - Ofte Stillede Spørgsmål om AI i Skolen",
      description: "Svar på de mest almindelige spørgsmål om AI i uddannelse, GDPR, implementering og praktisk brug",
      breadcrumbs: [
        { name: 'Hjem', href: '/' },
        { name: 'FAQ', href: '/faq' }
      ],
      relatedContent: [
        { title: 'AI Politik Skabelon', href: '/ai-policy-template', description: 'Komplet skabelon til AI politik' },
        { title: 'GDPR Guide for AI i Skolen', href: '/gdpr-guide', description: 'Komplet guide til GDPR-compliance' },
        { title: 'AI Undervisning', href: '/ai-teaching', description: 'Praktiske tips til AI i undervisningen' },
        { title: 'AI Inklusion', href: '/ai-inklusion', description: 'AI til inkluderende undervisning' }
      ]
    },
    en: {
      title: "FAQ - Frequently Asked Questions about AI in Schools",
      description: "Answers to the most common questions about AI in education, GDPR, implementation and practical use",
      breadcrumbs: [
        { name: 'Home', href: '/' },
        { name: 'FAQ', href: '/faq' }
      ],
      relatedContent: [
        { title: 'AI Policy Template', href: '/ai-policy-template', description: 'Complete template for AI policy' },
        { title: 'GDPR Guide for AI in Schools', href: '/gdpr-guide', description: 'Complete guide to GDPR compliance' },
        { title: 'AI Teaching', href: '/ai-teaching', description: 'Practical tips for AI in teaching' },
        { title: 'AI Inclusion', href: '/ai-inclusion', description: 'AI for inclusive teaching' }
      ]
    }
  };

  const currentPageContent = pageContent[locale] || pageContent.da;

  return (
    <Layout>
      <SEO 
        title={currentPageContent.title}
        description={currentPageContent.description}
        locale={locale}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={currentPageContent.breadcrumbs} />
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {currentPageContent.title}
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <MarkdownRenderer content={currentContent} />
              </div>
            </div>
            
            <RelatedContent 
              title={locale === 'da' ? 'Relateret Indhold' : 'Related Content'}
              items={currentPageContent.relatedContent}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/faq.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/faq.md'), 'utf8');
    
    return {
      props: {
        content: {
          da: daContent,
          en: enContent
        }
      }
    };
  } catch (error) {
    console.error('Error loading FAQ content:', error);
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