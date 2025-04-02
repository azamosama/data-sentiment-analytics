
import { Toaster } from "@/components/ui/sonner";
import { BrokerBuddyProvider } from "@/contexts/BrokerBuddyContext";
import MainLayout from "@/components/MainLayout";

function App() {
  return (
    <BrokerBuddyProvider>
      <MainLayout />
      <Toaster position="top-right" />
    </BrokerBuddyProvider>
  );
}

export default App;
