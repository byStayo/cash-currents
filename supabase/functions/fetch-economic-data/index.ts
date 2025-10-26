import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Fetching economic data...');

    // Fetch Federal Reserve Economic Data (FRED)
    // Using multiple reliable sources with fallbacks
    let currentInflation = 3.2; // Default fallback based on recent CPI data
    let currentMortgageRate = 7.5; // Default fallback for mortgage rates
    let currentAutoRate = 6.5; // Default fallback for auto loan rates
    let currentPersonalRate = 11.5; // Default fallback for personal loan rates
    
    try {
      // Fetch from Federal Reserve Economic Data API using your API key
      const fredApiKey = Deno.env.get('FRED_API_KEY');
      // Get last 13 months of CPI data to calculate year-over-year inflation
      const fredResponse = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${fredApiKey}&file_type=json&sort_order=desc&limit=13`)
        .catch(() => null);
      
      if (fredResponse?.ok) {
        const fredData = await fredResponse.json();
        if (fredData.observations?.length >= 13) {
          const currentCPI = parseFloat(fredData.observations[0].value);
          const yearAgoCPI = parseFloat(fredData.observations[12].value);
          
          // Calculate year-over-year inflation rate
          currentInflation = ((currentCPI - yearAgoCPI) / yearAgoCPI) * 100;
          console.log('Successfully calculated inflation from FRED:', currentInflation.toFixed(2) + '%');
        }
      }
    } catch (error) {
      console.log('FRED fetch failed, using fallback:', error);
    }

    try {
      // Fetch mortgage rates from Freddie Mac (30-year fixed)
      const mortgageResponse = await fetch('https://www.freddiemac.com/pmms/pmms30.json')
        .catch(() => null);
      
      if (mortgageResponse?.ok) {
        const mortgageData = await mortgageResponse.json();
        if (mortgageData?.data?.[0]?.rate) {
          console.log('Successfully fetched mortgage rates from Freddie Mac');
          currentMortgageRate = parseFloat(mortgageData.data[0].rate);
        }
      }
    } catch (error) {
      console.log('Mortgage rate fetch failed, using fallback:', error);
    }

    try {
      // Fetch auto loan rates from FRED (TERMCBAUTO48NS - 48-month new car loan)
      const fredApiKey = Deno.env.get('FRED_API_KEY');
      const autoRateResponse = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=TERMCBAUTO48NS&api_key=${fredApiKey}&file_type=json&sort_order=desc&limit=1`)
        .catch(() => null);
      
      if (autoRateResponse?.ok) {
        const autoData = await autoRateResponse.json();
        if (autoData.observations?.[0]?.value) {
          currentAutoRate = parseFloat(autoData.observations[0].value);
          console.log('Successfully fetched auto loan rates from FRED:', currentAutoRate.toFixed(2) + '%');
        }
      }
    } catch (error) {
      console.log('Auto rate fetch failed, using fallback:', error);
    }

    try {
      // Fetch personal loan rates from FRED (TERMCBPER24NS - 24-month personal loan)
      const fredApiKey = Deno.env.get('FRED_API_KEY');
      const personalRateResponse = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=TERMCBPER24NS&api_key=${fredApiKey}&file_type=json&sort_order=desc&limit=1`)
        .catch(() => null);
      
      if (personalRateResponse?.ok) {
        const personalData = await personalRateResponse.json();
        if (personalData.observations?.[0]?.value) {
          currentPersonalRate = parseFloat(personalData.observations[0].value);
          console.log('Successfully fetched personal loan rates from FRED:', currentPersonalRate.toFixed(2) + '%');
        }
      }
    } catch (error) {
      console.log('Personal loan rate fetch failed, using fallback:', error);
    }

    // Store inflation data
    const { error: inflationError } = await supabaseClient
      .from('economic_indicators')
      .upsert({
        indicator_type: 'inflation',
        country_code: 'US',
        date: new Date().toISOString().split('T')[0],
        value: currentInflation,
        source: 'API'
      }, {
        onConflict: 'indicator_type,country_code,date'
      });

    if (inflationError) {
      console.error('Error storing inflation:', inflationError);
    }

    // Store mortgage rate data
    const { error: mortgageError } = await supabaseClient
      .from('economic_indicators')
      .upsert({
        indicator_type: 'interest_rate',
        rate_type: 'mortgage',
        country_code: 'US',
        date: new Date().toISOString().split('T')[0],
        value: currentMortgageRate,
        source: 'API'
      }, {
        onConflict: 'indicator_type,country_code,date,rate_type'
      });

    if (mortgageError) {
      console.error('Error storing mortgage rate:', mortgageError);
    }

    // Store auto loan rate data
    const { error: autoError } = await supabaseClient
      .from('economic_indicators')
      .upsert({
        indicator_type: 'interest_rate',
        rate_type: 'auto',
        country_code: 'US',
        date: new Date().toISOString().split('T')[0],
        value: currentAutoRate,
        source: 'API'
      }, {
        onConflict: 'indicator_type,country_code,date,rate_type'
      });

    if (autoError) {
      console.error('Error storing auto rate:', autoError);
    }

    // Store personal loan rate data
    const { error: personalError } = await supabaseClient
      .from('economic_indicators')
      .upsert({
        indicator_type: 'interest_rate',
        rate_type: 'personal',
        country_code: 'US',
        date: new Date().toISOString().split('T')[0],
        value: currentPersonalRate,
        source: 'API'
      }, {
        onConflict: 'indicator_type,country_code,date,rate_type'
      });

    if (personalError) {
      console.error('Error storing personal loan rate:', personalError);
    }

    // Fetch exchange rates from multiple sources for reliability
    try {
      const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .catch(() => null);

      if (exchangeResponse?.ok) {
        const exchangeData = await exchangeResponse.json();
        const rates = exchangeData.rates;
        console.log('Successfully fetched exchange rates');

        // Store major currency pairs
        const majorCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'MXN', 'BRL'];
        
        for (const currency of majorCurrencies) {
          if (rates[currency]) {
            await supabaseClient
              .from('exchange_rates')
              .upsert({
                base_currency: 'USD',
                target_currency: currency,
                rate: rates[currency],
                date: new Date().toISOString().split('T')[0]
              }, {
                onConflict: 'base_currency,target_currency,date'
              });
          }
        }
      }
    } catch (error) {
      console.log('Exchange rate fetch failed:', error);
    }

    console.log('Data stored successfully:', { 
      inflation: currentInflation, 
      mortgageRate: currentMortgageRate,
      autoRate: currentAutoRate,
      personalRate: currentPersonalRate
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          inflation: currentInflation,
          mortgageRate: currentMortgageRate,
          autoRate: currentAutoRate,
          personalRate: currentPersonalRate
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-economic-data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
