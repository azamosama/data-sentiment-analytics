
import React, { useState } from "react";
import { Sun, Moon, Menu, Upload, User, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import DealForm from "@/components/DealForm";
import ChatInterface from "@/components/ChatInterface";
import LenderDatabase from "@/components/LenderDatabase";
import CustomRules from "@/components/CustomRules";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MainLayout: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("chat");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Broker Buddy</span>
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
                  <SheetTitle>Broker Buddy</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Button
                    variant={activeTab === "chat" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => handleTabChange("chat")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                  <Button
                    variant={activeTab === "lenders" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => handleTabChange("lenders")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Lenders
                  </Button>
                  <Button
                    variant={activeTab === "rules" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => handleTabChange("rules")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Rules
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
                variant={activeTab === "chat" ? "default" : "ghost"}
                onClick={() => handleTabChange("chat")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
              <Button
                variant={activeTab === "lenders" ? "default" : "ghost"}
                onClick={() => handleTabChange("lenders")}
              >
                <User className="mr-2 h-4 w-4" />
                Lenders
              </Button>
              <Button
                variant={activeTab === "rules" ? "default" : "ghost"}
                onClick={() => handleTabChange("rules")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Rules
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
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="lenders">Lenders</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <DealForm />
              </div>
              <div className="lg:col-span-2">
                <ChatInterface />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="lenders" className="space-y-4">
            <LenderDatabase />
          </TabsContent>
          
          <TabsContent value="rules" className="space-y-4">
            <CustomRules />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="py-3 text-center text-xs text-muted-foreground">
          <p>© 2023 Broker Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
