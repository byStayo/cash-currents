import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Home } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Financial Intelligence Hub</h1>
        </Link>

        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
