import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIAdvisorProps {
  inflation: number;
  interestRate: number;
}

const AIAdvisor = ({ inflation, interestRate }: AIAdvisorProps) => {
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getAIAdvice = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-financial-advisor', {
        body: {
          inflation,
          interestRate,
          userContext: "General financial planning and investment advice"
        }
      });

      if (error) throw error;

      if (data.advice) {
        setAdvice(data.advice);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Error getting AI advice:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI advice",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <CardTitle className="flex items-center gap-2">
            AI Financial Advisor
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </CardTitle>
        </div>
        <CardDescription>
          Get personalized insights based on current economic conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!advice && !isLoading && (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Click below to get AI-powered financial advice tailored to current economic conditions
            </p>
          </div>
        )}

        {advice && !isLoading && (
          <Alert className="bg-background/50">
            <AlertDescription className="text-sm leading-relaxed whitespace-pre-wrap">
              {advice}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={getAIAdvice} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Market Conditions...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              {advice ? "Get New Advice" : "Get AI Advice"}
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Powered by Lovable AI • Current Inflation: {inflation}% • Interest Rate: {interestRate}%
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAdvisor;
