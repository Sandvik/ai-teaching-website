import { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import { StarIcon } from '@heroicons/react/24/solid';

function calloutHtml(text) {
  if (text.startsWith('Tip:')) {
    return `<div class='callout-tip'><span class='icon'>💡</span><div>${text.replace('Tip:', '').trim()}</div></div>`;
  }
  if (text.startsWith('Advarsel:')) {
    return `<div class='callout-warning'><span class='icon'>⚠️</span><div>${text.replace('Advarsel:', '').trim()}</div></div>`;
  }
  if (text.startsWith('Info:')) {
    return `<div class='callout-info'><span class='icon'>ℹ️</span><div>${text.replace('Info:', '').trim()}</div></div>`;
  }
  return null;
}

function addIdsToHeadings(html) {
  // Add IDs to headings for navigation - match the IDs used in guide.js, comparison.js, and ai-teaching.js
  return html.replace(
    /<h([1-6])>(.*?)<\/h([1-6])>/g,
    (match, level, content) => {
      // Create ID that matches the ones used in guide.js, comparison.js, and ai-teaching.js
      let id = content
        .toLowerCase()
        .trim();
      
      // Handle specific mappings for guide.js
      if (id === 'sådan bruger du chatgpt og ai i undervisningen') {
        id = 'sådan-bruger-du-chatgpt-og-ai-i-undervisningen';
      } else if (id === '1. generér quizzer og opgaver') {
        id = 'generér-quizzer-og-opgaver';
      } else if (id === '2. få inspiration til undervisningsforløb') {
        id = 'få-inspiration-til-undervisningsforløb';
      } else if (id === '3. forberedelse af undervisningsmateriale') {
        id = 'forberedelse-af-undervisningsmateriale';
      } else if (id === '4. forældre: støt lektielæsning') {
        id = 'forældre-støt-lektielæsning';
      } else if (id === '5. etik og ansvarlig brug') {
        id = 'etik-og-ansvarlig-brug';
      }
      // Handle specific mappings for comparison.js
      else if (id === 'sammenligning: ai-værktøjer til undervisning') {
        id = 'sammenligning-ai-værktøjer-til-undervisning';
      } else if (id === '🏆 top 10 ai-værktøjer til undervisning') {
        id = 'top-10-ai-værktøjer-til-undervisning';
      } else if (id === '📚 fag-specifikke ai-værktøjer') {
        id = 'fag-specifikke-ai-værktøjer';
      } else if (id === '🎯 anvendelsesområder') {
        id = 'anvendelsesområder';
      } else if (id === '💰 pris-sammenligning') {
        id = 'pris-sammenligning';
      } else if (id === '🏆 anbefalinger efter behov') {
        id = 'anbefalinger-efter-behov';
      } else if (id === '📊 detaljerede anmeldelser') {
        id = 'detaljerede-anmeldelser';
      }
      // Handle specific mappings for ai-teaching.js
      else if (id === 'ai i undervisning: komplet guide til lærere') {
        id = 'ai-i-undervisning-komplet-guide-til-lærere';
      } else if (id === '🎯 introduktion til ai i undervisning') {
        id = 'introduktion-til-ai-i-undervisning';
      } else if (id === '🚀 grundlæggende ai-koncepter for lærere') {
        id = 'grundlæggende-ai-koncepter-for-lærere';
      } else if (id === '📚 praktiske anvendelser i forskellige fag') {
        id = 'praktiske-anvendelser-i-forskellige-fag';
      } else if (id === '🎨 undervisningsstrategier med ai') {
        id = 'undervisningsstrategier-med-ai';
      } else if (id === '🛠️ praktiske værktøjer og apps') {
        id = 'praktiske-værktøjer-og-apps';
      } else if (id === '📊 evaluering og feedback med ai') {
        id = 'evaluering-og-feedback-med-ai';
      } else if (id === '🎯 lektiehjælp og hjemmestøtte') {
        id = 'lektiehjælp-og-hjemmestøtte';
      } else if (id === '🚨 etik og ansvar i ai-brug') {
        id = 'etik-og-ansvar-i-ai-brug';
      } else if (id === '🔮 fremtidige muligheder') {
        id = 'fremtidige-muligheder';
      } else if (id === '📋 implementeringsplan') {
        id = 'implementeringsplan';
      } else if (id === '🏆 success stories') {
        id = 'success-stories';
      } else {
        // General case: convert to kebab-case
        id = id
          .replace(/[^a-z0-9æøå\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      return `<h${level} id="${id}">${content}</h${level}>`;
    }
  );
}

function convertStarsToIcons(html) {
  // Convert star ratings to visual stars
  return html.replace(
    /(⭐⭐⭐⭐⭐|⭐⭐⭐⭐|⭐⭐⭐|⭐⭐|⭐)/g,
    (match) => {
      const starCount = match.length / 2; // Each star is 2 characters
      const stars = [];
      for (let i = 0; i < 5; i++) {
        if (i < starCount) {
          stars.push('<svg class="inline h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>');
        } else {
          stars.push('<svg class="inline h-4 w-4 text-gray-300" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>');
        }
      }
      return `<span class="flex items-center gap-1">${stars.join('')} <span class="text-sm text-gray-600 ml-1">${starCount}.0</span></span>`;
    }
  );
}

function enhanceTableStyling(html) {
  // Enhance table styling with better classes
  return html.replace(
    /<table>/g,
    '<table class="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm">'
  ).replace(
    /<th>/g,
    '<th class="bg-sage-600 text-white font-semibold p-3 text-left border-b border-gray-200">'
  ).replace(
    /<td>/g,
    '<td class="p-3 border-b border-gray-100 hover:bg-sage-50 transition-colors">'
  ).replace(
    /<tr>/g,
    '<tr class="hover:bg-sage-50 transition-colors">'
  );
}

export default function MarkdownRenderer({ content }) {
  const [htmlContent, setHtmlContent] = useState('');
  
  useEffect(() => {
    // Custom renderer for blockquotes as callouts
    const blockquoteReplacer = (html) => {
      return html.replace(/<blockquote>\s*<p>(.*?)<\/p>\s*<\/blockquote>/gs, (match, p1) => {
        const callout = calloutHtml(p1);
        return callout ? callout : match;
      });
    };
    
    remark().use(html).process(content).then((file) => {
      let htmlStr = String(file);
      htmlStr = blockquoteReplacer(htmlStr);
      htmlStr = addIdsToHeadings(htmlStr);
      htmlStr = convertStarsToIcons(htmlStr);
      htmlStr = enhanceTableStyling(htmlStr);
      setHtmlContent(htmlStr);
    });
  }, [content]);
  
  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
} 