import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserWidget {
  id: string;
  user_id: string;
  widget_key: string;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// Use a session ID stored in localStorage for anonymous users
const getSessionId = () => {
  let sessionId = localStorage.getItem('anonymous_session_id');
  if (!sessionId) {
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('anonymous_session_id', sessionId);
  }
  return sessionId;
};

export const useUserWidgets = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  const { data: widgets, isLoading } = useQuery({
    queryKey: ['user-widgets', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_widgets')
        .select('*')
        .eq('user_id', sessionId)
        .order('position');

      if (error) throw error;
      return data as UserWidget[];
    },
  });

  const addWidget = useMutation({
    mutationFn: async (widgetKey: string) => {
      const maxPosition = widgets?.reduce((max, w) => Math.max(max, w.position), 0) || 0;

      const { data, error } = await supabase
        .from('user_widgets')
        .insert({
          user_id: sessionId,
          widget_key: widgetKey,
          position: maxPosition + 1,
          is_visible: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-widgets', sessionId] });
      toast({
        title: "Widget added",
        description: "Widget has been added to your dashboard",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add widget",
        variant: "destructive",
      });
    },
  });

  const removeWidget = useMutation({
    mutationFn: async (widgetId: string) => {
      const { error } = await supabase
        .from('user_widgets')
        .delete()
        .eq('id', widgetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-widgets', sessionId] });
      toast({
        title: "Widget removed",
        description: "Widget has been removed from your dashboard",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove widget",
        variant: "destructive",
      });
    },
  });

  const toggleWidget = useMutation({
    mutationFn: async ({ widgetId, isVisible }: { widgetId: string; isVisible: boolean }) => {
      const { error } = await supabase
        .from('user_widgets')
        .update({ is_visible: isVisible })
        .eq('id', widgetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-widgets', sessionId] });
    },
  });

  const updatePosition = useMutation({
    mutationFn: async ({ widgetId, position }: { widgetId: string; position: number }) => {
      const { error } = await supabase
        .from('user_widgets')
        .update({ position })
        .eq('id', widgetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-widgets', sessionId] });
    },
  });

  return {
    widgets,
    isLoading,
    addWidget: addWidget.mutate,
    removeWidget: removeWidget.mutate,
    toggleWidget: toggleWidget.mutate,
    updatePosition: updatePosition.mutate,
  };
};
