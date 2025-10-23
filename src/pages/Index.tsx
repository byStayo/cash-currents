import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Calculator, Brain, Shield, BarChart3, Zap } from "lucide-react";
import BorrowingDecisionTool from "@/components/BorrowingDecisionTool";
import { useEconomicData } from "@/hooks/useEconomicData";

const Index = () => {
  const { data: economicData, isLoading } = useEconomicData();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <TrendingUp className="h-7 w-7 text-primary" strokeWidth={2.5} />
            <span className="text-2xl font-semibold tracking-tight">
              Cash Currents
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" size="lg" className="font-medium">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 font-medium">
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Borrowing Decision Tool */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-6 text-lg text-muted-foreground font-normal">Loading real-time economic data...</p>
          </div>
        ) : (
          <BorrowingDecisionTool realInflationRate={economicData?.inflation || 2.94} />
        )}
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-24 border-t border-border/50">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Advanced Financial Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-normal">
            Professional-grade analysis at your fingertips
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-8 space-y-4 bg-card hover:bg-muted/30 border border-border/50 rounded-2xl transition-all duration-300 hover:shadow-moderate animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="p-16 md:p-20 text-center space-y-8 bg-muted/30 border border-border/50 rounded-3xl animate-scale-in">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Ready to Transform Your<br/>Financial Strategy?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            Join thousands making smarter decisions with AI-powered insights
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 text-lg px-10 py-7 font-medium shadow-lg hover:shadow-xl transition-shadow">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-border/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium">Cash Currents</span>
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
