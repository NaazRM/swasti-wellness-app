/*
  # Fix Authentication and RLS Policies

  1. Security Updates
    - Update RLS policies for profiles table to allow proper user registration
    - Add missing policies for authenticated user operations
    - Fix policy conditions to work with Supabase auth

  2. Profile Management
    - Ensure profiles can be created during registration
    - Allow users to read and update their own profiles
    - Enable public profile viewing

  3. Authentication Flow
    - Fix INSERT policy for new user registration
    - Ensure proper user ID matching with auth.uid()
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Enable RLS on profiles table (should already be enabled but ensuring it)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for profiles table
CREATE POLICY "Anyone can view profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  TO public
  USING (auth.uid() = id);

-- Ensure tips policies are working correctly
DROP POLICY IF EXISTS "Tips are viewable by everyone" ON tips;
DROP POLICY IF EXISTS "Users can insert their own tips" ON tips;
DROP POLICY IF EXISTS "Users can update their own tips" ON tips;
DROP POLICY IF EXISTS "Users can delete their own tips" ON tips;

CREATE POLICY "Anyone can view tips"
  ON tips
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert tips"
  ON tips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tips"
  ON tips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tips"
  ON tips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix likes policies
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON likes;
DROP POLICY IF EXISTS "Users can like tips" ON likes;
DROP POLICY IF EXISTS "Users can unlike tips" ON likes;

CREATE POLICY "Anyone can view likes"
  ON likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can like tips"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike tips"
  ON likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix comments policies
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

CREATE POLICY "Anyone can view comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix saved_tips policies
DROP POLICY IF EXISTS "Users can view their own saved tips" ON saved_tips;
DROP POLICY IF EXISTS "Users can save tips" ON saved_tips;
DROP POLICY IF EXISTS "Users can unsave tips" ON saved_tips;

CREATE POLICY "Users can view their own saved tips"
  ON saved_tips
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can save tips"
  ON saved_tips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave tips"
  ON saved_tips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix follows policies
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON follows;
DROP POLICY IF EXISTS "Users can follow others" ON follows;
DROP POLICY IF EXISTS "Users can unfollow others" ON follows;

CREATE POLICY "Anyone can view follows"
  ON follows
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can follow others"
  ON follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);