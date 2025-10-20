import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EconomicData {
  inflation: number;
  interestRate: number;
  lastUpdated: string;
}

export const useEconomicData = () => {
  return useQuery({
    queryKey: ['economic-data'],
    queryFn: async () => {
      // Use yesterday's date since edge function may not have run today yet
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateToQuery = yesterday.toISOString().split('T')[0];
      
      // Fetch inflation data - try today first, then yesterday
      let { data: inflationData, error: inflationError } = await (supabase as any)
        .from('economic_indicators')
        .select('value, created_at')
        .eq('indicator_type', 'inflation')
        .eq('country_code', 'US')
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (inflationError) throw inflationError;

      // Fetch interest rate data - try today first, then yesterday
      let { data: rateData, error: rateError } = await (supabase as any)
        .from('economic_indicators')
        .select('value, created_at')
        .eq('indicator_type', 'interest_rate')
        .eq('country_code', 'US')
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (rateError) throw rateError;

      const inflation = (inflationData as any)?.value || 3.2;
      const interestRate = (rateData as any)?.value || 7.5;
      const lastUpdated = (inflationData as any)?.created_at || new Date().toISOString();

      return {
        inflation,
        interestRate,
        lastUpdated,
      } as EconomicData;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchInterval: 10 * 60 * 1000, // Auto-refetch every 10 minutes
  });
};

export const fetchLiveEconomicData = async () => {
  const { data, error } = await supabase.functions.invoke('fetch-economic-data');
  
  if (error) throw error;
  return data;
};
