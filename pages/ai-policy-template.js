import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedContent from '../components/RelatedContent';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function AIPolicyTemplate({ content }) {
  const { locale } = useContext(LocaleContext);
  
  const currentContent = content[locale] || content.da;

  const pageContent = {
    da: {
      title: "AI Politik Skabelon for Skoler",
      description: "Komplet skabelon til at udvikle en AI politik for din skole med praktiske retningslinjer og GDPR overvejelser",
      breadcrumbs: [
        { name: 'Hjem', href: '/' },
        { name: 'AI Politik Skabelon', href: '/ai-policy-template' }
      ],
      relatedContent: [
        { title: 'GDPR Guide for AI i Skolen', href: '/gdpr-guide', description: 'Komplet guide til GDPR-compliance' },
        { title: 'FAQ - Ofte Stillede Spørgsmål', href: '/faq', description: 'Svar på almindelige spørgsmål om AI' },
        { title: 'AI Undervisning', href: '/ai-teaching', description: 'Praktiske tips til AI i undervisningen' },
        { title: 'AI Inklusion', href: '/ai-inklusion', description: 'AI til inkluderende undervisning' }
      ]
    },
    en: {
      title: "AI Policy Template for Schools",
      description: "Complete template for developing an AI policy for your school with practical guidelines and GDPR considerations",
      breadcrumbs: [
        { name: 'Home', href: '/' },
        { name: 'AI Policy Template', href: '/ai-policy-template' }
      ],
      relatedContent: [
        { title: 'GDPR Guide for AI in Schools', href: '/gdpr-guide', description: 'Complete guide to GDPR compliance' },
        { title: 'FAQ - Frequently Asked Questions', href: '/faq', description: 'Answers to common questions about AI' },
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
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/ai-policy-template.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/ai-policy-template.md'), 'utf8');
    
    return {
      props: {
        content: {
          da: daContent,
          en: enContent
        }
      }
    };
  } catch (error) {
    console.error('Error loading AI policy template content:', error);
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