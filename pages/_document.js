import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="da">
      <Head>
        {/* Google AdSense Code */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9369667589960762"
          crossOrigin="anonymous"></script>
        
        {/* Meta tags for AdSense */}
        <meta name="google-adsense-account" content="ca-pub-9369667589960762" />
        
        {/* Ensure CSS loads correctly */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 