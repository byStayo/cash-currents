import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AnswerCardProps {
  beneficial: boolean;
  inflationRate: number;
  interestRate: number;
  difference: number;
}

export const AnswerCard = ({ beneficial, inflationRate, interestRate, difference }: AnswerCardProps) => {
  return (
    <Card className="text-center p-8 border-2 card-hover">
      <div 
        className={`inline-flex items-center gap-3 px-6 py-4 rounded-full text-lg font-medium mb-4 ${
          beneficial 
            ? 'bg-beneficial/10 text-beneficial border border-beneficial/20' 
            : 'bg-risk/10 text-risk border border-risk/20'
        }`}
        role="alert"
        aria-live="polite"
      >
        {beneficial ? (
          <TrendingUp className="h-6 w-6" aria-hidden="true" />
        ) : (
          <TrendingDown className="h-6 w-6" aria-hidden="true" />
        )}
        <span className="text-2xl font-semibold">
          {beneficial ? "Yes, it makes sense" : "No, wait for better rates"}
        </span>
      </div>
      
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto" id="recommendation-explanation">
        {beneficial 
          ? "Current conditions favor borrowing. Inflation is reducing your debt burden faster than interest accumulates."
          : "Current interest rates are higher than inflation. Your money costs more than the inflation benefit."
        }
      </p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" role="group" aria-label="Financial metrics">
        <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="font-medium">Inflation:</span>
          <span className="font-bold text-beneficial" aria-label={`${inflationRate.toFixed(1)} percent`}>
            {inflationRate.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="font-medium">Your Rate:</span>
          <span className="font-bold text-primary" aria-label={`${interestRate.toFixed(1)} percent`}>
            {interestRate.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="font-medium">Difference:</span>
          <span 
            className={`font-bold ${difference < 0 ? 'text-beneficial' : 'text-risk'}`}
            aria-label={`${Math.abs(difference).toFixed(1)} percent ${difference < 0 ? 'benefit' : 'cost'}`}
          >
            {difference > 0 ? '+' : ''}{difference.toFixed(1)}%
          </span>
        </div>
      </div>
    </Card>
  );
};