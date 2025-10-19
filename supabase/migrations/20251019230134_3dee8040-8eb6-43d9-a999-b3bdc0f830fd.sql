-- Create economic_indicators table for storing inflation and interest rate data
CREATE TABLE IF NOT EXISTS public.economic_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  indicator_type TEXT NOT NULL,
  country_code TEXT NOT NULL,
  date DATE NOT NULL,
  value DECIMAL(10, 4) NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_indicator_per_date UNIQUE(indicator_type, country_code, date)
);

-- Create exchange_rates table for currency data
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  rate DECIMAL(18, 8) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_rate_per_date UNIQUE(base_currency, target_currency, date)
);

-- Enable Row Level Security
ALTER TABLE public.economic_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to economic data
CREATE POLICY "Economic indicators are viewable by everyone"
  ON public.economic_indicators
  FOR SELECT
  USING (true);

CREATE POLICY "Exchange rates are viewable by everyone"
  ON public.exchange_rates
  FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_economic_indicators_type_date 
  ON public.economic_indicators(indicator_type, country_code, date DESC);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies_date 
  ON public.exchange_rates(base_currency, target_currency, date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for economic_indicators
CREATE TRIGGER update_economic_indicators_updated_at
  BEFORE UPDATE ON public.economic_indicators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();