import React, { useState } from 'react';
import '../styles/globals.css';
import da from '../locales/da.json';
import en from '../locales/en.json';

export const LocaleContext = React.createContext();

function MyApp({ Component, pageProps }) {
  const [locale, setLocale] = useState('da');
  const messages = locale === 'da' ? da : en;
  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages }}>
      <Component {...pageProps} />
    </LocaleContext.Provider>
  );
}

export default MyApp; 