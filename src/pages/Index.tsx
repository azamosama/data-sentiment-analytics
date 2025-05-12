import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import KpiCard from "@/components/KpiCard";
import MenuItemCard from "@/components/MenuItemCard";
import InventoryStatusCard from "@/components/InventoryStatusCard";
import { 
  BarChart,
  BarChart3,
  Users,
  TrendingUp,
  Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  getKpiData, 
  getMenuItems, 
  getInventoryItems,
  getCustomerServiceData,
  MenuItem,
  InventoryItem,
  KpiData,
  getInventoryStatus
} from "@/services/dataService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartBarChart,
  Bar
} from "recharts";
import { Helmet } from "react-helmet-async";

const Dashboard = () => {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [topMenuItems, setTopMenuItems] = useState<MenuItem[]>([]);
  const [urgentInventory, setUrgentInventory] = useState<InventoryItem[]>([]);
  const [csData, setCsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const kpiData = await getKpiData();
        const menuItems = await getMenuItems();
        const inventoryItems = await getInventoryItems();
        const customerServiceData = await getCustomerServiceData();
        
        // Sort menu items by sales and get top 3
        const sortedMenuItems = [...menuItems].sort((a, b) => b.sales - a.sales);
        
        // Get urgent inventory items
        const urgentItems = inventoryItems.filter(item => 
          getInventoryStatus(item) === 'urgent' || getInventoryStatus(item) === 'warning'
        ).slice(0, 3);
        
        setKpiData(kpiData);
        setTopMenuItems(sortedMenuItems.slice(0, 3));
        setUrgentInventory(urgentItems);
        setCsData(customerServiceData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (value: number | string) => {
    return `$${Number(value).toLocaleString('en-US')}`;
  };
  
  // Format percentage
  const formatPercentage = (value: number | string) => {
    return `${value}%`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse space-y-6 w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              ))}
            </div>
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Flavor Pulse</title>
      </Helmet>
      <MainLayout>
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData && (
              <>
                <KpiCard
                  title="Revenue"
                  value={kpiData.revenue.value}
                  change={kpiData.revenue.change}
                  icon={<BarChart3 className="w-full h-full" />}
                  format={formatCurrency}
                />
                <KpiCard
                  title="Customer Satisfaction"
                  value={kpiData.customerSatisfaction.value}
                  change={kpiData.customerSatisfaction.change}
                  icon={<Users className="w-full h-full" />}
                  format={formatPercentage}
                />
                <KpiCard
                  title="Employee Productivity"
                  value={kpiData.employeeProductivity.value}
                  change={kpiData.employeeProductivity.change}
                  icon={<TrendingUp className="w-full h-full" />}
                  format={formatPercentage}
                />
                <KpiCard
                  title="Inventory Health"
                  value={kpiData.inventoryHealth.value}
                  change={kpiData.inventoryHealth.change}
                  icon={<Package className="w-full h-full" />}
                  format={formatPercentage}
                />
              </>
            )}
          </div>
          
          {/* Main Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Customer Service Performance</CardTitle>
              <CardDescription>Hourly satisfaction scores throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {csData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={csData.metricsByHour}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="hour" 
                        tickFormatter={(hour) => `${hour}:00`}
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        domain={[75, 100]} 
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Satisfaction']}
                        labelFormatter={(hour) => `${hour}:00`}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Three column layout for additional info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Performing Menu Items */}
            <Card className="glass-card md:col-span-1">
              <CardHeader>
                <CardTitle>Top Menu Items</CardTitle>
                <CardDescription>Best performing items by sales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topMenuItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors"
                    onClick={() => navigate(`/menu/${item.id}`)}
                  >
                    <div className="font-bold text-muted-foreground">{index + 1}</div>
                    <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{Math.round(item.sentiment.overall * 100)}% sentiment</p>
                    </div>
                  </div>
                ))}
                <button 
                  className="w-full mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  onClick={() => navigate('/menu')}
                >
                  View all menu items →
                </button>
              </CardContent>
            </Card>
            
            {/* Customer Service Improvement Areas */}
            <Card className="glass-card md:col-span-1">
              <CardHeader>
                <CardTitle>Service Improvement</CardTitle>
                <CardDescription>Areas that need attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {csData && csData.improvementAreas.map((area: any) => (
                  <div key={area.area} className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{area.area}</p>
                      <p className="text-sm font-medium">{area.score}%</p>
                    </div>
                    <Progress value={area.score} className="h-2" />
                  </div>
                ))}
                
                <div className="pt-4">
                  <h4 className="text-sm font-semibold mb-3">Top Performers</h4>
                  {csData && csData.topPerformers.map((person: any, index: number) => (
                    <div key={person.name} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium mr-3">
                          {person.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <span className="text-sm">{person.name}</span>
                      </div>
                      <span className="text-sm font-medium">{person.score}%</span>
                    </div>
                  ))}
                  
                  <button 
                    className="w-full mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
                    onClick={() => navigate('/service')}
                  >
                    View full report →
                  </button>
                </div>
              </CardContent>
            </Card>
            
            {/* Inventory Alerts */}
            <Card className="glass-card md:col-span-1">
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Items needing attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {urgentInventory.length > 0 ? (
                  <>
                    {urgentInventory.map((item) => (
                      <div 
                        key={item.id}
                        className="p-3 rounded-lg border border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/20 space-y-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => navigate('/inventory')}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{item.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            getInventoryStatus(item) === 'urgent' 
                              ? 'bg-inventory-urgent text-white' 
                              : 'bg-inventory-warning text-black'
                          }`}>
                            {getInventoryStatus(item) === 'urgent' ? 'Critical' : 'Low'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.category}</span>
                          <span>{item.currentStock} / {item.minRequired} units</span>
                        </div>
                        <Progress 
                          value={(item.currentStock / item.minRequired) * 100} 
                          className={getInventoryStatus(item) === 'urgent' ? 'bg-red-200' : 'bg-amber-200'} 
                        />
                      </div>
                    ))}
                    <button 
                      className="w-full mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      onClick={() => navigate('/inventory')}
                    >
                      Manage inventory →
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Package className="w-10 h-10 text-green-500 mb-2" />
                    <p className="text-muted-foreground">All inventory levels are currently adequate</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
