import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface BorrowingDecisionToolProps {
  realInflationRate?: number;
}

const BorrowingDecisionTool = ({ realInflationRate = 2.94 }: BorrowingDecisionToolProps) => {
  const [inflationRate, setInflationRate] = useState(realInflationRate);
  const [loanRate, setLoanRate] = useState(5.8);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showHistorical, setShowHistorical] = useState(false);
  const [showProfessional, setShowProfessional] = useState(false);

  useEffect(() => {
    setInflationRate(realInflationRate);
  }, [realInflationRate]);

  const difference = loanRate - inflationRate;
  const shouldBorrow = difference <= 0;

  const getRecommendation = () => {
    if (shouldBorrow) {
      return {
        text: "Yes, consider borrowing now",
        color: "text-beneficial",
        bg: "bg-beneficial/10",
        border: "border-beneficial/20",
        icon: TrendingUp,
        explanation: "Current interest rates are lower than or equal to inflation. Your borrowed money effectively costs less than the inflation benefit."
      };
    } else {
      return {
        text: "No, wait for better rates",
        color: "text-risk",
        bg: "bg-risk/10",
        border: "border-risk/20",
        icon: TrendingDown,
        explanation: "Current interest rates are higher than inflation. Your money costs more than the inflation benefit."
      };
    }
  };

  const recommendation = getRecommendation();
  const RecommendationIcon = recommendation.icon;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          Should I Borrow Money?
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Smart borrowing decisions made simple
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge variant="outline" className="gap-1.5">
            <div className="h-2 w-2 rounded-full bg-beneficial animate-pulse" />
            Real-time
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Historical
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <div className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
            Professional
          </Badge>
        </div>
      </div>

      {/* Main Decision Card */}
      <Card className={`p-8 md:p-12 ${recommendation.bg} ${recommendation.border} border-2 transition-all duration-500`}>
        <div className="text-center space-y-6">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${recommendation.bg} border-2 ${recommendation.border}`}>
            <RecommendationIcon className={`h-6 w-6 ${recommendation.color}`} />
            <span className={`text-xl md:text-2xl font-bold ${recommendation.color}`}>
              {recommendation.text}
            </span>
          </div>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {recommendation.explanation}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Inflation:</p>
              <p className="text-2xl md:text-3xl font-bold text-beneficial">
                {inflationRate.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Your Rate:</p>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                {loanRate.toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Difference:</p>
              <p className={`text-2xl md:text-3xl font-bold ${difference > 0 ? 'text-risk' : 'text-beneficial'}`}>
                {difference > 0 ? '+' : ''}{difference.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Sliders */}
      <Card className="p-8 md:p-12">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-xl md:text-2xl font-bold">Try Different Scenarios</h3>
            <p className="text-muted-foreground">
              Adjust the rates to see when borrowing makes sense
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Inflation Rate Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-beneficial" />
                  <span className="font-semibold">Inflation Rate</span>
                </div>
                <span className="text-2xl font-bold text-beneficial">
                  {inflationRate.toFixed(1)}%
                </span>
              </div>
              <Slider
                value={[inflationRate]}
                onValueChange={(value) => setInflationRate(value[0])}
                min={0}
                max={10}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>No inflation</span>
                <span>High inflation</span>
              </div>
            </div>

            {/* Loan Rate Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Loan Interest Rate</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {loanRate.toFixed(1)}%
                </span>
              </div>
              <Slider
                value={[loanRate]}
                onValueChange={(value) => setLoanRate(value[0])}
                min={0}
                max={15}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Free money</span>
                <span>Expensive loans</span>
              </div>
            </div>
          </div>

          {/* Real-time Impact */}
          <div className="text-center p-6 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground mb-2">Real-time impact:</p>
            <p className="text-xl md:text-2xl font-bold">
              Borrowing costs you an {difference > 0 ? 'extra' : ''}{' '}
              <span className={difference > 0 ? 'text-risk' : 'text-beneficial'}>
                {Math.abs(difference).toFixed(1)}%
              </span>
              {' per year'}
              {difference <= 0 && ' (You benefit!)'}
            </p>
          </div>
        </div>
      </Card>

      {/* Collapsible Sections */}
      <div className="space-y-4">
        <Collapsible open={showHowItWorks} onOpenChange={setShowHowItWorks}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-lg py-6"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Learn How This Works
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${showHowItWorks ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="p-6 mt-2">
              <div className="space-y-4 text-muted-foreground">
                <p>
                  When you borrow money, you pay interest. But inflation erodes the value of money over time.
                  If inflation is higher than your loan rate, the money you pay back is worth less than what you borrowed.
                </p>
                <p>
                  <strong className="text-foreground">Example:</strong> If you borrow $10,000 at 3% interest when inflation is 5%,
                  you're effectively paying back money that's worth 2% less than what you borrowed. This is called "real" borrowing cost.
                </p>
                <p>
                  The tool above compares current inflation rates with typical loan rates to help you understand
                  when borrowing makes financial sense from a pure mathematics perspective.
                </p>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={showHistorical} onOpenChange={setShowHistorical}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-lg py-6"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Historical Trends
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${showHistorical ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="p-6 mt-2">
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Historical data shows that there have been periods where inflation exceeded loan rates,
                  making borrowing mathematically advantageous. The 1970s and early 1980s saw high inflation
                  periods where real interest rates were negative.
                </p>
                <p>
                  Current inflation rate: <strong className="text-beneficial">{realInflationRate.toFixed(2)}%</strong> (updated daily from Federal Reserve data)
                </p>
                <p>
                  Average mortgage rate range: 6-8% | Average auto loan: 5-7% | Average personal loan: 10-12%
                </p>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={showProfessional} onOpenChange={setShowProfessional}>
          <CollapsibleTrigger asChild>
            <Button
              variant="default"
              className="w-full justify-between text-lg py-6"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Professional Analysis
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${showProfessional ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="p-6 mt-2 bg-primary/5 border-primary/20">
              <div className="space-y-4">
                <p className="font-semibold text-foreground">
                  Current Market Analysis (Based on Real Data):
                </p>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    • <strong className="text-foreground">Current Inflation:</strong> {realInflationRate.toFixed(2)}%
                    {realInflationRate > 3 && " (Above Federal Reserve target of 2-3%)"}
                  </p>
                  <p>
                    • <strong className="text-foreground">Mortgage Rates:</strong> Currently averaging 6.5-7.5%, meaning 
                    borrowers pay {((6.5 + 7.5) / 2 - realInflationRate).toFixed(1)}% above inflation
                  </p>
                  <p>
                    • <strong className="text-foreground">Recommendation:</strong> {shouldBorrow 
                      ? "With rates near or below inflation, strategic borrowing for appreciating assets may be advantageous."
                      : "Current rates exceed inflation. Consider waiting for rate decreases or focus on high-return investments."}
                  </p>
                  <p className="text-sm italic">
                    Note: This analysis is for educational purposes. Always consult with a financial advisor
                    for personalized advice considering your complete financial situation.
                  </p>
                </div>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default BorrowingDecisionTool;
