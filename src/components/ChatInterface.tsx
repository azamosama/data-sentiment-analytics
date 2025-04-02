
import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Trash2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrokerBuddy } from "@/contexts/BrokerBuddyContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import LenderDetails from "@/components/LenderDetails";

const ChatInterface: React.FC = () => {
  const { chat, clearChat, processingDeal, setSelectedLender } = useBrokerBuddy();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  
  if (chat.length === 0 && !processingDeal) {
    return (
      <Card className="w-full h-[600px] flex flex-col justify-center items-center">
        <CardContent className="text-center p-8">
          <h3 className="text-2xl font-semibold mb-4">No Conversations Yet</h3>
          <p className="text-muted-foreground mb-6">
            Submit a deal using the form to get AI-powered funding recommendations
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Funding Recommendations</CardTitle>
        {chat.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] p-4">
          {chat.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === "assistant" ? "pl-2" : "pr-2"
              }`}
            >
              <div
                className={`p-4 rounded-lg ${
                  message.role === "assistant"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.role === "user" && message.deal ? (
                  <>
                    <p className="mb-2 font-medium">
                      Deal Analysis Request for {message.deal.businessName}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <p><span className="font-medium">Industry:</span> {message.deal.industry}</p>
                      <p><span className="font-medium">Revenue:</span> ${message.deal.revenue.toLocaleString()}</p>
                      <p><span className="font-medium">Amount:</span> ${message.deal.requestedAmount.toLocaleString()}</p>
                      <p><span className="font-medium">Time in Business:</span> {message.deal.timeInBusiness} months</p>
                      <p><span className="font-medium">FICO Score:</span> {message.deal.ficoScore}</p>
                      <p><span className="font-medium">NSFs:</span> {message.deal.numNSFs}</p>
                    </div>
                    {message.deal.additionalNotes && (
                      <p className="text-sm"><span className="font-medium">Notes:</span> {message.deal.additionalNotes}</p>
                    )}
                  </>
                ) : (
                  <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
              
              {message.role === "assistant" && message.recommendations && message.recommendations.length > 0 && (
                <div className="mt-3 pl-2">
                  <p className="text-sm font-medium mb-2">Recommended Lenders:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.recommendations.map((lender) => (
                      <Dialog key={lender.id}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={() => setSelectedLender(lender)}
                          >
                            {lender.name}
                            <Badge variant={lender.tier === 1 ? "default" : lender.tier === 2 ? "secondary" : "outline"}>
                              Tier {lender.tier}
                            </Badge>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Lender Details</DialogTitle>
                          </DialogHeader>
                          <LenderDetails />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-1 text-xs text-muted-foreground">
                {format(new Date(message.timestamp), "MMM d, h:mm a")}
              </div>
              
              {message.role === "assistant" && <Separator className="mt-6 mb-6" />}
            </div>
          ))}
          
          {processingDeal && (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 animate-spin mr-2" />
              <p>Analyzing deal and matching lenders...</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
