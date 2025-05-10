import logo from @ "src/assets/logo.png";
import { Toaster } from "@/components/ui/sonner";
import { BrokerBuddyProvider } from "@/contexts/BrokerBuddyContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Index";
import MenuAnalytics from "@/pages/MenuAnalytics";
import CustomerService from "@/pages/CustomerService";
import Inventory from "@/pages/Inventory";
import MenuItemDetail from "@/pages/MenuItemDetail";
import Search from "@/pages/Search";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <BrokerBuddyProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/menu" element={<MenuAnalytics />} />
          <Route path="/menu/:id" element={<MenuItemDetail />} />
          <Route path="/service" element={<CustomerService />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/search" element={<Search />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrokerBuddyProvider>
    </BrowserRouter>
  );
}

export default App;

export default function Header() {
  return (
    <header className="flex items-center p-4 shadow-md">
      <img src={logo} alt="Company Logo" className="h-10 w-auto" />
      <h1 className="ml-4 text-xl font-semibold">Chick-In Waffle</h1>
    </header>
  );
}
