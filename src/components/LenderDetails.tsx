
import React from "react";
import { Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBrokerBuddy } from "@/contexts/BrokerBuddyContext";
import { toast } from "sonner";

const LenderDetails: React.FC = () => {
  const { selectedLender } = useBrokerBuddy();
  const [copied, setCopied] = React.useState(false);
  
  if (!selectedLender) {
    return <p>No lender selected</p>;
  }
  
  const copyToClipboard = () => {
    const lenderInfo = `
Lender: ${selectedLender.name}
Tier: ${selectedLender.tier}
Min FICO: ${selectedLender.minFICO}
Max NSFs: ${selectedLender.maxNSFs}
Min Revenue: $${selectedLender.minRevenue.toLocaleString()}
Max Amount: $${selectedLender.maxAmount.toLocaleString()}
Industries: ${selectedLender.industries.join(", ")}
${selectedLender.notes ? `Notes: ${selectedLender.notes}` : ""}
    `.trim();
    
    navigator.clipboard.writeText(lenderInfo);
    setCopied(true);
    toast.success("Lender details copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{selectedLender.name}</h3>
        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
          {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-sm text-muted-foreground">Tier</div>
            <div className="text-sm font-medium">{selectedLender.tier}</div>
            
            <div className="text-sm text-muted-foreground">Min FICO</div>
            <div className="text-sm font-medium">{selectedLender.minFICO}</div>
            
            <div className="text-sm text-muted-foreground">Max NSFs</div>
            <div className="text-sm font-medium">{selectedLender.maxNSFs}</div>
            
            <div className="text-sm text-muted-foreground">Min Revenue</div>
            <div className="text-sm font-medium">${selectedLender.minRevenue.toLocaleString()}</div>
            
            <div className="text-sm text-muted-foreground">Max Amount</div>
            <div className="text-sm font-medium">${selectedLender.maxAmount.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Supported Industries</h4>
        <div className="flex flex-wrap gap-2">
          {selectedLender.industries.map((industry) => (
            <div
              key={industry}
              className="px-2 py-1 text-xs rounded-full bg-muted"
            >
              {industry}
            </div>
          ))}
        </div>
      </div>
      
      {selectedLender.notes && (
        <div>
          <h4 className="text-sm font-medium mb-1">Notes</h4>
          <p className="text-sm">{selectedLender.notes}</p>
        </div>
      )}
    </div>
  );
};

export default LenderDetails;
