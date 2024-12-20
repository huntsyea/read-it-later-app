/*
  # Initial Schema Setup for Read-it-Later Application

  1. New Tables
    - `folders`: Manages article organization with nested folder support
    - `articles`: Stores saved articles with their parsed content
    - `highlights`: Stores user highlights and notes for articles
    - `tags`: Manages article categorization
    - `article_tags`: Junction table for article-tag relationships

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create folders table first since it's referenced by articles
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  parent_id uuid REFERENCES folders(id)
);

-- Create articles table with folder reference
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  url text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  reading_time integer NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  folder_id uuid REFERENCES folders(id),
  read_progress integer DEFAULT 0
);

-- Create highlights table
CREATE TABLE IF NOT EXISTS highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  article_id uuid NOT NULL REFERENCES articles(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  content text NOT NULL,
  color text NOT NULL,
  note text
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  UNIQUE(name, user_id)
);

-- Create article_tags junction table
CREATE TABLE IF NOT EXISTS article_tags (
  article_id uuid REFERENCES articles(id),
  tag_id uuid REFERENCES tags(id),
  PRIMARY KEY (article_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for folders
CREATE POLICY "Users can manage their own folders"
  ON folders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for articles
CREATE POLICY "Users can manage their own articles"
  ON articles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for highlights
CREATE POLICY "Users can manage their own highlights"
  ON highlights
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for tags
CREATE POLICY "Users can manage their own tags"
  ON tags
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for article_tags
CREATE POLICY "Users can manage their own article tags"
  ON article_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_id
      AND articles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM articles
      WHERE articles.id = article_id
      AND articles.user_id = auth.uid()
    )
  );