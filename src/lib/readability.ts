import { Readability } from '@mozilla/readability';
import { calculateReadingTime, sanitizeHtml } from './utils';
import { fetchArticleContent } from './api';

export interface ReadabilityOptions {
  debug?: boolean;
  maxElemsToParse?: number;
  nbTopCandidates?: number;
  charThreshold?: number;
  classesToPreserve?: string[];
  keepClasses?: boolean;
}

export interface ParsedArticle {
  title: string;
  content: string;
  textContent: string;
  excerpt: string | null;
  readingTime: number;
  byline: string | null;
  siteName: string | null;
  lang: string | null;
  publishedTime: string | null;
}

export async function parseArticle(
  url: string,
  options: ReadabilityOptions = {}
): Promise<ParsedArticle> {
  try {
    const html = await fetchArticleContent(url);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    
    // Check if content is likely readable before parsing
    if (!isProbablyReaderable(doc)) {
      throw new Error('Content does not appear to be a readable article');
    }

    const reader = new Readability(doc, {
      debug: options.debug ?? false,
      maxElemsToParse: options.maxElemsToParse,
      nbTopCandidates: options.nbTopCandidates,
      charThreshold: options.charThreshold,
      classesToPreserve: options.classesToPreserve,
      keepClasses: options.keepClasses ?? false,
    });

    const article = reader.parse();
    
    if (!article) {
      throw new Error('Could not parse article content');
    }

    // Sanitize HTML content to prevent XSS
    const sanitizedContent = sanitizeHtml(article.content);

    return {
      title: article.title,
      content: sanitizedContent,
      textContent: article.textContent,
      excerpt: article.excerpt,
      readingTime: calculateReadingTime(article.textContent),
      byline: article.byline,
      siteName: article.siteName,
      lang: article.lang,
      publishedTime: article.publishedTime
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Article parsing failed: ${message}`);
  }
}

// Helper function to check if content is likely readable
function isProbablyReaderable(doc: Document): boolean {
  const minContentLength = 140;
  const minScore = 20;
  
  // Remove unlikely candidates
  const unlikelyCandidates = doc.querySelectorAll(
    'header, footer, nav, aside, [role="complementary"]'
  );
  let score = 100;
  
  unlikelyCandidates.forEach(() => {
    score -= 10;
  });
  
  // Check for article-like content
  const article = doc.querySelector('article');
  if (article) score += 25;
  
  // Check content length
  const content = doc.body.textContent || '';
  if (content.length < minContentLength) score -= 25;
  
  return score >= minScore;
}