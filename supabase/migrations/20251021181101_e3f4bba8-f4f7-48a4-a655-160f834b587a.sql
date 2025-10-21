-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the economic data fetch to run daily at 6 AM UTC
SELECT cron.schedule(
  'fetch-economic-data-daily',
  '0 6 * * *', -- Every day at 6 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://eganxvnmgmvedrpnswuh.supabase.co/functions/v1/fetch-economic-data',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYW54dm5tZ212ZWRycG5zd3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNzE3MDQsImV4cCI6MjA3NDc0NzcwNH0.gQWHv0HxaXvnEnQ5aUnSWH9c_tgLhThIZ2Z2R2zOZyM"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);