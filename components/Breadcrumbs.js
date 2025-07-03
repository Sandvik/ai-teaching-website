import React, { useContext } from 'react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LocaleContext } from '../pages/_app';

export default function Breadcrumbs() {
  const { locale } = useContext(LocaleContext);
  const router = useRouter();

  const getBreadcrumbs = () => {
    const pathSegments = router.asPath.split('/').filter(segment => segment);
    
    if (pathSegments.length === 0) {
      return [];
    }

    const breadcrumbs = [
      {
        name: locale === 'en' ? 'Home' : 'Hjem',
        href: '/',
        current: false
      }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Map URL segments to readable names
      let name = '';
      switch (segment) {
        case 'ai-teaching':
          name = locale === 'en' ? 'Complete Guide' : 'Komplet Guide';
          break;
        case 'comparison':
          name = locale === 'en' ? 'AI Tools' : 'AI Værktøjer';
          break;
        case 'quiz-generator':
          name = locale === 'en' ? 'Quiz Generator' : 'Quiz-generator';
          break;
        case 'ai-matematik':
          name = locale === 'en' ? 'AI in Mathematics' : 'AI i Matematik';
          break;
        case 'ai-inklusion':
          name = locale === 'en' ? 'Inclusion & Differentiation' : 'Inklusion & Differentiering';
          break;
        case 'ai-foraeldremoede':
          name = locale === 'en' ? 'Parent Collaboration' : 'Forældresamarbejde';
          break;
        case 'guide':
          name = locale === 'en' ? 'Guide' : 'Guide';
          break;
        case 'about':
          name = locale === 'en' ? 'About' : 'Om';
          break;
        case 'ministeriet-anbefalinger':
          name = locale === 'en' ? 'Ministry Recommendations' : 'Ministeriets Anbefalinger';
          break;
        default:
          name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }

      breadcrumbs.push({
        name,
        href: currentPath,
        current: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            )}
            {breadcrumb.current ? (
              <span className="text-gray-500 font-medium">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-sage-600 hover:text-sage-700 font-medium flex items-center"
              >
                {index === 0 && <HomeIcon className="h-4 w-4 mr-1" />}
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 