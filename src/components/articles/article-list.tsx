import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/supabase';
import { format } from 'date-fns';
import { Clock, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';

type Article = Database['public']['Tables']['articles']['Row'];

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading articles...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No articles saved yet. Start by saving your first article!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Link
          key={article.id}
          to={`/articles/${article.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.reading_time} min read
            </span>
            <span>
              {format(new Date(article.created_at), 'MMM d, yyyy')}
            </span>
            {article.folder_id && (
              <span className="flex items-center gap-1">
                <Folder className="h-4 w-4" />
                Folder
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}