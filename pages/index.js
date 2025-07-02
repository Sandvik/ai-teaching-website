import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
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
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient rounded-xl shadow-lg py-16 px-8 mb-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
            AI i Undervisning
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Opdag hvordan kunstig intelligens kan forbedre læring og undervisning. 
            Praktiske værktøjer og guides til lærere og forældre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/guide" className="btn-primary">
              Kom i gang
            </Link>
            <Link href="/comparison" className="btn-secondary">
              Se værktøjer
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Hvad kan AI hjælpe med?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <AcademicCapIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Undervisningsplanlægning</h3>
            <p className="text-gray-600">Spar tid med AI-drevne lektionsplaner og aktiviteter</p>
          </div>
          
          <div className="card p-6 text-center">
            <UserGroupIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Differentiering</h3>
            <p className="text-gray-600">Tilpas undervisning til alle elevers behov og niveauer</p>
          </div>
          
          <div className="card p-6 text-center">
            <LightBulbIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Kreativitet</h3>
            <p className="text-gray-600">Få inspiration til nye undervisningsmetoder og projekter</p>
          </div>
          
          <div className="card p-6 text-center">
            <ChartBarIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Evaluering</h3>
            <p className="text-gray-600">Lav quizzer og tests automatisk med AI</p>
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
              <h2 className="text-2xl font-bold text-gray-800">Komplet Guide</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Lær hvordan du bruger ChatGPT og andre AI-værktøjer i din undervisning. 
              Trin-for-trin guide med praktiske eksempler.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-gray-700">Grundlæggende AI-koncepter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-gray-700">Praktiske anvendelser i klassen</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-gray-700">Tips til forældre</span>
              </div>
            </div>
            <Link href="/guide" className="btn-primary">
              Læs guiden
            </Link>
          </div>

          {/* Tools Comparison */}
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <PuzzlePieceIcon className="h-10 w-10 text-sage-600" />
              <h2 className="text-2xl font-bold text-gray-800">Værktøjssammenligning</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Find det bedste AI-værktøj til dine behov. Sammenligning af funktioner, 
              priser og anvendelsesområder.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-gray-700">Gratis vs. betalte værktøjer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-gray-700">Fag-specifikke anbefalinger</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span className="text-gray-700">Praktiske anmeldelser</span>
              </div>
            </div>
            <Link href="/comparison" className="btn-primary">
              Se sammenligning
            </Link>
          </div>
        </div>
      </section>

      {/* Specialized Content */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Specialiserede guides
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                <span className="text-sage-600 font-bold">M</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">AI i Matematik</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Opdag de bedste AI-værktøjer til matematikundervisning og hjemmestøtte.
            </p>
            <Link href="/ai-matematik" className="text-sage-600 hover:text-sage-700 font-medium">
              Læs mere →
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                <span className="text-sage-600 font-bold">I</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Inklusion & Differentiering</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Hvordan AI kan støtte elever med forskellige behov og læringsstile.
            </p>
            <Link href="/ai-inklusion" className="text-sage-600 hover:text-sage-700 font-medium">
              Læs mere →
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
                <span className="text-sage-600 font-bold">F</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Forældresamarbejde</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Forbedr kommunikationen mellem skole og hjem med AI-værktøjer.
            </p>
            <Link href="/ai-foraeldremoede" className="text-sage-600 hover:text-sage-700 font-medium">
              Læs mere →
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Tools */}
      <section className="mb-12">
        <div className="card p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GlobeAltIcon className="h-12 w-12 text-sage-600" />
            <h2 className="text-3xl font-bold text-gray-800">Interaktive Værktøjer</h2>
          </div>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Prøv vores AI-drevne quiz-generator og få inspiration til dine egne aktiviteter.
          </p>
          <Link href="/quiz-generator" className="btn-primary">
            Prøv quiz-generator
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mb-12">
        <div className="bg-sage-50 border border-sage-200 rounded-xl p-8">
          <HeartIcon className="h-12 w-12 text-sage-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Del din erfaring
          </h2>
          <p className="text-gray-600 mb-6">
            Har du prøvet AI i undervisningen? Del dine tips og erfaringer med andre lærere og forældre.
          </p>
          <a 
            href="mailto:kontakt@ai-undervisning.dk" 
            className="btn-primary"
          >
            Kontakt os
          </a>
        </div>
      </section>
    </Layout>
  );
} 