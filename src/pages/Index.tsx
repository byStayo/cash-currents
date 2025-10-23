import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Calculator, Brain, Shield, BarChart3, Zap } from "lucide-react";
import BorrowingDecisionTool from "@/components/BorrowingDecisionTool";
import { useEconomicData } from "@/hooks/useEconomicData";

const Index = () => {
  const { data: economicData, isLoading } = useEconomicData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-subtle to-background">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Cash Currents
            </span>
          </div>
          <div className="flex gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="gap-2">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="gap-2">
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Borrowing Decision Tool */}
      <section className="container mx-auto px-6 py-12 md:py-20">
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading real-time economic data...</p>
          </div>
        ) : (
          <BorrowingDecisionTool realInflationRate={economicData?.inflation || 2.94} />
        )}
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20 border-t">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Advanced Financial Tools & Analysis
          </h2>
          <p className="text-lg text-muted-foreground">
            Access our complete suite of professional-grade financial tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 space-y-4 card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="glass-card p-12 md:p-16 text-center space-y-6 bg-gradient-to-br from-primary/5 via-beneficial/5 to-primary/5 animate-scale-in">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Transform Your Financial Strategy?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users making smarter financial decisions with AI-powered insights
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 text-lg px-8 py-6 animate-glow">
              Start Your Journey
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-semibold">Cash Currents</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Cash Currents. Empowering financial intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: Calculator,
    title: "Advanced Calculators",
    description: "Sophisticated loan, investment, and debt consolidation calculators with real-time scenarios"
  },
  {
    icon: Brain,
    title: "AI Financial Advisor",
    description: "Get personalized financial advice powered by advanced AI models and real economic data"
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    description: "Real-time economic indicators, sector analysis, and market predictions"
  },
  {
    icon: BarChart3,
    title: "Monte Carlo Simulation",
    description: "Run thousands of scenarios to understand potential investment outcomes"
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Comprehensive risk analysis for your financial decisions with actionable insights"
  },
  {
    icon: Zap,
    title: "Live Economic Data",
    description: "Daily updates from Federal Reserve and other trusted sources for accurate analysis"
  }
];

export default Index;
