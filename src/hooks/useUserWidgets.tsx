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

export const useUserWidgets = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: widgets, isLoading } = useQuery({
    queryKey: ['user-widgets'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_widgets')
        .select('*')
        .eq('user_id', user.id)
        .order('position');

      if (error) throw error;
      return data as UserWidget[];
    },
  });

  const addWidget = useMutation({
    mutationFn: async (widgetKey: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const maxPosition = widgets?.reduce((max, w) => Math.max(max, w.position), 0) || 0;

      const { data, error } = await supabase
        .from('user_widgets')
        .insert({
          user_id: user.id,
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
      queryClient.invalidateQueries({ queryKey: ['user-widgets'] });
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
      queryClient.invalidateQueries({ queryKey: ['user-widgets'] });
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
      queryClient.invalidateQueries({ queryKey: ['user-widgets'] });
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
      queryClient.invalidateQueries({ queryKey: ['user-widgets'] });
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
