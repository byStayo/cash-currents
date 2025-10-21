import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, LayoutDashboard, Settings } from "lucide-react";
import { useUserWidgets } from "@/hooks/useUserWidgets";
import { useEconomicData } from "@/hooks/useEconomicData";
import AIAdvisor from "@/components/AIAdvisor";
import { LoanCalculator } from "@/components/LoanCalculator";
import { InvestmentComparison } from "@/components/InvestmentComparison";
import { RiskAssessment } from "@/components/RiskAssessment";
import { CreditScoreImpact } from "@/components/CreditScoreImpact";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const availableWidgets = [
  { key: "ai-advisor", title: "AI Financial Advisor", component: AIAdvisor },
  { key: "loan-calculator", title: "Loan Calculator", component: LoanCalculator },
  { key: "investment-comparison", title: "Investment Comparison", component: InvestmentComparison },
  { key: "risk-assessment", title: "Risk Assessment", component: RiskAssessment },
  { key: "credit-score", title: "Credit Score Impact", component: CreditScoreImpact },
];

const MainDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { widgets, isLoading, addWidget, removeWidget } = useUserWidgets();
  const { data: economicData } = useEconomicData();
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        navigate("/auth");
      }
      setIsCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="h-8 w-8 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const visibleWidgets = widgets?.filter(w => w.is_visible) || [];
  const widgetKeys = new Set(widgets?.map(w => w.widget_key) || []);
  const availableToAdd = availableWidgets.filter(w => !widgetKeys.has(w.key));

  const handleAddWidget = (widgetKey: string) => {
    addWidget(widgetKey);
    setIsAddWidgetOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Your personalized financial tools and insights
          </p>
        </div>
        
        <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Widget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Widget to Dashboard</DialogTitle>
              <DialogDescription>
                Choose a widget to add to your personalized dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              {availableToAdd.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All available widgets have been added to your dashboard
                </p>
              ) : (
                availableToAdd.map((widget) => (
                  <Button
                    key={widget.key}
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => handleAddWidget(widget.key)}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium">{widget.title}</span>
                      <span className="text-xs text-muted-foreground">
                        Click to add this tool to your dashboard
                      </span>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {visibleWidgets.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <LayoutDashboard className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Your Dashboard is Empty</h3>
              <p className="text-muted-foreground mb-4">
                Add widgets to personalize your financial dashboard
              </p>
              <Button onClick={() => setIsAddWidgetOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Widget
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleWidgets.map((widget) => {
            const widgetDef = availableWidgets.find(w => w.key === widget.widget_key);
            if (!widgetDef) return null;

            const WidgetComponent = widgetDef.component;

            return (
              <Card key={widget.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 h-8 w-8 z-10"
                  onClick={() => removeWidget(widget.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <WidgetComponent
                  inflation={economicData?.inflation || 3.2}
                  interestRate={economicData?.interestRate || 7.5}
                  currentInflation={economicData?.inflation || 3.2}
                  currentInterest={economicData?.interestRate || 7.5}
                />
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Use the sidebar to access all available financial tools</p>
          <p>• Add your favorite tools as widgets for quick access</p>
          <p>• Current inflation: {economicData?.inflation.toFixed(2)}% | Interest: {economicData?.interestRate.toFixed(2)}%</p>
          <p>• All your preferences are automatically saved to your profile</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainDashboard;
