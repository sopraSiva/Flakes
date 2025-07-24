/*
  # Create stores table

  1. New Tables
    - `stores`
      - `id` (uuid, primary key)
      - `code` (text, unique store code)
      - `name` (text, store name)
      - `area` (text, geographic area)
      - `status` (text, active/inactive status)
      - `postcode` (text, zip code)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `stores` table
    - Add policy for authenticated users to read stores data
*/

CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  area text,
  status text DEFAULT 'Active',
  postcode text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read stores"
  ON stores
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample store data
INSERT INTO stores (code, name, area, status, postcode) VALUES
  ('STR001', 'Manchester Central', 'North West', 'Active', 'M1 2AB'),
  ('STR002', 'London Bridge', 'London', 'Active', 'SE1 9GF'),
  ('STR003', 'Birmingham City', 'West Midlands', 'Active', 'B1 2JP'),
  ('STR004', 'Leeds North', 'Yorkshire', 'Active', 'LS1 4DY'),
  ('STR005', 'Bristol Temple', 'South West', 'Active', 'BS1 6XN'),
  ('STR006', 'Newcastle Metro', 'North East', 'Active', 'NE1 7RU'),
  ('STR007', 'Cardiff Bay', 'Wales', 'Active', 'CF10 5BZ'),
  ('STR008', 'Edinburgh Royal', 'Scotland', 'Active', 'EH1 1YZ'),
  ('STR009', 'Liverpool One', 'North West', 'Inactive', 'L1 8JQ'),
  ('STR010', 'Sheffield Park', 'Yorkshire', 'Active', 'S1 2HE');