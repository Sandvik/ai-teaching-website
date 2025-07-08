import React, { useEffect, useState, useCallback } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import { StarIcon } from '@heroicons/react/24/solid';

const calloutHtml = (text) => {
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
};

const processHtmlInMarkdown = (content) => {
  // Replace HTML content with placeholders before markdown processing
  const htmlBlocks = [];
  let htmlIndex = 0;
  
  // Find and replace HTML blocks with placeholders - improved regex
  content = content.replace(/<div[^>]*>[\s\S]*?<\/div>/g, (match) => {
    const placeholder = `HTML_BLOCK_${htmlIndex}_PLACEHOLDER`;
    htmlBlocks[htmlIndex] = match;
    htmlIndex++;
    return placeholder;
  });
  
  return { content, htmlBlocks };
};

const processMarkdownTables = (content) => {
  // Process markdown tables and replace with placeholders
  console.log('Processing markdown tables...');
  
  const tableBlocks = [];
  let tableIndex = 0;
  
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Check if this line looks like a table header (starts and ends with |)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      console.log('Found potential table header:', line);
      
      // Check if next line is a separator
      if (i + 1 < lines.length && lines[i + 1].trim().match(/^\|[\s\-:|]+\|$/)) {
        console.log('Found table separator:', lines[i + 1]);
        
        // Collect all table rows
        const tableLines = [line];
        let j = i + 1;
        
        // Add separator
        tableLines.push(lines[j]);
        j++;
        
        // Add data rows
        while (j < lines.length && lines[j].trim().startsWith('|') && lines[j].trim().endsWith('|')) {
          tableLines.push(lines[j]);
          j++;
        }
        
        console.log('Table lines found:', tableLines.length);
        
        // Convert table to HTML and store as placeholder
        const htmlTable = convertTableToHtml(tableLines);
        const placeholder = `TABLE_BLOCK_${tableIndex}_PLACEHOLDER`;
        tableBlocks[tableIndex] = htmlTable;
        tableIndex++;
        
        result.push(placeholder);
        i = j; // Skip to after the table
        continue;
      }
    }
    
    result.push(line);
    i++;
  }
  
  return { content: result.join('\n'), tableBlocks };
};

const restoreHtmlBlocks = (htmlStr, htmlBlocks, tableBlocks) => {
  // Restore HTML blocks from placeholders - improved restoration
  htmlBlocks.forEach((block, index) => {
    const placeholder = `HTML_BLOCK_${index}_PLACEHOLDER`;
    console.log(`Looking for placeholder: ${placeholder}`);
    console.log(`Replacing with block length: ${block.length}`);
    
    // Use global replace to handle multiple occurrences
    const newHtmlStr = htmlStr.replace(new RegExp(placeholder, 'g'), block);
    console.log(`Replacement made: ${htmlStr.length !== newHtmlStr.length}`);
    htmlStr = newHtmlStr;
  });
  
  // Restore table blocks from placeholders
  if (tableBlocks) {
    tableBlocks.forEach((block, index) => {
      const placeholder = `TABLE_BLOCK_${index}_PLACEHOLDER`;
      console.log(`Looking for table placeholder: ${placeholder}`);
      console.log(`Replacing with table block length: ${block.length}`);
      
      // Use global replace to handle multiple occurrences
      const newHtmlStr = htmlStr.replace(new RegExp(placeholder, 'g'), block);
      console.log(`Table replacement made: ${htmlStr.length !== newHtmlStr.length}`);
      htmlStr = newHtmlStr;
    });
  }
  
  return htmlStr;
};

