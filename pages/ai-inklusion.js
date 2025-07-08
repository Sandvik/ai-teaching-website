import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useContext } from 'react';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function AIInklusion({ content, daContent, enContent }) {
  const { messages, locale } = useContext(LocaleContext);
  
  // Vælg det korrekte indhold baseret på locale
  const currentContent = locale === 'en' ? enContent : daContent;

  return (
    <>
      <Head>
        <title>{messages.home.specialized.inclusion.title}</title>
        <meta name="description" content={messages.home.specialized.inclusion.description} />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {messages.home.specialized.inclusion.title}
              </h1>
              <p className="text-xl text-gray-600">
                {messages.home.specialized.inclusion.description}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <MarkdownRenderer 
                content={currentContent}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/ai-inklusion.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/ai-inklusion.md'), 'utf8');
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
        content: '# Fejl\n\nKunne ikke indlæse ai-inklusion.md',
        daContent: '# Fejl\n\nKunne ikke indlæse ai-inklusion.md',
        enContent: '# Error\n\nCould not load ai-inklusion.md'
      } 
    };
  }
} 