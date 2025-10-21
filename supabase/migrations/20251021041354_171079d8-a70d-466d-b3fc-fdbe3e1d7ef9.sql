-- Create table for user widget preferences
CREATE TABLE public.user_widgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  widget_key TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, widget_key)
);

-- Enable RLS
ALTER TABLE public.user_widgets ENABLE ROW LEVEL SECURITY;

-- Users can view their own widgets
CREATE POLICY "Users can view their own widgets"
ON public.user_widgets
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own widgets
CREATE POLICY "Users can insert their own widgets"
ON public.user_widgets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own widgets
CREATE POLICY "Users can update their own widgets"
ON public.user_widgets
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own widgets
CREATE POLICY "Users can delete their own widgets"
ON public.user_widgets
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_widgets_updated_at
BEFORE UPDATE ON public.user_widgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_user_widgets_user_id ON public.user_widgets(user_id);
CREATE INDEX idx_user_widgets_position ON public.user_widgets(user_id, position);