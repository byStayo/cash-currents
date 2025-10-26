-- Add rate_type column to economic_indicators to support different loan types
ALTER TABLE economic_indicators 
ADD COLUMN IF NOT EXISTS rate_type text;

-- Update existing interest_rate records to be mortgage rates
UPDATE economic_indicators 
SET rate_type = 'mortgage' 
WHERE indicator_type = 'interest_rate' AND rate_type IS NULL;

-- Create unique constraint including rate_type
DROP INDEX IF EXISTS economic_indicators_unique_idx;
CREATE UNIQUE INDEX economic_indicators_unique_idx 
ON economic_indicators(indicator_type, country_code, date, COALESCE(rate_type, ''));