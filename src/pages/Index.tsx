import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Calculator, Brain, Shield, BarChart3, Zap } from "lucide-react";

const Index = () => {
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
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4 animate-fade-in">
            <Zap className="h-4 w-4" />
            Real-time Economic Intelligence
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in-up">
            Master Your Financial{" "}
            <span className="bg-gradient-to-r from-primary via-primary-hover to-beneficial bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Advanced financial analysis powered by AI, real-time economic data, and sophisticated modeling tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 animate-glow">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Financial Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need for intelligent financial decision-making
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
