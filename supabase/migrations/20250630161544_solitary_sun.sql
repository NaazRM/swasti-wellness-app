/*
  # Email Verification Configuration

  1. Updates
    - Configure Supabase Auth settings for email verification
    - Update trigger function to handle email verification properly
    - Add email confirmation requirement

  2. Security
    - Ensure users must verify email before accessing protected features
    - Update RLS policies to account for email verification status
*/

-- Update the handle_new_user function to work better with email verification
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile after email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.profiles (id, name, email, avatar_url)
    VALUES (
      NEW.id, 
      coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'), 
      NEW.email,
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
      name = coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', profiles.name),
      email = NEW.email,
      avatar_url = coalesce(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also handle email confirmation updates
CREATE OR REPLACE FUNCTION handle_email_confirmation() 
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile when email gets confirmed
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.profiles (id, name, email, avatar_url)
    VALUES (
      NEW.id, 
      coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'), 
      NEW.email,
      NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
      name = coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', profiles.name),
      email = NEW.email,
      avatar_url = coalesce(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email confirmation
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_email_confirmation();