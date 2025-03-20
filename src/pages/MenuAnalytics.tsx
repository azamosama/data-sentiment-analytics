
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import MenuItemCard from "@/components/MenuItemCard";
import { getMenuItems, MenuItem } from "@/services/dataService";
import { useNavigate } from "react-router-dom";
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  BarChart3,
  Filter,
  TrendingUp
} from "lucide-react";

const MenuAnalytics = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<'sales' | 'sentiment' | 'rating'>('sales');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const data = await getMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  const categories = [...new Set(menuItems.map(item => item.category))];

  const toggleSort = (key: 'sales' | 'sentiment' | 'rating') => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedMenuItems = [...menuItems].sort((a, b) => {
    let valueA, valueB;
    
    if (sortKey === 'sentiment') {
      valueA = a.sentiment.overall;
      valueB = b.sentiment.overall;
    } else {
      valueA = a[sortKey];
      valueB = b[sortKey];
    }
    
    return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
  });

  const filteredMenuItems = filter 
    ? sortedMenuItems.filter(item => item.category === filter)
    : sortedMenuItems;

  // Prepare data for category performance chart
  const categoryPerformance = categories.map(category => {
    const categoryItems = menuItems.filter(item => item.category === category);
    const totalSales = categoryItems.reduce((sum, item) => sum + item.sales, 0);
    const averageSentiment = categoryItems.reduce((sum, item) => sum + item.sentiment.overall, 0) / categoryItems.length;
    
    return {
      category,
      sales: totalSales,
      sentiment: Number((averageSentiment * 100).toFixed(1))
    };
  });

  // Prepare data for age group chart
  const ageGroups = ['Gen Z', 'Millennials', 'Gen X', 'Boomers'];
  const ageGroupData = ageGroups.map(group => {
    const averageSentiment = menuItems.reduce((sum, item) => {
      return sum + item.sentiment.byAgeGroup[group as keyof typeof item.sentiment.byAgeGroup];
    }, 0) / menuItems.length;
    
    return {
      name: group,
      sentiment: Number((averageSentiment * 100).toFixed(1))
    };
  });

  // Sales distribution for pie chart
  const salesData = categories.map(category => {
    const totalSales = menuItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.sales, 0);
    
    return {
      name: category,
      value: totalSales
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

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
          <h1 className="text-3xl font-bold tracking-tight">Menu Analytics</h1>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFilter(null)}
              className={!filter ? 'bg-primary/10' : ''}
            >
              All
            </Button>
            
            {categories.map(category => (
              <Button 
                key={category}
                variant="outline"
                size="sm"
                onClick={() => setFilter(category)}
                className={filter === category ? 'bg-primary/10' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="charts">Performance Charts</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSort('sales')}
                className={sortKey === 'sales' ? 'bg-primary/10' : ''}
              >
                Sales {sortKey === 'sales' && (sortDirection === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSort('sentiment')}
                className={sortKey === 'sentiment' ? 'bg-primary/10' : ''}
              >
                Sentiment {sortKey === 'sentiment' && (sortDirection === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSort('rating')}
                className={sortKey === 'rating' ? 'bg-primary/10' : ''}
              >
                Rating {sortKey === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
              </Button>
            </div>
          </div>
          
          <TabsContent value="grid" className="space-y-8 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => navigate(`/menu/${item.id}`)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-8 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>Sales and customer sentiment by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryPerformance}
                        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="category" />
                        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="sales" name="Sales Volume" fill="hsl(var(--primary))" />
                        <Bar yAxisId="right" dataKey="sentiment" name="Sentiment %" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Sales Distribution</CardTitle>
                  <CardDescription>Sales percentage by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {salesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} sales`, 'Volume']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-8 mt-0">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Sentiment by Demographics</CardTitle>
                <CardDescription>How different age groups respond to menu items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageGroupData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Sentiment Score']} />
                      <Bar dataKey="sentiment" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMenuItems
                .sort((a, b) => b.sentiment.byAgeGroup['Gen Z'] - a.sentiment.byAgeGroup['Gen Z'])
                .slice(0, 3)
                .map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-2">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>Most popular with Gen Z</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {Object.entries(item.sentiment.byAgeGroup).map(([group, score]) => (
                          <div key={group} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{group}</span>
                              <span className="font-medium">{Math.round(score * 100)}%</span>
                            </div>
                            <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${score * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-2">
                          <p className="text-sm font-medium">Common keywords:</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.sentiment.keywords.map(keyword => (
                              <span key={keyword} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MenuAnalytics;
