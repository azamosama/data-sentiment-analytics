
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBrokerBuddy } from "@/contexts/BrokerBuddyContext";

const CustomRules: React.FC = () => {
  const { customRules, addCustomRule, removeCustomRule } = useBrokerBuddy();
  const [newRule, setNewRule] = useState("");
  
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRule.trim()) {
      addCustomRule(newRule);
      setNewRule("");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Custom Rules & Memory</CardTitle>
        <CardDescription>
          Add specific rules for the AI to follow when matching deals to lenders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddRule} className="flex items-center space-x-2 mb-6">
          <Input
            placeholder="E.g., Don't send deals under 600 FICO to Alpha Funding"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!newRule.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </form>
        
        <div className="space-y-2">
          {customRules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No custom rules yet. Add your first rule above.</p>
            </div>
          ) : (
            customRules.map((rule, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md border bg-card"
              >
                <span>{rule}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomRule(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomRules;
