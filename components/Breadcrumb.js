import React, { useContext } from 'react';
import { LocaleContext } from '../pages/_app';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export default function Breadcrumb() {
  const { locale, messages } = useContext(LocaleContext);
  const router = useRouter();

  // Define breadcrumb mappings for different pages
  const getBreadcrumbs = () => {
    const path = router.pathname;
    const breadcrumbs = [];

    // Always start with home
    breadcrumbs.push({
      name: messages.nav.home,
      href: '/',
      current: path === '/'
    });

    // Map different pages to their breadcrumb structure
    if (path === '/ai-teaching') {
      breadcrumbs.push({
        name: messages.nav.aiTeaching,
        href: '/ai-teaching',
        current: true
      });
    } else if (path === '/guide') {
      breadcrumbs.push({
        name: messages.nav.guide,
        href: '/guide',
        current: true
      });
    } else if (path === '/comparison') {
      breadcrumbs.push({
        name: messages.nav.comparison,
        href: '/comparison',
        current: true
      });
    } else if (path === '/quiz-generator') {
      breadcrumbs.push({
        name: messages.nav.quiz,
        href: '/quiz-generator',
        current: true
      });
    } else if (path === '/ai-i-dansk-fag-detailed') {
      breadcrumbs.push({
        name: messages.nav.aiTeaching,
        href: '/ai-teaching',
        current: false
      });
      breadcrumbs.push({
        name: messages.nav.aiDanishDetailed,
        href: '/ai-i-dansk-fag-detailed',
        current: true
      });
    } else if (path === '/ai-i-matematik-detailed') {
      breadcrumbs.push({
        name: messages.nav.aiTeaching,
        href: '/ai-teaching',
        current: false
      });
      breadcrumbs.push({
        name: messages.nav.aiMathDetailed,
        href: '/ai-i-matematik-detailed',
        current: true
      });
    } else if (path === '/ai-i-historie-detailed') {
      breadcrumbs.push({
        name: messages.nav.aiTeaching,
        href: '/ai-teaching',
        current: false
      });
      breadcrumbs.push({
        name: messages.nav.aiHistoryDetailed,
        href: '/ai-i-historie-detailed',
        current: true
      });
    } else if (path === '/ai-lovgivning') {
      breadcrumbs.push({
        name: messages.nav.aiTeaching,
        href: '/ai-teaching',
        current: false
      });
      breadcrumbs.push({
        name: messages.nav.aiLaw,
        href: '/ai-lovgivning',
        current: true
      });
    } else if (path === '/ai-vaerktoejssammenligning') {
      breadcrumbs.push({
        name: messages.nav.aiTeaching,
        href: '/ai-teaching',
        current: false
      });
      breadcrumbs.push({
        name: messages.nav.aiToolsComparison,
        href: '/ai-vaerktoejssammenligning',
        current: true
      });
    } else if (path === '/ai-inklusion') {
      breadcrumbs.push({
        name: messages.nav.aiTeaching,
        href: '/ai-teaching',
        current: false
      });
      breadcrumbs.push({
        name: messages.home.specialized.inclusion.title,
        href: '/ai-inklusion',
        current: true
      });
    } else if (path === '/ai-foraeldremoede') {
      breadcrumbs.push({
        name: messages.nav.aiTeaching,
        href: '/ai-teaching',
        current: false
      });
      breadcrumbs.push({
        name: messages.home.specialized.parents.title,
        href: '/ai-foraeldremoede',
        current: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumb on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index === 0 ? (
            <Link
              href={breadcrumb.href}
              className={`flex items-center hover:text-sage-600 transition-colors ${
                breadcrumb.current ? 'text-sage-600 font-medium' : 'text-gray-500'
              }`}
            >
              <HomeIcon className="h-4 w-4 mr-1" />
              {breadcrumb.name}
            </Link>
          ) : (
            <>
              <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
              {breadcrumb.current ? (
                <span className="text-sage-600 font-medium">{breadcrumb.name}</span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="hover:text-sage-600 transition-colors"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </>
          )}
        </div>
      ))}
    </nav>
  );
} 