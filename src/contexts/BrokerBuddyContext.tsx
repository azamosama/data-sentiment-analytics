
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface Lender {
  id: string;
  name: string;
  tier: number;
  minFICO: number;
  maxNSFs: number;
  minRevenue: number;
  maxAmount: number;
  industries: string[];
  notes?: string;
}

export interface Deal {
  businessName: string;
  industry: string;
  revenue: number;
  requestedAmount: number;
  timeInBusiness: number;
  ficoScore: number;
  numNSFs: number;
  additionalNotes?: string;
}

export interface AIResponse {
  id: string;
  response: string;
  recommendations: Lender[];
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  deal?: Deal;
  recommendations?: Lender[];
}

interface BrokerBuddyContextType {
  lenders: Lender[];
  chat: ChatMessage[];
  uploadLenders: (file: File) => Promise<void>;
  processDeal: (deal: Deal) => Promise<void>;
  clearChat: () => void;
  customRules: string[];
  addCustomRule: (rule: string) => void;
  removeCustomRule: (index: number) => void;
  processingDeal: boolean;
  selectedLender: Lender | null;
  setSelectedLender: (lender: Lender | null) => void;
}

const BrokerBuddyContext = createContext<BrokerBuddyContextType | undefined>(undefined);

// Example lenders for initial state
const initialLenders: Lender[] = [
  {
    id: "1",
    name: "Alpha Funding",
    tier: 1,
    minFICO: 680,
    maxNSFs: 0,
    minRevenue: 50000,
    maxAmount: 250000,
    industries: ["Retail", "Restaurants", "Technology", "Healthcare"]
  },
  {
    id: "2",
    name: "Beta Capital",
    tier: 2,
    minFICO: 600,
    maxNSFs: 3,
    minRevenue: 30000,
    maxAmount: 150000,
    industries: ["Construction", "Manufacturing", "Retail", "Services"]
  },
  {
    id: "3",
    name: "Delta Finance",
    tier: 3,
    minFICO: 550,
    maxNSFs: 5,
    minRevenue: 15000,
    maxAmount: 75000,
    industries: ["All"]
  },
  {
    id: "4",
    name: "Omega Partners",
    tier: 1,
    minFICO: 700,
    maxNSFs: 0,
    minRevenue: 100000,
    maxAmount: 500000,
    industries: ["Technology", "Healthcare", "Finance"],
    notes: "Prefers established businesses with strong credit history"
  },
  {
    id: "5",
    name: "Gamma Investments",
    tier: 2,
    minFICO: 620,
    maxNSFs: 2,
    minRevenue: 40000,
    maxAmount: 200000,
    industries: ["Food Services", "Hospitality", "Retail"]
  }
];

