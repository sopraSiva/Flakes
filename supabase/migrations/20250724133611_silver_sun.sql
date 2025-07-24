/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `date_created` (timestamp, defaults to now())
      - `title` (text, subject line)
      - `body` (text, message content)
      - `list_of_stores` (jsonb, selected store information)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for users to manage their own messages
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_created timestamptz DEFAULT now(),
  title text NOT NULL,
  body text NOT NULL,
  list_of_stores jsonb DEFAULT '[]'::jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);