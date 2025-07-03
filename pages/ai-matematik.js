import React, { useContext } from 'react';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function AIMatematik({ content }) {
  const { locale } = useContext(LocaleContext);
  
  // Vælg det korrekte indhold baseret på locale
  const currentContent = content[locale] || content.da;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 markdown-content">
          <MarkdownRenderer content={currentContent} />
        </article>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Indlæs både dansk og engelsk indhold
    const daContent = fs.readFileSync(path.join(process.cwd(), 'content/da/ai-matematik.md'), 'utf8');
    const enContent = fs.readFileSync(path.join(process.cwd(), 'content/en/ai-math.md'), 'utf8');
    
    return {
      props: {
        content: {
          da: daContent,
          en: enContent
        }
      }
    };
  } catch (error) {
    console.error('Error loading AI matematik content:', error);
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