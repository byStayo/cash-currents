import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, DollarSign } from "lucide-react";

interface InteractiveControlsProps {
  customInflation: number[];
  setCustomInflation: (value: number[]) => void;
  customInterest: number[];
  setCustomInterest: (value: number[]) => void;
  differenceValue: number;
}

export const InteractiveControls = ({
  customInflation,
  setCustomInflation,
  customInterest,
  setCustomInterest,
  differenceValue
}: InteractiveControlsProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Try Different Scenarios</h3>
          <p className="text-sm text-muted-foreground">Adjust the rates to see when borrowing makes sense</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label 
                className="text-base font-medium flex items-center gap-2"
                htmlFor="inflation-slider"
              >
                <TrendingUp className="h-4 w-4 text-beneficial" aria-hidden="true" />
                Inflation Rate
              </label>
              <span 
                className="font-semibold text-beneficial bg-beneficial/10 px-3 py-1 rounded-full"
                aria-live="polite"
              >
                {customInflation[0].toFixed(1)}%
              </span>
            </div>
            <Slider
              id="inflation-slider"
              value={customInflation}
              onValueChange={setCustomInflation}
              min={0}
              max={10}
              step={0.1}
              className="w-full"
              aria-label="Inflation rate slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>No inflation</span>
              <span>High inflation</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label 
                className="text-base font-medium flex items-center gap-2"
                htmlFor="interest-slider"
              >
                <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
                Loan Interest Rate
              </label>
              <span 
                className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full"
                aria-live="polite"
              >
                {customInterest[0].toFixed(1)}%
              </span>
            </div>
            <Slider
              id="interest-slider"
              value={customInterest}
              onValueChange={setCustomInterest}
              min={0}
              max={15}
              step={0.1}
              className="w-full"
              aria-label="Interest rate slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Free money</span>
              <span>Expensive loans</span>
            </div>
          </div>
        </div>
        
        {/* Real-time feedback */}
        <div 
          className="text-center p-4 bg-gradient-to-r from-primary/5 to-beneficial/5 rounded-lg border"
          role="status"
          aria-live="polite"
        >
          <div className="text-sm text-muted-foreground mb-1">Real-time impact:</div>
          <div className="text-lg font-medium">
            {Math.abs(differenceValue) < 0.5 ? (
              "Minimal difference - decision depends on other factors"
            ) : differenceValue < 0 ? (
              `Inflation helps you save ${Math.abs(differenceValue).toFixed(1)}% per year`
            ) : (
              `Borrowing costs you an extra ${differenceValue.toFixed(1)}% per year`
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};