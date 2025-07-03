import { useState, useContext } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Breadcrumbs from '../components/Breadcrumbs';
import RelatedContent from '../components/RelatedContent';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function LessonPlans({ content }) {
  const { locale } = useContext(LocaleContext);
  
  const currentContent = content[locale] || content.da;

  const pageContent = {
    da: {
      title: "Lektieplaner med AI Integration",
      description: "Færdige lektieplaner med AI-integration til forskellige fag og klassetrin",
      breadcrumbs: [
        { name: 'Hjem', href: '/' },
        { name: 'Lektieplaner', href: '/lesson-plans' }
      ],
      relatedContent: [
        { title: 'Prompt Library', href: '/prompt-library', description: 'Samling af testede AI-prompts' },
        { title: 'AI Politik Skabelon', href: '/ai-policy-template', description: 'Komplet skabelon til AI politik' },
        { title: 'FAQ - Ofte Stillede Spørgsmål', href: '/faq', description: 'Svar på almindelige spørgsmål om AI' },
        { title: 'AI Undervisning', href: '/ai-teaching', description: 'Praktiske tips til AI i undervisningen' }
      ]
    },
    en: {
      title: "Lesson Plans with AI Integration",
      description: "Complete lesson plans with AI integration for different subjects and grade levels",
      breadcrumbs: [
        { name: 'Home', href: '/' },
        { name: 'Lesson Plans', href: '/lesson-plans' }
      ],
      relatedContent: [
        { title: 'Prompt Library', href: '/prompt-library', description: 'Collection of tested AI prompts' },
        { title: 'AI Policy Template', href: '/ai-policy-template', description: 'Complete template for AI policy' },
        { title: 'FAQ - Frequently Asked Questions', href: '/faq', description: 'Answers to common questions about AI' },
        { title: 'AI Teaching', href: '/ai-teaching', description: 'Practical tips for AI in teaching' }
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
      
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
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
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/lesson-plans.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/lesson-plans.md'), 'utf8');
    
    return {
      props: {
        content: {
          da: daContent,
          en: enContent
        }
      }
    };
  } catch (error) {
    console.error('Error loading lesson plans content:', error);
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