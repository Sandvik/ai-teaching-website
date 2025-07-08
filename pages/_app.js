import React, { useState } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import da from '../locales/da.json';
import en from '../locales/en.json';

export const LocaleContext = React.createContext();

function MyApp({ Component, pageProps }) {
  const [locale, setLocale] = useState('da');
  const messages = locale === 'da' ? da : en;
  
  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages }}>
      <Head>
        {/* Performance optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Cache control */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
        
        {/* Performance hints */}
        <link rel="preload" href="/_next/static/chunks/main.js" as="script" />
      </Head>
      <Component {...pageProps} />
    </LocaleContext.Provider>
  );
}

export default MyApp; 