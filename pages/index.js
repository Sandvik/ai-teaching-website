import React, { useContext } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import { LocaleContext } from './_app';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  LightBulbIcon, 
  ChartBarIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { locale, messages } = useContext(LocaleContext);
  return (
    <>
      <Head>
        <title>{messages.meta.homeTitle}</title>
        <meta name="description" content={messages.meta.homeDescription} />
      </Head>
      <Layout>
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-sage-50 to-blue-50 rounded-xl mb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {messages.hero.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {messages.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/guide" className="btn-primary">
              {messages.hero.cta}
            </Link>
            <Link href="/comparison" className="btn-secondary">
              {messages.hero.seeTools}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {messages.features.title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <AcademicCapIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{messages.features.feature1.title}</h3>
            <p className="text-gray-600">{messages.features.feature1.description}</p>
          </div>
          
          <div className="card p-6 text-center">
            <UserGroupIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{messages.features.feature2.title}</h3>
            <p className="text-gray-600">{messages.features.feature2.description}</p>
          </div>
          
          <div className="card p-6 text-center">
            <LightBulbIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{messages.features.feature3.title}</h3>
            <p className="text-gray-600">{messages.features.feature3.description}</p>
          </div>
          
          <div className="card p-6 text-center">
            <ChartBarIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{messages.features.feature4.title}</h3>
            <p className="text-gray-600">{messages.features.feature4.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="mb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Guide Section */}
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <BookOpenIcon className="h-10 w-10 text-sage-600" />
              <h2 className="text-2xl font-bold text-gray-800">{messages.home.guide.title}</h2>
            </div>
            <p className="text-gray-600 mb-6">
              {messages.home.guide.description}
            </p>
            <div className="space-y-3 mb-6">
              {messages.home.guide.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <Link href="/guide" className="btn-primary">
              {messages.home.guide.button}
            </Link>
          </div>

          {/* Tools Comparison */}
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <PuzzlePieceIcon className="h-10 w-10 text-sage-600" />
              <h2 className="text-2xl font-bold text-gray-800">{messages.home.comparison.title}</h2>
            </div>
            <p className="text-gray-600 mb-6">
              {messages.home.comparison.description}
            </p>
            <div className="space-y-3 mb-6">
              {messages.home.comparison.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <Link href="/comparison" className="btn-primary">
              {messages.home.comparison.button}
            </Link>
          </div>
        </div>
      </section>

      {/* Specialized Content */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {messages.home.specialized.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">D</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{messages.home.specialized.danish.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {messages.home.specialized.danish.description}
            </p>
            <Link href="/ai-i-dansk-fag-detailed" className="text-sage-600 hover:text-sage-700 font-medium">
              {messages.home.specialized.readMore}
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                <span className="text-sage-600 font-bold">M</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{messages.home.specialized.math.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {messages.home.specialized.math.description}
            </p>
            <Link href="/ai-i-matematik-detailed" className="text-sage-600 hover:text-sage-700 font-medium">
              {messages.home.specialized.readMore}
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">H</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{messages.home.specialized.history.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {messages.home.specialized.history.description}
            </p>
            <Link href="/ai-i-historie-detailed" className="text-sage-600 hover:text-sage-700 font-medium">
              {messages.home.specialized.readMore}
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">L</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{messages.home.specialized.law.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {messages.home.specialized.law.description}
            </p>
            <Link href="/ai-lovgivning" className="text-sage-600 hover:text-sage-700 font-medium">
              {messages.home.specialized.readMore}
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">V</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{messages.home.specialized.toolsComparison.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {messages.home.specialized.toolsComparison.description}
            </p>
            <Link href="/ai-vaerktoejssammenligning" className="text-sage-600 hover:text-sage-700 font-medium">
              {messages.home.specialized.readMore}
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                <span className="text-sage-600 font-bold">I</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{messages.home.specialized.inclusion.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">
              {messages.home.specialized.inclusion.description}
            </p>
            <Link href="/ai-inklusion" className="text-sage-600 hover:text-sage-700 font-medium">
              {messages.home.specialized.readMore}
            </Link>
          </div>
        </div>
      </section>

      {/* Danish Education Focus */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🇩🇰</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {messages.home.danishFocus.title}
            </h2>
            <p className="text-gray-600">
              {messages.home.danishFocus.description}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-blue-600 font-bold mb-2">{messages.home.danishFocus.folkeskolen.title}</div>
              <p className="text-sm text-gray-600">{messages.home.danishFocus.folkeskolen.description}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-green-600 font-bold mb-2">{messages.home.danishFocus.gymnasiet.title}</div>
              <p className="text-sm text-gray-600">{messages.home.danishFocus.gymnasiet.description}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-purple-600 font-bold mb-2">{messages.home.danishFocus.hjemmeundervisning.title}</div>
              <p className="text-sm text-gray-600">{messages.home.danishFocus.hjemmeundervisning.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tools */}
      <section className="mb-12">
        <div className="card p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlobeAltIcon className="h-12 w-12 text-sage-600" />
            <h2 className="text-3xl font-bold text-gray-800">{messages.home.tools.title}</h2>
          </div>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {messages.home.tools.description}
          </p>
          <Link href="/quiz-generator" className="btn-primary">
            {messages.home.tools.button}
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mb-12">
        <div className="bg-sage-50 border border-sage-200 rounded-xl p-8">
          <HeartIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {messages.home.cta.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {messages.home.cta.description}
          </p>
          <a 
            href={`mailto:${messages.layout.email}`}
            className="btn-primary"
          >
            {messages.home.cta.button}
          </a>
        </div>
      </section>
    </Layout>
    </>
  );
} 