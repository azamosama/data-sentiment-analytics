
import React, { useState } from "react";
import { Sun, Moon, Menu, BarChart2, User, Package, MessageSquare, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split('/')[1] || '';
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold cursor-pointer" onClick={() => navigate('/')}>
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>DataSense</span>
          </div>
          
          <div className="mx-4 flex-1 max-w-md">
            <SearchBar 
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm flex items-center gap-2" 
              onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
            />
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>DataSense</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Button
                    variant={path === '' ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => navigate('/')}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant={path === 'menu' ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => navigate('/menu')}
                  >
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Menu Analytics
                  </Button>
                  <Button
                    variant={path === 'service' ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => navigate('/service')}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Customer Service
                  </Button>
                  <Button
                    variant={path === 'inventory' ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => navigate('/inventory')}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Inventory
                  </Button>
                  <Separator />
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    Toggle Theme
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant={path === '' ? "default" : "ghost"}
                onClick={() => navigate('/')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={path === 'menu' ? "default" : "ghost"}
                onClick={() => navigate('/menu')}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Menu
              </Button>
              <Button
                variant={path === 'service' ? "default" : "ghost"} 
                onClick={() => navigate('/service')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Service
              </Button>
              <Button
                variant={path === 'inventory' ? "default" : "ghost"}
                onClick={() => navigate('/inventory')}
              >
                <Package className="mr-2 h-4 w-4" />
                Inventory
              </Button>
            </nav>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="py-3 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} DataSense. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
