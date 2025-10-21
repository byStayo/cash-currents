import { NavLink, useLocation } from "react-router-dom";
import {
  Calculator,
  TrendingUp,
  Shield,
  Receipt,
  CreditCard,
  Coins,
  Target,
  Activity,
  BarChart3,
  Globe,
  PieChart,
  FileText,
  Home,
  Brain,
  Sparkles,
  LayoutDashboard
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const tools = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, category: "Main" },
  { title: "AI Advisor", url: "/tools/ai-advisor", icon: Brain, category: "Main" },
  { title: "Loan Calculator", url: "/tools/loan-calculator", icon: Calculator, category: "Calculators" },
  { title: "Investment Comparison", url: "/tools/investment-comparison", icon: TrendingUp, category: "Calculators" },
  { title: "Debt Consolidation", url: "/tools/debt-consolidation", icon: Coins, category: "Calculators" },
  { title: "Risk Assessment", url: "/tools/risk-assessment", icon: Shield, category: "Analysis" },
  { title: "Credit Score Impact", url: "/tools/credit-score", icon: CreditCard, category: "Analysis" },
  { title: "Tax Implications", url: "/tools/tax-implications", icon: Receipt, category: "Analysis" },
  { title: "Rate Predictor", url: "/tools/rate-predictor", icon: Target, category: "Advanced" },
  { title: "Monte Carlo Simulation", url: "/tools/monte-carlo", icon: Activity, category: "Advanced" },
  { title: "Scenario Comparison", url: "/tools/scenario-comparison", icon: BarChart3, category: "Advanced" },
  { title: "Market Indicators", url: "/tools/market-indicators", icon: PieChart, category: "Advanced" },
  { title: "Currency Exchange", url: "/tools/currency-exchange", icon: Globe, category: "Advanced" },
  { title: "Loan Approval Tool", url: "/tools/loan-approval", icon: FileText, category: "Tools" },
  { title: "Investment Arbitrage", url: "/tools/investment-arbitrage", icon: Sparkles, category: "Tools" },
];

const categories = ["Main", "Calculators", "Analysis", "Advanced", "Tools"];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <div className="p-4 border-b">
          {open && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="font-bold text-lg">Financial Hub</h2>
            </div>
          )}
          {!open && (
            <div className="flex justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>

        {categories.map((category) => (
          <SidebarGroup key={category}>
            {open && <SidebarGroupLabel>{category}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {tools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <SidebarMenuItem key={tool.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(tool.url)}
                        tooltip={tool.title}
                      >
                        <NavLink to={tool.url} className="flex items-center gap-3">
                          <tool.icon className="h-4 w-4" />
                          <span>{tool.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
