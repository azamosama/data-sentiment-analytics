
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BarChart3,
  PieChart,
  Search,
  ChefHat,
  Package,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  showSearchBar?: boolean;
}

const MainLayout = ({ children, showSearchBar = true }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/" },
    {
      name: "Menu Analytics",
      icon: <ChefHat className="w-5 h-5" />,
      path: "/menu",
    },
    {
      name: "Inventory",
      icon: <Package className="w-5 h-5" />,
      path: "/inventory",
    },
    {
      name: "Customer Service",
      icon: <Users className="w-5 h-5" />,
      path: "/service",
    },
    {
      name: "Search",
      icon: <Search className="w-5 h-5" />,
      path: "/search",
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Link to="/" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">DataSense</span>
        </Link>
        <div className="w-10" />
      </div>

      {/* Sidebar - Mobile (overlay) */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-full max-w-xs bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">DataSense</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                  location.pathname === item.path &&
                    "bg-accent text-foreground font-medium"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-center"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop (fixed) */}
      <aside className="hidden md:flex w-64 flex-col border-r shrink-0">
        <div className="p-6 flex items-center gap-2 border-b">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">DataSense</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                location.pathname === item.path &&
                  "bg-accent text-foreground font-medium"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t mt-auto">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {showSearchBar && (
          <div className="p-4 border-b flex justify-center">
            <SearchBar
              className="max-w-3xl w-full"
              onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
            />
          </div>
        )}
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
