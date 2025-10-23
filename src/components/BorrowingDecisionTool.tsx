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
    <div className="w-full max-w-6xl mx-auto space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6 pt-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
          Should I Borrow Money?
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-normal">
          Smart borrowing decisions made simple
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Badge variant="outline" className="gap-2 px-4 py-2 text-sm font-medium border-border/50">
            <div className="h-2 w-2 rounded-full bg-beneficial animate-pulse" />
            Real-time Data
          </Badge>
          <Badge variant="outline" className="gap-2 px-4 py-2 text-sm font-medium border-border/50">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Historical Trends
          </Badge>
          <Badge variant="outline" className="gap-2 px-4 py-2 text-sm font-medium border-border/50">
            <div className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
            Professional Analysis
          </Badge>
        </div>
      </div>

      {/* Main Decision Card */}
      <Card className={`
        p-10 md:p-14 text-center space-y-8 border transition-all duration-700 animate-scale-in
        ${shouldBorrow 
          ? 'bg-[hsl(var(--beneficial-light))] border-[hsl(var(--beneficial-border))]' 
          : 'bg-[hsl(var(--risk-light))] border-[hsl(var(--risk-border))]'
        }
      `}>
        <div className="space-y-8">
          <div className={`
            inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-xl
            transition-all duration-500
            ${shouldBorrow 
              ? 'bg-beneficial/10 text-beneficial border border-beneficial/20' 
              : 'bg-risk/10 text-risk border border-risk/20'
            }
          `}>
            <RecommendationIcon className="h-6 w-6" />
            <span className="text-xl md:text-2xl tracking-tight">
              {recommendation.text}
            </span>
          </div>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {recommendation.explanation}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Inflation</p>
              <p className="text-3xl md:text-4xl font-semibold text-beneficial">
                {inflationRate.toFixed(1)}%
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Rate</p>
              <p className="text-3xl md:text-4xl font-semibold text-primary">
                {loanRate.toFixed(1)}%
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Difference</p>
              <p className={`text-3xl md:text-4xl font-semibold ${difference > 0 ? 'text-risk' : 'text-beneficial'}`}>
                {difference > 0 ? '+' : ''}{difference.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Sliders */}
      <Card className="p-10 md:p-16 shadow-subtle border">
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Try Different Scenarios</h3>
            <p className="text-lg text-muted-foreground font-normal">
              Adjust the rates to see when borrowing makes sense
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Inflation Rate Slider */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-beneficial" />
                  <span className="font-medium text-lg">Inflation Rate</span>
                </div>
                <span className="text-3xl font-semibold text-beneficial tracking-tight">
                  {inflationRate.toFixed(1)}%
                </span>
              </div>
              <Slider
                value={[inflationRate]}
                onValueChange={(value) => setInflationRate(value[0])}
                min={0}
                max={10}
                step={0.1}
                className="w-full py-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground font-medium">
                <span>0% No inflation</span>
                <span>10% High inflation</span>
              </div>
            </div>

            {/* Loan Rate Slider */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium text-lg">Loan Interest Rate</span>
                </div>
                <span className="text-3xl font-semibold text-primary tracking-tight">
                  {loanRate.toFixed(1)}%
                </span>
              </div>
              <Slider
                value={[loanRate]}
                onValueChange={(value) => setLoanRate(value[0])}
                min={0}
                max={15}
                step={0.1}
                className="w-full py-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground font-medium">
                <span>0% Free money</span>
                <span>15% Expensive</span>
              </div>
            </div>
          </div>

          {/* Real-time Impact */}
          <div className="text-center p-8 bg-muted/30 rounded-2xl border">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Real-time Impact</p>
            <p className="text-2xl md:text-3xl font-semibold leading-tight">
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
      <div className="space-y-3">
        <Collapsible open={showHowItWorks} onOpenChange={setShowHowItWorks}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-lg py-7 px-8 hover:bg-muted/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Learn How This Works</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${showHowItWorks ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <Card className="p-8 mt-3 shadow-subtle border">
              <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  When you borrow money, you pay interest. But inflation erodes the value of money over time.
                  If inflation is higher than your loan rate, the money you pay back is worth less than what you borrowed.
                </p>
                <p>
                  <strong className="text-foreground font-semibold">Example:</strong> If you borrow $10,000 at 3% interest when inflation is 5%,
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
              className="w-full justify-between text-lg py-7 px-8 hover:bg-muted/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Historical Trends</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${showHistorical ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <Card className="p-8 mt-3 shadow-subtle border">
              <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
                <p>
                  Historical data shows that there have been periods where inflation exceeded loan rates,
                  making borrowing mathematically advantageous. The 1970s and early 1980s saw high inflation
                  periods where real interest rates were negative.
                </p>
                <p>
                  Current inflation rate: <strong className="text-beneficial font-semibold">{realInflationRate.toFixed(2)}%</strong> (updated daily from Federal Reserve data)
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
              className="w-full justify-between text-lg py-7 px-8 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Professional Analysis</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${showProfessional ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <Card className="p-8 mt-3 bg-primary/5 border-primary/20 shadow-subtle">
              <div className="space-y-5">
                <p className="font-semibold text-foreground text-lg">
                  Current Market Analysis (Based on Real Data):
                </p>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    • <strong className="text-foreground font-semibold">Current Inflation:</strong> {realInflationRate.toFixed(2)}%
                    {realInflationRate > 3 && " (Above Federal Reserve target of 2-3%)"}
                  </p>
                  <p>
                    • <strong className="text-foreground font-semibold">Mortgage Rates:</strong> Currently averaging 6.5-7.5%, meaning 
                    borrowers pay {((6.5 + 7.5) / 2 - realInflationRate).toFixed(1)}% above inflation
                  </p>
                  <p>
                    • <strong className="text-foreground font-semibold">Recommendation:</strong> {shouldBorrow 
                      ? "With rates near or below inflation, strategic borrowing for appreciating assets may be advantageous."
                      : "Current rates exceed inflation. Consider waiting for rate decreases or focus on high-return investments."}
                  </p>
                  <p className="text-sm italic pt-2">
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
