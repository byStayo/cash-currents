import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Calculator, Brain, Shield, BarChart3, Zap } from "lucide-react";
import BorrowingDecisionTool from "@/components/BorrowingDecisionTool";
import { useEconomicData } from "@/hooks/useEconomicData";
const Index = () => {
  const {
    data: economicData,
    isLoading
  } = useEconomicData();
  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <TrendingUp className="h-7 w-7 text-primary" strokeWidth={2.5} />
            <span className="text-2xl font-semibold tracking-tight">
              Cash Currents
            </span>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 font-medium">
              Launch App
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Economic Indicators Banner */}
      {!isLoading && economicData && <section className="container mx-auto px-6 py-8 md:py-12">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">Current Inflation Rate</p>
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-4xl md:text-5xl font-bold text-primary">
                  {economicData.inflation.toFixed(2)}%
                </span>
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">Mortgage Rate</p>
              <div className="text-3xl md:text-4xl font-semibold">
                {economicData.mortgageRate.toFixed(2)}%
              </div>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">Auto Loan Rate</p>
              <div className="text-3xl md:text-4xl font-semibold">
                {economicData.autoRate.toFixed(2)}%
              </div>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">Personal Loan Rate</p>
              <div className="text-3xl md:text-4xl font-semibold">
                {economicData.personalRate.toFixed(2)}%
              </div>
            </div>
          </div>
        </section>}

      {/* Main Borrowing Decision Tool */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        {isLoading ? <div className="text-center py-20">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-6 text-lg text-muted-foreground font-normal">Loading real-time economic data...</p>
          </div> : <BorrowingDecisionTool realInflationRate={economicData?.inflation} realMortgageRate={economicData?.mortgageRate} realAutoRate={economicData?.autoRate} realPersonalRate={economicData?.personalRate} />}
      </section>

      {/* CTA After Tool Interaction */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center space-y-6 p-12 md:p-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 rounded-3xl animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Ready to Explore More Tools?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access advanced calculators, AI advisors, and comprehensive market analysis
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 text-lg px-10 font-medium shadow-lg hover:shadow-xl transition-all">
              Launch Full Dashboard
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-32 border-t border-border/50">
        <div className="text-center mb-24 space-y-5">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Professional-Grade Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for intelligent financial decisions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <div key={feature.title} className="group p-10 space-y-5 bg-card border border-border/50 rounded-3xl transition-all duration-300 hover:border-border hover:shadow-lg animate-fade-in-up" style={{
          animationDelay: `${index * 0.05}s`
        }}>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="relative p-20 md:p-24 text-center space-y-8 bg-muted/20 border border-border/50 rounded-[2rem] overflow-hidden animate-scale-in">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
          
          <div className="relative z-10 space-y-8 py-px">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
              Ready to Make Smarter<br />Financial Decisions?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed py-[10px]">Join thousands using real-time data and AI-powered insights

          </p>
            <Link to="/dashboard" className="py-[12px]">
              <Button size="lg" className="gap-2 text-lg px-12 font-medium h-auto rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 py-[38px] mx-px my-[34px]">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
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
    </div>;
};
const features = [{
  icon: Calculator,
  title: "Advanced Calculators",
  description: "Sophisticated loan, investment, and debt consolidation calculators with real-time scenarios"
}, {
  icon: Brain,
  title: "AI Financial Advisor",
  description: "Get personalized financial advice powered by advanced AI models and real economic data"
}, {
  icon: TrendingUp,
  title: "Market Analysis",
  description: "Real-time economic indicators, sector analysis, and market predictions"
}, {
  icon: BarChart3,
  title: "Monte Carlo Simulation",
  description: "Run thousands of scenarios to understand potential investment outcomes"
}, {
  icon: Shield,
  title: "Risk Assessment",
  description: "Comprehensive risk analysis for your financial decisions with actionable insights"
}, {
  icon: Zap,
  title: "Live Economic Data",
  description: "Daily updates from Federal Reserve and other trusted sources for accurate analysis"
}];
export default Index;