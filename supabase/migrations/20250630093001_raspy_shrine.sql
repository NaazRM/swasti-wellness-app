/*
  # Initial Schema Setup for Swasti App

  1. New Tables
    - `profiles` - User profiles with name, avatar, bio, etc.
    - `tips` - Health tips with title, description, benefits, etc.
    - `saved_tips` - Junction table for users' saved tips
    - `likes` - Junction table for users' liked tips
    - `comments` - Comments on tips
    - `follows` - Junction table for user follows

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  bio text,
  location text,
  followers_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  tips_count integer DEFAULT 0,
  saved_tips_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create tips table
CREATE TABLE IF NOT EXISTS tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  benefits text[] NOT NULL,
  ingredients text[],
  steps text[],
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create saved_tips junction table
CREATE TABLE IF NOT EXISTS saved_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tip_id uuid REFERENCES tips(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tip_id)
);

-- Create likes junction table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tip_id uuid REFERENCES tips(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tip_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tip_id uuid REFERENCES tips(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create follows junction table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create policies for tips
CREATE POLICY "Tips are viewable by everyone" 
  ON tips FOR SELECT USING (true);

CREATE POLICY "Users can insert their own tips" 
  ON tips FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tips" 
  ON tips FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tips" 
  ON tips FOR DELETE USING (auth.uid() = user_id);

-- Create policies for saved_tips
CREATE POLICY "Users can view their own saved tips" 
  ON saved_tips FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save tips" 
  ON saved_tips FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave tips" 
  ON saved_tips FOR DELETE USING (auth.uid() = user_id);

-- Create policies for likes
CREATE POLICY "Likes are viewable by everyone" 
  ON likes FOR SELECT USING (true);

CREATE POLICY "Users can like tips" 
  ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike tips" 
  ON likes FOR DELETE USING (auth.uid() = user_id);

-- Create policies for comments
CREATE POLICY "Comments are viewable by everyone" 
  ON comments FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" 
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON comments FOR DELETE USING (auth.uid() = user_id);

-- Create policies for follows
CREATE POLICY "Follows are viewable by everyone" 
  ON follows FOR SELECT USING (true);

CREATE POLICY "Users can follow others" 
  ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
  ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Create functions for counter updates
CREATE OR REPLACE FUNCTION increment_likes(tip_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE tips
  SET likes_count = likes_count + 1
  WHERE id = tip_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes(tip_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE tips
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = tip_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_comments(tip_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE tips
  SET comments_count = comments_count + 1
  WHERE id = tip_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_comments(tip_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE tips
  SET comments_count = GREATEST(0, comments_count - 1)
  WHERE id = tip_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_followers_count(profile_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET followers_count = followers_count + 1
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_followers_count(profile_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET followers_count = GREATEST(0, followers_count - 1)
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_following_count(profile_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET following_count = following_count + 1
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_following_count(profile_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET following_count = GREATEST(0, following_count - 1)
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_tips_count(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET tips_count = tips_count + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_saved_tips_count(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET saved_tips_count = saved_tips_count + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_saved_tips_count(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET saved_tips_count = GREATEST(0, saved_tips_count - 1)
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for saved_tips
CREATE OR REPLACE FUNCTION handle_saved_tip()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    PERFORM increment_saved_tips_count(NEW.user_id);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    PERFORM decrement_saved_tips_count(OLD.user_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER saved_tip_trigger
AFTER INSERT OR DELETE ON saved_tips
FOR EACH ROW
EXECUTE FUNCTION handle_saved_tip();

-- Create trigger for comments
CREATE OR REPLACE FUNCTION handle_comment_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM decrement_comments(OLD.tip_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_delete_trigger
AFTER DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION handle_comment_delete();