export const BrokerBuddyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenders, setLenders] = useState<Lender[]>(initialLenders);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [customRules, setCustomRules] = useState<string[]>([
    "Don't send Bitty deals over $30K",
    "FinAccess prefers healthcare businesses",
    "Avoid high-risk industries for Tier 1 lenders"
  ]);
  const [processingDeal, setProcessingDeal] = useState(false);
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedLenders = localStorage.getItem("brokerBuddy_lenders");
    const savedChat = localStorage.getItem("brokerBuddy_chat");
    const savedRules = localStorage.getItem("brokerBuddy_rules");

    if (savedLenders) setLenders(JSON.parse(savedLenders));
    if (savedChat) setChat(JSON.parse(savedChat));
    if (savedRules) setCustomRules(JSON.parse(savedRules));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("brokerBuddy_lenders", JSON.stringify(lenders));
    localStorage.setItem("brokerBuddy_chat", JSON.stringify(chat));
    localStorage.setItem("brokerBuddy_rules", JSON.stringify(customRules));
  }, [lenders, chat, customRules]);

  const uploadLenders = async (file: File) => {
    try {
      const text = await file.text();
      
      // Basic CSV parsing (could be enhanced with a proper CSV parser library)
      if (file.name.endsWith('.csv')) {
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        
        const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
        const tierIndex = headers.findIndex(h => h.toLowerCase().includes('tier'));
        const ficoIndex = headers.findIndex(h => h.toLowerCase().includes('fico'));
        const nsfIndex = headers.findIndex(h => h.toLowerCase().includes('nsf'));
        const revenueIndex = headers.findIndex(h => h.toLowerCase().includes('revenue'));
        const amountIndex = headers.findIndex(h => h.toLowerCase().includes('amount'));
        const industriesIndex = headers.findIndex(h => h.toLowerCase().includes('industr'));
        const notesIndex = headers.findIndex(h => h.toLowerCase().includes('note'));
        
        const parsedLenders: Lender[] = [];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const columns = rows[i].split(',');
          
          parsedLenders.push({
            id: `imported-${i}`,
            name: nameIndex >= 0 ? columns[nameIndex].trim() : `Lender ${i}`,
            tier: tierIndex >= 0 ? parseInt(columns[tierIndex]) || 3 : 3,
            minFICO: ficoIndex >= 0 ? parseInt(columns[ficoIndex]) || 500 : 500,
            maxNSFs: nsfIndex >= 0 ? parseInt(columns[nsfIndex]) || 10 : 10,
            minRevenue: revenueIndex >= 0 ? parseInt(columns[revenueIndex]) || 10000 : 10000,
            maxAmount: amountIndex >= 0 ? parseInt(columns[amountIndex]) || 100000 : 100000,
            industries: industriesIndex >= 0 ? columns[industriesIndex].split(';').map(i => i.trim()) : ["All"],
            notes: notesIndex >= 0 ? columns[notesIndex] : undefined
          });
        }
        
        setLenders(parsedLenders);
        toast.success(`Imported ${parsedLenders.length} lenders from CSV`);
        return;
      }
      
      // Simple text parsing for .txt files
      if (file.name.endsWith('.txt')) {
        const lenderEntries = text.split('\n\n');
        const parsedLenders: Lender[] = [];
        
        lenderEntries.forEach((entry, index) => {
          const lines = entry.split('\n');
          const lender: Partial<Lender> = { id: `imported-${index}` };
          
          lines.forEach(line => {
            if (line.toLowerCase().includes('name:')) {
              lender.name = line.split(':')[1].trim();
            } else if (line.toLowerCase().includes('tier:')) {
              lender.tier = parseInt(line.split(':')[1].trim());
            } else if (line.toLowerCase().includes('fico:')) {
              lender.minFICO = parseInt(line.split(':')[1].trim());
            } else if (line.toLowerCase().includes('nsf:')) {
              lender.maxNSFs = parseInt(line.split(':')[1].trim());
            } else if (line.toLowerCase().includes('revenue:')) {
              lender.minRevenue = parseInt(line.split(':')[1].trim().replace(/[$,]/g, ''));
            } else if (line.toLowerCase().includes('max amount:')) {
              lender.maxAmount = parseInt(line.split(':')[1].trim().replace(/[$,]/g, ''));
            } else if (line.toLowerCase().includes('industries:')) {
              lender.industries = line.split(':')[1].split(',').map(i => i.trim());
            } else if (line.toLowerCase().includes('notes:')) {
              lender.notes = line.split(':')[1].trim();
            }
          });
          
          if (lender.name) {
            parsedLenders.push({
              id: lender.id || `imported-${index}`,
              name: lender.name,
              tier: lender.tier || 3,
              minFICO: lender.minFICO || 500,
              maxNSFs: lender.maxNSFs || 10,
              minRevenue: lender.minRevenue || 10000,
              maxAmount: lender.maxAmount || 100000,
              industries: lender.industries || ["All"],
              notes: lender.notes
            });
          }
        });
        
        setLenders(parsedLenders);
        toast.success(`Imported ${parsedLenders.length} lenders from text file`);
        return;
      }
      
      toast.error('Unsupported file format. Please upload a .csv or .txt file.');
    } catch (error) {
      console.error('Error uploading lenders:', error);
      toast.error('Failed to process lender file. Please check the file format.');
    }
  };

  const matchLendersForDeal = (deal: Deal) => {
    // Simple lender matching algorithm based on deal parameters
    const matchedLenders = lenders.filter(lender => {
      // Check FICO score
      if (deal.ficoScore < lender.minFICO) return false;
      
      // Check NSFs
      if (deal.numNSFs > lender.maxNSFs) return false;
      
      // Check revenue
      if (deal.revenue < lender.minRevenue) return false;
      
      // Check requested amount
      if (deal.requestedAmount > lender.maxAmount) return false;
      
      // Check industry
      if (!lender.industries.includes("All") && 
          !lender.industries.some(ind => deal.industry.toLowerCase().includes(ind.toLowerCase()))) {
        return false;
      }
      
      // Apply custom rules (rudimentary implementation for demonstration)
      for (const rule of customRules) {
        if (rule.includes(lender.name) && rule.includes("don't send") || rule.includes("avoid")) {
          // Simple rule parsing - in production this would use NLP/LLM
          if (rule.includes("over") && rule.includes("$")) {
            const amountMatch = rule.match(/\$(\d+)K/);
            if (amountMatch && parseInt(amountMatch[1]) * 1000 < deal.requestedAmount) {
              return false;
            }
          }
        }
      }
      
      return true;
    });
    
    // Sort by tier (preferred lenders first)
    return matchedLenders.sort((a, b) => a.tier - b.tier);
  };

  const generateAIResponse = (deal: Deal, matchedLenders: Lender[]): string => {
    if (matchedLenders.length === 0) {
      return `After analyzing ${deal.businessName}, I couldn't find suitable lenders that match the deal parameters. Consider adjusting the requested amount, or check for alternative funding sources for businesses with FICO ${deal.ficoScore} and ${deal.numNSFs} NSFs in the ${deal.industry} industry.`;
    }
    
    const tier1Lenders = matchedLenders.filter(l => l.tier === 1);
    const tier2Lenders = matchedLenders.filter(l => l.tier === 2);
    const tier3Lenders = matchedLenders.filter(l => l.tier === 3);
    
    let response = `Based on my analysis for ${deal.businessName} (${deal.industry}), here are my funding recommendations:\n\n`;
    
    if (tier1Lenders.length > 0) {
      response += `**PRIMARY RECOMMENDATIONS:**\n${tier1Lenders.map(l => `• ${l.name}${l.notes ? ` (${l.notes})` : ''}`).join('\n')}\n\n`;
    }
    
    if (tier2Lenders.length > 0) {
      response += `**SECONDARY OPTIONS:**\n${tier2Lenders.map(l => `• ${l.name}${l.notes ? ` (${l.notes})` : ''}`).join('\n')}\n\n`;
    }
    
    if (tier3Lenders.length > 0) {
      response += `**FALLBACK LENDERS:**\n${tier3Lenders.map(l => `• ${l.name}${l.notes ? ` (${l.notes})` : ''}`).join('\n')}\n\n`;
    }
    
    // Add analysis based on deal parameters
    response += `**DEAL ANALYSIS:**\n`;
    if (deal.ficoScore >= 700) {
      response += `• Strong FICO score (${deal.ficoScore}) is favorable for premium rates\n`;
    } else if (deal.ficoScore >= 600) {
      response += `• Moderate FICO score (${deal.ficoScore}) may impact rates but still qualifies for good options\n`;
    } else {
      response += `• Lower FICO score (${deal.ficoScore}) limits top-tier options but alternative funding is available\n`;
    }
    
    if (deal.numNSFs === 0) {
      response += `• No NSFs is excellent for qualification\n`;
    } else if (deal.numNSFs <= 3) {
      response += `• ${deal.numNSFs} NSFs may affect terms but still within acceptable range for many lenders\n`;
    } else {
      response += `• Higher NSF count (${deal.numNSFs}) restricts options to more flexible lenders\n`;
    }
    
    // Add recommendation next steps
    response += `\n**NEXT STEPS:**\n`;
    response += `1. Submit application to ${matchedLenders[0]?.name || "your selected lender"} as first priority\n`;
    response += `2. Prepare bank statements and proof of revenue ($${deal.revenue.toLocaleString()})\n`;
    response += `3. Be ready to explain any NSFs or credit issues during underwriting\n`;
    
    return response;
  };

  const processDeal = async (deal: Deal) => {
    setProcessingDeal(true);
    
    try {
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: `Analyzing funding options for ${deal.businessName} in the ${deal.industry} industry. Revenue: $${deal.revenue.toLocaleString()}, Requested: $${deal.requestedAmount.toLocaleString()}, FICO: ${deal.ficoScore}, NSFs: ${deal.numNSFs}, Time in Business: ${deal.timeInBusiness} months.${deal.additionalNotes ? ` Additional notes: ${deal.additionalNotes}` : ''}`,
        timestamp: new Date(),
        deal
      };
      
      setChat(prev => [...prev, userMessage]);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Match lenders for the deal
      const matchedLenders = matchLendersForDeal(deal);
      
      // Generate AI response
      const aiResponse = generateAIResponse(deal, matchedLenders);
      
      // Add AI response to chat
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        recommendations: matchedLenders
      };
      
      setChat(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing deal:', error);
      toast.error('Failed to process deal. Please try again.');
    } finally {
      setProcessingDeal(false);
    }
  };

  const clearChat = () => {
    setChat([]);
    toast.success('Chat history cleared');
  };

  const addCustomRule = (rule: string) => {
    if (rule.trim()) {
      setCustomRules(prev => [...prev, rule.trim()]);
      toast.success('New rule added');
    }
  };

  const removeCustomRule = (index: number) => {
    setCustomRules(prev => prev.filter((_, i) => i !== index));
    toast.success('Rule removed');
  };

  return (
    <BrokerBuddyContext.Provider
      value={{
        lenders,
        chat,
        uploadLenders,
        processDeal,
        clearChat,
        customRules,
        addCustomRule,
        removeCustomRule,
        processingDeal,
        selectedLender,
        setSelectedLender
      }}
    >
      {children}
    </BrokerBuddyContext.Provider>
  );
};

export const useBrokerBuddy = () => {
  const context = useContext(BrokerBuddyContext);
  if (context === undefined) {
    throw new Error("useBrokerBuddy must be used within a BrokerBuddyProvider");
  }
  return context;
};
