import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthForm } from './components/auth/auth-form';
import { ArticleForm } from './components/articles/article-form';
import { ArticleList } from './components/articles/article-list';
import { ArticleReader } from './components/articles/article-reader';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={
            <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
              <ArticleForm />
              <ArticleList />
            </div>
          } />
          <Route path="/articles/:id" element={<ArticleReader />} />
          <Route path="/auth" element={
            <div className="flex min-h-screen items-center justify-center px-4">
              <AuthForm />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
