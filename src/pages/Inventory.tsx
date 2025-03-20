
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import InventoryStatusCard from "@/components/InventoryStatusCard";
import { getInventoryItems, InventoryItem, getInventoryStatus } from "@/services/dataService";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'warning' | 'normal'>('all');

  useEffect(() => {
    const fetchInventoryItems = async () => {
      setLoading(true);
      try {
        const data = await getInventoryItems();
        setInventoryItems(data);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventoryItems();
  }, []);

  const categories = [...new Set(inventoryItems.map(item => item.category))];

  const filteredItems = inventoryItems.filter(item => {
    if (filter === 'all') return true;
    return getInventoryStatus(item) === filter;
  });

  // Prepare data for the status distribution chart
  const statusCounts = {
    urgent: inventoryItems.filter(item => getInventoryStatus(item) === 'urgent').length,
    warning: inventoryItems.filter(item => getInventoryStatus(item) === 'warning').length,
    normal: inventoryItems.filter(item => getInventoryStatus(item) === 'normal').length
  };

  const statusData = [
    { name: 'Critical', value: statusCounts.urgent, color: '#FF4A3F' },
    { name: 'Warning', value: statusCounts.warning, color: '#FFB23F' },
    { name: 'Normal', value: statusCounts.normal, color: '#3FD7A2' }
  ];

  // Prepare data for category distribution
  const categoryData = categories.map(category => {
    const itemsInCategory = inventoryItems.filter(item => item.category === category);
    const totalValue = itemsInCategory.reduce((sum, item) => sum + (item.currentStock * item.price), 0);
    
    return {
      name: category,
      value: totalValue
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-8 max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-primary/10' : ''}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFilter('urgent')}
              className={filter === 'urgent' ? 'bg-inventory-urgent text-white border-inventory-urgent' : ''}
            >
              Critical ({statusCounts.urgent})
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFilter('warning')}
              className={filter === 'warning' ? 'bg-inventory-warning text-black border-inventory-warning' : ''}
            >
              Warning ({statusCounts.warning})
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFilter('normal')}
              className={filter === 'normal' ? 'bg-inventory-normal text-white border-inventory-normal' : ''}
            >
              Normal ({statusCounts.normal})
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="analysis">Inventory Analysis</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="space-y-8 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <InventoryStatusCard key={item.id} item={item} />
              ))}
            </div>
            
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No inventory items match the selected filter.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-8 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Inventory Status Distribution</CardTitle>
                  <CardDescription>Breakdown of inventory status categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Inventory Value by Category</CardTitle>
                  <CardDescription>Total value of inventory per category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Value']} />
                        <Bar dataKey="value" fill="hsl(var(--primary))">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Inventory Status Summary</CardTitle>
                <CardDescription>
                  {statusCounts.urgent > 0 
                    ? `${statusCounts.urgent} items need immediate attention`
                    : 'No critical inventory items at the moment'}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-inventory-urgent/50 bg-inventory-urgent/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-inventory-urgent">Critical Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{statusCounts.urgent}</div>
                    <p className="text-sm text-muted-foreground">
                      Items below minimum level requiring immediate action
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-inventory-warning/50 bg-inventory-warning/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-inventory-warning">Warning Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{statusCounts.warning}</div>
                    <p className="text-sm text-muted-foreground">
                      Items with low stock that need to be ordered soon
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-inventory-normal/50 bg-inventory-normal/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-inventory-normal">Normal Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{statusCounts.normal}</div>
                    <p className="text-sm text-muted-foreground">
                      Items with adequate stock levels
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Inventory;
