-- Drop all RLS policies that require authentication on user_widgets table
DROP POLICY IF EXISTS "Users can view their own widgets" ON public.user_widgets;
DROP POLICY IF EXISTS "Users can insert their own widgets" ON public.user_widgets;
DROP POLICY IF EXISTS "Users can update their own widgets" ON public.user_widgets;
DROP POLICY IF EXISTS "Users can delete their own widgets" ON public.user_widgets;

-- Create public access policies for user_widgets
CREATE POLICY "Anyone can view widgets" ON public.user_widgets FOR SELECT USING (true);
CREATE POLICY "Anyone can insert widgets" ON public.user_widgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update widgets" ON public.user_widgets FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete widgets" ON public.user_widgets FOR DELETE USING (true);

-- Drop all RLS policies that require authentication on user_financial_data table
DROP POLICY IF EXISTS "Users can view their own financial data" ON public.user_financial_data;
DROP POLICY IF EXISTS "Users can insert their own financial data" ON public.user_financial_data;
DROP POLICY IF EXISTS "Users can update their own financial data" ON public.user_financial_data;
DROP POLICY IF EXISTS "Users can delete their own financial data" ON public.user_financial_data;

-- Create public access policies for user_financial_data
CREATE POLICY "Anyone can view financial data" ON public.user_financial_data FOR SELECT USING (true);
CREATE POLICY "Anyone can insert financial data" ON public.user_financial_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update financial data" ON public.user_financial_data FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete financial data" ON public.user_financial_data FOR DELETE USING (true);

-- Drop all RLS policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create public access policies for profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete profiles" ON public.profiles FOR DELETE USING (true);