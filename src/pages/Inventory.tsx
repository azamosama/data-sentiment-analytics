
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import InventoryStatusCard from "@/components/InventoryStatusCard";
import { getInventoryItems, InventoryItem, getInventoryStatus, getShipments, Shipment } from "@/services/dataService";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Box, Check, Clock, PackageCheck, Truck, AlertCircle } from "lucide-react";

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'warning' | 'normal'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'urgent' | 'warning' | 'normal' | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const inventoryData = await getInventoryItems();
        const shipmentsData = await getShipments();
        setInventoryItems(inventoryData);
        setShipments(shipmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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

  // Fixed the toFixed error by properly checking the type
  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return `$${value}`;
  };

  // Function to handle status card clicks
  const handleStatusCardClick = (status: 'urgent' | 'warning' | 'normal') => {
    setSelectedStatus(status);
    setShowStatusDialog(true);
  };

  // Get items by selected status
  const getItemsByStatus = () => {
    if (!selectedStatus) return [];
    return inventoryItems.filter(item => getInventoryStatus(item) === selectedStatus);
  };

  // Get the status display info
  const getStatusDisplayInfo = () => {
    switch (selectedStatus) {
      case 'urgent':
        return {
          title: 'Critical Items',
          description: 'Items requiring immediate attention',
          className: 'text-inventory-urgent',
          icon: <AlertTriangle className="w-5 h-5 text-inventory-urgent" />
        };
      case 'warning':
        return {
          title: 'Warning Items',
          description: 'Items that need to be reordered soon',
          className: 'text-inventory-warning',
          icon: <AlertCircle className="w-5 h-5 text-inventory-warning" />
        };
      case 'normal':
        return {
          title: 'Normal Items',
          description: 'Items with adequate stock levels',
          className: 'text-inventory-normal',
          icon: <Check className="w-5 h-5 text-inventory-normal" />
        };
      default:
        return {
          title: '',
          description: '',
          className: '',
          icon: null
        };
    }
  };

  // Function to get shipment status
  const getShipmentStatus = (shipment: Shipment) => {
    const now = new Date();
    const eta = new Date(shipment.estimatedArrival);
    
    if (shipment.arrived) {
      return 'arrived';
    } else if (eta < now) {
      return 'late';
    } else {
      return 'on-time';
    }
  };

  // Get status display for shipments
  const getShipmentStatusDisplay = (status: string) => {
    switch (status) {
      case 'arrived':
        return {
          label: 'Arrived',
          icon: <PackageCheck className="w-4 h-4 text-green-500" />,
          className: 'text-green-600 bg-green-100 dark:bg-green-900/20'
        };
      case 'late':
        return {
          label: 'Late',
          icon: <Clock className="w-4 h-4 text-red-500" />,
          className: 'text-red-600 bg-red-100 dark:bg-red-900/20'
        };
      case 'on-time':
        return {
          label: 'On Time',
          icon: <Truck className="w-4 h-4 text-blue-500" />,
          className: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
        };
      default:
        return {
          label: 'Unknown',
          icon: null,
          className: 'text-gray-600 bg-gray-100'
        };
    }
  };

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
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
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
                        <Tooltip formatter={(value) => [formatValue(value), 'Value']} />
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
                <Card 
                  className="border-inventory-urgent/50 bg-inventory-urgent/5 cursor-pointer hover:bg-inventory-urgent/10 transition-colors"
                  onClick={() => handleStatusCardClick('urgent')}
                >
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
                
                <Card 
                  className="border-inventory-warning/50 bg-inventory-warning/5 cursor-pointer hover:bg-inventory-warning/10 transition-colors"
                  onClick={() => handleStatusCardClick('warning')}
                >
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
                
                <Card 
                  className="border-inventory-normal/50 bg-inventory-normal/5 cursor-pointer hover:bg-inventory-normal/10 transition-colors"
                  onClick={() => handleStatusCardClick('normal')}
                >
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

          <TabsContent value="shipments" className="space-y-8 mt-0">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Incoming Shipments</CardTitle>
                <CardDescription>
                  {shipments.filter(s => !s.arrived).length} shipments in transit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => {
                      const status = getShipmentStatus(shipment);
                      const statusDisplay = getShipmentStatusDisplay(status);
                      
                      return (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">{shipment.id}</TableCell>
                          <TableCell>{shipment.supplier}</TableCell>
                          <TableCell>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="items">
                                <AccordionTrigger className="text-sm py-2">
                                  {`${shipment.items.length} items`}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-1 text-sm">
                                    {shipment.items.map((item, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <Box className="h-3 w-3" />
                                        <span>{item.name} ({item.quantity} units)</span>
                                      </li>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </TableCell>
                          <TableCell>{new Date(shipment.estimatedArrival).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusDisplay.className}`}>
                              {statusDisplay.icon}
                              <span>{statusDisplay.label}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog for viewing items by status */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getStatusDisplayInfo().icon}
              <span className={getStatusDisplayInfo().className}>{getStatusDisplayInfo().title}</span>
            </DialogTitle>
            <DialogDescription>{getStatusDisplayInfo().description}</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Optimal Stock</TableHead>
                  <TableHead>Last Ordered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getItemsByStatus().map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.currentStock}</TableCell>
                    <TableCell>{item.optimalStock}</TableCell>
                    <TableCell>{new Date(item.lastOrdered).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inventory;
