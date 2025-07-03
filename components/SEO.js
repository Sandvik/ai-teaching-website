import Head from 'next/head';

export default function SEO({
  title = 'AI i Undervisning | ai-skole.dk',
  description = 'AI i Undervisning: Guides, værktøjer og officielle anbefalinger til brug af AI i folkeskolen. Lær hvordan du bruger AI i skolen, matematik, inklusion og forældresamarbejde. Ministeriets retningslinjer og praktiske eksempler.',
  keywords = 'AI i undervisning, AI skolen, AI for lærere, AI folkeskolen, AI værktøjer, AI matematik, AI inklusion, AI forældre, AI ministeriets anbefalinger, ChatGPT skole, AI ressourcer, AI guides, AI skema, AI opgaver',
  url = 'https://ai-skole.dk',
  image = 'https://ai-skole.dk/og-image.png',
  canonical = 'https://ai-skole.dk',
  robots = 'index, follow',
  structuredData = null
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </Head>
  );
} 