const addIdsToHeadings = (html) => {
  // Add IDs to headings for navigation - match the IDs used in guide.js, comparison.js, and ai-teaching.js
  return html.replace(
    /<h([1-6])>(.*?)<\/h([1-6])>/g,
    (match, level, content) => {
      // Check if heading already has an ID from markdown {#id} syntax
      const idMatch = content.match(/\{#([^}]+)\}$/);
      if (idMatch) {
        const id = idMatch[1];
        const cleanContent = content.replace(/\{#[^}]+\}$/, '').trim();
        return `<h${level} id="${id}">${cleanContent}</h${level}>`;
      }
      
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
      
      console.log(`Generated ID for heading "${content}": ${id}`);
      return `<h${level} id="${id}">${content}</h${level}>`;
    }
  );
};

const convertStarsToIcons = (html) => {
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
};

const convertTableToHtml = (tableLines) => {
  if (tableLines.length < 3) return tableLines.join('\n');
  
  const headerRow = tableLines[0];
  const separatorRow = tableLines[1];
  const dataRows = tableLines.slice(2);
  
  // Parse header
  const headers = headerRow.split('|').slice(1, -1).map(h => h.trim().replace(/\*\*/g, ''));
  
  // Parse data rows
  const rows = dataRows.map(row => 
    row.split('|').slice(1, -1).map(cell => cell.trim().replace(/\*\*/g, ''))
  );
  
  // Build HTML table
  let htmlTable = '<table class="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm">';
  
  // Header
  htmlTable += '<thead><tr>';
  headers.forEach(header => {
    htmlTable += `<th class="bg-sage-600 text-white font-semibold p-3 text-left border-b border-gray-200">${header}</th>`;
  });
  htmlTable += '</tr></thead>';
  
  // Body
  htmlTable += '<tbody>';
  rows.forEach(row => {
    htmlTable += '<tr class="hover:bg-sage-50 transition-colors">';
    row.forEach(cell => {
      htmlTable += `<td class="p-3 border-b border-gray-100">${cell}</td>`;
    });
    htmlTable += '</tr>';
  });
  htmlTable += '</tbody></table>';
  
  console.log('Generated HTML table for:', headers.join(', '));
  return htmlTable;
};

const enhanceTableStyling = (html) => {
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
};

const MarkdownRenderer = React.memo(({ content }) => {
  const [htmlContent, setHtmlContent] = useState('');

  const processContent = useCallback(async () => {
    if (!content) return;
    
    // Custom renderer for blockquotes as callouts
    const blockquoteReplacer = (html) => {
      return html.replace(/<blockquote>\s*<p>(.*?)<\/p>\s*<\/blockquote>/gs, (match, p1) => {
        const callout = calloutHtml(p1);
        return callout ? callout : match;
      });
    };
    
    // Process HTML content first
    const { content: processedContent, htmlBlocks } = processHtmlInMarkdown(content);
    console.log('HTML blocks found:', htmlBlocks.length);
    console.log('Processed content length:', processedContent.length);
    
    // Process markdown tables and get placeholders
    const { content: contentWithTables, tableBlocks } = processMarkdownTables(processedContent);
    console.log('Table blocks found:', tableBlocks.length);
    
    try {
      // First process markdown to HTML
      const file = await remark()
        .use(html)
        .process(contentWithTables);
      
      let htmlStr = String(file);
      console.log('Initial HTML length:', htmlStr.length);
      console.log('Looking for placeholder in HTML:', htmlStr.includes('HTML_BLOCK_0_PLACEHOLDER'));
      console.log('Looking for table placeholder in HTML:', htmlStr.includes('TABLE_BLOCK_0_PLACEHOLDER'));
      
      // Restore HTML blocks and tables
      htmlStr = restoreHtmlBlocks(htmlStr, htmlBlocks, tableBlocks);
      console.log('After HTML restoration length:', htmlStr.length);
      
      htmlStr = blockquoteReplacer(htmlStr);
      htmlStr = addIdsToHeadings(htmlStr);
      htmlStr = convertStarsToIcons(htmlStr);
      htmlStr = enhanceTableStyling(htmlStr);
      
      setHtmlContent(htmlStr);
    } catch (error) {
      console.error('Error processing markdown:', error);
      setHtmlContent('<p>Error loading content</p>');
    }
  }, [content]);

  useEffect(() => {
    processContent();
  }, [processContent]);

  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer; 