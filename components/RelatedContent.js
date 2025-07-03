import React, { useContext } from 'react';
import { BookOpenIcon, PuzzlePieceIcon, AcademicCapIcon, UserGroupIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LocaleContext } from '../pages/_app';

export default function RelatedContent() {
  const { locale } = useContext(LocaleContext);
  const router = useRouter();

  const getRelatedContent = () => {
    const currentPath = router.pathname;
    
    const allContent = [
      {
        title: locale === 'en' ? 'Complete Guide: AI in Education' : 'Komplet Guide: AI i Undervisning',
        description: locale === 'en' ? 'Learn how to use ChatGPT and AI tools effectively' : 'Lær hvordan du bruger ChatGPT og AI-værktøjer effektivt',
        url: '/ai-teaching',
        icon: BookOpenIcon,
        category: locale === 'en' ? 'Guide' : 'Guide'
      },
      {
        title: locale === 'en' ? 'AI Tools Comparison' : 'AI-værktøjssammenligning',
        description: locale === 'en' ? 'Compare different AI tools and find the best one' : 'Sammenlign forskellige AI-værktøjer og find det bedste',
        url: '/comparison',
        icon: PuzzlePieceIcon,
        category: locale === 'en' ? 'Tools' : 'Værktøjer'
      },
      {
        title: locale === 'en' ? 'AI in Mathematics' : 'AI i Matematik',
        description: locale === 'en' ? 'AI tools for mathematics teaching and learning' : 'AI-værktøjer til matematikundervisning og læring',
        url: '/ai-matematik',
        icon: AcademicCapIcon,
        category: locale === 'en' ? 'Subject' : 'Fag'
      },
      {
        title: locale === 'en' ? 'Inclusion & Differentiation' : 'Inklusion & Differentiering',
        description: locale === 'en' ? 'How AI can support students with different needs' : 'Hvordan AI kan støtte elever med forskellige behov',
        url: '/ai-inklusion',
        icon: UserGroupIcon,
        category: locale === 'en' ? 'Subject' : 'Fag'
      },
      {
        title: locale === 'en' ? 'Parent Collaboration' : 'Forældresamarbejde',
        description: locale === 'en' ? 'Improve communication between school and home' : 'Forbedr kommunikationen mellem skole og hjem',
        url: '/ai-foraeldremoede',
        icon: UserGroupIcon,
        category: locale === 'en' ? 'Subject' : 'Fag'
      },
      {
        title: locale === 'en' ? 'Quiz Generator' : 'Quiz-generator',
        description: locale === 'en' ? 'Create AI-generated quizzes and tests' : 'Lav AI-genererede quizzer og tests',
        url: '/quiz-generator',
        icon: LightBulbIcon,
        category: locale === 'en' ? 'Tool' : 'Værktøj'
      }
    ];

    // Filter out current page and get related content
    const related = allContent.filter(item => item.url !== currentPath);
    
    // Return 3 most relevant items
    return related.slice(0, 3);
  };

  const relatedContent = getRelatedContent();

  if (relatedContent.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 bg-sage-50 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {locale === 'en' ? 'Related Resources' : 'Relaterede ressourcer'}
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedContent.map((item, index) => (
          <Link key={index} href={item.url} className="group">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group-hover:border-sage-300">
              <div className="flex items-center gap-3 mb-4">
                <item.icon className="h-6 w-6 text-sage-600" />
                <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-sage-700">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 