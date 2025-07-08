import React, { useContext } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { LocaleContext } from './_app';
import fs from 'fs';
import path from 'path';

export default function AiForaeldremoede({ content, locale, messages }) {
  const { setLocale } = useContext(LocaleContext);

  return (
    <>
      <Head>
        <title>{`${messages.nav.parents} - ${messages.layout.logo}`}</title>
        <meta name="description" content={messages.home.specialized.parents.description} />
      </Head>
      <Layout>
        <div className="max-w-4xl mx-auto">
          <MarkdownRenderer content={content} />
        </div>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params, locale = 'da' }) {
  try {
    const contentPath = path.join(process.cwd(), 'content', locale, 'ai-foraeldremoede.md');
    const content = fs.readFileSync(contentPath, 'utf8');
    
    // Import localization
    const messages = locale === 'da' 
      ? (await import('../locales/da.json')).default
      : (await import('../locales/en.json')).default;

    return {
      props: {
        content,
        locale,
        messages,
      },
    };
  } catch (error) {
    console.error('Error loading ai-foraeldremoede content:', error);
    return {
      props: {
        content: '# Error loading content',
        locale: 'da',
        messages: (await import('../locales/da.json')).default,
      },
    };
  }
} 