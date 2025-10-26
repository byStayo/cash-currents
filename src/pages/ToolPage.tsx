import { useParams, useNavigate } from "react-router-dom";
import { useEconomicData } from "@/hooks/useEconomicData";
import { useUserWidgets } from "@/hooks/useUserWidgets";
import { Button } from "@/components/ui/button";
import { Plus, Check, ArrowLeft } from "lucide-react";
import AIAdvisor from "@/components/AIAdvisor";
import { LoanCalculator } from "@/components/LoanCalculator";
import { InvestmentComparison } from "@/components/InvestmentComparison";
import { RiskAssessment } from "@/components/RiskAssessment";
import { TaxImplications } from "@/components/TaxImplications";
import { CreditScoreImpact } from "@/components/CreditScoreImpact";
import MonteCarloSimulation from "@/components/MonteCarloSimulation";
import ScenarioComparison from "@/components/ScenarioComparison";
import { RatePredictor } from "@/components/RatePredictor";
import { DebtConsolidation } from "@/components/DebtConsolidation";
import AdvancedMarketIndicators from "@/components/AdvancedMarketIndicators";
import CurrencyExchange from "@/components/CurrencyExchange";
import { LoanApprovalTool } from "@/components/LoanApprovalTool";
import { InvestmentArbitrageAnalyzer } from "@/components/InvestmentArbitrageAnalyzer";

const toolComponents: Record<string, any> = {
  "ai-advisor": AIAdvisor,
  "loan-calculator": LoanCalculator,
  "investment-comparison": InvestmentComparison,
  "risk-assessment": RiskAssessment,
  "tax-implications": TaxImplications,
  "credit-score": CreditScoreImpact,
  "monte-carlo": MonteCarloSimulation,
  "scenario-comparison": ScenarioComparison,
  "rate-predictor": RatePredictor,
  "debt-consolidation": DebtConsolidation,
  "market-indicators": AdvancedMarketIndicators,
  "currency-exchange": CurrencyExchange,
  "loan-approval": LoanApprovalTool,
  "investment-arbitrage": InvestmentArbitrageAnalyzer,
};

const toolTitles: Record<string, string> = {
  "ai-advisor": "AI Financial Advisor",
  "loan-calculator": "Loan Calculator",
  "investment-comparison": "Investment Comparison",
  "risk-assessment": "Risk Assessment",
  "tax-implications": "Tax Implications",
  "credit-score": "Credit Score Impact",
  "monte-carlo": "Monte Carlo Simulation",
  "scenario-comparison": "Scenario Comparison",
  "rate-predictor": "Rate Predictor",
  "debt-consolidation": "Debt Consolidation",
  "market-indicators": "Market Indicators",
  "currency-exchange": "Currency Exchange",
  "loan-approval": "Loan Approval Tool",
  "investment-arbitrage": "Investment Arbitrage Analyzer",
};

const ToolPage = () => {
  const { toolName } = useParams();
  const navigate = useNavigate();
  const { data: economicData } = useEconomicData();
  const { widgets, addWidget } = useUserWidgets();

  if (!toolName || !toolComponents[toolName]) {
    return null;
  }

  const ToolComponent = toolComponents[toolName];
  const toolTitle = toolTitles[toolName];
  const isWidgetAdded = widgets?.some(w => w.widget_key === toolName);

  const widgetableTools = [
    "ai-advisor",
    "loan-calculator",
    "investment-comparison",
    "risk-assessment",
    "credit-score"
  ];
  const canAddAsWidget = widgetableTools.includes(toolName);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{toolTitle}</h1>
            <p className="text-muted-foreground">
              Current Inflation: {(economicData?.inflation || 3.2).toFixed(2)}% | Mortgage Rate: {(economicData?.mortgageRate || 7.5).toFixed(2)}%
            </p>
          </div>
        </div>

        {canAddAsWidget && (
          <Button
            onClick={() => !isWidgetAdded && addWidget(toolName)}
            disabled={isWidgetAdded}
            variant={isWidgetAdded ? "outline" : "default"}
            className="gap-2"
          >
            {isWidgetAdded ? (
              <>
                <Check className="h-4 w-4" />
                Added to Dashboard
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Dashboard
              </>
            )}
          </Button>
        )}
      </div>

      <div className="max-w-5xl">
        <ToolComponent
          currentInflation={economicData?.inflation || 3.2}
          currentInterest={economicData?.mortgageRate || 7.5}
          baseInflation={economicData?.inflation || 3.2}
          baseInterest={economicData?.mortgageRate || 7.5}
        />
      </div>
    </div>
  );
};

export default ToolPage;
