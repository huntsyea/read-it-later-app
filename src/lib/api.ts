const API_URL = import.meta.env.PROD 
  ? 'https://warm-dolphin-55980d.netlify.app/api'
  : '/api';

export async function fetchArticleContent(url: string): Promise<string> {
  if (!url) {
    throw new Error('URL is required');
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error('Invalid URL format');
  }

  try {
    const response = await fetch(`${API_URL}/fetch-article`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch article (${response.status})`);
    }

    if (!data.html) {
      throw new Error('Invalid response format');
    }

    // Validate HTML content
    if (typeof data.html !== 'string' || data.html.trim().length === 0) {
      throw new Error('Empty or invalid HTML content received');
    }

    const { html } = data;
    return html;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid response from server');
    }
    throw new Error(`Failed to fetch article: ${error.message}`);
  }
}